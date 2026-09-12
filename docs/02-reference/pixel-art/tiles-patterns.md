# Pixel Art Tiles and Patterns

## Purpose

Author repeating or modular pixel assets without visible accidental seams, scale drift, or large-area wallpaper artifacts.

## Tile contract

Resolve:

```text
tile dimensions
repeat axis: X / Y / BOTH / NONE
material or motif identity
cluster scale
palette relationship
edge continuation
macro repetition risk
```

## Seam discipline

For repeating axes, opposite edges must continue the same structural phase unless a deliberate offset repeat is requested.

Check:

- color/value continuity;
- motif continuation;
- cluster density;
- diagonal rhythm;
- negative-space continuity.

## Macro repetition review

A tile can be seam-correct and still fail when repeated across a large field.

Review at least conceptually as a repeated field such as:

```text
3×3 minimum
5×5 when one dominant landmark or directional motif exists
```

Evaluate:

```text
DOMINANT LANDMARK SUPPRESSION
EDGE DISTRIBUTION
FREQUENCY BALANCE
MOTIF PHASE
NEIGHBOR VARIATION
LARGE-AREA RHYTHM
```

### Dominant landmark suppression

A unique bright pixel, crack, knot, stone, or dark patch repeated every tile can create obvious wallpaper rhythm. Reduce, relocate, distribute, or turn it into a less dominant motif unless periodic repetition is intentional.

### Frequency balance

Balance large, medium, and small cluster frequencies appropriate to the material. Avoid one scale of noise filling the whole texture.

### Edge distribution

Do not concentrate the strongest features near tile borders unless they intentionally continue across those borders.

### Neighbor variation

When the target system supports only one tile, create internal variation without breaking repeatability. When multiple variants are explicitly supported downstream, variant semantics belong to that target system rather than being assumed here.

## Avoid

```text
obvious mirrored seams
edge-only cleanup that breaks interior rhythm
random noise used to hide repetition
mixed motif scale
single-pixel edge residue
one memorable feature stamping across the whole repeated field
perfect seam but obvious checker/wallpaper rhythm
```

## Controlled variation

Variation should occur in bounded clusters or motif alternatives. Do not destroy repeatability by adding unique edge features that cannot continue into the neighboring tile.

## Minecraft-facing use

For Minecraft block/material references, judge both:

```text
SINGLE TILE
→ local material read

REPEATED FIELD
→ world-surface rhythm
```

Preserve strong material read and avoid excessive micro-noise that becomes shimmer at normal scale. Large surfaces should not expose the tile boundary through repeated focal landmarks.

Actual model UV placement, connected-texture systems, atlas tiling, or runtime variant selection belongs to LazyDesigner Texturing or the relevant downstream system.