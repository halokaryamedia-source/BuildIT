# Pixel Art Reference Conversion

## Purpose

Convert a photographic, illustrated, rendered, or previously generated source into deliberate pixel art without treating pixelation as the authoring method.

## Conversion route

```text
source evidence
→ identify target use
→ extract supported identity landmarks
→ simplify continuous form
→ choose target grid
→ rebuild silhouette
→ rebuild palette + clusters
→ translate materials
→ native-size comparison
```

## Evidence hierarchy

Prioritize:

```text
silhouette
→ proportion hierarchy
→ defining landmarks
→ material separation
→ color identity
→ secondary details
```

When detail must be removed because of grid limits, preserve higher-priority evidence first.

## Photographic simplification

Discard or compress:

- sensor noise;
- scene reflections that are not material-defining;
- shallow tonal gradients;
- tiny hardware details below target readability;
- background clutter;
- perspective distortion not required by the target icon/sprite.

Preserve:

- subject orientation;
- defining contour;
- openings and negative spaces;
- major color regions;
- functional parts;
- distinctive material cues.

## Source conflicts

If multiple references disagree, do not average them blindly. Prefer the reference that best matches the requested view/use, or preserve only facts supported across the references.

Unresolved identity-critical conflict is `BLOCKED`; non-critical uncertainty may be simplified provisionally.

## Validation

Compare the result at target scale, then inspect enlarged nearest-neighbor view only for grid/cluster defects.

A conversion that looks faithful only when enlarged but loses identity at target size is not complete.