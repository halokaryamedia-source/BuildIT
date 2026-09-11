# Directional Billboard Knowledge

This file owns direction-aware billboard orientation and version-sensitive direction settings beyond the general rendering overview.

## Evidence classes

- **OFFICIAL BEDROCK** — documented billboard modes/direction settings.
- **SNOWSTORM / WINTERSKY** — preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced project evidence.
- **HEURISTIC** — authoring guidance.

## Facing modes

Current official particle references expose modes including:

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

Check target-version support for less-common modes and verify Snowstorm support separately.

### Camera-facing

```text
lookat_xyz
lookat_y
rotate_xyz
rotate_y
```

Use when the sprite's job is primarily to face the viewer.

### Direction-derived

```text
lookat_direction
direction_x
direction_y
direction_z
```

Use only when a meaningful direction vector exists.

### Emitter-transform plane modes

```text
emitter_transform_xy
emitter_transform_xz
emitter_transform_yz
```

These derive billboard plane orientation from emitter transform and therefore depend on local/world transform ownership.

## Direction-settings schema delta

This area has an important official version/documentation discrepancy.

Older hand-written particle documentation describes an omitted direction subsection as behaving like:

```text
mode                = derive_from_velocity
min_speed_threshold = 0.01
```

and describes direction modes such as:

```text
derive_from_velocity
custom_direction
```

A newer generated `DirectionSettings` proxy instead exposes fields/choices conceptually as:

```text
custom_direction     = not set
min_speed_threshold  default = 0
mode                  = custom | derive_from_velocity
```

Do **not** merge these into one universal claim.

Authoring rule:

```text
direction subsection omitted
≠ automatically identical to
explicit direction object with omitted child fields
```

For exact JSON shape/defaults use the generated schema matching the target Bedrock version. Use older prose only for compatible semantic explanation.

This also means the string `custom_direction` may refer to a legacy mode description while newer generated schemas use `mode = custom` plus a separate `custom_direction` vector field.

## Directional axis semantics

`direction_x` aligns the billboard's unrotated X axis to the direction vector.

`direction_y` aligns the unrotated Y axis.

`direction_z` is a documented mode in current schema/reference inventories, but because billboard geometry is planar, verify its exact target-runtime/editor visual result before relying on it for critical art direction.

Texture rule:

```text
horizontal/streak sprite long axis X → direction_x is a natural starting point
vertical/streak sprite long axis Y   → direction_y is a natural starting point
```

Do not rotate production source art merely to compensate for a misunderstood direction mode.

## Direction source versus motion

Possible sources include:
- derived particle velocity;
- explicit custom direction;
- a direction maintained by parametric logic;
- another target-supported direction source.

Movement and billboard orientation are separate contracts. A particle can move along one trajectory while its billboard is oriented from another vector.

## Near-zero direction

Direction-derived modes become underdefined or visually unstable when the source vector approaches zero.

Risk cases:
- strong drag;
- ballistic apex;
- parametric tangent approaching zero;
- explicit `[0,0,0]` custom direction;
- threshold behavior differing by schema/version.

Mitigations:
- prefer camera-facing mode for soft non-directional sprites;
- keep a stable nonzero custom direction when appropriate;
- shorten lifetime before a prolonged stopped phase;
- reduce streak elongation near low speed;
- decompose ascending streak and falling debris when they need different orientation behavior.

## Apex behavior

A velocity-derived streak can flip or become weak near ballistic apex as vertical velocity crosses zero. Do not hide this by unstable class switching.

Prefer a causal fix:

```text
wrong physics role → split layers
wrong orientation source → change direction contract
excessive visual flip → reduce aspect ratio / low-speed exposure
```

## Emitter-transform modes

When using `emitter_transform_xy/xz/yz`, debug in this order:

```text
emitter transform
→ emitter local-space position/rotation
→ selected transform plane
→ entity/locator transform if attached
→ target editor/runtime comparison
```

Emitter-transform billboard modes should not be debugged as texture rotation problems first.

## Aspect ratio and readability

Long directional sprites amplify orientation errors. Tune:
- length/width ratio;
- particle speed;
- target view distance;
- texture edge softness;
- low-speed lifetime portion.

A speed-correlated length heuristic is possible only if a reliable speed-like quantity exists in the expression context:

```text
length = clamp(base + speed * scale, min_length, max_length)
```

Do not invent a speed query unavailable to the particle context.

## Snowstorm / Wintersky boundary

Snowstorm may lag current Bedrock schema support or implement a mode differently. For mismatch:
1. one particle;
2. constant nonzero direction/velocity;
3. simple size and static UV;
4. confirm sprite long axis;
5. confirm target-version mode spelling/shape;
6. compare Snowstorm release;
7. compare Minecraft runtime when material.

Preview differences remain Snowstorm-specific until proven otherwise.

## QA

```text
[ ] facing mode exists in target Bedrock schema
[ ] direction-settings mode spelling matches target schema
[ ] omitted direction block is not confused with an explicit block using defaults
[ ] min_speed_threshold assumption is target-version sourced
[ ] custom direction is nonzero when required
[ ] sprite long axis matches directional-axis intent
[ ] low-speed/apex behavior is intentional
[ ] emitter-transform modes have correct transform ownership
[ ] Snowstorm behavior is not treated as generic Bedrock validity
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_appearance_billboard?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_appearance_billboard?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
