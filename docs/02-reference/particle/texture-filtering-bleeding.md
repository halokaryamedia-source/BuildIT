# Particle Texture Filtering, Bleeding, and Edge Quality

This file owns edge-quality risks that sit between authored PNG/atlas content and rendered particle output. General texture construction belongs in `texture-authoring.md`.

## Evidence classes

- **OFFICIAL BEDROCK** — documented particle UV/material behavior.
- **SNOWSTORM / WINTERSKY** — editor-preview rendering behavior.
- **EMPIRICALLY VERIFIED** — reproduced project evidence.
- **HEURISTIC** — conservative asset guidance.

## 1. Why edge artifacts happen

A texture can be correct as an image but still render poorly because UV sampling interacts with neighboring pixels, transparency, atlas layout, scaling, filtering, and blending.

Typical symptoms:
- bright/white halos;
- dark fringes;
- neighboring atlas cells leaking into a sprite;
- thin one-pixel seams;
- apparent jitter between flipbook frames;
- softening that destroys pixel-art silhouettes.

## 2. Transparent pixels still contain RGB

**HEURISTIC + EMPIRICALLY VERIFIED**

A fully transparent pixel may still contain RGB values. Filtering can mix those hidden colors into visible edge pixels.

Therefore transparent borders should not contain arbitrary white or unrelated colors when soft sampling is possible.

Preferred preparation:
- extend/dilate edge color into transparent padding when appropriate;
- keep alpha at zero outside the sprite;
- avoid white matte exports;
- inspect premultiplied-looking halos visually.

## 3. Atlas gutters

When neighboring cells share one atlas, leave a safe transparent gutter between visible sprite bounds and the cell edge.

The required gutter depends on scale/filtering/runtime behavior, so do not claim one universal pixel value. Instead:
- never let visible opaque pixels touch the atlas cell boundary unless intentionally tile-safe;
- keep consistent padding across related cells;
- increase padding when downscaling or strong minification causes bleeding.

## 4. Cell bounds and visible bounds

Distinguish:

```text
CELL BOUNDS
→ UV addressable region

VISIBLE BOUNDS
→ nontransparent sprite content inside the cell
```

For animated or class-switched atlases, inconsistent visible bounds can make a stationary particle appear to jump in size/position.

Normalize visual center and margins across related frames/classes unless motion inside the frame is intentional.

## 5. Flipbook bleeding

Flipbooks are especially sensitive because adjacent frames are sampled repeatedly.

Checklist:
- `texture_width` / `texture_height` matches the actual PNG;
- frame `size_UV` is correct;
- `step_UV` does not enter neighboring cells;
- cell count matches `max_frame` expectations;
- gutters are sufficient;
- visible frame bounds are intentionally consistent.

## 6. Pixel-art particles

For pixel-art sprites:
- author at an intentional native pixel scale;
- use hard silhouettes and limited anti-aliasing;
- avoid resampling the sprite repeatedly during asset preparation;
- preserve nearest-neighbor-like visual intent in source assets;
- avoid subpixel-looking details that vanish at target distance.

Runtime/editor filtering behavior can still differ, so final visual review remains required.

## 7. Soft particles

Smoke, mist, clouds, glows, and energy often use soft alpha edges.

For these:
- use smooth alpha ramps, not a baked gray/white background;
- keep RGB near the intended edge color under transparent pixels;
- avoid overly large feather zones that create muddy overlap;
- tune texture softness together with `particles_blend`/`particles_add` and density.

## 8. Premultiplied-alpha appearance

Do not assume the runtime/editor uses the same alpha pipeline as an image editor.

If edges look unexpectedly dark or bright:
1. inspect RGB under transparent pixels;
2. inspect the material choice;
3. compare Snowstorm/Wintersky and Minecraft;
4. test a simplified sprite with controlled edge colors;
5. avoid claiming the PNG is wrong until blend/material behavior is isolated.

## 9. UV precision

Use integer texel-space atlas layout where practical. Complex fractional atlas addressing makes diagnosis harder and increases the chance of sampling adjacent content.

If Molang selects UV regions, keep class mapping auditable and bounded.

## 10. Mip/minification awareness

**HEURISTIC**

At long viewing distance, small sprites/atlas cells may be strongly minified. Even without explicit author control over all sampling stages, design source textures to survive reduction:
- stronger silhouette;
- fewer one-pixel isolated details;
- adequate gutters;
- sufficient sprite size at intended distance;
- avoid high-frequency noise unless deliberate.

## 11. Generated texture cleanup

Image-generation output must be converted into a production texture, not copied blindly.

Required cleanup may include:
- isolate the sprite from presentation background;
- create true RGBA transparency;
- remove checkerboard/baked background;
- remove labels/text;
- correct matte/halo colors;
- center/normalize visible bounds;
- rebuild atlas on an exact grid;
- verify uniqueness of intended cells.

## 12. QA checklist

```text
[ ] PNG dimensions match authored UV metadata
[ ] true alpha, no baked background
[ ] transparent RGB does not create obvious halo risk
[ ] visible content does not accidentally touch cell boundaries
[ ] atlas gutters are intentional
[ ] related frames/classes have controlled visible bounds
[ ] flipbook step/count stays in intended cells
[ ] no duplicate or empty cells unless intentional
[ ] target-distance minification is considered
[ ] Snowstorm/Minecraft visual comparison is used for unresolved sampling artifacts
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_appearance_billboard?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
