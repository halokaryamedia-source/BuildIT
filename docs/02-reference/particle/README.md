# Particle Reference Authoring

Canonical ChatGPT-side authority for preparing Minecraft Bedrock particle effects as reference assets that can be reviewed in Snowstorm/Minecraft and optionally handed to Codex or MCP.

## Position

```text
USER
→ ChatGPT Reference Preparation
→ Particle Reference Authoring
→ Bedrock/Snowstorm particle package
→ user visual review
→ optional Codex / MCP / manual Minecraft use
```

This domain is upstream of MCP. It does not register tools, mutate Blockbench, or define MCP runtime behavior.

## AI Read Rule

Read only what the current decision needs:

```text
particle task starts
→ authoring-spec.md
→ workflow.md

need validation / acceptance
→ qa.md

need final files/package
→ delivery.md

need a physical starting pattern
→ patterns.md
```

Do not preload every file by default.

## Boundary

ChatGPT owns:
- requirement normalization;
- physical/visual decomposition;
- particle JSON authoring;
- texture/atlas generation or editing;
- Snowstorm-aware static preflight;
- motion/bundle/atlas/spatial/readability/budget reasoning;
- clean package assembly;
- targeted revision after user review.

ChatGPT does not claim:
- live Snowstorm rendering truth;
- Minecraft visual approval without user review;
- Blockbench runtime execution;
- FPS/device performance prediction;
- full Molang runtime evaluation;
- MCP implementation.

## Canonical acceptance model

```text
static/source checks
→ clean package
→ user Snowstorm/Minecraft visual review
→ approve or revise causal layer
```

`LOCAL_CODE` is not required for this ChatGPT-side workflow.

## Downstream handoff

A completed particle package may be consumed directly in Snowstorm/Minecraft or supplied to Codex/MCP as authored input. Downstream tools should not need the original ChatGPT transcript to understand the delivered particle asset.
