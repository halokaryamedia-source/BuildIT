# ChatGPT Reference Studio

This boundary documents the ChatGPT-only reference-generation workflow used before Codex or MCP-Blockbench starts model production.

## Responsibility boundary

```text
CHATGPT REFERENCE STUDIO
source image and user notes
→ Production Context
→ approved visual and technical reference sheets
→ stage contracts
→ reference manifest
→ Codex handoff
→ final reference ZIP

CODEX + MCP-BLOCKBENCH
approved ZIP
→ workspace import
→ contract validation
→ Geometry
→ Texture
→ optional Animation
→ Final Validation
```

The ChatGPT skill does not connect to Blockbench, acquire MCP write leases, select MCP tool profiles, or modify `.bbmodel` files.

The Codex production skills do not redesign or regenerate approved ChatGPT references.

## Canonical skill

```text
engines/chatgpt/skills/blockbench-reference-studio/
```

This skill is intentionally not synchronized into:

```text
.agents/skills/
.codex/skills/
```

It is also not registered in `engines/shared/skills/skill-profiles.json`, because that registry controls runtime model-production skills only.

## Valid handoff package

A completed package must contain:

```text
<asset_id>_blockbench_reference/
├─ source/
├─ PRODUCTION_CONTEXT.md
├─ <asset_id>_reference_visual.png
├─ 01_<asset_id>_form_scale_reference.png
├─ 02_<asset_id>_construction_reference.png
├─ 03_<asset_id>_texture_material_reference.png
├─ 04_<asset_id>_motion_pivot_reference.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

`<asset_id>_reference_visual.png` is a byte-identical handoff alias of Sheet 01 for consumers that require the standardized filename. Sheet 01 remains the visual authority.

The final archive name is:

```text
<asset_id>_blockbench_reference.zip
```

## Approval gates

1. Production Context approval
2. Sheet 01 approval
3. Sheets 02–04 and stage-contract approval

Only after all three gates may ChatGPT create the final ZIP.

## Production skill handoff

After import, Codex routes the package through:

```text
blockbench-production + blockbench-geometry
→ blockbench-production + blockbench-texture
→ blockbench-production + blockbench-animation when required
→ blockbench-production + blockbench-validation
```

Maximum loaded runtime production skills remain `2`.
