# Tasks: Codex Local Workflow Rework

## Completed foundation

- [x] Keep active work isolated on `Rework`.
- [x] Use one `mcp-blockbench/` package root.
- [x] Use one runtime state authority and one workspace selection index.
- [x] Separate user-facing `blockbench/` from internal `mcp/` data.
- [x] Use Geometry, Texture, optional Animation, and Final Validation review stages.
- [x] Add exact stage/repair tool profiles and synchronized production skills.
- [x] Add persistent checkpoints, stable evidence, direct texture evidence, atomic stage completion, and write-lease protection.
- [x] Add active/completed workspace lifecycle and immutable completed baselines.
- [x] Replace the old four-sheet package with one Reference Visual plus Markdown/JSON contracts.

## Geometry quality implementation

- [x] Return the approved Reference Visual as an MCP image payload.
- [x] Return clean current-model visual feedback images.
- [x] Add transformed cube/group world-space bounds.
- [x] Add fixed approved-scale cuboid projection with no current-model free rescale.
- [x] Add global silhouette, profile, bounding-box, and semantic-region metrics.
- [x] Add actionable view/region/direction/magnitude/part recommendations.
- [x] Add Black Rhinoceros built-in compatibility profile keyed by approved Reference Visual hash.
- [x] Add manifest-extensible panel, region, part, and rotation contracts.
- [x] Add enforced `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` runtime phases.
- [x] Block horns, ears, final feet, tail, and detail during `PRIMARY_FORM`.
- [x] Add two-cycle convergence tracking and `VISUAL_CONVERGENCE_FAILED`.
- [x] Apply Geometry guards to `GEOMETRY_VISUAL_REBUILD`.
- [x] Add `rotate_cube_about_attachment` with pivot, axis/range, direction, connection, before/after score, and rollback.
- [x] Reject direct non-zero rotation through generic Geometry cube tools.
- [x] Add strict five-view/current-hash/current-fingerprint review readiness.
- [x] Add transformed Geometry contract validation and strict `geometry_report.json` statuses.
- [x] Remove generic Geometry completion bypass and preserve lease/session transition behavior.
- [x] Require final validation to re-check current Geometry readiness.
- [x] Add repository-level legacy-context rejection.

## Documentation and package alignment

- [x] Update canonical Production and Geometry skills.
- [x] Synchronize `.agents` and `.codex` Production/Geometry skills.
- [x] Update Validation skill and adapters.
- [x] Update Codex bootstrap and repository agent rules.
- [x] Update tool and stage profiles.
- [x] Register Geometry diagnosis, rotation, validation, review, and completion tools in runtime and docs manifests.
- [ ] Update Reference Studio manifest template with mandatory non-zero crops, weighted regions, part constraints, and rotation contracts.
- [ ] Update Black Rhinoceros handoff and Geometry contract to name the final analyzer/rotation/validator flow.

## Regression coverage before testing

- [ ] Add pure projection tests proving fixed scale and ground alignment.
- [ ] Add profile tests proving Geometry profiles expose only guarded tools.
- [ ] Add phase tests proving detail is blocked during primary form.
- [ ] Add rotation-contract tests for axis, direction, connection, and rollback markers.
- [ ] Add negative fixture test proving the failed Black Rhinoceros checkpoint cannot pass Geometry quality gates.
- [ ] Add positive synthetic projection test.
- [ ] Add gate tests for missing views, stale fingerprints, wrong Reference Visual hash, and legacy analyzer output.
- [ ] Confirm skill adapters are byte-identical to canonical skills.

## Final test step — do only after implementation is complete

- [ ] Run `bun install --frozen-lockfile`.
- [ ] Run `bun run skills:check`.
- [ ] Run full `bun run typecheck`.
- [ ] Run all `bun test` tests.
- [ ] Run `bun run build` and confirm `dist/mcp.js` exists.
- [ ] Inspect the `MCP Verify` workflow result for the final branch head.
- [ ] Fix every failure and repeat until all static gates pass.
- [ ] Reload `dist/mcp.js` locally.
- [ ] Run one controlled Black Rhinoceros Geometry dry run.
- [ ] Confirm bad Geometry is diagnosed with specific failing views/regions/parts instead of generic mismatch text.
- [ ] Confirm unsafe rotation is rejected or rolled back.
- [ ] Confirm non-improving cycles stop.
- [ ] Confirm Geometry cannot reach review or approval without all current evidence.

## Deferred until explicit integration approval

- [ ] Merge into `V1`.
- [ ] Release or deployment.
- [ ] Persistent live MCP sessions.
- [ ] Unrelated modelling capability expansion.
- [ ] Duplicate or versioned workflow authorities and outputs.
