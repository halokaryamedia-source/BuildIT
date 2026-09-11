# Bedrock Particle Fundamentals

This file records the Bedrock-generic foundation for Particle Reference Authoring. Snowstorm-specific compatibility belongs in `snowstorm.md`; Molang ownership details belong in `molang.md`.

## Evidence Class

Unless marked otherwise, rules in this file are **OFFICIAL BEDROCK** and follow the Minecraft Creator particle JSON documentation.

## 1. Particle Document Shape

A Bedrock particle resource is a component-based `particle_effect` document.

Canonical high-level structure:

```json
{
  "format_version": "1.10.0",
  "particle_effect": {
    "description": {
      "identifier": "namespace:effect",
      "basic_render_parameters": {
        "material": "particles_alpha",
        "texture": "textures/particle/example"
      }
    },
    "curves": {},
    "components": {},
    "events": {}
  }
}
```

`description` must contain an identifier and `basic_render_parameters`; render parameters contain the material and texture contract.

## 2. Mental Model

Treat one effect as four cooperating layers:

```text
DESCRIPTION
→ identity + render asset

EMITTER
→ when particles are created
→ where they are created
→ emitter lifetime and event timing

PARTICLE
→ how each spawned particle lives, moves, collides, and renders

EVENT GRAPH
→ what secondary actions/effects occur on creation, timeline, collision, expiration, or authored triggers
```

A complex user-facing effect may legitimately use multiple particle-effect files when materially different physics roles would otherwise fight each other.

## 3. Emitter Rate

Common rate families:

```text
minecraft:emitter_rate_instant
→ burst-style spawn

minecraft:emitter_rate_steady
→ continuous spawn_rate with max_particles cap

minecraft:emitter_rate_manual
→ externally/manual-controlled emission contract
```

Authoring implication:
- burst impacts/explosions usually start from instant emission;
- smoke, dust, exhaust, rain, or sustained ambience usually start from steady emission;
- do not imitate an instant burst by using an extreme steady rate unless timing evidence requires it.

## 4. Emitter Lifetime

Common lifetime families:

```text
minecraft:emitter_lifetime_once
minecraft:emitter_lifetime_looping
minecraft:emitter_lifetime_expression
minecraft:emitter_lifetime_events
```

Separate **emitter lifetime** from **particle lifetime**. The emitter may stop producing new particles while already spawned particles continue until their own lifetime expires.

This distinction matters for event tails, smoke decay, lingering mist, and layered explosions.

## 5. Emitter Shapes

Common shape components include:

```text
minecraft:emitter_shape_point
minecraft:emitter_shape_sphere
minecraft:emitter_shape_box
minecraft:emitter_shape_disc
```

Shape owns spawn-space distribution and, where supported, direction behavior.

Authoring rule:
- choose a shape because it matches the physical source volume/surface;
- do not use a wide shape merely to fake trajectory spread that belongs in direction/speed variation.

Examples:
- chimney/exhaust mouth → point or compact disc;
- crater mouth → disc / bounded region;
- diffuse magical aura → sphere;
- volume dust inside a room → box or sphere, depending on scene geometry.

## 6. Particle Lifetime

`minecraft:particle_lifetime_expression` controls how long each spawned particle survives.

Lifetime is one of the main density controls because visible load is roughly related to:

```text
spawn rate × average lifetime
```

This is an authoring/performance relationship, not an exact FPS model.

## 7. Initial Motion

`minecraft:particle_initial_speed` contributes initial particle velocity. Motion after spawn is then shaped by the chosen motion component.

Do not conflate:

```text
initial velocity / launch impulse
with
ongoing acceleration
```

For ballistic debris, sparks, eruptive rocks, or directional bursts, establish launch impulse first, then use acceleration/drag for trajectory shaping.

## 8. Dynamic Motion

`minecraft:particle_motion_dynamic` provides physics-style motion with linear acceleration and drag, plus rotational acceleration/drag fields.

Use it for effects such as:
- gravity-driven debris;
- sparks slowing through air;
- smoke with gentle lift or drift;
- falling/rising particles whose path is force-like rather than mathematically scripted.

Keep the model physically legible:

```text
initial velocity
+ acceleration
- drag
→ trajectory
```

## 9. Parametric Motion

`minecraft:particle_motion_parametric` drives relative position/direction/rotation from Molang expressions evaluated during particle life.

Use it for deliberately mathematical motion:
- orbit;
- spiral;
- wave;
- synchronized formation;
- precise magical choreography.

Do not use parametric motion merely because it is powerful. Dynamic motion is usually easier to reason about for natural debris/smoke/sparks.

## 10. Collision

`minecraft:particle_motion_collision` adds world-geometry collision behavior, including fields such as:

```text
collision_radius
collision_drag
coefficient_of_restitution
expire_on_contact
collision events
```

Collision is not free authoring complexity. Enable it only when contact behavior is visually or functionally important.

Examples where collision can matter:
- rain hitting ground;
- bouncing fragments;
- sparks dying on impact;
- debris triggering a secondary effect.

## 11. Billboard Appearance

`minecraft:particle_appearance_billboard` controls sprite size, camera-facing behavior, and UV/flipbook mapping.

Important authoring concerns:
- sprite world scale;
- intended viewing distance;
- atlas dimensions and UV bounds;
- stable class ownership for UV/size;
- flipbook timing where animated textures are used.

A valid billboard configuration does not guarantee the sprite is visually readable or free from blend/sorting artifacts.

## 12. Tinting

`minecraft:particle_appearance_tinting` applies color/tint behavior.

Tint can be static or Molang-driven. Treat alpha/tint animation as particle-owned when it describes the evolution of each living particle.

Typical use:
- smoke fading;
- fire cooling;
- magic shifting color;
- impact flash decaying.

## 13. Curves

Particle curves provide reusable numeric outputs driven by an input expression and a horizontal range. Linear and Bezier-family curves are available in the Bedrock particle format.

Use curves when a value needs a controlled progression, for example:
- size over normalized age;
- alpha fade;
- color/intensity envelope;
- velocity or offset shaping through a reusable variable.

Do not add a curve when a simple expression is clearer and cheaper to maintain.

## 14. Events

Particle event nodes can perform actions including:

```text
expression
sequence
randomize
sound_effect
particle_effect
```

Nested particle effects support event-driven layered effects. Official type choices for visual-effect events include:

```text
emitter
emitter_bound
particle
particle_with_velocity
```

Use event composition when it clarifies physics ownership. Avoid deep chains merely for organizational style.

## 15. Composition Principle

Prefer one emitter/effect per materially distinct role when any of these differ substantially:

```text
spawn timing
spawn region
direction
initial speed
acceleration / drag
lifetime
sprite class
blend/material need
event behavior
```

This makes QA and correction causal. A user complaint about debris should not require rewriting smoke logic.

## 16. Validity vs Acceptance

Keep three questions separate:

```text
Is the JSON structurally/semantically valid Bedrock?
Is it compatible with the chosen authoring/preview target such as Snowstorm?
Does it look correct in the target scene?
```

Passing the first does not prove the second or third.

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlelist?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_visual_effect_event?view=minecraft-bedrock-stable
