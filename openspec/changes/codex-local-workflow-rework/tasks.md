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

## Adaptive model routing

- [x] Add project Codex defaults for Terra Medium with concise output and no controller hop for normal implementation.
- [x] Lock subagent concurrency to two threads and depth one.
- [x] Add `routine_auditor` on 5.4 Mini Low for read-only mechanical work.
- [x] Add `mcp_builder` on Terra Medium as the fallback sole writer when the parent is not the selected Terra writer or isolation is materially safer.
- [x] Add `visual_director` on Sol Medium for read-only visual judgment.
- [x] Add rare `critical_reviewer` on Sol High with explicit reason codes.
- [x] Set High as the maximum configured effort; forbid xhigh, Extra High, Max, Ultra, and recursive delegation.
- [x] Add deterministic task classification, parent-model mismatch handling, compact Sol decision packets, escalation, and de-escalation rules.
- [x] Require one selected Blockbench writer and prohibit parallel model mutations.
- [x] Route deterministic checks away from Sol.
- [x] Avoid persistent routing telemetry until benchmark data proves it is needed.

## Documentation and package alignment

- [x] Update canonical Production and Geometry skills.
- [x] Synchronize `.agents` and `.codex` Production/Geometry skills.
- [x] Update Validation skill and adapters.
- [x] Update Codex bootstrap and repository agent rules.
- [x] Update tool and stage profiles.
- [x] Register Geometry diagnosis, identity, rotation, validation, review submission, and completion tools in runtime and docs manifests.
- [x] Update Reference Studio manifest template with non-zero crops, weighted regions, part constraints, rotation contracts, bounded image transport, and one Geometry profile.
- [x] Update Black Rhinoceros handoff and Geometry architecture documentation.
- [x] Update OpenSpec/Ponytail to reject separate Geometry rework profiles, unnecessary reconnects, stale workspace/package paths, and wasteful model routing.

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
- [x] Add model-routing tests for config, locked agent models/efforts, one writer, forbidden effort levels, and adapter policy.
- [x] Add authority-alignment tests for OpenSpec, package version, canonical workspace/package roots, and deployment workflow paths.
- [x] Confirm existing skill adapters are byte-identical to canonical skills.

## Automated repository verification — complete on GitHub

- [x] Install dependencies with `bun install --frozen-lockfile`.
- [x] Run `bun run skills:check`.
- [x] Run full `bun run typecheck`.
- [x] Run all `bun test` tests.
- [x] Run `bun run build` and confirm `dist/mcp.js` exists.
- [x] Verify the committed `dist/mcp.js` matches the exact source/package version and one-session runtime markers.

## Pre-acceptance hardening P0–P2

- [x] Remove legacy Reference Studio tool names and numbered-sheet handoff authority.
- [x] Keep upstream revisions in the same MCP/Codex session with no reconnect.
- [x] Return only the canonical Geometry profile plus internal revision scope.
- [x] Strengthen transformed part, count, parent, symmetry, Texture, and Animation quality enforcement.
- [x] Retain meaningful detached reference details during foreground segmentation.
- [x] Require conditional Right Side visual evidence for explicitly asymmetric assets and cover multiple positive archetypes.
- [x] Synchronize the ChatGPT Reference Studio candidate flow, schema 3.3 templates, and the complete manifest-backed Black Rhinoceros Golden Sample.
- [x] Make unrelated extended capabilities opt-in and suppress routine diff image payloads.
- [x] Return deterministic model-route guidance from existing stage context without an extra routing call.

## Final flow-efficiency audit

