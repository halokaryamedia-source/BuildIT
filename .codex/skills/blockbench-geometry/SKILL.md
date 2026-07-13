---
name: blockbench-geometry
description: "Deterministic two-phase Bedrock Geometry with an enforced primary-form boundary, required attachment rotations, fixed-scale diagnosis, one Terra writer, and guarded review submission."
---

# Blockbench Geometry

Use only for `GEOMETRY` with `BEDROCK_CUBOID_GEOMETRY`. `PRIMARY_FORM`,
`STRUCTURAL_DETAIL`, `LOCAL_REPAIR`, and `MAJOR_FORM_REVISION` are internal;
they are not extra user reviews or profiles.

## Entry

```text
get_stage_context
→ create_project when absent, with canonical save_path + session_root + asset_id
→ save_canonical_project
→ rebind identity when required
→ one selected Terra writer acquires the Geometry lease
→ inspect_reference_visual_preview once per unchanged hash
```

## Enforced zero-start route

```text
PRIMARY_FORM
→ build only manifest PRIMARY_MASS and PROVISIONAL_SUPPORT cuboids
→ use mid-range dimensions/centers, not arbitrary range extremes
→ no ears, ossicones, mane, tail, decorative transitions, or micro detail
→ apply every required primary rotation contract
→ capture/analyze left_side + front + top_footprint
→ verify_primary_form_ready
→ save_canonical_project
→ STRUCTURAL_DETAIL
```

`verify_primary_form_ready` must pass before structural detail is allowed. A
failed gate means repair existing primary cuboids; do not add more cubes to hide
the silhouette error.

During PRIMARY_FORM:

- keep within `geometry.primary_form_gate.maximum_cubes`;
- body, neck, head/muzzle, and four support chains must match manifest numeric
  constraints;
- required neck/head rotations must be applied with
  `rotate_cube_about_attachment`;
- all required hooves remain at `Y=0`;
- primary left/front/top scores and extents must pass the internal gate.

## Structural detail

Only after the primary gate passes, add the approved ears, ossicones, mane,
tail, hoof refinement, and other `STRUCTURAL_DETAIL` parts. Keep cube count
inside the manifest budget. Use stepped cuboids where taper is sufficient and
contract rotation only where the approved form is genuinely angled.

## Correction

Capture only affected views first. `analyze_geometry_views` must name view,
region, missing/excess silhouette, direction, magnitude when measurable, parts,
and scope. Modify only diagnosed parts. Use no more than two non-improving
bounded cycles before setting attention and using one focused visual decision.

Use `place_cubes_safe`/`modify_cubes` for zero-rotation work and
`rotate_cube_about_attachment` for every non-zero cube rotation. If rotation
visual scoring is temporarily unavailable, the rotation may pass only through
axis/range/pivot/direction/connection structural fallback; fresh visual analysis
is still mandatory before primary-form or final review readiness.

## Final review

```text
final manifest-required capture/analyze with write_diff_image=true
→ conditional visual_director only for a genuinely unresolved visual judgment
→ record_geometry_visual_decision
→ save_canonical_project
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
```

All final views, project UUID, fingerprints, transformed world-space signature,
Reference Visual hash, analyzer, primary-form gate, visual decision, and rotation
audit must be current. Submission owns fresh validation, checkpoint, transition,
and lease release.

## Compatibility and evidence invariants

- Never analyze an empty project.
- `analyze_geometry_views` persists canonical metrics and therefore remains a lease-owned write.
- The final required-view capture/analyze is the canonical final evidence pass.
- The selected Terra writer performs normal repairs directly.
- visual_director only when deterministic evidence cannot close a genuine visual decision.
- High remains the maximum and is reserved for one coded critical decision.

After user approval, reacquire a fresh Geometry lease and call
`complete_geometry_stage`. Revision reacquires the Geometry lease, diagnoses
affected views, calls `prepare_geometry_visual_rebuild`, and mutates only after
`GEOMETRY_IN_PROGRESS` returns. No reconnect is required.
