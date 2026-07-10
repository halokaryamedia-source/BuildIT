# Marketplace Quality Baseline

Use this as the default quality bar for every Bedrock Entity, regardless of asset theme.

The goal is marketplace-grade output, not a quick prototype.

For detailed sample-derived rules, use `marketplace-sample-knowledge-base.md`.

## General Quality Target

Every model should have:

- readable silhouette from gameplay distance,
- clean Bedrock Entity hierarchy,
- scale that makes sense against player/block references,
- geometry used for form, attachment, silhouette, and animation readiness,
- texture used for material depth, trims, seams, scratches, glow, gradients, and tiny detail,
- compact Per-face UV planning,
- no free-floating parts unless intentionally floating and parented,
- no noisy micro-cube detail,
- no flat single-color large visible surfaces after texturing phases.

## Category-Neutral Marketplace Rules

Geometry:

- Start with the largest readable forms.
- Keep all major parts attached to a named parent.
- Give every cube a purpose: silhouette, structure, depth, attachment, pivot, gameplay readability, or focal identity.
- Do not add decorative cubes for texture-level detail.

Hierarchy:

- Use names by function, not random labels.
- Prefer simple roots such as `root`, `body`, `head`, `left_arm`, `right_arm`, `tail`, `weapon`, `prop`, `effect`, or asset-specific equivalents.
- Keep future animation possible even when animation is not current phase.

Texture:

- Pick atlas size from complexity:
  - `64x64`: small prop, simple weapon, simple static entity.
  - `128x128`: common medium entity/prop, humanoid, armor, detailed item.
  - `256x256`: detailed entity, vehicle, creature, complex prop, many material zones.
  - `512x512`: boss, dragon, large showcase entity, many material zones.
- Pick pixel style separately:
  - `16x style`: default Minecraft feel, blocky/simple shading.
  - `32x style`: cleaner marketplace detail while staying pixel-art and stepped.
- Do not confuse atlas size with pixel style. A `128x128` atlas can still use `16x style`.
- Large visible faces need stepped material depth, not flat fill.
- Material families should be readable: metal, cloth, skin, wood, stone, glow, glass, leather, etc.

Reference:

- Reference sheets must explain what to build, what to texture, and what to preserve.
- A DO-only execution target sheet is required for marketplace-grade generation.
- Samples teach quality patterns only. Do not copy mesh, texture, UV layout, or asset identity.
- Category, atlas, cube, and bone budgets should follow the marketplace sample knowledge base.

## Marketplace Pass Gate

Before Main Geometry:

```text
Silhouette intent: PASS / PARTIAL / BLOCKER
Scale envelope: PASS / PARTIAL / BLOCKER
Geometry Blueprint: PASS / PARTIAL / BLOCKER
Hierarchy / attachment plan: PASS / PARTIAL / BLOCKER
Texture-only detail list: PASS / PARTIAL / BLOCKER
Execution target risks: PASS / PARTIAL / BLOCKER
Marketplace baseline ready: PASS / PARTIAL / BLOCKER
```

If any item is `BLOCKER`, do not start Main Geometry.

## Acceptance Criteria

- Marketplace-grade is the default target for every asset.
- Quality is generalized from marketplace samples without copying any sample.
- Geometry, hierarchy, texture, and reference expectations are explicit.
