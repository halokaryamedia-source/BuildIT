---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity texture specialist for texture lifecycle, Painter, PBR, and material_instance metadata.
---

# BlockIT Bedrock Texturing

Geometry stays with `blockbench-bedrock-modelling`.

## Direct Routing

**Reuse identity/metadata already returned by the current workflow.**

```text
missing texture → create_texture
unknown texture → list_textures
pixel evidence → get_texture
active/default → activate_texture
bounded region → draw_shape_tool
exact pixels/general brush → paint_with_brush
PBR create/edit → create_pbr_material / configure_material
PBR inspect/channel → get_material_info / assign_texture_channel
material_instance → dedicated material-instance tool
```

Known identity skips discovery. `get_texture` is evidence, not confirmation.

## Deferred Spec Loading / Stage

Load missing spec by **exact tool name** + action; otherwise call it. Use `DISCOVER → DESIGN → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.

- Reuse mutation output; **do not re-list/re-read it only for confirmation**.
- Bounded mismatch → local correction; failure keeps capability unless state became stale/unknown.

## Readiness

Production texturing starts after dependent geometry `PASS`; geometry `FAIL` returns upstream and required `UNVERIFIED` becomes `BLOCKED`.

For an **existing asset**, geometry is baseline. **Do not claim that baseline is reference-accurate**. A **flat/placeholder texture** is provisional. After geometry changes, **re-check only the affected downstream state**: Cube/face, UV, assignment/alignment, material_instance, PBR.

## Minecraft-First Surface

Preserve base palette, major material regions, part separation, identity-critical markings, required material/PBR meaning. Prefer readable pixels over photoreal detail or random high-contrast noise; do not paint fake silhouette. Minor drift may be canonicalized: **user requirement → original Source evidence → approved reference → simplest Minecraft-readable texture**. Material identity/region/channel conflict → `BLOCKED`; do not average conflicting material evidence.

## Texture Design Contract

Before production pixels define:

```text
style/readable density
palette roles: base | secondary | shadow | highlight | accent
material zones: Cube/face + mapped region
value hierarchy / part separation
one face-aware shading language
directional/asymmetric marks + mirror constraints
seam-critical edges / pattern direction
detail budget: identity > material > optional wear/noise
required PBR / material_instance meaning
```

Use a small intentional palette family. Same-material faces keep one family with controlled value separation and one highlight direction. Directional marks account for face rotation, `flip_u`/`flip_v`, mirror UV; continuous markings align across seams. Detail must improve identity, material readability, or form. Material/seam ambiguity stays `UNVERIFIED`/`BLOCKED`.

## Mapped Authoring Procedure

Do not mentally re-derive atlas coordinates when `inspect_element` already reports them.

```text
MAP → require mapping_state=mapped + paintable=true; reuse texture_pixels.rect/size + flip_u/flip_v
BASE PASS → major regions first with bounded draw_shape_tool
VALUE / FORM PASS → controlled face-aware value/material variation
IDENTITY PASS → bounded regions or paint_with_brush exact-pixel path
SECONDARY DETAIL PASS → purposeful material detail; stop before noise
VERIFY → fresh atlas + model-view evidence after coherent pass/correction
```

Diagnose `REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY | UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY`. Tool success is not visual `PASS`; correct locally.

## Native Bedrock PBR / UV

`apply_texture` is intentionally not enabled for normal Bedrock Entity `single_texture`; use `activate_texture`, then Painter.

`material_instance` is Bedrock face metadata, distinct from PBR. For **Box-UV Cubes**, `uv_offset`, `mirror_uv`, `autouv` are authored state; use `modify_cube` or `modify_cubes_batch`.

Logical project UV resolution and bitmap pixel dimensions are separate facts; do not assume equality, power-of-two sizing, or packing-density target. Inspect PBR before replacing channels; keep color/normal/height/MER identity deterministic.

## Verification

Atlas checks region/seam/flip/density; model view checks material readability, part separation, shading, identity/style. Keep RTX/in-game claims bounded to evidence.
