# Tasks: Codex Local Workflow Rework

## P0 — Workflow Alignment

- [x] Create branch `Rework` from `V1`.
- [x] Keep `Rework` isolated; do not merge into V1 during active rework.
- [x] Close the temporary draft PR to stop pull-request CI/deploy runs.
- [x] Add `Engine/codex/BOOTSTRAP.md`.
- [x] Add `Engine/codex/GOVERNANCE.md`.
- [x] Define OpenSpec as durable scope/decision memory.
- [x] Define Ponytail as the smallest-safe-work and anti-token-waste filter.
- [x] Add machine-readable state template.
- [x] Add stage-specific profiles.
- [x] Replace legacy reference requirements in active workflow documents with the approved package format.
- [x] Replace eight user-visible phases with Geometry, Texture, optional Animation, and Final Validation.
- [x] Update active stage review and transition rules.
- [x] Update active project/session state guidance.
- [x] Remove absolute local filesystem links from active entry-point documents.
- [x] Add `Engine/codex/LEGACY_WORKFLOW_AUDIT.md` and update active non-entry documents found during this audit batch.
- [ ] Continue searching remaining historical/conditional documents for execution-affecting legacy logic.
- [ ] Remove or archive redundant workflow documents only after confirming no tooling or links depend on them.

## P1 — Deterministic Local Connection

- [x] Define one canonical Codex MCP key: `blockbench`.
- [x] Define one canonical URL: `http://localhost:3000/bb-mcp`.
- [x] Add `Engine/codex/connection-profile.json`.
- [x] Add `Engine/codex/CONNECTION_CONTRACT.md`.
- [x] Add `Engine/codex/scripts/sync-local-stack.ps1`.
- [x] Add `get_runtime_status` as one structured live readiness call.
- [x] Register runtime tools in the MCP server and docs manifest.
- [x] Make Blockbench runtime use port 3000, endpoint `/bb-mcp`, auto-port disabled, and minimum 30-minute session timeout.
- [x] Make Blockbench Codex snippets use the fixed `blockbench` key.
- [x] Add canonical connection fields to `state.json`.
- [x] Replace manual smoke-test discovery with the deterministic sync command.
- [ ] Run the sync script locally against the rebuilt/reloaded Rework plugin.
- [ ] Confirm Codex connects after one configuration install/restart and does not create alternate MCP entries.
- [ ] Confirm the temporary smoke session closes and the Codex session becomes the single write session.

## P2 — Exact MCP Tool Profiles and Runtime Efficiency

- [x] Make `state.json` the documented runtime authority.
- [x] Add one-time asset preflight behavior after connection readiness.
- [x] Increase the plugin session timeout to at least 30 minutes.
- [x] Make cube placement fail on a missing provided parent/group by default.
- [x] Require explicit cube IDs for agent modifications by default.
- [x] Allow untextured/placeholder Geometry-stage cube construction.
- [x] Define persistent `.bbmodel` stage checkpoint paths and requirements.
- [x] Add `save_project_checkpoint`.
- [x] Add `capture_standard_views`.
- [x] Add exact stage, repair, and diagnostic tool-profile allowlists.
- [x] Add `get_tool_profile` and `activate_tool_profile`.
- [x] Apply exact profile exposure to future MCP sessions.
- [x] Add call-time `TOOL_PROFILE_BLOCKED` guards.
- [x] Bind Geometry, Texture, Animation, Final Validation, and local repairs to exact profile IDs.
- [x] Exclude PBR, Hytale, mesh UV, armature/vertex-weight, UI automation, and eval from normal profiles.
- [x] Add profile ID, revision, exposed count, total count, and deterministic hash to runtime status.
- [x] Add `validate_reference_contract` to replace repeated project/reference/evidence checks.
- [x] Add `save_texture_evidence` to avoid base64 atlas round-trips.
- [x] Add `complete_stage` to combine approved checkpoint, state update, accepted-area lock, and next-profile activation.
- [x] Add shared atomic filesystem helpers for workflow state/evidence writes.
- [x] Convert `get_project_info` and cuboid UV inspection to structured results.
- [x] Require explicit cube ID for `set_cube_face_uv`.
- [ ] Build/reload the plugin and prove reduced `tools/list` counts for every normal profile.
- [ ] Prove Geometry → Texture → optional Animation → Final transitions require only one deterministic reconnect each.
- [ ] Prove stale/out-of-profile calls are blocked in actual MCP runtime.
- [ ] Prove cross-stage arguments are blocked in actual MCP runtime.
- [ ] Prove `validate_reference_contract`, `save_texture_evidence`, and `complete_stage` in actual Blockbench.
- [ ] Add a server-enforced exclusive project write lease only if actual multi-writer ambiguity remains after deterministic connection/profile sync.
- [ ] Generate Markdown session summaries from `state.json` only if manual summary drift appears in dry run.
- [ ] Add another composite preflight tool only if dry-run evidence shows repeated calls remain beyond `get_runtime_status` and `validate_reference_contract`.
- [x] Review checkpoint, standard-view, runtime-status, profile-control, validation, evidence, and stage-completion tools through Ponytail.
- [ ] Review every later proposed tool through Ponytail before implementation.

