# MCP Visual-Grounded Geometry Loop

## Purpose

Geometry must match the approved Reference Visual, not merely satisfy cube count, bounds, or hierarchy checks. The workflow therefore combines:

1. Codex inspection of real image payloads;
2. fixed-scale transformed-cuboid diagnosis;
3. structural and rotation validation;
4. explicit user review before Texture.

## One Geometry profile

All Geometry work uses:

```text
BEDROCK_CUBOID_GEOMETRY
```

There is no separate Geometry rework profile. `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal diagnosis scopes only. Codex remains in the same MCP session and profile for both.

## Practical flow

```text
get_stage_context
→ rebind_active_project_identity when required
→ manage_project_write_lease acquire
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ edit diagnosed parts
→ repeat affected-view checks as needed
→ final five-view capture and diagnosis
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ user review
```

`submit_geometry_for_review` runs fresh Geometry contract validation, uses its embedded review-readiness result, creates the next unused non-approved Geometry review checkpoint, atomically updates state to `GEOMETRY_REVIEW`, and returns `AWAIT_GEOMETRY_REVIEW`.

Codex follows `next_safe_operation` from compact stage context. The user is not asked to edit JSON, choose checkpoint filenames, switch profiles, or reconnect between revision scopes.

## Project identity

Blockbench may assign a new runtime UUID after reopening a project. When this happens, `rebind_active_project_identity` verifies the asset, path, format, Geometry fingerprint, Reference Visual hash, state revision, and absence of an active lease before atomically updating `state.json` and `project.json`.

This metadata synchronization:

- does not modify the model;
- does not need a write lease;
- does not require a profile switch;
- does not require reconnecting.

After synchronization, Codex acquires the normal Geometry write lease.

## Revision preparation

When a fresh diagnosis returns:

```text
REVISION_REQUIRED
LOCAL_REPAIR or MAJOR_FORM_REVISION
```

Codex calls `prepare_geometry_visual_rebuild` in the current Geometry profile. Despite its compatibility name, this tool prepares either revision scope. It:

- accepts Geometry currently in progress or awaiting user review;
- returns review-state Geometry to `GEOMETRY_IN_PROGRESS` before mutation;
- preserves project identity, primary masses, and all checkpoints;
- keeps structural detail by default;
- rejects structural-detail removal for `LOCAL_REPAIR`;
- optionally removes only machine-classified structural detail for an explicit major revision;
- records the diagnosed revision scope;
- advances the write lease and state revision together;
- continues with `CONTINUE_GEOMETRY`;
- requires no profile switch or reconnect.

After the user gives targeted revision feedback, Codex first captures and diagnoses the affected views, then calls the preparation tool. It does not edit the model while the main workflow still says `GEOMETRY_REVIEW`.

## Internal progress markers

`PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are progress markers, not separate user gates.

They help Codex work coarse-to-fine, but do not require a new MCP profile. Two non-improving comparisons set an attention flag; they do not permanently lock Geometry.

Any mutation after `FINAL_REVIEW_READY` makes the old evidence stale and automatically returns the runtime to working state.

## Visual diagnosis

`analyze_geometry_views` uses:

- transformed cuboid projection;
- the approved coordinate envelope;
- a fixed center axis and ground line;
- no free rescaling of the current model;
- silhouette IoU;
- row and column profile comparison;
- fixed-scale bounds and edge displacement;
- weighted semantic regions;
- blocking ground and extent diagnostics.

A high average score cannot override a blocking semantic, extent, or ground failure.

The analyzer returns a revision scope, not a required profile transition.

Generic Geometry contract validation—including Geometry issues found during Final Validation—is normalized to `BEDROCK_CUBOID_GEOMETRY`; Codex then uses `analyze_geometry_views` to classify the internal revision scope.

## Image transport

Use `inspect_reference_visual_preview`. It verifies the original Reference Visual SHA-256 and dimensions, then returns a bounded ephemeral JPEG or PNG preview.

The original file remains the authority. The legacy multi-megabyte original-image response is not exposed in normal production.

## Mutation and rotation

Use:

- `place_cubes_safe` for unrotated placement;
- `modify_cubes` for unrotated edits;
- `rotate_cube_about_attachment` for every non-zero rotation.

Direct rotation through generic cube tools is blocked. Contract-driven rotation validates axis, angle, pivot, direction, declared connection, and affected-view score, with rollback on regression.

## Review readiness and submission

`validate_geometry_contract` includes the current review-readiness result and requires:

- all five canonical views;
- current fixed-scale metrics;
- current Codex multimodal review;
- matching project UUID and Geometry fingerprint;
- the actual approved Reference Visual hash;
- safe rotations and pivots;
- no stale evidence after model mutation.

A structural pass alone is not a visual pass.

Codex does not manually save a review checkpoint and then separately edit workflow state. `submit_geometry_for_review` validates, performs the guarded checkpoint and state transition as one operation, advances the lease revision, and removes the newly created checkpoint if the coordinated transition fails.

## User-facing gates

Only meaningful review gates are user-facing:

```text
GEOMETRY_REVIEW
TEXTURE_REVIEW
ANIMATION_REVIEW when required
FINAL_REVIEW
```

Internal Geometry corrections do not create additional user approval moments.

## Verification

```text
bun run skills:check
bun run typecheck
bun test
bun run build
```

Regression coverage verifies one-profile Geometry exposure, lease-exempt guarded identity synchronization, lease-required model mutation, local and major revision preparation, fixed-scale visual rejection, automatic Geometry review submission, Final Validation repair normalization, strict final review, adapter synchronization, and bounded tool counts.
