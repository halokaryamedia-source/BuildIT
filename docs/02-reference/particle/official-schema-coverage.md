# Official Bedrock Particle Schema Coverage Audit

This file is the closure audit for canonical Particle Reference Authoring knowledge. It tracks whether every major official Bedrock particle document/component family has an explicit owner in this domain.

Evidence class: **OFFICIAL BEDROCK** for schema/component coverage. Coverage status is repository-maintenance metadata, not runtime proof.

## Coverage states

```text
COVERED
→ dedicated owner exists and current practical semantics are documented

COVERED / EDGE CASES CONDITIONAL
→ owner exists; exact target-version behavior may still require checking current official schema or runtime

TARGET-SPECIFIC
→ generic Bedrock knowledge exists but Snowstorm/Wintersky behavior is intentionally separate

NOT RUNTIME-PROVEN
→ static/document knowledge exists but visual/runtime behavior still requires target review
```

## 1. Particle document

| Area | Owner | Status |
|---|---|---|
| `format_version` / particle document shape | `fundamentals.md` | COVERED |
| `description.identifier` | `component-field-reference.md` | COVERED |
| `basic_render_parameters.material` | `appearance-rendering.md`, `component-field-reference.md` | COVERED |
| `basic_render_parameters.texture` | `texture-authoring.md`, `component-field-reference.md` | COVERED |
| `components` object | `component-catalog.md` | COVERED |
| `curves` | `curves.md` | COVERED |
| `events` | `events.md` | COVERED |

## 2. Emitter state / space

| Component | Owner | Status |
|---|---|---|
| `minecraft:emitter_local_space` | `lifecycle-space.md`, `component-field-reference.md` | COVERED |
| `minecraft:emitter_initialization` | `emitter.md`, `lifecycle-space.md` | COVERED |

Important local-space concerns already owned:
- position inheritance;
- rotation inheritance;
- velocity inheritance;
- entity attachment interpretation;
- world/local debugging order.

## 3. Emitter rate

| Component | Owner | Status |
|---|---|---|
| `minecraft:emitter_rate_instant` | `emitter.md` | COVERED |
| `minecraft:emitter_rate_steady` | `emitter.md`, `performance.md` | COVERED |
| `minecraft:emitter_rate_manual` | `emitter.md` | COVERED / EDGE CASES CONDITIONAL |

Manual-rate use depends on the downstream trigger/runtime context and should not be invented when no manual owner exists.

## 4. Emitter lifetime

| Component | Owner | Status |
|---|---|---|
| `minecraft:emitter_lifetime_once` | `emitter.md` | COVERED |
| `minecraft:emitter_lifetime_looping` | `emitter.md`, `event-timing.md` | COVERED |
| `minecraft:emitter_lifetime_expression` | `emitter.md`, `molang.md` | COVERED |
| `minecraft:emitter_lifetime_events` | `events.md`, `event-timing.md` | COVERED |

## 5. Emitter shapes

| Component | Owner | Status |
|---|---|---|
| `minecraft:emitter_shape_point` | `emitter.md` | COVERED |
| `minecraft:emitter_shape_sphere` | `emitter.md`, `emitter-shape-math.md` | COVERED |
| `minecraft:emitter_shape_box` | `emitter.md` | COVERED |
| `minecraft:emitter_shape_disc` | `emitter.md`, `emitter-shape-math.md` | COVERED |
| `minecraft:emitter_shape_entity_aabb` | `emitter.md`, `entity-integration.md` | COVERED |
| `minecraft:emitter_shape_custom` | `emitter-shape-math.md`, `math-physics-reference.md` | COVERED |

Cross-cutting shape fields:

```text
offset
direction
surface_only
radius
half_dimensions
plane_normal
```

Field-specific ownership is in `component-field-reference.md`.

## 6. Particle initialization / initial state

