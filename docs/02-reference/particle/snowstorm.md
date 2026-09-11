# Snowstorm / Wintersky Knowledge

This file owns durable Snowstorm/Wintersky editor and preview knowledge for Particle Reference Authoring. It must never redefine generic Bedrock validity.

## Evidence classes

- **SNOWSTORM / WINTERSKY** — documented source/release behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — bounded authoring guidance.

## Position

Snowstorm is a third-party Minecraft Bedrock particle editor by JannisX11, available as a web app and VS Code extension. Microsoft Creator documentation recommends it as a practical particle authoring tool, but Minecraft remains the runtime authority.

Its 3D preview uses Wintersky, a THREE.js particle renderer based on the Bedrock particle format.

Always separate:

```text
Bedrock JSON validity
Snowstorm editor/import/export behavior
Wintersky preview behavior
Minecraft runtime behavior
```

## Current version baseline

At the current published release baseline:

```text
Snowstorm 3.2.1
Wintersky 1.3.3
MolangJS 1.6.x family
```

Snowstorm `master` package metadata currently reports `3.2.2`, but there is no matching published GitHub release in the reviewed release feed. Treat source-head version metadata as development state, not stable-release evidence.

For detailed release boundaries use `snowstorm-compatibility-matrix.md`.

## Source-level editor mapping

Current Snowstorm source directly maps editor state into Bedrock particle JSON. The exporter currently writes a document beginning with:

```text
format_version: 1.10.0
particle_effect.description
particle_effect.curves
particle_effect.events
particle_effect.components
```

Source-level mapping covers major families such as:

```text
emitter initialization / local space
instant / steady / manual rate
once / looping / expression lifetime
emitter lifetime events
point / sphere / box / disc / custom / entity_aabb shapes
particle initialization
particle lifetime / environmental expiration
initial spin / initial speed
dynamic / parametric / collision motion
billboard / UV / tint / lighting
curves
particle events
```

Important boundary:

```text
Snowstorm has an editor field
≠ Bedrock requires that field

Snowstorm can import JSON
≠ every JSON field is first-class editable

Snowstorm can export JSON
≠ round-trip preservation is proven for every future Bedrock field
```

## Import / export preservation rule

Snowstorm source explicitly tracks some imported advanced event structures as unsupported-field data. Therefore externally authored advanced JSON must not be treated as safely normalized simply because it opens in Snowstorm.

For valuable authored content:

```text
original JSON
→ import Snowstorm
→ edit
→ export
→ structural diff
→ target-schema review
```

Pay special attention to semantically meaningful:

```text
0
false
empty but meaningful structures
omitted fields
advanced event structures
newer Bedrock fields
```

Release history includes fixes for zero-valued fields being dropped, so round-trip QA is a real compatibility concern.

## Quick Setup

Quick Setup, introduced in Snowstorm 3.0.0, is a convenience layer for common emitter shape, motion, timing, and starter textures.

Use it only as:

```text
bootstrap
→ inspect generated JSON
→ remove unnecessary components
→ verify ownership / units / lifetime / rate / direction / speed
→ normal particle QA
```

Do not treat a preset as authoring truth.

## Web app vs VS Code extension

### Web app

Useful for:
- fast standalone editing;
- live preview;
- child particle tabs for chained event work;
- vanilla-oriented texture assistance.

### VS Code extension

Useful for:
- actual resource-pack folder context;
- resolving referenced child particle files;
- project texture-path lookup;
- saving texture changes into workspace paths.

Compatibility note: Snowstorm 3.2.0 fixed a VS Code tick-throttling issue that could make previews run very slowly in some tabs. Do not tune physical speed against an affected older editor build.

## Preview value and boundary

Snowstorm/Wintersky preview is useful for:
- emitter spread;
- approximate motion;
- billboard size;
- density;
- duration;
- UV/flipbook;
- event layering;
- curves;
- texture/material iteration.

It does not replace Minecraft review when behavior depends on:
- world geometry/collision;
- entity/locator transforms;
- camera/FOV scene context;
- target GPU/device performance;
- exact runtime query context;
- renderer differences.

## Vector initial-speed compatibility finding

**EMPIRICALLY VERIFIED / TARGET-SPECIFIC**

Project authoring reproduced a Snowstorm/Wintersky compatibility risk where vector-form `minecraft:particle_initial_speed` behaved direction-like and did not preserve the intended authored magnitude in preview.

When Snowstorm preview fidelity matters and launch magnitude is important, prefer:

```text
emitter shape direction = launch vector
particle_initial_speed  = scalar magnitude
```

This is not a generic Bedrock syntax prohibition.

