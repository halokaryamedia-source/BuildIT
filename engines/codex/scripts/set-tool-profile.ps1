[CmdletBinding()]
param(
  [string]$Asset,
  [string]$Profile
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$workspaceIndexPath = Join-Path $repoRoot "workspace\workspace.json"
if (-not $Asset -and (Test-Path $workspaceIndexPath)) {
  $workspaceIndex = Get-Content -Raw $workspaceIndexPath | ConvertFrom-Json
  $Asset = [string]$workspaceIndex.selected_asset_id
}
if (-not $Asset) {
  throw "No active workspace project is selected. Run 'cd mcp-blockbench; bun run workspace -- activate <asset_id>'."
}

$connection = Get-Content -Raw (Join-Path $repoRoot "engines\codex\connection-profile.json") | ConvertFrom-Json
$stages = Get-Content -Raw (Join-Path $repoRoot "engines\shared\profiles\stage-profiles.json") | ConvertFrom-Json
$profiles = Get-Content -Raw (Join-Path $repoRoot "engines\shared\profiles\tool-profiles.json") | ConvertFrom-Json
$sessionRoot = Join-Path $repoRoot "workspace\active\$Asset\mcp"
$statePath = Join-Path $sessionRoot "state.json"
if (-not (Test-Path $statePath)) { throw "State file not found: $statePath" }
$state = Get-Content -Raw $statePath | ConvertFrom-Json
$url = [string]$connection.canonical_url

if (-not $state.project.uuid) { throw "state.project.uuid is required before profile activation." }
if (-not $Profile) {
  $stage = [string]$state.workflow.active_stage
  $Profile = [string]$stages.profiles.$stage.tool_profile_id
}
if (-not $profiles.profiles.$Profile) { throw "Unknown profile: $Profile" }

function Post([hashtable]$Body, [string]$SessionId) {
  $headers = @{ Accept = "application/json, text/event-stream"; "Content-Type" = "application/json" }
  if ($SessionId) { $headers["mcp-session-id"] = $SessionId }
  Invoke-WebRequest -Uri $url -Method Post -Headers $headers -Body ($Body | ConvertTo-Json -Depth 30 -Compress) -TimeoutSec 10 -UseBasicParsing
}

$sessionId = $null
try {
  $init = Post @{ jsonrpc = "2.0"; id = 1; method = "initialize"; params = @{ protocolVersion = "2024-11-05"; capabilities = @{}; clientInfo = @{ name = "buildit-profile-sync"; version = "1" } } } $null
  $sessionId = [string]$init.Headers["mcp-session-id"]
  $null = Post @{ jsonrpc = "2.0"; method = "notifications/initialized"; params = @{} } $sessionId

  $lease = Post @{ jsonrpc = "2.0"; id = 2; method = "tools/call"; params = @{ name = "manage_project_write_lease"; arguments = @{
    action = "acquire"
    asset_id = $Asset
    session_root = $sessionRoot
    expected_project_uuid = [string]$state.project.uuid
    expected_state_revision = [int]$state.state_revision
    expected_stage = [string]$state.workflow.active_stage
  } } } $sessionId
  $leaseResult = ([string]$lease.Content | ConvertFrom-Json).result.structuredContent
  if ($leaseResult.status -ne "PASS") { throw "Write lease acquisition failed." }

  $activate = Post @{ jsonrpc = "2.0"; id = 3; method = "tools/call"; params = @{ name = "activate_tool_profile"; arguments = @{ profile_id = $Profile } } } $sessionId
  $result = ([string]$activate.Content | ConvertFrom-Json).result.structuredContent
  if ($result.status -ne "PASS") { throw "Profile activation failed." }

  $state.mcp.active_tool_profile = $result.active_profile
  $state.mcp.tool_profile_hash = $result.tool_profile_hash
  $state.mcp.exposed_tool_count = $result.exposed_tool_count
  $state.mcp.total_library_tool_count = $result.total_library_tool_count
  $state.mcp.profile_reconnect_required = [bool]$result.reconnect_required
  $state.updated_at = (Get-Date).ToUniversalTime().ToString("o")
  $state.updated_by = "set-tool-profile"
  $state | ConvertTo-Json -Depth 40 | Set-Content $statePath -Encoding utf8

  $reportDir = Join-Path $sessionRoot "reports"
  New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
  $result | ConvertTo-Json -Depth 20 | Set-Content (Join-Path $reportDir "tool-profile.json") -Encoding utf8
  Write-Host "Asset: $Asset"
  Write-Host "Active profile: $($result.active_profile)"
  Write-Host "Reconnect required: $($result.reconnect_required)"
} finally {
  if ($sessionId) {
    try { Invoke-WebRequest -Uri $url -Method Delete -Headers @{ Accept = "application/json"; "mcp-session-id" = $sessionId } -TimeoutSec 5 -UseBasicParsing | Out-Null } catch {}
  }
}