| Component | Owner | Status |
|---|---|---|
| `minecraft:particle_initialization` | `lifecycle-space.md`, `molang.md` | COVERED |
| `minecraft:particle_initial_speed` | `motion.md`, `snowstorm.md` | COVERED + TARGET-SPECIFIC |
| `minecraft:particle_initial_spin` | `motion.md`, `component-field-reference.md` | COVERED |

Bedrock validity and Snowstorm/Wintersky scalar/vector interpretation remain deliberately separate.

## 7. Particle motion

| Component | Owner | Status |
|---|---|---|
| `minecraft:particle_motion_dynamic` | `motion.md`, `math-physics-reference.md` | COVERED |
| `minecraft:particle_motion_parametric` | `motion.md`, `molang-formula-cookbook.md` | COVERED |
| `minecraft:particle_motion_collision` | `collision-advanced.md` | COVERED / EDGE CASES CONDITIONAL |

Collision remains runtime-sensitive for high-speed contact, geometry interaction, repeated contact and editor/runtime parity.

## 8. Particle environmental expiration

| Component | Owner | Status |
|---|---|---|
| `minecraft:particle_expire_if_in_blocks` | `component-catalog.md`, `component-field-reference.md` | COVERED |
| `minecraft:particle_expire_if_not_in_blocks` | `component-catalog.md`, `component-field-reference.md` | COVERED |
| `minecraft:particle_kill_plane` | `motion.md`, `component-field-reference.md` | COVERED |

## 9. Particle lifetime

| Component | Owner | Status |
|---|---|---|
| `minecraft:particle_lifetime_expression` | `fundamentals.md`, `molang.md` | COVERED |
| `minecraft:particle_lifetime_events` | `events.md`, `event-timing.md` | COVERED |

## 10. Particle appearance

| Component | Owner | Status |
|---|---|---|
| `minecraft:particle_appearance_billboard` | `appearance-rendering.md`, `billboard-direction.md` | COVERED |
| `minecraft:particle_appearance_tinting` | `appearance-rendering.md`, `texture-color-science.md` | COVERED |
| `minecraft:particle_appearance_lighting` | `appearance-rendering.md` | COVERED / EDGE CASES CONDITIONAL |

Lighting behavior is rendering context, not emitted world light.

## 11. Billboard facing modes

Current official particle schema/reference exposes multiple facing modes. Canonical knowledge must recognize at least:

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

Owner:

```text
appearance-rendering.md
billboard-direction.md
component-field-reference.md
```

Status: **COVERED / VERSION CHECK RECOMMENDED FOR LESS COMMON MODES**.

Do not assume every editor version previews every official mode identically.

## 12. Billboard UV and flipbook

| Area | Owner | Status |
|---|---|---|
| `texture_width` / `texture_height` | `texture-authoring.md`, `texture-resolution-sampling.md` | COVERED |
| static UV | `texture-authoring.md` | COVERED |
| `uv_size` | `texture-authoring.md` | COVERED |
| `base_UV` | `texture-authoring.md` | COVERED |
| `size_UV` | `texture-authoring.md` | COVERED |
| `step_UV` | `texture-authoring.md` | COVERED |
| `frames_per_second` | `texture-authoring.md` | COVERED |
| `max_frame` | `texture-authoring.md` | COVERED / SCHEMA CHECK WHEN EXACT INDEX SEMANTICS MATTER |
| `stretch_to_lifetime` | `texture-authoring.md` | COVERED |
| `loop` | `texture-authoring.md` | COVERED |

## 13. Materials / transparency

Canonical materials covered:

```text
particles_opaque
particles_alpha
particles_blend
particles_add
```

Owners:
- `appearance-rendering.md`;
- `texture-authoring.md`;
- `texture-color-science.md`;
- `texture-resolution-sampling.md`.

Status: **COVERED** for authoring intent; exact shader/runtime internals are intentionally not claimed.

## 14. Tint / gradient

Covered forms:

```text
hex/static color
RGBA arrays / Molang channels
gradient + interpolant
```

