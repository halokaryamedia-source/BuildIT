# Minecraft Bedrock Entity Workflow

Create/revise Bedrock **Entity**. Cubes are geometry; Groups are bones.

## Canonical Authoring Stages

Keep these terms separate:

```text
GEOMETRY        = 3D form, proportion, topology, attachment
UV LAYOUT       = geometry → atlas coordinate mapping; no color/style
TEXTURE ATLAS   = bitmap/PNG canvas that stores pixels
TEXTURE STYLING = color, material, shading, highlights, detail
TEXTURE VERIFY  = fresh atlas + mapped-model visual validation
```

`create_texture` creates a **Texture Atlas**; it does not create UV Layout or complete Texture Styling. `uv_offset`, `autouv`, `mirror_uv`, per-face UV, and `box_uv_region` belong to **UV Layout**. Painter tools belong to **Texture Styling**.

## Minimum Necessary Evidence

Reuse fresh tool state. Do not inspect every Cube, capture after every mutation, or call `get_project_info` after known create/export state. `inspect_model_bounds` is only for envelope/scale/ground/displacement. `UNVERIFIED` is not a retry command.

Reference-driven work requires the actual approved image in active multimodal context. Path/memory is not image evidence. Missing material reference evidence → `BLOCKED`.

For new Geometry, use the stable direct method: create the project, add only the required Groups and Cubes, set explicit positions/sizes/parents/transforms, then capture canonical views for visual review. Do not use the retired reference-grounded plan/compiler flow.

## Simple Rigid Fast Path

For a clear predominantly rigid object with simple topology and no material cross-view conflict:

```text
identity + envelope + primary masses
→ transform ownership
→ minimum meaningful hierarchy
→ one coherent primary Cube batch
→ judgeable views
→ correct only observed mismatch
```

Construction examples are **not presets**. Local rigid slopes may be **Cube-owned**; shared orientation/contact/articulation is **Group/Bone**-owned. Keep primary blockout hierarchy only when it owns real transform/contact/articulation. Do not build nested Groups for apparent sophistication. After primary `PASS`, add only identity-weighted detail.

Use structured evidence maps only when ambiguity/conflict can materially change identity, count, topology, depth, attachment, negative space, or orientation. Do not perform analysis ceremony for an already clear rigid reference.

## Geometry / Visual Gate

The reference-grounded planning/compiler experiment is retired from the default workflow. Do not require `evidence_map`, `reference_grounded_v1`, generic role namespaces, or construction strategies for ordinary Geometry authoring. Use direct Group/Cube tools and judge the resulting form visually.

For ordinary Geometry, use direct explicit authoring. Decide the primary masses, required counts, parent/contact relationships, important negative spaces, and transforms before mutation. Then create only the necessary Groups and Cubes in a coherent batch. Do not require a planning schema, evidence map, role namespace, compiler strategy, or automatic coordinate inference.

Reuse returned UUID/from/to/origin/rotation/`box_uv_region`; do not immediately re-inspect fresh Cubes. Tool success is execution evidence only.

Judge reference fidelity **difference-first** with fresh model views. Check identity, masses/counts, silhouette/proportion, depth, orientation, contact, and negative spaces.

```text
FAIL       = critical/major supported mismatch
UNVERIFIED = missing/ambiguous material evidence
PASS       = no critical/major supported mismatch
```

**Front PASS is not full 3D PASS** when depth evidence is missing or fails. Coordinates, bounds, hierarchy, export success, or similarity scores cannot create visual `PASS`.

Correction: reuse fresh target state; otherwise `inspect_element` once. Diagnose `TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | ADD MASS`, mutate, verify `geometry_effect`, then compare `IMPROVED | UNCHANGED | REGRESSED`. Capture affected view(s) first. Same causal correction failing twice without new evidence → `BLOCKED`.

## UV Layout

UV Layout answers: **which atlas region does each surface read?**

For fresh Box UV, reuse `place_cube` returned `box_uv_region`; do not rediscover it by ritual. Keep auto UV active during geometry correction. After geometry `PASS`, lock final Box-UV Cubes in one `modify_cubes_batch` with `autouv=0`, then call `list_textures` once for global UV audit.

Require integer logical UV unless justified, no invalid/out-of-bounds UV, no accidental partial overlap, deliberate exact reuse/mirror, and stable seam/orientation. Use `inspect_element` only when face-specific mapping/orientation is actually needed; one Cube inspection returns all faces.

## Texture Atlas

Texture Atlas is the bitmap canvas; it is not UV Layout or styling.

Use **one base-color atlas PNG** for the whole model, never one base color per body part/Cube/material zone. New AI production uses logical UV 128×128 and explicit 128-based `create_texture` width/height; do not rely on the provisional 16×16 default. Reuse atlas UUID and pass `texture_id` when multiple textures exist. PBR support textures are additional atlas channels, not UV Layout.

Atlas creation/fill does **not** complete Texture Styling.

## Texture Styling

Define palette roles, value/hue ramp, material zones, face-aware shading, contact/occlusion, edge treatment, hard-pixel/alpha intent, seam/orientation, identity marks, detail budget, and pixels per UV unit.

Flat fill is a **BASE PASS only**, never production completion when material/form/detail is visible. Prefer controlled Minecraft pixel clusters and stepped ramps; random noise is rejected. Smooth gradient is optional only when the reference/style supports it.

```text
BASE PASS             → draw_shape_tool; paint_fill_tool only for intentional contiguous base fill
VALUE / FORM PASS     → draw_shape_tool / paint_with_brush for stepped form, contact, occlusion, edge, hue/value ramp
IDENTITY PASS         → paint_with_brush exact-pixel identity marks
SECONDARY DETAIL PASS → controlled detail by pixels per UV unit; stop before noise
VERIFY                → enter Texture Verify
```

Use `gradient_tool` only for supported continuous transitions. Repeated same-color disconnected detail can be one `paint_with_brush` coordinate batch with `connect_strokes=false`.

## Texture Verify

Texture Verify uses fresh visual evidence after a coherent styling pass:

```text
fresh get_texture atlas
+ affected capture_model_views
→ UV/region
→ palette/material
→ form/contact/edge
→ seam/orientation
→ identity
→ microdetail
→ FAIL | UNVERIFIED | PASS
```

Texture mutation makes evidence stale. `FAIL` → smallest causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction failing twice → `BLOCKED`.

## Stage Routing

```text
project absent              → create_project
new reference geometry      → create_project → add_group/place_cube/modify_group/modify_cube → capture_model_views
observed geometry mismatch  → inspect affected element → modify_cube/modify_cubes_batch/modify_group → affected capture_model_views
UV Layout                   → returned box_uv_region → final UV lock → list_textures audit
Texture Atlas               → create_texture / activate_texture
Texture Styling             → Painter tools / material configuration
Texture Verify              → get_texture + capture_model_views
file deliverable            → export_model
```

Protected gaps remain TextureMesh direct authoring, visible bounds, animated textures, controller blend-curve mutation, and bone-binding expressions.
