# Model Session Lock Template

`state.json` is the runtime authority. This file is a compact lock mirror for human inspection and compatibility.

Copy to:

```text
SavedData/sessions/<asset>/session-lock.md
```

## Template

```yaml
asset: <asset_id>
runtime_authority: SavedData/sessions/<asset_id>/state.json
stage: GEOMETRY | TEXTURE | ANIMATION | FINAL_VALIDATION
endpoint: http://localhost:3000/bb-mcp
session_id: <mcp-session-id>
lock_owner: codex
status: active | requires_verification | stale | reset | closed
stage_profile: Engine/codex/stage-profiles.json
expected_tool_scope: geometry | texture | animation | validation
project_uuid: <uuid>
project_name: <name>
persistent_checkpoint_target: SavedData/sessions/<asset_id>/checkpoints/<checkpoint>.bbmodel
approval_ref: <approved-stage-or-reference>
can_reuse_same_session: yes | verify_first | no
started_at: <iso-8601>
last_verified_at: <iso-8601>
last_blocker: none | <blocker-code>
last_blocker_reason: <reason>
safe_next_action: <action>
```

## Required Fields Before a Write

- `asset`
- `runtime_authority`
- `stage`
- `endpoint`
- `session_id`
- `lock_owner`
- `status: active`
- `expected_tool_scope`
- `project_uuid`
- `persistent_checkpoint_target`
- `last_verified_at`

## Rules

- Use one active write session per asset.
- Keep the same healthy session across internal passes and normal stage progression.
- Update the stage and profile after user approval moves work forward.
- Do not create a new session merely because a new revision cycle begins.
- Reset only when the endpoint changed, the session is unavailable, ownership is ambiguous, or the user approved reset.
- A legacy or unverified lock cannot authorize a write.
- The lock mirror must match `state.json`; when they conflict, stop and repair state/lock consistency.
- Persistent checkpoint path must be recorded before a meaningful write batch.

## Reset Sequence

1. set old lock `status: reset` or `closed`;
2. record the reset reason in `state.json`;
3. initialize/verify the new session once;
4. update project UUID and stage profile;
5. save a persistent checkpoint;
6. set the new lock `status: active`.

## Acceptance Criteria

- One active session owner is clear.
- Project UUID and active stage are explicit.
- Lock and `state.json` agree.
- The next safe action is unambiguous.
