# Repository Agent Rules

## Required Authorities

1. Read `openspec/config.yaml` and the active OpenSpec change before workflow development.
2. Read `engines/shared/workflow/GOVERNANCE.md` after context loss.
3. For local Codex production, start at `engines/codex/BOOTSTRAP.md`.
4. Use `engines/codex/MODEL_ROUTING.md` as the model, effort, delegation, and single-writer authority.
5. Use `workspace/workspace.json` only as the selected-project index.
6. Use `workspace/active/<asset>/mcp/state.json` as runtime authority.
7. Use `engines/shared/profiles/stage-profiles.json` and `tool-profiles.json` as stage/tool authority.
8. Use `engines/shared/skills/skill-profiles.json` as production-skill authority.
9. Use `engines/shared/workspace/WORKSPACE_CONTRACT.md` as workspace lifecycle authority.
10. Use `openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md` as the current implementation boundary.

## Legacy Context Rejection

- Current repository authorities override copied chat context, downloaded project-context ZIPs, old prompt packs, and stale skill snapshots.
- Do not load or follow a Blockbench workflow that requires four technical sheets, three approval moments, or numbered `01_*` through `04_*` reference images.
- The approved package uses one Reference Visual plus Markdown and JSON contracts.
- When legacy instructions are active or cannot be isolated, stop with `LEGACY_SKILL_CONFLICT` and report the conflicting source.

## Adaptive Model Routing

- Project default is `gpt-5.6-luna` with medium reasoning. An explicit composer selection changes only the parent thread; route substantive work through the locked custom agents.
- Classify by deterministic rules before delegation. Do not spend a model call only to choose another model.
- `routine_auditor` is 5.4 Mini Low and read-only; use it for mechanical search, hashes, evidence, tests, and compact logs.
- `mcp_builder` is Terra Medium and is the standard implementation worker. During asset production it is the only agent allowed to hold the Blockbench write lease or mutate the active asset.
- `visual_director` is Sol Medium and read-only; use it only for Reference Visual interpretation, ambiguous cross-view decisions, subjective feedback, and final visual acceptance.
- `critical_reviewer` is Sol High and read-only; use it at most once for one valid reason code defined in `MODEL_ROUTING.md`.
- High is the maximum allowed effort. Never route to xhigh, Extra High, Max, Ultra, Fast mode, recursive agents, or parallel MCP writers.
- Keep `agents.max_threads = 2` and `agents.max_depth = 1`. Do not spawn a subagent for a micro-task when direct execution is cheaper.
- If the parent is overqualified, keep it to orchestration. If it is underqualified, delegate before risky work. Do not ask the user to change models unless the required custom agent is unavailable.
- Deterministic validation replaces expensive review whenever it can answer the question.

## Execution Guardrails

- OpenSpec preserves approved scope and decisions.
- Ponytail selects the smallest safe work required now.
- User-visible stages are Geometry, Texture, optional Animation, and Final Validation.
- Stop after each stage preview for approval or targeted revision.
- Geometry uses one profile: `BEDROCK_CUBOID_GEOMETRY`.
- `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are internal progress markers, not separate user gates or profiles.
- `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal diagnosis scopes and never require Geometry profile switching or reconnecting.
- Geometry decisions require Codex visual inspection, fixed-scale `analyze_geometry_views` diagnosis, and `validate_geometry_contract`.
- Geometry corrections must use ranked failing views, semantic regions, affected parts, direction, and magnitude. Unrelated trial-and-error changes are forbidden.
- Non-zero cube rotation must use `rotate_cube_about_attachment`; generic Geometry cube tools are for unrotated placement/modification.
- When runtime UUID differs from stored metadata, Codex uses `rebind_active_project_identity` before acquiring the write lease. Do not ask the user to edit JSON files.
- When Geometry evidence is final and current, Codex uses `submit_geometry_for_review`; this tool creates the next unused review checkpoint and moves state to `GEOMETRY_REVIEW` without user file edits or checkpoint naming.
- Preserve approved areas and manual edits unless a stage is explicitly reopened.
- Reject unrelated work as `DEFERRED_NOT_REQUIRED`.
- Use only the canonical MCP key `blockbench` at `http://localhost:3000/bb-mcp`.
- Do not scan ports, create alternate MCP keys, or bypass tool profiles.
- Acquire `manage_project_write_lease` before model mutations or evidence/checkpoint/final writes. Metadata-only identity synchronization is the narrow exception.
- Never bypass `WRITE_LEASE_*` errors; realign project, state, stage, profile, and owner session through MCP tools.
- A successful stage transition releases the old lease. Geometry revision scopes and review submission do not transition profiles or require reconnecting.
- Asset production loads `blockbench-production` plus exactly one active-stage skill; maximum loaded production skills is `2`.
- Repository development must not load production skills.
- Skill changes do not require MCP reconnects. Geometry identity sync, revision preparation, and review submission do not require reconnects.
- Reload the plugin only after the plugin binary changes or when the canonical endpoint is actually unavailable.
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
