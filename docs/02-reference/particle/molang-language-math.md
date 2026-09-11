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

## 4. Case sensitivity

Molang language tokens and identifiers are documented as case-insensitive, while **string values preserve case**.

Authoring consequence:
- do not rely on capitalization to create separate Molang variables;
- do preserve exact string content when comparing identifiers or string-returning queries.

## 5. Variable namespaces

Canonical namespaces and aliases:

```text
variable.foo  == v.foo
query.foo     == q.foo
temp.foo      == t.foo
context.foo   == c.foo
```

### `variable.*`
Read/write state where the owning context permits it. Particle-specific built-ins such as age, lifetime, and stable random values are the main authoring state.

### `temp.*`
Temporary expression-local working values. Use for readability in complex expressions.

### `query.*`
Runtime queries exposed by the current host context. Do not assume every generic entity query is valid in every particle field.

### `context.*`
Read-only contextual values supplied by the current host/evaluation context.

## 6. Complex expressions

Multiple statements require semicolons and should end with `return` when the expression must produce a value:

```text
t.a = ...;
t.b = ...;
return t.a * t.b;
```

Without a final return, a complex expression evaluates to `0.0`.

## 7. Strings

Strings use single quotes:

```text
'minecraft:pig'
```

String operations are limited; equality/inequality are the primary supported uses.

## 8. Loops and iteration

Molang supports bounded loops:

```text
loop(count, { ... });
```

The documented loop safety maximum is 1024 iterations.

`for_each`, `break`, and `continue` are also language constructs where the host/context supports the referenced collection/state.

**HEURISTIC:** particle expressions should almost never need large loops. Prefer direct formulas, stable variables, or authored curves because per-update/per-render particle expressions can execute many times across many living particles.

## 9. Actor-reference arrow operator

The `->` operator dereferences another actor/reference before reading its state.

Do not assume a valid actor reference exists in particle context. Reference-bearing Molang examples from animation/entity docs are not automatically particle-safe.

## 10. Official math functions

The stable Molang reference includes these relevant function families.

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

`math.sin` and `math.cos` use degrees. `math.min_angle` normalizes angular differences to a shortest signed degree range.

### Randomness

```text
math.random(low, high)
math.random_integer(low, high)
math.die_roll(num, low, high)
math.die_roll_integer(num, low, high)
```

**Particle rule:** use stable `particle_random_*` / `emitter_random_*` values for persistent identity. Use runtime random functions only when reevaluation-time randomness is intended.

### Interpolation

```text
math.lerp(start, end, t)
math.inverse_lerp(start, end, value)
math.lerprotate(start, end, t)
math.hermite_blend(t)
```

### Easing

Current Molang reference includes easing families such as:

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

with `ease_in_*`, `ease_out_*`, and `ease_in_out_*` variants.

Use easing when one expression is clearer than introducing a curve object.

## 11. Particle-specific built-in state

Emitter-owned:

```text
variable.emitter_age
variable.emitter_lifetime
variable.emitter_random_1..4
```

Particle-owned:

```text
variable.particle_age
variable.particle_lifetime
variable.particle_random_1..4
```

Ownership rule:

```text
emitter phase/timing
→ emitter_* variables

living-particle identity/evolution
→ particle_* variables
```

## 12. Evaluation timing matters more than syntax alone

A Molang expression can be syntactically valid but semantically wrong because the containing field evaluates it at the wrong time.

Examples:

```text
particle max_lifetime
→ sampled once for that particle

particle expiration_expression
→ evaluated continuously

emitter activation / expiration expressions
→ evaluated repeatedly

particle per_render_expression
→ render-stage evaluation

particle per_update_expression
→ simulation/update-stage evaluation
```

Always pair Molang reasoning with the field's evaluation contract in `official-defaults-evaluation.md`.

## 13. Versioned Molang rule

The Molang syntax guide explicitly carries versioned behavior. Therefore:

```text
generic Molang syntax page says feature exists
≠
feature is automatically valid in every older target content version
```

When an expression uses a recently added query/function/operator:
1. check the target resource-pack/content version when documentation provides a minimum version;
2. check the query/function page for version notes;
3. do not backport by assumption;
4. keep Snowstorm parser acceptance separate from Minecraft target-version support.

Example: some queries document a minimum format version. That requirement belongs to the query itself, not to all Molang.

## 14. Normalized lifetime

Conceptual progress:

```text
p = particle_age / particle_lifetime
```

Safer bounded form:

```text
math.clamp(variable.particle_age / math.max(variable.particle_lifetime, 0.0001), 0, 1)
```

Use for fade, growth, cooling, path progress, and curve inputs.

## 15. Formula patterns

### Linear fade out

```text
1 - p
```

### Fade in then fade out

```text
math.clamp(1 - math.abs(p * 2 - 1), 0, 1)
```

### Linear interpolation

```text
math.lerp(start, end, p)
```

### Smooth Hermite interpolation

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

### Spiral

```text
radius = math.lerp(r0, r1, p)
angle = p * turns * 360
x = radius * math.cos(angle)
z = radius * math.sin(angle)
y = height * p
```

### Stable class

```text
variable.particle_random_1 < 0.2 ? heavy_value : light_value
```

## 16. Dynamic vs parametric math

Dynamic motion:

```text
initial velocity
+ acceleration over time
+ drag/damping
```

Parametric motion:

```text
position/direction/rotation = explicit function of age/state
```

Prefer dynamic motion for natural debris, smoke, sparks, rain, and falling objects. Prefer parametric motion for exact orbits, helices, waves, rings, and choreographed energy.

## 17. Expression stability rules

Avoid:
- reevaluated random calls for persistent UV/class identity;
- emitter-age thresholds controlling living-particle classes;
- divide-by-zero;
- deep ternary trees when temp variables/curves are clearer;
- repeated expensive expressions in several render fields;
- using an entity query continuously when the desired value should have been sampled once.

Prefer:
- stable particle randoms for identity;
- normalized age for progression;
- temp variables for readable complex math;
- curves/easing for authored envelopes;
- `math.clamp` for bounded visual ranges;
- explicit target-version checks for newly documented features.

## 18. Source boundary

This file documents Molang language/math capability. It does **not** imply every query, actor reference, context value, or language feature is available in every particle field.

Field/component documentation and target-version query documentation remain authoritative.

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/syntax-guide?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/molangreference/examples/molangconcepts/mathfunctions?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/practical-molang?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/?view=minecraft-bedrock-stable
