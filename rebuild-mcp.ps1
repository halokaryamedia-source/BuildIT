$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$mcp = Join-Path $root "mcp"

Push-Location $mcp
try {
  bun run build
  $bundle = Get-Content -Raw (Join-Path $mcp "dist\mcp.js")
  $version = (Get-Content -Raw (Join-Path $mcp "package.json") | ConvertFrom-Json).version
  $required = @("add_group", "place_cube", "modify_cube", "capture_model_views")
  $missing = $required | Where-Object { -not $bundle.Contains('"' + $_ + '"') }
  if ($missing) { throw "Bundle $version missing: $($missing -join ', ')" }
  Write-Host "MCP bundle ready: v$version"
  Write-Host "Next: unload old BlockIT MCP, install mcp\dist, then reconnect MCP in Codex."
}
finally {
  Pop-Location
}
