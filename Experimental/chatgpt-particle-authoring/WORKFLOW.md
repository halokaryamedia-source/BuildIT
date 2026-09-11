# ChatGPT Particle Authoring Workflow

This document records the practical workflow learned while producing the approved `MIVUBI_Volcano_Eruption` example in ChatGPT for Snowstorm and Minecraft Bedrock.

## 1. Start from visual function, not one monolithic emitter

Split a complex effect only when its physics are materially different. For the approved volcano effect:

- `core`: vent heat / hot gas / flare
- `bombs`: ballistic volcanic debris
- `plume_rise`: smoke launched upward from the crater area
- `plume_crown`: slower lateral billows around the upper cloud mass
- `volcano_eruption`: non-visual master orchestrator

Avoid forcing all behaviors into one emitter when their launch direction, drag, gravity, lifetime, or spatial role differ.

## 2. Snowstorm / Wintersky motion rule

For Snowstorm preview compatibility, prefer:

```text
emitter shape direction = launch vector
particle_initial_speed = scalar speed
```

Do not encode the intended velocity magnitude as a vector in `minecraft:particle_initial_speed` when Snowstorm preview is the target. Wintersky treats a vector initial speed as a direction, normalizes it, and uses linear speed `1`, which destroys the authored magnitude.

## 3. Initial impulse creates the eruption

Do not rely on positive acceleration to create the initial eruption.

Correct order:

```text
strong launch direction + scalar initial speed
-> momentum
-> drag / gravity / small acceleration shape the motion
```

For ballistic debris, gravity and drag should shape an existing launch, not overpower a near-zero launch.

## 4. Keep particle class stable during its lifetime

Use stable per-particle values such as:

```text
variable.particle_random_1
variable.particle_random_2
variable.particle_random_3
variable.particle_random_4
variable.particle_age
variable.particle_lifetime
```

Do not use `variable.emitter_age` in properties evaluated every frame when that would switch a living particle between classes. In particular, avoid emitter-age switching inside:

- UV selection
- billboard size
- tint/opacity
- drag
- acceleration

Use emitter age for emitter-level timing such as spawn rate or event scheduling.

## 5. Separate rise and crown plume physics

A rising volcanic column and a mature crown are physically different.

`plume_rise`:

- strong positive Y direction
- moderate scalar speed
- low/moderate drag
- dense/mid smoke atlas rows

`plume_crown`:

- starts later
- spawns higher / farther from the center
- lower positive Y component
- stronger lateral direction
- higher drag
- upper/ash atlas rows

This avoids mid-life physics switching and reduces visual flicker/sticking.

## 6. Work around block-based plume occlusion

If a Minecraft build already supplies the main static plume/cloud mass, particles should support the outer silhouette instead of filling the center.

Use:

- crater/ring spawn positions
- upward + lateral launch vectors
- a practical central keep-out zone
- crown billows spawned around the upper block cloud
- debris that clears the central column quickly

At long viewing distance, prioritize readable silhouette and motion over micro-detail.

## 7. Texture workflow

Do not crop production particle sprites directly from presentation/contact sheets.

Use:

```text
individual transparent sprite
-> clean alpha
-> normalize bounding box
-> safe gutter
-> atlas pack
-> UV audit
```

For the approved atlases:

- 512x512 atlas
- 4x4 grid
- 128x128 cells
- unique sprites per cell
- transparent RGBA
- no baked checkerboard
- no neutral white matte
- safe margin around visible pixels

## 8. Atlas class mapping

Keep sprite class and physics class aligned.

Example plume atlas:

```text
row 0 = dense lower smoke
row 1 = mid billow
row 2 = upper billow
row 3 = ash / sparse smoke
```

Example bombs atlas:

```text
row 0 = cold/dark heavy rock
row 1 = normal/mild medium rock
row 2 = heated variants
row 3 = rare hot variants / fragments
```

Do not select arbitrary atlas rows if the visual class is supposed to match the particle's physics class.

## 9. QA before delivery

Before packaging, check at minimum:

- every `.particle.json` parses
- no vector `particle_initial_speed` when Snowstorm scalar-speed semantics are required
- no unwanted emitter-age logic in per-frame particle properties
- positive launch Y for upward effects
- ballistic trajectory sanity for debris
- texture alpha is real transparency
- no neutral white contamination
- safe per-cell gutter
- texture references resolve
- master child-effect identifiers resolve
- no obsolete experimental files are included in the final package

## 10. Packaging

For a clean Snowstorm + Minecraft Bedrock package, preserve normal Resource Pack structure:

```text
manifest.json
particles/
textures/particle/
texts/
```

The package does not need to be converted to `.mcpack` to be useful. A normal folder/ZIP can be opened for Snowstorm work and copied to a Bedrock resource-pack/development-resource-pack directory for in-game testing.

## Production boundary

This workflow is an experimental ChatGPT authoring path. It must not replace or duplicate BuildIT's canonical production particle tools unless separately promoted with explicit architecture and validation evidence.
