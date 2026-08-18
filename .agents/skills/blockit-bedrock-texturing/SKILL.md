---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity texture specialist for texture lifecycle, Painter, PBR, and material_instance metadata.
---

# BlockIT Bedrock Texturing

Geometry: `blockbench-bedrock-modelling`.

## Direct Routing

**Reuse identity/metadata already returned by the current workflow.** `create_texture` already returns texture identity/size/group/channel/render metadata. `list_textures` owns atlas/UV audit; `get_texture` image evidence; `activate_texture` selection; PBR uses `create_pbr_material` / `configure_material` / `assign_texture_channel`.

## Deferred Spec Loading

Known identity skips discovery. Load the exact tool name only; do not re-list/re-read it only for confirmation. Production texture waits for geometry `PASS`.

## AI Production Atlas

Normal AI Bedrock production uses **one base-color atlas PNG for the whole model**. Never create base color per body part, Cube, or material zone. `list_textures`: `none` → create one; `single` → reuse; `fragmented` → stop and reconcile. A color variant must be explicit in a non-material TextureGroup. PBR normal/height/MER remain support textures.

New AI projects keep logical UV **128×128**. New base-color bitmaps use square 128-based sizes (128/256/384/512/…) and the smallest sufficient size; imported existing assets may retain authored dimensions. After choosing the base atlas, pin its UUID and pass `texture_id` explicitly whenever multiple textures are loaded.

## Texture Design Contract

Before production pixels define:

```text
atlas UUID + logical/physical size + pixels per UV unit
palette roles + value/hue ramp per material family
material zones: Cube/face + mapped region
value hierarchy / part separation
one face-aware shading language
contact / occlusion + edge treatment
hard-pixel + alpha intent
directional/asymmetric marks + mirror constraints
seam-critical edges / pattern direction
identity-critical marks
detail budget: identity > material > optional wear/noise
required PBR / material_instance meaning
```

Flat base color is provisional when reference/style shows form/material/detail. Minecraft pixel style prefers stepped clusters, controlled hue/value shifts, hard edges, and alpha `0`/`255`; softer or intermediate-alpha treatment needs evidence. Reject random high-contrast noise.

## UV / Atlas Gate

Use `list_textures` global audit before production paint. For AI Box UV, final painted Cubes use `autouv=0`. Require integer logical UV unless specifically justified, no out-of-bounds/invalid UV, no unexplained partial overlap, and stable orientation/seams. Exact reuse for symmetric/repeated UV is allowed; packing percentage is not a score. Do not move UV after substantial painting without a concrete reason.

**Do not mentally re-derive atlas coordinates.** For a needed face use `inspect_element`; require `mapping_state=mapped` + `paintable=true`, and reuse `texture_pixels.rect/size`, `flip_u`, `flip_v`.

```text
MAP → global audit + affected inspect_element
BASE PASS → major material regions with draw_shape_tool
VALUE / FORM PASS → face-aware form, contact/occlusion, edge treatment, material ramps
IDENTITY PASS → required marks via paint_with_brush exact-pixel path
SECONDARY DETAIL PASS → scale detail to pixels per UV unit; stop before noise
VERIFY → fresh atlas + model-view evidence
```

Tool success is not visual `PASS`. Diagnose `REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY | UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY`.

## Texture Visual Convergence

Reference review requires actual approved image + fresh `get_texture` atlas + affected `capture_model_views`; mutation makes evidence stale. Use a **Texture Difference Table** and review UV/region → palette/material → form/contact/edge → seam/orientation → identity → microdetail.

Local `FAIL` → target/invariant → **smallest bounded correction** → **retain pre-evidence** → T3 mutate → fresh evidence → `IMPROVED | UNCHANGED | REGRESSED`. Progress requires `IMPROVED` with no supported regression. **Same causal correction direction failing twice without new evidence** → `BLOCKED`.

## Native Bedrock PBR / UV

`apply_texture` is disabled for Bedrock `single_texture`; use explicit atlas identity. Box UV authored state is `uv_offset`, `mirror_uv`, `autouv` via Cube tools. Logical UV and bitmap size are separate facts. **Native Bedrock PBR** and per-face `material_instance` remain supported; neither justifies base-atlas fragmentation.
