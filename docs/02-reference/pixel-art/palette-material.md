# Pixel Art Palette and Material

## Palette roles

Use only the roles needed by the asset:

```text
DEEP SHADOW / OUTLINE
SHADOW
BASE
LIGHT
SPECULAR
ACCENT
IDENTITY
EMISSIVE
```

A role can share a color with another role when the asset remains readable. More colors are not inherently better.

## Palette ramps

Think in reusable ramps, not isolated color labels.

A ramp is an ordered perceptual relationship such as:

```text
DEEP SHADOW
→ SHADOW
→ BASE
→ LIGHT
→ SPECULAR
```

The ramp may hue-shift as value changes. It does not need equal numeric spacing.

Professional palette decisions should consider:

```text
RAMP SHARING
RAMP CROSSING
VALUE COMPRESSION
ACCENT EXCLUSIVITY
PERCEPTUAL CLUSTERING
```

### Ramp sharing

Different materials may reuse one or more colors when doing so preserves cohesion and readability. Do not allocate a unique full ramp to every surface by default.

### Ramp crossing

One material's light may reuse or approach another material's base when the relationship is visually coherent. Avoid rigidly separating every material into isolated color families.

### Value compression

At tiny scales, reduce unnecessary intermediate shades. Preserve the strongest value decisions that communicate form and identity.

### Accent exclusivity

Reserve the highest saturation, brightest emissive, or strongest local contrast for genuinely important identity/function cues. Do not distribute focal accents uniformly.

### Perceptual clustering

Several neighboring colors may still read as one mass at native scale. Judge the perceptual result, not the numeric palette count alone.

## Value hierarchy

Resolve form first through value grouping. Hue variation should support material or identity, not compensate for weak value structure.

## Identity color

Preserve subject-specific color when it is a defining cue, such as a functional accent, distinctive liquid, team/faction marker, warning color, or characteristic finish. Identity color remains subordinate to silhouette and value readability.

If two important colors collapse to the same value, use controlled value adjustment, spacing, outline, or a clearer cluster boundary rather than arbitrary palette expansion.

Keep authority explicit:

```text
REFERENCE_SUPPORTED
EXISTING_STYLE_SUPPORTED
PROVISIONAL
```

Never present a provisional shade as reference-accurate.

## Hue shifting

Controlled hue shifting may improve depth and material separation. Keep it subordinate to the established palette family and target mode.

Avoid arbitrary rainbow ramps or near-duplicate hues that do not change the read.

## Material cues

Material identity should come from a combination of:

```text
highlight sharpness
highlight size
local contrast
cluster orientation
edge treatment
transparency/cutout
repeating structure
specular placement
```

Typical tendencies:

```text
METAL
→ sharp small highlights, stronger local contrast

GLASS
→ edge/reflection clusters, controlled transparency/read-through

PLASTIC
→ clean broad highlight, lower texture noise

WOOD
→ warm grouped values, restrained directional grain

STONE
→ blocky irregular clusters with restrained highlights

CLOTH
→ broader shadow/light masses, limited hard specular

LEATHER
→ compact warm highlights, darker edge/crease accents

LIQUID
→ coherent fill mass, container-aware level, selective highlight

FOLIAGE
→ grouped organic silhouette rhythm, not uniform speckle

EMISSIVE
→ high-value identity cluster with surrounding contrast support
```

These are heuristics, not fixed palette recipes.

## Dithering

Use dithering only when it communicates a deliberate transition, material, or limited-palette constraint.

Do not use dithering as a default substitute for well-shaped clusters.

## Palette pruning

Before finalization, remove any color whose loss does not materially reduce:
- form readability;
- material distinction;
- identity;
- target compatibility.

If two shades perform the same perceptual role at native size, merge them unless a deliberate texture/style reason requires both.

## Series consistency

Within a Style Lock, preserve:

- relative shadow depth;
- highlight intensity;
- saturation hierarchy;
- accent priority;
- material grammar;
- ramp relationships.

A new material may extend the palette, but it should still look like it belongs to the same set.