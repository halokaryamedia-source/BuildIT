# Pixel Art Workflow

## 1. Intake

Resolve only what changes production:

```text
subject
artifact class
target mode
target dimensions or usage context
reference source when provided
transparent vs opaque background
series/style-lock membership
animation requirement if any
Minecraft visual family when material
```

If dimensions are unknown and not blocking, choose the smallest reversible provisional grid that can represent the identity.

## 2. Classify

Choose exactly one primary artifact class:

```text
ICON
OBJECT / PROP
SPRITE
TILE / PATTERN
TEXTURE_REFERENCE
AUDIT / REVISION
```

## 3. Resolve target grammar

Choose one target mode:

```text
GENERIC_PIXEL
MINECRAFT_NATIVE
MIVUBI_HD_PIXEL
```

For Minecraft-facing work, also resolve the family when it changes visual decisions:

```text
ITEM ICON
BLOCK TEXTURE
ENTITY / SKIN TEXTURE
GUI / SYMBOL
PARTICLE TEXTURE
REFERENCE-ONLY PIXEL ART
```

Existing style evidence beats generic defaults.

## 4. Grid and composition

Set:

```text
canvas dimensions
subject occupancy
projection / orientation
safe padding
primary axis
```

Review the subject at 100% target scale before adding micro-detail.

Use the smallest grid that preserves the intended function. Do not increase resolution merely to avoid simplification.

## 5. Silhouette pass

Build only the major masses and negative spaces.

Do not shade an unresolved silhouette.

Result:

```text
SILHOUETTE_READY
or
REVISE_SHAPE
```

## 6. Value and palette-ramp pass

Establish readable value groups before decorative hue variation.

Build the minimum useful palette as relationships rather than isolated swatches. Reuse ramps across materials when that improves cohesion; introduce material-specific branches only when needed.

For an existing series, reuse the Style Lock palette relationship unless the subject requires a justified material-specific extension.

## 7. Cluster construction pass

Translate broad masses into deliberate clusters.

Prefer clean interlocking clusters over isolated pixels. Add material cues only when they improve form, recognition, depth, or identity.

Avoid per-pixel decoration loops.

## 8. Edge-topology pass

Inspect contour and internal boundaries for:

```text
jaggies
banding
hugging
tangents
staircase rhythm
curve economy
corner control
cluster interlock
```

Correct only defects that weaken the intended form. Do not mechanically regularize every diagonal or curve.

## 9. Lighting / shading pass

Use:

```text
light source
→ form planes / volume
→ shadow mass
→ light mass
→ material response
```

Reject unsupported pillow shading and highlight patterns that do not correspond to form or material.

Keep shading subordinate to silhouette and identity.

## 10. Outline / separation pass

When outlines are used, distinguish their function:

```text
outer contour
internal contour
contact edge
light-facing edge
shadow edge
background-dependent edge
```

Avoid outlining every internal boundary equally. Prevent outline hugging or doubled contours that create banding.

## 11. Identity pass

Add only supported identity landmarks:

- symbols;
- characteristic hardware;
- key color accents;
- openings;
- handles;
- distinctive curvature;
- functional features.

Reference-driven assets must preserve evidence priority over decoration.

## 12. Simplification pass

Before secondary polish, remove nonessential detail and inspect again at native scale.

Use:

```text
REMOVE DETAIL
→ CHECK READABILITY / FORM / IDENTITY / MATERIAL
→ RESTORE ONLY WHAT IS NEEDED
```

This pass exists to prevent decorative density from masquerading as quality.

## 13. Conditional target pass

Load only if required:

```text
sprite animation
series style-lock propagation
tile repetition
texture-reference handoff
particle texture handoff
```

For repeating textures, review both the tile itself and a repeated `3×3` or `5×5` field when macro repetition is material.

For Minecraft-facing work, verify the selected family grammar rather than applying a generic blocky filter.

## 14. QA

Run applicable gates from `qa.md` once near finalization.

`REVISE` should produce one coherent causal correction, not a new speculative variation.

Use the professional craft gates that apply: native-scale read, edge topology, shading causality, palette/ramp economy, detail necessity, Minecraft-family compatibility, and macro repetition for tiles.

## 15. Delivery

Deliver the requested artifact only.

Do not add ZIPs, atlases, sprite sheets, manifests, or handoff packages unless the target explicitly needs them.

For downstream Texturing or Particle work, pass compact production state instead of the entire Pixel Art documentation set.