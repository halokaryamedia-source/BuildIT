[CmdletBinding()]
param(
  [string]$Asset,
  [switch]$InstallCodexConfig,
  [switch]$SkipProcessCheck
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$profile = Get-Content -Raw (Join-Path $repoRoot "engines\codex\connection-profile.json") | ConvertFrom-Json
$workspaceIndexPath = Join-Path $repoRoot "workspace\workspace.json"
if (-not $Asset -and (Test-Path $workspaceIndexPath)) {
  $workspaceIndex = Get-Content -Raw $workspaceIndexPath | ConvertFrom-Json
  $Asset = [string]$workspaceIndex.selected_asset_id
}
if (-not $Asset) {
  throw "No active workspace project is selected. Run 'cd mcp-blockbench; bun run workspace -- activate <asset_id>'."
}

$activeRoot = Join-Path $repoRoot "workspace\active\$Asset"
$mcpRoot = Join-Path $activeRoot "mcp"
$blockbenchRoot = Join-Path $activeRoot "blockbench"
$statePath = Join-Path $mcpRoot "state.json"
$projectMetadataPath = Join-Path $mcpRoot "project.json"
if (-not (Test-Path $statePath)) { throw "Active state file not found: $statePath" }
if (-not (Test-Path $projectMetadataPath)) { throw "Active project metadata not found: $projectMetadataPath" }
$projectMetadata = Get-Content -Raw $projectMetadataPath | ConvertFrom-Json

$url = [string]$profile.canonical_url
$key = [string]$profile.codex.server_key
$pluginOutput = Join-Path $repoRoot ([string]$profile.blockbench.plugin_output)
$checkedAt = (Get-Date).ToUniversalTime().ToString("o")
$blockers = [System.Collections.Generic.List[string]]::new()

function CodexConfigPath {
  if ($env:CODEX_HOME) { return Join-Path $env:CODEX_HOME "config.toml" }
  return Join-Path (Join-Path $HOME ".codex") "config.toml"
}

function EnsureCodexConfig([string]$Path) {
  $dir = Split-Path -Parent $Path
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
  $content = if (Test-Path $Path) { Get-Content -Raw $Path } else { "" }
  $content = [regex]::Replace($content, '(?ms)^\[mcp_servers\.blockbench[^\]]*\]\s*.*?(?=^\[|\z)', '')
  $section = "[mcp_servers.$key]`nurl = `"$url`"`nenabled = true`nrequired = false`nstartup_timeout_sec = 30`ntool_timeout_sec = 300"
  Set-Content -Path $Path -Value (($content.TrimEnd() + "`n`n" + $section).Trim() + "`n") -Encoding utf8
}

function McpPost([hashtable]$Body, [string]$SessionId) {
  $headers = @{ Accept = "application/json, text/event-stream"; "Content-Type" = "application/json" }
  if ($SessionId) { $headers["mcp-session-id"] = $SessionId }
  return Invoke-WebRequest -Uri $url -Method Post -Headers $headers -Body ($Body | ConvertTo-Json -Depth 30 -Compress) -TimeoutSec 20 -UseBasicParsing
}

if (-not (Test-Path $pluginOutput)) {
  $blockers.Add("Compiled MCP plugin is missing: $pluginOutput. Run Bun commands from mcp-blockbench and reload this exact file in Blockbench.")
}

$configPath = CodexConfigPath
$changed = $false
if ($InstallCodexConfig) {
  $before = if (Test-Path $configPath) { Get-Content -Raw $configPath } else { "" }
  EnsureCodexConfig $configPath
  $after = Get-Content -Raw $configPath
  $changed = $before -ne $after
}
if (-not (Test-Path $configPath) -or -not (Select-String -Path $configPath -SimpleMatch "[mcp_servers.$key]" -Quiet)) {
  $blockers.Add("Codex config is missing mcp_servers.$key.")
}

if (-not $SkipProcessCheck) {
  $windows = @(Get-Process -Name $profile.blockbench.process_name -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 })
  if ($windows.Count -ne 1) { $blockers.Add("Exactly one visible Blockbench window is required; found $($windows.Count).") }
}

