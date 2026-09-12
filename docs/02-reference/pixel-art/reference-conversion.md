# Pixel Art Reference Conversion

## Purpose

Convert photographic, illustrated, rendered, or previously generated source imagery into deliberate pixel art without treating pixelation as the authoring method.

The goal is not literal pixel-level copying. The goal is to preserve the source's identity through the target grid, target use, and target visual language.

## Conversion Route

```text
source evidence
→ identify target use / target family
→ separate invariant identity from incidental scene detail
→ rank landmarks by importance
→ choose target grid
→ rebuild silhouette + negative space
→ rebuild value groups + palette ramps
→ rebuild clusters + edge topology
→ translate material cues
→ simplify low-value detail
→ native-scale comparison
→ enlarged grid cleanup
```

## Identity Decomposition

Before authoring, split the source into three evidence layers:

```text
INVARIANT
→ must survive or identity/function changes

SUPPORTING
→ improves recognition/material read when grid allows

INCIDENTAL
→ scene lighting, noise, reflection, clutter, sub-pixel detail
```

Typical INVARIANT evidence includes defining contour, proportion hierarchy, major openings/negative spaces, functional parts, distinctive markings, and identity-critical color regions.

Do not give incidental photographic detail the same authority as invariant identity.

## Evidence Priority

When detail must be removed, preserve in this order unless the user explicitly changes priorities:

```text
function / subject class
→ silhouette
→ proportion hierarchy
→ defining landmark
→ negative-space landmark
→ identity marking / color region
→ material distinction
→ secondary detail
→ decorative micro-detail
```

## Grid-Aware Reconstruction

Never define conversion as:

```text
resize
→ nearest-neighbor
→ cleanup
```

Instead, rebuild for the target grid.

At low resolution:
- exaggerate identity-critical curvature or protrusions when needed for recognition;
- merge tiny adjacent source features into one readable cluster;
- collapse shallow tonal variation into a stronger value group;
- replace photographic reflection with a small material-defining highlight pattern;
- remove detail whose disappearance does not reduce recognition or material read.

A faithful pixel conversion may be less literal than the source while being more faithful to its identity.

## Edge Translation

Continuous source contours must become intentional pixel topology.

Check:

```text
curve rhythm
staircase progression
corner choice
negative-space width
banding / hugging
unwanted tangents
silhouette bumps caused by literal tracing
```

Do not trace every source contour change. Prefer the cleanest pixel contour that preserves the defining form.

## Value and Palette Translation

Photographic tone is not copied one shade at a time.

Resolve broad perceptual groups first:

```text
deep separation / outline when needed
shadow mass
base mass
light mass
accent / identity
specular or emissive only when material/function requires it
```

Build the smallest useful ramps. Merge near-duplicate source tones. Preserve identity-critical hue relationships when they matter more than literal sampled colors.

## Material Translation

Translate materials through pixel-readable cues rather than photographic texture density.

Examples:
- metal → sharper compact highlight + stronger local contrast;
- glass → contour/reflection/alpha relationship rather than noisy transparency;
- cloth → broader folds and quieter value changes;
- wood → directional grouped motifs rather than fine grain noise;
- liquid → readable fill level/mass + selective highlight;
- foliage → grouped organic clusters rather than speckle.

## Photographic Simplification

Discard or compress:
- sensor/compression noise;
- non-defining scene reflections;
- shallow gradients;
- tiny hardware below target readability;
- background clutter;
- texture frequencies that collapse at native scale;
- perspective distortion not needed by the target artifact.

Preserve:
- subject orientation when functionally important;
- defining contour;
- openings and major negative spaces;
- major color/value regions;
- functional parts;
- distinctive material cues;
- supported asymmetry.

## Minecraft Conversion

When target mode is Minecraft-facing, resolve the actual family first:

```text
ITEM ICON
BLOCK TEXTURE
ENTITY / SKIN TEXTURE
GUI / SYMBOL
PARTICLE TEXTURE
REFERENCE-ONLY PIXEL ART
```

Do not convert every source into the same generic "Minecraft pixel" treatment. Each family has different occupancy, repetition, edge, and material constraints.

## Source Conflicts

If multiple references disagree, do not average them blindly.

Prefer:
1. explicit current user direction;
2. reference matching the requested view/use;
3. already accepted identity/style authority;
4. facts consistently supported across references.

Identity-critical unresolved conflict is `BLOCKED`. Non-critical uncertainty may be simplified provisionally.

## Validation

Review in this order:

```text
native target scale
→ identity / function / value / material readability

enlarged nearest-neighbor
→ cluster / edge / alpha / topology defects

side-by-side with source
→ confirm invariants survived without reintroducing photographic noise
```

A conversion that looks faithful only when enlarged but loses identity at target size is not complete.
