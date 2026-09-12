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

## Value hierarchy

Resolve form first through value grouping. Hue variation should support material or identity, not compensate for weak value structure.

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

## Series consistency

Within a Style Lock, preserve:

- relative shadow depth;
- highlight intensity;
- saturation hierarchy;
- accent priority;
- material grammar.

A new material may extend the palette, but it should still look like it belongs to the same set.