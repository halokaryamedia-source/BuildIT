# Official Bedrock Particle Schema Coverage Audit

This file is the closure audit for canonical Particle Reference Authoring knowledge. It tracks whether every major official Bedrock particle document/component family has an explicit owner in this domain.

Evidence class: **OFFICIAL BEDROCK** for schema/component coverage. Coverage status is repository-maintenance metadata, not runtime proof.

## Coverage states

```text
COVERED
→ dedicated owner exists and practical semantics are documented

COVERED / VERSION-SENSITIVE
→ owner exists; exact target-version schema/query behavior still matters

TARGET-SPECIFIC
→ generic Bedrock knowledge exists but Snowstorm/Wintersky behavior is separate

NOT RUNTIME-PROVEN
→ static/document knowledge exists but visual/runtime behavior still requires target review
```

## 1. Particle document

| Area | Owner | Status |
|---|---|---|
| `format_version` / document shape | `fundamentals.md` | COVERED |
| `description.identifier` | `component-field-reference.md` | COVERED |
| render material | `appearance-rendering.md` | COVERED |
| texture path | `texture-authoring.md` | COVERED |
| `components` object | `component-catalog.md` | COVERED |
| `curves` | `curves.md` | COVERED |
| `events` | `events.md` | COVERED |

## 2. Emitter state / space

| Component | Owner | Status |
|---|---|---|
| `minecraft:emitter_local_space` | `lifecycle-space.md`, `entity-integration.md` | COVERED |
| `minecraft:emitter_initialization` | `emitter.md`, `official-defaults-evaluation.md` | COVERED |

Owned transform concerns:
- position inheritance;
- rotation inheritance;
- velocity inheritance;
- animated bone/locator transform stack;
- fire-and-forget vs bound behavior;
- emitter-transform billboard plane interaction.

## 3. Emitter rate

| Component | Owner | Status |
|---|---|---|
| `minecraft:emitter_rate_instant` | `emitter.md`, `official-defaults-evaluation.md` | COVERED / VERSION-SENSITIVE |
| `minecraft:emitter_rate_steady` | `emitter.md`, `performance.md` | COVERED |
| `minecraft:emitter_rate_manual` | `emitter.md` | COVERED / VERSION-SENSITIVE |

Legacy defaults are not carried into newer generated schemas when the target schema says `not set`.

## 4. Emitter lifetime

| Component | Owner | Status |
|---|---|---|
| `minecraft:emitter_lifetime_once` | `emitter.md`, `official-defaults-evaluation.md` | COVERED / VERSION-SENSITIVE |
| `minecraft:emitter_lifetime_looping` | `emitter.md`, `event-timing.md` | COVERED / VERSION-SENSITIVE |
| `minecraft:emitter_lifetime_expression` | `emitter.md`, `molang.md` | COVERED |
| `minecraft:emitter_lifetime_events` | `events.md`, `event-timing.md` | COVERED |

Emitter lifetime events cover:

```text
creation_event
expiration_event
timeline
travel_distance_events
looping_travel_distance_events
```

where exposed by the target schema.

## 5. Emitter shapes

| Component | Owner | Status |
|---|---|---|
| point | `emitter.md` | COVERED |
| sphere | `emitter.md`, `emitter-shape-math.md` | COVERED |
| box | `emitter.md` | COVERED |
| disc | `emitter.md`, `emitter-shape-math.md` | COVERED |
| entity AABB | `emitter.md`, `entity-integration.md` | COVERED |
| custom | `emitter-shape-math.md`, `math-physics-reference.md` | COVERED |

Cross-cutting fields such as `offset`, `direction`, `surface_only`, `radius`, `half_dimensions`, and `plane_normal` are owned by `component-field-reference.md` + `official-defaults-evaluation.md`.

## 6. Particle initialization / initial state

| Component | Owner | Status |
|---|---|---|
| `minecraft:particle_initialization` | `lifecycle-space.md`, `molang.md` | COVERED |
| `minecraft:particle_initial_speed` | `motion.md`, `snowstorm.md` | COVERED + TARGET-SPECIFIC |
| `minecraft:particle_initial_spin` | `component-field-reference.md`, `official-defaults-evaluation.md` | COVERED |

