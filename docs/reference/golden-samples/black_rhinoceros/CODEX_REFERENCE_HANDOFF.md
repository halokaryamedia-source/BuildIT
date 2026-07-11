# Codex Reference Handoff

Status: `APPROVED`
Sample Type: `GOLDEN_SAMPLE`

## Asset

- Asset ID: `black_rhinoceros`
- Display Name: `Black Rhinoceros`
- Target Format: Bedrock Entity
- Primary Visual: `01_black_rhinoceros_form_scale_reference.png`
- Standardized Visual Alias: `black_rhinoceros_reference_visual.png`
- Construction Sheet: `02_black_rhinoceros_construction_reference.png`
- Texture Sheet: `03_black_rhinoceros_texture_material_reference.png`
- Motion Sheet: `04_black_rhinoceros_motion_pivot_reference.png`
- Manifest: `reference_manifest.json`

## Golden Sample selection

When the user asks to run the BuildIT Golden Sample, select this package directly. Do not search for another asset and do not report `GOLDEN_SAMPLE_REQUIRED` when this package is present and valid.

## Source authority order

1. `PRODUCTION_CONTEXT.md`
2. `reference_manifest.json`
3. Sheet 01 for identity, form, scale, color family, and neutral pose
4. Sheet 02 for hierarchy, part boundaries, construction, and footprint
5. Sheet 03 for texture, palette, atlas, and UV
6. Sheet 04 for pivot readiness and animation-skip decision
7. active-stage contract

If files conflict, stop with `REFERENCE_CONFLICT`.

## Import mapping

Copy technical files into:

```text
workspace/active/black_rhinoceros/mcp/references/
```

Copy visual files into:

```text
workspace/active/black_rhinoceros/blockbench/references/
```

Use only:

```text
workspace/active/black_rhinoceros/blockbench/black_rhinoceros.bbmodel
```

## Project lock

- Scale: `27.2u W × 52.8u L × 40u H`
- Baseline: `16u = 1 block`
- Ground Plane: `Y = 0`
- Front Direction: `-Z`
- UV Mode: Box UV baseline
- Texture Atlas: `128 × 128`
- Pixel Style: `16x`
- Classic Bedrock: required
- PBR: forbidden
- Vibrant Visuals: forbidden
- Mesh: forbidden
- Animation Required: false

## Stage routing

```text
GEOMETRY
→ blockbench-production + blockbench-geometry
→ BEDROCK_CUBOID_GEOMETRY
→ GEOMETRY.md

TEXTURE
→ blockbench-production + blockbench-texture
→ BEDROCK_CUBOID_TEXTURE
→ TEXTURING.md

ANIMATION
→ skip; record ANIMATION_SKIPPED

FINAL_VALIDATION
→ blockbench-production + blockbench-validation
→ FINAL_VALIDATION_READONLY
→ VALIDATION.md
```

Maximum loaded production skills: `2`.

## First runtime objective

Generate Geometry through actual MCP tools, capture five standard views, save a non-approved review checkpoint, and stop at:

```text
GEOMETRY_REVIEW
AWAITING_USER_REVIEW
```

Do not copy an expected `.bbmodel` into the active project.

## Non-negotiable rules

- Do not redesign the rhinoceros.
- Do not invent new parts or animation clips.
- Do not use mesh, PBR, Hytale, armature, vertex-weight, UI automation, or risky evaluation tools.
- Do not continue from Geometry to Texture without actual user approval.
