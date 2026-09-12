# Pixel Art Reference

Canonical Reference Preparation domain for standalone pixel-art assets used by LazyDesigner.

## Canonical Owner

```text
.agents/skills/lazydesigner-pixel-art-authoring/SKILL.md
```

This folder contains durable pixel-art knowledge only. The Skill owns execution procedure; this README owns navigation and domain boundary.

## Scope

Pixel Art owns standalone icons, object/prop pixel representations, sprites and sprite-animation references, tiles/patterns, Minecraft-native and MIVUBI HD pixel references, deliberate reference conversion, Style Lock consistency, QA, and compact delivery metadata.

Pixel Art does **not** own model geometry/rigging, UV or production atlas mutation, Blockbench Painter/runtime execution, mapped-surface verification, Bedrock particle runtime semantics, or generic smooth illustration generation.

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

## Core Contracts

These are durable owners, not default hot-path reads:

```text
authoring-spec.md   → artifact/target/evidence contract when classification or authority is materially ambiguous
workflow.md         → lifecycle/sequence ambiguity beyond the Skill hot path
prompt-contract.md  → request normalization, especially CHANGE + PRESERVE revisions
style-language.md   → style vocabulary when a style decision cannot be resolved from the active Style Lock or artifact owner
qa.md               → final/revision verdict owner
delivery.md         → naming, artifact identity, packaging and downstream handoff owner
```

Do not load these all together. The Skill already carries the normal execution triggers.

## Minimal Owner Routing

After loading the Pixel Art Skill, choose one primary causal/artifact owner first:

```text
simple icon                     → iconography.md
object / prop                   → object-prop.md
reference conversion            → reference-conversion.md
Minecraft visual target         → minecraft-compatibility.md
resolution / resizing           → resolution-scaling.md
grid / jaggies / noise          → grid-clusters.md
silhouette                      → silhouette.md
palette / color identity / material → palette-material.md
shading                         → shading.md
series consistency              → style-lock.md
sprite / frame asset            → sprites.md
sprite animation                → animation.md
tile / repeat                   → tiles-patterns.md
texture reference               → texture-reference.md
transparent-edge problem        → transparent-background.md
existing asset diagnosis        → audit-revision.md
final validation/native-scale review → qa.md
requested delivery / handoff    → delivery.md
```

Add a second owner only when a real dependency changes the decision. Do not read several owners for reassurance.

## Downstream Boundaries

### Pixel Art → Texturing

Texturing owns actual UV mapping, production atlas mutation, Blockbench texture state, materials/render profile, and mapped-surface verification. Pixel Art supplies only the visual/reference contract required by Texturing.

### Pixel Art → Particle

Particle owns particle JSON, emitter behavior, motion, Molang, lifecycle, events, and collision. Pixel Art may supply texture/frame visual assets only.

### Sprite animation

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

A finished asset must read at its actual target size. More pixels, colors, and micro-detail are not evidence of higher quality.

Primary quality signals are grid integrity, silhouette readability, cluster coherence, palette economy, material readability, identity fidelity, target compatibility, and Style Lock consistency when applicable.