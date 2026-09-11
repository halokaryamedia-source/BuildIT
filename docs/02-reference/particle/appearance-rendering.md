# Particle Appearance and Rendering Knowledge

Provenance labels:
- **OFFICIAL BEDROCK** — Microsoft Bedrock particle documentation.
- **SNOWSTORM / WINTERSKY** — editor/preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced in accepted authoring work.
- **HEURISTIC** — authoring guidance.

## Render contract

**OFFICIAL BEDROCK**

Particle description owns basic render parameters:

```text
material
texture
```

Appearance components then control billboard geometry, UV selection, tint, and lighting.

Rendering problems should be diagnosed separately from emitter and motion problems.

## Material families

Common Bedrock particle materials include:

```text
particles_opaque
particles_alpha
particles_blend
particles_add
```

### particles_opaque

Use for fully opaque sprites where transparency is not needed.

### particles_alpha

Use for cutout/alpha-tested style sprites where crisp edges matter.

### particles_blend

Use for soft translucent smoke, mist, clouds, and transparent energy.

### particles_add

Use for additive glow-like content such as sparks, magic, energy, and luminous effects.

**HEURISTIC**

Choose material from intended blend behavior, not from filename or effect category alone.

## Billboard component

**OFFICIAL BEDROCK**

`minecraft:particle_appearance_billboard` controls:
- size;
- camera-facing mode;
- direction settings where relevant;
- UV selection;
- flipbook animation.

Size is evaluated repeatedly, so Molang-driven scaling is supported.

## Facing camera modes

Documented modes include variants such as:

```text
rotate_xyz
rotate_y
lookat_xyz
lookat_y
direction_x
direction_y
```

Use:
- `lookat_xyz` / `rotate_xyz` for general camera-facing sprites;
- Y-constrained modes for upright flames/plants-like particles;
- direction modes for elongated sparks, streaks, arrows, or velocity-aligned sprites.

**HEURISTIC**

Direction-facing sprites require a meaningful direction vector. If motion becomes near-zero, orientation can become visually weak or unstable.

## Size authoring

**OFFICIAL BEDROCK + HEURISTIC**

Billboard size can use constants or Molang.

Useful patterns:

```text
birth expansion
age-based fade/shrink
distance-appropriate scale
stable random size classes
```

Do not use emitter age to switch all living particles from one size class to another if persistent particle identity is desired.

## UV authoring

**OFFICIAL BEDROCK**

UVs can be described using texture dimensions and texel-space regions.

Use explicit texture width/height when working with atlases so UV selection is auditable.

## Flipbook

**OFFICIAL BEDROCK**

Billboard flipbook supports sprite-sheet animation over time. Typical controls include:

```text
base_UV
size_UV
step_UV
frames_per_second
max_frame
stretch_to_lifetime
loop
```

Use flipbook when texture animation is truly visual-frame-based.

Do not use flipbook to compensate for motion or class-selection problems.

## Tinting

**OFFICIAL BEDROCK**

`minecraft:particle_appearance_tinting` can use:
- direct hex color;
- RGB/RGBA values;
- Molang-driven channels;
- gradients with an interpolant.

Good uses:
- flame cooling;
- smoke darkening/fading;
- magical color shifts;
- per-particle random variation.

## Gradients

**OFFICIAL BEDROCK**

Tint gradients can be evenly spaced or keyed by explicit positions and driven by an interpolant.

A normalized particle-age expression is often a clean interpolant when color should follow the particle lifetime.

## Lighting

**OFFICIAL BEDROCK**

`minecraft:particle_appearance_lighting` enables particle lighting behavior where supported.

Treat lighting as rendering context, not as actual emitted world light.

## Texture asset contract

**HEURISTIC + EMPIRICALLY VERIFIED**

Production particle textures should have:
- true RGBA transparency when needed;
- no baked checkerboard;
- no accidental white matte/halo;
- intentional atlas cell boundaries;
- safe gutter around visible sprite pixels;
- consistent visible bounds across related cells;
- no duplicate cells unless intentional.

## Atlas strategy

Use an atlas when:
- one effect has related sprite classes;
- flipbook frames are required;
- multiple child effects intentionally share one texture.

Avoid an atlas when it creates unnecessary UV complexity for a single static sprite.

## Transparency sorting and overdraw

**HEURISTIC**

Large translucent billboards can create:
- heavy overdraw;
- sorting artifacts;
- muddy silhouettes;
- opacity stacking.

For large smoke/plume effects:
- reduce unnecessary overlap;
- use fewer larger layers only when silhouette remains readable;
- avoid filling occluded interiors with translucent sprites;
- consider separate layers with controlled alpha rather than one dense wall.

## Long-distance readability

**HEURISTIC**

Particle size should be evaluated relative to intended view distance.

A tiny sprite that looks good at 5 blocks may disappear at 80–100 blocks.

Use angular-size reasoning as static guidance, then rely on user visual review for final acceptance.

## Snowstorm preview boundary

**SNOWSTORM / WINTERSKY**

Snowstorm is useful for rapid appearance iteration, but visual approval remains separate from static JSON validity.

When preview differs unexpectedly:
1. confirm texture path and alpha;
2. confirm material;
3. confirm billboard facing mode;
4. confirm UV/flipbook dimensions;
5. confirm Molang expressions;
6. compare in Minecraft if the issue may be editor-specific.

## Common appearance failures

- wrong material for alpha behavior;
- texture has white matte or baked background;
- billboard size too small at target distance;
- UV dimensions do not match texture dimensions;
- flipbook steps into wrong cells;
- directional billboard used without meaningful direction;
- all particles change tint/size simultaneously because emitter age owns particle appearance;
- too many translucent sprites create a solid cloud wall;
- texture atlas cells have inconsistent visible bounds causing apparent jitter.

## Debug order

When the effect exists but looks wrong:

```text
material
→ texture alpha/content
→ billboard size/facing
→ UV/flipbook
→ tint/lighting
→ opacity/overlap density
→ Snowstorm vs Minecraft comparison
```
