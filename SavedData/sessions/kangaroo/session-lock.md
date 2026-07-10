asset: kangaroo
runtime_authority: SavedData/sessions/kangaroo/state.json
stage: GEOMETRY
endpoint: http://localhost:3000/bb-mcp
legacy_session_id: a53fc9d2-53b2-414e-bc89-664370cf4c0b
lock_owner: codex
status: requires_verification
expected_tool_scope: geometry
stage_profile: Engine/codex/stage-profiles.json
persistent_checkpoint_target: SavedData/sessions/kangaroo/checkpoints/00_session_start.bbmodel
can_reuse_legacy_session: verify_first
last_verified_at: 2026-07-06T00:00:00+07:00
blocker: reference_package_migration_or_verification_required
safe_next_action: validate reference package, verify endpoint/project/session, then update state.json and acquire the active write session
