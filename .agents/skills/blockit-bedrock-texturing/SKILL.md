---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity specialist for UV Layout, Texture Atlas lifecycle, Texture Styling, Painter, PBR, and material_instance metadata.
---

# BlockIT Bedrock UV + Texture

Geometry judgement: `blockbench-bedrock-modelling`.

## Canonical Stage Vocabulary

Keep stages separate:

```text
UV LAYOUT       = geometry → atlas coordinate mapping
TEXTURE ATLAS   = bitmap/PNG canvas that stores pixels
TEXTURE STYLING = color/material/shading/detail authored into the atlas
TEXTURE VERIFY  = fresh atlas + mapped-model visual validation
```

`create_texture` = **Texture Atlas**. `uv_offset`, `autouv`, `mirror_uv`, per-face UV, `box_uv_region` = **UV Layout**. Painter tools = **Texture Styling**.

## Direct Routing

Reuse fresh state; load exact tool spec only when not loaded.

```text
UV Layout
  fresh Box-UV state       → reuse place_cube box_uv_region
  final Box-UV lock        → modify_cubes_batch
  global UV audit          → list_textures
  face-specific mapping    → inspect_element only when needed

Texture Atlas
  create atlas bitmap      → create_texture
  atlas inventory/select   → list_textures / activate_texture

Texture Styling
  base/material regions    → draw_shape_tool
  contiguous base fill     → paint_fill_tool
  stepped value/form/edge  → draw_shape_tool / paint_with_brush
  supported smooth ramp    → gradient_tool
  identity/detail pixels   → paint_with_brush
  PBR/material semantics   → create_pbr_material / configure_material / assign_texture_channel

Texture Verify
  fresh atlas image        → get_texture
  mapped model evidence    → capture_model_views
```

## UV Layout

Run UV work only after geometry exists. For fresh Box UV, reuse `place_cube` `box_uv_region`; do not re-inspect by ritual. Keep auto UV active while geometry can still change.

After geometry `PASS`, use one `modify_cubes_batch` to lock final Box-UV Cubes with `autouv=0`, then call `list_textures` once for global audit. Require integer logical UV unless justified, no invalid/out-of-bounds UV, no accidental partial overlap, deliberate exact reuse/mirror, and stable seam/orientation.

Use `inspect_element` only for face-specific mapping/orientation; one Cube inspection returns all faces. Reuse `texture_pixels.rect`, `flip_u`, `flip_v`.

## Texture Atlas

Use **one base-color atlas PNG for the whole model**, never per body part/Cube/material zone. `list_textures`: `none` → create; `single` → reuse; `fragmented` → stop/reconcile.

New AI production uses logical UV **128×128**. Pass explicit 128-based `width`/`height`; do not rely on provisional 16×16 default. Pin atlas UUID and pass `texture_id` when multiple textures are loaded.

PBR normal/height/MER are support atlas channels. Atlas creation/fill does **not** complete Texture Styling.

## Texture Styling

Before production pixels define palette/value-hue ramp, material zones, face-aware shading, contact/occlusion, edge, alpha intent, seam/orientation, identity marks, detail budget, and pixels per UV unit.

Flat fill is a **BASE PASS only** when form/material/detail is visible. Prefer controlled Minecraft pixel clusters and stepped value/hue ramps; reject random high-contrast noise. Use smooth `gradient_tool` transitions only when reference/style supports them.

```text
BASE PASS             → material regions; fill remains provisional
VALUE / FORM PASS     → form/contact/occlusion/edge + material ramp
IDENTITY PASS         → exact-pixel identity marks
SECONDARY DETAIL PASS → controlled detail by pixels per UV unit; stop before noise
VERIFY                → Texture Verify
```

For repeated same-color disconnected detail, use one `paint_with_brush` coordinate batch with `connect_strokes=false`.

## Texture Verify / Visual Convergence

Use approved reference + fresh `get_texture` + affected `capture_model_views`. Review UV/region → palette/material → form/contact/edge → seam/orientation → identity → microdetail.

`FAIL / UNVERIFIED / PASS` is visual-only. Texture mutation makes evidence stale. `FAIL` → smallest causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`. Same causal direction failing twice without new evidence → `BLOCKED`.

## Native Bedrock PBR

`apply_texture` stays disabled for Bedrock `single_texture`. Box UV state is `uv_offset`, `mirror_uv`, `autouv`. Native Bedrock PBR and per-face `material_instance` never justify base-atlas fragmentation.
