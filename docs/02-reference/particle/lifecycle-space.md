# Particle Lifecycle, Evaluation Timing and Simulation Space

This file owns the timing/space model that connects emitter creation, particle creation, update/render evaluation, local/world space, and event lifetime behavior.

## Evidence

Unless marked otherwise: **OFFICIAL BEDROCK**.

## 1. Two lifetimes exist

Always separate:

```text
EMITTER LIFETIME
→ controls whether/when the emitter can spawn particles

PARTICLE LIFETIME
→ controls how long each already-spawned particle remains alive
```

An emitter can stop while its particles continue living.

This is the basis of effect tails, lingering smoke, post-burst debris, and mist decay.

## 2. Emitter startup

Typical startup sequence conceptually:

```text
emitter created
→ emitter initialization creation_expression
→ emitter lifetime logic becomes active
→ emitter rate decides when to spawn
→ emitter shape chooses spawn location/direction
→ particle instance is created
```

Do not assume every component evaluates at the same time.

## 3. Emitter initialization

`minecraft:emitter_initialization` supports:

```text
creation_expression
per_update_expression
```

Use `creation_expression` for emitter state initialized once.

Use `per_update_expression` for emitter-owned state that intentionally evolves while the emitter updates.

Do not use per-update emitter state to simulate stable per-particle identity.

## 4. Particle creation

At particle birth, initial-state components establish properties such as:

```text
initial speed
initial spin
shape-derived direction
stable random identity supplied by runtime
```

Then motion/appearance/lifetime components govern subsequent frames.

## 5. Particle update vs render

Conceptual ownership:

```text
particle update
→ lifetime / motion / update expressions

particle render
→ billboard size / facing / UV / tint / render expressions
```

A property evaluated per render frame can change even if the particle itself did not just spawn.

That is why unstable global/emitter-driven expressions can cause living particles to visibly reclassify.

## 6. Particle initialization component

Current Bedrock schema exposes `minecraft:particle_initialization` with particle update/render expression hooks.

Treat this as advanced scripting capability, not a replacement for clear ownership.

Prefer built-in stable particle random/age/lifetime state when it already expresses the requirement.

## 7. Stable identity principle

A particle class chosen at birth should remain stable unless intentional evolution is part of the design.

Examples of stable identity:

```text
heavy rock vs small fragment
smoke class A vs smoke class B
hot ember vs cold debris
UV atlas cell family
persistent size family
```

Use particle-owned stable state such as `particle_random_*` for class decisions.

## 8. Evolution principle

Properties that intentionally evolve through one particle lifetime should usually depend on:

```text
particle_age
particle_lifetime
normalized progress = particle_age / particle_lifetime
```

Examples:
- fade;
- grow/shrink;
- cooling tint;
- flipbook/lifetime progression;
- parametric path progress.

## 9. Emitter phase principle

Properties that describe the source/emission phase should depend on emitter-owned state:

```text
emitter_age
emitter_lifetime
emitter_random_*
```

Examples:
- burst is strongest during first second;
- smoke production decreases after eruption;
- looping emitter sleeps between cycles.

## 10. Local vs world simulation

`minecraft:emitter_local_space` controls entity-attached simulation frame behavior.

Fields:

```text
position
rotation
velocity
```

### `position=false`, `rotation=false`
Particles emit relative to the emitter but then simulate independently in world space.

Useful for:
- smoke left behind by a moving vehicle;
- dust trail;
- sparks that should detach from source.

### `position=true`
Particle positions simulate in entity/local space and follow the attached owner spatially.

Useful for:
- aura locked around a moving entity;
- effect that must remain attached rather than leave a trail.

### `rotation=true`
Rotation also follows local/entity orientation.

Official rule: `rotation=true` with `position=false` is invalid.

### `velocity=true`
Emitter velocity contributes to initial particle velocity.

Useful for physical inheritance such as particles emitted from moving entities.

## 11. Attachment and locator implications

When an effect is bound to an entity locator/bone:

```text
locator defines spawn transform
local-space settings define whether particles continue following transform
motion defines behavior after spawn
```

Do not solve attachment mistakes by distorting particle motion.

## 12. Lifetime events

Emitter and particle lifetime event components can trigger named events at lifecycle points/timelines.

Use event hooks for discrete transitions/actions.

Do not use event graphs to simulate every continuous frame of a value that belongs in Molang/curve/motion instead.

## 13. Collision-event timing

Collision behavior can trigger events when contact occurs.

A collision-triggered child effect therefore depends on:

```text
parent particle still alive
collision component active
contact geometry reached
collision event mapping valid
child effect identifier available
```

Diagnose those layers in that order before editing textures or emitter rates.

## 14. Expiration methods

Particles can end through multiple mechanisms:

```text
max lifetime reached
expiration_expression becomes true
collision expire_on_contact
expire-if-in-blocks
expire-if-not-in-blocks
kill plane crossing
lifetime event logic
```

Choose the minimum owner that matches the requirement.

## 15. Why timing bugs happen

Common causes:
- emitter age used where particle age was intended;
- rate changes misunderstood as particle changes;
- living particles continue after emitter ends and are mistaken for a bug;
- child event fires later than expected because parent collision/expiration drives it;
- local-space particles follow entity when a world-space trail was expected;
- world-space particles detach when a body-locked aura was expected.

## 16. Diagnostic matrix

### Particle changes class halfway through life
Check particle-vs-emitter variable ownership.

### Trail sticks to moving source
Check local-space `position`.

### Aura gets left behind
Check local-space position/rotation and binding locator.

### Particles inherit unwanted movement
Check local-space `velocity`.

### Effect stops spawning but particles remain
Likely normal emitter-vs-particle lifetime behavior.

### Child impact effect never appears
Check collision → event → child reference chain.

## 17. Authoring checklist

```text
[ ] emitter lifetime and particle lifetime are designed separately
[ ] creation/update/render timing is understood for each dynamic field
[ ] class identity uses stable particle-owned state
[ ] lifecycle evolution uses particle age/lifetime
[ ] source timeline uses emitter age/lifetime
[ ] local/world-space intent is explicit
[ ] velocity inheritance is intentional
[ ] locator attachment and local-space behavior agree
[ ] expiration method matches physical requirement
[ ] discrete events are not replacing continuous math unnecessarily
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlesintroduction?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_local_space?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_initialization?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_initialization?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
