# Snowstorm / Wintersky Knowledge

This file owns durable editor/preview compatibility knowledge for Snowstorm and its Wintersky renderer. It must not redefine Bedrock-generic validity.

## Evidence Classes

- **SNOWSTORM / WINTERSKY**: behavior documented by Snowstorm/Wintersky sources or releases.
- **EMPIRICALLY VERIFIED**: reproduced behavior from accepted project authoring.
- **HEURISTIC**: bounded workflow guidance for safer authoring.

## 1. Positioning

Snowstorm is a third-party Bedrock particle editor by JannisX11. Microsoft documentation recommends it as a practical visual editor for Bedrock particle effects, but it is not a Mojang/Microsoft runtime.

Snowstorm is available as:

```text
web app
VS Code extension
```

Its 3D preview is powered by Wintersky, a THREE.js renderer based on the Minecraft Bedrock particle format.

Therefore keep three layers separate:

```text
Bedrock JSON validity
Snowstorm/Wintersky preview behavior
Minecraft target visual truth
```

## 2. Current Tooling Context

Snowstorm 3.x includes features such as:

```text
Quick Setup
live 3D preview
Molang editing/autocomplete
curves
particle events
nested effect preview
texture editing
code preview
VS Code resource-pack workflow
```

Recent Snowstorm releases also track Wintersky versions explicitly, confirming that preview behavior is tied to the Wintersky renderer implementation.

## 3. Quick Setup

**SNOWSTORM / WINTERSKY**

Quick Setup is a convenience layer for common emitter shape, motion, timing, and texture configurations.

Use it as:

```text
starting configuration
not authoritative design logic
```

After Quick Setup, still inspect the resulting component values. Do not assume a preset matches the physical intent merely because the preview looks approximately correct.

## 4. Live Preview Value

Snowstorm preview is useful for rapid iteration on:
- direction;
- spread;
- size;
- density;
- duration;
- texture/UV behavior;
- event layering;
- approximate motion.

But preview acceptance does not replace Minecraft acceptance when the final scene depends on:
- world geometry;
- camera/FOV context;
- entity binding;
- game-specific render behavior;
- performance on target hardware;
- exact collision/runtime differences.

## 5. Vector Initial Speed Caveat

**EMPIRICALLY VERIFIED / SNOWSTORM-COMPATIBILITY**

A recurring Snowstorm/Wintersky issue observed during accepted volcano authoring:

```text
minecraft:particle_initial_speed = [x, y, z]
```

may behave as a direction-like vector whose magnitude is normalized for preview, producing an effective linear speed that does not preserve the authored vector magnitude.

When Snowstorm preview fidelity matters and launch magnitude is important, prefer:

```text
emitter shape direction = [x, y, z]
minecraft:particle_initial_speed = scalar speed
```

This is a target-specific compatibility rule. A vector initial-speed form must not automatically be labeled invalid Bedrock JSON.

## 6. Direction Ownership

Use emitter shape direction to define where a particle initially launches when using the scalar-speed pattern.

For intentional spread, vary direction components with stable emitter/particle random inputs rather than faking spread through unrelated acceleration.

Example conceptual pattern:

```text
direction = [base_x + random_spread_x,
             upward_bias + random_spread_y,
             base_z + random_spread_z]
initial_speed = scalar class speed
```

## 7. Stable Living-particle Ownership

**EMPIRICALLY VERIFIED**

Snowstorm preview made a recurring authoring defect visible when `variable.emitter_age` was used inside properties of already living particles.

Risk areas include:

```text
minecraft:particle_motion_dynamic
minecraft:particle_appearance_billboard
minecraft:particle_appearance_tinting
```

If emitter-age thresholds select classes in these fields, existing particles may visibly switch class mid-life.

Prefer:

```text
particle_random_N
particle_age
particle_lifetime
```

for persistent particle-owned behavior.

Keep `emitter_age` for emitter-level timing such as spawn-rate phases or event scheduling.

## 8. Events