Spin knowledge explicitly separates:

```text
rotation
rotation_rate
rotation_acceleration
rotation_drag_coefficient
```

## 7. Particle motion

| Component | Owner | Status |
|---|---|---|
| dynamic motion | `motion.md`, `math-physics-reference.md` | COVERED |
| parametric motion | `motion.md`, `molang-formula-cookbook.md` | COVERED |
| collision | `collision-advanced.md` | COVERED / NOT RUNTIME-PROVEN |

Collision remains runtime-sensitive for geometry contact, high-speed tunneling, repeated contact, and editor/runtime parity.

## 8. Environmental expiration

| Component | Owner | Status |
|---|---|---|
| `minecraft:particle_expire_if_in_blocks` | `component-field-reference.md` | COVERED |
| `minecraft:particle_expire_if_not_in_blocks` | `component-field-reference.md` | COVERED |
| `minecraft:particle_kill_plane` | `motion.md`, `component-field-reference.md` | COVERED |

Knowledge now explicitly covers block-list semantics, allow-list semantics, coexistence with lifetime expiration, kill-plane math, and the fact that multiple kill paths may coexist.

## 9. Particle lifetime

| Component | Owner | Status |
|---|---|---|
| lifetime expression | `fundamentals.md`, `molang.md`, `official-defaults-evaluation.md` | COVERED |
| lifetime events | `events.md`, `event-timing.md` | COVERED |

One-time `max_lifetime` and continuous `expiration_expression` semantics are explicitly separated.

## 10. Particle appearance

| Component | Owner | Status |
|---|---|---|
| billboard | `appearance-rendering.md`, `billboard-direction.md` | COVERED |
| tinting | `appearance-rendering.md`, `texture-color-science.md` | COVERED |
| lighting | `appearance-rendering.md` | COVERED / NOT RUNTIME-PROVEN |

## 11. Billboard facing modes

Canonical knowledge recognizes target-version modes including:

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

Status: **COVERED / VERSION-SENSITIVE** for less common modes and editor parity.

## 12. Billboard direction settings

Owned fields/semantics include:

```text
mode
custom_direction
min_speed_threshold
```

Legacy and generated-schema naming/default differences are tracked in `official-defaults-evaluation.md` rather than merged.

## 13. UV / flipbook

Covered:

```text
texture_width
texture_height
uv
uv_size
base_UV
size_UV
step_UV
frames_per_second
max_frame
stretch_to_lifetime
loop
```

Owners:
- `texture-authoring.md`;
- `texture-resolution-sampling.md`;
- `texture-filtering-bleeding.md`.

Status: **COVERED / VERSION-SENSITIVE** where exact indexing/default semantics differ by schema generation.

## 14. Materials / transparency

Covered:

```text
particles_opaque
particles_alpha
particles_blend
particles_add
```

Status: **COVERED** for authoring intent. Exact internal shader equations are intentionally not claimed.

## 15. Tint / gradient

Covered forms:

```text
#RRGGBB
#RRGGBBAA
RGB/RGBA numeric or Molang arrays
gradient + interpolant
evenly spaced gradient data
keyed-position gradient data
```

Owners:
- `appearance-rendering.md`;
- `texture-color-science.md`;
- `official-defaults-evaluation.md` for version/hex-order discrepancies.

Status: **COVERED / VERSION-SENSITIVE** for legacy 8-digit hex ordering examples and exact union shapes.

## 16. Curves

Covered:

```text
linear
bezier
bezier_chain
catmull_rom
```

`curves.md` now owns:
- even-node linear semantics;
- cubic four-node Bezier semantics;
- keyed Bezier-chain positions;
- value/slope/tangent field families;
- Catmull-Rom endpoint/control behavior;
- `horizontal_range` legacy/deprecation semantics.

Status: **COVERED / VERSION-SENSITIVE** for exact target-schema node unions.

