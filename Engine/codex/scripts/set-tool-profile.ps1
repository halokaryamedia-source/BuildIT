[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$Asset,

  [string]$Profile
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$connectionProfilePath = Join-Path $repoRoot "Engine\codex\connection-profile.json"
$toolProfilesPath = Join-Path $repoRoot "Engine\codex\tool-profiles.json"
$stageProfilesPath = Join-Path $repoRoot "Engine\codex\stage-profiles.json"
$statePath = Join-Path $repoRoot ("SavedData\sessions\" + $Asset + "\state.json")
$reportRoot = Join-Path $repoRoot ("SavedData\sessions\" + $Asset + "\reports")
$reportPath = Join-Path $reportRoot "tool-profile.json"

if (-not (Test-Path $statePath)) {
  throw "State file not found: $statePath"
}

$connectionProfile = Get-Content -Raw -Path $connectionProfilePath | ConvertFrom-Json
$toolProfiles = Get-Content -Raw -Path $toolProfilesPath | ConvertFrom-Json
$stageProfiles = Get-Content -Raw -Path $stageProfilesPath | ConvertFrom-Json
$state = Get-Content -Raw -Path $statePath | ConvertFrom-Json
$canonicalUrl = [string]$connectionProfile.canonical_url
$checkedAt = (Get-Date).ToUniversalTime().ToString("o")

function ConvertFrom-McpPayload {
  param([Parameter(Mandatory = $true)][string]$Content)

  $trimmed = $Content.Trim()
  if ($trimmed.StartsWith("{")) {
    return $trimmed | ConvertFrom-Json
  }

  $dataLines = @(
    $Content -split "`r?`n" |
      Where-Object { $_.TrimStart().StartsWith("data:") } |
      ForEach-Object { $_.Substring($_.IndexOf("data:") + 5).Trim() }
  )

  for ($index = $dataLines.Count - 1; $index -ge 0; $index--) {
    try {
      return $dataLines[$index] | ConvertFrom-Json
    } catch {
      continue
    }
  }

  throw "MCP response was neither JSON nor parseable SSE data."
}

function Invoke-McpPost {
  param(
    [Parameter(Mandatory = $true)][hashtable]$Body,
    [string]$SessionId
  )

  $headers = @{
    Accept = "application/json, text/event-stream"
    "Content-Type" = "application/json"
  }
  if ($SessionId) {
    $headers["mcp-session-id"] = $SessionId
  }

  $response = Invoke-WebRequest `
    -Uri $canonicalUrl `
    -Method Post `
    -Headers $headers `
    -Body ($Body | ConvertTo-Json -Depth 30 -Compress) `
    -TimeoutSec 10 `
    -UseBasicParsing

  return [pscustomobject]@{
    Response = $response
    Payload = ConvertFrom-McpPayload -Content ([string]$response.Content)
  }
}

function Resolve-ProfileFromState {
  param($RuntimeState)

  $stage = [string]$RuntimeState.workflow.active_stage
  $workflowState = [string]$RuntimeState.workflow.state
  $stageProfile = $stageProfiles.profiles.$stage
  if (-not $stageProfile) {
    throw "No stage profile exists for active stage $stage."
  }

  if ($workflowState.EndsWith("_REVISION") -and $stageProfile.repair_tool_profile_id) {
    return [string]$stageProfile.repair_tool_profile_id
  }

  return [string]$stageProfile.tool_profile_id
}

$targetProfile = if ($Profile) { $Profile } else { Resolve-ProfileFromState -RuntimeState $state }
$profileDefinition = $toolProfiles.profiles.$targetProfile
if (-not $profileDefinition) {
  throw "Unknown tool profile '$targetProfile'."
}

$sessionId = $null
$closed = $false
$activationResult = $null
$profileResult = $null
$result = "BLOCKER"
$blocker = $null

try {
  $initialize = Invoke-McpPost -Body @{
    jsonrpc = "2.0"
    id = 1
    method = "initialize"
    params = @{
      protocolVersion = "2024-11-05"
      capabilities = @{}
      clientInfo = @{
        name = "buildit-tool-profile-sync"
        version = "1.0"
      }
    }
  }

  $sessionId = [string]$initialize.Response.Headers["mcp-session-id"]
  if (-not $sessionId) {
    throw "MCP initialize did not return mcp-session-id."
  }
  if ($initialize.Payload.error) {
    throw "MCP initialize error: $($initialize.Payload.error.message)"
  }

  $null = Invoke-McpPost -SessionId $sessionId -Body @{
    jsonrpc = "2.0"
    method = "notifications/initialized"
    params = @{}
  }

  $toolList = Invoke-McpPost -SessionId $sessionId -Body @{
    jsonrpc = "2.0"
    id = 2
    method = "tools/list"
    params = @{}
  }
  $toolNames = @($toolList.Payload.result.tools | ForEach-Object { [string]$_.name })
  foreach ($required in @("activate_tool_profile", "get_tool_profile")) {
    if ($required -notin $toolNames) {
      throw "Required profile control tool is missing: $required"
    }
  }

  $activate = Invoke-McpPost -SessionId $sessionId -Body @{
    jsonrpc = "2.0"
    id = 3
    method = "tools/call"
    params = @{
      name = "activate_tool_profile"
      arguments = @{
        profile_id = $targetProfile
      }
    }
  }
  if ($activate.Payload.error) {
    throw "activate_tool_profile error: $($activate.Payload.error.message)"
  }
  $activationResult = $activate.Payload.result.structuredContent

  $profile = Invoke-McpPost -SessionId $sessionId -Body @{
    jsonrpc = "2.0"
    id = 4
    method = "tools/call"
    params = @{
      name = "get_tool_profile"
      arguments = @{
        include_tools = $false
      }
    }
  }
  if ($profile.Payload.error) {
    throw "get_tool_profile error: $($profile.Payload.error.message)"
  }
  $profileResult = $profile.Payload.result.structuredContent

  if ([string]$profileResult.profile_id -ne $targetProfile) {
    throw "Runtime profile mismatch: expected $targetProfile, received $($profileResult.profile_id)."
  }
  if ([string]$profileResult.status -ne "PASS") {
    throw "Tool profile validation did not pass."
  }

  $result = "PASS"
} catch {
  $blocker = $_.Exception.Message
} finally {
  if ($sessionId) {
    try {
      $deleteHeaders = @{
        Accept = "application/json, text/event-stream"
        "mcp-session-id" = $sessionId
      }
      $null = Invoke-WebRequest `
        -Uri $canonicalUrl `
        -Method Delete `
        -Headers $deleteHeaders `
        -TimeoutSec 5 `
        -UseBasicParsing
      $closed = $true
    } catch {
      $closed = $false
    }
  }
}

New-Item -ItemType Directory -Path $reportRoot -Force | Out-Null
$report = [ordered]@{
  schema_version = "1.0"
  checked_at = $checkedAt
  result = $result
  asset = $Asset
  requested_profile = $targetProfile
  activation = $activationResult
  runtime_profile = $profileResult
  transient_session_closed = $closed
  blocker = $blocker
  next_action = if ($result -eq "PASS" -and $activationResult.changed) {
    "Reconnect the existing canonical blockbench MCP entry once, then call get_runtime_status."
  } elseif ($result -eq "PASS") {
    "Continue with the active stage; the requested profile was already active."
  } else {
    "Resolve the blocker without creating another MCP server key or scanning another port."
  }
}
$report | ConvertTo-Json -Depth 30 | Set-Content -Path $reportPath -Encoding utf8

if ($result -eq "PASS") {
  $state.mcp.active_tool_profile = [string]$profileResult.profile_id
  $state.mcp.tool_profile_revision = $profileResult.profile_revision
  $state.mcp.tool_profile_hash = [string]$profileResult.tool_profile_hash
  $state.mcp.exposed_tool_count = $profileResult.exposed_tool_count
  $state.mcp.total_library_tool_count = $profileResult.total_library_tool_count
  $state.mcp.profile_reconnect_required = [bool]$activationResult.reconnect_required
  $state.updated_at = $checkedAt
  $state.updated_by = "set-tool-profile"
  $state | ConvertTo-Json -Depth 40 | Set-Content -Path $statePath -Encoding utf8
}

Write-Host "Tool profile result: $result"
Write-Host "Requested profile: $targetProfile"
Write-Host "Report: $reportPath"
Write-Host "Next action: $($report.next_action)"

if ($result -eq "PASS") { exit 0 }
exit 1
