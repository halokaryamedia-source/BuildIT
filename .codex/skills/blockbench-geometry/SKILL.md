---
name: blockbench-geometry
description: "Fixed-scale Bedrock Geometry with a zero-start primary-form branch, affected-view diagnosis, one selected Terra writer, conditional visual judgment, and guarded review submission."
---

# Blockbench Geometry

Use only for `GEOMETRY` with `BEDROCK_CUBOID_GEOMETRY`. `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes.

## Entry

Call stage context, rebind identity if needed, select one Terra writer, and acquire the Geometry lease. Inspect the Reference Visual once per unchanged hash.

## Zero-start versus revision

```text
zero-start / no cubes
→ BUILD_PRIMARY_FORM_FROM_MANIFEST
→ capture primary views
→ analyze

existing or revision
→ capture only affected views
→ analyze
```

Never analyze an empty project. Do not call stage context again between Reference Visual inspection and the first diagnosis; follow the preview's `next_safe_operation`.

## Correction

Analyzer output must name view, region, missing/excess silhouette, direction, magnitude when measurable, parts, and scope. Terra handles concrete corrections directly. Use at most two non-improving bounded cycles before setting attention and asking one focused question or using conditional visual judgment.

Use `place_cubes_safe`/`modify_cubes` for unrotated work and `rotate_cube_about_attachment` for every non-zero rotation. Modify only diagnosed parts.

## Final review

```text
final manifest-required capture/analyze with write_diff_image=true
→ visual_director only when a genuine visual decision remains unresolved
→ otherwise selected Terra writer records the bounded visual decision
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
```

Final views are five base views plus `right_side` for asymmetric assets. Evidence must match project UUID, fingerprint, transformed world signature, Reference Visual hash, required views, analyzer, visual decision, and rotation audit.

Submission performs fresh validation/readiness, creates the review checkpoint, transitions atomically, and releases the lease. Do not duplicate validation immediately before submission.

After user approval, acquire a fresh Geometry lease and call `complete_geometry_stage`. Revision acquires a fresh lease, captures/analyzes affected views, calls `prepare_geometry_visual_rebuild`, then mutates only after `GEOMETRY_IN_PROGRESS` returns.

## Evidence and routing invariants

`analyze_geometry_views` persists canonical metrics and therefore requires the active Geometry lease. Freshness is bound to the transformed world-space signature as well as project UUID, local fingerprint, hierarchy, visibility, mesh structure, and Reference Visual hash. The final required-view capture/analyze uses all manifest-required views. The selected Terra writer performs repairs; `visual_director` is conditional, and High is reserved for one coded critical decision only.
