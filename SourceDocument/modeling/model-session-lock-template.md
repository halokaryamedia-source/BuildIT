# Model Session Lock Template

Copy this file to `SavedData/sessions/[asset]/session-lock.md` and fill all fields before Blockbench MCP write actions.

```text
asset: samurai_guard
phase: Main Geometry
endpoint: http://localhost:3000/bb-mcp
session_id:
lock_owner: codex-session-01
started_at: 2026-07-06T00:00:00+07:00
status: active

# Phase control
expected_tool_scope: modeling
tool_profile: blockbench-modeling
checkpoint_target: session.md
approval_ref: user-brief-001

# Gate / reuse policy
can_reuse_same_session: yes
reset_allowed_on:
  - endpoint_changed
  - session_unresponsive
  - user_approved_reset

# Last action lock evidence
last_verify_at: 2026-07-06T00:00:00+07:00
last_verify_by: operator
last_blocker: none
last_blocker_reason:
```

### Minimal required fields (do not leave empty before edit)

- `asset`
- `phase`
- `endpoint`
- `session_id`
- `lock_owner`
- `status` (`active` or `stale` or `reset` or `closed`)
- `expected_tool_scope`
- `can_reuse_same_session`

### Update rules

- On new asset request: create lock and set `started_at`.
- On normal phase progression: keep the same `session_id` and update:
  - `phase`
  - `approval_ref`
  - `last_verify_at`
- On reset: set `status: reset`, archive reason, then create a new lock with new `session_id` and `started_at`.

