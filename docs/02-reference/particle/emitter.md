# Particle Emitter Knowledge

Provenance labels used here:
- **OFFICIAL BEDROCK** — documented by Microsoft Bedrock particle references.
- **SNOWSTORM / WINTERSKY** — editor/preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced in our accepted authoring work.
- **HEURISTIC** — authoring guidance, not engine law.

## Core responsibility

**OFFICIAL BEDROCK**

The emitter owns when particles are emitted, where they begin, and which initial direction field is supplied. Particle lifetime and particle motion then control the living particles after spawn.

Think in three separate questions:

```text
WHEN  → emitter rate + emitter lifetime
WHERE → emitter shape + offset + surface_only
WHICH WAY → emitter shape direction + particle initial speed
```

Do not use particle motion components to compensate for an emitter that spawns from the wrong region.

## Emitter rate families

### Instant

**OFFICIAL BEDROCK**

`minecraft:emitter_rate_instant`

Use for one burst at emitter creation. Typical use cases:
- impact burst;
- explosion fragments;
- one-shot splash;
- short spark burst.

Primary field:

```text
num_particles
```

### Steady

**OFFICIAL BEDROCK**

`minecraft:emitter_rate_steady`

Use for continuous emission while the emitter is active.

Primary fields:

```text
spawn_rate
max_particles
```

The visible population is not equal to spawn rate. It is also constrained by particle lifetime and `max_particles`.

### Manual

**OFFICIAL BEDROCK**

`minecraft:emitter_rate_manual`

Use when an external owner determines particle count rather than a normal rate schedule.

## Emitter lifetime families

### Once

**OFFICIAL BEDROCK**

Use when an emitter should remain active for a finite authored duration and then expire.

Good for:
- explosion sequences;
- spell casts;
- temporary environmental bursts.

### Looping

**OFFICIAL BEDROCK**

Use when the emitter repeats active and inactive periods.

Typical authored controls:

```text
active_time
sleep_time
```

Good for:
- intermittent steam;
- flickering environmental emissions;
- machinery cycles.

### Expression driven

**OFFICIAL BEDROCK**

`minecraft:emitter_lifetime_expression`

`activation_expression` is evaluated continuously; non-zero means the emitter is active. `expiration_expression` can terminate the emitter.

Use for entity/game-state-linked emitters.

Do not confuse emitter activation with individual particle lifetime.

## Emitter initialization

**OFFICIAL BEDROCK**

Emitter initialization belongs to emitter startup state. Particle initialization belongs to each particle's own state.

Authoring rule:

```text
emitter-wide shared setup → emitter initialization
per-particle persistent setup → particle initialization / particle randoms
```

This distinction prevents accidental time-varying particle classes.

## Shape families

### Point

**OFFICIAL BEDROCK**

Single compact origin with optional offset and direction.

Use for:
- nozzle emission;
- muzzle flash;
- locator-attached spark source;
- precise projectile trail origin.

### Sphere

**OFFICIAL BEDROCK**

Spawn positions are distributed in a sphere. `surface_only` can restrict positions to the shell.

Use for:
- aura volume;
- explosion shell;
- spherical magical distribution.

### Disc

**OFFICIAL BEDROCK**

Useful for circular or planar spawn areas.

Use for:
- crater mouth;
- ground mist ring;
- portal plane;
- radial surface emission.

### Box

**OFFICIAL BEDROCK**

Useful for rectangular areas with half dimensions and offset.

Use for:
- rain volume;
- room dust;
- rectangular machinery vents;
- bounded environmental ambience.

### Entity AABB

**OFFICIAL BEDROCK**

Useful when particles should distribute around an entity's axis-aligned bounds.

Use for:
- sparkle around mobs;
- status aura around entity body volume.

### Custom

**OFFICIAL BEDROCK**

Custom shape expressions allow procedural offsets/directions.

Use only when standard shapes cannot express the desired distribution cleanly.

## Direction ownership

**OFFICIAL BEDROCK**

Shape direction can be:
- custom vector;
- `inwards` where supported;
- `outwards` where supported.

Direction and speed are separate authoring concepts.

Recommended mental model:

```text
shape.direction = heading
particle_initial_speed = magnitude
```

## Snowstorm-targeted launch contract

**SNOWSTORM / WINTERSKY + EMPIRICALLY VERIFIED**

For Snowstorm/Wintersky preview fidelity when launch magnitude matters:

```text
emitter shape direction = launch vector
particle_initial_speed = scalar speed
```

Do not rely on a vector `particle_initial_speed` when the magnitude itself is part of the intended ballistic behavior. In our accepted eruption work, vector initial speed previewed as direction-like input with unintended effective magnitude.

This is a compatibility rule, not a declaration that vector initial speed is invalid Bedrock JSON.

## Surface-only usage

**OFFICIAL BEDROCK**

`surface_only` changes spawn distribution, not the underlying shape dimensions.

Use it when:
- only shell/rim emission is desired;
- filling the interior would waste particles;
- an effect visually reads as a surface source.

## Offset strategy

**HEURISTIC**

Prefer semantic emitter offsets over compensating later with particle motion.

Examples:
- exhaust should start at the exhaust mouth;
- crown smoke should spawn near crown altitude if it is authored as a separate layer;
- ground mist should not be launched high and forced downward merely to reach the intended region.

## Decomposition rule

**HEURISTIC**

Split emitters when physics roles differ materially.

Split if one layer needs a different:
- spawn shape;
- launch direction;
- speed scale;
- gravity/drag;
- lifetime;
- texture class;
- spatial role.

Do not split solely because colors differ if one stable emitter can express the variation cleanly.

## Density reasoning

**HEURISTIC**

Visible density approximately depends on:

```text
spawn rate
× average lifetime
× survival fraction
subject to max_particles
```

Therefore, if an effect is too dense, do not automatically lower spawn rate. Check whether lifetime or max count is the real cause.

## Common emitter mistakes

- using `outwards` on a horizontal disc when the intended effect is primarily vertical;
- using acceleration to repair a missing launch impulse;
- using a giant box/sphere and hiding most particles behind geometry;
- forgetting that continuous spawn rate plus long lifetime creates accumulation;
- using emitter-age thresholds to redefine already living particle classes;
- combining physically unrelated layers into one monolithic emitter.

## Authoring checklist

Before accepting an emitter design, verify:

```text
rate family matches effect timing
lifetime family matches effect ownership
shape matches physical source region
offset starts from the correct place
direction matches intended heading
speed is authored separately from heading when appropriate
surface_only is intentional
max_particles bounds accumulation
distinct physics roles are decomposed only when needed
```
