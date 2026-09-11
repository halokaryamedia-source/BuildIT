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

## Authority Boundary

Reference Preparation and MCP Runtime are **alternative owners selected by task intent**, not two authoring systems that should both execute the same asset mutation.

```text
User asks ChatGPT to prepare/review/deliver a standalone particle reference package
→ Particle Reference Authoring owns the package

User/Codex is authoring or editing the active asset through BuildIT MCP / Blockbench
→ inspect_particle / manage_particle + existing Texturing/Animation capabilities own runtime authoring
```

A completed reference package may become input to MCP later. When that happens, MCP consumes the reviewed asset/package; it should not independently regenerate the same particle or texture unless a targeted correction is requested. This keeps one active authoring authority per task and avoids duplicate particle/texture systems.

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