Snowstorm 3.x supports Bedrock particle events, including:
- particles;
- sounds;
- expressions;
- sequences;
- randomizers;
- emitter creation/expiration triggers;
- collisions;
- timelines.

Snowstorm can preview chained particle events together. In the web app, child particles may be opened in another tab and synchronize; the VS Code workflow can resolve referenced effects from a resource-pack folder.

Authoring implication:
- use explicit child identifiers;
- keep bundle references resolvable;
- do not rely on one tab/file being self-contained when the event graph is not.

## 9. Texture Editing

Snowstorm includes basic texture editing intended for quick pixel-level adjustments. Its own release notes position this as a convenience rather than a replacement for a full image editor.

Use Snowstorm texture editing for:
- small corrections;
- pixel cleanup;
- quick iteration.

Use dedicated image-generation/editing workflow when:
- atlas construction is substantial;
- alpha cleanup matters;
- many unique cells are required;
- style consistency is complex.

## 10. Material / Rendering Preview

Snowstorm supports particle materials including additive rendering in modern releases. Release notes have fixed preview-specific issues such as black pixels with additive materials.

Therefore:
- do not treat one preview artifact as proof that the JSON is wrong;
- check current Snowstorm release behavior before encoding a permanent workaround;
- distinguish editor regression from Bedrock authoring defect.

## 11. Molang Support and Preview

Snowstorm supports Molang editing and autocomplete and has fixed undefined-variable detection in event-related expressions.

Do not assume Snowstorm's Molang evaluator is a complete substitute for Minecraft runtime semantics. Use it as authoring feedback and preview evidence.

For class stability, use the ownership rules in `molang.md` regardless of whether Snowstorm accepts the expression syntactically.

## 12. Preview Loop and Timing

Snowstorm releases have changed/fixed preview loop defaults and event timeline behavior over time.

Authoring rule:

```text
preview timing bug suspected
→ verify current Snowstorm version / release notes
→ isolate JSON timing from editor loop behavior
→ avoid permanent content workaround until behavior is reproduced
```

## 13. Version Awareness

Snowstorm and Wintersky evolve independently from Bedrock itself.

When a behavior is editor-specific, record:

```text
Snowstorm version if known
Wintersky version if known
reproduction condition
whether Minecraft parity is confirmed
```

Do not make version-specific editor behavior a timeless Bedrock rule.

## 14. Practical Compatibility Checklist

Before delivery intended for Snowstorm review:

```text
[ ] Bedrock JSON remains valid independent of Snowstorm
[ ] launch magnitude uses scalar speed when vector normalization would distort preview
[ ] direction is authored explicitly in shape/direction owner
[ ] living-particle class decisions use particle-owned stable state
[ ] child event identifiers resolve
[ ] texture path resolves in the package
[ ] preview issue is not known to be editor-version-specific before content is rewritten
[ ] Snowstorm approval is still treated as preview evidence, not Minecraft final truth
```

## 15. Known Strong Empirical Pattern

For directional ballistic effects that need reliable Snowstorm tuning:

```text
shape.direction = normalized/intended launch direction with bounded random spread
particle_initial_speed = scalar class speed
particle_motion_dynamic.linear_acceleration = gravity / small force
particle_motion_dynamic.linear_drag_coefficient = damping
```

This pattern proved easier to reason about than embedding magnitude in the initial-speed vector.

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/documents/particleeffects?view=minecraft-bedrock-stable
- https://github.com/MicrosoftDocs/minecraft-creator/blob/main/creator/Documents/SnowstormOverview.md
- https://github.com/JannisX11/snowstorm
- https://github.com/JannisX11/snowstorm/releases
- https://github.com/JannisX11/wintersky

Current source review notes:
- Snowstorm repository package metadata identifies it as a Bedrock particle editor and uses Wintersky as a dependency.
- Snowstorm 3.x release notes document Quick Setup, Events, texture editing, Molang improvements, additive material support, and multiple preview fixes.
