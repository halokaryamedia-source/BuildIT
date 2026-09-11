# Directional Billboard Knowledge

This file owns directional billboard orientation, edge cases, and authoring decisions beyond the general rendering overview.

## Evidence classes

- **OFFICIAL BEDROCK** — documented billboard modes and direction fields.
- **SNOWSTORM / WINTERSKY** — preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced project evidence.
- **HEURISTIC** — authoring guidance.

## 1. Facing modes

**OFFICIAL BEDROCK**

Important modes include:

```text
rotate_xyz
rotate_y
lookat_xyz
lookat_y
direction_x
direction_y
```

General purpose camera-facing particles usually use rotate/lookat modes. Directional modes align one local billboard axis to a direction vector.

## 2. Directional axis semantics

`direction_x` means the billboard's unrotated X axis follows the direction vector; Y attempts to remain upward.

`direction_y` means the unrotated Y axis follows the direction vector; X attempts to remain upward.

This matters for texture authorship:
- a spark drawn left-to-right usually maps naturally to `direction_x`;
- a streak drawn bottom-to-top may map naturally to `direction_y`.

Choose orientation based on the sprite's intrinsic long axis, not by trial-and-error only.

## 3. Direction source

Directional appearance only works well when the authored direction is meaningful.

Possible conceptual sources:
- current particle velocity;
- a custom authored direction vector;
- emitter/shape launch direction;
- parametric tangent direction.

Do not assume movement and orientation are always the same contract. A particle can move one way while its billboard is authored to face another.

## 4. Near-zero direction vectors

**HEURISTIC**

A directional billboard becomes underdefined when its direction vector approaches zero.

Risk situations:
- drag slows velocity almost to zero;
- a particle reaches an apex;
- parametric derivative/tangent becomes very small;
- initialization produces [0,0,0].

Mitigations:
- avoid directional mode for particles that frequently stop;
- keep a stable fallback direction where the format/authoring design permits;
- shorten lifetime before prolonged zero-speed phases;
- use camera-facing mode for soft, non-directional sprites.

## 5. Apex behavior

Ballistic streaks can become visually unstable near apex because vertical velocity changes sign.

If a long directional sprite visibly flips:
- decide whether velocity alignment is actually desired through the apex;
- reduce elongation near low speed;
- switch design to shorter debris sprites;
- separate ascending streak and falling debris layers rather than forcing one sprite to represent both.

Avoid runtime class switching solely to hide a poor physical decomposition.

## 6. Direction strength and normalization

Orientation generally cares about direction more than magnitude. Do not rely on a large vector magnitude as a substitute for a valid direction.

Keep these concepts distinct:

```text
direction vector
→ orientation / launch axis

scalar speed
→ magnitude of launch velocity
```

This separation is especially important for Snowstorm/Wintersky compatibility in workflows where scalar `particle_initial_speed` is preferred for authored magnitude.

## 7. Camera constraints

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

## 8. Texture orientation contract

Document the sprite's canonical axis:

```text
SPRITE_LONG_AXIS = X
or
SPRITE_LONG_AXIS = Y
```

Then select the matching directional mode. This avoids compensating with rotated source images or confusing UV layouts.

## 9. Aspect ratio

Elongated billboards need controlled width:length ratio. If the ratio is too extreme:
- turning artifacts become obvious;
- atlas edge softness stretches;
- low-speed orientation instability becomes more visible.

Tune aspect ratio together with speed and view distance.

## 10. Directional stretch heuristic

For streak-like effects, apparent length can be correlated with speed, but do not let size approach zero or extreme values unpredictably.

Conceptually:

```text
length = clamp(base + speed * scale, min_length, max_length)
```

Only use this if a reliable speed-like quantity is available in the expression context.

## 11. Snowstorm vs Minecraft

If directional orientation differs:
1. reduce to a single particle and static direction;
2. confirm texture axis;
3. confirm facing mode;
4. remove complex Molang size/rotation logic;
5. test nonzero constant velocity;
6. compare Snowstorm and Minecraft;
7. classify the difference as editor-preview-specific before rewriting valid Bedrock logic.

## 12. QA checklist

```text
[ ] billboard mode matches sprite type
[ ] sprite long axis matches direction_x or direction_y choice
[ ] direction vector cannot accidentally remain zero for most of lifetime
[ ] apex/low-speed behavior is intentionally handled
[ ] direction and speed magnitude are not conflated
[ ] elongated aspect ratio remains readable at target distance
[ ] Snowstorm mismatch is isolated before changing generic Bedrock semantics
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_appearance_billboard?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_appearance_billboard?view=minecraft-bedrock-stable
