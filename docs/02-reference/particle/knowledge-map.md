# Particle Knowledge Map

Canonical knowledge map for ChatGPT-side Minecraft Bedrock / Snowstorm particle reference authoring.

## Provenance labels

Every durable rule should be understood through one of these evidence classes:

```text
OFFICIAL BEDROCK
SNOWSTORM / WINTERSKY
EMPIRICALLY VERIFIED
HEURISTIC
```

### OFFICIAL BEDROCK
Use for behavior documented by Microsoft Minecraft Creator particle/Molang/entity references.

### SNOWSTORM / WINTERSKY
Use for editor/preview-specific behavior, UI behavior, compatibility differences, release-specific limitations, or Wintersky rendering semantics.

### EMPIRICALLY VERIFIED
Use for behavior reproduced during an accepted real authoring case. This does not automatically make it a universal Bedrock rule.

### HEURISTIC
Use for bounded authoring guidance such as readability thresholds, conservative particle budgets, keep-out reasoning, and decomposition advice.

Never present a heuristic as exact Minecraft runtime truth.

---

## Core knowledge domains

### Foundation
`fundamentals.md`

Owns document mental model, component families, emitter-vs-particle responsibility, decomposition and Bedrock-validity boundaries.

### Complete component inventory
`component-catalog.md`

Owns the component checklist across emitter initialization/rate/lifetime/shape, particle initialization/motion/appearance/lifetime, curves and events.

### Lifecycle / simulation space
`lifecycle-space.md`

Owns evaluation timing, emitter vs particle lifetime, creation/update/render ownership, local/world simulation, inherited velocity and attachment implications.

### Emitter
`emitter.md`

Owns emitter rates, lifetimes, initialization, point/sphere/disc/box/entity-AABB/custom shapes, offsets, surface-only behavior and density reasoning.

### Motion
`motion.md`

Owns initial impulse, dynamic acceleration/drag, parametric motion, collision, kill planes/environment expiration, ballistic/buoyant/drift/jet motion classes and motion-envelope reasoning.

### Appearance / Rendering
`appearance-rendering.md`

Owns materials, billboard geometry/facing, UV/flipbook/tint/lighting, transparency, overdraw and target-distance readability.

### Texture production
`texture-authoring.md`

Owns PNG/RGBA production, atlas layout, cell mapping, transparent gutters, matte/halo risk, UV/flipbook mapping, tint-compatible source art, pixel-art rules and texture QA.

### Particle Molang ownership
`molang.md`

Owns emitter-owned vs particle-owned variables, stable random state, age/lifetime expressions, ownership stability and expression-cost guidance.

### Full Molang language + math
`molang-language-math.md`

Owns syntax/operators, variable namespaces, conditionals, loops, official math-function families, easing/interpolation and reusable particle formula patterns.

### Curves
`curves.md`

Owns linear, Bezier, Bezier-chain, Catmull-Rom curves, curve inputs/ranges, normalized lifetime progression and curve reuse.

### Events
`events.md`

Owns emitter/particle lifetime events, collision events, child visual-effect events, relationship types, pre-effect expressions, master/child architecture and fan-out.

### Snowstorm / Wintersky
`snowstorm.md`

Owns editor/preview boundary, Quick Setup/release awareness, target-specific compatibility, vector initial-speed finding, emitter-age instability finding and editor-vs-content bug classification.

### Performance
`performance.md`

Owns visible-population estimation, spawn/lifetime/max-particle interaction, translucent overdraw, collision/Molang/parametric cost guidance, event fan-out and static proof limits.

### Entity Integration
`entity-integration.md`

Owns entity particle mapping, locators, animation/controller triggering, pre-effect scripts, local orientation expectations and fire-and-forget vs sustained binding intent.

### Troubleshooting
`troubleshooting.md`

Owns symptom-first causal diagnosis for missing effects, wrong trajectory/density, texture/alpha/flipbook issues, class switching, events/collision, Snowstorm-vs-Minecraft mismatch and performance regressions.

---

## Workflow and delivery owners

Knowledge is separate from execution workflow.

```text
authoring-spec.md → normalize requested effect
workflow.md       → authoring sequence
qa.md             → static/preflight acceptance
delivery.md       → final package contract
patterns.md       → reusable physical starting patterns
```

Do not duplicate deep knowledge into workflow files.

---

## Lazy-read routing

```text
basic particle task
→ authoring-spec.md + workflow.md

unknown component / need full inventory
→ component-catalog.md

emitter creation/lifetime/local-space timing
→ lifecycle-space.md + emitter.md

trajectory/physics issue
→ motion.md

visual material/billboard issue
→ appearance-rendering.md

texture/PNG/atlas/UV/flipbook production issue
→ texture-authoring.md

particle-specific variable ownership issue
→ molang.md

generic Molang syntax/math/formula issue
→ molang-language-math.md

lifetime progression/curve issue
→ curves.md

nested/child effect issue
→ events.md

Snowstorm preview/compatibility issue
→ snowstorm.md

performance/density issue
→ performance.md

entity attachment issue
→ entity-integration.md

unclear failure
→ troubleshooting.md
```

Load multiple files only when the task genuinely crosses boundaries.

---

## Confidence hierarchy

When rules conflict, prefer:

```text
current explicit user requirement
→ current official Bedrock documentation for Bedrock semantics
→ reproduced target-editor behavior for Snowstorm-specific compatibility
→ accepted empirical project evidence
→ conservative heuristic
```

Never let a Snowstorm-specific workaround redefine generic Bedrock validity.
Never let static preflight claim live rendering or FPS truth.

---

## Current coverage state

```text
Bedrock document fundamentals        STRONG
Complete component catalog           STRONG
Lifecycle / evaluation / local space STRONG
Emitter lifecycle + shapes           STRONG
Dynamic/parametric/collision         STRONG
Appearance / billboard / material    STRONG
Texture / RGBA / atlas / UV          STRONG
Particle Molang ownership            STRONG
Molang language + math               STRONG
Curves                               STRONG
Events / child effects               STRONG
Snowstorm / Wintersky                STRONG BASELINE
Performance reasoning                STRONG STATIC
Entity integration                   STRONG REFERENCE BOUNDARY
Troubleshooting                      STRONG CAUSAL GUIDE
Real multi-family visual cases       DEFERRED BY USER
```

Further work should deepen version-specific edge cases or newly documented Bedrock capabilities, not create a parallel particle framework.
