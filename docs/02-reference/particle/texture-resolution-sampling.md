# Particle Texture Resolution and Sampling

This file owns resolution, resampling, texel-density, atlas-layout, downscaling, alpha-coverage, and memory/readability reasoning for particle textures.

Evidence classes:
- **OFFICIAL BEDROCK** for documented texture/UV fields and render behavior.
- **HEURISTIC** for production image-processing guidance and memory/readability estimates.

## 1. Resolution is not quality by itself

A larger PNG does not automatically produce a better particle.

Effective quality depends on:

```text
source resolution
billboard world size
view distance
screen resolution / FOV
material / transparency
texture filtering
contrast / silhouette
```

Choose source resolution to preserve the authored silhouette and frame detail at the intended use scale.

## 2. Source texture versus billboard size

The particle texture is sampled onto a billboard with authored world dimensions.

Think in two independent spaces:

```text
texture space → pixels / texels
world space   → blocks
```

Do not assume a 128-pixel sprite means a 128-block particle or any fixed pixel-to-block ratio.

## 3. Practical texel-density reasoning

A useful authoring question is:

```text
How many source pixels are needed to describe the smallest visible feature?
```

If the final billboard appears only a few screen pixels wide at target distance, extremely high-resolution internal detail will not be visible.

Use more resolution when it supports:
- clean alpha edges;
- multiple atlas cells;
- flipbook frames;
- large close-up cinematic particles;
- intentionally detailed source art.

## 4. Do not invent a power-of-two requirement

Do not treat power-of-two dimensions as a universal Bedrock particle requirement unless current target documentation/tooling explicitly requires it.

What does matter:
- the file dimensions are valid for the target;
- JSON `texture_width` / `texture_height` match the authored mapping;
- atlas cells divide intentionally;
- UV/flipbook coordinates stay in bounds.

Power-of-two layouts can still be convenient for predictable grids.

## 5. Atlas dimension formula

For a regular atlas:

```text
texture_width  = columns * cell_width
texture_height = rows    * cell_height
```

Example:

```text
4 columns × 4 rows
128 × 128 cells
→ 512 × 512 texture
```

Keep the mapping table explicit.

## 6. Cell bounds versus visible bounds

Each atlas cell has a rectangular cell boundary. The visible sprite may occupy only part of it.

For animation/class consistency, normalize visible bounds across related cells:
- center;
- silhouette scale;
- bottom/top alignment when relevant;
- transparent margin.

Otherwise frame changes can appear to jump or resize even when UV size is constant.

## 7. Gutter reasoning

A gutter is transparent padding between visible sprite pixels and the cell boundary.

Purpose:
- reduce neighbor sampling/bleed risk;
- protect antialiased edges;
- preserve frame separation under minification.

Do not set gutter to zero merely to maximize pixel use.

A fixed universal gutter size is not appropriate for every resolution. Use a proportionally reasonable transparent margin and inspect the target preview/runtime.

## 8. Transparent pixel RGB

A pixel can have alpha zero while still storing RGB values.

Those hidden RGB values may affect edge interpolation/filtering.

For dark smoke:
- avoid bright white RGB around transparent borders.

For bright additive sprites:
- avoid arbitrary dark matte colors that create fringes in non-additive previews.

Treat hidden RGB cleanup as part of production texture QA.

## 9. Alpha edge coverage

When reducing resolution, a thin high-alpha feature can disappear or become too faint if the resize filter averages it into transparent surroundings.

For small sprites:
- inspect alpha silhouette after resizing;
- preserve important high-alpha clusters;
- avoid accidental one-pixel haze covering the whole cell.

## 10. Pixel-art resampling

For intentionally crisp pixel-art particles:

```text
nearest-neighbor style resampling
hard/stepped alpha where intended
integer scale changes when practical
no accidental blur
no antialiased presentation-sheet edges
```

If source art was generated smoothly, convert deliberately rather than simply shrinking it and calling it pixel art.

## 11. Soft-particle resampling

