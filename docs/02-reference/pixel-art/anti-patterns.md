# Pixel Art Anti-Patterns

Treat these as warning signs, not automatic failures without context.

## Fake pixelation

```text
smooth image
→ downscale / pixel filter
→ no deliberate cluster cleanup
```

This is not sufficient pixel-art authoring.

## Mixed resolution

Different areas appear to use different implicit pixel sizes because of pasted/resized content.

## Noise-as-detail

Random isolated pixels, checker noise, or excessive tiny highlights are used to imply craftsmanship without improving form or material read.

## Palette inflation

Many near-duplicate colors exist without distinct semantic roles.

## Silhouette compensation

Extra outlines, shading, and highlights are added to an object whose basic contour remains unreadable.

## Over-dithering

Dithering becomes the dominant visual texture even when clean stepped clusters would communicate the form better.

## Style drift

Assets in one family change occupancy, outline system, light direction, pixel scale, or contrast without a subject-driven reason.

## High-resolution avoidance

A canvas is enlarged merely to avoid making difficult simplification decisions.

## Baked transparency preview

Checkerboard or matte backgrounds are included in the actual asset instead of true alpha.