# Codex Reference Handoff

Status: `APPROVED`

## Asset

- Asset ID: `<asset_id>`
- Display Name: `<display_name>`
- Target Format: `bedrock_entity`
- Primary Visual: `01_<asset_id>_form_scale_reference.png`
- Standardized Visual Alias: `<asset_id>_reference_visual.png`
- Reference Manifest: `reference_manifest.json`

## Source authority order

1. `PRODUCTION_CONTEXT.md`
2. `reference_manifest.json`
3. Sheet 01 for form, scale, identity, and neutral pose
4. Sheet 02 for construction, hierarchy, and attachments
5. Sheet 03 for texture, palette, atlas, and UV
6. Sheet 04 for motion, pivots, and clipping risks
7. Stage contract for the active production stage

When files conflict, stop with `REFERENCE_CONFLICT`. Do not choose an interpretation silently.

## Scale lock

- `1 Minecraft block = 16u`
- `Player reference = 28.8u = 1.8 blocks`
- Asset envelope: `<width>u W × <depth>u D × <height>u H`
- Ground plane: `<ground_plane>`
- Collision, visible bounds, and rider seat are not finalized unless explicitly listed in Production Context.

## Project lock

- UV Mode: `<uv_mode>`
- Texture Atlas: `<width>x<height>`
- Pixel Style: `<16x_or_32x>`
- Front Direction: `<front_direction>`
- Classic Bedrock: required
- PBR: forbidden
- Vibrant Visuals: forbidden

## Stage routing

```text
GEOMETRY
→ blockbench-production + blockbench-geometry
→ BEDROCK_CUBOID_GEOMETRY
→ read GEOMETRY.md

TEXTURE
→ blockbench-production + blockbench-texture
→ BEDROCK_CUBOID_TEXTURE
→ read TEXTURING.md

ANIMATION when required
→ blockbench-production + blockbench-animation
→ BEDROCK_CUBOID_ANIMATION
→ read ANIMATION.md

FINAL_VALIDATION
→ blockbench-production + blockbench-validation
→ FINAL_VALIDATION_READONLY
→ read VALIDATION.md
```

Maximum loaded production skills: `2`.

## Import

Import technical files into:

```text
workspace/active/<asset_id>/mcp/references/
```

Import visual files into:

```text
workspace/active/<asset_id>/blockbench/references/
```

Use only the canonical model filename:

```text
<asset_id>.bbmodel
```

## Non-negotiable rules

- Do not redesign the approved reference.
- Do not invent new parts, materials, clips, or proportions.
- Do not continue through a user review gate automatically.
- Do not load all production skills together.
- Do not use PBR, Hytale, mesh, armature, vertex-weight, UI automation, or risky evaluation in the normal cuboid workflow.
- Use the exact stage tool profile and write lease.
