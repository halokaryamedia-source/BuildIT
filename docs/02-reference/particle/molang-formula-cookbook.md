# Particle Molang Formula Cookbook

Purpose: reusable, auditable formula patterns for Bedrock particle authoring. This is a cookbook, not a replacement for `molang-language-math.md` or `molang.md`.

Evidence classes:
- **OFFICIAL BEDROCK**: syntax/math behavior documented by Microsoft.
- **HEURISTIC**: authoring formula pattern derived from those primitives.

## 1. Normalized particle age

```molang
variable.particle_age / variable.particle_lifetime
```

Use as the canonical 0→1 lifetime driver when lifetime is known positive.

Safer conceptual form when a zero lifetime is possible:

```molang
variable.particle_age / math.max(variable.particle_lifetime, 0.0001)
```

## 2. Linear fade-out

```molang
1.0 - math.clamp(variable.particle_age / variable.particle_lifetime, 0.0, 1.0)
```

## 3. Fade-in then fade-out

Let:

```molang
t = math.clamp(variable.particle_age / variable.particle_lifetime, 0.0, 1.0)
```

Conceptual triangular envelope:

```molang
1.0 - math.abs(t * 2.0 - 1.0)
```

Useful for mist puffs, glints, energy motes, and short flashes.

## 4. Smooth lifetime envelope

For less mechanical transitions use an easing or Hermite-style blend over normalized age rather than a hard linear boundary.

Concept:

```text
normalized age
→ easing / hermite blend
→ size, alpha, intensity
```

Keep the exact easing family explicit so the authoring intent remains legible.

## 5. Stable random range

For a per-particle value between `min` and `max`:

```molang
min + (max - min) * variable.particle_random_1
```

Example, size from 0.4 to 0.8:

```molang
0.4 + 0.4 * variable.particle_random_1
```

Use `particle_random_N` when the value must remain stable for the particle lifetime.

## 6. Stable class thresholds

Three classes using one stable random variable:

```text
r < 0.2        → class A
0.2 ≤ r < 0.75 → class B
r ≥ 0.75       → class C
```

Nested ternary example:

```molang
variable.particle_random_1 < 0.2 ? A : (variable.particle_random_1 < 0.75 ? B : C)
```

Use for sprite class, size class, debris family, or stable motion family.

## 7. Centered random spread

Convert `[0,1]` random to `[-1,1]`:

```molang
variable.particle_random_1 * 2.0 - 1.0
```

Scale to spread `s`:

```molang
(variable.particle_random_1 * 2.0 - 1.0) * s
```

Useful for lateral launch variation.

## 8. Biased random spread

To favor the center, combine independent centered random values and average them:

```molang
((variable.particle_random_1 * 2.0 - 1.0) + (variable.particle_random_2 * 2.0 - 1.0)) * 0.5
```

This is an authoring heuristic, not a claim about exact probability requirements.

## 9. Pulse / oscillation

Periodic pulse:

```molang
math.sin(variable.particle_age * frequency * 360.0)
```

Molang trigonometric functions use degrees.

Map from `[-1,1]` to `[0,1]`:

```molang
0.5 + 0.5 * math.sin(variable.particle_age * frequency * 360.0)
```

Use sparingly; perfectly periodic motion can look artificial for natural particles.

## 10. Circular / orbital position

For angle `a` in degrees and radius `r`:

```molang
x = math.cos(a) * r
y = 0
z = math.sin(a) * r
```

With time-driven angle:

```molang
a = variable.particle_age * angular_speed_degrees_per_second
```

## 11. Spiral / helix

```text
angle = age × angular_speed
radius = radius(age)
x = cos(angle) × radius
z = sin(angle) × radius
y = age × vertical_speed
```

Useful for magical or stylized motion; implement through parametric motion/custom shape only when exact choreography is needed.

## 12. Ring emitter math

For custom shape offset:

```text
angle = stable/random angle
x = cos(angle) × radius
z = sin(angle) × radius
y = 0
```

If using built-in disc shape, prefer the built-in component rather than recreating it mathematically without a reason.

## 13. Cone-like launch direction

Start with a dominant axis and small centered random lateral components:

```text
x = centered_random_x × spread
y = dominant_up_component
z = centered_random_z × spread
```

Then use scalar initial speed when Snowstorm/Wintersky compatibility requires direction magnitude to remain separate.

## 14. Ballistic estimates

For constant gravity magnitude `g`, vertical initial speed `vy`, ignoring drag:

```text
time_to_apex ≈ vy / g
apex_height_delta ≈ vy² / (2g)
```

For horizontal velocity `vh` over duration `t`:

```text
horizontal_distance ≈ vh × t
```

These are authoring estimates, not exact runtime simulation when drag, collisions, variable acceleration, or local-space transforms are involved.

## 15. Drag intuition

Dynamic motion uses acceleration plus drag-like damping. Treat larger drag as faster velocity loss.

Authoring workflow:

```text
launch speed first
→ gravity/lift
→ drag
→ only then fine-tune lateral acceleration
```

Do not use huge positive acceleration to compensate for missing initial impulse.

## 16. Distance-independent stable variation

Do not drive persistent identity from camera distance or other continuously changing queries unless the effect intentionally changes with that query.

Prefer:

```text
stable identity → particle_random
continuous evolution → particle_age/lifetime
external state → query/context only when truly required
```

## 17. Clamp pattern

For any authored value that must stay within bounds:

```molang
math.clamp(value, min, max)
```

Useful for alpha, normalized age, size floors, and safety around external/query-driven values.

## 18. Inverse lerp + lerp remap

Conceptual remap from input range `[a,b]` to output `[c,d]`:

```text
t = inverse_lerp(a, b, x)
result = lerp(c, d, t)
```

Clamp `t` when values outside the source range should not extrapolate.

## 19. Smooth threshold

Instead of a hard binary step, map a narrow interval into 0→1 with inverse-lerp/easing.

Useful for:
- opacity ramps;
- heat glow transitions;
- soft activation regions.

## 20. Avoiding invalid math

Guard:
- division by zero;
- square root of unintended negative input;
- logarithm domains;
- values used as dimensions that can become negative;
- unbounded expression growth.

Use `math.max`, `math.clamp`, and explicit conditions to preserve valid ranges.

## 21. Formula ownership checklist

Before using a formula ask:

```text
Is this value chosen once or changing continuously?
Who owns it: emitter or particle?
Does it need stable randomness?
Does it need normalized age?
Would a curve be clearer?
Would a built-in component be simpler than custom math?
Does Snowstorm preview interpret this field differently?
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/syntax-guide?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/practical-molang?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlemolangintegration?view=minecraft-bedrock-stable
