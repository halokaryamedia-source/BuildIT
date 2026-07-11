---
name: blockbench-texture
description: "Texture-stage skill for Classic Minecraft Bedrock cuboid assets. Performs only approved per-face UV and pixel-art texturing, saves atlas evidence, validates Texture, and stops for review."
---

# Blockbench Texture

## Entry

Use only when the active stage is `TEXTURE` with tool profile `BEDROCK_CUBOID_TEXTURE` or `TEXTURE_LOCAL_REPAIR` and the current MCP session owns the project write lease.

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
- Preserve approved Geometry.

## Forbidden

- PBR, MER, normal maps, or Vibrant Visuals;
- mesh UV tools;
- gradients or soft anti-aliased shading for pixel-art assets;
- geometry redesign;
- animation work;
- final export.

## Review Output

1. Use `save_texture_evidence` to write the atlas directly inside the active session; do not return texture base64 through the agent.
2. Save the Texture review checkpoint.
3. Call `capture_standard_views` with the active project UUID, absolute session root, Texture evidence directory, and `return_images: false`.
4. Run `validate_reference_contract` for Texture.
5. Write `texture_report.json` and stop for `APPROVED` or `REVISION: ...`.

Regenerate only affected evidence during a targeted revision.
