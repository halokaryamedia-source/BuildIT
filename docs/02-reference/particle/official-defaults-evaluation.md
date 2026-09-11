# Official Particle Defaults and Evaluation Semantics

Purpose: record current official Bedrock defaults, omission semantics, evaluation timing, and version-sensitive deltas that are easy to lose in high-level component summaries.

Evidence class: **OFFICIAL BEDROCK** unless marked otherwise.

Use with:

```text
component-catalog.md
→ component discovery

component-field-reference.md
→ field purpose / ownership / failure modes

official-schema-coverage.md
→ family-level closure audit

THIS FILE
→ defaults / omission / evaluation timing / version deltas
```

Never infer zero, false, empty array, or zero vector from `not set`.

## Authority rule

Microsoft currently exposes newer generated schema/reference pages alongside older hand-written semantic docs.

Use:

```text
target-version generated schema
→ accepted JSON shape, unions, enum strings, explicit defaults

older official prose
→ semantic/evaluation explanation only when compatible
```

If they conflict, do not average or invent a third behavior. Record the discrepancy and use the target-version schema for authoring.

---

## Emitter local space

`minecraft:emitter_local_space`

```text
position default = false
rotation default = false
```

Official semantic rules:
- `rotation=true` with `position=false` is invalid;
- `velocity=true` adds emitter velocity to initial particle velocity;
- without local position/rotation, particles are emitted from the emitter then simulate independently in world space.

Check local-space ownership before diagnosing trajectory/attachment drift.

---

## Emitter initialization

`minecraft:emitter_initialization`

Current generated defaults:

```text
creation_expression   default = 0
per_update_expression default = 0
```

Older official prose clarifies:
- `creation_expression` evaluates once when the emitter starts;
- `per_update_expression` evaluates once per emitter update.

Do not use `per_update_expression` when a one-time sampled emitter choice is intended.

---

## Emitter rate deltas

### Instant

Current generated `minecraft:emitter_rate_instant` schema records:

```text
num_particles = not set
```

Older hand-written documentation described a default of `10` and one evaluation per emitter loop.

**Version delta:** do not assume `10` when authoring for a current generated schema that says `not set`.

### Steady

Current generated schema records:

```text
spawn_rate    = not set
max_particles = not set
```

### Manual

Current generated schema exposes:

```text
max_particles = not set
```

Manual emission still requires a real downstream/manual owner; absence of rate fields is not permission to invent one.

---

## Emitter lifetime deltas

### Expression

```text
activation_expression default = 1
expiration_expression default = 0
```

Both are frame-evaluated.

### Looping

Current generated schema records:

```text
active_time default = 0
sleep_time  default = 0
```

Older hand-written docs described:

```text
active_time default = 10
sleep_time  default = 0
```

and described both as evaluated once per emitter loop.

**Version delta:** target generated schema wins for omission/default behavior.

### Once

Older hand-written docs describe `active_time` default `10` and one evaluation. Do not claim that as the current generated-schema default unless the target-version schema explicitly confirms it.

---

## Particle lifetime expression

`minecraft:particle_lifetime_expression`

```text
expiration_expression default = 0
max_lifetime             = not implicitly authored / target-schema required
```

Evaluation distinction:

```text
max_lifetime
→ evaluated once for the particle

expiration_expression
→ evaluated continuously; nonzero expires the particle
```

Changing external state in `max_lifetime` does not make the lifetime continuously reactive.

---

## Particle initialization

Current generated schema exposes:

```text
per_update_expression default = 0
per_render_expression default = 0
```

These names describe ongoing evaluation stages. Do not describe the whole component as birth-only initialization.

---

## Particle initial spin

`minecraft:particle_initial_spin`

Current generated defaults:

```text
rotation      default = 0
rotation_rate default = 0
```

Older semantic docs clarify both are evaluated once for initial state; rotation is degrees and rotation rate is degrees/second.

---

## Emitter shape defaults

### Point

```text
offset    default = [0,0,0]
direction = not set
```

Older semantics describe position/direction expressions as evaluated per emitted particle.

### Disc

```text
offset       default = [0,0,0]
plane_normal default = [0,1,0]
radius       default = 1
surface_only default = false
direction    = not set
```

### Sphere

```text
offset       default = [0,0,0]
radius       default = 1
surface_only default = false
direction    = not set
```

### Box

```text
offset          default = [0,0,0]
half_dimensions = not set
surface_only    default = false
direction       = not set
```

### Entity AABB

```text
surface_only default = false
direction    = not set
```

### Custom

```text
offset    default = [0,0,0]
direction default = [0,0,0]
```

Explicit zero vector and omitted direction are distinct authoring states.

---

## Parametric motion

Current generated `minecraft:particle_motion_parametric` uses:

```text
relative_position
direction
rotation
```

with fields represented as target-schema values/not-set forms. The current field name is `direction`, not legacy/guessed `relative_direction`.

---

## Billboard direction version delta

Older hand-written docs describe omitted direction settings as:

```text
mode                = derive_from_velocity
min_speed_threshold = 0.01
```

and describe a custom mode as `custom_direction`.

Newer generated DirectionSettings schema instead exposes:

```text
mode choices        = custom | derive_from_velocity
custom_direction    = not set
min_speed_threshold default = 0
```

Do not merge these representations.

