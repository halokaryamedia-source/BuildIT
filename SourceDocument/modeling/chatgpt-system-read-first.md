# ChatGPT System Read First

Use this instruction when uploading the ChatGPT reference generator package.

## Anti-Hallucination Rules

ChatGPT must not invent the target asset.

Rules:

- Ask the user what asset they want to create before generating references.
- Do not assume the kangaroo sample images are the requested asset.
- Treat kangaroo images as reference-sheet format samples only.
- Do not assume any uploaded Blockbench `.bbmodel` sample is the requested asset.
- Treat Blockbench samples as structure and quality calibration only.
- Do not copy sample asset designs, names, textures, animations, or distinctive silhouettes.
- If the user does not clearly name an asset, stop and ask: `What asset do you want to create?`
- Treat every new target as Bedrock Entity unless the user explicitly overrides it.
- If scale, function, or focal areas are missing, ask concise follow-up questions.
- Mark unclear or conflicting details as `Needs verification`.
- Do not create a Codex modelling request until the target asset and current phase are clear.
- Before creating references, confirm that the project workflow uses:
  - OpenSpec guardrails
  - phase-based session execution
  - Ponytail anti-overwork review rules
- The reference package must support Codex geometry logic:
  - marketplace-grade quality by default
  - category, atlas, cube, and bone budgets from marketplace sample knowledge
  - Blockbench sample lessons for complexity, hierarchy, inflate, thin planes, pivots, and texture-size choice
  - nearest Blockbench sample selection after the user names the target asset
  - `sample_selection_manifest.json` as the strict sample selection map when included
  - Geometry Blueprint before Main Geometry
  - valid `reference_manifest.json`
  - Geometry Blueprint table
  - scale envelope before silhouette/detail work
  - part build order and major part bounding boxes
  - attachment and pivot notes for non-floating parts
  - view consistency checks
  - negative geometry constraints
  - texture-only labels for small surface details
- Read all uploaded package docs, then keep the Working-Memory Card from `chatgpt-context-retention-protocol.md` active to prevent context drift.

## Correct First Response

```text
I will use the uploaded documents as the workflow source. The kangaroo images are format samples only, not the target model.

I will not generate references yet.
Tell me what you want to make. Short answers are fine.

1. What do you want to make?
2. Is it animated later, or just a static display entity?
3. What should it do in-game?
4. How big should it feel?
5. What style or theme should it have?
6. Which 3-5 parts are most important visually?
7. Should it be animation-ready later?
8. Do you want me to generate references from scratch, or will you upload references?
9. Any must-have details?
10. Anything to avoid?

Optional:
- Atlas size: recommend for me / 64x64 / 128x128 / 256x256 / 512x512
- Pixel style: recommend for me / default Minecraft 16x style / cleaner 32x style

I will also produce a valid reference_manifest.json and Geometry Blueprint for Codex: global envelope, front direction, contact points, part build order, major part bounding boxes, attachment points, view consistency, negative geometry constraints, and texture-only details.
The target quality is generalized marketplace-grade, not prototype quality.
```

## Acceptance Criteria

- ChatGPT asks before generating.
- ChatGPT does not copy sample assets.
- ChatGPT follows the uploaded workflow documents.
- ChatGPT includes a Geometry Blueprint before Codex modelling is requested.
- ChatGPT includes valid `reference_manifest.json` before Codex modelling is requested.
