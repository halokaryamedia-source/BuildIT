# Tasks: Codex Local Workflow Rework

## P0 — Workflow Alignment

- [x] Create branch `Rework` from `V1`.
- [x] Add `Engine/codex/BOOTSTRAP.md`.
- [x] Add machine-readable state template.
- [x] Add stage-specific profiles.
- [x] Replace legacy eight-sheet requirements in active workflow documents with the approved reference package format.
- [x] Replace eight user-visible phases with Geometry, Texture, optional Animation, and Final Validation.
- [x] Update active stage review and transition rules.
- [x] Update active project/session state guidance.
- [x] Remove absolute local filesystem links from active entry-point documents.

## P1 — Runtime Efficiency

- [x] Make `state.json` the documented runtime authority.
- [x] Add one-time preflight behavior.
- [x] Increase the plugin startup fallback session timeout to 30 minutes.
- [x] Make cube placement fail on a missing provided parent/group by default.
- [x] Require explicit cube IDs for agent modifications by default.
- [x] Allow untextured/placeholder Geometry-stage cube construction.
- [x] Define persistent `.bbmodel` stage checkpoint paths and requirements.
- [ ] Add an MCP tool that saves persistent project checkpoints automatically.
- [ ] Add standard-view capture automation.
- [ ] Add reference-contract validation automation.
- [x] Add stage-aware tool profiles for Codex orchestration.
- [ ] Enforce stage tool profiles at MCP registration/session level.
- [ ] Add a server-enforced exclusive project write lease.
- [ ] Generate Markdown session summaries automatically from `state.json`.

## P2 — Development Reliability

- [x] Narrow the build watcher so runtime/reference/evidence changes do not rebuild the plugin.
- [x] Fix duplicate `dev:watch` build chaining.
- [x] Add Bun tests for state, stage profiles, review evidence, and reference intake.
- [x] Add typecheck/test/build/docs CI.
- [x] Return structured MCP results from the updated cube tools.
- [ ] Add runtime tests for strict group, explicit ID, and untextured cube execution inside Blockbench.
- [ ] Run CI on `Rework` and fix any type/build/docs failures.

## Acceptance Checks

- [x] Reference intake accepts `PRODUCTION_CONTEXT.md`, one Reference Visual, four category docs, manifest, and handoff.
- [x] Geometry ends with five-view preview and user review.
- [x] Texture ends with atlas/model preview and user review.
- [x] Animation is skipped when not required and reviewed when required.
- [x] Final Validation waits for user approval or correction request.
- [x] No internal pass asks for separate routine approval.
- [x] One-issue-per-cycle applies to revisions, not initial bounded construction.
- [x] Final output contract includes `.bbmodel`, textures, evidence, completed validation, and revision summary.
