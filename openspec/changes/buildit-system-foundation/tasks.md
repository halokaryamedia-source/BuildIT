# Tasks: BuildIT System Foundation

Tasks are tracer bullets through public seams. A checked documentation task does not imply runtime readiness.

## 1. Domain model and decisions

- [x] Add root bounded-context map.
- [x] Add Reference Design glossary.
- [x] Add Asset Production glossary.
- [x] Add Agent Orchestration glossary.
- [x] Add Workflow Governance glossary.
- [x] Record domain-owned control-plane ADR.
- [x] Record RouteLLM evaluation-boundary ADR.
- [x] Add system foundation architecture.
- [x] Add comprehensive foundation audit.
- [ ] Review and approve the selected public module interfaces.

## 2. Authority coherence

- [ ] Replace linear authority order in active skill registry with domain ownership.
- [ ] Update repository development bootstrap to route by Task Kind.
- [ ] Update Engineering Discipline skill and host adapters to domain ownership.
- [ ] Update Code Review Graph skill and host adapters to remove subordinate-hierarchy wording.
- [ ] Update root README and AGENTS rules.
- [ ] Update development support decision document.
- [ ] Update Governance to identify one owner per rule class.
- [ ] Remove stale manual identity/lease instructions from State Machine and Ponytail.
- [ ] Mark `codex-local-workflow-rework` as implementation history for new foundation decisions.
- [ ] Add CI tests that fail on reintroduced stale authority language.

## 3. Workspace behavior seam

- [ ] Define behavior fixtures for prepare/load/complete/reopen.
- [ ] Test workspace bootstrap using a real temporary directory.
- [ ] Test duplicate image basenames and path traversal rejection.
- [ ] Test malformed/corrupt package handling.
- [ ] Add fault injection for copy, metadata write, promotion, index update, and rollback.
- [ ] Verify transaction behavior on Windows.
- [ ] Add recovery journal or equivalent proven recovery mechanism.

## 4. Production snapshot and façade

- [ ] Define `production_snapshot` contract.
- [ ] Add one read-only public operation returning stage, progress, blockers, review state, and next safe operation.
- [ ] Define `start_asset` façade behavior through the existing package/bootstrap implementation.
- [ ] Define `continue_asset` façade behavior.
- [ ] Define `submit_current_stage` façade behavior.
- [ ] Define `apply_review_decision` façade behavior.
- [ ] Define `finalize_asset` façade behavior.
- [ ] Move normal skills to façade operations as each slice is proven.
- [ ] Keep low-level coordination tools diagnostic/internal.

## 5. Evidence and testing quality

- [ ] Classify current tests as behavior, contract, marker, golden, or E2E.
- [ ] Identify critical claims proven only by source markers.
- [ ] Replace the first critical marker-only claim with a behavior test.
- [ ] Repeat by risk until runtime and workspace safety claims have behavior coverage.
- [ ] Add independent expected-value fixtures for Geometry validation.
- [ ] Add evidence invalidation/rebinding behavior tests.
- [ ] Add user-facing error mapping tests.

## 6. Real Blockbench acceptance

- [ ] Specify Windows-first acceptance environment and versions.
- [ ] Automate plugin installation or controlled loading.
- [ ] Capture deterministic plugin/MCP readiness logs.
- [ ] Run create/save/close/reopen/export through Blockbench.
- [ ] Validate output model and textures after reopen.
- [ ] Prove stage review and revision round trip.
- [ ] Prove final workspace promotion.
- [ ] Make the harness repeatable by another developer.

## 7. Multi-archetype quality corpus

- [ ] Define corpus schema and expected contracts.
- [ ] Add low/wide quadruped fixture.
- [ ] Add tall quadruped fixture.
- [ ] Add biped fixture.
- [ ] Add asymmetric fixture.
- [ ] Add mechanical fixture.
- [ ] Add simple block fixture.
- [ ] Add required-animation fixture.
- [ ] Add multi-rotation attachment fixture.
- [ ] Record pass/fail, corrections, time, calls, and user revisions.

## 8. Model routing foundation

- [ ] Define machine-readable Task and Execution Plan contracts.
- [ ] Extract current deterministic routing as `DeterministicBaselineSelector` behavior.
- [ ] Build representative routing fixture dataset.
- [ ] Define protected and single-candidate Task Kinds.
- [ ] Prototype whether current Codex/provider mode can use a RouteLLM-compatible adapter without losing required features.
- [ ] Record prototype decision.
- [ ] Run RouteLLM offline against the fixture dataset.
- [ ] Calibrate the selected strong/weak pair on BuildIT data.
- [ ] Compare quality, corrections, latency, tokens, and cost.
- [ ] Add shadow recommendations only if offline acceptance passes.
- [ ] Promote to controlled read-only runtime only through a later explicit decision.

## 9. Observability and operations

- [ ] Define privacy-safe production run summary.
- [ ] Record MCP calls, stage-context bytes, retries, model routes, correction cycles, and elapsed time.
- [ ] Define internal service targets after initial corpus runs.
- [ ] Add installer check/repair/uninstall path.
- [ ] Add threat model for local plugin, filesystem, packages, and model-provider secrets.
- [ ] Add release qualification checklist.

## 10. Foundation completion

- [ ] Full skill synchronization passes.
- [ ] Typecheck passes.
- [ ] All tests pass.
- [ ] Build and bundle verification pass.
- [ ] Standards review completes with no unaccepted critical finding.
- [ ] Spec review confirms all foundation acceptance criteria.
- [ ] User approves the foundation interfaces and next implementation frontier.
