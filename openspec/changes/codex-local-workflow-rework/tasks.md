# Tasks: Codex Local Workflow Rework

## Completed foundation

- [x] Keep active work isolated on `Rework`.
- [x] Use one `mcp-blockbench/` package root.
- [x] Use one runtime state authority and one workspace selection index.
- [x] Separate user-facing `blockbench/` from internal `mcp/` data.
- [x] Use Geometry, Texture, optional Animation, and Final Validation review stages.
- [x] Add persistent checkpoints, stable evidence, direct texture evidence, atomic stage completion, and write-lease protection.
- [x] Add active/completed workspace lifecycle and immutable completed baselines.
- [x] Replace the old four-sheet package with one Reference Visual plus Markdown/JSON contracts.

## Geometry quality implementation

- [x] Return the approved Reference Visual through bounded MCP preview transport while preserving source hash authority.
- [x] Return clean current-model visual feedback images.
- [x] Add transformed cube/group world-space bounds.
- [x] Add fixed approved-scale cuboid projection with no current-model free rescale.
- [x] Add global silhouette, profile, bounding-box, semantic-region, edge, and ground metrics.
- [x] Add actionable view/region/direction/magnitude/part recommendations.
- [x] Add Black Rhinoceros built-in compatibility profile keyed by approved Reference Visual hash.
- [x] Add manifest-extensible panel, region, part, and rotation contracts.
- [x] Use one `BEDROCK_CUBOID_GEOMETRY` profile for setup, diagnosis, revision, validation, review submission, and approval.
- [x] Make `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` advisory progress markers rather than user-facing gates.
- [x] Treat `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` as internal diagnosis scopes.
- [x] Add safe project identity synchronization before write-lease acquisition.
- [x] Keep local and major revision preparation inside the current Geometry profile/session.
- [x] Return user-requested Geometry revisions from `GEOMETRY_REVIEW` to `GEOMETRY_IN_PROGRESS` before mutation.
- [x] Keep existing structural detail by default and permit broad detail removal only for explicit major revision.
- [x] Advance revision state and write lease together with rollback handling.
- [x] Replace convergence hard-locking with an attention flag.
- [x] Add `rotate_cube_about_attachment` with pivot, axis/range, direction, connection, before/after score, and rollback.
- [x] Reject direct non-zero rotation through generic Geometry cube tools.
- [x] Add strict five-view/current-hash/current-fingerprint review readiness.
- [x] Add transformed Geometry contract validation and strict `geometry_report.json` statuses.
- [x] Add `submit_geometry_for_review` to validate, create the next unused review checkpoint, update the lease revision, and atomically enter `GEOMETRY_REVIEW`.
- [x] Normalize generic Geometry revision results—including Geometry issues found during Final Validation—back to `BEDROCK_CUBOID_GEOMETRY` with internal scope classification.
- [x] Remove generic Geometry completion bypass and preserve lease/session transition behavior.
- [x] Require final validation to re-check current Geometry readiness.
- [x] Add repository-level legacy-context rejection.

## Documentation and package alignment

- [x] Update canonical Production and Geometry skills.
- [x] Synchronize `.agents` and `.codex` Production/Geometry skills.
- [x] Update Validation skill and adapters.
- [x] Update Codex bootstrap and repository agent rules.
- [x] Update tool and stage profiles.
- [x] Register Geometry diagnosis, identity, rotation, validation, review submission, and completion tools in runtime and docs manifests.
- [x] Update Reference Studio manifest template with non-zero crops, weighted regions, part constraints, rotation contracts, bounded image transport, and one Geometry profile.
- [x] Update Black Rhinoceros handoff and Geometry architecture documentation.
- [x] Update OpenSpec/Ponytail to reject separate Geometry rework profiles and unnecessary reconnects.

## Regression coverage before local testing

- [x] Add pure projection tests proving fixed scale and ground alignment.
- [x] Add profile tests proving one Geometry profile exposes only guarded tools.
- [x] Add identity tests proving metadata synchronization is lease-exempt but model mutation is not.
- [x] Add tests proving internal progress markers do not hard-lock Geometry.
- [x] Add rotation-contract tests for axis, direction, connection, and rollback markers.
- [x] Add negative fixture test proving the failed Black Rhinoceros checkpoint cannot pass Geometry quality gates.
- [x] Add positive synthetic projection test.
- [x] Add gate tests for missing views, stale fingerprints, wrong Reference Visual hash, and legacy analyzer output.
- [x] Add review-flow tests for tool exposure, bounded profile size, automatic review routing, review-to-revision state restoration, and Final Validation Geometry routing.
- [x] Confirm skill adapters are byte-identical to canonical skills.

## Final local verification — after GitHub implementation is complete

- [ ] Pull `Rework` once on the local workstation.
- [ ] Run `bun install --frozen-lockfile`.
- [ ] Run `bun run skills:check`.
- [ ] Run full `bun run typecheck`.
- [ ] Run all `bun test` tests.
- [ ] Run `bun run build` and confirm `dist/mcp.js` exists.
- [ ] Load the new plugin binary once.
- [ ] Run one controlled Black Rhinoceros Geometry production flow through Codex.
- [ ] Confirm Codex synchronizes project identity without user JSON edits or profile switching.
- [ ] Confirm bad Geometry is diagnosed with specific failing views/regions/parts.
- [ ] Confirm local and major corrections stay in `BEDROCK_CUBOID_GEOMETRY` without reconnecting.
- [ ] Confirm review feedback returns to `GEOMETRY_IN_PROGRESS` before any model mutation.
- [ ] Confirm `submit_geometry_for_review` creates a unique review checkpoint and enters `GEOMETRY_REVIEW` without user file edits.
- [ ] Confirm unsafe rotation is rejected or rolled back.
- [ ] Confirm Geometry cannot reach review or approval without all current evidence.

## Deferred until explicit integration approval

- [ ] Merge into `V1`.
- [ ] Release or deployment.
- [ ] Persistent live MCP sessions.
- [ ] Unrelated modelling capability expansion.
- [ ] Duplicate or versioned workflow authorities and outputs.
