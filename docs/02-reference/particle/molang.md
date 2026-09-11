# Particle Molang Knowledge

This file owns durable Molang guidance specifically for particle authoring. Generic Molang language documentation remains external; this file focuses on particle variable ownership, evaluation stability, curves, and authoring risk.

## Evidence Classes

- **OFFICIAL BEDROCK**: documented Molang/particle behavior.
- **EMPIRICALLY VERIFIED**: reproduced authoring behavior from accepted particle work.
- **HEURISTIC**: maintainability/performance guidance, not runtime proof.

## 1. Molang Role in Particles

**OFFICIAL BEDROCK**

Particle fields frequently accept Molang instead of fixed numeric values. Molang can drive:

```text
lifetime
spawn rate
shape dimensions
direction
motion
size
UV/flipbook behavior
tint/alpha
curve inputs
events
```

Molang is not a reason to make every field dynamic. Prefer constants where dynamics do not materially improve the effect.

## 2. Variable Ownership

The most important authoring distinction is **emitter-owned state vs particle-owned state**.

### Emitter-owned variables

Common emitter variables include:

```text
variable.emitter_age
variable.emitter_lifetime
variable.emitter_random_1
variable.emitter_random_2
variable.emitter_random_3
variable.emitter_random_4
```

Use these for emitter-level decisions such as:
- phase/timeline changes;
- spawn-rate envelopes;
- emitter loop variation;
- emitter-level event timing.

### Particle-owned variables

Common particle variables include:

```text
variable.particle_age
variable.particle_lifetime
variable.particle_random_1
variable.particle_random_2
variable.particle_random_3
variable.particle_random_4
```

Use these for properties that must stay coherent for one living particle:
- class selection;
- size progression;
- UV family;
- tint/alpha evolution;
- stable per-particle random variation;
- motion variation that should not change class halfway through life.

## 3. Stable Class Rule

**EMPIRICALLY VERIFIED + HEURISTIC**

Do not use emitter-age thresholds to reclassify already living particles unless that visible switching is explicitly intended.

Risky pattern:

```text
particle size / UV / tint / motion
depends on variable.emitter_age threshold
```

Why it is risky:
- a particle can be born in one class;
- emitter age continues advancing globally;
- the same particle may later evaluate into another class;
- result can appear as pop, flicker, sudden UV/size change, or motion-class switching.

Preferred pattern:

```text
persistent class selection
→ particle_random_N

evolution over lifetime
→ particle_age / particle_lifetime

emitter phase
→ emitter_age / emitter_lifetime
```

## 4. Stable Randomness

**OFFICIAL BEDROCK**

Particle/emitter random variables are intended for stable random values across the corresponding particle lifetime or emitter loop.

Prefer them when you want a value chosen once and then retained conceptually for that owner.

Examples:

```text
particle_random_1 < 0.2
→ heavy debris class

particle_random_2
→ lateral direction spread

particle_random_3
→ size variation
```

Avoid frame-varying random calls in per-render expressions when stable appearance is desired.

## 5. Age Normalization

A useful normalized age pattern is conceptually:

```text
particle_age / particle_lifetime
```

Use it for lifetime-progress envelopes such as:
- fade in/out;
- grow then shrink;
- cool from hot to dark;
- UV frame progression when an explicit flipbook is not being used.

Guard against authoring forms that can introduce invalid division behavior when lifetime can resolve to zero.

## 6. Curves

**OFFICIAL BEDROCK**

Curves evaluate an input expression and expose a reusable variable-like result over a configured horizontal range and node set.

Use a curve when:
- several properties share the same authored progression;
- hand-tuned interpolation matters;
- the expression would otherwise become unreadable.

Do not add curves merely to replace a simple linear expression.

Authoring pattern:

```text
input = normalized particle age
curve = authored envelope
size / alpha / motion field = curve output
```

## 7. Initialization vs Per-frame Behavior

Particle authoring should distinguish values intended to be conceptually fixed at creation from values intentionally evolving every update/render frame.

Prefer creation-stable inputs for:
- class selection;
- persistent random identity;
- initial launch family.

Prefer age-driven per-frame inputs for:
- fade;
- growth/shrink;
- trajectory expressions in parametric motion;
- frame-by-frame tint progression.

Do not emulate initialization by relying on a changing global emitter variable inside a living-particle expression.

## 8. Dynamic Motion Expressions

For `minecraft:particle_motion_dynamic`, keep Molang physically interpretable when possible.

Good conceptual separation:

```text
initial_speed / direction
→ launch impulse

linear_acceleration
→ gravity / lift / wind-like force

linear_drag_coefficient
→ damping
```

If all three contain unrelated, heavily nested conditionals, the resulting trajectory becomes difficult to debug and visually tune.

## 9. Parametric Motion Expressions

**OFFICIAL BEDROCK**

Parametric motion evaluates relative position/direction/rotation mathematically during particle life.

Use it when the motion itself is authored as a function:
- orbit;
- spiral;
- sine wave;
- exact ring;
- choreography.

Do not replace simple dynamic physics with parametric math unless exact path control is the actual requirement.

## 10. Billboard and Tint Expressions

Billboard size and tint/alpha may be Molang-driven. These are effectively visual properties of living particles and should use particle-owned state for stable class behavior.

Preferred ownership:

```text
size class
→ particle_random

size evolution
→ particle_age/lifetime

alpha fade
→ particle_age/lifetime

emitter burst timing
→ emitter_age
```

## 11. Event Expressions

Particle events may contain Molang expressions and `pre_effect_expression` for nested particle effects.

Use event expressions for event-local setup and branching, not as a substitute for all continuous particle behavior.

For nested effects, keep referenced child identifiers explicit and validate the bundle graph.

## 12. Expression Complexity

**HEURISTIC**

Prefer expressions that are:

```text
short
deterministic
owner-correct
physically legible
reused through curves when appropriate
```

Avoid unnecessary:
- repeated expensive math in many render-time fields;
- deeply nested ternaries;
- frame-random class changes;
- duplicate expressions that should share one curve or conceptual variable.

Static simplicity improves authoring reliability even when runtime cost is not measured.

## 13. Naming and Aliases

Bedrock content may surface long-form and alias-style variable names depending on context/tooling. Authoring guidance should preserve the source document rather than aggressively rewriting stylistic forms when semantics are already valid.

Do not infer that alias choice itself changes ownership semantics.

## 14. Molang QA Checklist

Before delivery, inspect:

```text
[ ] emitter-owned timing uses emitter variables
[ ] persistent living-particle class uses particle-owned stable state
[ ] no accidental frame-varying random class switch
[ ] age/lifetime expressions are bounded and meaningful
[ ] curves have clear owner and input
[ ] dynamic motion remains physically interpretable
[ ] parametric motion is used only where exact mathematical control is desired
[ ] event expressions do not reference missing child effects
[ ] no obvious invalid math / zero-divisor / malformed expression risk
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/practical-molang?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
