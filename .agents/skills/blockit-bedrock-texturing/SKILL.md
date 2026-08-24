---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity texture specialist for texture lifecycle, Painter, PBR, and material_instance metadata.
---

# BlockIT Bedrock Texturing

Geometry: `blockbench-bedrock-modelling`.

## Direct Routing

Reuse fresh identity/state.

```text
base atlas lifecycle          → create_texture / list_textures / activate_texture
fresh atlas image             → get_texture
base/material regions         → draw_shape_tool; paint_fill_tool only for intentional contiguous base fill
stepped value/form/edge       → draw_shape_tool / paint_with_brush
continuous transition         → gradient_tool only when reference/style supports it
identity/detail pixels        → paint_with_brush
PBR                           → create_pbr_material / configure_material / assign_texture_channel
```

## Deferred Spec Loading

Known identity skips discovery. Load the **exact tool name** only when its spec is not loaded; do not re-list/re-read it only for confirmation. Production texture waits for geometry `PASS`.

## AI Production Atlas

Use **one base-color atlas PNG for the whole model**, never per body part/Cube/material zone. `list_textures`: `none` → create; `single` → reuse; `fragmented` → stop/reconcile. PBR normal/height/MER are support textures.

New AI production: logical UV **128×128**. Pass explicit production `width`/`height` using the smallest sufficient square 128-based bitmap; do not rely on provisional 16×16 `create_texture` default. Pin atlas UUID; pass `texture_id` when multiple textures are loaded.

## Texture Design Contract

Before production pixels define:

```text
atlas UUID + logical/physical size + pixels per UV unit
palette roles + value/hue ramp
material zones + value hierarchy + face-aware shading
contact/occlusion + edge treatment
hard-pixel + alpha intent
direction/mirror + seam constraints
identity-critical marks
detail budget: identity > material > optional wear/noise
required PBR / material_instance meaning
```

A flat fill is a **base pass only** when form/material/detail is visible; it never completes production texture. Prefer controlled Minecraft pixel clusters and stepped value/hue ramps; reject random high-contrast noise. Use `gradient_tool` smooth transitions only when style/reference supports them.

## UV / Atlas Gate

Run `list_textures` once before production paint. Final AI Box UV requires `autouv=0`, integer logical UV unless justified, no invalid/out-of-bounds UV, no accidental partial overlap, deliberate exact reuse/mirror, and stable seam/orientation.

For fresh Box-UV Cubes, reuse `place_cube` returned `box_uv_region`; do not inspect them again by ritual. Keep auto UV active during geometry correction. After geometry `PASS`, use one `modify_cubes_batch` to lock final Cubes with `autouv=0`; do not recalculate offsets already packed by `place_cube`.

Use `inspect_element` only for needed face-specific mapping/orientation. One Cube inspection returns all six face mappings; never inspect per face. Reuse `texture_pixels.rect`, `flip_u`, `flip_v`.

```text
MAP → returned box_uv_region + one global list_textures audit
BASE PASS → material regions; fill remains provisional
VALUE / FORM PASS → stepped form/contact/occlusion/edge + material ramp
IDENTITY PASS → exact-pixel paint_with_brush
SECONDARY DETAIL PASS → scale to pixels per UV unit; stop before noise
VERIFY → one fresh atlas after coherent pass + affected model views
```

For repeated same-color detail points, use one `paint_with_brush` coordinate batch with `connect_strokes=false` for disconnected pixels.

`FAIL / UNVERIFIED / PASS` is visual-only. Diagnose `REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY | UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY`.

## Texture Visual Convergence

Use approved reference + fresh `get_texture` atlas + affected `capture_model_views`; mutation makes evidence stale. Review UV/region → palette/material → form/contact/edge → seam/orientation → identity → microdetail.

Local `FAIL` → smallest causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`. Same causal direction failing twice without new evidence → `BLOCKED`.

## Native Bedrock PBR / UV

`apply_texture` stays disabled for Bedrock `single_texture`. Box UV state is `uv_offset`, `mirror_uv`, `autouv`. **Native Bedrock PBR** and per-face `material_instance` never justify base-atlas fragmentation.
