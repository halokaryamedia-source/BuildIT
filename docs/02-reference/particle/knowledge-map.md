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

Use for behavior documented by Microsoft Minecraft Creator particle references, Molang documentation, or entity integration documentation.

### SNOWSTORM / WINTERSKY

Use for editor/preview-specific behavior, UI behavior, compatibility differences, release-specific limitations, or Wintersky rendering semantics.

### EMPIRICALLY VERIFIED

Use for behavior reproduced during an accepted real authoring case. This does not automatically make it a universal Bedrock rule.

### HEURISTIC

Use for bounded authoring guidance such as readability thresholds, conservative particle budgets, keep-out reasoning, and decomposition advice.

Never present a heuristic as exact Minecraft runtime truth.

---

## Knowledge domains

### Foundation

```text
fundamentals.md
```

Owns:
- particle document mental model;
- description/basic render parameters;
- component families;
- lifecycle boundaries;
- emitter vs particle responsibility;
- high-level decomposition.

### Emitter

```text
emitter.md
```

Owns:
- emitter rates;
- emitter lifetimes;
- initialization;
- point/sphere/disc/box/entity-AABB/custom shapes;
- offsets;
- `surface_only`;
- launch direction ownership;
- density reasoning.

### Motion

```text
motion.md
```

Owns:
- initial impulse;
- dynamic acceleration and drag;
- parametric motion;
- collision;
- kill planes/environment expiration;
- ballistic/buoyant/drift/jet motion classes;
- motion-envelope reasoning.

### Appearance / Rendering

```text
appearance-rendering.md
```

Owns:
- materials;
- billboard size/facing;
- UVs;
- flipbook;
- tinting/gradients;
- lighting;
- transparency/overdraw;
- atlas hygiene;
- target-distance readability.

### Molang

```text
molang.md
```

Owns:
- emitter-owned vs particle-owned variables;
- stable random state;
- age/lifetime expressions;
- initialization/update/render ownership;
- expression-cost guidance;
- stable class selection.

### Curves

```text
curves.md
```

Owns:
- linear, Bezier, Bezier chain, Catmull-Rom curves;
- curve input/range;
- curve variables;
- normalized lifetime progress;
- curve/tint relationships;
- curve reuse and cost guidance.

### Events

```text
events.md
```

Owns:
- emitter and particle lifetime events;
- collision events;
- child visual-effect events;
- event relationship types;
- pre-effect expressions;
- master/child architecture;
- fan-out and bundle integrity.

### Snowstorm / Wintersky

```text
snowstorm.md
```

Owns:
- Snowstorm editor boundary;
- Wintersky preview boundary;
- target-specific compatibility;
- Quick Setup/release awareness;
- vector-initial-speed compatibility finding;
- emitter-age preview instability finding;
- editor-vs-content bug classification.

### Performance

```text
performance.md
```

Owns:
- visible population estimation;
- spawn rate/lifetime/max-particle interaction;
- translucent overdraw;
- collision/Molang/parametric cost guidance;
- event fan-out;
- distance-aware budgeting;
- static-budget proof limits.

### Entity Integration

```text
entity-integration.md
```

Owns:
- entity particle-effect mapping;
- locators and bone attachment;
- animation and animation-controller triggering;
- pre-effect scripts;
- local orientation expectations;
- fire-and-forget vs sustained binding intent.

### Troubleshooting

```text
troubleshooting.md
```

Owns symptom-first causal diagnosis for:
- missing effects;
- wrong trajectory;
- wrong density;
- texture/alpha issues;
- flipbook problems;
- unstable class switching;
- child events;
- collisions;
- Snowstorm/Minecraft mismatch;
- performance regressions.

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

Do not duplicate deep knowledge into workflow files. Workflow should point to the relevant knowledge owner only when the decision requires it.

---

## Lazy-read routing

Do not preload the full particle corpus.

Recommended loading:

```text
basic particle task
→ authoring-spec.md + workflow.md

emission/spawn issue
→ emitter.md

trajectory/physics issue
→ motion.md

visual/material/atlas issue
→ appearance-rendering.md

Molang expression issue
→ molang.md

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

Load multiple files only when the task actually crosses those ownership boundaries.

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
Bedrock document fundamentals     STRONG
Emitter lifecycle + shapes        STRONG
Dynamic/parametric/collision      STRONG
Billboard/material/atlas          STRONG
Particle Molang                   STRONG
Curves                            STRONG
Events / child effects            STRONG
Snowstorm / Wintersky             STRONG BASELINE
Performance reasoning             STRONG STATIC
Entity integration                STRONG REFERENCE BOUNDARY
Troubleshooting                   STRONG CAUSAL GUIDE
Real multi-family visual cases    DEFERRED BY USER
```

The next improvements should deepen source-specific edge cases and version-specific Snowstorm behavior, not create another parallel particle framework.
