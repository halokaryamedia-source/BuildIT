---
name: blockbench-geometry
description: "Efficient Bedrock cuboid Geometry with automatic project ownership, primary-form discipline, contract smart fitting, reference-driven direct transforms, rendered pivot checks, targeted analysis, and guarded review submission."
---

# Blockbench Geometry

Use only for `GEOMETRY` with `BEDROCK_CUBOID_GEOMETRY`. `PRIMARY_FORM`,
`STRUCTURAL_DETAIL`, `LOCAL_REPAIR`, and `MAJOR_FORM_REVISION` are internal;
they are not extra user reviews or profiles.

## Entry

```text
get_stage_context once
→ create_project(session_root, asset_id) when absent
→ MCP derives path, saves, synchronizes identity/profile, and prepares write ownership
→ inspect_reference_visual_preview once per unchanged hash
→ begin Geometry directly
```

Do not calculate `save_path`, rebind UUID, activate a profile, or manage a lease
in the normal single-user path.

## Enforced zero-start route

```text
PRIMARY_FORM
→ build only PRIMARY_MASS and PROVISIONAL_SUPPORT cuboids
→ use reference/manifest proportions without arbitrary range extremes
→ apply required primary rotations through the routing rules below
→ capture/analyze left_side + front + top_footprint once
→ verify_primary_form_ready
→ STRUCTURAL_DETAIL
```

`verify_primary_form_ready` must pass before structural detail. Repair existing
primary cuboids instead of adding detail to hide a broken silhouette.

During PRIMARY_FORM:

- remain inside the primary cube budget;
- match body, neck, head/muzzle, and support-chain proportions;
- keep required ground contacts at `Y=0`;
- use an actual pivoted transform for visibly angled forms;
- pass primary left/front/top scores and extents.

## Rotation and pivot routing

The approved Reference Visual is the visible authority. The manifest is an
execution aid, not a reason to preserve a visibly incorrect transform.

Use `rotate_cube_about_attachment` when a current rotation contract accurately
describes the part, axis, direction, connection target, and size range.

Use `apply_cube_transforms` when:

- no rotation contract exists;
- the contract is ambiguous or visibly inaccurate;
- the user requests an explicit reference-driven correction;
- several related cubes should be transformed in one bounded batch;
- a precise `from`, `to`, `origin`, and `rotation` is already known.

Never replace a required angled neck, head, limb, ear, horn, or tail with
axis-aligned stacking merely to satisfy a contract.

## Contract smart fitting

For a reliable attachment contract:

```text
place zero-rotation provisional cuboid
→ rotate_cube_about_attachment without angle_degrees
→ resolve size and long axis
→ solve legal angle
→ place end-face centerline pivot
→ snap to connection target
→ validate direction and gap
```

Use an explicit angle only for one diagnosed correction. If the contract result
still disagrees with the approved visual, stop re-running the same solver and use
`apply_cube_transforms` for the named part.

## Reference-driven direct transforms

`apply_cube_transforms` updates related cubes in one Undo transaction. For each
cube provide the explicit rotation and either an explicit origin or a local
`pivot_anchor`. It can snap the pivot to a target cube or explicit world point.

The tool:

- changes `from`, `to`, `origin`, and `rotation` together;
- reads the actual Blockbench render mesh `matrixWorld` when available;
- converts snap translation through the rendered parent transform;
- validates the rendered world pivot and target gap;
- falls back to deterministic parent rotation only when render data is absent;
- optionally runs one `analysis_views` pass after the complete batch;
- does not require a manifest rotation contract.

Prefer one transform batch plus one affected-view analysis over repeated
single-cube mutations and repeated full-view captures. Set `require_render_mesh`
only for a diagnosed runtime verification; normal production may continue with a
reported deterministic fallback and must still complete final visual analysis.

## Structural detail

Only after the primary gate passes, add approved ears, horns/ossicones, mane,
tail, hoof refinement, and other `STRUCTURAL_DETAIL` parts. Keep cube count
inside the manifest budget. Use stepped cuboids for controlled taper and an
actual pivoted transform for genuinely angled features.

## Correction

Capture only affected views first. `analyze_geometry_views` must identify the
view, region, missing/excess silhouette, direction, magnitude when measurable,
and affected parts. Modify only those parts.

```text
zero-rotation size/position repair → place_cubes_safe / modify_cubes
valid contract attachment         → rotate_cube_about_attachment
explicit visual pivot/rotation    → apply_cube_transforms
```

Use no more than two non-improving bounded cycles before one focused visual
judgment. A transform call may include `analysis_views` so the whole correction
batch requires only one follow-up diagnosis.

## Final review

```text
final required-view capture/analyze with write_diff_image=true
→ conditional visual_director only for unresolved visual judgment
→ record_geometry_visual_decision
→ save_canonical_project
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
```

All final views, project identity, fingerprints, transformed world-space
signature, Reference Visual hash, analyzer result, primary gate, visual decision,
and applicable attachment evidence must be current. Direct transforms do not
remove the final absolute visual requirement.

## Compatibility and efficiency invariants

- Never analyze an empty project.
- `analyze_geometry_views` persists canonical metrics and therefore remains a lease-owned write.
- Read-only inspection requires no lease; persistent analysis prepares ownership automatically.
- Do not call manual identity/profile/lease tools on the normal path.
- Use rendered Blockbench transforms for runtime pivot and connection verification when available.
- Do not require a rotation contract when an explicit reference-driven transform is safer and clearer.
- The final required-view analysis is the canonical visual evidence pass.
- The selected Terra writer performs normal repairs directly.
- Use visual_director only when deterministic evidence cannot close a genuine decision.
- High remains the maximum reasoning effort and is reserved for one coded critical decision.

After approval, call `complete_geometry_stage` in the same session. Revision
returns to the same Geometry profile and the next mutation prepares current-stage
ownership automatically; no reconnect is required.