## 17. Events

Covered event-node concepts:

```text
expression
log
particle_effect
randomize
sequence
sound_effect
```

Visual-effect relationship types:

```text
emitter
emitter_bound
particle
particle_with_velocity
```

Timing domains:

```text
emitter time
particle time
travel distance
collision
```

Status: **COVERED / NOT RUNTIME-PROVEN FOR COMPLEX CHAINS**.

## 18. Molang particle state

Documented particle-system built-ins are inventoried in `particle-variable-inventory.md`.

Molang language/math coverage now includes:
- syntax/operators;
- aliases/case rules;
- loops/return/null-coalescing;
- actor-reference operator;
- current math/easing families;
- evaluation-stage ownership;
- target-version feature checking.

## 19. Query / context availability

`molang-queries-context.md` owns:
- host-dependent query availability;
- minimum-version query notes;
- continuous vs sampled reads;
- actor/reference lifetime;
- client/context restrictions;
- Snowstorm parser support vs Minecraft host support.

Status: **COVERED / VERSION-SENSITIVE / HOST-SENSITIVE**.

Generic query availability cannot be made universally static because Minecraft documents capabilities at the individual query/context level.

## 20. Math / formula layer

Owners:

```text
molang-language-math.md
molang-formula-cookbook.md
math-physics-reference.md
emitter-shape-math.md
```

Coverage includes language math, reusable formulas, vectors, projections, distributions, ballistics, probability, and custom direction math.

Status: **COVERED** for authoring reasoning; exact runtime numerical integration remains runtime-owned.

## 21. Texture production

Owners:

```text
texture-authoring.md
texture-filtering-bleeding.md
texture-color-science.md
texture-resolution-sampling.md
```

Coverage includes RGBA, hidden RGB, matte/halo, atlas/gutter, UV/flipbook, pixel-art vs soft resampling, tint compatibility, additive/blend value design, resolution/downscale, and frame stability.

Status: **COVERED / VISUAL ACCEPTANCE REQUIRED**.

## 22. Entity / locator integration

`entity-integration.md` covers:
- effect mapping;
- locator/bone transform stack;
- position/rotation/velocity local-space ownership;
- emitter-transform billboards;
- fire-and-forget vs bound effects;
- pre-effect sampling;
- query/reference lifetime;
- child binding/velocity inheritance.

Status: **COVERED AT REFERENCE BOUNDARY / LIVE BINDING NOT RUNTIME-PROVEN**.

## 23. Snowstorm / Wintersky

Owners:

```text
snowstorm.md
snowstorm-version-quirks.md
```

Status: **TARGET-SPECIFIC**. Editor workarounds never redefine generic Bedrock validity.

## 24. Performance

`performance.md` covers population estimates, caps, overdraw, event fan-out, collision/Molang/parametric complexity, and distance-aware budgeting.

Status: **STATIC HEURISTIC ONLY**. No FPS claim without actual device/runtime measurement.

## 25. Closure findings

Current canonical knowledge has an explicit owner for all major component families in the current stable Bedrock particle document model plus the practical math, texture, Molang, attachment, and editor boundaries needed for professional authoring.

Remaining uncertainty is intentionally limited to runtime- or version-owned facts:

```text
future Bedrock fields/components
individual query minimum-version changes
host-specific query exposure
exact runtime numerical integration
complex collision geometry behavior
editor-version preview regressions
platform/GPU performance
final visual quality
```

These are evidence boundaries, not missing-framework problems.

## 26. Maintenance rule

When Microsoft Creator documentation changes:

```text
1. compare component/field list against this audit
2. check generated target-version schema before legacy prose
3. identify changed default/union/enum/evaluation semantics
4. update the nearest existing canonical owner
5. update component-field-reference.md when field behavior changed
6. update official-defaults-evaluation.md when omission/default changed
7. update Snowstorm docs only for editor-specific compatibility
8. do not create another generic particle knowledge tree
```

## Core official sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlelist?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/syntax-guide?view=minecraft-bedrock-stable