## Stable living-particle ownership

Do not use `variable.emitter_age` to classify already living particles when their identity should stay fixed.

Risk fields include:

```text
particle_motion_dynamic
particle_appearance_billboard
particle_appearance_tinting
```

Prefer particle-owned state:

```text
particle_random_1..4
particle_age
particle_lifetime
```

Keep emitter-age logic emitter-owned: rate phases, emitter lifecycle, and emitter-level event timing.

## Molang compatibility layers

Snowstorm and Wintersky rely on MolangJS. Keep three layers separate:

```text
parser accepts expression
→ MolangJS syntax capability

Snowstorm/Wintersky evaluates expression
→ editor host/context capability

Minecraft evaluates expression
→ target runtime capability
```

Variable placeholders introduced in Snowstorm 3.1.0 are preview substitutions for undefined/game-only variables. A placeholder does not prove that a query or variable exists in Minecraft particle context.

Release history includes Molang fixes for:
- curve/expression evaluation;
- nested scopes;
- operations with negative numbers;
- `math.min_angle` support;
- event-expression undefined variables;
- `camera_distance_range_lerp` preview behavior.

Use `snowstorm-compatibility-matrix.md` before diagnosing a current expression from an older editor result.

## Events and nested effects

Snowstorm 3.0.0 introduced Bedrock event authoring and chained preview. Supported editor concepts include:
- particle child effects;
- sound events;
- expressions;
- sequences;
- randomizers;
- emitter creation/expiration;
- collision triggers;
- timelines;
- distance-driven emitter events where exposed.

In the web app child particle tabs can synchronize. In the VS Code resource-pack workflow, referenced child effects can resolve from project files.

Later releases fixed important preview/event issues, including concurrent timeline events, expiration events at playback start, inconsistent timeline time codes, and collision-event `min_speed` behavior.

Do not redesign valid event architecture until the editor release is known.

## Texture / UV / material editing

Snowstorm 3.0.0 added basic texture editing and static UV manipulation. This is useful for quick pixel work, not a replacement for the production texture pipeline.

Use dedicated texture knowledge for:
- RGBA cleanup;
- atlas generation;
- gutters;
- hidden RGB;
- resampling;
- alpha/value design;
- complex flipbooks.

Release history includes preview/editor fixes for:
- gradient editing state;
- gradient hue/alpha edit registration;
- unintended default texture saves;
- additive black-pixel rendering.

Therefore:

```text
visual artifact in Snowstorm
→ check editor version
→ inspect source texture/material
→ minimal preview reproduction
→ Minecraft comparison if runtime truth matters
```

## Preview timing

Snowstorm release behavior has changed around preview loop defaults and event timing. Snowstorm 3.2.0 changed the preview loop default to Auto; later releases fixed timeline/expiration issues.

When timing looks wrong:

```text
identify editor version
→ isolate one emitter/event
→ use constant values
→ verify Bedrock timing owner
→ consult version matrix
→ compare Minecraft only if required
```

## Strong empirical ballistic pattern

For directional ballistic effects requiring predictable Snowstorm tuning:

```text
shape.direction = intended launch direction + bounded spread
particle_initial_speed = scalar class speed
particle_motion_dynamic.linear_acceleration = gravity / intended force
particle_motion_dynamic.linear_drag_coefficient = damping
```

This keeps heading, magnitude, and post-spawn physics as separate responsibilities.

## Compatibility checklist

```text
[ ] target Bedrock validity checked independently of Snowstorm
[ ] Snowstorm release known when diagnosing editor behavior
[ ] Wintersky version known when renderer/event behavior is relevant
[ ] current compatibility matrix checked before adding a workaround
[ ] imported advanced JSON diffed after export when preservation matters
[ ] meaningful zero/false/omission preserved intentionally
[ ] scalar-speed pattern used only when Snowstorm compatibility requires it
[ ] living-particle identity uses particle-owned stable state
[ ] child effect references resolve
[ ] texture asset, alpha and material checked independently
[ ] parser success is not treated as query-context proof
[ ] final Snowstorm preview is not called Minecraft runtime proof
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/documents/particleeffects?view=minecraft-bedrock-stable
- https://github.com/JannisX11/snowstorm
- https://github.com/JannisX11/snowstorm/releases
- https://github.com/JannisX11/snowstorm/blob/master/package.json
- https://github.com/JannisX11/snowstorm/blob/master/src/import.js
- https://github.com/JannisX11/snowstorm/blob/master/src/export.js
- https://github.com/JannisX11/wintersky
- https://github.com/JannisX11/wintersky/releases
- https://github.com/JannisX11/wintersky/blob/master/package.json
