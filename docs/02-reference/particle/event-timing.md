# Particle Event Timing Knowledge

This file owns event timing, lifetime-event sequencing, collision-event timing, and nested-effect timing decisions.

## Evidence classes

- **OFFICIAL BEDROCK** — documented event/lifetime behavior.
- **SNOWSTORM / WINTERSKY** — editor-preview timing behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — authoring guidance.

## 1. Timing layers

Particle systems have multiple timing owners:

```text
EMITTER LIFETIME
→ when the emitter exists / loops / expires

EMISSION RATE
→ when particles are born

PARTICLE LIFETIME
→ how long each particle survives after birth

EVENT TIMELINE
→ when authored events fire within emitter/particle life
```

Do not assume emitter expiration means all particles disappear immediately.

## 2. Emitter lifetime events

Emitter lifetime events can trigger named events at authored times or lifecycle moments.

Use for:
- phased bursts;
- starting secondary emitters;
- delayed crown/plume layers;
- loop-bound effects;
- end-of-emitter cleanup effects.

Keep child timing relative to a clear owner.

## 3. Particle lifetime events

Particle lifetime events belong to each living particle.

Good uses:
- birth-local setup;
- expiration child puff;
- age-based secondary effect;
- per-particle trail or breakup behavior.

Do not use emitter-global age for a per-particle event that should occur relative to each particle's own birth.

## 4. Birth time vs emitter time

If an emitter continuously spawns particles, each particle has a different local age even though all share the same emitter age.

Therefore:

```text
emitter_age threshold
→ synchronized phase across the emitter

particle_age threshold
→ same relative phase for each particle after its own birth
```

Choosing the wrong owner is a common cause of sudden mass changes.

## 5. Nested effect relationship types

Visual-effect event types can include relationships such as:

```text
emitter
emitter_bound
particle
particle_with_velocity
```

Select relationship type based on intended ownership and inheritance, not naming convenience.

Key questions:
- should the child live independently?
- should it remain bound to the parent emitter?
- should it behave as a particle-attached child?
- should it inherit velocity?

## 6. `pre_effect_expression`

Use `pre_effect_expression` for event-local setup before the child effect is evaluated.

Do not use it to hide unclear global state ownership. Keep child inputs explicit and minimal.

## 7. Collision event timing

Collision events occur on contact and may use `min_speed` gating.

Potential multiplicative behavior:

```text
many parent particles
× multiple collisions
× child effect spawn
= large fan-out
```

When the child effect is visually one-shot, ensure the event architecture does not unintentionally repeat on every contact/frame.

## 8. Looping emitter timing

For looping emitters distinguish:
- active duration;
- sleep duration;
- per-loop randomization;
- loop-start events;
- particle tails that outlive the loop boundary.

Avoid assuming loop reset kills existing particles unless the actual component behavior does so.

## 9. Timeline spacing

For complex effects, author major beats deliberately:

```text
0.00 s  ignition flash
0.05 s  debris burst
0.15 s  pressure smoke
0.80 s  secondary fragments
2.50 s  lingering plume
```

This is design timing, not a required Bedrock pattern. Keep each beat owned by the smallest effect that needs it.

## 10. Child latency and preview

**SNOWSTORM / WINTERSKY**

Nested preview timing can differ by editor version or unsupported edge behavior. If a child effect appears early/late or not at all:
1. validate the event graph and identifiers;
2. reduce to one parent + one child;
3. remove unrelated Molang;
4. confirm event time/lifetime values;
5. compare Minecraft runtime before classifying JSON as invalid.

## 11. Event determinism

For authored cinematic sequences, prefer deterministic event timing where exact order matters.

Use randomization only where natural variation is desired, and keep bounds narrow enough that semantic ordering is preserved.

Example:

```text
flash before smoke
→ deterministic ordering

individual debris breakup
→ bounded random timing acceptable
```

## 12. Time normalization

For per-particle progression, normalized age is conceptually:

```text
u = particle_age / particle_lifetime
```

This is useful for events/curves that should scale with varying lifetimes.

Do not divide by a value that may be zero.

## 13. Synchronization anti-patterns

Avoid:
- using emitter age to trigger all living particles' visual transition at once when local age is intended;
- deep nested child chains with no clear timeline owner;
- collision events that recursively spawn the same effect without a bounded stop;
- randomized delays that can invert required sequence order;
- relying on editor preview timing as sole runtime truth.

## 14. Event-timing QA

```text
[ ] each event has a clear time owner: emitter, particle, collision, or external trigger
[ ] continuous emitters do not accidentally synchronize particle-local transitions
[ ] child relationship type matches intended binding/inheritance
[ ] collision events are bounded
[ ] random timing cannot break required causal order
[ ] nested child identifiers exist
[ ] particle tails beyond emitter lifetime are intentional
[ ] Snowstorm timing differences are isolated from Bedrock validity
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_visual_effect_event?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
