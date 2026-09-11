# Particle Entity Integration Knowledge

Provenance labels:
- **OFFICIAL BEDROCK** — Microsoft Bedrock particle documentation.
- **SNOWSTORM / WINTERSKY** — editor/preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced in accepted authoring work.
- **HEURISTIC** — authoring guidance.

## Ownership boundary

Particle Reference Authoring may prepare the particle asset and document its expected attachment behavior, but active client-entity, animation, controller, or Blockbench runtime mutation belongs downstream.

This file exists so the particle asset is authored with correct assumptions about how Bedrock entities bind and place particle effects.

## Effect list

**OFFICIAL BEDROCK**

Entity resource definitions can expose particle effects through a local shorthand mapping.

Conceptually:

```text
entity-local short name
→ particle identifier
```

Animations and animation controllers then refer to the local shorthand rather than repeating the full particle identifier.

## Locators

**OFFICIAL BEDROCK**

Locators are defined in geometry and can be attached to bones, so the particle emitter follows the animated bone transform.

Use locators for:
- muzzle flashes;
- exhaust pipes;
- hand-held magic;
- eye glow sources;
- footstep effects;
- engine vents;
- weapon sockets.

If no locator is specified, the effect may originate from the entity origin depending on the downstream binding.

## Orientation

**OFFICIAL BEDROCK + HEURISTIC**

A locator can carry orientation as well as position. This matters when emitter direction should follow an animated part.

Therefore, standalone Snowstorm preview cannot always prove final attached direction.

Author the particle so its local launch direction has a clear meaning, then validate attachment in the actual entity context downstream.

## Animation-driven effects

**OFFICIAL BEDROCK**

Particle effects can be triggered from entity animations through particle effect keyframes after the effect is registered in the client entity resource definition.

Good for:
- footstep burst at a known animation frame;
- attack spark;
- reload smoke;
- timed muzzle flash.

## Animation-controller-driven effects

**OFFICIAL BEDROCK**

Animation controllers can trigger particle effects from controller states.

Good for:
- sustained status aura while a state is active;
- charge effect while charging;
- fire/smoke while an entity condition remains true.

The particle asset should not duplicate controller state logic internally when the controller already owns the gameplay/state condition.

## pre_effect_script

**OFFICIAL BEDROCK**

Entity particle bindings can provide a pre-effect Molang script before emitter startup.

Use it to initialize effect variables that the particle JSON reads.

Good uses:
- color selection;
- size scalar;
- bounded entity-specific configuration.

Do not use it to hide a large second behavior system inside the particle handoff.

## Entity scale

**OFFICIAL BEDROCK CONTEXT + HEURISTIC**

`variable.entity_scale` is available to particle Molang in relevant contexts.

Use entity scale only when the effect genuinely should scale with the entity. Avoid accidentally coupling world-sized VFX to an entity's render scale.

## Bound vs fire-and-forget behavior

**OFFICIAL BEDROCK CONTEXT**

Downstream animation/controller bindings can create sustained/bound effects or fire-and-forget effects depending on how the effect is authored and triggered.

Particle package notes should state intended behavior:

```text
fire-and-forget
bound to locator
bound while state active
```

This makes downstream integration deterministic.

## Attachment design checklist

When authoring a particle intended for entity use, capture:

```text
intended locator role
expected local forward/up direction
fire-and-forget or sustained
whether emitter should follow locator motion
whether child effects should inherit binding
required pre_effect variables
expected scale behavior
```

Do not invent an exact locator name unless the user or downstream asset defines one.

## Common integration mistakes

- effect works standalone but spawns at entity origin because locator binding is missing;
- local launch axis is wrong for the target bone orientation;
- particle effect duplicates animation-controller state logic;
- sustained emitter is triggered repeatedly every animation frame;
- fire-and-forget effect is authored as a permanently bound loop;
- pre-effect variable expected by the particle is never initialized;
- entity scale changes a world-space effect unexpectedly;
- reference package assumes a locator that does not exist.

## Reference package handoff

When entity integration is relevant, particle delivery notes should include only downstream facts that are known:

```text
suggested attachment role: exhaust / hand / muzzle / etc.
expected local direction
binding mode intent
required variables
```

Do not include client-entity mutation files unless the user explicitly requested that downstream integration work as part of a separate task.

## Debug order for attached particles

If an effect works standalone but fails on an entity:

```text
particle effect still valid alone?
→ client entity effect mapping
→ locator exists?
→ locator/bone transform correct?
→ animation/controller trigger fires?
→ local direction/orientation correct?
→ pre_effect variables initialized?
→ sustained effect ownership correct?
```
