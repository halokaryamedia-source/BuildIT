# Repository Agent Rules

## Required Authorities

1. Read `openspec/config.yaml` and the active OpenSpec change before workflow development.
2. Read `engines/shared/workflow/GOVERNANCE.md` after context loss.
3. For local Codex production, start at `engines/codex/BOOTSTRAP.md`.
4. Use `engines/codex/MODEL_ROUTING.md` as the model, effort, delegation, permission, and active-writer authority.
5. Use `workspace/workspace.json` only as the selected-project index.
6. Use `workspace/active/<asset>/mcp/state.json` as runtime authority.
7. Use `engines/shared/profiles/stage-profiles.json` and `tool-profiles.json` as stage/tool authority.
8. Use `engines/shared/skills/skill-profiles.json` as production-skill authority.
9. Use `engines/shared/workspace/WORKSPACE_CONTRACT.md` as workspace lifecycle authority.
10. Use `openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md` as the current implementation boundary.

## Project Config Preflight

Project-scoped `.codex/` configuration is mandatory for adaptive routing. At the beginning of a new local project session, confirm that `routine_auditor`, `mcp_builder`, `visual_director`, and `critical_reviewer` are available.

If they are missing, stop once with `CODEX_PROJECT_CONFIG_NOT_LOADED` and ask the user to trust the current BuildIT project. Do not invent substitute role definitions and do not repeat the request after the roles appear.

## Legacy Context Rejection

- Current repository authorities override copied chat context, downloaded project-context ZIPs, old prompt packs, and stale skill snapshots.
- Reject workflows requiring four technical sheets, three approval moments, or numbered `01_*` through `04_*` reference images.
- The approved package uses one Reference Visual plus Markdown and JSON contracts.
- Stop conflicts with `LEGACY_SKILL_CONFLICT` and report the source.

## Adaptive Model Routing

- Project default is `gpt-5.6-terra` with medium reasoning. Terra performs normal implementation directly; do not pay for a separate controller and Terra child on standard work.
- A user-selected composer model affects the parent only. Follow `MODEL_ROUTING.md` when the parent is over- or under-qualified.
- Use deterministic classification; never spend a model call only to choose another model.
- `routine_auditor`: 5.4 Mini Low, sizeable mechanical read-only work, Blockbench MCP disabled.
- `mcp_builder`: Terra Medium fallback writer when the parent is not the selected Terra writer or isolation is materially safer.
- `visual_director`: Sol Medium, read-only visual judgment with an inspection-only Blockbench MCP allowlist.
- `critical_reviewer`: packet-only Sol High, Blockbench MCP disabled, at most once for one approved reason code.
- Exactly one active writer exists: the default Terra parent or `mcp_builder`, never both concurrently.
- High is the ceiling. Never route to Extra High, Max, Ultra, Fast, recursive agents, or parallel writers.
- Keep `agents.max_threads = 2` and `agents.max_depth = 1`.
- Subagent sandbox defaults are not the final active-asset boundary when the parent uses Full access. Enforce MCP allowlists, one writer, and the Blockbench write lease.
- Deterministic validation replaces expensive model review whenever it can answer the question.

## Execution Guardrails

- OpenSpec preserves scope; Ponytail selects the smallest safe work.
- User-visible stages are Geometry, Texture, optional Animation, and Final Validation.
- Stop after each stage preview for approval or targeted revision.
- Geometry uses only `BEDROCK_CUBOID_GEOMETRY`; `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes.
- `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are internal progress markers, not user gates.
- Geometry decisions require actual image inspection, fixed-scale `analyze_geometry_views`, and `validate_geometry_contract`.
- Geometry corrections use ranked views, regions, parts, direction, and magnitude. Unrelated trial-and-error changes are forbidden.
- Every non-zero cube rotation uses `rotate_cube_about_attachment`.
- The canonical MCP session root is `workspace/active/<asset>/mcp`. `get_stage_context` accepts either the asset root or the canonical root, returns `canonical_session_root`, and later calls must reuse it.
- Synchronize a changed runtime UUID with `rebind_active_project_identity` before acquiring a lease; never ask the user to edit JSON.
- `analyze_geometry_views` persists canonical evidence and therefore requires the current Geometry write lease.
- Current Geometry evidence is bound to both the compatibility fingerprint and transformed world-space signature. Rerun capture/analyze after hierarchy or group-transform changes.
- Submit final Geometry with `submit_geometry_for_review`; it validates, checkpoints, advances revision/lease, and enters `GEOMETRY_REVIEW`.
- A successful review submission releases the lease. After user approval or revision, Codex acquires a new current-stage lease automatically before completion or revision preparation.
- Use only MCP key `blockbench` at `http://localhost:3000/bb-mcp`. Do not scan ports or create alternate keys.
- Acquire `manage_project_write_lease` before model, evidence, checkpoint, final-output, or persistent-analysis writes. Metadata-only identity synchronization is the narrow exception.
- Never bypass `WRITE_LEASE_*`; realign project, state, stage, profile, and owner through MCP.
- Stage transitions release the previous lease. Geometry revision and review submission stay in the same profile/session.
- Production loads `blockbench-production` plus exactly one active-stage skill; maximum `2`.
- Repository development must not load production skills.
- Reload the plugin only after binary changes or an actually unavailable endpoint.
- Keep user files under `workspace/*/<asset>/blockbench/` and MCP internals under `workspace/*/<asset>/mcp/`.
- Completed baselines remain immutable during reopened revisions.
- Keep active work on `Rework` until explicit integration approval.

## Root Boundaries

- `mcp-blockbench/`: MCP package source, prompts, scripts, tests, and generated output.
- `engines/`: shared and engine-specific orchestration.
- `workspace/active/`: current editable projects.
- `workspace/completed/`: approved projects.
- `docs/`: authored documentation; generated API output belongs in `docs/api/`.
- `openspec/`: durable work agreement.
- `.agents/`, `.codex/`, `.github/`, `.vscode/`: tool-native adapters and discovery.

Run Bun package commands from `mcp-blockbench/`.

Do not recreate deprecated production skills `blockbench-use`, `blockbench-modeling`, or `blockbench-texturing`. Do not recreate root `src/`, `build/`, `prompts/`, `tests/`, `Engine/`, `SavedData/`, or `SourceDocument/`. Do not add versioned, `new`, `latest`, `backup`, or parallel-authority names.
