# Official Particle Defaults and Evaluation Semantics

Purpose: record **current official Bedrock defaults, evaluation timing, and version-sensitive field semantics** that are easy to lose when reading only high-level component descriptions.

Evidence class: **OFFICIAL BEDROCK** unless explicitly marked otherwise.

This file complements:

```text
component-catalog.md
→ what components exist

component-field-reference.md
→ field purpose / ownership / failure modes

official-schema-coverage.md
→ whether every official family has an owner

THIS FILE
→ defaults + evaluation timing + schema-version delta notes
```

Do not infer a default when Microsoft documentation says `not set`.

---

## 1. Emitter local space

`minecraft:emitter_local_space`

Documented fields:

```text
position
rotation
velocity
```

Official behavior:
- `position` defaults to `false`;
- `rotation` defaults to `false`;
- `rotation=true` with `position=false` is invalid;
- `velocity=true` adds emitter velocity to the particle's initial velocity;
- when local position/rotation are false, particles are emitted relative to the emitter then simulate independently in world space.

Authoring consequence: confirm local-space ownership before diagnosing trajectory, attachment drift, or inherited motion.

---

## 2. Emitter lifetime expression

`minecraft:emitter_lifetime_expression`

```text
activation_expression default = 1
expiration_expression default = 0
```

Both are documented as frame-evaluated.

Meaning:
- activation non-zero → emitter emits;
- activation zero → emitter turns off;
- expiration non-zero → emitter expires.

Do not treat activation and expiration as one-time initialization values.

---

## 3. Particle lifetime expression

`minecraft:particle_lifetime_expression`

```text
expiration_expression default = 0
max_lifetime             = no implicit authored value documented
```

Official evaluation distinction:
- `expiration_expression` is evaluated continuously/every frame and expires when non-zero;
- `max_lifetime` is evaluated once for the particle and determines the absolute lifetime ceiling.

This is a critical ownership distinction:

```text
sample once at birth
→ max_lifetime

continuous condition
→ expiration_expression
```

Do not use changing external state in `max_lifetime` expecting it to keep updating.

---

## 4. Particle initialization

`minecraft:particle_initialization`

Current generated schema exposes:

```text
per_update_expression default = 0
per_render_expression default = 0
```

The component is particle-owned, but those field names describe their ongoing evaluation stages. Do **not** simplify the whole component into "runs only once at birth" merely because the component is named initialization.

Use:
- `per_update_expression` only for state intentionally updated with simulation;
- `per_render_expression` only for state intentionally evaluated for rendering.

Persistent one-time identity should still prefer stable particle-owned random values or other birth-stable inputs when possible.

---

## 5. Emitter shape defaults

### Disc

`minecraft:emitter_shape_disc`

Current documented defaults:

```text
offset       = [0, 0, 0]
plane_normal = [0, 1, 0]
radius       = 1
surface_only = false
direction    = not set
```

`plane_normal` may be axis shorthand (`x`, `y`, `z`) or a vector form depending on schema form.

### Sphere

`minecraft:emitter_shape_sphere`

```text
offset       = [0, 0, 0]
radius       = 1
surface_only = false
direction    = not set
```

### Custom

`minecraft:emitter_shape_custom`

```text
offset    = [0, 0, 0]
direction = [0, 0, 0]
```

### Entity AABB

`minecraft:emitter_shape_entity_aabb`

```text
surface_only = false
direction    = not set
```

Authoring rule: distinguish `not set` from an explicit zero vector. They are not interchangeable assumptions.

---

## 6. Billboard direction defaults

`minecraft:particle_appearance_billboard`

The billboard direction subsection supports direction source modes including:

```text
derive_from_velocity
custom_direction
```

Legacy/current official documentation states that when the direction subsection is omitted, directional facing behaves as:

```text
mode                = derive_from_velocity
min_speed_threshold = 0.01
```

For `custom_direction`, provide an explicit 3D direction vector.

Important: this direction subsection is relevant to facing modes that require direction input; it is not the same thing as emitter launch direction or `particle_initial_speed`.

---

## 7. Billboard UV defaults

Billboard `uv` documentation records:

```text
texture_width  default = 1
texture_height default = 1
```

At `1`, UV values behave like normalized coordinates. Setting actual image dimensions makes authored UVs work in texel-like units.

Do not assume texture pixel dimensions are auto-detected by JSON semantics when explicit atlas math matters.

---

## 8. Flipbook defaults

Current generated flipbook schema records:

