# Pixel Art Authoring Specification

## Purpose

Define the canonical production contract for standalone pixel-art assets before downstream Texturing, Particle, or other authoring stages.

The goal is deliberate pixel craftsmanship, not merely a low-resolution appearance.

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

When Minecraft-facing, also resolve the visual family when material:

```text
ITEM ICON
BLOCK TEXTURE
ENTITY / SKIN TEXTURE
GUI / SYMBOL
PARTICLE TEXTURE
REFERENCE-ONLY PIXEL ART
```

Do not assume these families share one identical visual grammar.

## 3. Artist judgment hierarchy

When visual priorities conflict, prefer:

```text
READABILITY
> FORM
> IDENTITY
> MATERIAL
> STYLE CONSISTENCY
> DETAIL
> DECORATION
```

When detail is uncertain:

```text
REMOVE DETAIL
→ CHECK AT NATIVE SCALE
→ RESTORE ONLY IF FORM / IDENTITY / MATERIAL READ DECREASES
```

More pixels, colors, highlights, or texture marks are not evidence of higher quality.

## 4. Grid contract

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

Do not enlarge the canvas mainly to avoid difficult simplification decisions.

## 5. Composition contract

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

## 6. Silhouette contract

The silhouette should communicate the object class before color and surface decoration whenever the subject allows it.

A silhouette failure is owned by shape/composition, not by shading.

Identity-critical exaggeration is allowed when it improves native-scale recognition without changing the subject class.

## 7. Cluster and edge-topology contract

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

Professional edge cleanup must inspect:

```text
JAGGIES
BANDING
HUGGING
TANGENTS
STAIRCASE RHYTHM
CURVE ECONOMY
CORNER CONTROL
CLUSTER INTERLOCK
```

Do not mechanically smooth every staircase. The goal is intentional rhythm and readable form, not mathematically uniform diagonals.

## 8. Palette contract

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

Think in perceptual ramps and shared relationships, not isolated swatches. Apply when useful:

```text
RAMP SHARING
RAMP CROSSING
VALUE COMPRESSION
ACCENT EXCLUSIVITY
PERCEPTUAL CLUSTERING
PALETTE PRUNING
```

For a series, maintain relative contrast, saturation hierarchy, accent priority, and hue logic across assets.

## 9. Shading contract

Lighting should support volume without becoming smooth-paint rendering.

Use the causal order:

```text
LIGHT SOURCE
→ FORM PLANES / VOLUME
→ SHADOW MASS
→ LIGHT MASS
→ MATERIAL RESPONSE
```

Prefer stepped cluster transitions. Dithering is conditional and should communicate a deliberate material or transition constraint, not hide uncertain shading.

Reject unsupported pillow shading: dark outer rings grading toward a bright center merely because the shape is enclosed.

Do not bake scene-specific dramatic lighting into a neutral production asset unless explicitly requested.

## 10. Outline contract

Outline is functional, not decorative by default.

Distinguish when applicable:

```text
OUTER CONTOUR
INTERNAL CONTOUR
CONTACT EDGE
LIGHT-FACING EDGE
SHADOW EDGE
BACKGROUND-DEPENDENT EDGE
```

A series may use full outline, selective outline, material-colored edge, or value-separated no-outline treatment, but local edge decisions should still support form and readability.

Avoid outline hugging/banding that creates a second contour with no visual purpose.

## 11. Material contract

Material identity should survive grayscale/value inspection where practical and should not depend solely on hue.

Use appropriate combinations of:

- highlight size and sharpness;
- local contrast;
- edge behavior;
- transparency / cutout;
- repetitive structure;
- cluster direction;
- reflection cues.

Material cues must remain appropriate to the target grid. Do not simulate photographic micro-detail that collapses at native scale.

## 12. Reference conversion

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

Unsupported photographic detail should be simplified rather than replaced with invented decoration.

## 13. Minecraft-specific contract

Minecraft style is not equivalent to `blocky + low resolution`.

Preserve the selected family grammar:

```text
ITEM ICON
→ isolated semantic object, strong silhouette, compact material cues

BLOCK TEXTURE
→ surface-first, repeat-safe, no dominant accidental wallpaper landmark

ENTITY / SKIN TEXTURE
→ mapped-part readability, restrained noise, stable identity regions

GUI / SYMBOL
→ semantic clarity, geometric balance, strong figure/ground separation

PARTICLE TEXTURE
→ strong alpha silhouette / frame readability, effect-owned visual role
```

For `MINECRAFT_NATIVE`, prefer compact palette, restrained detail, large readable clusters, and vanilla-compatible abstraction.

For `MIVUBI_HD_PIXEL`, retain the same structural discipline while allowing richer controlled material definition.

## 14. Tile / repeating texture contract

A repeating tile must pass both local seam logic and macro repetition review.

Inspect:

```text
EDGE CONTINUITY
DOMINANT LANDMARK SUPPRESSION
EDGE DISTRIBUTION
FREQUENCY BALANCE
MOTIF PHASE
NEIGHBOR VARIATION
LARGE-AREA RHYTHM
```

Review a repeated field such as `3×3` or `5×5` when macro rhythm is material. A tile that looks good alone but produces obvious wallpaper repetition is not complete.

## 15. Series Style Lock

A repeated asset family may establish:

```text
canvas dimensions
subject occupancy
outline treatment
palette relationship
light direction
contrast range
perspective
cluster density
material highlight language
alpha convention
```

Keep this profile concise and reuse it. Do not create a second styling system inside downstream Texturing.

Subject-specific exceptions are allowed when necessary for recognition or material behavior; they must not silently redefine the family grammar.

## 16. Animation contract

For sprite animation, preserve:

- anchor point;
- apparent volume;
- palette;
- visible pixel scale;
- identity landmarks;
- intended timing.

Author key poses first. Add breakdowns only when motion readability requires them.

Do not redraw unrelated clusters between frames.

## 17. Alpha/background contract

Transparent-background output should remain truly transparent. Do not bake checkerboards, white matte halos, or generated background residue into production pixels.

Opaque backgrounds are allowed only when they are part of the requested asset.

## 18. Completion

An asset is ready for review when applicable QA gates are `PASS` and no BLOCKING ambiguity remains.

Visual preference changes requested after that point are revisions, not proof that the original authoring process was invalid.