For smoke, fog, mist, or soft energy:
- preserve smooth alpha transitions;
- inspect halos after resizing;
- avoid repeated resampling passes;
- resize from the best available clean source once when possible.

Repeated resize/edit cycles can accumulate edge contamination.

## 12. Frame-to-frame sampling stability

For flipbooks, keep these stable unless animation intentionally changes them:

```text
visible center
baseline / pivot impression
overall silhouette scale
transparent border
brightness range
```

Large frame-to-frame changes in these properties create visual jitter unrelated to the intended animation.

## 13. UV-grid precision

For a grid atlas:

```text
cell_x = column * cell_width
cell_y = row    * cell_height
```

Static UV region:

```text
uv      = [cell_x, cell_y]
uv_size = [cell_width, cell_height]
```

Flipbook steps should land on exact intended cells.

Avoid fractional grid arithmetic when integer texel boundaries are intended.

## 14. `texture_width` and `texture_height`

These fields describe the coordinate space used by billboard UV mapping.

Authoring rule:

```text
actual PNG dimensions
= authored texture dimension contract
= UV/flipbook coordinate assumption
```

If any of these disagree, atlas selection can be wrong even if the PNG itself is valid.

## 15. Downscaling and long-distance readability

At distance, fine internal texture detail disappears before the particle silhouette disappears.

Prioritize, in order:
1. silhouette;
2. alpha mass;
3. main value structure;
4. large color separation;
5. small detail.

This is especially important for 50–100 block cinematic effects.

## 16. Additive texture resolution

With additive rendering, many low-value pixels can accumulate into a large glow.

Do not fill a high-resolution cell with weak bright haze merely because there is space.

Prefer intentional bright cores and controlled falloff.

Higher source resolution can increase the amount of soft detail, but the final contribution is still governed by sampled billboard coverage and material behavior.

## 17. Blend/smoke resolution

For translucent smoke:
- avoid noisy high-frequency alpha detail that aliases at distance;
- keep large-scale silhouette readable;
- ensure neighboring layered sprites do not all share identical circular masks.

Use texture diversity to improve volume, not random high-frequency noise.

## 18. Approximate uncompressed memory reasoning

A basic RGBA image requires approximately:

```text
width * height * 4 bytes
```

before considering runtime format, mip levels, compression, duplication, or platform-specific handling.

Example:

```text
512 * 512 * 4 ≈ 1 MiB raw RGBA
```

This is a heuristic for relative asset size, not a statement of exact Minecraft GPU memory usage.

## 19. Atlas versus separate textures

Atlas benefits:
- one texture path;
- coherent class mapping;
- flipbook support;
- fewer standalone source files.

Atlas costs:
- UV complexity;
- bleed risk;
- large texture can carry unused cells;
- one bad resize/export can affect many effects.

Use separate textures when sharing one atlas offers no real benefit.

## 20. Resolution escalation rule

Increase resolution only when a specific limitation is identified:

```text
edge quality insufficient
frame detail genuinely lost
atlas grid requires more space
close-view particle needs finer silhouette
```

Do not escalate simply because “HD” sounds better.

## 21. Generated texture pipeline

Recommended sequence:

```text
generated/source art
→ remove presentation/background
→ establish true RGBA
→ clean hidden RGB / matte
→ crop/normalize visible bounds
→ resize with intentional filter
→ place into atlas/frame grid
→ verify exact dimensions
→ UV/flipbook mapping
→ Snowstorm/runtime visual review
```

## 22. Texture sampling QA

```text
[ ] PNG dimensions match authored contract
[ ] texture_width/height match UV assumptions
[ ] atlas grid divides intentionally
[ ] visible bounds are normalized
[ ] gutter exists where needed
[ ] transparent-border RGB is clean
[ ] resize filter matches pixel-art or soft-art intent
[ ] no repeated-resize degradation
[ ] flipbook frames remain spatially stable
[ ] small features survive intended downscale
[ ] additive/blend textures remain controlled at distance
[ ] unused atlas area is intentional
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_appearance_billboard?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_appearance_billboard_flipbook_data?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/uv_proxy?view=minecraft-bedrock-stable
