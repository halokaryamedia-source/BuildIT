# Bedrock Particle Component Field Reference

Purpose: field-oriented reference for authoring and diagnosing Bedrock particle components. Use `component-catalog.md` for component discovery, `official-defaults-evaluation.md` for exact defaults/evaluation timing, and this file for field purpose/ownership/failure modes.

Evidence class: **OFFICIAL BEDROCK** unless marked **HEURISTIC**.

## Description

### `description.identifier`
Unique particle identifier such as `namespace:effect_name`.

Failure modes:
- duplicate identifier across files;
- child/consumer references point to a different identifier;
- namespace/name typo.

### `description.basic_render_parameters.material`
Common materials:

```text
particles_opaque
particles_alpha
particles_blend
particles_add
```

### `description.basic_render_parameters.texture`
Texture resource path without `.png` extension.

Failure modes:
- path mismatch;
- missing PNG;
- wrong atlas.

---

# Emitter components

## `minecraft:emitter_local_space`

Fields:

```text
position
rotation
velocity
```

Controls emitter transform/velocity inheritance. Important constraint: local rotation requires local position ownership.

## `minecraft:emitter_initialization`

```text
creation_expression
per_update_expression
```

Use creation logic for emitter setup and per-update logic only for state intended to evolve with emitter updates.

## `minecraft:emitter_rate_instant`

```text
num_particles
```

Burst emission.

Failure mode: oversized burst creates visual/performance spikes.

## `minecraft:emitter_rate_steady`

```text
spawn_rate
max_particles
```

Steady population control.

Approximation:

```text
visible population ≈ min(max_particles, spawn_rate × average_lifetime)
```

## `minecraft:emitter_rate_manual`

Manual/external emission ownership. Use only when a downstream caller/event actually owns emission.

## `minecraft:emitter_lifetime_once`

```text
active_time
```

Single active emitter lifetime.

## `minecraft:emitter_lifetime_looping`

```text
active_time
sleep_time
```

Repeating active/sleep lifecycle.

Failure mode: treating emitter-loop reset as particle-lifetime reset.

## `minecraft:emitter_lifetime_expression`

```text
activation_expression
expiration_expression
```

Both are repeatedly evaluated according to the official component semantics.

## `minecraft:emitter_lifetime_events`

May expose:

```text
creation_event
expiration_event
timeline
travel_distance_events
looping_travel_distance_events
```

exact field availability depends on target schema/version.

Time-based and distance-based event keys are different coordinate domains. Do not treat distance keys as seconds.

---

# Emitter shapes

Common fields:

```text
offset
direction
surface_only
```

### `offset`
Spawn-region offset relative to emitter/local transform.

### `direction`
May be `inwards`, `outwards`, or Molang vector depending on shape/schema.

### `surface_only`
Restricts emission to the shape surface/edge where supported.

## `minecraft:emitter_shape_point`
Compact point source.

## `minecraft:emitter_shape_sphere`

```text
radius
offset
direction
surface_only
```

## `minecraft:emitter_shape_box`

```text
half_dimensions
offset
direction
surface_only
```

`half_dimensions` are center-to-face extents.

## `minecraft:emitter_shape_disc`

```text
radius
plane_normal
offset
direction
surface_only
```

Failure mode: wrong `plane_normal` rotates the intended source plane.

## `minecraft:emitter_shape_entity_aabb`
Spawn region derives from the attached entity AABB.

## `minecraft:emitter_shape_custom`

```text
offset [x,y,z]
direction [x,y,z]
```

Use only when built-in shapes cannot express the required distribution.

---

# Particle initialization and lifetime

## `minecraft:particle_initialization`

```text
per_update_expression
per_render_expression
```

These are ongoing evaluation-stage hooks, not one-time birth-only storage.

## `minecraft:particle_lifetime_expression`

```text
max_lifetime
expiration_expression
```

Ownership:

```text
max_lifetime
→ one-time lifetime ceiling for that particle

expiration_expression
→ continuous early-expiration condition
```

Failure modes:
- zero/negative lifetime;
- assuming `max_lifetime` keeps reevaluating;
- density unexpectedly high because lifetime is longer than intended.

## `minecraft:particle_lifetime_events`

Lifecycle event hooks for individual particles:

```text
creation_event
expiration_event
timeline
```

Timeline time is particle-relative.

---

# Particle initial state

## `minecraft:particle_initial_speed`

Initial translational launch contract. Bedrock schema can accept scalar/Molang and vector forms; Snowstorm compatibility is target-specific.

## `minecraft:particle_initial_spin`

Fields:

```text
rotation
rotation_rate
```

### `rotation`
Initial billboard rotation angle.

### `rotation_rate`
Initial angular velocity/spin rate.

Do not confuse:

```text
rotation
→ orientation angle

rotation_rate
→ change of angle over time

particle_motion_dynamic.rotation_acceleration
→ change of angular velocity

particle_motion_dynamic.rotation_drag_coefficient
→ angular damping
```

Authoring model:

```text
initial angle
+ initial angular velocity
+ rotational acceleration
- rotational drag
→ billboard rotation over lifetime
```

