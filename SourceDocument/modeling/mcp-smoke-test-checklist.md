# MCP Smoke Test Checklist

Run this read-only check before the first MCP write in a session.

Do not repeat it for every edit. Re-run only when the endpoint, session, project, or required tool capability becomes stale or fails.

## Required Checks

```text
Blockbench open: Yes / No
MCP plugin loaded: Yes / No
Endpoint: http://localhost:3000/bb-mcp or verified alternate
Endpoint reachable: Yes / No
Protocol initialize succeeded: Yes / No
mcp-session-id captured: Yes / No
Runtime tool list available: Yes / No
Active project detected: Yes / No
Project name:
Project UUID:
Project format:
UV mode:
Texture size:
Active stage:
Required stage tool profile available: Yes / No
Screenshot capability available: Yes / No
Undo/checkpoint capability available: Yes / No
One active write session confirmed: Yes / No
Unexpected extra sessions: None / List
Manual edits to preserve recorded: Yes / No
state.json updated: Yes / No
```

## Session Rule

- Reuse one working session for the active asset.
- Do not run a new initialize loop when the active session is healthy.
- Reinitialize only when the endpoint changed, the user requested reset, or the session is unavailable.
- If ownership is ambiguous or an unexpected writer exists, stop with `BLOCKER`.
- Record verified session/project details in `SavedData/sessions/<asset>/state.json`.

## Tool Scope

Check only the tools required by the active stage profile in:

```text
Engine/codex/stage-profiles.json
```

Do not inspect all tool domains when the active stage does not need them.

## Result

PASS:

```text
MCP smoke test: PASS
Stage:
Project UUID:
Session ID:
Required tool profile:
Next action:
```

Failure:

```text
MCP smoke test: BLOCKER
Failed check:
Runtime evidence:
Safe recovery:
```

Do not modify the model during smoke test.

## Quick PowerShell Verification

```powershell
$uri = "http://localhost:3000/bb-mcp"
$initBody = '{"jsonrpc":"2.0","id":"1","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"codex-smoke","version":"1.0"}}}'
$headers = @{ Accept = "application/json, text/event-stream"; "Content-Type" = "application/json" }

$initResp = Invoke-WebRequest -Uri $uri -Method Post -Headers $headers -Body $initBody -TimeoutSec 8
$sessionId = $initResp.Headers["mcp-session-id"]
$listBody = '{"jsonrpc":"2.0","id":"2","method":"tools/list","params":{}}'
$toolResp = Invoke-WebRequest -Uri $uri -Method Post -Headers (@{ Accept = "application/json, text/event-stream"; "Content-Type" = "application/json"; "mcp-session-id" = $sessionId }) -Body $listBody -TimeoutSec 8
$tools = ($toolResp.Content | ConvertFrom-Json).result.tools | ForEach-Object { $_.name }

$sessionId
$tools -contains "get_project_info"
$tools -contains "capture_screenshot"
$tools -contains "save_checkpoint"
```

A healthy endpoint returns HTTP 200, a session ID, and the active-stage required tools.
