# Particle Math and Physics Reference

This file owns general mathematical and physical reasoning used by Particle Reference Authoring. It is separate from Molang syntax: `molang-language-math.md` explains the language/functions, while this file explains the math model behind particle trajectories, directions, distributions, and spatial reasoning.

Evidence classes:
- **OFFICIAL BEDROCK** for documented units/component semantics.
- **HEURISTIC** for derived authoring formulas and approximations.

## 1. Units and quantities

Treat Bedrock particle motion conceptually in world-space block units and seconds:

```text
position      blocks
velocity      blocks / second
acceleration  blocks / second²
lifetime      seconds
angle         degrees for Molang trig
```

Do not mix distance, velocity, acceleration, and lifetime as interchangeable tuning values.

## 2. Scalars and vectors

A scalar has magnitude only. A vector has components:

```text
v = (x, y, z)
```

Vector magnitude:

```text
|v| = sqrt(x² + y² + z²)
```

Normalized vector:

```text
n = v / |v|
```

Guard near-zero magnitude before dividing.

## 3. Direction versus speed

Keep direction and magnitude conceptually separate:

```text
direction = normalized vector
speed     = scalar
velocity  = direction × speed
```

This separation is especially useful for Snowstorm/Wintersky-compatible launch authoring where direction belongs on the emitter shape and magnitude on scalar initial speed.

## 4. Dot product

For vectors `a` and `b`:

```text
dot(a,b) = ax*bx + ay*by + az*bz
```

Uses:
- measuring alignment;
- front/back tests;
- projection;
- cone inclusion tests.

For normalized vectors:

```text
dot = cos(angle)
```

Molang trigonometry uses degrees, so convert reasoning accordingly.

## 5. Cross product

Conceptually:

```text
cross(a,b) = (
  ay*bz - az*by,
  az*bx - ax*bz,
  ax*by - ay*bx
)
```

Use it to construct perpendicular basis vectors for rings, cones, swirls, and arbitrary-axis effects.

Molang has no requirement to expose a dedicated vector type or cross-product helper; expand the component math explicitly when needed.

## 6. Projection

Projection of vector `v` onto normalized direction `n`:

```text
parallel = n * dot(v,n)
perpendicular = v - parallel
```

Useful for:
- separating upward motion from lateral spread;
- measuring travel along an emitter axis;
- constructing direction-aligned streak behavior.

## 7. Linear interpolation

```text
lerp(a,b,t) = a + (b-a)*t
```

Use for controlled 0→1 transitions:
- size;
- speed;
- radius;
- alpha/intensity;
- height.

Clamp `t` when overshoot is not intended.

## 8. Inverse interpolation / remap

Concept:

```text
t = (value - in_min) / (in_max - in_min)
out = lerp(out_min, out_max, t)
```

Useful when mapping:
- particle age → opacity;
- speed → sprite length;
- distance → density reduction;
- random value → bounded authored range.

Guard a zero input range.

## 9. Oscillation

Molang trig uses degrees.

Generic oscillation:

```text
value = center + amplitude * sin(angle)
angle = age * frequency_degrees_per_second + phase
```

One full cycle is 360 degrees.

If desired cycles-per-second is `f`:

```text
frequency_degrees_per_second = 360 * f
```

## 10. Circle and ring coordinates

For angle `θ` in degrees:

```text
x = r * cos(θ)
z = r * sin(θ)
```

For an X/Y plane, substitute axes appropriately.

A ring uses fixed `r`. A filled disc requires radius sampling that accounts for area.

## 11. Uniform disc sampling

Naively choosing `r = random(0,R)` overpopulates the center relative to equal area.

For approximately uniform area density:

```text
u = random_0_to_1
r = R * sqrt(u)
θ = 360 * random_0_to_1
x = r*cos(θ)
z = r*sin(θ)
```

Use built-in disc emission when it already satisfies the need; custom sampling is for cases where built-in behavior cannot express the target.

## 12. Uniform sphere-surface sampling

A useful conceptual method:

```text
u = random_0_to_1
v = random_0_to_1
z = 1 - 2*u
θ = 360*v
r_xy = sqrt(max(0, 1-z*z))
x = r_xy*cos(θ)
y = z
z2 = r_xy*sin(θ)
```

Scale by desired radius.

Avoid choosing latitude uniformly because it clusters points near the poles.

## 13. Uniform sphere-volume radius

For uniform volume density, radial distance should scale approximately with the cube root of a uniform random value:

```text
r = R * u^(1/3)
```

If Molang/runtime constraints make this awkward, prefer the built-in sphere emitter instead of recreating it manually.

## 14. Hemisphere / upward-biased directions

For effects such as eruptions or fountains, constrain or bias vertical contribution rather than using a full sphere.

Conceptual approach:

```text
choose lateral angle
choose upward component in authored range
normalize direction
```

Keep bias physically interpretable. Strong upward bias belongs in direction; magnitude belongs in speed.

