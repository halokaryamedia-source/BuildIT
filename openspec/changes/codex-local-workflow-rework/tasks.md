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
- [x] Add `Engine/codex/scripts/sync-local-stack.ps1` for Codex config, Blockbench process, MCP handshake, capabilities, project identity, report, and state synchronization.
- [x] Add `get_runtime_status` as one structured live readiness call.
- [x] Register the runtime tool in the MCP server and docs manifest.
- [x] Make Blockbench runtime use port 3000, endpoint `/bb-mcp`, auto-port disabled, and minimum 30-minute session timeout.
- [x] Make Blockbench Codex snippets use the fixed `blockbench` key.
- [x] Add canonical connection fields to `state.json`.
- [x] Replace manual smoke-test discovery with the deterministic sync command.
- [ ] Run the sync script locally against the rebuilt/reloaded Rework plugin.
- [ ] Confirm Codex connects after one configuration install/restart and does not create alternate MCP entries.
- [ ] Confirm the temporary smoke session closes and the Codex session becomes the single write session.

## P2 — Runtime Efficiency

- [x] Make `state.json` the documented runtime authority.
- [x] Add one-time asset preflight behavior after connection readiness.
- [x] Increase the plugin session timeout to at least 30 minutes.
- [x] Make cube placement fail on a missing provided parent/group by default.
- [x] Require explicit cube IDs for agent modifications by default.
- [x] Allow untextured/placeholder Geometry-stage cube construction.
- [x] Define persistent `.bbmodel` stage checkpoint paths and requirements.
- [x] Add `save_project_checkpoint` for persistent `.bbmodel` and metadata output.
- [x] Add `capture_standard_views` for consistent stage evidence and stable filenames.
- [ ] Add reference-contract validation automation.
- [x] Add stage-aware tool profiles for Codex orchestration.
- [ ] Enforce stage tool profiles at MCP registration/session level only if dry-run evidence proves it is needed.
- [ ] Add a server-enforced exclusive project write lease only if actual multi-writer ambiguity remains after deterministic connection sync.
- [ ] Generate Markdown session summaries automatically from `state.json` only if manual summary drift appears in dry run.
- [ ] Add a compact workflow preflight tool only if the local dry run proves it removes repeated real-world calls beyond `get_runtime_status`.
- [x] Review checkpoint, standard-view, and runtime-status tools through Ponytail: each replaces repeated high-risk/repetitive operations and produces reviewable output.
- [ ] Review every later proposed tool through Ponytail before implementation.

## P3 — Workflow Precision

- [x] Define exact standard camera behavior and stable evidence filenames in `EVIDENCE_CONTRACT.md`.
- [x] Define stage-specific checkpoint metadata and recovery rules in `CHECKPOINT_RECOVERY.md`.
- [x] Define how stage approval is written into `state.json`.
- [x] Define how broad revision feedback reopens an earlier stage.
- [x] Define how local revision feedback preserves accepted areas.
- [x] Define final artifact paths and handoff requirements.
- [x] Ensure Animation skip logic uses the manifest and `ANIMATION.md` consistently.
- [x] Ensure Final Validation cannot add new features or broad polish.
- [x] Add `LOCAL_DRY_RUN.md` for end-to-end local proof without CI.
- [ ] Execute one complete local dry run against an approved current-format reference package.
- [ ] Use dry-run evidence to decide whether further automation is actually required.

## P4 — Development Reliability

Completed groundwork:

- [x] Narrow the build watcher so runtime/reference/evidence changes do not rebuild the plugin.
- [x] Fix duplicate `dev:watch` build chaining.
- [x] Add focused Bun tests for workflow configuration.
- [x] Return structured MCP results from cube, checkpoint, standard-view, and runtime-status tools.

Still required before final integration:

- [ ] Perform focused local typecheck/build verification for the current Rework source batch.
- [ ] Reload the compiled plugin in Blockbench.
- [ ] Run Blockbench runtime checks for `get_runtime_status`, `save_project_checkpoint`, and `capture_standard_views`.
- [ ] Add runtime tests for strict group, explicit ID, and untextured cube execution inside Blockbench.
- [ ] Perform a complete final local verification pass after workflow implementation stabilizes.

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

- [x] Reference intake accepts `PRODUCTION_CONTEXT.md`, one Reference Visual, four category docs, manifest, and handoff.
- [x] Geometry ends with five-view preview and user review.
- [x] Texture ends with atlas/model preview and user review.
- [x] Animation is skipped when not required and reviewed when required.
- [x] Final Validation waits for user approval or correction request.
- [x] No internal pass asks for separate routine approval.
- [x] One-issue-per-cycle applies to revisions, not initial bounded construction.
- [x] Final output contract includes `.bbmodel`, textures, evidence, completed validation, and revision summary.
- [x] OpenSpec and Ponytail have distinct, complementary responsibilities.
- [x] Work unrelated to the active stage can be rejected as `DEFERRED_NOT_REQUIRED`.
- [x] Branch remains isolated from V1 during active rework.
- [x] State transitions, accepted-area protection, evidence filenames, and checkpoint paths are explicit.
- [x] Codex, Blockbench MCP, and Blockbench have one canonical connection contract and one readiness report.
- [ ] Local connection verification passes with the actual Blockbench installation.
- [ ] Local dry run proves the entire stage flow using actual Blockbench MCP.
