# Particle Texture Color, Alpha and Blend Knowledge

This file owns practical color/value/alpha reasoning for particle textures. It does not claim the exact internal Minecraft shader equation for every material.

Evidence classes:
- **OFFICIAL BEDROCK** for documented materials/tint/texture behavior.
- **HEURISTIC** for practical art-direction and readability guidance.

## 1. Separate texture color from material behavior

The same RGB texture can look materially different under:

```text
particles_opaque
particles_alpha
particles_blend
particles_add
```

Do not judge source art independently from the target material.

## 2. Value structure first

For particles, silhouette and value separation often matter more than exact hue.

At distance:
- tiny low-contrast shapes disappear;
- translucent midtones can merge into the background;
- bright additive cores can dominate nearby darker detail.

Author value hierarchy intentionally.

## 3. Alpha is not brightness

Alpha controls contribution/visibility for blend-capable materials, while RGB controls source color/value.

Do not compensate for a too-dark RGB sprite only by raising alpha, or for an overly opaque sprite only by darkening RGB.

Treat these as separate controls.

## 4. Blend particles

For smoke, cloud, fog, mist, soft energy:
- avoid filling the whole cell with weak haze;
- preserve a readable center or clustered silhouette;
- taper alpha intentionally at the edge;
- avoid excessive overlap that creates an opaque wall.

## 5. Additive particles

For sparks, magical glow, flashes, hot cores:
- additive output can become visually intense quickly;
- small bright regions are often enough;
- avoid large fully bright rectangles;
- keep unused/background pixels truly transparent;
- use value falloff around the core rather than uniform maximum brightness.

## 6. Alpha/cutout particles

For crisp particles:
- keep edge transitions deliberate;
- avoid accidental antialiasing caused by image resizing;
- use stepped alpha when the style is pixel-art or hard-edged.

## 7. Neutral texture for tinting

When Molang tint owns most color variation, a neutral grayscale/value source can be easier to control.

But do not assume grayscale is always best. A warm/cool authored base can be preferable when tint variation is narrow and art direction depends on baked hue relationships.

## 8. Tint multiplication intuition

Treat tint as modifying source color rather than replacing every artistic property of the texture.

If a source texture already contains saturated color, strong tinting can produce unexpected hue/value compression.

For highly reusable tint-driven atlases, keep source color simple and intentional.

## 9. Heat progression

Useful fire/hot-debris progression:

```text
bright core
→ orange/yellow body
→ red/brown cooling region
→ dark residue
```

Do not make every debris particle equally emissive-looking unless the target is stylized.

## 10. Smoke progression

Useful smoke value progression:

```text
dark/dense birth
→ mid-gray body
→ softer/lighter or more transparent dissipation
```

Whether smoke brightens or darkens over life depends on scene/art direction. The key is coherent evolution and alpha falloff.

## 11. Mist and water

Mist often works best with:
- low saturation;
- moderate/low opacity;
- irregular alpha edges;
- enough value contrast to remain visible against the target environment.

Pure white at high alpha can look like stacked paper discs.

## 12. Energy / magic

For stylized energy:
- separate luminous core from softer halo;
- use additive only where glow behavior is wanted;
- reserve high saturation/high value for focal regions;
- use alpha/blend layers for body/volume if needed.

One texture/material does not need to carry every visual role.

## 13. Background dependence

A particle readable on dark UI/background may vanish against sky, snow, sand, or bright blocks.

When the target environment is known, author against that contrast context.

Static texture QA cannot prove final scene readability.

## 14. Hidden RGB in transparent pixels

Transparent pixels may still carry RGB data. Filtering/blending can expose fringe color.

Edge RGB should be compatible with neighboring visible colors and material behavior.

See `texture-filtering-bleeding.md` for deeper sampling/gutter rules.

## 15. Atlas consistency

Related atlas cells should maintain coherent:
- value range;
- saturation range;
- alpha scale;
- visible bounds;
- edge treatment.

A single much brighter cell can appear as an unintended flash during flipbook playback.

## 16. Flipbook temporal color continuity

For animated textures:
- avoid abrupt average-luminance jumps unless intentional;
- avoid sudden alpha-area changes that appear as scale popping;
- keep hot/cold progression physically or stylistically coherent.

## 17. Pixel-art palette discipline

For crisp Minecraft-style particles:
- use limited palettes;
- group pixels into intentional clusters;
- avoid noisy single-pixel chroma unless it serves sparkle/detail;
- use dithering sparingly and consistently;
- avoid automatic smooth gradients unless the style calls for them.

## 18. Practical channel QA

Inspect separately:

```text
RGB image
alpha channel
over black background
over white background
over representative scene color
```

This catches matte halos and unexpectedly weak silhouettes.

## 19. Long-distance color readability

At distance, small color differences collapse.

Prioritize:
- silhouette;
- alpha mass;
- luminance contrast;
- large color grouping.

Do not rely on subtle texture detail for 50–100 block readability.

## 20. Layering strategy

For complex effects, split roles:

```text
opaque/cutout debris
blend smoke body
additive sparks/hot core
```

This is often cleaner than forcing one material/texture family to handle all roles.

## 21. QA checklist

```text
[ ] target material selected intentionally
[ ] RGB and alpha each serve a clear role
[ ] no accidental full-cell low-alpha haze
[ ] additive core not uniformly overbright
[ ] tint-compatible source design when tint is used
[ ] edge RGB does not create matte fringe
[ ] atlas cells have consistent value/alpha scale
[ ] flipbook luminance/alpha progression is coherent
[ ] pixel-art filtering/style is preserved when required
[ ] target-scene contrast has been considered
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/materials?view=minecraft-bedrock-experimental
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_appearance_tinting?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlecomponents/minecraftparticle_appearance_billboard?view=minecraft-bedrock-stable
