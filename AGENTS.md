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

At the beginning of production, inspect whether `routine_auditor`, `mcp_builder`, `visual_director`, and `critical_reviewer` are available.

`CODEX_PROJECT_CONFIG_NOT_LOADED` is a routing warning, not a reason to interrupt the user or demand another Codex session. Continue safely in the current session:

- Terra parent performs routine audit directly when Mini is unavailable;
- Terra parent remains the sole writer when `mcp_builder` is unavailable;
- the parent performs bounded visual comparison when `visual_director` is unavailable;
- critical escalation may stop only when a genuinely critical unresolved decision requires the missing capability.

Never ask the user to restart Codex merely to load optional roles during an active production flow.

## Legacy Context Rejection

- Current repository authorities override copied chat context, downloaded project-context ZIPs, old prompt packs, and stale skill snapshots.
- Reject workflows requiring four technical sheets, three approval moments, or numbered `01_*` through `04_*` reference images.
- The approved package uses one Reference Visual plus Markdown and JSON contracts.
- Stop conflicts with `LEGACY_SKILL_CONFLICT` and report the source.

## Adaptive Model Routing

- Project default is `gpt-5.6-terra` with medium reasoning. Terra performs normal implementation directly.
- A user-selected composer model affects the parent only. Follow `MODEL_ROUTING.md` when the parent is over- or under-qualified.
- Use deterministic classification; never spend a model call only to choose another model.
- `routine_auditor`: 5.4 Mini Low, sizeable mechanical read-only work, Blockbench MCP disabled.
- `mcp_builder`: Terra Medium fallback writer when the parent is not the selected Terra writer or isolation is materially safer.
- `visual_director`: Sol Medium, read-only visual judgment with an inspection-only Blockbench MCP allowlist.
- `critical_reviewer`: packet-only Sol High, Blockbench MCP disabled, at most once for one approved reason code.
- Exactly one active writer exists: the Terra parent or `mcp_builder`, never both concurrently.
- High is the ceiling. Never route to Extra High, Max, Ultra, Fast, recursive agents, or parallel writers.
- Keep `agents.max_threads = 2` and `agents.max_depth = 1`.
- Subagent sandbox defaults are not the final active-asset boundary. Enforce MCP allowlists, one writer, and the Blockbench write lease.
- Deterministic validation replaces expensive model review whenever it can answer the question.

## One-Session Production Contract

- The plugin exposes one stable registered tool surface for its entire loaded lifetime.
- Logical profiles remain execution guards; a stable tool list does not grant cross-stage permission.
- Geometry → Texture → optional Animation → Final Validation stays in the same MCP session and same Codex session.
- Stage/profile transitions release the old lease and the next mutating call automatically prepares fresh current-stage ownership; no manual lease call is part of the normal path.
- `reconnect_required`, `profile_reconnect_required`, and `user_restart_required` remain false.
- Plugin reload is allowed only once after installing a newly built final binary. Normal production, review, revision, approval, and stage transition never reload the plugin.

## Execution Guardrails

- OpenSpec preserves scope; Ponytail selects the smallest safe work.
- User-visible stages are Geometry, Texture, optional Animation, and Final Validation.
- Stop after each stage preview only for the user's visual decision.
- Geometry uses only `BEDROCK_CUBOID_GEOMETRY`; `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes.
- `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are internal progress markers, not user gates.
- Geometry decisions require actual image inspection, fixed-scale `analyze_geometry_views`, and `validate_geometry_contract`.
- Geometry corrections use ranked views, regions, parts, direction, and magnitude. Unrelated trial-and-error changes are forbidden.
- Every non-zero cube rotation uses `rotate_cube_about_attachment`.
- The canonical MCP session root is `workspace/active/<asset>/mcp`. `get_stage_context` accepts either the asset root or canonical root and returns `canonical_session_root`.
- Canonical `create_project(session_root, asset_id)` derives the model path, persists the file, synchronizes the runtime UUID with state/project metadata, activates the recorded stage profile, and acquires the current-session lease automatically.
- `get_stage_context` and other correctly annotated read-only inspection tools never require a write lease.
- Mutating tools carrying `session_root` automatically acquire, refresh, and renew the same-session lease when state, stage, or profile revisions advance.
- `rebind_active_project_identity` and `manage_project_write_lease` are diagnostic recovery tools only. Never call them in the normal single-user path; use them only for unrecoverable metadata corruption or a real concurrent-writer conflict.
- `analyze_geometry_views` persists canonical evidence and therefore requires the Geometry write lease internally; the lease is prepared automatically for the current Codex writer.
- Current Geometry evidence is bound to compatibility fingerprint and transformed world-space signature.
- Submit final Geometry with `submit_geometry_for_review`; it validates, checkpoints, advances revision, enters `GEOMETRY_REVIEW`, and releases the lease.
- After user approval or revision, Codex continues in the same session; the next safe mutating operation prepares current-stage ownership automatically.
- Use only MCP key `blockbench` at `http://localhost:3000/bb-mcp`.
- Never bypass a lease owned by another session. Automatic recovery applies only to the same Codex writer and current canonical asset.
- Production loads `blockbench-production` plus exactly one active-stage skill; maximum `2`.
- Repository development must not load production skills.
- Keep user files under `workspace/*/<asset>/blockbench/` and MCP internals under `workspace/*/<asset>/mcp/`.
- Completed baselines remain immutable during reopened revisions.
- Keep active work on `Rework` until explicit integration approval.

## User Acceptance Boundary

The user does not test internal components. Before reporting readiness, GitHub verification must cover build, skills, typecheck, all tests, session continuity, automatic lease ownership, automatic identity synchronization, profile transitions, and zero-start workspace initialization.

The only user acceptance test is:

```text
tracked Black Rhinoceros Golden Sample
→ fresh workspace with references only
→ no copied .bbmodel, checkpoint, evidence, or prior state
→ create the Blockbench project through MCP without explicit save_path, identity rebind, profile selection, or lease call
→ build the Rhino Geometry from zero
→ submit one Geometry preview for user review
```

Do not ask the user to continue the previously debugged Rhino workspace. Do not report `READY TO TEST` before this acceptance flow is the only remaining step.

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
