---
name: blockbench-geometry
description: "Fixed-scale visual-grounded Geometry skill for approved Minecraft Bedrock cuboid assets. Builds coarse-to-fine form, receives actionable visual diagnosis, uses contract-driven rotations, validates transformed Geometry, and stops for user review."
---

# Blockbench Geometry

## Entry

Use only when stage is `GEOMETRY`, the current MCP session owns the project write lease, and the active profile is one of:

- `BEDROCK_CUBOID_GEOMETRY`;
- `GEOMETRY_LOCAL_REPAIR`;
- `GEOMETRY_VISUAL_REBUILD`.

Call `get_stage_context` first. Use its compact asset lock, part constraints, panel regions, rotation contracts, runtime phase, open issues, and accepted areas. Read long Markdown contracts only when compact data is incomplete or contradictory.

If another context requires four sheets, three approval moments, or numbered technical images, stop with `LEGACY_SKILL_CONFLICT`.

## Three proof layers

Geometry needs all three:

1. **Codex visual inspection** of the approved Reference Visual and current Blockbench images.
2. **Fixed-scale machine diagnosis** from `analyze_geometry_views`.
3. **Structural validation** from `validate_geometry_contract`.

Bounds, cube count, hierarchy, or a successful screenshot do not prove visual quality.

## Enforced workflow

```text
get_stage_context
→ inspect_reference_visual
→ PRIMARY_FORM_PLAN
→ PRIMARY_FORM_BUILD
→ capture_visual_feedback: left + front + top
→ analyze_geometry_views: left + front + top
→ targeted primary repair
→ STRUCTURAL_DETAIL_BUILD
→ capture affected views
→ analyze affected views
→ final five-view capture
→ final five-view analyze_geometry_views
→ record_geometry_visual_result
→ validate_geometry_contract
→ verify_geometry_review_ready
→ review checkpoint
→ GEOMETRY_REVIEW
```

## Primary form phase

Build only:

- torso/core mass;
- elevated shoulder mass;
- lower narrowing rear mass;
- short neck transition;
- low head and muzzle;
- four provisional leg columns;
- approved ground relationship.

Do not add horns, ears, final feet, tail, micro-detail, or decorative segmentation yet. MCP blocks those parts while runtime phase is `PRIMARY_FORM`.

Run Left, Front, and Top diagnosis. Use the returned ranked issues exactly:

```text
view
region
missing/excess direction
magnitude_units
parts
recommendation
recommended_profile
```

Modify only the implicated masses or their directly related pair. Do not compensate for a wrong shoulder by changing horns; do not compensate for a wrong head by resizing the full torso.

Primary form passes only when both Codex inspection and fixed-scale diagnosis accept Left, Front, and Top. The runtime then unlocks `STRUCTURAL_DETAIL`.

## Structural detail phase

Add only silhouette-critical detail:

- three-segment dominant front horn;
- two-segment smaller rear horn;
- paired compact ears;
- final feet;
- two-part tail;
- required hierarchy separation;
- ground-contact correction.

Capture and diagnose only affected views while repairing. Preserve passing regions.

## Fixed-scale diagnosis rules

`analyze_geometry_views` projects transformed cuboids directly. Current geometry is not segmented from viewport colors and is not independently fit to the reference.

Alignment is locked to:

- approved coordinate envelope;
- fixed pixels per Blockbench unit;
- approved center axis;
- approved ground line;
- manifest/built-in panel crop;
- view-specific projection.

The report combines:

- global silhouette IoU;
- row/column profile error;
- fixed-scale bounding-box error;
- weighted semantic region scores;
- critical-region failure;
- edge and center displacement in Blockbench units.

A critical head, shoulder, rear-taper, footprint, or identity-region failure forces `REVISION_REQUIRED` even when whole-body overlap is moderate.

The diff sheet is:

```text
Reference | Current | Difference
```

- green: overlap;
- red: approved silhouette missing from current geometry;
- blue: current geometry exceeds the approved silhouette.

## Mutation policy

Use:

- `place_cubes_safe` for unrotated new cubes;
- `modify_cubes` for unrotated revisions;
- `rotate_cube_about_attachment` for every non-zero cube rotation.

Do not put non-zero `rotation` inside `place_cubes_safe` or `modify_cubes`; MCP rejects it.

Use one bounded atomic batch per related visual decision. Prefer resizing, repositioning, flattening, or stepped cuboids before adding cubes.

## Contract-driven rotation

Rotation is not selected by trial and error.

`rotate_cube_about_attachment` must resolve a contract that defines:

- allowed cube pattern;
- allowed axis;
- minimum/maximum angle;
- pivot anchor;
- tip anchor;
- expected world-space direction;
- optional connection target and tolerance;
- affected review views.

For each rotation, the tool:

```text
analyze affected views before
→ derive attachment pivot
→ apply one-axis rotation
→ verify direction
→ verify connection when declared
→ analyze affected views after
→ keep or automatic rollback
```

Do not rotate large torso masses to simulate body taper. Use stepped mass sizing.

## Revision routing

Use `GEOMETRY_LOCAL_REPAIR` when one part or a tightly related pair fails and primary masses remain valid.

Use `GEOMETRY_VISUAL_REBUILD` when:

- two or more primary masses fail;
- two or more standard views fail;
- body/head/footprint requires broad reconstruction;
- local repair did not improve;
- diagnosis recommends `MAJOR_FORM_REVISION`.

A visual rebuild resets runtime to `PRIMARY_FORM` and preserves previous checkpoints.

## Convergence and token budget

- Inspect the approved Reference Visual once unless its hash changes.
- Use three diagnostic views for primary form.
- Use only affected views during local correction.
- Use one final five-view pass.
- Maximum two non-improving cycles per phase.
- Prefer one `modify_cubes` call over sequential single-cube calls.
- Do not reload full contracts after `get_stage_context` resolves the decision.

After two non-improving cycles, MCP records and throws:

```text
VISUAL_CONVERGENCE_FAILED
```

Stop and report failing views, regions, named parts, and recommended profile.

## Final Geometry gate

Before review:

1. Capture all five standard views with clean current-model image payloads.
2. Run `analyze_geometry_views` for all five views to canonical evidence paths.
3. Inspect current images and the diagnostic diff.
4. Record multimodal result using all five `compared_views`.
5. Run `validate_geometry_contract` with visual evidence required.
6. Run `verify_geometry_review_ready`.
7. Save a new non-approved checkpoint; never overwrite earlier checkpoints.

`geometry_report.json` must contain:

```text
structural_status
visual_status
deterministic_visual_status
rotation_status
evidence_status
result
```

Final result is `PASS` only when every required layer is current and passes.

## Forbidden

- texture or UV work;
- mesh, subdivision, or vertex editing;
- animation keyframes;
- final export;
- extra reference-image generation;
- free-rescaling current geometry before comparison;
- unrelated trial-and-error changes;
- bypassing primary-form phase;
- direct non-zero rotation through generic cube tools;
- approval based on structural metrics alone;
- continuing after stale evidence or convergence failure.

## Review output

Preserve all checkpoints and store:

```text
geometry_front.png
geometry_left.png
geometry_back.png
geometry_top.png
geometry_front_left_3_4.png
geometry_visual_metrics.json
geometry_visual_diff.png
geometry_visual_report.json
geometry_runtime.json
geometry_report.json
```

Stop at:

```text
GEOMETRY_REVIEW
AWAITING_USER_REVIEW
```

After explicit approval use `complete_geometry_stage`. Never enter Texture before approval.
