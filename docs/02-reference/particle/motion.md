# Particle Motion Knowledge

Provenance labels:
- **OFFICIAL BEDROCK** — Microsoft Bedrock particle documentation.
- **SNOWSTORM / WINTERSKY** — editor/preview semantics.
- **EMPIRICALLY VERIFIED** — reproduced in accepted authoring work.
- **HEURISTIC** — authoring guidance.

## Motion ownership model

Particle motion begins after emitter spawn and initial conditions are established.

```text
spawn position + direction + initial speed
→ particle exists
→ motion system updates living particle
```

Do not blur emitter placement and particle motion into one problem.

## Initial speed

**OFFICIAL BEDROCK**

`minecraft:particle_initial_speed` establishes initial velocity behavior and supports numeric/Molang values, including vector forms in Bedrock particle JSON.

For authored directional motion, separate heading from magnitude where possible:

```text
emitter shape direction
+ scalar initial speed
```

This separation is easier to reason about and is Snowstorm-friendly.

## Dynamic motion

**OFFICIAL BEDROCK**

`minecraft:particle_motion_dynamic` models velocity-based motion with acceleration and drag.

Important concepts:

```text
linear_acceleration
linear_drag_coefficient
rotation_acceleration
rotation_drag_coefficient
```

Use for physical-looking motion:
- gravity-driven debris;
- smoke buoyancy;
- drifting leaves;
- sparks;
- rain;
- exhaust.

### Acceleration vs initial impulse

**HEURISTIC**

Use initial speed to create immediate momentum. Use acceleration to alter velocity over time.

Bad pattern:

```text
initial_speed ≈ 0
very large positive acceleration
```

when the effect visually requires an explosive impulse.

Better:

```text
strong initial speed
+ gravity / mild lift / drift
+ drag
```

### Drag

**OFFICIAL BEDROCK + HEURISTIC**

Drag reduces velocity over time.

Use low drag for:
- ballistic rocks;
- fast sparks;
- rain.

Use stronger drag for:
- smoke;
- mist;
- soft floating ambience.

Do not compensate for excessive initial speed using extreme drag unless the intended motion genuinely has abrupt damping.

## Bounded Wintersky-style approximation

**SNOWSTORM / WINTERSKY + EMPIRICALLY VERIFIED**

For constant numeric inputs, our preflight model uses the bounded integration form observed from Wintersky dynamic behavior:

```text
effective_acceleration = acceleration - velocity * drag
velocity += effective_acceleration * dt
position += velocity * dt
```

This is useful for checking:
- approximate apex;
- time to apex;
- horizontal travel;
- final displacement.

It is not a replacement for Minecraft runtime and does not evaluate Molang, collisions, local-space transforms, or event-driven changes.

## Parametric motion

**OFFICIAL BEDROCK**

`minecraft:particle_motion_parametric` directly controls relative position, direction, and rotation using expressions evaluated over time.

Good for:
- spirals;
- orbits;
- rings;
- precise magical choreography;
- mathematically controlled paths.

Use dynamic motion when the effect should behave like a physical particle. Use parametric motion when the path itself is the authored equation.

Do not combine the two casually. Parametric motion changes the ownership model from velocity integration to expression-driven positioning.

## Collision motion

**OFFICIAL BEDROCK**

`minecraft:particle_motion_collision` provides collision behavior such as:
- collision radius;
- restitution/bounce;
- collision drag;
- expire on contact;
- collision-triggered events;
- minimum-speed event filtering.

Use only when world contact is materially visible or behaviorally important.

Collision is not free performance-wise and should not be enabled merely for realism if no visible interaction is needed.

## Kill plane and block-conditioned expiration

**OFFICIAL BEDROCK**

Other motion/lifetime-adjacent controls include:
- particle kill plane;
- expire if in blocks;
- expire if not in blocks.

These are useful when environment membership is more important than collision response.

## Motion classes

### Ballistic

**HEURISTIC**

```text
strong initial speed
+ downward gravity
+ low/moderate drag
```

Examples: debris, rocks, embers, fragments.

### Buoyant rise

```text
moderate upward initial speed
+ small upward acceleration or near-neutral gravity
+ moderate drag
```

Examples: smoke, steam, hot gas.

### Drift

```text
low speed
+ small lateral acceleration/noise
+ moderate/high drag
```

Examples: dust, spores, ash.

### Jet / exhaust

```text
narrow direction cone
+ moderate/high initial speed
+ drag
+ short/medium lifetime
```

### Choreographed magical

Prefer parametric position expressions or event-separated layers rather than forcing dynamic physics to draw exact geometric paths.

## Stable class ownership

**EMPIRICALLY VERIFIED**

Do not use `variable.emitter_age` to switch living particles between radically different dynamic-motion classes mid-life unless that is explicitly intended.

Use stable per-particle random state or age progression for persistent particle behavior.

## Local vs world interpretation

**HEURISTIC**

When an effect is attached to an entity/locator, always reason about whether the authored direction should follow the attachment orientation or read in world space. Validate in the target context rather than assuming a standalone preview proves attached behavior.

## Motion acceptance envelopes

**HEURISTIC**

For large effects, author intent as ranges rather than one exact trajectory:

```text
apex_y: 15..23 blocks
horizontal_distance: 28..40 blocks
```

This allows static preflight to detect obviously wrong values without pretending one exact path is the only acceptable visual answer.

## Common motion failures

- initial impulse too weak;
- using positive acceleration as a substitute for launch speed;
- wrong sign on gravity;
- excessive drag causing particles to stall immediately;
- low drag causing smoke/mist to travel unnaturally far;
- parametric motion used for a physical debris problem;
- dynamic motion used for an exact orbit/spiral problem;
- collision enabled on thousands of particles with no visible benefit;
- switching motion class using emitter age;
- assuming standalone preview orientation equals entity-attached orientation.

## Debug order

When trajectory is wrong, inspect in this order:

```text
spawn region
→ direction
→ initial speed
→ acceleration
→ drag
→ lifetime
→ collision / environmental expiration
→ attachment/local-space context
```

Do not start by changing texture, opacity, or spawn rate when the actual defect is trajectory.
