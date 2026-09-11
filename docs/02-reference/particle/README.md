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

This domain is upstream of MCP and independent from image/model reference generation.

## Authority boundary

```text
ChatGPT prepares/reviews/delivers a standalone particle package
→ Particle Reference Authoring owns it

Codex/MCP edits an active runtime asset in Blockbench
→ downstream MCP/Texturing/Animation owners take over after explicit handoff
```

Do not run both authoring authorities on the same revision at once.

## AI read rule

Do not preload the entire corpus.

Start with:

```text
authoring-spec.md
workflow.md
```

Then load only what the decision needs:

```text
knowledge navigation / evidence provenance
→ knowledge-map.md

Bedrock mental model
→ fundamentals.md

complete component list
→ component-catalog.md

creation/update/render timing + local/world simulation
→ lifecycle-space.md

emitter rate/lifetime/shape
→ emitter.md

trajectory/physics/collision
→ motion.md

advanced contact/bounce/collision-event behavior
→ collision-advanced.md

billboard/material/tint/rendering
→ appearance-rendering.md

velocity/direction aligned billboard edge cases
→ billboard-direction.md

PNG/RGBA/atlas/UV/flipbook texture production
→ texture-authoring.md

texture filtering/bleeding/matte/minification
→ texture-filtering-bleeding.md

particle variable ownership/stability
→ molang.md

full Molang syntax/operators/math/easing/formulas
→ molang-language-math.md

query/context/entity-state exposure and stability
→ molang-queries-context.md

curves
→ curves.md

events / child effects
→ events.md

event timing / emitter-vs-particle time ownership
→ event-timing.md

Snowstorm / Wintersky compatibility
→ snowstorm.md

Snowstorm release/version quirks and preview regressions
→ snowstorm-version-quirks.md

performance reasoning
→ performance.md

entity / locator / animation binding context
→ entity-integration.md

symptom-first diagnosis
→ troubleshooting.md

validation / package / starting patterns
→ qa.md / delivery.md / patterns.md
```

## Knowledge provenance

Every durable rule is interpreted as one of:

```text
OFFICIAL BEDROCK
SNOWSTORM / WINTERSKY
EMPIRICALLY VERIFIED
HEURISTIC
```

Snowstorm-specific behavior must never redefine generic Bedrock validity. Heuristics must never be presented as live rendering or FPS proof.

## Complete coverage target

The canonical knowledge base now covers:

```text
particle document structure
all emitter component families
all particle initial/motion/appearance/lifetime families
emitter vs particle lifecycle
creation/update/render evaluation timing
local/world simulation + inherited velocity
initial speed / spin
dynamic motion / drag / acceleration
parametric motion
collision / bounce / contact events / kill plane / block expiration
billboard facing + direction
velocity-aligned billboard edge cases
materials + transparency
RGBA textures
atlas construction
UV mapping
flipbook animation
texture filtering/bleeding/matte/minification
tint / alpha / gradients
lighting
full Molang syntax/operators
variable namespaces
particle/emitter built-in variables
particle-relevant queries/context reasoning
current Molang math-function families
easing/interpolation/random/trigonometry
particle formula patterns
curves
events / nested child effects
event timing and lifetime ownership
entity/locator integration
Snowstorm/Wintersky compatibility
Snowstorm version/preview quirks
static performance reasoning
troubleshooting
QA and clean delivery
```

## Texture is first-class knowledge

Particle texture authoring is not treated as a minor sub-step.

```text
texture-authoring.md
→ production PNG/RGBA, alpha, atlas layout, UV/flipbook mapping,
  tint compatibility, pixel-art handling and texture QA

texture-filtering-bleeding.md
→ hidden RGB under transparent pixels, gutter/bleed risk,
  frame bounds, halo/matte artifacts and minification edge cases

appearance-rendering.md
→ how those authored assets are rendered through
  materials/billboards/tint/lighting
```

## Molang/math is first-class knowledge

```text
molang.md
→ particle/emitter variable ownership and lifetime stability

molang-language-math.md
→ language, operators, math functions, easing and formulas

molang-queries-context.md
→ query/context availability, external state and host coupling
```

This separation prevents generic language knowledge from obscuring particle-specific ownership rules.

## Boundary

ChatGPT owns:
- requirement normalization;
- physical/visual decomposition;
- particle JSON authoring;
- texture/atlas generation or editing;
- Bedrock/Molang/Snowstorm-aware reasoning;
- motion/bundle/atlas/spatial/readability/budget preflight;
- clean package assembly;
- targeted revision after user review.

ChatGPT does not claim:
- live Snowstorm rendering truth without review;
- Minecraft visual approval without user review;
- Blockbench runtime execution;
- FPS/device benchmarking;
- perfect runtime equivalence for every editor preview;
- MCP implementation ownership.

## Canonical acceptance model

```text
Bedrock/source reasoning
→ Molang/math/query ownership check
→ texture/rendering QA
→ Snowstorm compatibility reasoning when applicable
→ static/preflight QA
→ clean package
→ user Snowstorm/Minecraft review
→ approve or revise causal layer
```

`LOCAL_CODE` is not required for this ChatGPT-side workflow.

## Downstream handoff

A completed particle package may be consumed directly in Snowstorm/Minecraft or supplied to Codex/MCP as authored input. Downstream tools should not need the original ChatGPT transcript.
