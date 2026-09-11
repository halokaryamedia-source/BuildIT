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

Do not preload the entire corpus. Start with `authoring-spec.md` + `workflow.md`, then load only what the decision needs.

```text
knowledge routing / provenance
→ knowledge-map.md

official Bedrock schema closure / missing-owner audit
→ official-schema-coverage.md

Bedrock mental model
→ fundamentals.md

complete component inventory
→ component-catalog.md

field-by-field component semantics / failure modes
→ component-field-reference.md

creation/update/render timing + local/world simulation
→ lifecycle-space.md

emitter lifecycle / built-in shapes / density
→ emitter.md

custom shape + launch direction math
→ emitter-shape-math.md

general vector / geometry / physics / probability math
→ math-physics-reference.md

trajectory / physics / parametric motion
→ motion.md

advanced collision/contact/bounce
→ collision-advanced.md

material / billboard / tint / lighting
→ appearance-rendering.md

directional / velocity-aligned billboard edge cases
→ billboard-direction.md

production PNG/RGBA/atlas/UV/flipbook
→ texture-authoring.md

resolution / resampling / downscale / frame stability
→ texture-resolution-sampling.md

filtering / bleeding / hidden RGB / matte / minification
→ texture-filtering-bleeding.md

value / alpha / additive / blend color design
→ texture-color-science.md

particle/emitter variable ownership
→ molang.md

particle-system built-in variables
→ particle-variable-inventory.md

full Molang language / operators / functions / easing
→ molang-language-math.md

reusable particle formulas
→ molang-formula-cookbook.md

query/context/external state
→ molang-queries-context.md

curves
→ curves.md

event graphs / child effects
→ events.md

event timing / emitter-vs-particle time ownership
→ event-timing.md

Snowstorm / Wintersky compatibility
→ snowstorm.md

release-specific Snowstorm quirks
→ snowstorm-version-quirks.md

performance
→ performance.md

entity / locator / animation binding context
→ entity-integration.md

symptom-first diagnosis
→ troubleshooting.md

validation / delivery / starting patterns
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

The canonical knowledge base targets all practical layers required to author Bedrock/Snowstorm particle assets professionally:

```text
particle document structure
official schema/component closure
component inventory + field semantics
emitter rate/lifetime/shape
custom shape + vector/direction math
general vector/geometry/probability/ballistic math
emitter vs particle lifecycle
creation/update/render timing
local/world simulation + inherited velocity
initial speed / spin
dynamic acceleration / drag
parametric motion
collision / bounce / contact events / kill plane / block expiration
billboard facing + directional/emitter-transform modes
materials + transparency
RGBA texture production
atlas construction + cell mapping
texture resolution / resampling / downscale
texture filtering / hidden RGB / bleed prevention
UV mapping + flipbook animation
tint / alpha / gradients
additive/blend color behavior
lighting
full Molang syntax/operators/functions
particle/emitter built-in variables
query/context boundaries
math/easing/interpolation/random/trigonometry
reusable particle formulas
curves
events / nested child effects
event timing / fan-out
entity/locator integration
Snowstorm/Wintersky compatibility + release quirks
static performance reasoning
troubleshooting
QA and clean delivery
```

## Texture is first-class knowledge

```text
texture-authoring.md
→ source PNG/RGBA, alpha, sprite bounds, atlas, UV/flipbook, tint compatibility

texture-resolution-sampling.md
→ source resolution, resampling, texel-density reasoning, downscale,
  alpha coverage and frame stability

texture-filtering-bleeding.md
→ hidden RGB, gutter/bleed risk, frame bounds, matte/halo, minification

texture-color-science.md
→ practical color/value/alpha decisions for opaque/alpha/blend/additive rendering

appearance-rendering.md
→ how authored texture data is rendered through material/billboard/tint/lighting
```

## Molang/math is first-class knowledge

```text
molang.md
→ particle/emitter ownership and stability

particle-variable-inventory.md
→ documented built-in particle/emitter variables

molang-language-math.md
→ language, operators, functions, easing and interpolation

molang-formula-cookbook.md
→ reusable formulas for lifetime envelopes, stable random ranges/classes,
  oscillation, orbit/spiral, remapping, cone/ring reasoning and safe math

math-physics-reference.md
→ vector magnitude/normalization, projection, sampling distributions,
  ballistic equations, probability, angular readability and numerical safety

molang-queries-context.md
→ query/context host availability and external-state coupling
```

## Boundary

ChatGPT owns requirement normalization, physical/visual decomposition, particle JSON authoring, texture/atlas generation or editing, Bedrock/Molang/Snowstorm-aware reasoning, static preflight, clean package assembly and targeted revision.

ChatGPT does not claim live Snowstorm/Minecraft truth without review, Blockbench runtime execution, measured FPS/device performance, perfect editor/runtime equivalence, or MCP implementation ownership.

## Canonical acceptance model

```text
Bedrock/source reasoning
→ official schema/component coverage check when needed
→ component/field ownership check
→ Molang/math ownership check
→ texture/rendering QA
→ Snowstorm compatibility reasoning when applicable
→ static/preflight QA
→ clean package
→ user Snowstorm/Minecraft review
→ approve or revise causal layer
```

`LOCAL_CODE` is not required for this ChatGPT-side workflow.
