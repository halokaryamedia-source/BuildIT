# Particle Reference Authoring

Canonical ChatGPT-side authority for preparing Minecraft Bedrock particle effects as standalone reference assets that can be reviewed in Snowstorm/Minecraft and optionally handed to Codex or MCP.

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

## Standalone Rule

Particle/VFX reference work is independent from image/model reference work.

```text
particle-only request
→ particle branch only

image/model reference request
→ image branch only

combined request
→ use both only because the user or task actually needs both
```

Do not generate image/model references as a mandatory intermediate step for particle work.

## Authority Boundary

Reference Preparation and MCP Runtime are alternative owners selected by task intent, not two authoring systems that should both execute the same asset mutation.

```text
User asks ChatGPT to prepare/review/deliver a standalone particle reference package
→ Particle Reference Authoring owns the package

User/Codex is authoring or editing the active asset through BuildIT MCP / Blockbench
→ inspect_particle / manage_particle + existing downstream capabilities own runtime authoring
```

A completed reference package may become input to MCP later. MCP consumes the reviewed asset/package; it should not regenerate the same particle or texture unless a targeted correction is requested.

## Knowledge Authority

Durable particle knowledge is separated from workflow so ChatGPT can load only the evidence needed for the current decision.

```text
knowledge navigation / evidence classes
→ knowledge-map.md

Bedrock particle document + emitter/particle/component fundamentals
→ fundamentals.md

particle-specific Molang ownership and stability
→ molang.md

Snowstorm / Wintersky editor-preview compatibility
→ snowstorm.md
```

Important evidence classes:

```text
OFFICIAL BEDROCK
SNOWSTORM / WINTERSKY
EMPIRICALLY VERIFIED
HEURISTIC
```

Do not merge Snowstorm-specific behavior into Bedrock validity or present a heuristic as runtime truth.

## AI Read Rule

Read only what the current decision needs:

```text
particle task starts
→ authoring-spec.md
→ workflow.md

need Bedrock semantics / component ownership
→ fundamentals.md

need Molang decision
→ molang.md

need Snowstorm preview compatibility
→ snowstorm.md

need validation / acceptance
→ qa.md

need final files/package
→ delivery.md

need a physical starting pattern
→ patterns.md

need to identify the correct knowledge owner / evidence class
→ knowledge-map.md
```

Do not preload every file by default.

## Boundary

ChatGPT owns:
- requirement normalization;
- physical/visual decomposition;
- particle JSON authoring;
- texture/atlas generation or editing;
- Bedrock-aware and Snowstorm-aware static reasoning;
- motion/bundle/atlas/spatial/readability/budget preflight;
- clean package assembly;
- targeted revision after user review.

ChatGPT does not claim:
- live Snowstorm rendering truth without review;
- Minecraft visual approval without user review;
- Blockbench runtime execution;
- FPS/device performance prediction;
- complete Molang runtime equivalence;
- MCP implementation.

## Canonical Acceptance Model

```text
Bedrock/source reasoning
→ Snowstorm compatibility reasoning when applicable
→ static/preflight QA
→ clean package
→ user Snowstorm/Minecraft visual review
→ approve or revise causal layer
```

`LOCAL_CODE` is not required for this ChatGPT-side workflow.

## Downstream Handoff

A completed particle package may be consumed directly in Snowstorm/Minecraft or supplied to Codex/MCP as authored input. Downstream tools should not need the original ChatGPT transcript to understand the delivered particle asset.

## Core Sources

Durable knowledge should prefer:

1. Microsoft Minecraft Creator particle JSON documentation.
2. Microsoft Snowstorm overview/tutorial for editor positioning.
3. Snowstorm repository/release notes for current editor behavior.
4. Wintersky source/repository when preview semantics matter.
5. accepted project evidence for reproduced compatibility behavior.
6. bounded heuristics only where appropriate.
