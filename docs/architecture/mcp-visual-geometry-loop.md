# MCP Visual-Grounded Geometry Loop

## Goal

Geometry must match the approved Reference Visual, not merely pass cube-count, bounds, or hierarchy checks.

The production loop combines:

1. actual image inspection by Codex;
2. fixed-scale transformed-cuboid diagnosis;
3. structural and rotation validation;
4. explicit user review.

## One profile and session

All Geometry work uses `BEDROCK_CUBOID_GEOMETRY`.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes. They do not create additional profiles, user gates, or reconnects.

## Normal flow

```text
get_stage_context
→ rebind_active_project_identity when required
→ manage_project_write_lease acquire
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ edit diagnosed parts
→ final five-view evidence
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ user review
```

The user is not asked to edit JSON, choose checkpoint names, switch Geometry profiles, or repeatedly reopen Blockbench.

## Identity synchronization

When Blockbench runtime UUID differs from stored metadata, `rebind_active_project_identity` verifies asset, path, format, fingerprint, Reference Visual hash, state revision, and lease status before updating `state.json` and `project.json` atomically.

The operation is metadata-only and does not require a lease, profile switch, or reconnect.

## Revision authority

Geometry revision may be authorized by either current evidence:

- deterministic fixed-scale metrics with `REVISION_REQUIRED`; or
- a current multimodal `record_geometry_visual_decision` with `REVISION_REQUIRED`, including explicit user feedback.

Both must match current project UUID, Geometry fingerprint, Reference Visual SHA-256, and freshness checks.

This prevents deterministic scores from silently cancelling a user-requested visual change while still blocking stale or unrelated edits.

## Revision preparation

`prepare_geometry_visual_rebuild` is a compatibility name for preparing either internal scope.

It:

- accepts `GEOMETRY_IN_PROGRESS` or `GEOMETRY_REVIEW`;
- returns review-state Geometry to `GEOMETRY_IN_PROGRESS` before mutation;
- preserves checkpoints, primary masses, and project identity;
- keeps detail by default;
- rejects broad detail removal for `LOCAL_REPAIR`;
- permits classified detail cleanup only for an explicit major revision;
- advances state and lease revision together;
- records deterministic or multimodal revision source;
- requires no profile switch or reconnect.

After user feedback:

1. capture and inspect affected views;
2. run fixed-scale diagnosis;
3. use deterministic revision evidence when it fails;
4. when metrics pass but the user still requests a change, record a multimodal revision decision;
5. prepare the revision;
6. mutate only after state returns to `GEOMETRY_IN_PROGRESS`.

## Diagnosis

`analyze_geometry_views` uses transformed cuboids, approved coordinate envelope, fixed scale, center axis, ground line, silhouette/profile metrics, semantic regions, and blocking extent/ground diagnostics.

Free-rescaling current Geometry is forbidden. A high average score cannot override a blocking region, extent, or ground failure.

Generic Geometry issues, including those discovered during Final Validation, are normalized to `BEDROCK_CUBOID_GEOMETRY`. Codex classifies the internal scope with the analyzer.

## Image transport

`inspect_reference_visual_preview` verifies original Reference Visual SHA-256 and dimensions while returning a bounded ephemeral preview. The original multi-megabyte binary is not exposed in normal production.

## Mutation and rotation

Use:

- `place_cubes_safe` for unrotated placement;
- `modify_cubes` for unrotated edits;
- `rotate_cube_about_attachment` for non-zero rotation.

Rotation validates pivot, axis, direction, connection, and affected-view score with rollback on regression.

`PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are progress markers, not user approval gates.

## Automatic review submission

`submit_geometry_for_review` runs fresh `validate_geometry_contract`, requires its embedded review-readiness PASS, creates the next unused non-approved review checkpoint, advances lease and state revision together, and moves workflow state to `GEOMETRY_REVIEW`.

The transition is automatic and does not require reconnecting.

## User-facing gates

Only these are user-facing:

```text
GEOMETRY_REVIEW
TEXTURE_REVIEW
ANIMATION_REVIEW when required
FINAL_REVIEW
```

## Verification

```text
bun run skills:check
bun run typecheck
bun test
bun run build
```

Regression coverage includes one-profile exposure, identity sync, deterministic and multimodal revision authority, review-to-work transition, automatic review submission, Final Validation routing, fixed-scale rejection, rotation safety, adapter synchronization, and bounded tool count.
