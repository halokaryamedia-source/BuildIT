# Particle Events Knowledge

Evidence classes:
- **OFFICIAL BEDROCK** — Microsoft Bedrock particle documentation/schema.
- **SNOWSTORM / WINTERSKY** — editor/preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — authoring guidance.

## Role and sources

Events let emitter/particle lifecycle or collision state execute named event nodes. They are appropriate for layering materially different physics roles without forcing one emitter to morph across unrelated states.

Event triggers include:
- emitter lifetime events;
- particle lifetime events;
- collision events;
- named event nodes referenced by those triggers.

## Current event-node schema

Current generated particle event schemas expose these event-node branches:

```text
expression
log
particle_effect
randomize
sequence
sound_effect
```

Current generated defaults/omission semantics include:

```text
expression      default = 0
log             default = ""
particle_effect default = {"effect":"","pre_effect_expression":0,"type":null}
randomize       = not set
sequence        = not set
sound_effect    = not set
```

Treat `not set` as absence, not an empty array/object invented by the authoring system.

### expression

Executes Molang for the event. Use for bounded event-local state changes, not as a hidden replacement for clear continuous behavior.

### sequence

Executes authored event nodes in sequence. Use when order is semantically required.

### randomize

Selects among weighted event nodes. Current particle schema exposes an explicit `weight` field on random entries. Do not invent a particle-specific default weight when the target schema does not document one.

### particle_effect

Spawns another particle effect. Fields include:

```text
effect
pre_effect_expression
type
```

Relationship types documented for particle visual-effect events include:

```text
emitter
emitter_bound
particle
particle_with_velocity
```

Select relationship type from ownership/binding/velocity inheritance needs, not convenience.

### sound_effect

Triggers the referenced sound-effect event where supported by the target particle schema/context.

### log

Current generated schema exposes a log string field. Treat it as diagnostic/event behavior, not production visual output.

## Visual effect relationship semantics

### `emitter`
Creates an independent child emitter.

### `emitter_bound`
Creates a child emitter that remains bound to the parent context.

### `particle`
Creates particle-linked child behavior without the velocity-inheritance contract of `particle_with_velocity`.

### `particle_with_velocity`
Creates child behavior where inherited parent-particle velocity is part of the relationship.

## `pre_effect_expression`

Runs before the child effect starts. Use it for minimal child setup only. Do not hide broad shared-state architecture inside it.

## Emitter lifetime event schema

`minecraft:emitter_lifetime_events` can expose:

```text
creation_event
expiration_event
timeline
travel_distance_events
looping_travel_distance_events
```

Current generated schema forms record defaults such as:

```text
creation_event                 default = []   (array form; string alternative may be not set)
expiration_event               default = []   (array form; string alternative may be not set)
timeline                       default = {}
travel_distance_events         default = {}
looping_travel_distance_events default = []
```

Generated union/alternate schema representations can look awkward. Use the target-version accepted JSON shape rather than copying a documentation-generator artifact literally.

### creation / expiration

Emitter creation fires when the emitter is created. Emitter expiration fires when the emitter expires; it does **not** wait for already-created child particles to finish their particle lifetimes.

### timeline

Keys represent emitter-relative timeline times. For looping emitters, timeline events are evaluated again according to each emitter loop's timeline semantics.

### travel_distance_events

Distance-keyed events fire after the emitter has traveled the authored accumulated distance threshold.

### looping_travel_distance_events

Each entry can expose fields such as:

```text
distance
effects
```

The event repeats each time the emitter travels the authored interval from the previous firing. The referenced effects are named events in the particle effect.

Do not confuse distance-driven events with timeline seconds.

## Particle lifetime events

`minecraft:particle_lifetime_events` supports particle-owned lifecycle triggers such as:

```text
creation_event
expiration_event
timeline
```

Timeline keys are relative to each particle's own birth. Event values may be one event name or an array where the target schema permits it.

One event per particle can multiply rapidly; always estimate fan-out.

## Collision events

Collision events belong to `minecraft:particle_motion_collision`. Event entries can use minimum-speed gating. Current official docs record `min_speed = 2` for collision-event entries in current generated/legacy-compatible forms.

Use collision child effects only when contact is visually important. Repeated contacts can trigger repeated children unless the architecture prevents it.

## Fan-out model

Estimate:

```text
parent population
× trigger count per parent
× event branches
× child emitter/particle output
```

Deep event chains can become expensive even when each individual node looks small.

## Master effect architecture

A visually empty master effect is valid as an orchestration pattern when it materially clarifies timing:

```text
master
├── flash
├── debris
├── pressure smoke
└── lingering plume
```

Do not add a master merely for organization when a single effect already has one coherent physics role.

## Bundle integrity

Validate:

```text
[ ] every child identifier exists
[ ] identifiers are unique
[ ] referenced named events exist
[ ] circular chains are intentional/bounded or rejected
[ ] textures referenced by all children exist
[ ] randomize/sequence branches contain valid event nodes
[ ] relationship type matches intended binding/velocity
[ ] collision/lifetime fan-out is bounded
```

## Snowstorm boundary

Snowstorm/Wintersky nested-event preview can vary by release. When a child effect is missing or late:

```text
validate child alone
→ validate identifier/event name
→ validate trigger owner/time/distance
→ validate relationship type
→ remove unrelated Molang
→ compare target Snowstorm release
→ compare Minecraft runtime when material
```

Do not convert an editor-preview regression into a generic Bedrock restriction.

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_visual_effect_event?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_lifetime_events?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_lifetime_events?view=minecraft-bedrock-stable
