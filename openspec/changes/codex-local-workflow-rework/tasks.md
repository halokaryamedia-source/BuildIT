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

## P1 — Runtime Efficiency

- [x] Make `state.json` the documented runtime authority.
- [x] Add one-time preflight behavior.
- [x] Increase the plugin startup fallback session timeout to 30 minutes.
- [x] Make cube placement fail on a missing provided parent/group by default.
- [x] Require explicit cube IDs for agent modifications by default.
- [x] Allow untextured/placeholder Geometry-stage cube construction.
- [x] Define persistent `.bbmodel` stage checkpoint paths and requirements.
- [x] Add `save_project_checkpoint` for persistent `.bbmodel` and metadata output.
- [x] Add `capture_standard_views` for consistent stage evidence and stable filenames.
- [ ] Add reference-contract validation automation.
- [x] Add stage-aware tool profiles for Codex orchestration.
- [ ] Enforce stage tool profiles at MCP registration/session level.
- [ ] Add a server-enforced exclusive project write lease.
- [ ] Generate Markdown session summaries automatically from `state.json`.
- [ ] Add a compact workflow preflight tool only if the local dry run proves it removes repeated real-world calls.
- [x] Review the checkpoint and standard-view tools through Ponytail: both replace repeated high-risk/repetitive operations and produce reviewable output.
- [ ] Review every later proposed tool through Ponytail before implementation.

## P2 — Workflow Precision

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
- [ ] Use dry-run evidence to decide whether preflight, write-lease, profile-enforcement, or additional automation is actually required.

## P3 — Development Reliability

Completed groundwork:

- [x] Narrow the build watcher so runtime/reference/evidence changes do not rebuild the plugin.
- [x] Fix duplicate `dev:watch` build chaining.
- [x] Add focused Bun tests for workflow configuration.
- [x] Return structured MCP results from updated cube tools.
- [x] Return structured results from checkpoint and standard-view tools.

Still required before final integration:

- [ ] Perform focused local typecheck/build verification for the new checkpoint and camera tools.
- [ ] Run Blockbench runtime checks for `save_project_checkpoint`.
- [ ] Run Blockbench runtime checks for `capture_standard_views` and confirm camera labels/orientation.
- [ ] Add runtime tests for strict group, explicit ID, and untextured cube execution inside Blockbench.
- [ ] Perform a complete final local verification pass after workflow implementation stabilizes.

## P4 — CI and Integration — DEFERRED UNTIL LAST

- [x] Remove the temporary `Rework` CI workflow.
- [x] Close the draft PR so existing PR-preview deployment does not run on each branch update.
- [ ] Add final CI only after P0–P3 implementation is stable.
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
- [ ] Local dry run proves the entire stage flow using actual Blockbench MCP.