## P3 — Workflow Precision

- [x] Define exact standard camera behavior and stable evidence filenames.
- [x] Define stage-specific checkpoint metadata and recovery rules.
- [x] Define how stage approval is written into `state.json`.
- [x] Define how broad revision feedback reopens an earlier stage.
- [x] Define how local revision feedback preserves accepted areas.
- [x] Define final artifact paths and handoff requirements.
- [x] Ensure Animation skip logic uses the manifest and `ANIMATION.md` consistently.
- [x] Ensure Final Validation cannot add new features or broad polish.
- [x] Add `LOCAL_DRY_RUN.md` for end-to-end local proof without CI.
- [x] Add OpenSpec requirements for compact validation, direct texture evidence, atomic stage completion, and structured inspection.
- [ ] Execute one complete local dry run against an approved current-format reference package.
- [ ] Measure repeated reads, payload size, MCP calls, reconnects, and repair loops.
- [ ] Use dry-run evidence to decide whether further automation is required.

## P4 — Development Reliability

Completed groundwork:

- [x] Narrow the build watcher.
- [x] Fix duplicate `dev:watch` build chaining.
- [x] Add focused Bun tests for workflow configuration.
- [x] Add focused profile tests.
- [x] Add focused tests for compact workflow tools, atomic filesystem use, and structured outputs.
- [x] Return structured MCP results from cube, checkpoint, standard-view, runtime-status, profile-control, project, UV, and workflow tools.
- [x] Register workflow tools in generated API documentation input.

Still required before final integration:

- [ ] Perform focused local typecheck/test/build verification for the current Rework source batch.
- [ ] Reload the compiled plugin in Blockbench.
- [ ] Run Blockbench runtime checks for all profile and workflow tools.
- [ ] Add runtime tests for strict group, explicit ID, untextured cube, UV explicit ID, and failed atomic writes.
- [ ] Perform a complete final local verification pass after implementation stabilizes.

## P5 — CI and Integration — DEFERRED UNTIL LAST

- [x] Remove the temporary `Rework` CI workflow.
- [x] Close the draft PR so existing PR-preview deployment does not run on each branch update.
- [ ] Add final CI only after P0–P4 implementation is stable.
- [ ] Add final typecheck/test/build/docs workflow.
- [ ] Reopen a review PR only when the branch is intentionally ready for integration review.
- [ ] Run final CI and repair failures.
- [ ] Request explicit user approval before merging into V1.

CI is not part of the current active scope and must not interrupt workflow rework.

## Acceptance Checks

- [x] Reference intake accepts the current package format.
- [x] Geometry, Texture, optional Animation, and Final Validation each end in one user review.
- [x] No internal pass asks for separate routine approval.
- [x] One-issue-per-cycle applies to revisions, not initial bounded construction.
- [x] Final output contract includes `.bbmodel`, textures, evidence, completed validation, and revision summary.
- [x] OpenSpec and Ponytail have distinct responsibilities.
- [x] Work unrelated to the active stage can be rejected as `DEFERRED_NOT_REQUIRED`.
- [x] Branch remains isolated from V1.
- [x] State transitions, accepted-area protection, evidence filenames, checkpoint paths, and profile IDs are explicit.
- [x] Normal Bedrock cuboid profiles use exact allowlists.
- [x] Composite workflow tools reduce repeated inspection, base64 transfer, and stage-transition calls.
- [ ] Local connection verification passes with actual Blockbench.
- [ ] Local profile and compact-workflow tool verification passes with actual Codex/Blockbench MCP.
- [ ] Local dry run proves the entire stage flow using actual Blockbench MCP.
