# MCP Session Lock Protocol

## Purpose

Keep MCP session usage deterministic and prevent token waste from repeated session reinitialization.

## Core Rule

- One model asset uses one active session ownership block at a time.
- A session lock must be established before any model edit command.

## Lock Payload

```text
asset:
phase:
session_id:
endpoint:
started_at:
owner:
tool_scope: modeling | texturing | hybrid
checkpoint_target:
approved_by:
reset_allowed: yes / no
```

## Acquire

1. If no lock exists, run preflight initialize once and capture `mcp-session-id`.
2. Fill lock payload in the asset session lock file:
   `SavedData/sessions/[asset]/session-lock.md`.
3. Attach this `session_id` intent to each MCP cycle until phase gate.

## Reuse

- Same endpoint + same asset + same phase:
  - reuse lock and do not reinitialize.
- Same asset but next phase:
  - reuse same session if project still active and lock owner still valid.
- Endpoint changed or lock stale:
  - close current lock and create a new one with reason.

## Drift Detection

- Detect drift when any of these appears:
  - lock owner missing
  - lock `phase` changed without checkpoint
  - MCP session returns permission error or stale session errors
- On drift, stop edits and require user approval for reset.

## Anti-Spam Escalation

- If a new session appears during an active phase without approved reset:
  - mark `BLOCKER`
  - stop edit commands
  - request explicit reset reason and owner.

## End of Asset

- Keep lock in history (`session-lock.md`) and mark `closed`.
- New phase or new asset starts with explicit ownership check.

## Acceptance Criteria

- Lock is present and correct before every write-capable MCP action.
- No extra unapproved session creation.
- Drift events are explicit and never hidden.
- Session transitions are logged and auditable.

