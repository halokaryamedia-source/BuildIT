# Pixel Art Authoring Specification

## Purpose

Define the canonical production contract for standalone pixel-art assets before downstream Texturing, Particle, or other authoring stages.

## 1. Artifact classification

Classify once:

```text
ICON
OBJECT / PROP
SPRITE
TILE / PATTERN
TEXTURE_REFERENCE
AUDIT / REVISION
```

Do not keep reclassifying after every change. Reclassify only when the requested deliverable materially changes.

## 2. Target mode

Resolve one:

```text
GENERIC_PIXEL
MINECRAFT_NATIVE
MIVUBI_HD_PIXEL
```

Existing project style or explicit user instruction overrides defaults.

## 3. Grid contract

A pixel-art asset must have:

- explicit integer canvas dimensions;
- one coherent visible pixel scale;
- no accidental sub-pixel detail;
- no interpolation blur in the production result;
- deliberate alpha/background behavior.

Suggested planning tiers:

```text
MICRO      8×8 / 12×12
ICON       16×16
DETAILED   24×24 / 32×32
HD_PIXEL   48×48 / 64×64
SPECIAL    explicit target dimensions
```

These tiers are not mandatory export sizes. Use the smallest viable grid.

## 4. Composition contract

Before secondary detail, establish:

```text
subject occupancy
visual center
orientation / projection
primary axis
negative-space landmarks
major protrusions
padding / safe edge distance
```

GUI or item icons should remain readable without relying on decorative backgrounds.

## 5. Silhouette contract

The silhouette should communicate the object class before color and surface decoration whenever the subject allows it.

A silhouette failure is owned by shape/composition, not by shading.

## 6. Cluster contract

Pixels are grouped by visual function:

```text
PRIMARY MASS
SECONDARY MASS
SHADOW MASS
LIGHT MASS
EDGE / OUTLINE
DETAIL CLUSTER
ACCENT
```

The smallest cluster should still have a reason: identity, form transition, material cue, animation cue, or controlled texture.

Random noise is not detail.

## 7. Palette contract

Use the smallest palette that preserves target readability.

Possible roles:

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

Not every role must exist. Do not add colors only to make the palette appear sophisticated.

For a series, maintain relative contrast and hue logic across assets.

## 8. Shading contract

Lighting should support volume without becoming smooth-paint rendering.

Prefer stepped cluster transitions. Dithering is conditional and should communicate a deliberate material or gradient transition, not hide uncertain shading.

Do not bake scene-specific dramatic lighting into a neutral production asset unless explicitly requested.

## 9. Material contract

Material identity should survive grayscale/value inspection where practical and should not depend solely on hue.

Use appropriate combinations of:

- highlight size and sharpness;
- local contrast;
- edge behavior;
- transparency / cutout;
- repetitive structure;
- cluster direction;
- reflection cues.

## 10. Reference conversion

For source-image conversion:

```text
extract supported landmarks
→ simplify photography / smooth forms
→ preserve proportion hierarchy
→ resolve target grid
→ rebuild clusters deliberately
→ preserve material/color identity
→ compare at target scale
```

Never define success as visual similarity only when viewed enlarged. Pixel assets must work at actual usage size.

## 11. Series Style Lock

A repeated asset family may establish:

```text
canvas dimensions
subject occupancy
outline treatment
palette family
light direction
contrast range
perspective
cluster density
material highlight language
```

Keep this profile concise and reuse it. Do not create a second styling system inside downstream Texturing.

## 12. Animation contract

For sprite animation, preserve:

- anchor point;
- apparent volume;
- palette;
- visible pixel scale;
- identity landmarks;
- intended timing.

Author key poses first. Add breakdowns only when motion readability requires them.

## 13. Alpha/background contract

Transparent-background output should remain truly transparent. Do not bake checkerboards, white matte halos, or generated background residue into production pixels.

Opaque backgrounds are allowed only when they are part of the requested asset.

## 14. Completion

An asset is ready for review when applicable QA gates are `PASS` and no BLOCKING ambiguity remains.

Visual preference changes requested after that point are revisions, not proof that the original authoring process was invalid.