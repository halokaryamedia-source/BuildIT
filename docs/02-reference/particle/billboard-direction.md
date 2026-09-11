# Directional Billboard Knowledge

This file owns directional billboard orientation, edge cases, and authoring decisions beyond the general rendering overview.

## Evidence classes

- **OFFICIAL BEDROCK** — documented billboard modes and direction fields.
- **SNOWSTORM / WINTERSKY** — preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced project evidence.
- **HEURISTIC** — authoring guidance.

## 1. Facing modes

**OFFICIAL BEDROCK**

Current official particle reference exposes these facing-camera choices:

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

Treat less-common modes as schema-valid only for the Bedrock version that documents them, and verify Snowstorm support separately.

### General camera-facing modes

```text
lookat_xyz
lookat_y
rotate_xyz
rotate_y
```

Use for smoke, explosions, mist, fire and other sprites whose primary job is to face the viewer rather than express a motion axis.

### Direction-derived modes

```text
lookat_direction
direction_x
direction_y
direction_z
```

Use when the sprite must orient from an authored/current direction vector.

### Emitter-transform plane modes

```text
emitter_transform_xy
emitter_transform_xz
emitter_transform_yz
```

These bind billboard orientation to a plane derived from the emitter transform rather than ordinary camera-facing behavior. They are useful for effects that should inherit an emitter-relative plane, but they are more context-sensitive than ordinary camera-facing sprites.

## 2. Directional axis semantics

`direction_x` means the billboard's unrotated X axis follows the direction vector.

`direction_y` means the billboard's unrotated Y axis follows the direction vector.

`direction_z` aligns the billboard's local Z orientation according to the documented direction-mode contract. Because a billboard is fundamentally a planar render primitive, verify the exact visual result in the target Bedrock/editor version before relying on `direction_z` for critical art direction.

This matters for texture authorship:
- a spark drawn left-to-right usually maps naturally to `direction_x`;
- a streak drawn bottom-to-top may map naturally to `direction_y`;
- unusual orientation requirements should be tested with a single constant-direction particle before adding complex motion.

Choose orientation based on the sprite's intrinsic axis, not by trial-and-error only.

## 3. `lookat_direction`

`lookat_direction` is distinct from ordinary camera-facing modes. It uses direction-oriented appearance behavior rather than simply rotating the sprite to the camera.

Use it only when the effect genuinely needs direction-aware facing. If a soft smoke sprite does not visually benefit from a direction vector, prefer a simpler camera-facing mode.

## 4. Direction source

Directional appearance only works well when the authored direction is meaningful.

Possible conceptual sources:
- current particle velocity;
- a custom authored direction vector;
- emitter/shape launch direction;
- parametric tangent direction.

Do not assume movement and orientation are always the same contract. A particle can move one way while its billboard is authored to face another.

## 5. Near-zero direction vectors

**HEURISTIC**

A directional billboard becomes underdefined when its direction vector approaches zero.

Risk situations:
- drag slows velocity almost to zero;
- a particle reaches an apex;
- parametric derivative/tangent becomes very small;
- initialization produces `[0,0,0]`.

Mitigations:
- avoid directional mode for particles that frequently stop;
- keep a stable fallback direction where the format/authoring design permits;
- shorten lifetime before prolonged zero-speed phases;
- use camera-facing mode for soft, non-directional sprites.

## 6. Apex behavior

Ballistic streaks can become visually unstable near apex because vertical velocity changes sign.

If a long directional sprite visibly flips:
- decide whether velocity alignment is actually desired through the apex;
- reduce elongation near low speed;
- switch design to shorter debris sprites;
- separate ascending streak and falling debris layers rather than forcing one sprite to represent both.

Avoid runtime class switching solely to hide a poor physical decomposition.

## 7. Direction strength and normalization

Orientation generally cares about direction more than magnitude. Do not rely on a large vector magnitude as a substitute for a valid direction.

Keep these concepts distinct:

```text
direction vector
→ orientation / launch axis

scalar speed
→ magnitude of launch velocity
```

This separation is especially important for Snowstorm/Wintersky compatibility in workflows where scalar `particle_initial_speed` is preferred for authored magnitude.

## 8. Camera constraints

Y-constrained billboard modes are useful when world-up matters, such as upright flames or vertical mist columns.

Full XYZ modes are useful for:
- floating smoke;
- explosions;
- spherical magic;
- camera-facing soft sprites.

Directional modes are useful for:
- sparks;
- rain streaks;
- tracers;
- elongated debris trails.

Emitter-transform modes are useful when a particle must inherit a stable plane from an attached/rotated emitter instead of following the camera normally.

## 9. Emitter-transform plane modes

For `emitter_transform_xy`, `emitter_transform_xz`, and `emitter_transform_yz`, establish the emitter's local/world-space relationship before debugging the billboard.

If orientation is wrong, inspect in this order:

```text
emitter transform
→ local-space configuration
→ selected emitter plane mode
→ entity/locator transform if attached
→ Snowstorm vs Minecraft preview difference
```

Do not compensate for an incorrect emitter transform by rotating the source texture unless the texture axis itself is actually wrong.

## 10. Texture orientation contract

Document the sprite's canonical axis:

```text
SPRITE_LONG_AXIS = X
or
SPRITE_LONG_AXIS = Y
```

Then select the matching directional mode when possible. This avoids compensating with rotated source images or confusing UV layouts.

## 11. Aspect ratio

Elongated billboards need controlled width:length ratio. If the ratio is too extreme:
- turning artifacts become obvious;
- atlas edge softness stretches;
- low-speed orientation instability becomes more visible.

Tune aspect ratio together with speed and view distance.

## 12. Directional stretch heuristic

For streak-like effects, apparent length can be correlated with speed, but do not let size approach zero or extreme values unpredictably.

Conceptually:

```text
length = clamp(base + speed * scale, min_length, max_length)
```

Only use this if a reliable speed-like quantity is available in the expression context.

## 13. Snowstorm vs Minecraft

If directional orientation differs:
1. reduce to a single particle and static direction;
2. confirm texture axis;
3. confirm facing mode;
4. remove complex Molang size/rotation logic;
5. test nonzero constant velocity/direction;
6. compare Snowstorm and Minecraft;
7. check whether the selected facing mode is supported correctly by that Snowstorm/Wintersky release;
8. classify the difference as editor-preview-specific before rewriting valid Bedrock logic.

## 14. QA checklist

```text
[ ] facing mode exists in the target Bedrock schema/version
[ ] billboard mode matches sprite type
[ ] sprite long axis matches directional-axis intent
[ ] direction vector cannot accidentally remain zero for most of lifetime
[ ] apex/low-speed behavior is intentionally handled
[ ] direction and speed magnitude are not conflated
[ ] emitter-transform modes have intentional local/world transform ownership
[ ] elongated aspect ratio remains readable at target distance
[ ] Snowstorm mismatch is isolated before changing generic Bedrock semantics
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_appearance_billboard?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_appearance_billboard?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
