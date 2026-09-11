# Particle Knowledge Map

Canonical knowledge map for ChatGPT-side Minecraft Bedrock / Snowstorm particle reference authoring.

## Provenance labels

```text
OFFICIAL BEDROCK
SNOWSTORM / WINTERSKY
EMPIRICALLY VERIFIED
HEURISTIC
```

Official Bedrock semantics outrank editor workarounds; Snowstorm-specific behavior must not redefine generic Bedrock validity; heuristics must not be presented as live runtime/FPS truth.

## Core knowledge domains

```text
fundamentals.md
→ document mental model, component families, emitter-vs-particle responsibility

component-catalog.md
→ complete component inventory

component-field-reference.md
→ field-by-field semantics, defaults/ownership concerns and failure modes

official-schema-coverage.md
→ closure audit mapping official component families to canonical owners

lifecycle-space.md
→ creation/update/render timing, emitter-vs-particle lifetime, local/world simulation

emitter.md
→ rate, lifetime, initialization, built-in shapes, density

emitter-shape-math.md
→ direction vectors, normalization, custom shape/ring/cone/fan math

math-physics-reference.md
→ vectors, projection, distributions, ballistic equations, probability,
  angular readability and numerical safety

motion.md
→ initial impulse, acceleration, drag, parametric motion, kill planes

collision-advanced.md
→ restitution, drag, contact events, repeated contact, high-speed caveats

appearance-rendering.md
→ material, billboard, UV/flipbook/tint/lighting, overdraw

billboard-direction.md
→ direction_x/y/z, velocity alignment and near-zero direction edge cases

texture-authoring.md
→ PNG/RGBA, atlas layout, gutters, UV/flipbook, tint-compatible source art

texture-filtering-bleeding.md
→ hidden RGB, atlas bleed, matte/halo, minification/filtering edge cases

texture-resolution-sampling.md
→ resolution, resampling, texel-density reasoning, downscaling,
  alpha coverage, frame stability and approximate asset-size reasoning

texture-color-science.md
→ practical alpha/value/color design for opaque/alpha/blend/add materials

molang.md
→ emitter/particle variable ownership, stable state, age/lifetime usage

particle-variable-inventory.md
→ documented particle-system built-in variables and owner matrix

molang-language-math.md
→ syntax/operators/math/easing/interpolation/random/trigonometry

molang-formula-cookbook.md
→ normalized age, fades, stable ranges/classes, oscillation, orbit/spiral,
  ballistic estimates, remapping and safe math

molang-queries-context.md
→ query/context host availability, entity state, continuous external reads

curves.md
→ linear/Bezier/Bezier-chain/Catmull-Rom, ranges and normalized progression

events.md
→ emitter/particle/collision events, child effects, relationships, fan-out

event-timing.md
→ emitter time vs particle time, birth-relative timing, nested ordering

snowstorm.md
→ generic Snowstorm/Wintersky compatibility boundary

snowstorm-version-quirks.md
→ release-specific preview quirks/regressions and minimal reproduction

performance.md
→ population, lifetime/rate/cap, overdraw, Molang/collision/event cost guidance

entity-integration.md
→ mapping, locators, animation/controller triggering, attached context

troubleshooting.md
→ symptom-first causal diagnosis
```

## Workflow and delivery owners

```text
authoring-spec.md → normalize requested effect
workflow.md       → authoring sequence
qa.md             → static/preflight acceptance
delivery.md       → final package contract
patterns.md       → reusable physical starting patterns
```

Knowledge and workflow stay separate. Do not duplicate deep technical rules into workflow files.

## Lazy-read routing

```text
basic task
→ authoring-spec.md + workflow.md

need to confirm official coverage / locate missing schema knowledge
→ official-schema-coverage.md

unknown component
→ component-catalog.md

specific JSON field/default/failure
→ component-field-reference.md

spawn/lifetime/shape
→ emitter.md

custom distribution/direction/cone/ring math
→ emitter-shape-math.md

general vector/physics/distribution/ballistic reasoning
→ math-physics-reference.md

creation/update/render or local/world-space question
→ lifecycle-space.md

trajectory/physics
→ motion.md

contact/bounce/collision event
→ collision-advanced.md

material/billboard/tint
→ appearance-rendering.md

directional sprite issue
→ billboard-direction.md

PNG/atlas/UV/flipbook production
→ texture-authoring.md

resolution/resampling/downscale/frame-stability issue
→ texture-resolution-sampling.md

bleed/halo/filtering/minification
→ texture-filtering-bleeding.md

brightness/alpha/additive/blend color design
→ texture-color-science.md

particle variable ownership
→ molang.md

which built-in particle/emitter variable exists
→ particle-variable-inventory.md

Molang language/math
→ molang-language-math.md

need a reusable expression/formula
→ molang-formula-cookbook.md

query/context/entity-state dependency
→ molang-queries-context.md

curve issue
→ curves.md

child effect/event graph
→ events.md

event ordering/time ownership
→ event-timing.md

Snowstorm compatibility
→ snowstorm.md

release-specific Snowstorm anomaly
→ snowstorm-version-quirks.md

performance/density
→ performance.md

entity attachment
→ entity-integration.md

unclear failure
→ troubleshooting.md
```

Load multiple files only when the task genuinely crosses boundaries.

## Confidence hierarchy

```text
current explicit user requirement
→ current official Bedrock documentation
→ reproduced Snowstorm/Wintersky target behavior for editor-specific issues
→ accepted empirical project evidence
→ conservative heuristic
```

## Coverage state

```text
Official schema closure audit            STRONG / TRACKED
Bedrock architecture/components          STRONG
Field-level component reference          STRONG
Lifecycle/evaluation/local space         STRONG
Emitter lifecycle/shapes                 STRONG
Emitter direction/custom-shape math      STRONG
General vector/physics/distribution math STRONG
Dynamic/parametric motion                STRONG
Advanced collision                       STRONG
Appearance/material/billboards           STRONG
Directional billboard edge cases         STRONG
Texture/RGBA/atlas/UV/flipbook           STRONG
Texture resolution/resampling            STRONG PRACTICAL
Texture filtering/bleeding               STRONG
Texture color/alpha/blend reasoning       STRONG PRACTICAL
Particle Molang ownership                STRONG
Particle built-in variable inventory     STRONG
Molang language/math                     STRONG
Molang formula cookbook                  STRONG
Molang query/context reasoning           STRONG
Curves                                   STRONG
Events/child effects                     STRONG
Event timing                             STRONG
Snowstorm/Wintersky                      STRONG BASELINE
Snowstorm version quirks                 STRONG VERSION-AWARE
Performance reasoning                    STRONG STATIC
Entity integration                       STRONG REFERENCE BOUNDARY
Troubleshooting                          STRONG CAUSAL GUIDE
Real multi-family visual cases           DEFERRED BY USER
```

Further work should close only newly discovered official fields/version-specific behavior and empirical visual evidence, not create another particle framework.
