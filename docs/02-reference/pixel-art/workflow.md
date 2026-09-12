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

## 3. Target mode

Choose one:

```text
GENERIC_PIXEL
MINECRAFT_NATIVE
MIVUBI_HD_PIXEL
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

## 5. Silhouette pass

Build only the major masses and negative spaces.

Do not shade an unresolved silhouette.

Result:

```text
SILHOUETTE_READY
or
REVISE_SHAPE
```

## 6. Palette pass

Choose the minimum useful role set. Establish value separation before adding decorative colors.

For an existing series, reuse the Style Lock palette relationship unless the subject requires a justified material-specific extension.

## 7. Cluster and material pass

Convert broad regions into intentional pixel clusters.

Add material cues only where they improve recognition, depth, or identity.

Avoid per-pixel decoration loops.

## 8. Identity pass

Add only supported identity landmarks:

- symbols;
- characteristic hardware;
- key color accents;
- openings;
- handles;
- distinctive curvature;
- functional features.

Reference-driven assets must preserve evidence priority over decoration.

## 9. Conditional pass

Load only if requested:

```text
animation
series style-lock propagation
tile repetition
texture-reference handoff
particle texture handoff
```

## 10. QA

Run applicable gates from `qa.md` once near finalization.

`REVISE` should produce one coherent causal correction, not a new speculative variation.

## 11. Delivery

Deliver the requested artifact only.

Do not add ZIPs, atlases, sprite sheets, manifests, or handoff packages unless the target explicitly needs them.

For downstream Texturing or Particle work, pass compact production state instead of the entire Pixel Art documentation set.