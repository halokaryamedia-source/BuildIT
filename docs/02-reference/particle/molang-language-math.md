# Particle Molang Language and Math Reference

This file owns the **full Molang language/math reference used by Particle Reference Authoring**. `molang.md` remains the particle-specific ownership guide; this file is the deeper language/function reference.

## Evidence

Unless marked otherwise, this file is **OFFICIAL BEDROCK** and follows Microsoft Creator Molang documentation.

## 1. What Molang is

Molang is Minecraft Bedrock's embedded expression language for data-driven JSON. Particle fields can use fixed numbers or Molang expressions depending on the component field.

Core particle uses:

```text
spawn rate
lifetime
shape size / offset / direction
initial speed
acceleration / drag
parametric position / direction / rotation
billboard size
UV selection
flipbook limits
tint / alpha
curve inputs
event branching
initialization/update logic
```

## 2. Numeric and boolean model

- Numerical values are floats.
- `0.0` is false; non-zero values are true in boolean tests.
- Many errors resolve to `0.0`, but content errors should still be treated as defects.
- Trigonometric functions use **degrees**, not radians.
- Particle world units use blocks/meters and seconds; velocity is blocks/sec and acceleration blocks/sec².

## 3. Operators

Arithmetic:

```text
+  -  *  /
```

Comparison/logical:

```text
!  &&  ||
<  <=  >  >=
==  !=
```

Conditionals:

```text
A ? B
A ? B : C
```

Grouping / scopes:

```text
( )
{ }
```

Null fallback:

```text
A ?? B
```

Array access:

```text
array[index]
```

Other language forms include `return`, `loop`, `for_each`, `break`, `continue`, and the actor-reference arrow operator `->`.

## 4. Variable namespaces

Canonical namespaces and aliases:

```text
variable.foo  == v.foo
query.foo     == q.foo
temp.foo      == t.foo
context.foo   == c.foo
```

Particle authoring primarily relies on particle/emitter variables supplied by the particle runtime plus temporary variables used inside expressions.

### `variable.*`
Read/write state where the owning context permits it. Particle-specific built-in variables such as particle/emitter age and random values are the important authoring state.

### `temp.*`
Temporary expression-local working values. Use for readability in complex expressions.

### `query.*`
Runtime queries exposed by the current context. Do not assume every entity query is available or meaningful inside every particle expression.

### `context.*`
Read-only contextual values supplied by the runtime in contexts that define them.

## 5. Complex expressions

Multiple statements require semicolons and should end with `return` when the expression must produce a value:

```text
t.a = ...;
t.b = ...;
return t.a * t.b;
```

Without a final return, a multi-statement expression may evaluate to `0.0`.

## 6. Strings

Strings use single quotes:

```text
'minecraft:pig'
```

String operations are limited; equality/inequality are the main supported operations.

## 7. Loops

Molang supports bounded loops:

```text
loop(count, { ... });
```

The documented loop safety maximum is 1024 iterations.

**HEURISTIC:** Particle expressions should almost never need large loops. Prefer simpler formulas or authored curves because render/update expressions can execute many times across many particles.

## 8. Official math functions

The current stable Molang math reference includes:

### Absolute / rounding / signs

```text
math.abs(value)
math.ceil(value)
math.floor(value)
math.round(value)
math.trunc(value)
math.sign(value)
math.copy_sign(A, B)
```

### Min / max / range

```text
math.min(A, B)
math.max(A, B)
math.clamp(value, min, max)
math.mod(value, denominator)
```

### Powers / logarithms

```text
math.sqrt(value)
math.pow(base, exponent)
math.exp(value)
math.ln(value)
```

### Trigonometry — degrees

```text
math.sin(value)
math.cos(value)
math.asin(value)
math.acos(value)
math.atan(value)
math.atan2(y, x)
math.min_angle(value)
math.pi
```

`math.sin` and `math.cos` take degrees. `math.min_angle` normalizes to the shortest signed degree range.

### Randomness

```text
math.random(low, high)
math.random_integer(low, high)
math.die_roll(num, low, high)
math.die_roll_integer(num, low, high)
```

