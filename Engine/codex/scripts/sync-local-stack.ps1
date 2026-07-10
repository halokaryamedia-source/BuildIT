[CmdletBinding()]
param(
  [string]$Asset,
  [switch]$InstallCodexConfig,
  [switch]$SkipProcessCheck
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$profilePath = Join-Path $repoRoot "Engine\codex\connection-profile.json"
$profile = Get-Content -Raw -Path $profilePath | ConvertFrom-Json
$canonicalUrl = [string]$profile.canonical_url
$serverKey = [string]$profile.codex.server_key
$requiredTools = @($profile.required_common_tools)
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

  $response = Invoke-WebRequest \
    -Uri $canonicalUrl \
    -Method Post \
    -Headers $headers \
    -Body ($Body | ConvertTo-Json -Depth 30 -Compress) \
    -TimeoutSec 10 \
    -UseBasicParsing

  return [pscustomobject]@{
    Response = $response
    Payload = ConvertFrom-McpPayload -Content ([string]$response.Content)
  }
}

function Get-CodexConfigPath {
  if ($env:CODEX_HOME) {
    return Join-Path $env:CODEX_HOME "config.toml"
  }
  return Join-Path (Join-Path $HOME ".codex") "config.toml"
}

function Get-CanonicalCodexSection {
  param([string]$Key, [string]$Url)
  return "[mcp_servers.$Key]`nurl = `"$Url`""
}

function Test-CodexSection {
  param([string]$Content, [string]$Key, [string]$Url)

  if (-not $Content) { return $false }
  $header = [regex]::Escape("[mcp_servers.$Key]")
  $urlValue = [regex]::Escape($Url)
  $pattern = "(?ms)^$header\s*\r?\n(?:(?!^\[).*$\r?\n?)*?^\s*url\s*=\s*[`"']$urlValue[`"']\s*$"
  return [regex]::IsMatch($Content, $pattern)
}

function Set-CodexSection {
  param([string]$Path, [string]$Key, [string]$Url)

  $directory = Split-Path -Parent $Path
  New-Item -ItemType Directory -Path $directory -Force | Out-Null

  $content = if (Test-Path $Path) { Get-Content -Raw -Path $Path } else { "" }
  $headerPattern = [regex]::Escape("[mcp_servers.$Key]")
  $sectionPattern = "(?ms)^$headerPattern\s*\r?\n(?:(?!^\[).*(?:\r?\n|$))*"
  $cleaned = [regex]::Replace($content, $sectionPattern, "").TrimEnd()
  $section = Get-CanonicalCodexSection -Key $Key -Url $Url
  $newContent = if ($cleaned) { "$cleaned`n`n$section`n" } else { "$section`n" }

  Set-Content -Path $Path -Value $newContent -Encoding utf8
}

function Add-Blocker {
  param(
    [System.Collections.Generic.List[object]]$List,
    [string]$Code,
    [string]$Message,
    [string]$SafeAction
  )

  $List.Add([pscustomobject]@{
    code = $Code
    message = $Message
    safe_action = $SafeAction
  })
}

