---
name: blockit-bedrock-texturing
description: Bedrock Entity texture specialist for texture lifecycle, Painter, PBR, and material_instance metadata.
---

# BlockIT Bedrock Texturing

Geometry: `blockbench-bedrock-modelling`.

## Direct Routing

**Reuse identity/metadata already returned by the current workflow.** `create_texture` already returns texture identity/size/group/channel/render metadata. `list_textures` owns atlas/UV audit; `get_texture` image evidence; use `activate_texture` to choose the active/default working texture. PBR uses `create_pbr_material` / `configure_material` / `assign_texture_channel`.

## Deferred Spec Loading

Known identity skips discovery. Load the exact tool name only; do not re-list/re-read it only for confirmation. Production texture waits for geometry `PASS`.

For an existing asset, current texture state may be a baseline only. Do not claim that baseline is reference-accurate. A flat/placeholder texture is temporary; after upstream change, re-check only the affected downstream state.

## AI Production Atlas

AI Bedrock production uses **one base-color atlas PNG for the whole model**. Never create base color per body part, Cube, or material zone. `list_textures`: `none` → create one; `single` → reuse; `fragmented` → stop and reconcile. Variants use non-material TextureGroup; PBR maps remain support textures.

New projects keep logical UV **128×128**. New base-color bitmaps use square 128-based sizes (128/256/384/512/…) and smallest sufficient size; imports may retain dimensions. Pin atlas UUID; pass `texture_id` when multiple textures are loaded.

## Texture Design Contract

Before production pixels define:

```text
atlas UUID + logical/physical size + pixels per UV unit
palette roles + value/hue ramp per material family
material zones: Cube/face + mapped region
value hierarchy / part separation
face-aware shading language
contact / occlusion + edge treatment
directional/asymmetric marks + mirror constraints
seam-critical edges / pattern direction
identity-critical markings
detail budget: identity > material > optional wear/noise
required PBR / material_instance meaning
```

Flat base color is provisional when reference/style shows form/material/detail. Minecraft pixel style prefers stepped clusters, controlled hue/value shifts, hard edges, and alpha `0`/`255`; softer alpha needs evidence. Reject random high-contrast noise.

## UV / Atlas Gate

Use `list_textures` global audit before production paint. For AI **Box-UV Cubes**, final painted Cubes use `autouv=0`; `modify_cubes_batch` may carry existing Box-UV state. Logical project UV resolution and bitmap pixel dimensions are separate facts. Require integer logical UV, no out-of-bounds/invalid UV, no unexplained partial overlap, stable seams, and intentional exact reuse.

**Do not mentally re-derive atlas coordinates.** For a needed face use `inspect_element`; require `mapping_state=mapped` + `paintable=true`, and reuse `texture_pixels.rect/size`, `flip_u`, `flip_v`.

```text
MAP → global audit + affected inspect_element
BASE PASS → draw_shape_tool major material regions
VALUE / FORM PASS → form + contact/occlusion + edge + material ramps
IDENTITY PASS → paint_with_brush exact-pixel path
SECONDARY DETAIL PASS → scale detail to pixels per UV unit; stop before noise
VERIFY → fresh atlas + model-view evidence
```

Tool success is not visual `PASS`. Diagnose `REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY | UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY`.

## Texture Visual Convergence

Reference review requires actual approved image + fresh `get_texture` + affected `capture_model_views`; mutation makes evidence stale. Minor drift uses one canonical interpretation; do not average conflicting material evidence. Use a **Texture Difference Table**: region → palette/material → form/contact/edge → seam/orientation → identity → microdetail.

Local `FAIL` → target/invariant → **smallest bounded correction** → **retain pre-evidence** → T3 mutate → fresh evidence → `IMPROVED | UNCHANGED | REGRESSED`. Same causal correction direction failing twice without new evidence → `BLOCKED`.

## Native Bedrock PBR / UV

`apply_texture` is disabled for Bedrock `single_texture`; use explicit atlas identity. Box UV state is `uv_offset`, `mirror_uv`, `autouv`. **Native Bedrock PBR** and per-face `material_instance` remain supported; neither justifies base-atlas fragmentation.
