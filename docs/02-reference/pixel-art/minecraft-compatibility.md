# Minecraft Pixel Art Compatibility

## Purpose

Translate deliberate pixel art into a Minecraft-compatible visual language without reducing the work to generic voxel styling.

Minecraft style is not one universal look. Resolve the asset family first because visual grammar differs by use:

```text
ITEM ICON
BLOCK TEXTURE
ENTITY / SKIN TEXTURE
GUI / SYMBOL
PARTICLE TEXTURE
REFERENCE-ONLY PIXEL ART
```

Do not apply one family's conventions blindly to another.

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
- deliberately stepped edges;
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
- readability at actual target size;
- no painterly micro-detail inflation.

## Minecraft visual grammar

Evaluate five layers:

```text
FORM READ
VALUE LANGUAGE
MATERIAL ABSTRACTION
NOISE DENSITY
EDGE LANGUAGE
```

### Form read

The main mass, function, and characteristic silhouette should survive before surface detail. Minecraft-facing art should favor readable shape blocks over literal photographic contour fidelity.

### Value language

Use a small number of clearly separated value groups. Avoid soft tonal modeling that collapses at game scale.

### Material abstraction

Compress materials into a few repeatable cues rather than photoreal simulation. Example: metal can read through one sharp highlight cluster and stronger contrast; cloth through broader quiet transitions; glass through edge/reflection logic and alpha.

### Noise density

Texture variation must operate at the asset's real scale. Avoid high-frequency noise that turns into shimmer or mud at normal viewing size.

### Edge language

Contours, internal separations, and diagonals should use deliberate staircase rhythm. Do not mix smooth/vector-derived edges with hand-authored pixel clusters.

## Family-specific guidance

### Item icon

Prioritize silhouette, functional exaggeration, diagonal/orientation clarity, compact material cues, and controlled outline logic. Item readability wins over literal proportion.

### Block texture

Prioritize material field readability, even visual frequency, repeat safety, restrained landmarks, and low repetition artifacts across large tiled surfaces.

### Entity / skin texture

Prioritize semantic region separation, readable face/marking identity, consistent pixel density, and mapped-surface continuity. Do not solve geometry problems with paint.

### GUI / symbol

Prioritize semantic clarity, geometric balance, strong figure/ground separation, stable visual weight, and restrained decoration.

### Particle texture

Prioritize silhouette/alpha quality, atlas-frame consistency when animated, emissive/color intent, and readability under scale changes. Particle motion semantics remain Particle-owned.

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

## Selective outline logic

Outlines are conditional, not mandatory.

Distinguish:

```text
OUTER CONTOUR
INTERNAL CONTOUR
CONTACT EDGE
LIGHT-FACING EDGE
SHADOW EDGE
BACKGROUND-DEPENDENT EDGE
```

Use darker or stronger edges where separation is needed; lighten, colorize, or omit edges where light/material/background already provides separation.

Do not create broken outlines randomly. Any outline break should improve form, lighting, material, or figure/ground readability.

## Curves and diagonals

Use consistent staircase rhythm. A curve should look intentionally quantized, not randomly jagged.

At small grids, prioritize the characteristic arc or diagonal over literal contour fidelity.

## Material behavior

Avoid using the same highlight grammar for every material. Minecraft-style simplification still benefits from material-specific cluster logic.

## Deliberate simplification

When detail competes with readability, apply this priority:

```text
READABILITY
> FORM
> IDENTITY
> MATERIAL
> STYLE
> DETAIL
> DECORATION
```

When uncertain, remove the detail first, inspect at native scale, and restore it only if identity/function materially decreases.

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
one material/highlight grammar applied to every asset family
```