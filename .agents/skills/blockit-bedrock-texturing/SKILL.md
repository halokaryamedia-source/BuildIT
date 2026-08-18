---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity texture specialist for texture lifecycle, Painter, PBR, and material_instance metadata.
---

# BlockIT Bedrock Texturing

Geometry: `blockbench-bedrock-modelling`.

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

Known identity skips discovery. `create_texture` already returns texture identity/size/group/channel/render metadata.

## Deferred Spec Loading / Stage

Load missing spec by **exact tool name** + action. Use `DISCOVER → DESIGN → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.
Reuse mutation output; **do not re-list/re-read it only for confirmation**.

## Readiness

Production texturing starts after dependent geometry `PASS`; geometry `FAIL` returns upstream and required `UNVERIFIED` becomes `BLOCKED`.

For an **existing asset**, geometry is baseline; **Do not claim that baseline is reference-accurate**. A **flat/placeholder texture** is provisional. After geometry changes, **re-check only the affected downstream state**: Cube/face, UV, alignment, material_instance, PBR.

## Minecraft-First Surface

Preserve palette, material regions, part separation, identity markings, required material/PBR meaning. Prefer readable pixels over photoreal detail or random high-contrast noise; do not paint fake silhouette. Minor drift: **user requirement → original Source evidence → approved reference → simplest Minecraft-readable texture**. Material identity/region/channel conflict → `BLOCKED`; do not average conflicting material evidence.

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

Use an intentional palette family. Same-material faces keep controlled value separation and one highlight direction. Directional marks account for face rotation, `flip_u`/`flip_v`, mirror UV; seam-crossing marks align.

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

Diagnose `REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY | UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY`. Tool success is not visual `PASS`.

## Texture Visual Convergence

Reference-driven review requires actual approved image + fresh `get_texture` atlas + affected `capture_model_views`; texture mutation makes affected evidence stale.

```text
Texture Difference Table
region | reference | atlas | model view | category | mismatch | severity | FAIL | UNVERIFIED | PASS
```

Local `FAIL` → target/invariant → **smallest bounded correction** → retain pre-evidence → T3 mutate → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`. Progress requires target `IMPROVED` and no supported regression. Same causal correction direction failing twice without new evidence → `BLOCKED`.

## Native Bedrock PBR / UV

`apply_texture` is disabled for Bedrock `single_texture`; use `activate_texture` to choose the active/default working texture.

`material_instance` is face metadata. For **Box-UV Cubes**, `uv_offset`, `mirror_uv`, `autouv` are authored state; use `modify_cube` or `modify_cubes_batch`.

Logical project UV resolution and bitmap pixel dimensions are separate facts; do not assume equality, power-of-two sizing, or packing-density target.
