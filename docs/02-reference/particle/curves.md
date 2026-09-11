# Particle Curves Knowledge

Provenance labels:
- **OFFICIAL BEDROCK** — Microsoft Bedrock particle documentation.
- **SNOWSTORM / WINTERSKY** — editor/preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced in accepted authoring work.
- **HEURISTIC** — authoring guidance.

## What curves do

**OFFICIAL BEDROCK**

Particle curves map an input value to an output value and expose the result through a `variable.*` Molang variable. Curves are evaluated for rendering frames of living particles.

Use curves to centralize repeated progression logic instead of duplicating long expressions across size, tint, or other fields.

## Core curve contract

A curve has:

```text
variable name
input
horizontal range
type
nodes
```

The variable name must be usable as a Molang `variable.*` symbol.

## Supported curve families

**OFFICIAL BEDROCK**

Common particle curve types include:

```text
linear
bezier
bezier_chain
catmull_rom
```

### Linear

Piecewise linear interpolation across authored nodes.

Use for:
- simple fade ramps;
- grow then shrink;
- stepped but smooth-enough progression.

### Bezier

A four-node Bezier spline for smooth nonlinear transitions.

Use when one continuous ease-like curve is sufficient.

### Bezier chain

Multiple connected Bezier segments for more complex smooth profiles.

Use for:
- custom plume growth;
- multi-stage opacity/size evolution;
- smooth energy pulses.

### Catmull-Rom

Smooth interpolation through control points.

Use when the authored values themselves should be passed through smoothly.

## Normalized lifetime input

**HEURISTIC**

A common input is normalized particle age:

```text
variable.particle_age / variable.particle_lifetime
```

This maps birth to approximately 0 and death to approximately 1.

Guard against invalid/zero lifetime assumptions when authoring dynamic expressions.

## Curve ownership

Curves are best for values that vary predictably over particle lifetime:
- billboard scale;
- alpha;
- tint progression;
- glow/pulse intensity;
- controlled rotation factors.

Do not use a curve merely to avoid choosing correct emitter or motion architecture.

## Stable randomness + curves

**HEURISTIC**

Combine stable per-particle random class with age curves when particles need both variation and coherent evolution.

Example mental model:

```text
particle_random selects class
curve(age/lifetime) evolves that class
```

This is preferable to emitter-age thresholds changing every living particle simultaneously.

## Color gradient relationship

**OFFICIAL BEDROCK**

Tinting gradients can use an interpolant, and a curve variable can provide that interpolant.

This allows one curve to drive color progression consistently.

## Curve performance guidance

**HEURISTIC**

Curves are evaluated repeatedly. Keep them compact and reuse results rather than recomputing large expressions in multiple render fields.

Avoid:
- unnecessary high node counts;
- many independent curves for values that can share one progression;
- expensive random/math calls in per-render paths when stable precomputed values would work.

## Common curve mistakes

- variable name not using proper `variable.*` semantics;
- input range does not match authored horizontal range;
- curve used for an abrupt class switch that should be stable random selection;
- using emitter age when the curve is intended to represent each particle's lifetime;
- too many curves with duplicated purpose;
- color, size, and alpha use separate incompatible lifetime progressions unintentionally.

## Debug order

If a curve-driven property looks wrong:

```text
input expression
→ input range
→ curve type
→ node values/order
→ variable name reference
→ consuming size/tint/rotation expression
→ Snowstorm/Minecraft comparison
```