Failure modes:
- using `rotation` when continuous spin was intended;
- using huge `rotation_rate` to compensate for frame-rate perception;
- applying rotational acceleration when constant spin is sufficient;
- confusing sprite rotation with directional billboard alignment.

---

# Motion

## `minecraft:particle_motion_dynamic`

```text
linear_acceleration
linear_drag_coefficient
rotation_acceleration
rotation_drag_coefficient
```

Interpretation:

```text
initial translational velocity
+ linear acceleration
- linear drag

initial rotation rate
+ rotation acceleration
- rotation drag
```

## `minecraft:particle_motion_parametric`

Current field family includes:

```text
relative_position
direction
rotation
```

Use for exact authored paths such as orbit/spiral/wave.

## `minecraft:particle_motion_collision`

```text
enabled
collision_radius
collision_drag
coefficient_of_restitution
expire_on_contact
events
```

Collision events may also use minimum-speed thresholds depending on schema.

---

# Environmental expiration

## `minecraft:particle_expire_if_in_blocks`

Value shape: array of block identifiers.

Semantics:

```text
particle enters/is in any listed block
→ particle expires
```

Official legacy documentation states this component may coexist with `particle_lifetime_expression`.

Good uses:
- steam disappears in water;
- dust dies when entering configured media;
- environment-specific cleanup.

Failure modes:
- wrong/unsupported block identifier;
- forgetting namespace;
- list unintentionally includes `minecraft:air` and kills almost everything;
- assuming this replaces max lifetime instead of adding another expiration condition.

## `minecraft:particle_expire_if_not_in_blocks`

Value shape: array of allowed block identifiers.

Semantics:

```text
particle is NOT in any listed block
→ particle expires
```

This is effectively an environment allow-list.

Good uses:
- underwater-only particles;
- particles constrained to one medium/block class.

Failure modes:
- empty/incorrect allow-list causes immediate expiration;
- assuming block matching checks visual material instead of block identifier;
- expecting broad tags/categories when the schema expects explicit identifiers.

## Combined expiration ownership

Multiple expiration mechanisms can coexist conceptually:

```text
max lifetime
OR expiration_expression
OR expire_if_in_blocks
OR expire_if_not_in_blocks
OR kill plane
OR collision expire_on_contact
```

The earliest satisfied expiration mechanism wins visually. Debug disappearing particles by checking all enabled kill paths, not only lifetime.

## `minecraft:particle_kill_plane`

Plane coefficients:

```text
[A, B, C, D]
A*x + B*y + C*z + D = 0
```

Official semantics include a plane positioned relative to emitter while oriented in world space.

Failure mode: sign/orientation mistakes kill particles immediately or on the wrong side.

---

# Appearance

## `minecraft:particle_appearance_billboard`

```text
size
facing_camera_mode
direction
uv
```

Current facing modes include:

```text
lookat_xyz
lookat_y
lookat_direction
rotate_xyz
rotate_y
direction_x
direction_y
direction_z
emitter_transform_xy
emitter_transform_xz
emitter_transform_yz
```

Directional modes need a valid direction source. Emitter-transform modes depend on emitter/local attachment transforms.

## Billboard UV fields

```text
texture_width
texture_height
uv
uv_size
flipbook
```

## Flipbook fields

```text
base_UV
size_UV
step_UV
frames_per_second
max_frame
stretch_to_lifetime
loop
```

## `minecraft:particle_appearance_tinting`

Accepted representation families include:
- static hex;
- RGB/RGBA numeric/Molang array;
- gradient + interpolant object.

See `appearance-rendering.md` for keyed/even gradient ownership and alpha interaction.

## `minecraft:particle_appearance_lighting`

Enables particle lighting interaction; it does not create emitted world light.

---

# Curves

Common fields:

```text
type
nodes
input
horizontal_range
```

Curve families:

```text
linear
bezier
bezier_chain
catmull_rom
```

Bezier-chain node structures may include keyed positions plus value/slope/tangent fields according to target schema.

---

# Events

Event nodes may include:

```text
expression
log
particle_effect
randomize
sequence
sound_effect
```

Visual-effect event fields:

```text
effect
type
pre_effect_expression
```

Relationship types:

```text
emitter
emitter_bound
particle
particle_with_velocity
```

---

# Field-authoring QA

```text
[ ] identifier and child identifiers resolve
[ ] texture path resolves
[ ] material matches alpha/blend intent
[ ] emitter rate/lifetime are coherent
[ ] shape dimensions/offset/plane normal are correct
[ ] direction and initial-speed ownership are clear
[ ] particle lifetime is positive and density-aware
[ ] all active expiration paths are intentional
[ ] block expiration identifiers are exact
[ ] initial spin angle/rate and dynamic rotational fields have distinct roles
[ ] motion fields represent intended physics
[ ] collision does not create accidental event storms
[ ] billboard facing mode has a valid direction/transform source
[ ] texture dimensions/UV/flipbook match the PNG
[ ] tint/alpha ownership is stable per particle
[ ] curve input/range/node representation matches target schema
[ ] local/world-space behavior is intentional
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_appearance_tinting?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_expire_if_in_blocks?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_expire_if_not_in_blocks?view=minecraft-bedrock-stable
