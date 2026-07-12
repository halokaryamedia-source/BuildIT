---
name: blockbench-geometry
description: "Visual-grounded Minecraft Bedrock cuboid Geometry skill. Uses one Geometry profile and one MCP session for identity sync, diagnosis, local or major revision, automatic review submission, validation, and approval."
---

# Blockbench Geometry

Use only for stage `GEOMETRY` with profile:

```text
BEDROCK_CUBOID_GEOMETRY
```

There are no separate `GEOMETRY_LOCAL_REPAIR` or `GEOMETRY_VISUAL_REBUILD` profiles. `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal diagnosis scopes handled by Codex in the current session.

## Start

Call `get_stage_context` and follow `next_safe_operation`.

The normal sequence is:

```text
get_stage_context
→ rebind_active_project_identity when required
→ manage_project_write_lease acquire
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ edit diagnosed parts
→ final five-view review
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
```

`submit_geometry_for_review` runs fresh Geometry contract validation with its embedded review-readiness gate, saves the next unused non-approved Geometry review checkpoint, and updates workflow state. Codex must not ask the user to edit state files or choose a checkpoint name.

Do not ask the user to edit workspace JSON, switch profiles, close the model, or reconnect between Geometry revision scopes. Codex performs the available operation directly.

## Identity synchronization

A reopened Blockbench project may have a new runtime UUID. When compact context reports `rebind_required`:

1. call `rebind_active_project_identity` before acquiring a lease;
2. use the exact runtime UUID, stored UUID, state revision, Geometry fingerprint, and Reference Visual SHA-256;
3. continue in the same profile and session;
4. acquire the lease using the new revision and UUID.

The rebind tool may update only `state.json` and `project.json`. It must not change Geometry.

## Visual grounding

Use `inspect_reference_visual_preview`. It verifies the original Reference Visual SHA-256 and dimensions while returning a bounded ephemeral preview. Never request the original multi-megabyte image through normal MCP production.

Geometry quality requires all three:

1. Codex visual inspection of actual Reference and current-model image payloads;
2. fixed-scale diagnosis from `analyze_geometry_views`;
3. structural validation from `validate_geometry_contract`.

A structural pass alone is not a visual pass.

## Diagnosis and revision

`analyze_geometry_views` must identify:

- failing views and semantic regions;
- missing or excessive silhouette;
- affected parts;
- correction direction and approximate magnitude;
- `LOCAL_REPAIR` or `MAJOR_FORM_REVISION` scope.

Modify only the implicated parts. Do not compensate for one incorrect mass by changing unrelated detail.

`prepare_geometry_visual_rebuild` is the compatibility name for preparing any diagnosed Geometry revision. It accepts a fresh `LOCAL_REPAIR` or `MAJOR_FORM_REVISION` diagnosis in the current profile and:

- returns `GEOMETRY_REVIEW` to `GEOMETRY_IN_PROGRESS` when the user requests revision;
- preserves all checkpoints, primary masses, and project identity;
- keeps structural detail by default;
- allows structural-detail removal only for an explicit major revision;
- advances the current lease and state revision together;
- continues normal Geometry work without profile switching or reconnecting.

For revision feedback received during `GEOMETRY_REVIEW`, capture and diagnose the affected views first, then call `prepare_geometry_visual_rebuild` with the fresh fingerprint and Reference Visual hash. Do not mutate while leaving the main workflow in review state.

Generic validation may report that Geometry needs revision, but it must route back to `BEDROCK_CUBOID_GEOMETRY`. Use `analyze_geometry_views` to classify the internal repair scope; never activate a removed repair profile.

## Internal progress markers

`PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are internal progress markers, not user approval gates.

Use coarse-to-fine work as a practical order:

1. body, shoulder, rear taper, neck, head, muzzle, legs, and ground relationship;
2. horns, ears, feet, tail, hierarchy, and connection cleanup;
3. final evidence.

Codex may repair related parts in the same profile. Two non-improving checks set an attention flag but do not lock the model or require a new profile.

Any mutation after `FINAL_REVIEW_READY` automatically invalidates old review readiness and returns Geometry to working state.

## Mutation tools

Use:

- `place_cubes_safe` for unrotated new cubes;
- `modify_cubes` for unrotated changes;
- `rotate_cube_about_attachment` for every non-zero rotation.

Direct non-zero rotation through generic cube tools is forbidden. Rotation must validate pivot, axis, direction, connection, and affected-view score.

Prefer one bounded atomic edit for one diagnosed issue. Use only affected views during correction.

## Final review

Before user review:

1. capture Front, Left, Back, Top, and Front-left 3/4;
2. inspect all image payloads;
3. run `analyze_geometry_views` for all five views;
4. record the multimodal decision;
5. call `submit_geometry_for_review`.

The submission tool runs fresh structural and visual validation, creates a new unique non-approved checkpoint, changes state to `GEOMETRY_REVIEW`, keeps the Geometry lease current, and returns `AWAIT_GEOMETRY_REVIEW` without reconnecting.

Final Geometry passes only when current visual evidence, fixed-scale metrics, structural validation, Reference Visual identity, Geometry fingerprint, standard views, and rotation audit all pass.

## Efficiency and UX

- Inspect the Reference Visual preview once unless its hash changes.
- Reuse compact context and fresh diagnosis.
- Do not reload long contracts without a real conflict.
- Do not create extra reference images.
- Do not ask for manual file edits or repeated restarts.
- Stop only for a real authority conflict, unavailable MCP endpoint, unsafe mutation, stale evidence that cannot be regenerated, failed final review, or required user approval.
