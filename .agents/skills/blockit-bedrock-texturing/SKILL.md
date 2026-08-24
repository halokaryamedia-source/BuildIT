---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity texture specialist for texture lifecycle, Painter, PBR, and material_instance metadata.
---

# BlockIT Bedrock Texturing

Geometry: `blockbench-bedrock-modelling`.

## Direct Routing

Reuse fresh identity/metadata.

```text
create texture / atlas      → create_texture
atlas identities + UV audit → list_textures
fresh image evidence        → get_texture
working texture selection   → activate_texture
PBR create/configure        → create_pbr_material / configure_material
PBR channel assignment      → assign_texture_channel
```

## Deferred Spec Loading

Known identity skips discovery. Load the **exact tool name** only; do not re-list/re-read it only for confirmation. Production texture waits for geometry `PASS`.

## AI Production Atlas

Use **one base-color atlas PNG for the whole model**: never base color per body part, Cube, or material zone. `list_textures`: `none` → create; `single` → reuse; `fragmented` → stop/reconcile. PBR normal/height/MER are support textures.

New AI projects: logical UV **128×128**; choose the smallest sufficient square 128-based bitmap. Pin the color atlas UUID and pass `texture_id` when multiple textures are loaded. **Marketplace density standard: production bitmap = 2× logical UV** (128 UV → 256 PNG, 256 UV → 512 PNG) so identity detail stays readable.

## Texture Design Contract

Before production pixels define:

```text
atlas UUID + logical/physical size + pixels per UV unit
palette roles + value/hue ramp
material zones + value hierarchy + face-aware shading
contact / occlusion + edge treatment
hard-pixel + alpha intent
direction/mirror + seam constraints
identity-critical marks
detail budget: identity > material > optional wear/noise
required PBR / material_instance meaning
```

Flat color is provisional when form/material/detail is visible. Prefer controlled Minecraft pixel clusters; reject random high-contrast noise.

## UV / Atlas Gate

Run `list_textures` before paint. AI Box UV final paint: `autouv=0`; require integer logical UV unless justified, no out-of-bounds/invalid UV, no unexplained partial overlap, stable seams/orientation; exact reuse is valid.

**Do not mentally re-derive atlas coordinates.** For a needed face use `inspect_element`; require `mapping_state=mapped` + `paintable=true`, then reuse `texture_pixels.rect`, `flip_u`, `flip_v`.

```text
MAP → audit + affected inspect_element
BASE PASS → draw_shape_tool major regions
PAINT ECONOMY → one bounded rectangle fills all six faces of a single-material cube (box-fill) before per-pixel detail
VALUE / FORM PASS → face-aware form/contact/occlusion/edge + material ramp
IDENTITY PASS → paint_with_brush exact-pixel path
SECONDARY DETAIL PASS → scale to pixels per UV unit; stop before noise
VERIFY → fresh atlas + model-view evidence
```

`FAIL / UNVERIFIED / PASS` is visual-only; Tool success cannot create visual PASS. Diagnose `REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY | UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY`.

## Texture Visual Convergence

Use actual approved reference + fresh `get_texture` atlas + affected `capture_model_views`; texture mutation makes evidence stale. **Texture Difference Table** order: UV/region → palette/material → form/contact/edge → seam/orientation → identity → microdetail.

Local `FAIL` → target/invariant → **smallest bounded correction** → **retain pre-evidence** → T3 mutate → fresh evidence → `IMPROVED | UNCHANGED | REGRESSED`. Same causal correction direction failing twice without new evidence → `BLOCKED`.

## Native Bedrock PBR / UV

`apply_texture` stays disabled for Bedrock `single_texture`; use explicit atlas identity. Box UV state is `uv_offset`, `mirror_uv`, `autouv`. **Native Bedrock PBR** and per-face `material_instance` are supported and never justify base-atlas fragmentation.