```text
frames_per_second  default = 0
size_UV            default = [1, 1]
step_UV            default = [0, 0]
stretch_to_lifetime default = false
loop                default = false
base_UV             = not set
max_frame           = not set
```

Older descriptive documentation additionally clarifies:
- first frame is frame `1` for `max_frame` reasoning;
- `stretch_to_lifetime=true` adjusts playback timing to match particle lifetime.

Version note: generated `1.21.0` schema pages may omit explicit defaults even when the general component page lists them. Prefer the schema matching the target version when exact omission/default behavior matters.

---

## 9. Collision defaults and bounds

`minecraft:particle_motion_collision`

Current generated defaults:

```text
enabled                    = 1
coefficient_of_restitution = 0
collision_drag             = 0
expire_on_contact          = false
collision_radius           = not set
```

Collision event entries expose:

```text
event     = required reference
min_speed = 2
```

The older official component documentation states:
- `min_speed` default/minimum is 2 blocks/sec for event triggering;
- `collision_radius` must be less than or equal to 0.5 block;
- restitution `0` means no bounce, `1` approximately preserves bounce energy, values above `1` add energy.

Keep the older physical explanation as semantic guidance while using the current generated schema for target-version field shape/defaults.

---

## 10. Particle lifetime events

`minecraft:particle_lifetime_events`

Official lifecycle meanings:

```text
creation_event
→ fires when the particle is created

expiration_event
→ fires when the particle expires

timeline
→ keys are particle-relative times that trigger named events
```

Event values may be a string or an array of strings where supported.

Do not confuse particle timeline time with emitter loop time.

---

## 11. Emitter lifetime events

`minecraft:emitter_lifetime_events`

Official lifecycle meanings include:

```text
creation_event
expiration_event
timeline
```

For looping emitters, timeline events fire on each loop according to the emitter timeline semantics.

Some documentation/schema forms also expose travel-distance-driven event structures. Treat those as target-schema fields and verify the target version before authoring them.

---

## 12. Kill plane coordinate rule

`minecraft:particle_kill_plane`

Plane equation:

```text
A*x + B*y + C*z + D = 0
```

Official legacy documentation clarifies the plane is:
- relative to the emitter;
- oriented in world space.

This mixed relationship is easy to misread. Do not treat the kill plane as simply "fully local" or "fully world-positioned" without considering that documented distinction.

---

## 13. Linear curve default

For current generated `particle_curve_linear` schema:

```text
horizontal_range default = 1
input            = not set
nodes            = not set
type             = required by curve structure
```

Do not invent default nodes or input expressions.

---

## 14. `not set` is not zero

A recurring schema rule:

```text
Default Value = not set
```

means the field is absent unless authored. It does **not** authorize ChatGPT to silently substitute:

```text
0
false
[]
[0,0,0]
```

unless another official schema/document explicitly defines such a default.

This matters especially for:
- billboard size/facing mode;
- texture/UV regions;
- particle max lifetime;
- collision radius;
- event references;
- curve nodes/input;
- effect identifiers.

---

## 15. Generated-schema vs legacy-reference rule

Microsoft currently exposes both:
- newer generated schema/reference pages (2026);
- older hand-written component reference pages (commonly 2023).

Use them together:

```text
current generated schema
→ current field names, choices, shapes, explicit defaults

older hand-written reference
→ semantic explanation, evaluation timing, physical interpretation
```

If they conflict materially:
1. prefer the target-version generated schema for accepted JSON shape/defaults;
2. retain older prose only when it still explains semantics without contradicting the current schema;
3. mark uncertainty rather than inventing reconciliation;
4. validate in target Snowstorm/Minecraft when runtime behavior matters.

---

## 16. Official-default QA

Before delivering a particle that relies on omitted fields:

```text
[ ] confirm omission is intentional
[ ] confirm the official target schema defines the expected default
[ ] do not infer zero/false from "not set"
[ ] confirm per-frame vs one-time evaluation ownership
[ ] confirm event timeline uses the correct time owner
[ ] confirm billboard direction default is suitable for low-speed particles
[ ] confirm UV/flipbook defaults do not collapse an intended atlas animation
[ ] confirm collision event min-speed default is appropriate
[ ] confirm local-space omission is intentional for attached effects
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_local_space?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_lifetime_expression?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_lifetime_expression?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_appearance_billboard?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_appearance_billboard_flipbook_data?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_motion_collision_event?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_motion_collision?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_lifetime_events?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_lifetime_events?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_lifetime_kill-plane?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_curve_linear?view=minecraft-bedrock-stable
