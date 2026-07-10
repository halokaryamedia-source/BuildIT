# Efficient MCP Blockbench Session Flow (One-Pass)

Use this as the default run path for every new model session.

1) Ingest
- Read `openspec/config.yaml` + active change.
- Read `SourceDocument/modeling/operator-one-page-checklist.md` and session `session.md`.
- Run reference package pass/fail.

2) Preflight (must all pass)
- `phase-risk-simulation` + `phase-risk-simulation` blocker assignment.
- MCP smoke test (phase-relevant checks only).
- Confirm single active session and phase ownership.

3) Phase gate lock
- Set exact phase goal and target part.
- Set exact tool scope (`blockbench-modeling` or `blockbench-texturing`).
- Set fixed pass limit: max 2 critical passes, max 2 focused batches.

4) Execute one focused batch
- Do only the minimal edits to close the current phase blockers.
- Avoid broad inspections and extra screenshots.

5) Gate and transition
- Capture required screenshots.
- Update scorecard: PASS / NEEDS_MINOR_FIX / BLOCKER.
- If PASS + user approval => next phase.
- If BLOCKER => fix blockers only.
- If NEEDS_MINOR_FIX with >2 items => request scope reset.

6) End-cycle handoff
- Record: completed work, skipped work, blockers, assumptions.
- Keep artifacts in `session.md` + phase screenshot set.

## 3a) MCP Session-Lock Gate (Anti-Spam)

This rule is mandatory before any edit command.

- Reuse one MCP session per asset execution unless the current session is lost/unusable.
- One asset + one locked session at a time.
- Initialize (`initialize`) only when one of these is true:
  - no existing lock for the asset
  - endpoint changed
  - user explicitly approved reset
- Store/track lock metadata in the asset session folder:
  - `SavedData/sessions/[asset]/session-lock.md`  
  - or equivalent `session.md` session section.
  - `session_id` (from `mcp-session-id`)
  - `asset`
  - `phase`
  - `endpoint`
  - `started_at`
  - `owner`
  - `expected_tool_scope` (`modeling` / `texturing`)
- All phase calls must use the same active session identity.
- If extra session activity is detected or suspected:
  - pause and mark phase as `BLOCKER`
  - request explicit user approval before reinitialize.
- Limit re-entry:
  - no new session for a minor fix cycle
  - one correction batch + one recheck only.

This flow prevents token drift by fixing one thing, checking once, then deciding the next move.

## Acceptance Criteria

- New model sessions follow the exact sequence with explicit phase gate transitions.
- No edits happen before preflight and gate lock are marked PASS.
- Each cycle ends with one status update and clear next action (PASS / NEEDS_MINOR_FIX / BLOCKER).
- Session lock is active (`session_id`, `asset`, `phase`, `endpoint`) before write/edit.
- Only one active session owner per asset unless reset is explicitly approved.
- Any re-initialization is logged with cause and approval timestamp.

