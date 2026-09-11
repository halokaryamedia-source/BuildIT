# Bedrock Particle Component Field Reference

Purpose: field-oriented reference for authoring and diagnosing Bedrock particle components. Use `component-catalog.md` for component discovery and this file when a specific field/property decision matters.

Evidence class: **OFFICIAL BEDROCK** unless marked **HEURISTIC**.

## Description

### `description.identifier`
Unique particle identifier such as `namespace:effect_name`.

Failure modes:
- duplicate identifier across files;
- event/consumer references point to a different identifier;
- namespace/name typo.

### `description.basic_render_parameters.material`
Particle render material.

Common values:
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
- wrong atlas referenced.

---

# Emitter components

## `minecraft:emitter_local_space`

Fields:
```text
position
rotation
velocity
```

Controls which emitter transforms/velocity are inherited by the simulation.

Important: local-space choices affect spawn position, orientation, and motion interpretation. Do not debug trajectory before confirming this component.

## `minecraft:emitter_initialization`

Typical fields:
```text
creation_expression
per_update_expression
```

Use creation logic for emitter setup and per-update logic only for state intended to evolve with emitter updates.

Failure mode: using continuously changing emitter state to stand in for per-particle initialization.

## `minecraft:emitter_rate_instant`

Field:
```text
num_particles
```

Burst emission.

Failure mode: huge instant count creates visual/performance spikes.

## `minecraft:emitter_rate_steady`

Fields:
```text
spawn_rate
max_particles
```

Steady population control.

Authoring relation:
```text
steady visible load ≈ min(max_particles, spawn_rate × average_particle_lifetime)
```

Approximation only.

## `minecraft:emitter_rate_manual`

Manual/event-driven emission ownership. Use only when downstream triggering actually owns emission.

## `minecraft:emitter_lifetime_once`

Field:
```text
active_time
```

Emitter runs once for the authored active duration.

## `minecraft:emitter_lifetime_looping`

Typical fields:
```text
active_time
sleep_time
```

Repeating emitter lifecycle.

Failure mode: confusing emitter loop age with particle age.

## `minecraft:emitter_lifetime_expression`

Fields:
```text
activation_expression
expiration_expression
```

Expression-driven activation/expiration.

Failure mode: expressions oscillate around thresholds and create unintended activation behavior.

## `minecraft:emitter_lifetime_events`

Owns emitter lifecycle event hooks/timeline events. Keep event identifiers valid and bundle references resolvable.

---

# Emitter shapes

## Common shape fields

Many shape components support:
```text
offset
direction
surface_only
```

### `offset`
Spawn-region offset relative to emitter/local transform.

### `direction`
May be `inwards`, `outwards`, or a Molang vector depending on the shape.

### `surface_only`
Restricts emission to a shape surface/edge where supported.

## `minecraft:emitter_shape_point`

Point origin plus optional offset/direction semantics.

Use for compact no-volume sources.

## `minecraft:emitter_shape_sphere`

Typical fields:
```text
radius
offset
direction
surface_only
```

Use for spherical volume/surface emission.

## `minecraft:emitter_shape_box`

Typical fields:
```text
half_dimensions
offset
direction
surface_only
```

`half_dimensions` are center-to-face extents, not full width/height/depth.

## `minecraft:emitter_shape_disc`

Fields:
```text
radius
plane_normal
offset
direction
surface_only
```

`plane_normal` controls disc orientation.

Failure mode: wrong normal gives a vertical disc when a ground-plane disc was intended.

## `minecraft:emitter_shape_entity_aabb`

Fields typically include:
```text
direction
surface_only
```

Spawn region comes from attached entity AABB.

## `minecraft:emitter_shape_custom`

Fields:
```text
offset [x,y,z]
direction [x,y,z]
```

Use only when built-in shapes are insufficient.

---

# Particle initialization and lifetime

## `minecraft:particle_initialization`

Fields:
```text
per_update_expression
per_render_expression
```

Use only for state that belongs at those evaluation stages. Persistent identity should rely on particle-owned stable values rather than recomputing from emitter time.

## `minecraft:particle_lifetime_expression`

Field:
```text
max_lifetime
```

Evaluated to determine particle lifetime.

Failure modes:
- zero/negative lifetime;
- density unexpectedly high because lifetime is longer than intended;
- all particles share exact lifetime when visual variance was expected.

## `minecraft:particle_lifetime_events`

Lifecycle-driven event hooks/timeline events for individual particles.

---

# Particle initial state

## `minecraft:particle_initial_speed`

Initial speed/magnitude contract.

Bedrock accepts Molang/numeric forms documented by schema. Snowstorm/Wintersky may require target-specific caution around vector semantics; see `snowstorm.md`.

