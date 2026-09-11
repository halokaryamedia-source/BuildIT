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

It is also independent from the visual/model reference branch. A user can request only particle/VFX work without generating concept art, turnarounds, or model-reference packages.

## Authority Boundary

Reference Preparation and MCP Runtime are alternative owners selected by task intent, not two authoring systems that should both execute the same asset mutation.

```text
User asks ChatGPT to prepare/review/deliver a standalone particle reference package
→ Particle Reference Authoring owns the package

User/Codex is authoring or editing the active asset through BuildIT MCP / Blockbench
→ inspect_particle / manage_particle + existing Texturing/Animation capabilities own runtime authoring
```

A completed reference package may become input to MCP later. When that happens, MCP consumes the reviewed asset/package; it should not independently regenerate the same particle or texture unless a targeted correction is requested.

## AI Read Rule

Do not preload the entire particle corpus.

Start with:

```text
particle task starts
→ authoring-spec.md
→ workflow.md
```

Then load only the knowledge owner required by the current decision:

```text
need overall knowledge routing / provenance
→ knowledge-map.md
need Bedrock document/component foundation
→ fundamentals.md
need emitter timing, rate, shape, spawn region
→ emitter.md
need trajectory, drag, gravity, collision, parametric motion
→ motion.md
need material, billboard, UV, flipbook, tint, atlas, transparency
→ appearance-rendering.md
need particle Molang ownership / expressions
→ molang.md
need lifetime progression / interpolation curves
→ curves.md
need child effects / nested sequences / event fan-out
→ events.md
need Snowstorm / Wintersky compatibility
→ snowstorm.md
need particle count / overdraw / complexity guidance
→ performance.md
need entity locator / animation / controller attachment context
→ entity-integration.md
need symptom-first diagnosis
→ troubleshooting.md
need validation / acceptance
→ qa.md
need final files/package
→ delivery.md
need physical starting pattern
→ patterns.md
```

Load multiple knowledge files only when the task genuinely crosses those boundaries.

## Knowledge provenance

Durable rules distinguish four evidence classes:

```text
OFFICIAL BEDROCK
SNOWSTORM / WINTERSKY
EMPIRICALLY VERIFIED
HEURISTIC
```

Use `knowledge-map.md` as the owner for evidence hierarchy. Snowstorm-specific compatibility must never redefine generic Bedrock validity, and static heuristics must never be presented as live rendering/FPS proof.

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

## Knowledge coverage

Current canonical knowledge owners cover:

```text
Bedrock particle document/components
emitter rates/lifetimes/shapes
initial/dynamic/parametric/collision motion
billboards/materials/UV/flipbook/tint/atlas
particle Molang and stable ownership
curves
lifetime/collision/child events
Snowstorm/Wintersky compatibility
static performance reasoning
entity/locator integration context
causal troubleshooting
```

Real multi-family visual workflow testing remains intentionally deferred until the knowledge base is considered mature enough.

## Downstream handoff

A completed particle package may be consumed directly in Snowstorm/Minecraft or supplied to Codex/MCP as authored input. Downstream tools should not need the original ChatGPT transcript to understand the delivered particle asset.