Key distinction:

```text
entire direction block omitted
may have documented legacy fallback semantics

explicit direction object
uses the target-version child-field schema/defaults
```

Use `billboard-direction.md` for the full authoring rule.

---

## Billboard UV / flipbook defaults

Billboard UV:

```text
texture_width  default = 1
texture_height default = 1
```

At `1`, UV values operate in normalized-style coordinates; explicit image dimensions allow texel-oriented atlas mapping.

Current generated flipbook defaults include:

```text
frames_per_second   default = 0
size_UV             default = [1,1]
step_UV             default = [0,0]
stretch_to_lifetime default = false
loop                default = false
base_UV              = not set
max_frame            = not set
```

Older semantic docs clarify lifetime stretching and frame interpretation. Use target schema for exact indexing/omission behavior.

---

## Tinting / gradient schema

`minecraft:particle_appearance_tinting`

Current generated schema exposes `color = not set` and supports target-schema forms including:

```text
hex color string
RGB/RGBA value/Molang array
gradient object
```

Gradient object fields include:

```text
gradient
interpolant
```

with `interpolant = not set` unless explicitly authored in the current schema form.

Gradient can be represented by evenly-spaced color arrays or keyed-position maps where the target schema permits it.

### Hex alpha-order discrepancy

Older and newer official examples/documentation can differ in how 8-digit hex ordering is presented (for example alpha-first versus alpha-last conventions in different pages/generations).

Do **not** normalize this by memory. For 8-digit hex, follow the target-version generated schema/examples or prefer explicit RGBA arrays when ambiguity would matter.

---

## Collision defaults and limits

Current generated `minecraft:particle_motion_collision` defaults:

```text
enabled                    default = 1
coefficient_of_restitution default = 0
collision_drag             default = 0
expire_on_contact          default = false
collision_radius           = not set
```

Collision event entries:

```text
event     = required/reference
min_speed default = 2
```

Older official prose states:
- collision radius should be <= 0.5 block;
- restitution 0 means no bounce; ~1 preserves bounce energy; >1 adds energy.

Use current schema for accepted fields/defaults and older prose for compatible physical interpretation.

---

## Event-node defaults

Current generated event-node schema records:

```text
expression      default = 0
log             default = ""
particle_effect default = {"effect":"","pre_effect_expression":0,"type":null}
randomize       = not set
sequence        = not set
sound_effect    = not set
```

Randomized child nodes expose explicit `weight`; do not infer a particle-event weight default when the particle schema does not document it.

---

## Particle lifetime events

Semantic ownership:

```text
creation_event   → particle birth
expiration_event → particle death
timeline         → particle-relative time
```

String/array event-value unions can be target-schema dependent. Use the target generated schema for exact shape.

---

## Emitter lifetime events and distance triggers

Current generated forms expose:

```text
creation_event                 default = [] in array form
expiration_event               default = [] in array form
timeline                       default = {}
travel_distance_events         default = {}
looping_travel_distance_events default = []
```

Alternate string/union branches may show `not set`; do not copy documentation-generator union artifacts as literal required JSON.

Semantics:
- `creation_event` fires on emitter creation;
- `expiration_event` fires when the emitter expires and does not wait for living particles to finish;
- `timeline` is emitter-relative and repeats according to emitter-loop semantics;
- `travel_distance_events` use accumulated emitter movement thresholds;
- `looping_travel_distance_events` repeat every authored travel interval from the previous firing.

Looping distance entries can expose:

```text
distance = not set
effects  = not set (string/array union by schema)
```

---

## Kill plane

Plane equation:

```text
A*x + B*y + C*z + D = 0
```

Older official semantics describe the plane as relative to the emitter while oriented in world space. Preserve this mixed coordinate relationship; do not reduce it to simply local or simply world space.

---

## Curves / defaults

Current generated linear curve:

```text
horizontal_range default = 1
input            = not set
nodes            = not set
```

Older semantic docs mark `horizontal_range` optional/deprecated and state it is ignored for `bezier_chain`.

Do not invent nodes/input.

---

## `not set` rule

`Default Value = not set` means the field is absent unless authored. It does not authorize substitution with:

```text
0
false
""
[]
{}
[0,0,0]
```

unless another official target-schema rule explicitly defines that default.

Fields where this distinction is especially important:
- lifetime values;
- direction/custom direction;
- collision radius;
- UV regions;
- curve nodes/input;
- event/effect references;
- shape dimensions.

---

## Official-default QA

```text
[ ] target Bedrock schema/version identified when exact defaults matter
[ ] omitted field versus explicit zero/false distinguished
[ ] generated schema versus legacy prose discrepancies recorded
[ ] one-time versus per-update/per-render evaluation confirmed
[ ] emitter time, particle time, distance, and collision timing not mixed
[ ] billboard direction mode/default spelling follows target schema
[ ] 8-digit tint hex ordering is not guessed
[ ] rate/lifetime legacy defaults are not carried into newer `not set` schemas
[ ] flipbook/UV defaults do not silently collapse intended animation
[ ] collision min-speed/radius assumptions are target-sourced
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_local_space?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_lifetime_expression?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_lifetime_expression?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_appearance_billboard?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_appearance_tinting?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_motion_collision?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftemitter_lifetime_events?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_lifetime_events?view=minecraft-bedrock-stable
