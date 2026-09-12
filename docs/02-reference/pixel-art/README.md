# Pixel Art Reference

Canonical Reference Preparation domain for standalone pixel-art assets used by LazyDesigner.

## Canonical Owner

```text
.agents/skills/lazydesigner-pixel-art-authoring/SKILL.md
```

This folder contains durable pixel-art knowledge only. The Skill owns execution procedure; this README owns navigation and domain boundary.

## Scope

Pixel Art owns:
- standalone icons;
- object / prop pixel representations;
- sprites and sprite-animation references;
- tiles and repeating patterns;
- Minecraft-native and MIVUBI HD pixel references;
- deliberate reference-image conversion into pixel-art language;
- style-lock consistency for pixel-art sets;
- pixel-art QA and delivery metadata.

Pixel Art does **not** own:
- model geometry, rigging, pivots, or 3D proportions;
- UV layout or production atlas mutation;
- Blockbench Painter/runtime execution;
- mapped-surface verification;
- Bedrock particle emitter, Molang, lifecycle, collision, or event behavior;
- generic smooth illustration generation.

A helper relationship is a handoff, never duplicated ownership.

## Core Route

```text
request
→ artifact class
→ target mode
→ grid / detail budget
→ silhouette
→ palette + clusters
→ material / identity treatment
→ applicable QA
→ asset ready for review
→ optional downstream handoff
```

Artifact classes:

```text
ICON
OBJECT / PROP
SPRITE
TILE / PATTERN
TEXTURE_REFERENCE
AUDIT / REVISION
```

Target modes:

```text
GENERIC_PIXEL
MINECRAFT_NATIVE
MIVUBI_HD_PIXEL
```

`MINECRAFT_NATIVE` favors compact vanilla-like abstraction. `MIVUBI_HD_PIXEL` permits richer material definition while preserving strict grid and cluster discipline.

## Minimal Owner Routing

After loading the Pixel Art Skill, choose one primary owner first:

```text
simple icon                     → iconography.md
object / prop                   → object-prop.md
reference conversion            → reference-conversion.md
Minecraft visual target         → minecraft-compatibility.md
resolution / resizing           → resolution-scaling.md
grid / jaggies / noise          → grid-clusters.md
silhouette                      → silhouette.md
palette / material              → palette-material.md
shading                         → shading.md
series consistency              → style-lock.md
sprite / frame asset            → sprites.md
sprite animation                → animation.md
tile / repeat                   → tiles-patterns.md
texture reference               → texture-reference.md
transparent-edge problem        → transparent-background.md
existing asset diagnosis        → audit-revision.md
final validation                → qa.md
requested delivery / handoff    → delivery.md
```

Add a second owner only when a real dependency changes the decision. Do not read several owners for reassurance.

## Downstream Boundaries

```text
Pixel Art → Texturing
```

Texturing owns actual UV mapping, production atlas mutation, Blockbench texture state, materials/render profile, and mapped-surface verification. Pixel Art supplies only the visual/reference contract required by Texturing.

```text
Pixel Art → Particle
```

Particle owns particle JSON, emitter behavior, motion, Molang, lifecycle, events, and collision. Pixel Art may supply texture/frame visual assets only.

```text
Pixel Art sprite animation ≠ Bedrock bone animation
```

Frame-based sprite motion stays in this domain. Blockbench/Bedrock bone animation remains owned by `lazydesigner-animation`.

## Context Economy

Do not preload this folder.

```text
simple task
→ Pixel Art Skill + one primary owner

cross-concern task
→ + one conditional owner only when materially required

finalization
→ qa.md once

package/handoff requested
→ delivery.md
```

Do not carry the whole Pixel Art corpus into Texturing, Particle, Geometry, or Animation. Handoff only compact artifact facts defined by `delivery.md`.

## Quality Principle

A finished asset must read at its actual target size. More pixels, more colors, and more micro-detail are not evidence of higher quality.

Primary quality signals are:

```text
grid integrity
silhouette readability
cluster coherence
palette economy
material readability
identity fidelity
target compatibility
style-lock consistency when applicable
```
