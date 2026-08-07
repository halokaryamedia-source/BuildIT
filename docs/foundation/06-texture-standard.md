# BlockIT — Operating Model Texture

**Status:** Draft  
**Version:** 1.0

## 1. Purpose

Define the texturing rules Codex should follow when creating Minecraft Bedrock models in Blockbench.

## 2. Core Principle

Texture should support geometry.

Use texture for:

- color;
- pattern;
- shading;
- material;
- surface detail;
- small details that do not affect silhouette.

Texture must not hide incorrect geometry.

## 3. Texture Workflow

```text
Choose texture style
↓
Plan canvas
↓
Create UV
↓
Apply base texture
↓
Apply advanced texture if required
↓
Validate texture
```

## 4. Texture Style and Canvas Size

### Texture Style

- `16×16`
- `32×32`

### Canvas Size

The user does not choose the UV Canvas. MCP calculates the required area from
the finished geometry and uses the smallest standard canvas that fits:

```text
256×256 → 512×512 → 1024×1024
```

Do not choose an arbitrary size. Do not downsize a canvas that already has
final texture data. `1024×1024` is the current workflow limit, not a claim
about the technical maximum.

## 5. Style Selection

Choose `16×16` when:

- the project is simple;
- detail is limited;
- distance readability matters more;
- simplicity matters more than extra detail.

Choose `32×32` when:

- higher detail is genuinely needed;
- the model is a focal asset;
- close viewing is expected;
- the reference requires more detail than `16×16` can support.

## 6. Pixel-Density Consistency

Avoid major density differences between body parts unless they are intentional and easy to justify.

## 7. UV Requirements

Before texturing:

- all important surfaces need UV;
- UV must stay inside the canvas;
- unintended overlap must be avoided;
- mirrored UV must be intentional;
- focal parts need enough area;
- the layout should remain understandable.

## 8. Mirror UV

Use mirror UV when both sides are identical and asymmetry is not needed.

Do not use mirror UV when text, symbols, or asymmetry matter.

## 9. Base Texturing

Base texturing defines:

- primary colors;
- secondary colors;
- material zones;
- accent colors;
- basic shadow;
- basic highlight.

At the end of base texturing:

- all major areas have color;
- major materials are distinguishable;
- the palette follows the reference;
- no important area is blank.

## 10. Advanced Texturing

Advanced texturing improves:

- value variation;
- hue variation;
- saturation variation;
- controlled gradients;
- secondary shadows;
- secondary highlights;
- edge highlights;
- ambient shading;
- material definition;
- focal details;
- visual depth.

It must not become random noise.

## 11. Gradient Definition

In BlockIT, a gradient is a controlled transition in color, value, hue, or saturation using intentional pixel clusters.

For `16×16`, use fewer and stronger steps.

For `32×32`, use more steps only when they improve readability.

## 12. Light Direction

Shading should use one consistent light direction, such as top-left or top-front.

Do not mix unrelated highlight directions across the model.

## 13. Material Definition

### Cloth

- softer contrast;
- subtle highlights;
- controlled variation.

### Leather

- warmer tones;
- medium contrast;
- slight edge emphasis.

### Metal

- stronger contrast;
- brighter highlights;
- sharper edges.

### Wood

- directed grain;
- hue and value variation;
- medium contrast.

### Stone

- irregular value variation;
- controlled cracks;
- avoid uniform noise.

### Skin

- softer transitions;
- warm and cool variation;
- readable facial areas.

## 14. Pattern and Surface Detail

Patterns include:

- stripes;
- spots;
- cloth patterns;
- cracks;
- dirt;
- scratches;
- wood grain;
- armor lines.

Patterns must follow the geometry and not disrupt the focal point.

## 15. Color Palette

Define:

- primary colors;
- secondary colors;
- accent colors;
- shadow colors;
- highlight colors.

Avoid too many colors without purpose.

## 16. Pure Black and Pure White

Use `#000000` and `#FFFFFF` carefully.

They are not forbidden, but excessive use reduces room for shading and highlights.

## 17. Noise Control

Avoid:

- random pixels;
- unrelated color variation;
- high-contrast noise;
- noise used as fake detail.

Variation should match the material.

## 18. Texture and Geometry Alignment

Texture should follow the geometry:

- shadow in recessed areas;
- highlight on raised areas;
- pattern following surface direction;
- face details aligned correctly;
- no accidental flipped texture.

## 19. Editing Efficiency

Avoid:

- repainting the full texture for a small local change;
- rereading all pixel data after every change;
- changing UV after advanced texture without strong reason;
- enlarging canvas without need;
- adding invisible details.

## 20. Validation Checklist

Check:

- style is defined;
- pixel density is consistent;
- canvas size is reasonable;
- UV stays inside the canvas;
- no major blank areas remain;
- all main parts are colored;
- the model does not look flat;
- material differences are visible;
- shading direction is consistent;
- noise is controlled;
- texture is linked;
- patterns align;
- face details are placed correctly;
- preview has been reviewed when available.

## 21. Completion Criteria

Texture is complete when:

- style is selected;
- canvas is selected;
- UV is complete;
- base texture is complete;
- advanced texture is complete for the target scope;
- materials are readable;
- the model has enough depth;
- no known critical texture issue remains;
- texture is correctly linked.
