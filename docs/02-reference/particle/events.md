# Particle Events Knowledge

Provenance labels:
- **OFFICIAL BEDROCK** — Microsoft Bedrock particle documentation.
- **SNOWSTORM / WINTERSKY** — editor/preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced in accepted authoring work.
- **HEURISTIC** — authoring guidance.

## Event role

**OFFICIAL BEDROCK**

Particle events allow an emitter or particle to trigger additional actions, including spawning other particle effects. This enables layered and sequenced effects without forcing unrelated physics into one emitter.

## Event sources

Events can be triggered from several lifecycle or interaction points, including:
- emitter lifetime events;
- particle lifetime events;
- collision events;
- explicit event nodes inside the particle effect.

Treat event timing as part of effect architecture, not as a late packaging detail.

## Visual effect event

**OFFICIAL BEDROCK**

A particle visual-effect event can spawn another particle effect by identifier.

Supported event relationship types include:

```text
emitter
emitter_bound
particle
particle_with_velocity
```

Use child effects for materially distinct layers such as:
- explosion core → debris;
- projectile impact → dust puff;
- eruption master → bombs + plume + crown;
- magic burst → ring + sparks + lingering aura.

## Type semantics

### emitter

Use when a child emitter should be created as an independent emitter effect.

### emitter_bound

Use when the spawned child emitter should remain bound to the parent context.

### particle

Use when the child effect should spawn as a particle-linked effect without inherited velocity semantics.

### particle_with_velocity

Use when inherited particle velocity is materially part of the child effect behavior.

Do not select event type by convenience; select it from ownership and motion inheritance needs.

## pre_effect_expression

**OFFICIAL BEDROCK**

Visual-effect events may use a pre-effect Molang expression before the child effect starts.

Use for:
- passing setup state;
- initializing variables needed by the child effect;
- bounded event-specific configuration.

Do not use pre-effect scripts as a hidden replacement for clear particle architecture.

## Emitter lifetime events

**OFFICIAL BEDROCK**

Emitter lifecycle can trigger events around creation, looping, expiration, or timeline-driven points depending on the component contract.

Use when the event belongs to the emitter's lifecycle rather than to each individual particle.

## Particle lifetime events

**OFFICIAL BEDROCK**

Particle lifecycle can trigger events at particle creation, expiration, or timeline positions.

Use for:
- ember expiration puffs;
- spark death flashes;
- staged per-particle transformations.

Be careful with fan-out: one event per particle can multiply child emitters rapidly.

## Collision events

**OFFICIAL BEDROCK**

Collision motion can trigger events when collision conditions are met. Minimum-speed filters can prevent low-energy contacts from firing expensive or visually noisy child effects.

Good use cases:
- debris impact dust;
- rain splash;
- bouncing spark contact.

## Event fan-out

**HEURISTIC**

Always estimate multiplication:

```text
parent particles
× events per parent particle
× child particles per child effect
```

A visually simple chain can become very expensive if every particle spawns a child emitter.

## Master effect architecture

**HEURISTIC + EMPIRICALLY VERIFIED**

For large composed effects, use a master effect when it improves timing and ownership clarity.

Example:

```text
master
├── core at t=0
├── debris at t=0.1
├── plume rise at t=0.2
└── plume crown at t=4.0
```

The master can remain visually empty if its only responsibility is orchestration.

Do not make the master itself emit visible particles unless it has an actual visual role.

## Bundle integrity rules

**HEURISTIC + EMPIRICALLY VERIFIED**

When an authored package contains event-linked child particles, validate:
- every referenced child identifier exists;
- identifiers are unique;
- document identifier matches bundle metadata;
- circular chains are intentional or rejected;
- root-relative orphan effects are intentional;
- referenced textures exist.

## Circular chains

**HEURISTIC**

Avoid circular event references unless a bounded loop is explicitly designed and known safe.

A chain such as:

```text
A → B → A
```

can create runaway emission or hard-to-debug behavior.

## Event timing strategy

**HEURISTIC**

Use event separation when visual layers need different timing but share one user-facing effect.

Prefer event sequencing over forcing one emitter to morph from one physics role into another using time thresholds.

## Snowstorm preview notes

**SNOWSTORM / WINTERSKY**

Snowstorm can preview event-driven structures, but nested/event preview behavior can differ by editor release. If a child effect appears missing:
1. validate identifier linkage;
2. validate event timing;
3. validate event type;
4. verify child effect independently;
5. check Snowstorm release/regression context;
6. compare in Minecraft when needed.

## Common event failures

- child identifier typo;
- event fires before the master remains alive long enough;
- one particle accidentally spawns one emitter each frame;
- collision event has no minimum-speed filtering;
- child event type does not preserve intended binding/velocity;
- circular event chain;
- event architecture used where a simple single emitter would be clearer;
- one emitter uses emitter-age thresholds to imitate a multi-stage event chain.

## Debug order

When a child effect does not appear:

```text
child effect works alone?
→ identifier exact?
→ event exists?
→ trigger lifecycle/timeline reached?
→ parent lives long enough?
→ event type correct?
→ pre-effect expression safe?
→ Snowstorm/editor-specific issue?
```