## `minecraft:particle_initial_spin`

Controls initial rotational state where supported.

Use when billboard rotation matters; do not confuse spin with translational direction.

---

# Motion

## `minecraft:particle_motion_dynamic`

Fields include:
```text
linear_acceleration
linear_drag_coefficient
rotation_acceleration
rotation_drag_coefficient
```

Interpretation:
```text
initial velocity
+ acceleration
- drag/damping
→ motion
```

Failure modes:
- using acceleration to fake launch impulse;
- excessive drag freezes particle too quickly;
- gravity sign/direction wrong;
- deeply nested expressions make trajectory unauditable.

## `minecraft:particle_motion_parametric`

Fields commonly describe relative position/direction/rotation through Molang.

Use for exact authored paths such as orbit/spiral/wave.

Failure mode: using parametric motion for natural physics where dynamic motion is simpler and more tunable.

## `minecraft:particle_motion_collision`

Fields include:
```text
collision_radius
collision_drag
coefficient_of_restitution
expire_on_contact
events
```

Some schemas/versions expose additional contact thresholds such as minimum-speed behavior.

Failure modes:
- radius too large creates early contact;
- restitution too high creates unrealistic bounce;
- repeated collision event fan-out;
- high-speed tunneling/preview mismatch.

See `collision-advanced.md`.

---

# Environmental expiration

## `minecraft:particle_expire_if_in_blocks`

Expires particles when inside configured blocks.

## `minecraft:particle_expire_if_not_in_blocks`

Expires particles when outside configured blocks.

## `minecraft:particle_kill_plane`

Defines a plane that kills particles crossing it.

Failure mode: plane orientation/sign incorrect and removes particles immediately.

---

# Appearance

## `minecraft:particle_appearance_billboard`

Fields include:
```text
size
facing_camera_mode
direction
uv
```

### `size`
Two-dimensional billboard size; evaluated dynamically.

### `facing_camera_mode`
Documented modes include:
```text
rotate_xyz
rotate_y
lookat_xyz
lookat_y
direction_x
direction_y
direction_z
emitter_transform_xy
emitter_transform_xz
emitter_transform_yz
```

Target schema/version support must be checked when using less common modes.

### Direction source
Directional billboard modes may derive orientation from velocity or use custom direction, depending on schema.

Failure mode: near-zero direction/velocity produces unstable or unreadable orientation.

## Billboard UV fields

Common UV fields:
```text
texture_width
texture_height
uv
uv_size
flipbook
```

Failure modes:
- texture dimensions mismatch PNG;
- UV region out of bounds;
- wrong atlas cell;
- flipbook steps bleed into neighbors.

## Flipbook fields

Common fields:
```text
base_UV
size_UV
step_UV
frames_per_second
max_frame
stretch_to_lifetime
loop
```

Use for texture animation, not physical motion.

## `minecraft:particle_appearance_tinting`

Supports direct color/Molang channels/gradient forms depending on schema.

Failure mode: tint fights already-saturated texture colors or alpha ownership.

## `minecraft:particle_appearance_lighting`

Enables particle lighting behavior. Do not treat it as emitted world light.

---

# Curves

Particle-effect `curves` definitions commonly use:
```text
type
nodes
input
horizontal_range
```

Known curve families include linear, Bezier, Bezier chain, and Catmull-Rom variants.

Failure modes:
- wrong normalized input;
- horizontal range mismatch;
- duplicated complex expressions instead of shared curve;
- curve used where simple linear math would be clearer.

---

# Events

Event nodes can include:
```text
expression
sequence
randomize
sound_effect
particle_effect
log
```

Nested visual-effect event fields include:
```text
effect
type
pre_effect_expression
```

Relationship types include documented forms such as:
```text
emitter
emitter_bound
particle
particle_with_velocity
```

Failure modes:
- missing child identifier;
- circular effect graph;
- unintended fan-out;
- wrong velocity inheritance type;
- event timing attached to emitter instead of particle or vice versa.

---

# Field-authoring QA

Before delivery verify:

```text
[ ] identifier and referenced child identifiers resolve
[ ] texture path resolves
[ ] material matches alpha/blend intent
[ ] emitter rate and lifetime are coherent
[ ] shape dimensions/offset/plane normal are correct
[ ] direction and initial-speed ownership are clear
[ ] particle lifetime is positive and density-aware
[ ] motion fields represent intended physics
[ ] collision fields do not create accidental event storms
[ ] billboard facing mode has a valid direction source when required
[ ] texture dimensions/UV/flipbook fields match the PNG
[ ] tint/alpha ownership is stable per particle
[ ] curve inputs/ranges are coherent
[ ] local/world-space behavior is intentional
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_appearance_billboard?view=minecraft-bedrock-stable
