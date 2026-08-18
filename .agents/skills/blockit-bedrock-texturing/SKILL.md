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

## AI Production Atlas Standard

For normal AI-authored Bedrock Entity production, use **one color atlas PNG for the whole model**. Do not create one color texture per body part, Cube, material zone, or object section. Before creating texture state, use `list_textures` when current texture state is unknown:

```text
no usable color atlas → create exactly one production color atlas
one usable color atlas → reuse / activate it
multiple color textures → do not add another; distinguish explicit variants/PBR from accidental part textures before continuing
```

Additional color textures are valid only for an explicit texture variant requirement. PBR normal/height/MER textures are supporting channels, not permission to fragment the base color atlas.

New AI-authored projects use **128×128 logical UV**. Production color PNG canvas starts at **128×128** and scales upward only in clean 128-based sizes when visible detail needs more room. Prefer the smallest sufficient canvas and always send explicit `width`/`height` to `create_texture`; do not rely on its small generic default. Existing/user-supplied assets may keep their authored nonstandard resolution. Do not invent custom logical UV dimensions from professional samples.

## Texture Design Contract

Before production pixels define:

```text
atlas: one base-color PNG + chosen 128-based canvas
palette roles per material: base | shadow | highlight | accent as actually needed
material zones: Cube/face + mapped region
value hierarchy / part separation
one face-aware shading language
hard-pixel / edge language and alpha intent
directional/asymmetric marks + mirror constraints
seam-critical edges / pattern direction
identity-critical marks
detail budget: identity > material > optional wear/noise
required PBR / material_instance meaning
```

Use an intentional **palette ramp per material family**, not one undifferentiated global palette. Metal, cloth, wood, skin/organic, stone, painted surfaces, and accents may need different value/hue behavior; these are semantic families, not fixed recipes or fixed color counts.

A flat base color is **not completion** when the reference/style shows form shading, material variation, edge treatment, pattern, or identity detail. Use controlled stepped value ramps for Minecraft pixel texture; continuous smooth gradient is optional only when the reference actually calls for it. For crisp pixel-art style, prefer hard texel edges, full-opacity authored pixels, and zero-softness exact-pixel work; do not introduce accidental anti-aliasing.

## UV / Atlas Gate

Do not start production painting until the intended single-atlas UV state is usable. Inspect only the Cubes/faces needed to establish the map, then finalize Box-UV state with existing Cube tools:

```text
single color atlas selected
→ important faces map inside intended canvas
→ uv_offset / mirror_uv / autouv final enough for painting
→ accidental overlap rejected; intentional symmetric/repeated reuse allowed
→ directional marks have non-mirrored/oriented space when required
→ seam-critical regions identified
```

Do not maximize packing percentage as a quality score. Focal/readable regions may receive more usable texel space. Once substantial painting begins, do not move UVs without a concrete reason because that invalidates downstream pixels.

## Mapped Authoring Procedure

**Do not mentally re-derive atlas coordinates** when `inspect_element` already reports them.

```text
MAP → require mapping_state=mapped + paintable=true; reuse texture_pixels.rect/size + flip_u/flip_v
BASE PASS → major material regions first with bounded draw_shape_tool
VALUE / FORM PASS → controlled face-aware shading + material palette ramps; flat fill alone cannot pass when form is visible
IDENTITY PASS → required markings/features with bounded regions or paint_with_brush exact-pixel path
SECONDARY DETAIL PASS → purposeful material detail; stop before noise
VERIFY → fresh atlas + model-view evidence after coherent pass/correction
```

Diagnose `REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY | UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY`. Tool success is not visual `PASS`.

## Texture Visual Convergence

Reference-driven review requires actual approved image + fresh `get_texture` atlas + affected `capture_model_views`; texture mutation makes affected evidence stale.

Review structure before microdetail:

```text
UV / region placement
→ palette + material separation
→ value / form shading
→ seam / orientation
→ identity-critical marks
→ secondary detail density
```

```text
Texture Difference Table
region | reference | atlas | model view | category | mismatch | severity | FAIL | UNVERIFIED | PASS
```

Local `FAIL` → target/invariant → **smallest bounded correction** → retain pre-evidence → T3 mutate → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`. Progress requires target `IMPROVED` and no supported regression. Same causal correction direction failing twice without new evidence → `BLOCKED`.

## Native Bedrock PBR / UV

`apply_texture` is disabled for Bedrock `single_texture`; use `activate_texture` to choose the active/default working texture.

`material_instance` is face metadata. For **Box-UV Cubes**, `uv_offset`, `mirror_uv`, `autouv` are authored state; use `modify_cube` or `modify_cubes_batch`.

Logical project UV resolution and bitmap pixel dimensions are separate runtime facts. For new AI-authored production, keep the logical baseline simple at 128 and choose a 128-based bitmap canvas; `inspect_element` owns any required logical-to-physical mapping. Existing professional assets may legitimately differ, but those sample-specific relationships are evidence to interpret, not a new authoring preset.
