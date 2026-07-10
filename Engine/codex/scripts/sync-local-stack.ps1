[CmdletBinding()]
param(
  [string]$Asset,
  [switch]$InstallCodexConfig,
  [switch]$SkipProcessCheck
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$profile = Get-Content -Raw -Path (Join-Path $repoRoot "Engine\codex\connection-profile.json") | ConvertFrom-Json
$canonicalUrl = [string]$profile.canonical_url
$serverKey = [string]$profile.codex.server_key
$requiredTools = @($profile.required_common_tools)
$checkedAt = (Get-Date).ToUniversalTime().ToString("o")
$blockers = [System.Collections.Generic.List[object]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

function Add-Blocker {
  param([string]$Code, [string]$Message, [string]$SafeAction)
  $blockers.Add([pscustomobject]@{
    code = $Code
    message = $Message
    safe_action = $SafeAction
  })
}

function ConvertFrom-McpPayload {
  param([AllowEmptyString()][string]$Content)
  if ([string]::IsNullOrWhiteSpace($Content)) { return $null }
  $trimmed = $Content.Trim()
  if ($trimmed.StartsWith("{")) { return $trimmed | ConvertFrom-Json }

  $dataLines = @(
    $Content -split "`r?`n" |
      Where-Object { $_.TrimStart().StartsWith("data:") } |
      ForEach-Object { $_.Substring($_.IndexOf("data:") + 5).Trim() }
  )
  for ($index = $dataLines.Count - 1; $index -ge 0; $index--) {
    try { return $dataLines[$index] | ConvertFrom-Json } catch { continue }
  }
  throw "MCP response was neither JSON nor parseable SSE data."
}

function Invoke-McpPost {
  param([hashtable]$Body, [string]$SessionId)
  $headers = @{
    Accept = "application/json, text/event-stream"
    "Content-Type" = "application/json"
  }
  if ($SessionId) { $headers["mcp-session-id"] = $SessionId }
  $request = @{
    Uri = $canonicalUrl
    Method = "Post"
    Headers = $headers
    Body = ($Body | ConvertTo-Json -Depth 30 -Compress)
    TimeoutSec = 10
    UseBasicParsing = $true
  }
  $response = Invoke-WebRequest @request
  [pscustomobject]@{
    Response = $response
    Payload = ConvertFrom-McpPayload -Content ([string]$response.Content)
  }
}

function Get-CodexConfigPath {
  if ($env:CODEX_HOME) { return Join-Path $env:CODEX_HOME "config.toml" }
  Join-Path (Join-Path $HOME ".codex") "config.toml"
}

function Get-CodexSectionPattern {
  param([string]$Key)
  $header = [regex]::Escape("[mcp_servers.$Key]")
  "(?m)^$header\s*(?:\r?\n(?:(?!^\[)[^\r\n]*))*"
}

function Get-BlockbenchServerKeys {
  param([string]$Content)
  if ([string]::IsNullOrWhiteSpace($Content)) { return @() }
  @(
    [regex]::Matches(
      $Content,
      "(?m)^\[mcp_servers\.(blockbench[^\]]*)\]\s*$"
    ) | ForEach-Object { $_.Groups[1].Value }
  )
}

function Test-CodexSection {
  param([string]$Content)
  if ([string]::IsNullOrWhiteSpace($Content)) { return $false }
  $match = [regex]::Match($Content, (Get-CodexSectionPattern -Key $serverKey))
  if (-not $match.Success) { return $false }
  $url = [regex]::Escape($canonicalUrl)
  [regex]::IsMatch(
    $match.Value,
    "(?m)^\s*url\s*=\s*[`"']$url[`"']\s*$"
  )
}

function Set-CodexSection {
  param([string]$Path)
  $directory = Split-Path -Parent $Path
  New-Item -ItemType Directory -Path $directory -Force | Out-Null
  $content = if (Test-Path $Path) { Get-Content -Raw -Path $Path } else { "" }

  foreach ($key in (Get-BlockbenchServerKeys -Content $content)) {
    $content = [regex]::Replace(
      $content,
      (Get-CodexSectionPattern -Key $key),
      ""
    )
  }

  $cleaned = $content.TrimEnd()
  $section = "[mcp_servers.$serverKey]`nurl = `"$canonicalUrl`""
  $newContent = if ($cleaned) { "$cleaned`n`n$section`n" } else { "$section`n" }
  Set-Content -Path $Path -Value $newContent -Encoding utf8
}

function Normalize-LocalUrl {
  param([string]$Value)
  if ([string]::IsNullOrWhiteSpace($Value)) { return $null }
  try {
    $uri = [uri]$Value
    $hostName = if ($uri.Host -eq "127.0.0.1") { "localhost" } else { $uri.Host }
    $path = $uri.AbsolutePath.TrimEnd("/")
    if (-not $path) { $path = "/" }
    $port = if ($uri.IsDefaultPort) { "" } else { ":$($uri.Port)" }
    "$($uri.Scheme)://$hostName$port$path"
  } catch {
    $Value.TrimEnd("/")
  }
}

function Set-ObjectProperty {
  param([object]$Object, [string]$Name, [object]$Value)
  if ($Object.PSObject.Properties.Name -contains $Name) {
    $Object.$Name = $Value
  } else {
    $Object | Add-Member -NotePropertyName $Name -NotePropertyValue $Value
  }
}

# 1. Codex configuration
$codexConfigPath = Get-CodexConfigPath
$before = if (Test-Path $codexConfigPath) { Get-Content -Raw -Path $codexConfigPath } else { "" }
$codexMatchedBefore = Test-CodexSection -Content $before
$oldBlockbenchKeysBefore = @(Get-BlockbenchServerKeys -Content $before | Where-Object { $_ -ne $serverKey })
$codexChanged = $false

if ($InstallCodexConfig -and (-not $codexMatchedBefore -or $oldBlockbenchKeysBefore.Count -gt 0)) {
  Set-CodexSection -Path $codexConfigPath
  $codexChanged = $true
}

$after = if (Test-Path $codexConfigPath) { Get-Content -Raw -Path $codexConfigPath } else { "" }
$codexMatched = Test-CodexSection -Content $after
$oldBlockbenchKeysAfter = @(Get-BlockbenchServerKeys -Content $after | Where-Object { $_ -ne $serverKey })

if (-not $codexMatched) {
  Add-Blocker "CODEX_CONFIG_MISSING" "Codex does not contain mcp_servers.$serverKey with the canonical URL." "Run this script with -InstallCodexConfig, then restart Codex once."
}
if ($oldBlockbenchKeysAfter.Count -gt 0) {
  Add-Blocker "DUPLICATE_CODEX_BLOCKBENCH_ENTRIES" ("Extra Blockbench MCP keys remain: " + ($oldBlockbenchKeysAfter -join ", ")) "Run this script with -InstallCodexConfig to keep only mcp_servers.blockbench."
}

# 2. One visible Blockbench application instance. Electron child processes are ignored.
$blockbenchProcesses = @()
$blockbenchWindows = @()
if (-not $SkipProcessCheck) {
  $blockbenchProcesses = @(Get-Process -Name ([string]$profile.blockbench.process_name) -ErrorAction SilentlyContinue)
  $blockbenchWindows = @(
    $blockbenchProcesses | Where-Object {
      $_.MainWindowHandle -ne 0 -or -not [string]::IsNullOrWhiteSpace($_.MainWindowTitle)
    }
  )
  if ($blockbenchWindows.Count -eq 0) {
    Add-Blocker "BLOCKBENCH_NOT_RUNNING" "No visible Blockbench application window is running." "Launch one Blockbench window, load the MCP plugin, and open the intended project."
  } elseif ($blockbenchWindows.Count -gt 1) {
    Add-Blocker "MULTIPLE_BLOCKBENCH_INSTANCES" "More than one Blockbench application window is open." "Keep only the intended Blockbench project window open."
  }
}

# 3. Temporary read-only MCP smoke session
$endpointReachable = $false
$handshakeSucceeded = $false
$smokeSessionId = $null
$smokeSessionClosed = $false
$postCleanupSessionCount = $null
$toolNames = @()
$missingTools = @()
$runtimeStatus = $null

try {
  $uri = [uri]$canonicalUrl
  $tcp = New-Object System.Net.Sockets.TcpClient
  try {
    $connect = $tcp.ConnectAsync($uri.Host, $uri.Port)
    if (-not $connect.Wait(3000)) { throw "TCP connection timed out." }
    $endpointReachable = $tcp.Connected
  } finally {
    $tcp.Dispose()
  }
  if (-not $endpointReachable) { throw "Canonical endpoint port is not reachable." }

  $initialize = Invoke-McpPost -Body @{
    jsonrpc = "2.0"
    id = 1
    method = "initialize"
    params = @{
      protocolVersion = "2024-11-05"
      capabilities = @{}
      clientInfo = @{ name = "buildit-readiness-smoke"; version = "1.0" }
    }
  }
  $smokeSessionId = [string]$initialize.Response.Headers["mcp-session-id"]
  if (-not $smokeSessionId) { throw "MCP initialize did not return mcp-session-id." }
  if ($initialize.Payload -and $initialize.Payload.error) {
    throw "MCP initialize error: $($initialize.Payload.error.message)"
  }
  $handshakeSucceeded = $true

  $null = Invoke-McpPost -SessionId $smokeSessionId -Body @{
    jsonrpc = "2.0"
    method = "notifications/initialized"
    params = @{}
  }

  $toolList = Invoke-McpPost -SessionId $smokeSessionId -Body @{
    jsonrpc = "2.0"
    id = 2
    method = "tools/list"
    params = @{}
  }
  if ($toolList.Payload.error) { throw "tools/list error: $($toolList.Payload.error.message)" }
  $toolNames = @($toolList.Payload.result.tools | ForEach-Object { [string]$_.name })
  $missingTools = @($requiredTools | Where-Object { $_ -notin $toolNames })
  if ($missingTools.Count -gt 0) {
    Add-Blocker "MCP_CAPABILITY_MISMATCH" ("Missing required tools: " + ($missingTools -join ", ")) "Build and reload the Rework MCP plugin; do not substitute risky tools."
  }

  if ("get_runtime_status" -in $toolNames) {
    $runtime = Invoke-McpPost -SessionId $smokeSessionId -Body @{
      jsonrpc = "2.0"
      id = 3
      method = "tools/call"
      params = @{ name = "get_runtime_status"; arguments = @{} }
    }
    if (-not $runtime.Payload.error) {
      $runtimeStatus = $runtime.Payload.result.structuredContent
    }
  }
} catch {
  Add-Blocker "MCP_ENDPOINT_UNAVAILABLE" $_.Exception.Message "Verify one Blockbench window, the Rework MCP plugin, and the canonical endpoint."
} finally {
  if ($smokeSessionId) {
    try {
      $deleteRequest = @{
        Uri = $canonicalUrl
        Method = "Delete"
        Headers = @{
          Accept = "application/json, text/event-stream"
          "mcp-session-id" = $smokeSessionId
        }
        TimeoutSec = 5
        UseBasicParsing = $true
      }
      $null = Invoke-WebRequest @deleteRequest
      $smokeSessionClosed = $true
    } catch {
      $warnings.Add("Temporary smoke session could not be closed explicitly; server timeout must remove it.")
    }
  }

  if ($endpointReachable) {
    try {
      $health = Invoke-WebRequest -Uri "$canonicalUrl/health" -Method Get -TimeoutSec 5 -UseBasicParsing
      $healthPayload = [string]$health.Content | ConvertFrom-Json
      $postCleanupSessionCount = [int]$healthPayload.sessions.active
      if ($postCleanupSessionCount -gt 1) {
        Add-Blocker "MULTIPLE_MCP_WRITE_SESSIONS" "$postCleanupSessionCount sessions remain after readiness cleanup." "Close stale MCP clients so at most one Codex write session remains."
      }
    } catch {
      $warnings.Add("Post-cleanup health check was unavailable.")
    }
  }
}

if ($runtimeStatus) {
  if ((Normalize-LocalUrl ([string]$runtimeStatus.server.url)) -ne (Normalize-LocalUrl $canonicalUrl)) {
    Add-Blocker "CONNECTION_CONTRACT_MISMATCH" "The plugin reports $($runtimeStatus.server.url), expected $canonicalUrl." "Reload the Rework plugin and remove the process occupying port 3000."
  }
  if (-not $runtimeStatus.contract.auto_port_disabled) {
    Add-Blocker "AUTO_PORT_ENABLED" "Effective MCP auto-port/fallback behavior is enabled." "Reload the Rework plugin; canonical runtime must disable auto-port."
  }
  if (-not $runtimeStatus.project -or -not $runtimeStatus.project.uuid) {
    Add-Blocker "NO_ACTIVE_PROJECT" "The MCP plugin has no active Blockbench project." "Open or create the intended project before stage work."
  }
}

if ($blockers.Count -gt 0) {
  $result = "BLOCKER"
} elseif ($codexChanged) {
  $result = "RESTART_REQUIRED"
  $warnings.Add("Codex configuration changed; restart Codex once.")
} else {
  $result = "PASS"
}

$report = [ordered]@{
  schema_version = "1.0"
  checked_at = $checkedAt
  result = $result
  connection = [ordered]@{
    server_key = $serverKey
    transport = [string]$profile.transport
    canonical_url = $canonicalUrl
    endpoint_reachable = $endpointReachable
    handshake_succeeded = $handshakeSucceeded
    smoke_session_closed = $smokeSessionClosed
    post_cleanup_session_count = $postCleanupSessionCount
  }
  codex = [ordered]@{
    config_path = $codexConfigPath
    config_matched_before = $codexMatchedBefore
    old_blockbench_keys_before = $oldBlockbenchKeysBefore
    config_changed = $codexChanged
    config_matched = $codexMatched
    old_blockbench_keys_after = $oldBlockbenchKeysAfter
    restart_required = $codexChanged
  }
  blockbench = [ordered]@{
    raw_process_count = $blockbenchProcesses.Count
    visible_window_count = $blockbenchWindows.Count
    visible_windows = @($blockbenchWindows | ForEach-Object {
      [ordered]@{ id = $_.Id; title = $_.MainWindowTitle }
    })
  }
  capabilities = [ordered]@{
    tool_count = $toolNames.Count
    required_common_tools = $requiredTools
    missing_tools = $missingTools
  }
  runtime = $runtimeStatus
  blockers = @($blockers)
  warnings = @($warnings)
  next_action = if ($result -eq "PASS") {
    "Continue with the active asset preflight through the canonical blockbench MCP connection."
  } elseif ($result -eq "RESTART_REQUIRED") {
    "Restart Codex once, then rerun this command without -InstallCodexConfig."
  } elseif ($blockers.Count -gt 0) {
    $blockers[0].safe_action
  } else {
    "Review the connection report."
  }
}

$reportPath = if ($Asset) {
  $reportsRoot = Join-Path $repoRoot ("SavedData\sessions\" + $Asset + "\reports")
  New-Item -ItemType Directory -Path $reportsRoot -Force | Out-Null
  Join-Path $reportsRoot "connection.json"
} else {
  $cacheRoot = Join-Path $repoRoot "SavedData\cache"
  New-Item -ItemType Directory -Path $cacheRoot -Force | Out-Null
  Join-Path $cacheRoot "connection.json"
}
$report | ConvertTo-Json -Depth 40 | Set-Content -Path $reportPath -Encoding utf8

if ($Asset) {
  $statePath = Join-Path $repoRoot ("SavedData\sessions\" + $Asset + "\state.json")
  if (Test-Path $statePath) {
    $state = Get-Content -Raw -Path $statePath | ConvertFrom-Json
    Set-ObjectProperty $state.mcp "server_key" $serverKey
    Set-ObjectProperty $state.mcp "canonical_url" $canonicalUrl
    Set-ObjectProperty $state.mcp "resolved_url" $(if ($runtimeStatus) { $runtimeStatus.server.url } else { $null })
    Set-ObjectProperty $state.mcp "connection_status" $result
    Set-ObjectProperty $state.mcp "capability_status" $(if ($missingTools.Count -eq 0) { "PASS" } else { "BLOCKER" })
    Set-ObjectProperty $state.mcp "required_tools_missing" $missingTools
    Set-ObjectProperty $state.mcp "connection_report" ("SavedData/sessions/" + $Asset + "/reports/connection.json")
    $state.mcp.last_verified_at = $checkedAt
    if ($runtimeStatus -and $runtimeStatus.project) {
      $state.project.name = $runtimeStatus.project.name
      $state.project.uuid = $runtimeStatus.project.uuid
      $state.project.format = $runtimeStatus.project.format
      $state.project.uv_mode = $runtimeStatus.project.uv_mode
      $state.project.texture_width = $runtimeStatus.project.texture_width
      $state.project.texture_height = $runtimeStatus.project.texture_height
    }
    $state.updated_at = $checkedAt
    $state.updated_by = "sync-local-stack"
    $state | ConvertTo-Json -Depth 40 | Set-Content -Path $statePath -Encoding utf8
  }
}

Write-Host "Connection result: $result"
Write-Host "Canonical MCP: $canonicalUrl"
Write-Host "Codex server key: $serverKey"
Write-Host "Report: $reportPath"
Write-Host "Next action: $($report.next_action)"

if ($result -eq "PASS") { exit 0 }
exit 1
