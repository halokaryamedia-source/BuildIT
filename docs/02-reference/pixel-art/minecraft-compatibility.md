# Minecraft Pixel Art Compatibility

## Purpose

Translate deliberate pixel art into a Minecraft-compatible visual language without reducing the work to generic voxel styling.

## Target modes

### MINECRAFT_NATIVE

Use when the asset should feel close to vanilla Minecraft conventions.

Prioritize:

- compact resolution;
- strong silhouette;
- limited palette;
- large clusters;
- restrained detail;
- readable material separation;
- no smooth/vector-style rendering hidden behind pixelation.

### MIVUBI_HD_PIXEL

Use when the asset should carry more material and identity detail while remaining unmistakably pixel-authored.

Prioritize:

- strict integer grid;
- one visible pixel scale;
- richer but controlled palette;
- stronger material cues;
- deliberate cluster transitions;
- preserved Minecraft abstraction;
- readability at actual target size.

## Minecraft-style abstraction

Minecraft compatibility is not achieved by drawing every object as a cube. For icons, sprites, and item references, preserve the subject's semantic silhouette while simplifying continuous curves into intentional stepped forms.

Good simplification preserves:

```text
identity
function
proportion hierarchy
material distinction
```

It may reduce:

```text
small surface noise
photographic reflection
subtle curvature
micro-texture
non-essential hardware detail
```

## Curves and diagonals

Use consistent staircase rhythm. A curve should look intentionally quantized, not randomly jagged.

At small grids, prioritize the characteristic arc or diagonal over literal contour fidelity.

## Material behavior

Avoid using the same highlight grammar for every material. Minecraft-style simplification still benefits from material-specific cluster logic.

## Texture-reference boundary

When a pixel-art output is intended as a later model texture reference, preserve:

- palette roles;
- material grouping;
- markings;
- cluster scale;
- transparency intent;
- orientation.

Do not pretend the standalone reference is already UV-safe or production-mapped. Actual atlas and UV ownership belongs to LazyDesigner Texturing.

## Native-size review

Always judge final readability at actual target scale. Enlarged nearest-neighbor previews are useful for inspection but cannot substitute for native-size validation.

## Avoid

```text
fake voxel extrusion on 2D icons
smooth vector edges with a pixel overlay
mixed pixel scales
photographic texture pasted into pixel art
uncontrolled dithering
micro-noise that disappears at native size
high-resolution detail that defeats Minecraft readability
```