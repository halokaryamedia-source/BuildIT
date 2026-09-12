---
name: lazydesigner-pixel-art-authoring
description: ChatGPT-side specialist for deliberate grid-accurate pixel art authoring, reference conversion, Minecraft-native icons, object sprites, tile/pattern assets, and texture references with strict silhouette, cluster, palette, and delivery discipline.
---

# LazyDesigner Pixel Art Authoring

Canonical ChatGPT/Codex-side specialist for pixel-art tasks. It owns standalone pixel-art authoring and reference preparation; it does **not** replace LazyDesigner Texturing, Particle authoring, Blockbench runtime mutation, or MCP texture execution.

## Route

```text
USER PIXEL-ART REQUEST
→ classify artifact once
→ resolve target visual mode
→ choose lowest viable grid / detail budget
→ establish silhouette and composition contract
→ establish palette + cluster language
→ author / transform
→ applicable QA gates once
→ ARTIFACT READY FOR REVIEW
→ optional Texturing / Particle / downstream handoff
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

Do not create extra modes unless the requested output genuinely requires a distinct production contract.

## True-pixel rule

Pixel art is authored on an integer grid. Never satisfy a pixel-art request by merely generating or resizing a smooth illustration and applying a pixelation effect.

The causal order is:

```text
GRID
→ SILHOUETTE
→ MAJOR MASSES
→ PALETTE
→ PIXEL CLUSTERS
→ SHADING / MATERIAL CUES
→ IDENTITY ACCENTS
→ QA
```

Reject or correct:

```text
soft anti-aliasing
blurred edges
sub-pixel detail
mixed pixel scale
uncontrolled gradients
random single-pixel noise
checkerboard noise without material cause
inconsistent staircase rhythm
AI pseudo-pixel artifacts
```

Intentional selective anti-aliasing is allowed only when the requested style explicitly requires it and the final grid remains coherent.

## Resolution-budget rule

Choose the smallest grid that preserves the requested identity and function.

Default planning tiers:

```text
MICRO      8×8 / 12×12
ICON       16×16
DETAILED   24×24 / 32×32
HD_PIXEL   48×48 / 64×64
SPECIAL    explicit/custom target
```

These are planning tiers, not universal output defaults. User-specified dimensions, existing asset conventions, or target-game requirements take precedence.

Do not upscale complexity simply because a larger canvas is available. Extra pixels require justified silhouette, material, animation, or identity information.

## Silhouette-first rule

Before shading, establish whether the subject reads from its outer contour and negative space at target viewing size.

Evaluate only applicable factors:

```text
primary axis
major protrusions
negative-space landmarks
width / height relationship
visual center
asymmetric identity cues
readability at actual display scale
```

If silhouette identity fails, fix massing before adding colors or micro-detail.

## Cluster discipline

Think in coherent pixel clusters, not isolated decorative pixels.

Useful cluster roles:

```text
PRIMARY MASS
SECONDARY MASS
EDGE CLUSTER
SHADOW CLUSTER
LIGHT CLUSTER
DETAIL CLUSTER
ACCENT PIXEL / ACCENT CLUSTER
```

Avoid orphan pixels unless they are a deliberate high-value identity cue. Avoid repetitive staircase edges that do not follow form. A clean cluster that communicates form is preferable to several noisy pixels.

## Palette discipline

Build the smallest useful palette. Common semantic roles:

```text
OUTLINE / DEEP SHADOW
SHADOW
BASE
LIGHT
SPECULAR
ACCENT
IDENTITY
EMISSIVE
```

Not every asset needs every role. Hue shifting is allowed when it improves material separation or form readability, but palette expansion must remain deliberate.

For series work, preserve palette relationships and contrast hierarchy across assets unless the subject materially requires an exception.

## Material readability

Do not represent material identity through hue alone. Use cluster shape, highlight sharpness, edge behavior, transparency/cutout behavior, and value contrast when applicable.

Typical material families include:

```text
WOOD
METAL
STONE
GLASS
PLASTIC
CLOTH
LEATHER
LIQUID
FOLIAGE
EMISSIVE
```

Examples are causal guidance, not hard presets:

```text
metal   → compact sharp highlights + higher local contrast
glass   → edge/reflection cues + controlled transparency/open-space logic
cloth   → broader softer clusters + restrained specular accents
liquid  → container-aware level, meniscus/readable fill mass, material-specific highlight
foliage → silhouette rhythm + grouped leaf masses, not uniform speckle
```

## Minecraft target modes

### MINECRAFT_NATIVE

Prioritize:

```text
low or canonical target resolution
compact palette
strong silhouette
large readable clusters
minimal micro-detail
vanilla-compatible abstraction
```

Do not imitate smooth vector art with a pixel filter.

### MIVUBI_HD_PIXEL

Prioritize:

```text
strict integer grid
richer but controlled palette
higher material definition
more refined cluster transitions
strong silhouette retained at normal scale
Minecraft-friendly abstraction retained
```

HD never means abandoning pixel scale, introducing painterly gradients, or filling the canvas with micro-noise.

## Perspective contract

Resolve one projection before detailed authoring:

```text
FRONT
SIDE
ORTHOGRAPHIC
3/4
ISOMETRIC
TOP_DOWN
ITEM_ICON
GUI_ICON
```

Do not introduce unnecessary perspective merely to make a small icon appear more complex.

## Reference-conversion rule

For image-driven work:

```text
SOURCE IMAGE
→ identify subject and target use
→ extract identity landmarks
→ remove photographic complexity
→ resolve silhouette
→ translate materials into pixel language
→ apply target palette / grid budget
→ QA against reference identity
```

Never use `resize → nearest-neighbor → call it finished` as the conversion method.

Reference fidelity prioritization:

```text
silhouette
→ proportion
→ identity landmark
→ material distinction
→ color identity
→ secondary detail
```

If source evidence is ambiguous, preserve supported identity and simplify unsupported detail instead of inventing decorative complexity.

## Style Lock

When multiple assets belong to one set, create or reuse one internal `PIXEL_STYLE_PROFILE` containing only decision-relevant fields:

```text
canvas / target grid
visible pixel scale
outline treatment
palette behavior
light direction
contrast range
perspective
subject occupancy / padding
detail density
shadow language
material highlight language
```

Once accepted or clearly established by existing assets, reuse the profile for subsequent assets. Do not silently drift style because the subject changes.

A subject-specific exception is allowed when needed for recognizability, but keep the shared visual grammar.

## Animation support

Sprite animation is conditional, not part of the default hot path.

When requested:

```text
identity landmarks
→ key poses
→ breakdown poses
→ timing / loop intent
→ cluster cleanup per frame
→ silhouette + volume consistency
→ frame-to-frame QA
```

Avoid redrawing unrelated details between frames. Preserve anchor points, volume, palette, and pixel scale unless motion explicitly changes them.

## Relationship to Texturing

Pixel Art Authoring owns standalone pixel design and reference preparation.

LazyDesigner Texturing owns application to actual model UVs, mapped surfaces, Blockbench texture state, render profile, and production atlas mutation.

```text
PIXEL ART AUTHORING
→ approved/usable pixel design or reference
→ TEXTURING
→ mapped production texture
```

Do not duplicate UV, atlas mutation, Blockbench Painter, material-instance, or mapped-surface ownership from `lazydesigner-texturing`.

## Relationship to Particle

When a particle needs a pixel-authored texture:

```text
PARTICLE AUTHORING
→ texture visual requirement
→ PIXEL ART AUTHORING
→ texture asset / reference
→ PARTICLE AUTHORING resumes
```

Particle physics, emitter behavior, Molang, lifecycle, and event ownership remain with particle authoring.

## Context-budget rule

Do not preload all Pixel Art documentation.

```text
simple icon
→ SKILL + iconography owner + QA only when finalizing

