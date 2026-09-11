# Particle Curves Knowledge

Evidence classes:
- **OFFICIAL BEDROCK** — Microsoft Bedrock particle documentation/schema.
- **SNOWSTORM / WINTERSKY** — editor-preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — authoring guidance.

## Role

Particle curves map a Molang `input` to a numeric output exposed through the curve's `variable.*` name. Official documentation describes curves as evaluated for rendering frames of living particles.

Use curves when one authored progression should be reused or when spline control is clearer than repeating long expressions.

## Core fields

Common curve structure:

```text
type
nodes
input
horizontal_range
```

Current generated linear-curve schema records:

```text
horizontal_range default = 1
input            = not set
nodes            = not set
```

Do not invent an input or node list when the target schema says `not set`.

## Input normalization

Conceptually the curve maps:

```text
curve_parameter = input / horizontal_range
```

for curve types where horizontal range participates in the mapping.

Older official documentation marks `horizontal_range` optional/deprecated and states that it is ignored for `bezier_chain`. Preserve that distinction rather than applying one mapping rule blindly to all types.

A common particle-owned input is:

```text
variable.particle_age / variable.particle_lifetime
```

Use safe math when lifetime can be degenerate.

## `linear`

Linear curves perform piecewise linear interpolation through the node list. Official prose describes linear nodes as evenly spaced over the normalized 0→1 curve domain.

For N nodes, think of control positions as evenly distributed from start to end. Use for predictable ramps, grow/shrink envelopes, and simple multi-stage alpha.

Failure modes:
- node order does not match intended time order;
- input range never reaches later nodes;
- too many nodes imitate a smoother spline unnecessarily.

## `bezier`

The official particle curve model describes a single cubic Bezier using **four nodes**:

```text
P0 start
P1 control
P2 control
P3 end
```

P0/P3 define endpoint values; the middle two control the transition shape.

Use for one smooth non-linear transition. Do not treat arbitrary-length node arrays as equivalent to one cubic Bezier unless the target schema explicitly says so.

## `bezier_chain`

Bezier chain supports multiple connected segments and is the correct owner for more complex smooth piecewise-Bezier progressions.

Older official schema/prose exposes keyed chain-node forms that may include:

```text
value
left_value
right_value
slope
left_slope
right_slope
```

The map key represents the input position for the chain node. Exact accepted combinations are target-schema/version dependent; use the generated schema matching the target version rather than inventing missing tangent/value fields.

Important legacy semantic: `horizontal_range` is ignored for `bezier_chain`; keyed node positions already define the horizontal coordinate system.

## `catmull_rom`

Catmull-Rom smoothly interpolates through interior authored control values. Official prose notes endpoint/control behavior where the first/last values act as spline controls and the curve passes through the intended interior nodes.

Use when passing smoothly through authored values matters more than Bezier tangent control.

Do not assume endpoint handling is identical to linear curves.

## Variable ownership

Curve variable naming follows Molang variable semantics. Persistent particle progression should normally use particle-owned input such as particle age/lifetime.

Avoid:

```text
curve for living-particle size/tint
input = emitter_age
```

when each particle should evolve from its own birth independently.

Emitter-age curves are appropriate only for emitter-synchronized behavior.

## Stable randomness + curves

Use stable particle randoms to choose identity/class and curves to evolve that class:

```text
particle_random → class
particle_age/lifetime → progression
```

Do not use a curve to disguise unstable class ownership.

## Tint gradient relationship

A tint gradient can use a Molang interpolant, including a curve result. This allows one curve to coordinate color, alpha, size, or intensity progressions when that shared shape is intentional.

Do not force all visual channels to share one curve when their desired timing genuinely differs.

## Cost / maintainability

Curves are repeatedly evaluated. Prefer:
- compact node sets;
- reused curve results;
- simple normalized inputs;
- one intentional owner per progression.

Avoid duplicated curves with nearly identical purpose or heavy random/math expressions embedded independently in many render fields.

## Version-aware authoring

Microsoft exposes both newer generated schema pages and older semantic reference prose. Use:

```text
target-version generated schema
→ accepted field shapes / unions / explicit defaults

older official prose
→ interpolation semantics when still compatible
```

If the representations conflict, do not synthesize a third undocumented shape.

## Curve QA

```text
[ ] type exists in target schema
[ ] variable name is valid Molang variable ownership
[ ] input expression is valid in the particle context
[ ] horizontal_range use matches curve type
[ ] linear node order and range are intentional
[ ] bezier has the target-required four-node form
[ ] bezier_chain keyed positions/tangent fields match target schema
[ ] Catmull-Rom endpoint behavior is understood
[ ] particle-local progression does not accidentally use emitter age
[ ] tint/size consumers reference the intended curve variable
[ ] Snowstorm mismatch is isolated from Bedrock validity
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_curve_linear?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/?view=minecraft-bedrock-stable
