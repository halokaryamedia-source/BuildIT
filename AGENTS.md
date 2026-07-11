# Repository Agent Rules

## Required Authorities

1. Read `openspec/config.yaml` and the active OpenSpec change before workflow development.
2. Read `engines/shared/workflow/GOVERNANCE.md` after context loss.
3. For local Codex production, start at `engines/codex/BOOTSTRAP.md`.
4. Use `workspace/workspace.json` only as the selected-project index.
5. Use `workspace/active/<asset>/mcp/state.json` as runtime authority.
6. Use `engines/shared/profiles/stage-profiles.json` and `tool-profiles.json` as stage/tool authority.
7. Use `engines/shared/skills/skill-profiles.json` as production-skill authority.
8. Use `engines/shared/workspace/WORKSPACE_CONTRACT.md` as workspace lifecycle authority.
9. Use `openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md` as the current implementation boundary.

## Legacy Context Rejection

- Current repository authorities override copied chat context, downloaded project-context ZIPs, old prompt packs, and stale skill snapshots.
- Do not load or follow a Blockbench workflow that requires four technical sheets, three approval moments, or numbered `01_*` through `04_*` reference images.
- The approved package uses one Reference Visual plus Markdown and JSON contracts.
- When legacy instructions are active or cannot be isolated, stop with `LEGACY_SKILL_CONFLICT` and report the conflicting source.

## Execution Guardrails

- OpenSpec preserves approved scope and decisions.
- Ponytail selects the smallest safe work required now.
- User-visible stages are Geometry, Texture, optional Animation, and Final Validation.
- Stop after each stage preview for approval or targeted revision.
- Geometry uses enforced internal phases: `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY`.
- Geometry decisions require Codex visual inspection, fixed-scale `analyze_geometry_views` diagnosis, and `validate_geometry_contract`.
- Geometry corrections must use ranked failing views, semantic regions, affected parts, direction, and magnitude. Unrelated trial-and-error changes are forbidden.
- Non-zero cube rotation must use `rotate_cube_about_attachment`; generic Geometry cube tools are for unrotated placement/modification.
- Preserve approved areas and manual edits unless a stage is explicitly reopened.
- Reject unrelated work as `DEFERRED_NOT_REQUIRED`.
- Use only the canonical MCP key `blockbench` at `http://localhost:3000/bb-mcp`.
- Do not scan ports, create alternate MCP keys, or bypass tool profiles.
- Acquire `manage_project_write_lease` before asset mutations or evidence/checkpoint/final writes.
- Never bypass `WRITE_LEASE_*` errors; realign project, state, stage, profile, and owner session instead.
- A successful stage/profile transition releases the old lease; reacquire it after the one allowed reconnect.
- Asset production loads `blockbench-production` plus exactly one active-stage skill; maximum loaded production skills is `2`.
- Repository development must not load production skills.
- Skill changes do not require MCP reconnects; tool-profile changes may reconnect the canonical entry once.
- Keep user-facing model files only in `workspace/*/<asset>/blockbench/`.
- Keep MCP state, contracts, checkpoints, evidence, and reports only in `workspace/*/<asset>/mcp/`.
- Completed baselines remain immutable while a reopened revision is active.
- Keep active work on `Rework` until explicit integration approval.

## Root Boundaries

- `mcp-blockbench/`: the complete MCP Blockbench package, including `src/`, `scripts/`, `prompts/`, `tests/`, and `dist/`.
- `engines/`: shared and engine-specific AI orchestration.
- `workspace/active/`: current editable projects.
- `workspace/completed/`: approved projects that can be inspected or reopened.
- `docs/`: authored documentation; generated API output belongs only in `docs/api/`.
- `openspec/`: durable work agreement.
- `.agents/`, `.codex/`, `.github/`, and `.vscode/`: tool-native adapters and discovery paths.

Run Bun package commands from `mcp-blockbench/`.

Do not recreate deprecated production skills `blockbench-use`, `blockbench-modeling`, or `blockbench-texturing`. Do not recreate root `src/`, `build/`, `prompts/`, `tests/`, `Engine/`, `SavedData/`, or `SourceDocument/`. Do not add versioned, `new`, `latest`, `backup`, or parallel-authority names.
