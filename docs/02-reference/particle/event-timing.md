# Particle Event Timing Knowledge

This file owns event timing, lifetime-event sequencing, travel-distance triggers, collision timing, and nested-effect timing decisions.

## Evidence classes

- **OFFICIAL BEDROCK** — documented lifecycle/event behavior.
- **SNOWSTORM / WINTERSKY** — editor-preview timing behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — authoring guidance.

## Timing owners

```text
EMITTER LIFETIME
→ emitter creation / active loop / sleep / expiration

EMISSION RATE
→ particle birth schedule

PARTICLE LIFETIME
→ each particle's age from its own birth

EMITTER TIMELINE
→ seconds relative to emitter loop

PARTICLE TIMELINE
→ seconds relative to particle birth

TRAVEL DISTANCE
→ accumulated emitter movement, not elapsed seconds

COLLISION
→ contact-triggered timing
```

Never collapse these into one global clock.

## Emitter creation and expiration

Emitter `creation_event` fires when the emitter is created.

Emitter `expiration_event` fires when the emitter expires. It does **not** wait for already-created particles to finish their own lifetimes. Therefore a child tail can remain visible after the emitter that created it has ended.

## Emitter timeline

Emitter lifetime `timeline` keys are emitter-relative times. For a looping emitter, timeline behavior repeats with the emitter's loop semantics rather than becoming particle-relative.

Use emitter timeline for user-facing global beats such as:

```text
0.00 ignition
0.10 debris layer
0.25 pressure smoke
4.00 plume crown
```

Do not use it when every continuously spawned particle should execute the same beat a fixed duration after its own birth.

## Particle lifetime timeline

Particle creation/expiration/timeline events belong to each particle independently.

```text
particle born at emitter t=1.0
particle timeline 0.5
→ fires around emitter t=1.5

particle born at emitter t=2.0
particle timeline 0.5
→ fires around emitter t=2.5
```

This distinction prevents unintended synchronized mass transitions.

## Travel-distance events

Emitter `travel_distance_events` are keyed by emitter travel distance. They are not time keys.

Use when behavior should depend on source movement through space, for example footprints/trail beats or distance-spaced emissions.

Conceptually:

```text
accumulated emitter travel reaches threshold
→ named event fires
```

Do not convert distance values to seconds unless the design explicitly assumes a known source speed.

## Looping travel-distance events

`looping_travel_distance_events` repeats based on distance traveled since the previous firing.

Conceptually:

```text
distance interval = d
move d → fire
move another d → fire again
```

This differs from a map of one-shot accumulated distance thresholds.

Current generated schema can represent entries with fields such as:

```text
distance
effects
```

Verify the exact target-version union shape before authoring.

## Looping emitter boundaries

Distinguish:
- active duration;
- sleep duration;
- emitter randoms that are stable for the loop;
- timeline events that repeat with loops;
- particles that remain alive across loop boundaries.

Do not assume emitter-loop reset destroys living particles.

## Collision timing

Collision events occur on qualifying contact. Minimum-speed gating belongs to collision-event semantics, not lifetime timeline semantics.

Potential multiplication:

```text
many particles
× multiple contacts per particle
× child events
```

If the artistic intent is a one-shot impact, explicitly design against repeated-contact firing rather than assuming the runtime does it once.

## Child relationship timing

Relationship types:

```text
emitter
emitter_bound
particle
particle_with_velocity
```

change ownership/binding/velocity relationships, not just naming. A child emitter may continue independently after the event that created it; particle-linked forms have different parent-context assumptions.

## `pre_effect_expression`

`pre_effect_expression` runs before the spawned child effect begins. Keep its state setup event-local and minimal. It is not a substitute for a clear global time owner.

## Sequence vs randomize

Use `sequence` when causal order matters.

Use `randomize` only when variation is acceptable. Weighted random selection must not be used where it can invert a required semantic order such as flash-before-smoke.

## Normalized age

For properties that scale with variable particle lifetime:

```text
u = particle_age / particle_lifetime
```

is useful for expressions/curves, but lifetime-event `timeline` itself is authored in the component's documented time domain; do not silently replace official timeline semantics with normalized age.

## Snowstorm boundary

When nested timing appears different in Snowstorm/Wintersky:
1. reduce to one parent and one child;
2. remove unrelated Molang;
3. confirm emitter/particle/distance owner;
4. confirm parent lifetime reaches the trigger;
5. confirm child effect independently;
6. compare Minecraft runtime before declaring valid JSON wrong.

## Timing QA

```text
[ ] each trigger owner is explicit: emitter time, particle time, distance, collision, external
[ ] emitter expiration versus particle tail is intentional
[ ] emitter timeline repetition across loops is intentional
[ ] particle timeline is relative to individual birth
[ ] travel-distance values are not mistaken for seconds
[ ] looping distance events are bounded and intentional
[ ] collision fan-out is bounded
[ ] randomization cannot break causal ordering
[ ] child binding/velocity relationship is intentional
[ ] Snowstorm timing differences remain target-specific
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_lifetime_events?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_lifetime_events?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_visual_effect_event?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