$sessionId = $null
$toolNames = @()
$runtime = $null
try {
  $init = $null
  $lastInitError = $null
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    try {
      $init = McpPost @{ jsonrpc = "2.0"; id = 1; method = "initialize"; params = @{ protocolVersion = "2024-11-05"; capabilities = @{}; clientInfo = @{ name = "buildit-readiness"; version = "1" } } } $null
      break
    } catch {
      $lastInitError = $_.Exception.Message
      if ($attempt -lt 3) { Start-Sleep -Seconds 2 }
    }
  }
  if (-not $init) { throw "MCP initialize failed after 3 attempts: $lastInitError" }
  $sessionId = [string]$init.Headers["mcp-session-id"]
  if (-not $sessionId) { throw "MCP initialize returned no session ID." }
  $null = McpPost @{ jsonrpc = "2.0"; method = "notifications/initialized"; params = @{} } $sessionId
  $list = McpPost @{ jsonrpc = "2.0"; id = 2; method = "tools/list"; params = @{} } $sessionId
  $payload = ([string]$list.Content | ConvertFrom-Json)
  $toolNames = @($payload.result.tools | ForEach-Object { [string]$_.name })
  foreach ($required in $profile.required_common_tools) {
    if ($required -notin $toolNames) { $blockers.Add("Missing MCP tool: $required") }
  }
  if ("get_runtime_status" -in $toolNames) {
    $status = McpPost @{ jsonrpc = "2.0"; id = 3; method = "tools/call"; params = @{ name = "get_runtime_status"; arguments = @{} } } $sessionId
    $runtime = ([string]$status.Content | ConvertFrom-Json).result.structuredContent
    if ($runtime.status -ne "PASS") { $blockers.Add("Runtime status is not PASS.") }
    $expectedUuid = [string]$projectMetadata.project.uuid
    if ($expectedUuid -and $runtime.project.uuid -ne $expectedUuid) {
      $blockers.Add("Active Blockbench project UUID $($runtime.project.uuid) does not match workspace project UUID $expectedUuid.")
    }
  }
} catch {
  $blockers.Add($_.Exception.Message)
} finally {
  if ($sessionId) {
    try { Invoke-WebRequest -Uri $url -Method Delete -Headers @{ Accept = "application/json"; "mcp-session-id" = $sessionId } -TimeoutSec 5 -UseBasicParsing | Out-Null } catch {}
  }
}

$result = if ($blockers.Count) { "BLOCKER" } elseif ($changed) { "RESTART_REQUIRED" } else { "PASS" }
$report = [ordered]@{
  schema_version = "1.0"
  checked_at = $checkedAt
  result = $result
  asset_id = $Asset
  active_root = $activeRoot
  blockbench_root = $blockbenchRoot
  mcp_root = $mcpRoot
  model_path = Join-Path $blockbenchRoot "$Asset.bbmodel"
  canonical_url = $url
  plugin_output = $pluginOutput
  plugin_output_exists = Test-Path $pluginOutput
  codex_config = $configPath
  config_changed = $changed
  exposed_tool_count = $toolNames.Count
  runtime = $runtime
  blockers = @($blockers)
}

$reportDir = Join-Path $mcpRoot "reports"
New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
$reportPath = Join-Path $reportDir "connection.json"
$report | ConvertTo-Json -Depth 30 | Set-Content $reportPath -Encoding utf8

$state = Get-Content -Raw $statePath | ConvertFrom-Json
$state.mcp.connection_status = $result
$state.mcp.connection_report = "workspace/active/$Asset/mcp/reports/connection.json"
if ($runtime.tool_profile) {
  $state.mcp.active_tool_profile = $runtime.tool_profile.profile_id
  $state.mcp.tool_profile_revision = $runtime.tool_profile.profile_revision
  $state.mcp.tool_profile_hash = $runtime.tool_profile.tool_profile_hash
  $state.mcp.exposed_tool_count = $runtime.tool_profile.exposed_tool_count
  $state.mcp.total_library_tool_count = $runtime.tool_profile.total_library_tool_count
}
if ($runtime.project -and $blockers.Count -eq 0) {
  $state.project.name = $runtime.project.name
  $state.project.uuid = $runtime.project.uuid
  $state.project.format = $runtime.project.format
  $state.project.uv_mode = $runtime.project.uv_mode
  $state.project.texture_width = $runtime.project.texture_width
  $state.project.texture_height = $runtime.project.texture_height

  $projectMetadata.project.uuid = $runtime.project.uuid
  $projectMetadata.project.format = $runtime.project.format
  $projectMetadata.project.uv_mode = $runtime.project.uv_mode
  $projectMetadata.project.texture_width = $runtime.project.texture_width
  $projectMetadata.project.texture_height = $runtime.project.texture_height
  $projectMetadata.updated_at = $checkedAt
  $projectMetadata | ConvertTo-Json -Depth 40 | Set-Content $projectMetadataPath -Encoding utf8
}
$state.updated_at = $checkedAt
$state.updated_by = "sync-local-stack"
$state | ConvertTo-Json -Depth 40 | Set-Content $statePath -Encoding utf8

Write-Host "Connection result: $result"
Write-Host "Asset: $Asset"
Write-Host "Blockbench files: $blockbenchRoot"
Write-Host "MCP files: $mcpRoot"
Write-Host "Report: $reportPath"
if ($result -eq "PASS") { exit 0 }
exit 1
