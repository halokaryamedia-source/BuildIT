# Particle Entity Integration Knowledge

Provenance labels:
- **OFFICIAL BEDROCK** — Microsoft Bedrock particle/entity documentation.
- **SNOWSTORM / WINTERSKY** — editor/preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — authoring guidance.

## Ownership boundary

Particle Reference Authoring may prepare the particle asset and document expected attachment behavior, but active client-entity, animation-controller, locator, or Blockbench mutation belongs downstream.

This file exists so standalone particle authoring uses correct assumptions about entity transforms and binding.

## Effect mapping

Client entity resource definitions can map a local particle-effect shorthand to a particle identifier.

Conceptually:

```text
entity-local effect name
→ particle identifier
```

Animations/controllers then reference the local shorthand.

## Locators

Locators are geometry attachment points that can be parented to bones and therefore inherit animated transforms.

Typical uses:
- muzzle;
- exhaust;
- hand magic;
- eyes;
- footsteps;
- engine vents;
- weapon sockets.

Do not invent an exact locator name unless the target geometry defines it.

## Transform stack mental model

For an attached effect, think through the transform stack explicitly:

```text
entity transform
→ animated bone transform
→ locator transform
→ particle emitter transform
→ emitter local-space rules
→ particle spawn position/direction
→ particle post-spawn simulation
```

A visually wrong direction can originate at any earlier layer. Do not immediately rewrite particle motion.

## Position ownership

A locator contributes attachment position. `minecraft:emitter_local_space.position` then determines whether living particles continue simulating with emitter-local positional ownership or become world-independent after spawn according to the component semantics.

Debug questions:
- should existing particles follow the moving locator?
- or only be born at the locator and then remain in world space?

Smoke from a moving exhaust and a glowing orb fixed to a hand can require different ownership.

## Rotation ownership

A locator/bone can carry rotation. `minecraft:emitter_local_space.rotation` controls whether emitter rotation remains part of particle simulation.

Important constraint:

```text
rotation=true
requires
position=true
```

Do not compensate for wrong bone/locator orientation by rotating the source texture or rewriting launch math until transform ownership is confirmed.

## Velocity inheritance

`minecraft:emitter_local_space.velocity=true` adds emitter velocity to initial particle velocity.

Use only when inherited host motion is desired.

Examples:

```text
moving vehicle exhaust
→ inherited velocity may matter

magic aura bound to hand
→ inherited translational velocity may not be visually desirable
```

Do not confuse emitter velocity inheritance with child-event `particle_with_velocity`; they are different ownership mechanisms.

## Orientation contract

For entity-bound authoring, document expected local axes:

```text
local +X
local +Y
local +Z
```

and identify which axis is intended as forward/up for the effect.

Standalone Snowstorm preview cannot fully prove this because final bone/locator transforms are absent.

## Billboard emitter-transform modes

Billboard modes such as:

```text
emitter_transform_xy
emitter_transform_xz
emitter_transform_yz
```

bind billboard orientation to emitter transform planes.

For attached effects, these modes make the entity/bone/locator transform part of appearance semantics, not just spawn placement.

If appearance is wrong, inspect:

```text
bone rotation
→ locator rotation
→ emitter local-space settings
→ emitter-transform billboard plane
→ source texture axis
```

## Animation-driven effects

Particle effects can be triggered from animation particle-effect keyframes after registration in the client entity resource definition.

Good for discrete beats:
- footstep;
- impact spark;
- attack flash;
- reload smoke;
- muzzle flash.

## Animation-controller-driven effects

Animation controllers can own sustained/stateful triggering.

Good for:
- charge aura;
- burning state;
- engine smoke while active;
- status effect while a condition is true.

Do not duplicate the same state machine inside particle JSON when the controller already owns it.

## `pre_effect_script`

Entity particle bindings may provide Molang before emitter startup.

Use for compact configuration:
- color scalar;
- scale scalar;
- effect variant;
- bounded entity-specific values.

If a value should remain stable for a fire-and-forget particle, prefer sampling it before/at effect creation rather than continuously querying entity state afterward.

## Entity scale

`variable.entity_scale` is available in relevant particle contexts.

Use it only when the effect should intentionally scale with entity scale.

Avoid accidental coupling where a world-scale VFX shrinks/grows simply because the model render scale changes.

## Fire-and-forget versus bound

Package notes should explicitly state one of:

```text
fire-and-forget
bound to locator
bound while controller/state is active
```

### Fire-and-forget
The host creates the effect, then the effect should remain visually coherent even if the source moves away.

### Bound
The effect intentionally remains tied to the attachment transform.

This distinction affects local-space, query lifetime, event type, and child-effect behavior.

## Child effects and binding

Event child types have different relationship semantics. When entity attachment matters, decide whether the child should:
- detach as its own emitter;
- remain emitter-bound;
- attach to a parent particle;
- inherit particle velocity.

Do not assume parent entity binding automatically propagates to every child event in the desired way.

## Query/reference lifetime

Continuous entity queries are only safe while the relevant entity/reference context exists and is exposed to the expression host.

For a fire-and-forget effect:

```text
entity query needed once
→ sample/pass value before spawn
```

is usually safer than:

```text
living particles continuously dereference entity state
```

unless that coupling is intentional and supported.

## Attachment design checklist

Capture:

```text
intended locator role
expected local forward/up axis
fire-and-forget vs bound
should particles follow locator position after birth?
should particles follow locator rotation after birth?
should host velocity be inherited?
should child effects inherit binding/velocity?
required pre_effect variables
expected entity-scale behavior
billboard emitter-transform plane if used
```

## Common mistakes

- effect spawns at entity origin because locator mapping is missing;
- local launch axis disagrees with locator/bone orientation;
- `rotation=true` used without local position ownership;
- particles follow a moving limb when they should detach into world space;
- particles detach when they should remain glued to the locator;
- host velocity is inherited unexpectedly;
- sustained emitter is retriggered every animation frame;
- particle JSON duplicates animation-controller state logic;
- entity query is read after a fire-and-forget effect lost the required context;
- emitter-transform billboard plane is debugged as a texture problem;
- assumed locator does not exist.

## Debug order

```text
particle works standalone?
→ client entity effect mapping
→ locator exists?
→ bone/locator position
→ bone/locator rotation
→ local-space position/rotation/velocity
→ animation/controller trigger
→ pre_effect values
→ billboard emitter-transform mode if used
→ child binding/inheritance
→ Snowstorm standalone vs actual entity runtime
```

## Reference package handoff

When entity integration is relevant, include only known downstream facts:

```text
attachment role
expected local axis
binding mode intent
local-space intent
velocity inheritance intent
required pre_effect variables
scale behavior
```

Do not include client-entity mutation files unless explicitly requested as separate downstream work.

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_local_space?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_visual_effect_event?view=minecraft-bedrock-stable