reference conversion
→ SKILL + reference-fidelity/silhouette owner + palette only if needed

Minecraft-native asset
→ SKILL + minecraft compatibility owner + relevant artifact owner

sprite
→ SKILL + sprite owner + QA

tile/pattern
→ SKILL + tile/pattern owner + QA

problem diagnosis
→ SKILL + exactly one causal owner first
```

Prefer one primary technical owner plus at most one or two real dependencies. If more are needed, split the problem into causal decisions.

## Simplicity ladder

Prefer:

```text
simple silhouette + compact palette
→ structured shading clusters
→ material-specific detail
→ secondary accents
→ animation / multi-frame / complex patterning
```

Use the first level that satisfies the requested visual function.

## QA contract

Near finalization, evaluate applicable gates once:

```text
GRID INTEGRITY
SILHOUETTE READABILITY
CLUSTER QUALITY
PALETTE ECONOMY
PIXEL-SCALE CONSISTENCY
MATERIAL READABILITY
IDENTITY FIDELITY
TARGET COMPATIBILITY
EDGE CLEANUP
BACKGROUND / ALPHA CORRECTNESS
STYLE-LOCK CONSISTENCY (series only)
FRAME CONSISTENCY (animation only)
```

Result is `PASS | REVISE | BLOCKED` with the smallest causal correction.

Do not repeatedly re-audit after every single pixel. Batch one coherent correction, then rerun only affected gates.

## Delivery boundary

Default output is the authored/revised pixel-art asset plus concise production-relevant notes when needed.

Do not create ZIPs, manifests, sprite sheets, atlases, or downstream handoff metadata unless requested or required by the target format.

When handing to Texturing, Particle, or another authoring phase, pass only:

```text
artifact identity
artifact class
target mode
grid / dimensions
style profile fields that matter
palette roles when relevant
alpha/background requirement
reference-fidelity constraints
animation frame contract when relevant
known blockers
```

Never pass the entire Pixel Art knowledge corpus as handoff context.

## Evidence discipline

Separate:

```text
USER REQUIREMENT
REFERENCE-SUPPORTED
EXISTING-STYLE-SUPPORTED
PROVISIONAL
```

Never present a provisional palette, grid, light direction, material treatment, or style interpretation as if the user explicitly requested it.

## Boundary

This Skill may author or direct standalone pixel icons, object/prop pixel art, sprites, tile/pattern assets, Minecraft-oriented pixel references, and revisions/audits of those assets.

It does not own model geometry, UV mutation, Blockbench Painter execution, Bedrock particle physics, animation-controller runtime, in-game performance claims, or generic smooth illustration generation.