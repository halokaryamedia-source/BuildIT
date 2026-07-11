---
name: blockbench-texture
description: "Texture-stage skill for Classic Minecraft Bedrock cuboid assets. Performs only approved per-face UV and pixel-art texturing, saves atlas evidence, validates Texture, and stops for review."
---

# Blockbench Texture

## Entry

Use only when the active stage is `TEXTURE` with tool profile `BEDROCK_CUBOID_TEXTURE` or `TEXTURE_LOCAL_REPAIR`.

Read:

1. `PRODUCTION_CONTEXT.md`
2. the approved Reference Visual
3. `GEOMETRY.md`
4. `TEXTURING.md`
5. the current session state

## Work

```text
UV
→ BASE_TEXTURE
→ DETAIL_TEXTURE
→ texture evidence
→ checkpoint
→ preview views
→ compact validation
→ TEXTURE_REVIEW
```

- Use Classic Bedrock materials only.
- Use the approved atlas dimensions and Per-face UV unless the reference package explicitly states otherwise.
- Keep pixels sharp and use the approved palette/material zones.
- Mirror only approved regions; keep directional details unique.
- Use direct texture evidence writing instead of returning image base64 through the agent.
- Preserve approved Geometry.

## Forbidden

- PBR, MER, normal maps, or Vibrant Visuals;
- mesh UV tools;
- gradients or soft anti-aliased shading for pixel-art assets;
- geometry redesign;
- animation work;
- final export.

## Review Output

Create the Texture review checkpoint, atlas evidence, required model views, and `texture_report.json`. Run `validate_reference_contract` for Texture and stop for `APPROVED` or `REVISION: ...`.
