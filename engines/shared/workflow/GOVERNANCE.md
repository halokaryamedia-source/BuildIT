# Workflow Governance

## Authorities

- OpenSpec: approved goal, scope, decisions, non-goals, blockers, and acceptance criteria.
- Ponytail: smallest safe action required by the active stage.
- `workspace/workspace.json`: selected-project index only.
- `workspace/active/<asset>/mcp/state.json`: runtime state authority.
- `workspace/active/<asset>/mcp/project.json`: project identity, connection, and canonical path metadata.
- `workspace/*/<asset>/blockbench/`: user-facing model assets.
- Reference package: asset intent and visual/technical authority.
- Stage/tool/skill profiles: allowed execution surface.

## Rules

1. Read only the selected project metadata, active state, active-stage document, and required reference core.
2. Do not scan `workspace/active/` or `workspace/completed/` when `workspace.json` and `project.json` already provide exact paths.
3. Do not repeat full preflight when checks are still fresh.
4. Do not add features for completeness.
5. Preserve accepted areas and manual edits.
6. Initial construction may use bounded batches; revision work is one named issue or tightly related pair.
7. Stop at each user-visible review gate.
8. Keep user `.bbmodel`, textures, reference PNGs, and previews in `blockbench/`; keep MCP state/checkpoints/evidence/reports in `mcp/`.
9. Completed baselines are immutable while reopened revisions are active.
10. Record deferred ideas as `DEFERRED_NOT_REQUIRED` instead of implementing them.
11. Never create versioned duplicate authorities. Git history and approved checkpoints are the revision archive.
