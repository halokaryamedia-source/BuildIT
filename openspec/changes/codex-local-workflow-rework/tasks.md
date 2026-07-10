# Tasks: Codex Local Workflow Rework

## P0 — Workflow Alignment

- [x] Create branch `Rework` from `V1`.
- [x] Add `Engine/codex/BOOTSTRAP.md`.
- [x] Add machine-readable state template.
- [x] Add stage-specific profiles.
- [ ] Replace legacy eight-sheet requirements with the approved reference package format.
- [ ] Replace eight user-visible phases with Geometry, Texture, optional Animation, and Final Validation.
- [ ] Update all stage review and transition rules.
- [ ] Update active project/session state guidance.
- [ ] Remove absolute local filesystem links from active workflow documents.

## P1 — Runtime Efficiency

- [ ] Make `state.json` the runtime authority; generate Markdown summaries from it.
- [ ] Add or document one-time preflight behavior.
- [ ] Increase session inactivity timeout for Codex planning cycles.
- [ ] Make cube placement fail on missing parent by default.
- [ ] Require explicit cube IDs for agent modifications by default.
- [ ] Allow untextured/placeholder geometry construction.
- [ ] Add persistent `.bbmodel` stage checkpoints.
- [ ] Add standard-view capture automation.
- [ ] Add reference-contract validation automation.
- [ ] Add stage-aware tool exposure or active tool profiles.

## P2 — Development Reliability

- [ ] Narrow the build watcher to source/build inputs.
- [ ] Fix duplicate `dev:watch` build chaining.
- [ ] Add Bun tests for state, manifest, strict parent behavior, stage profiles, and reference intake.
- [ ] Add typecheck/test/build/docs CI.
- [ ] Return structured MCP results for new workflow tools.

## Acceptance Checks

- [ ] Reference intake accepts `PRODUCTION_CONTEXT.md`, one Reference Visual, four category docs, manifest, and handoff.
- [ ] Geometry ends with five-view preview and user review.
- [ ] Texture ends with atlas/model preview and user review.
- [ ] Animation is skipped when not required and reviewed when required.
- [ ] Final Validation waits for user approval or correction request.
- [ ] No internal pass asks for separate routine approval.
- [ ] One-issue-per-cycle applies to revisions, not initial bounded construction.
- [ ] Final output includes `.bbmodel`, textures, evidence, completed validation, and revision summary.