Owners:
- `appearance-rendering.md`;
- `texture-color-science.md`;
- `molang.md`.

Status: **COVERED**.

## 15. Curves

Covered curve families:

```text
linear
Bezier
Bezier chain
Catmull-Rom
```

Owners:
- `curves.md`;
- `molang-language-math.md` for expression inputs.

Status: **COVERED**.

## 16. Events

Covered event node concepts:

```text
expression
sequence
randomize
sound_effect
particle_effect
log where schema exposes it
```

Covered particle-effect relationship types:

```text
emitter
emitter_bound
particle
particle_with_velocity
```

Owners:
- `events.md`;
- `event-timing.md`;
- `performance.md` for fan-out cost.

Status: **COVERED / RUNTIME REVIEW FOR COMPLEX CHAINS**.

## 17. Molang particle state

Canonical built-in particle-system variables are inventoried in `particle-variable-inventory.md`:

```text
emitter_age
emitter_lifetime
emitter_random_1..4
particle_age
particle_lifetime
particle_random_1..4
```

Generic query/context behavior belongs to `molang-queries-context.md`.

Status: **COVERED** for documented particle-owned built-ins; generic query availability remains host/context specific.

## 18. Math / formula layer

Owners:

```text
molang-language-math.md
→ language + official math functions

molang-formula-cookbook.md
→ reusable particle expressions

math-physics-reference.md
→ vector/geometry/physics/distribution reasoning

emitter-shape-math.md
→ shape-specific position/direction math
```

Status: **COVERED** for authoring math; exact runtime numerical integration remains runtime-owned.

## 19. Texture production

Owners:

```text
texture-authoring.md
texture-filtering-bleeding.md
texture-color-science.md
texture-resolution-sampling.md
```

Coverage includes:
- RGBA transparency;
- hidden RGB;
- matte/halo risk;
- atlas layout;
- cell mapping;
- gutter;
- UV/flipbook;
- pixel-art vs soft resampling;
- tint compatibility;
- additive/blend value design;
- resolution/downscale reasoning.

Status: **COVERED / VISUAL ACCEPTANCE STILL REQUIRED**.

## 20. Snowstorm / Wintersky

Owners:

```text
snowstorm.md
snowstorm-version-quirks.md
```

Coverage includes editor boundary, release-specific regression classification, vector-speed compatibility finding, emitter-age class instability finding, nested preview caveats and minimal reproduction.

Status: **TARGET-SPECIFIC / NOT GENERIC BEDROCK VALIDITY**.

## 21. Entity / locator integration

Owner: `entity-integration.md`.

Coverage includes mapping, locators, animation/controller triggers, local transform expectations, fire-and-forget vs sustained effects.

Status: **COVERED AT REFERENCE BOUNDARY**. Live binding remains downstream/runtime proof.

## 22. Performance

Owner: `performance.md`.

Coverage includes:
- rate × lifetime population estimate;
- max-particle cap;
- event fan-out;
- collision/Molang/parametric complexity;
- translucent overdraw;
- distance-aware budgeting.

Status: **STATIC HEURISTIC ONLY**. No FPS claims without device/runtime measurement.

## 23. Closure findings

Current canonical knowledge has an explicit owner for all major official Bedrock particle component families used by the current stable particle document model.

Remaining uncertainty is intentionally limited to:

```text
new fields/components introduced by future Bedrock versions
exact runtime numerical integration details
editor-version preview differences
host-specific Molang query exposure
complex collision/runtime geometry behavior
platform/GPU performance
final visual quality
```

These are not reasons to add a parallel framework.

## 24. Maintenance rule

When Minecraft Creator documentation changes:

```text
1. compare official component/field list against this audit
2. identify new/changed field
3. update the existing canonical owner
4. update component-field-reference.md when field semantics changed
5. update Snowstorm docs only if editor compatibility differs
6. do not create another generic particle knowledge tree
```

## Core official sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlelist?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/syntax-guide?view=minecraft-bedrock-stable