## 15. Cone directions

Given an axis direction `n`, construct perpendicular basis vectors `u` and `v`. A cone direction can be reasoned as:

```text
dir = normalize(
  n * axial_weight
  + u * lateral_radius * cos(θ)
  + v * lateral_radius * sin(θ)
)
```

A smaller lateral radius creates a tighter cone.

For simple vertical cones, direct X/Z random spread plus positive Y is usually easier and cheaper than a generic basis construction.

## 16. Ballistic motion without drag

For initial velocity `(vx, vy, vz)` and constant acceleration `(ax, ay, az)`:

```text
x(t) = x0 + vx*t + 0.5*ax*t²
y(t) = y0 + vy*t + 0.5*ay*t²
z(t) = z0 + vz*t + 0.5*az*t²
```

Velocity:

```text
v(t) = v0 + a*t
```

Use these formulas for static sanity checks only when drag, collision, local-space inheritance, and time-varying Molang are absent.

## 17. Ballistic apex

For upward initial velocity `vy > 0` and downward constant acceleration `ay < 0`:

```text
time_to_apex = -vy / ay
apex_delta_y = vy² / (-2*ay)
```

This is useful for checking whether debris clears an obstacle or reaches the intended plume height.

## 18. Horizontal travel estimate

Without horizontal acceleration/drag:

```text
horizontal_speed = sqrt(vx² + vz²)
distance ≈ horizontal_speed * lifetime
```

With drag, this becomes an upper-bound style estimate rather than exact runtime truth.

## 19. Drag reasoning

Dynamic particle drag is implementation-driven and should not be replaced by an assumed closed-form equation when exact runtime parity matters.

Authoring intuition:

```text
higher drag
→ velocity decays faster
→ shorter travel
→ softer / floatier motion
```

Use bounded simulation/preflight for constant numeric cases; use visual review for final acceptance.

## 20. Rotation math

Rotational quantities are separate from translational velocity.

Use:
- initial spin for starting rotation/rate;
- rotation acceleration for rate change;
- rotation drag for rotational damping.

Do not use billboard facing orientation and sprite spin as interchangeable concepts.

## 21. Normalized lifetime progress

```text
p = particle_age / particle_lifetime
```

Safer bounded form:

```text
p = clamp(particle_age / max(particle_lifetime, epsilon), 0, 1)
```

Use `p` as the common independent variable for:
- size envelopes;
- alpha fades;
- color cooling;
- parametric path progress;
- curve inputs.

## 22. Probability classes

For stable per-particle class selection, partition one stable random variable:

```text
r < 0.2       → class A
r < 0.7       → class B
otherwise     → class C
```

The interval widths are the class probabilities.

Do not use a changing random function every frame when persistent identity is required.

## 23. Expected population

Useful steady-state approximation:

```text
visible_population ≈ min(max_particles, spawn_rate * average_lifetime)
```

For multiple independent emitters:

```text
total ≈ sum(each emitter population)
```

Events and bursts can create peaks far above the steady-state average.

## 24. Angular readability

For small angles, apparent angular size is approximately proportional to:

```text
world_size / viewing_distance
```

A more exact conceptual angle for object width `s` at distance `d`:

```text
angle = 2 * atan((s/2)/d)
```

Use only as a readability heuristic; actual screen readability also depends on FOV, resolution, contrast, blend mode, motion and background.

## 25. Numerical safety

Guard these failure modes:

```text
divide by zero
normalizing zero vector
sqrt of negative value from numerical drift
unbounded random remap
hard discontinuity at threshold
very large values caused by tiny denominator
```

Common defensive patterns:

```text
max(denominator, epsilon)
clamp(value, min, max)
max(0, radicand)
```

Use the smallest amount of defensive math necessary; excessive nesting makes tuning harder.

## 26. Discontinuity awareness

Hard ternary thresholds can cause visible pops when the controlling input evolves over time.

Use hard thresholds for stable class selection. Use interpolation/curves/easing for intentionally continuous evolution.

## 27. Coordinate-space rule

Always establish the space before interpreting vectors:

```text
world-space?
emitter local-space?
entity-attached local transform?
inherited emitter velocity?
```

A mathematically correct vector in the wrong coordinate space is still the wrong effect.

See `lifecycle-space.md` for ownership and inheritance details.

## QA checklist

```text
[ ] direction and speed are separated where useful
[ ] no zero-vector normalization
[ ] units are dimensionally coherent
[ ] Molang trig reasoning uses degrees
[ ] custom distributions are statistically appropriate
[ ] built-in emitter shape was considered before custom math
[ ] ballistic formulas are not used when drag/collision makes them invalid
[ ] probability classes use stable owner state
[ ] normalized-age math guards degenerate lifetime when needed
[ ] coordinate space is explicit
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/syntax-guide?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/emitter_shape_custom?view=minecraft-bedrock-stable
