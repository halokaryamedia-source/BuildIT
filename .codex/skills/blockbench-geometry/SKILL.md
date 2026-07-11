---
name: blockbench-geometry
description: "Visual-grounded Geometry-stage skill for approved Minecraft Bedrock cuboid assets. Builds coarse-to-fine form, validates cube rotations and pivots, combines deterministic silhouette checks with Codex visual inspection, and stops for user review."
---

# Blockbench Geometry

## Entry

Use only when the active stage is `GEOMETRY`, the current MCP session owns the write lease, and the active profile is one of:

- `BEDROCK_CUBOID_GEOMETRY`
- `GEOMETRY_LOCAL_REPAIR`
- `GEOMETRY_VISUAL_REBUILD`

Call `get_stage_context` first. Use its compact decision lock for routine work. Open full `PRODUCTION_CONTEXT.md`, `GEOMETRY.md`, or manifest sections only when the compact context is missing a required decision or reports a conflict.

## Dual visual rule

Geometry requires both:

1. **Codex multimodal inspection** of the approved Reference Visual and current model images.
2. **Deterministic silhouette/profile comparison** from `compare_reference_views`.

Neither structural validation nor deterministic metrics alone proves visual quality. A final PASS requires both visual layers plus rotation safety.

Call `inspect_reference_visual` once before the first mutation and inspect the returned image payload.

## Coarse-to-fine workflow

```text
get_stage_context
→ inspect_reference_visual
→ PRIMARY_FORM_PLAN
→ PRIMARY_FORM_BUILD
→ capture_visual_feedback: left + front + top
→ compare_reference_views: left + front + top
→ TARGETED_PRIMARY_REPAIR
→ STRUCTURAL_DETAIL
→ capture affected views
→ compare affected views
→ FULL_5_VIEW_VISUAL_FEEDBACK
→ FULL_5_VIEW_DETERMINISTIC_COMPARE
→ record_geometry_visual_result
→ validate_reference_contract
→ verify_geometry_review_ready
→ REVIEW_CHECKPOINT
→ GEOMETRY_REVIEW
```

### Primary form

Build only the silhouette foundation first:

- torso/core mass;
- shoulder/front mass;
- rear mass and taper;
- neck transition;
- head and muzzle;
- four provisional leg columns;
- ground relationship.

Do not spend calls on horns, ears, final feet, tail, or minor segmentation until primary form passes visual comparison in:

- Left Side;
- Front;
- Top / Footprint.

Call `capture_visual_feedback` with only those views and `return_images: true`. Then call `compare_reference_views` for the same views. If either Codex inspection or deterministic metrics identifies a material mismatch, repair before detail.

### Structural detail

After primary form is acceptable, add only silhouette-critical detail:

- horns;
- ears;
- final feet;
- tail;
- required hierarchy separation;
- ground-contact correction.

Capture and compare only affected views during correction. Do not repeatedly return all five images.

### Final visual gate

Before checkpointing:

1. Capture all five standard views with image payloads.
2. Run `compare_reference_views` for all five views.
3. Inspect the returned diff contact sheet:
   - green = overlap;
   - red = missing target silhouette;
   - blue = excess current silhouette.
4. If deterministic metrics fail, do not record multimodal PASS.
5. Record Codex's visual decision with `record_geometry_visual_result`.
6. Call `verify_geometry_review_ready`; it must confirm current five-view evidence, deterministic metrics, multimodal report, reference hash, Geometry fingerprint, and rotation safety.

The 3/4 view uses perspective; Front, Left, Back, and Top use orthographic projection.

## Cube mutation policy

Use:

- `place_cubes_safe` for new Geometry;
- `modify_cubes` for revisions.

Do not use legacy single-cube mutation tools when the safe batch tools are available.

Prefer one bounded atomic batch for a related mass or paired structure. Keep each batch small enough to review as one visual decision.

## Rotation and pivot safety

Cube rotation is high risk because a numerically valid rotation can produce a visibly wrong direction, disconnected segment, or false bounds result.

Rules:

1. Provide explicit `origin` whenever setting or changing `rotation`.
2. The origin must be the intended attachment pivot, not automatically the cube center.
3. Prefer one local axis per cube.
4. Compound cube rotation is rejected unless the approved contract explicitly requires it.
5. Default absolute rotation limit is `45°`.
6. Rotate the smallest necessary part; use stepped cuboid sizes instead of tilting large body masses to fake taper.
7. Verify multi-segment parts remain connected after rotation.
8. After every rotated batch, inspect the affected Side or 3/4 view.
9. If a part moves in the opposite direction, undo it; do not compensate with unrelated offsets.
10. World bounds and camera framing must include cube rotation and parent transforms.
11. Any Geometry mutation invalidates previous visual metrics and visual reports.

Recommended sequence:

```text
identify attachment point
→ set explicit pivot
→ apply one-axis rotation
→ inspect affected view
→ inspect adjacent segment connection
→ keep or undo
```

## Revision classification

Use `GEOMETRY_LOCAL_REPAIR` only when one part or a tightly related pair is wrong and primary masses remain acceptable.

Use `GEOMETRY_VISUAL_REBUILD` when:

- two or more primary masses are wrong;
- two or more standard views fail;
- body/head/footprint needs broad reconstruction;
- a local repair fails to improve the silhouette;
- broad feedback cannot be isolated safely.

Preserve earlier checkpoints. A major rebuild may replace broad Geometry but must preserve the approved Reference Visual, project identity, root contract, and scale.

## Convergence and token limits

- Use `get_stage_context`; avoid repeatedly loading long contracts.
- Inspect the Reference Visual once unless its hash changes.
- Use three views for primary form, then only affected views.
- Maximum automatic correction cycles per internal pass: `2`.
- Maximum deterministic comparisons during ordinary Geometry: `2` primary/detail checks plus one final gate.
- Prefer `modify_cubes` over many sequential calls.
- If two consecutive cycles do not improve the same mismatch, stop with `VISUAL_CONVERGENCE_FAILED`.

## Structural validation

After both visual layers pass:

1. run `validate_reference_contract` for Geometry;
2. confirm bounds, required groups, ground contacts, cube count, mesh count, and animation count;
3. confirm no rotation audit issue requires revision;
4. save archival standard views;
5. retain:
   - `geometry_visual_metrics.json`;
   - `geometry_visual_diff.png`;
   - `geometry_visual_report.json`;
   - `geometry_report.json`.

`geometry_report.json` must separate:

```text
structural_status
visual_status
deterministic_visual_status
rotation_status
evidence_status
result
```

Final result is PASS only when all required statuses pass.

## Forbidden

- texture or UV work;
- PBR/material redesign;
- mesh conversion, subdivision, or vertex editing;
- animation keyframes;
- final export;
- extra reference-image generation;
- approval based only on bounds, cube count, hierarchy, or Blockbench warnings;
- ignoring a deterministic failed view;
- continuing after stale visual evidence;
- silently accepting unsafe rotation or pivot placement.

## Review output

1. Preserve all earlier checkpoints.
2. Save a new non-approved Geometry checkpoint.
3. Store five final evidence views and both visual reports.
4. Stop at:

```text
GEOMETRY_REVIEW
AWAITING_USER_REVIEW
```

After explicit user approval, use `complete_geometry_stage`. Never continue to Texture without that approval.
