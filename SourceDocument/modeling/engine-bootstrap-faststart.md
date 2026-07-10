# Engine Fast-Start to Prevent Looping

Use this only when session is resumed from a new chat or different PC.  
Goal: Engine starts in one pass and does not re-open unnecessary cycles.

## Fast-Start Sequence (Run in order)

1. Open active OpenSpec change:
   - `openspec/changes/mcp-blockbench-workflow/`
2. Open session source of truth:
   - `SourceDocument/modeling/model-session-checklist-template.md`
3. Open operator short checklist:
   - `SourceDocument/modeling/operator-one-page-checklist.md`
4. Open risk simulation:
   - `SourceDocument/modeling/ops/phase-risk-simulation.md`
5. Open preflight docs:
   - `SourceDocument/mcp-and-skills/README.md`
   - `SourceDocument/modeling/mandatory-blockbench-mcp-procedure.md`

## Engine Do-Not-Reopen Rule

- Do not start new Blockbench edits before preflight passes.
- Do not continue phase-to-phase without explicit `PASS` from current phase gate.
- Do not open multiple MCP sessions after preflight unless the active session is unavailable.
- Do not duplicate context by asking the same high-level questions twice.

## Mandatory Gate Before Any Edit

- OpenSpec + phase doc read
- `blockbench-use` loaded
- smoke test done
- reference intent and phase goal confirmed
- expected blockers for current phase marked in `session.md`
- exit gate explicitly approved by user

## If Loop Risk Appears

If the same issue repeats in two consecutive cycles:

- stop broad edits,
- request scope reset,
- keep only unresolved blocker list and user-confirmed fix path.

## Acceptance Criteria

- Engine can move from onboarding to first valid phase action in one pass.
- No extra MCP sessions were opened without blocker reason.
- No edit occurs before phase and readiness gates pass.
- Repeated loops are halted by explicit scope reset step.
