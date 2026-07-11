---
name: blockbench-geometry
description: "Visual-grounded Geometry-stage skill for approved Minecraft Bedrock cuboid assets. Builds coarse-to-fine form, validates cube rotations and pivots, compares live views to the approved Reference Visual, and stops for user review."
---

# Blockbench Geometry

## Entry

Use only when the active stage is `GEOMETRY`, the current MCP session owns the write lease, and the active profile is one of:

- `BEDROCK_CUBOID_GEOMETRY`
- `GEOMETRY_LOCAL_REPAIR`
- `GEOMETRY_VISUAL_REBUILD`

Read only:

1. `PRODUCTION_CONTEXT.md`
2. `reference_manifest.json`
3. the approved Reference Visual
4. `GEOMETRY.md`
5. current state, accepted areas, and open issues

## Non-negotiable visual rule

The model must be visually inspected by Codex during construction. A valid file, correct bounds, cube count, hierarchy, and zero Blockbench warnings do not prove visual similarity.

Call `inspect_reference_visual` once before the first mutation and actually inspect the returned image payload.

## Coarse-to-fine workflow

```text
REFERENCE_VISUAL_LOAD
→ PRIMARY_FORM_PLAN
→ PRIMARY_FORM_BUILD
→ PRIMARY_FORM_VISUAL_CHECK
→ TARGETED_PRIMARY_REPAIR
→ STRUCTURAL_DETAIL
→ STRUCTURAL_DETAIL_VISUAL_CHECK
→ TARGETED_DETAIL_REPAIR
→ FULL_5_VIEW_VISUAL_GATE
→ STRUCTURAL_VALIDATION
→ VISUAL_REPORT
→ VISUAL_GATE_VERIFY
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

Do not spend calls on horns, ears, feet, tail, or minor segmentation until primary form passes visual comparison in at least:

- Left Side;
- Front;
- Top / Footprint.

Call `capture_visual_feedback` with only those views and `return_images: true`. Compare the returned current model images against the approved Reference Visual. If body length, body height, shoulder/rear relation, head level, width, footprint, or leg placement is materially wrong, repair before adding detail.

### Structural detail

After primary form is visually acceptable, add only silhouette-critical detail:

- horns;
- ears;
- final feet;
- tail;
- required hierarchy separation;
- ground-contact correction.

Capture only affected views during correction. Do not repeatedly return all five images.

### Final visual gate

Before checkpointing, capture all five standard views with image payloads:

- Front;
- Left Side;
- Back;
- Top / Footprint;
- Front-left 3/4.

The 3/4 view uses perspective; the four technical views use orthographic projection.

Record the result with `record_geometry_visual_result`. A PASS requires no unresolved visual issue. Then call `verify_geometry_visual_gate`; it must return PASS for the current project UUID, Geometry fingerprint, Reference Visual hash, and rotation audit.

## Cube mutation policy

Use:

- `place_cubes_safe` for new Geometry;
- `modify_cubes` for revisions.

Do not use legacy single-cube mutation tools for production Geometry when the safe batch tools are available.

Prefer one bounded atomic batch for a related mass or paired structure. Keep batches small enough to review as one visual decision.

## Rotation and pivot safety

Cube rotation is high risk because a numerically valid rotation can produce a visually incorrect silhouette.

Rules:

1. Provide an explicit `origin` whenever setting or changing `rotation`.
2. The origin must represent the real attachment pivot, not the cube center by habit.
3. Prefer one local axis per cube.
4. Compound cube rotation is rejected unless the approved contract explicitly requires it.
5. Default absolute rotation limit is `45°`.
6. Rotate the smallest necessary part; do not tilt large body masses to fake taper when stepped cuboids are more stable.
7. For multi-segment parts, verify each segment remains connected after rotation.
8. After every rotated batch, capture the affected Side or 3/4 view before continuing.
9. If a rotated result moves opposite the intended direction, undo it; do not compensate with unrelated offsets.
10. World-space bounds must include cube rotation and parent-group transforms.

Recommended rotation sequence:

```text
identify attachment point
→ set explicit pivot
→ apply one-axis rotation
→ inspect affected view
→ inspect adjacent segment connection
→ keep or undo
```

## Revision classification

Use `GEOMETRY_LOCAL_REPAIR` only when one part or tightly related pair is wrong and primary masses remain acceptable.

Use `GEOMETRY_VISUAL_REBUILD` when any of the following applies:

- two or more primary masses are wrong;
- two or more standard views fail;
- body/head/footprint must be rebuilt;
- previous local repair did not improve the silhouette;
- broad user feedback cannot be isolated safely.

Preserve prior checkpoints. A major visual rebuild may replace broad Geometry but must not replace the Reference Visual, project identity, root contract, or approved scale without reopening the reference stage.

## Convergence and token limits

- Inspect the Reference Visual once unless its hash changes.
- Use two or three current views for primary form, then only affected views.
- Maximum automatic correction cycles per internal pass: `2`.
- Prefer `modify_cubes` over many sequential `modify_cube` calls.
- Do not resend full Markdown contracts after context is resolved.
- If two consecutive correction cycles do not improve the visible mismatch, stop with `VISUAL_CONVERGENCE_FAILED` and report the unresolved views/parts.

## Structural validation

After the visual result is PASS:

1. run `validate_reference_contract` for Geometry;
2. confirm bounds, required groups, ground contacts, cube count, mesh count, and animation count;
3. confirm rotation audit has no `REVISION_REQUIRED` issue;
4. write archival standard views to disk;
5. write `geometry_report.json` with separate fields:
   - `structural_status`;
   - `visual_status`;
   - `rotation_status`;
   - final `result`.

Final result is PASS only when all required statuses pass.

## Forbidden

- texture or UV work;
- PBR/material redesign;
- mesh conversion, subdivision, or vertex editing;
- animation keyframes;
- final export;
- hidden extra reference-image generation;
- automatic approval based only on numeric validation;
- continuing after a stale/missing visual report;
- silently accepting unsafe rotation or pivot placement.

## Review output

1. Preserve all earlier checkpoints.
2. Save a new non-approved Geometry checkpoint.
3. Store the five final evidence views.
4. Store `geometry_visual_report.json` and `geometry_report.json`.
5. Stop at:

```text
GEOMETRY_REVIEW
AWAITING_USER_REVIEW
```

Never continue to Texture until the user explicitly approves the Geometry.