**Particle rule:** Use stable `particle_random_*` / `emitter_random_*` variables for persistent class identity. Use runtime random functions only when frame-to-frame or evaluation-time randomness is actually desired.

### Interpolation

```text
math.lerp(start, end, t)
math.inverse_lerp(start, end, value)
math.lerprotate(start, end, t)
math.hermite_blend(t)
```

### Easing functions

The stable math reference includes easing families for:

```text
back
bounce
circ
cubic
elastic
expo
quad
quart
quint
sine
```

with `ease_in_*`, `ease_out_*`, and `ease_in_out_*` variants, taking:

```text
(start, end, 0_to_1)
```

These are useful for authored size/alpha/intensity transitions when a curve object would be unnecessary.

## 9. Particle-specific built-in state

Common emitter state:

```text
variable.emitter_age
variable.emitter_lifetime
variable.emitter_random_1
variable.emitter_random_2
variable.emitter_random_3
variable.emitter_random_4
```

Common particle state:

```text
variable.particle_age
variable.particle_lifetime
variable.particle_random_1
variable.particle_random_2
variable.particle_random_3
variable.particle_random_4
```

Ownership rule:

```text
emitter phase/timing → emitter_* variables
living-particle identity/evolution → particle_* variables
```

## 10. Normalized lifetime

The standard conceptual progress value is:

```text
p = particle_age / particle_lifetime
```

Use a bounded version when needed:

```text
math.clamp(variable.particle_age / variable.particle_lifetime, 0, 1)
```

Use for:
- fade in/out;
- growth/shrink;
- cooling/color change;
- path progress;
- curve input.

## 11. Formula patterns for particles

### Linear fade out

```text
1 - p
```

### Fade in then fade out

```text
math.min(p / fade_in_fraction, (1 - p) / fade_out_fraction)
```

Clamp to `[0,1]` for safety.

### Linear size interpolation

```text
math.lerp(start_size, end_size, p)
```

### Smooth Hermite transition

```text
math.lerp(start, end, math.hermite_blend(p))
```

### Pulse

```text
base + amplitude * math.sin(variable.particle_age * frequency_degrees_per_second)
```

### Orbit

```text
x = radius * math.cos(angle)
z = radius * math.sin(angle)
```

where angle is age-driven.

### Spiral

```text
radius = math.lerp(r0, r1, p)
angle = p * turns * 360
x = radius * math.cos(angle)
z = radius * math.sin(angle)
y = height * p
```

### Stable random class

```text
variable.particle_random_1 < 0.2 ? heavy_value : light_value
```

This keeps class choice stable over one particle lifetime.

## 12. Dynamic motion interpretation

For dynamic particles, keep these concepts separate:

```text
initial velocity = launch impulse
linear_acceleration = force-like change over time
linear_drag_coefficient = damping
```

Do not use giant positive acceleration as a substitute for missing initial impulse unless the desired effect is literally sustained acceleration.

## 13. Parametric motion interpretation

Parametric motion is appropriate when position itself is a designed mathematical function of age/time.

Good cases:
- orbit;
- helix;
- sine-wave ribbon;
- exact ring;
- magical choreography.

Poor cases:
- natural rock arc;
- basic smoke rise;
- simple sparks;
- debris that should feel ballistic.

## 14. Expression stability rules

Avoid:
- frame-random UV class changes;
- emitter-age thresholds controlling living-particle class;
- divide-by-zero risks;
- deeply nested ternaries when a curve or temp variable is clearer;
- repeated expensive expressions in many per-render fields;
- hidden ownership where the same variable means different things in different classes.

Prefer:
- particle stable randoms for identity;
- normalized age for progression;
- temp variables for readable complex math;
- curves/easing for authored envelopes;
- bounded values with `math.clamp` where visual range matters.

## 15. Source boundary

This file documents language/math capability; it does **not** imply every generic Molang query is available in every particle field. Field/component documentation remains authoritative for accepted shapes and evaluation context.

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/syntax-guide?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/molangreference/examples/molangconcepts/mathfunctions?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/practical-molang?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/?view=minecraft-bedrock-stable