$blockers = [System.Collections.Generic.List[object]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

# Codex configuration is checked before creating a smoke session.
$codexConfigPath = Get-CodexConfigPath
$codexConfigBefore = if (Test-Path $codexConfigPath) {
  Get-Content -Raw -Path $codexConfigPath
} else {
  ""
}
$codexConfigMatchedBefore = Test-CodexSection \
  -Content $codexConfigBefore \
  -Key $serverKey \
  -Url $canonicalUrl
$codexConfigChanged = $false

if (-not $codexConfigMatchedBefore -and $InstallCodexConfig) {
  Set-CodexSection -Path $codexConfigPath -Key $serverKey -Url $canonicalUrl
  $codexConfigChanged = $true
}

$codexConfigAfter = if (Test-Path $codexConfigPath) {
  Get-Content -Raw -Path $codexConfigPath
} else {
  ""
}
$codexConfigMatched = Test-CodexSection \
  -Content $codexConfigAfter \
  -Key $serverKey \
  -Url $canonicalUrl

if (-not $codexConfigMatched) {
  Add-Blocker \
    -List $blockers \
    -Code "CODEX_CONFIG_MISSING" \
    -Message "Codex does not contain the canonical mcp_servers.$serverKey entry." \
    -SafeAction "Run this script with -InstallCodexConfig, then restart Codex once."
}

# Exactly one Blockbench process prevents project/port ambiguity.
$blockbenchProcesses = @()
if (-not $SkipProcessCheck) {
  $blockbenchProcesses = @(Get-Process -Name ([string]$profile.blockbench.process_name) -ErrorAction SilentlyContinue)
  if ($blockbenchProcesses.Count -eq 0) {
    Add-Blocker \
      -List $blockers \
      -Code "BLOCKBENCH_NOT_RUNNING" \
      -Message "No Blockbench process is running." \
      -SafeAction "Launch one Blockbench instance, load the MCP plugin, and open the intended project."
  } elseif ($blockbenchProcesses.Count -gt 1) {
    Add-Blocker \
      -List $blockers \
      -Code "MULTIPLE_BLOCKBENCH_INSTANCES" \
      -Message "More than one Blockbench process is running." \
      -SafeAction "Keep only the intended Blockbench project window open."
  }
}

$endpointReachable = $false
$handshakeSucceeded = $false
$smokeSessionId = $null
$smokeSessionClosed = $false
$toolNames = @()
$missingTools = @()
$runtimeStatus = $null

try {
  $uri = [uri]$canonicalUrl
  $tcp = New-Object System.Net.Sockets.TcpClient
  try {
    $connectTask = $tcp.ConnectAsync($uri.Host, $uri.Port)
    if (-not $connectTask.Wait(3000)) {
      throw "TCP connection timed out."
    }
    $endpointReachable = $tcp.Connected
  } finally {
    $tcp.Dispose()
  }

  if (-not $endpointReachable) {
    throw "Canonical endpoint port is not reachable."
  }

  $initialize = Invoke-McpPost -Body @{
    jsonrpc = "2.0"
    id = 1
    method = "initialize"
    params = @{
      protocolVersion = "2024-11-05"
      capabilities = @{}
      clientInfo = @{
        name = "buildit-readiness-smoke"
        version = "1.0"
      }
    }
  }

  $smokeSessionId = [string]$initialize.Response.Headers["mcp-session-id"]
  if (-not $smokeSessionId) {
    throw "MCP initialize did not return mcp-session-id."
  }
  if ($initialize.Payload.error) {
    throw "MCP initialize returned an error: $($initialize.Payload.error.message)"
  }
  $handshakeSucceeded = $true

  # Complete MCP initialization before requesting tools.
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
  if ($toolList.Payload.error) {
    throw "tools/list returned an error: $($toolList.Payload.error.message)"
  }

  $toolNames = @($toolList.Payload.result.tools | ForEach-Object { [string]$_.name })
  $missingTools = @($requiredTools | Where-Object { $_ -notin $toolNames })

  if ($missingTools.Count -gt 0) {
    Add-Blocker \
      -List $blockers \
      -Code "MCP_CAPABILITY_MISMATCH" \
      -Message ("Missing required common tools: " + ($missingTools -join ", ")) \
      -SafeAction "Build and reload the Rework MCP plugin. Do not substitute risky tools."
  }

  if ("get_runtime_status" -in $toolNames) {
    $runtime = Invoke-McpPost -SessionId $smokeSessionId -Body @{
      jsonrpc = "2.0"
      id = 3
      method = "tools/call"
      params = @{
        name = "get_runtime_status"
        arguments = @{}
      }
    }
    if (-not $runtime.Payload.error) {
      $runtimeStatus = $runtime.Payload.result.structuredContent
    }
  }
} catch {
  Add-Blocker \
    -List $blockers \
    -Code "MCP_ENDPOINT_UNAVAILABLE" \
    -Message $_.Exception.Message \
    -SafeAction "Verify one Blockbench instance, plugin loaded, port 3000, endpoint /bb-mcp, and auto-port disabled."
} finally {
  if ($smokeSessionId) {
    try {
      $deleteHeaders = @{
        Accept = "application/json, text/event-stream"
        "mcp-session-id" = $smokeSessionId
      }
      $null = Invoke-WebRequest \
        -Uri $canonicalUrl \
        -Method Delete \
        -Headers $deleteHeaders \
        -TimeoutSec 5 \
        -UseBasicParsing
      $smokeSessionClosed = $true
    } catch {
      $warnings.Add("Transient smoke session could not be explicitly closed; the server timeout must clean it up.")
    }
  }
}

if ($runtimeStatus) {
  if ($runtimeStatus.server.url -and [string]$runtimeStatus.server.url -ne $canonicalUrl) {
    Add-Blocker \
      -List $blockers \
      -Code "CONNECTION_CONTRACT_MISMATCH" \
      -Message "The plugin reports $($runtimeStatus.server.url), expected $canonicalUrl." \
      -SafeAction "Restore the canonical port and endpoint, then reload the plugin."
  }
  if ($runtimeStatus.settings.auto_port -eq $true) {
    Add-Blocker \
      -List $blockers \
      -Code "AUTO_PORT_ENABLED" \
      -Message "Blockbench MCP auto-port fallback is enabled." \
      -SafeAction "Disable MCP Auto Port so Codex always uses port 3000."
  }
  if (-not $runtimeStatus.project.uuid) {
    Add-Blocker \
      -List $blockers \
      -Code "NO_ACTIVE_PROJECT" \
      -Message "The MCP plugin has no active Blockbench project." \
      -SafeAction "Open or create the intended project before starting Codex stage work."
  }
}

$result = if ($blockers.Count -eq 0) { "PASS" } else { "BLOCKER" }
if ($codexConfigChanged) {
  $result = "RESTART_REQUIRED"
  $warnings.Add("Codex configuration was updated. Restart Codex once before stage work.")
}

$report = [ordered]@{
  schema_version = "1.0"
  checked_at = $checkedAt
  result = $result
  connection = [ordered]@{
    server_key = $serverKey
    transport = [string]$profile.transport
    canonical_url = $canonicalUrl
    strict_endpoint = [bool]$profile.strict_endpoint
    allow_port_scan = [bool]$profile.allow_port_scan
    endpoint_reachable = $endpointReachable
    handshake_succeeded = $handshakeSucceeded
    smoke_session_closed = $smokeSessionClosed
  }
  codex = [ordered]@{
    config_path = $codexConfigPath
    config_matched_before = $codexConfigMatchedBefore
    config_changed = $codexConfigChanged
    config_matched = $codexConfigMatched
    restart_required = $codexConfigChanged
  }
  blockbench = [ordered]@{
    process_count = $blockbenchProcesses.Count
    required_settings = $profile.blockbench.required_settings
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
    "Codex may use the canonical blockbench MCP connection and continue with the active asset preflight."
  } elseif ($result -eq "RESTART_REQUIRED") {
    "Restart Codex once, then rerun this script without -InstallCodexConfig."
  } elseif ($blockers.Count -gt 0) {
    $blockers[0].safe_action
  } else {
    "Review the connection report."
  }
}

$reportPath = if ($Asset) {
  $assetRoot = Join-Path $repoRoot ("SavedData\sessions\" + $Asset)
  $reportsRoot = Join-Path $assetRoot "reports"
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
    $state.mcp | Add-Member -NotePropertyName server_key -NotePropertyValue $serverKey -Force
    $state.mcp | Add-Member -NotePropertyName canonical_url -NotePropertyValue $canonicalUrl -Force
    $state.mcp | Add-Member -NotePropertyName resolved_url -NotePropertyValue $(if ($runtimeStatus) { $runtimeStatus.server.url } else { $null }) -Force
    $state.mcp | Add-Member -NotePropertyName connection_status -NotePropertyValue $result -Force
    $state.mcp | Add-Member -NotePropertyName capability_status -NotePropertyValue $(if ($missingTools.Count -eq 0) { "PASS" } else { "BLOCKER" }) -Force
    $state.mcp | Add-Member -NotePropertyName required_tools_missing -NotePropertyValue $missingTools -Force
    $state.mcp | Add-Member -NotePropertyName connection_report -NotePropertyValue ("SavedData/sessions/" + $Asset + "/reports/connection.json") -Force
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

if ($result -eq "PASS") {
  exit 0
}
exit 1