- [x] Replace Geometry-centric Ponytail scope with one upstream-to-downstream minimum-sufficient path.
- [x] Lock exactly two routine ChatGPT approval moments and automatic technical package delivery.
- [x] Make the Golden Sample a mandatory visual/technical template without copying its subject identity.
- [x] Remove active four-sheet and multi-approval instructions from the Reference Studio skill folder.
- [x] Make manifest executable data authoritative over duplicated Markdown arrays.
- [x] Run runtime status once and stage context only at entry/transition/revision.
- [x] Prevent first-pass analysis of blank Geometry and return the next operation from Reference Visual inspection.
- [x] Make Sol visual judgment conditional instead of mandatory.
- [x] Remove duplicate happy-path validation before stage submission.
- [x] Use one evidence-free Final Validation preflight before final outputs and one evidence-aware validation inside submission.
- [x] Require asymmetric Right Side before Geometry runtime reaches final-ready status.
- [x] Expand the final acceptance contract from Geometry-only to ChatGPT package through final workspace completion.
- [x] Add permanent regression tests for authority, call budgets, zero-start branching, validation ownership, and full stage routing.
- [x] Remove the built-in Black Rhinoceros runtime fallback so the imported manifest is the only executable Geometry authority.
- [x] Compact stage context by removing duplicated visual-grounding payloads and static legacy marker lists.
- [x] Make optional model-role discovery lazy and non-blocking.
- [x] Freeze speculative pre-local expansion until measured local evidence exists.

## Minecraft-only Reference Studio P0 correction

- [x] Classify the failed giraffe simulation as a reproducible upstream P0 rather than a Geometry-system redesign.
- [x] Lock the source image to subject identity only and the Golden Sample to Minecraft cuboid construction/presentation.
- [x] Remove realistic, semi-realistic-render, cinematic, generic-voxel, and alternate-style branches.
- [x] Forbid visual-style and stylization-level questions during intake.
- [x] Require varied cuboid dimensions, planned masses, stepped transitions, and limited purposeful one-axis rotations.
- [x] Reject pixel-texture-only realistic subjects, smooth organic forms, uniform cube stacking, and arbitrary rotation noise.
- [x] Lock bilateral panel positions and facing directions to the Golden Sample.
- [x] Add hidden Minecraft-style QA before the Reference Visual is shown to the user.
- [x] Permit at most one blocking correction of the same image and prohibit a regenerate loop.
- [x] Preserve the existing Geometry, rotation-contract, manifest, Codex, and MCP implementation unchanged.
- [x] Add permanent regression coverage for the Minecraft-only prompt, QA codes, camera positions, no-style-question rule, and single linear flow.
- [x] Reapply the pre-local expansion freeze after this P0 correction.

## Local feedback recovery — Geometry P0

- [x] Convert PRIMARY_FORM from wording-only guidance into an internal mutation boundary.
- [x] Block structural-detail and unclassified cuboids before primary-form readiness.
- [x] Add deterministic `verify_primary_form_ready` for primary parts, rotations, views, extents, ground contacts, and cube budget.
- [x] Add adaptive Reference Visual foreground segmentation.
- [x] Permit rotation structural fallback when visual segmentation is temporarily unavailable, while still requiring fresh analysis before readiness.
- [x] Persist the canonical `.bbmodel` at creation and phase boundaries.
- [x] Increase Codex MCP startup/tool timeouts and add bounded readiness retries.
- [x] Remove stale stage-transition reconnect wording.
- [x] Reconcile Animation requirement from the imported manifest.
- [ ] Retest the giraffe from a clean primary-form rebuild; do not continue the failed 39-cube geometry as the quality baseline.

## Final local Blockbench acceptance — remaining on the workstation

- [ ] Pull the final `Rework` head once on the local workstation.
- [ ] Confirm `.codex/config.toml` is accepted by the installed Codex version.
- [ ] Optional role discovery is non-blocking; record which roles are available, but do not fail acceptance when the documented parent fallback works.
- [ ] Load the new plugin binary once.
- [ ] Run one controlled Black Rhinoceros Geometry production flow through Codex.
- [ ] Confirm parent model mismatch is handled without asking the user to select worker models.
- [ ] Confirm exactly one selected Terra writer acquires the active Blockbench write lease.
- [ ] Confirm routine checks use Mini, normal implementation uses the Terra parent or fallback `mcp_builder`, and Sol is limited to visual judgment.
- [ ] Confirm Sol High is not invoked during the normal successful flow.
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
- [ ] Persistent model-routing telemetry or learned routing service.
- [ ] Unrelated modelling capability expansion.
- [ ] Duplicate or versioned workflow authorities and outputs.
- [ ] Any additional Reference Studio style, sheet, approval, prompt variant, or regeneration mode.
