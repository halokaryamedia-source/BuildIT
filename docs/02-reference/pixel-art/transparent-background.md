# Pixel Art Transparency and Edge Hygiene

## Purpose

Keep transparent-background pixel assets clean and production-safe.

## Alpha rules

Transparent output must use real alpha. Do not bake:

- checkerboard previews;
- white backgrounds;
- black matte backgrounds;
- semi-transparent blur halos;
- generated scene remnants.

## Edge discipline

Pixel edges should remain crisp at production scale. Semi-transparent edge pixels are allowed only when intentionally required by the chosen style; they must not be accidental anti-aliasing residue.

## Cutout assets

For Minecraft-like cutout references, prefer decisive silhouette pixels rather than soft alpha fringes unless the target specifically supports and requests blended transparency.

## Cleanup check

Inspect enlarged nearest-neighbor view for:

```text
matte halos
isolated semi-transparent pixels
background-colored residue
broken outline pixels
unexpected edge noise
```

Then verify the subject again at native size.