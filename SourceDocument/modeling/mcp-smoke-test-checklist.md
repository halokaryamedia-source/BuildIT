# MCP Smoke Test Checklist

Use this before any Blockbench MCP modelling work.

This is a read-only readiness check. Do not modify the model during smoke test.

## Required Checks

```text
Blockbench open:
Yes / No

MCP plugin loaded:
Yes / No

Endpoint:
http://localhost:3000/bb-mcp or verified alternate

Endpoint reachable:
Yes / No

Protocol handshake:
1) POST initialize with header: Accept: "application/json, text/event-stream"
2) Capture mcp-session-id from response
3) POST tools/list with header: mcp-session-id
Yes / No

Runtime tool list available:
Yes / No

Active project detected:
Yes / No

Target project name:

Screenshot tool available (`capture_screenshot` or `capture_app_screenshot`):
Yes / No

Checkpoint tool available (`save_checkpoint`):
Yes / No

Required phase tools available (`configure_project`, `get_project_info`, phase tools):
Yes / No

Session lock status:
Session lock exists:
Yes / No
Session reused from last cycle:
Yes / No
Unexpected extra sessions:
None / List
```

## Session-lock requirement

- If session lock is new for this asset, create and record lock metadata immediately in
  `SavedData/sessions/[asset]/session-lock.md` before edit.
- If session is reused, do not run a new `initialize` unless one of these conditions is met:
  - endpoint changed
  - user requested reset
  - previous session is unavailable/unresponsive.
- If any extra session is detected before phase completion:
  - stop all new edits,
  - mark `BLOCKER`,
  - request explicit reset approval.

## Required Result

If all checks pass:

```text
MCP smoke test passed.
Ready for phase:
```

If any check fails:

```text
Blocked: MCP smoke test failed.
Failed check:
Required action:
```

Do not continue to modelling until the failed check is resolved.

## Ponytail Rule

Only check tools needed for the current phase. Do not inspect every tool if the phase does not need it.

## Acceptance Criteria

- Endpoint and runtime tool list are verified.
- Active project is known.
- Screenshot/checkpoint capability is available for phase gates.
- Session lock state is explicit and reuse-aware.
- No model state is changed during smoke test.

## Quick PowerShell Verification (single command)

```powershell
$uri = "http://localhost:3000/bb-mcp"
$initBody = '{"jsonrpc":"2.0","id":"1","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}}}'
$headers = @{ Accept = "application/json, text/event-stream"; "Content-Type" = "application/json" }

$initResp = Invoke-WebRequest -Uri $uri -Method Post -Headers $headers -Body $initBody -TimeoutSec 8
$sessionId = $initResp.Headers["mcp-session-id"]
$listBody = '{"jsonrpc":"2.0","id":"2","method":"tools/list","params":{}}'
$toolResp = Invoke-WebRequest -Uri $uri -Method Post -Headers (@{ Accept = "application/json, text/event-stream"; "Content-Type" = "application/json"; "mcp-session-id" = $sessionId }) -Body $listBody -TimeoutSec 8

$tools = ($toolResp.Content | ConvertFrom-Json).result.tools | ForEach-Object { $_.name }

$tools -contains "configure_project"
$tools -contains "get_project_info"
$tools -contains "capture_screenshot"
$tools -contains "capture_app_screenshot"
$tools -contains "save_checkpoint"
```

Expected minimum on a healthy endpoint:
- initialize returns HTTP 200.
- `mcp-session-id` exists.
- tools/list returns a populated list and includes required names above.

