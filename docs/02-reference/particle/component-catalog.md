# Bedrock Particle Component Catalog

This file is the canonical checklist of particle component families used by Particle Reference Authoring. It complements `fundamentals.md` with a compact but comprehensive component inventory.

## Evidence

Unless marked otherwise: **OFFICIAL BEDROCK**.

## Emitter initial state

### `minecraft:emitter_local_space`
Controls entity-attached simulation space.

Fields:

```text
position
rotation
velocity
```

Important rule: `rotation=true` with `position=false` is invalid. `velocity=true` adds emitter velocity to initial particle velocity.

### `minecraft:emitter_initialization`
Runs emitter Molang:

```text
creation_expression
per_update_expression
```

Use for emitter-owned setup/state.

## Emitter rate

### `minecraft:emitter_rate_instant`
Burst emission.

Key field:

```text
num_particles
```

### `minecraft:emitter_rate_steady`
Continuous emission.

Key fields:

```text
spawn_rate
max_particles
```

### `minecraft:emitter_rate_manual`
Manual/external emission contract.

## Emitter lifetime

### `minecraft:emitter_lifetime_once`
Single active lifetime.

### `minecraft:emitter_lifetime_looping`
Active/sleep cycle.

Typical fields:

```text
active_time
sleep_time
```

### `minecraft:emitter_lifetime_expression`
Expression-owned activation/expiration.

Typical fields:

```text
activation_expression
expiration_expression
```

### `minecraft:emitter_lifetime_events`
Emitter lifecycle event hooks, including creation/expiration/timeline/travel-distance style triggers where supported by schema.

## Emitter shapes

### `minecraft:emitter_shape_point`
Point source with optional offset/direction.

### `minecraft:emitter_shape_sphere`
Spherical volume/surface.

Typical fields:

```text
offset
radius
surface_only
direction
```

Direction can be `inwards`, `outwards`, or a Molang vector.

### `minecraft:emitter_shape_box`
Box volume/surface.

Typical fields:

```text
offset
half_dimensions
surface_only
direction
```

### `minecraft:emitter_shape_disc`
Disc/ring-like planar source.

Typical fields include radius, plane orientation/normal, offset, surface-only/rim semantics where schema exposes them, and direction.

### `minecraft:emitter_shape_custom`
Custom Molang-authored spawn offset/direction.

### `minecraft:emitter_shape_entity_aabb`
Entity AABB-based spawn region for attached effects.

## Particle initialization / initial state

### `minecraft:particle_initialization`
Per-particle update/render expressions supported by current schema.

Use only when the field/context truly needs per-particle scripted state; stable built-ins remain preferred for simple identity.

### `minecraft:particle_initial_speed`
Initial speed/velocity input. Current schema supports scalar/Molang and vector forms.

Bedrock validity and Snowstorm interpretation are separate concerns; see `snowstorm.md`.

### `minecraft:particle_initial_spin`
Initial rotation and rotation rate.

Typical fields:

```text
rotation
rotation_rate
```

## Particle motion

### `minecraft:particle_motion_dynamic`
Physics-like motion.

Typical fields:

```text
linear_acceleration
linear_drag_coefficient
rotation_acceleration
rotation_drag_coefficient
```

### `minecraft:particle_motion_parametric`
Molang-authored relative motion.

Typical fields:

```text
relative_position
relative_direction
rotation
```

### `minecraft:particle_motion_collision`
Collision against world geometry.

Typical controls:

```text
collision_radius
collision_drag
coefficient_of_restitution
expire_on_contact
events
```

## Particle appearance

### `minecraft:particle_appearance_billboard`
Sprite geometry and UV.

Key fields:

```text
size
facing_camera_mode
direction
uv
```

UV may contain static UV or flipbook data.

### `minecraft:particle_appearance_tinting`
Direct color, RGBA Molang, or gradient/interpolant tint.

### `minecraft:particle_appearance_lighting`
Enables particle lighting behavior supported by the particle renderer.

## Particle lifetime

### `minecraft:particle_lifetime_expression`
Controls max lifetime and optional early expiration expression.

Typical fields:

```text
max_lifetime
expiration_expression
```

### `minecraft:particle_lifetime_events`
Creation/expiration/timeline-style particle event hooks.

### `minecraft:particle_expire_if_in_blocks`
Expires inside listed block identifiers.

### `minecraft:particle_expire_if_not_in_blocks`
Expires outside listed allowed block identifiers.

### `minecraft:particle_kill_plane`
Kills particle after crossing a plane:

```text
[A, B, C, D]
Ax + By + Cz + D = 0
```

## Non-component top-level particle structures

### `description`
Owns:

```text
identifier
basic_render_parameters.material
basic_render_parameters.texture
```

### `curves`
Reusable Molang-evaluated numeric curves.

### `events`
Named event graph used by emitter/particle lifecycle or collision actions.

## Event node capabilities

Official event structures can include combinations of:

```text
expression
sequence
randomize
sound_effect
particle_effect
```

Particle visual-effect relationship types include:

```text
emitter
emitter_bound
particle
particle_with_velocity
```

## Component-selection rule

Do not add components simply because they exist.

Choose the minimum family that owns the required behavior:

```text
when/where to spawn → emitter
initial launch → initial state
physics after spawn → motion
what it looks like → appearance
when it dies → lifetime
secondary behavior → events
reused progression → curves
```

## Conflict rules

Avoid competing owners for the same behavior.

Examples:
- do not use parametric position and dynamic physics to fight over trajectory without a deliberate reason;
- do not use emitter-age appearance switching when particle-age ownership is intended;
- do not use collision if expire-if-block or kill-plane is the simpler actual requirement;
- do not use deep event graphs for simple continuous behavior.

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponentlist?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlelist?view=minecraft-bedrock-stable
