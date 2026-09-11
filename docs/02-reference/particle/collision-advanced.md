# Advanced Particle Collision Knowledge

This file deepens collision-specific authoring beyond the general motion overview.

## Evidence classes

- **OFFICIAL BEDROCK** — documented particle collision fields/semantics.
- **SNOWSTORM / WINTERSKY** — preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — bounded authoring guidance.

## 1. Collision component

**OFFICIAL BEDROCK**

`minecraft:particle_motion_collision` provides world-geometry collision behavior. Important fields include:

```text
enabled
collision_radius
collision_drag
coefficient_of_restitution
expire_on_contact
events[]
  event
  min_speed
```

Collision is separate from `minecraft:particle_motion_dynamic`; it modifies how a moving particle reacts to contact.

## 2. Restitution

`coefficient_of_restitution` controls bounce response.

Conceptually:

```text
0      → no elastic rebound
0..1   → partial rebound
higher → stronger rebound response
```

Do not assume exact real-world rigid-body physics. Tune to visual intent and verify in Minecraft.

## 3. Collision drag

`collision_drag` slows tangential/sliding motion during collision behavior.

Useful for:
- fragments losing energy on the ground;
- sparks skimming surfaces;
- rain/splash particles that should not slide far.

Do not confuse collision drag with general `linear_drag_coefficient`, which affects motion continuously, not only contact behavior.

## 4. Collision radius

`collision_radius` approximates the contact size of the particle.

A billboard may be visually large while collision radius is small, or vice versa. Treat render size and collision volume as separate contracts.

Too-large radius can make particles appear to bounce before reaching a visible surface. Too-small radius can cause apparent clipping.

## 5. Enabled expression

Collision can be expression-controlled where supported.

Good uses:
- disable collision during an initial launch phase;
- enable contact behavior only after a particle reaches a certain age/class;
- restrict expensive collision to particles that visually need it.

Prefer particle-owned state for per-particle consistency.

## 6. Expire on contact

`expire_on_contact` is appropriate when contact terminates the particle:
- raindrop hits ground;
- spark dies on impact;
- projectile-like fragment becomes a child effect rather than continuing.

If a secondary effect is needed, pair expiration/contact handling with an event rather than keeping the original particle alive unnecessarily.

## 7. Collision events and minimum speed

**OFFICIAL BEDROCK**

Collision event entries can gate an event with `min_speed`.

Use this to avoid triggering an impact effect from near-stationary contact.

Conceptual design:

```text
fast collision
→ impact flash / chip / splash

slow settling contact
→ no event
```

## 8. Event fan-out risk

A collision-triggered child effect can multiply particle count dramatically.

Before using collision events estimate:

```text
parent visible population
× expected collisions per particle
× child particles per collision
```

This is a static planning heuristic, not exact runtime measurement.

## 9. Continuous collision vs visual necessity

Do not enable collision for smoke, mist, aura, ambient dust, or distant plume particles simply because collision exists.

Collision is most valuable when contact materially changes the effect silhouette or behavior.

## 10. High-speed particles

**HEURISTIC**

Very fast, very small particles are more likely to expose preview/runtime contact differences. For high-speed debris/sparks:
- keep collision radius reasonable;
- use impact events only when visually important;
- compare Snowstorm and Minecraft;
- avoid relying on collision for exact gameplay-grade projectile behavior.

Particles are visual effects, not a substitute for entity/projectile physics.

## 11. Ground-settling pattern

A common natural debris model:

```text
initial impulse
+ gravity
+ air drag
+ collision
→ bounce with moderate restitution
→ collision drag removes lateral speed
→ expire after short tail
```

Keep this separate from smoke/plume layers.

## 12. Splash pattern

For rain/water drops:

```text
falling parent drop
→ contact event
→ short-lived splash child effect
→ parent expires
```

This is usually cleaner than making one particle morph from drop to splash.

## 13. Collision debugging order

```text
1. confirm particle actually reaches geometry
2. confirm collision enabled expression
3. confirm collision radius
4. inspect restitution
5. inspect collision drag
6. inspect expire_on_contact
7. inspect event name/reference
8. inspect min_speed threshold
9. inspect child bundle integrity
10. compare Snowstorm vs Minecraft if behavior diverges
```

## 14. QA checklist

```text
[ ] collision is visually necessary
[ ] collision radius matches intended contact scale
[ ] general drag and collision drag are not confused
[ ] restitution is intentional
[ ] expire_on_contact matches lifecycle intent
[ ] event min_speed avoids accidental low-energy triggering
[ ] child collision events do not create unbounded fan-out
[ ] high-speed contact is not assumed to be gameplay-precise
[ ] Snowstorm preview differences are kept separate from Bedrock validity
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
