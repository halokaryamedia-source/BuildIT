# Pixel Art Tiles and Patterns

## Purpose

Author repeating or modular pixel assets without visible accidental seams or scale drift.

## Tile contract

Resolve:

```text
tile dimensions
repeat axis: X / Y / BOTH / NONE
material or motif identity
cluster scale
palette relationship
edge continuation
```

## Seam discipline

For repeating axes, opposite edges must continue the same structural phase unless a deliberate offset repeat is requested.

Check:

- color/value continuity;
- motif continuation;
- cluster density;
- diagonal rhythm;
- negative-space continuity.

## Avoid

```text
obvious mirrored seams
edge-only cleanup that breaks interior rhythm
random noise used to hide repetition
mixed motif scale
single-pixel edge residue
```

## Controlled variation

Variation should occur in bounded clusters or motif alternatives. Do not destroy repeatability by adding unique edge features that cannot continue into the neighboring tile.

## Minecraft-facing use

When intended for Minecraft-oriented reference work, preserve strong material read and avoid excessive micro-noise that becomes visual shimmer at normal scale.

Actual model UV placement or atlas tiling belongs to LazyDesigner Texturing.