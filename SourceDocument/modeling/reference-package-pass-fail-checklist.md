# Reference Package Pass/Fail Checklist

Use this once when a new approved reference ZIP is imported.

## Required Files

```text
PRODUCTION_CONTEXT.md
<asset>_reference_visual.png
GEOMETRY.md
TEXTURING.md
ANIMATION.md
VALIDATION.md
reference_manifest.json
CODEX_REFERENCE_HANDOFF.md
```

Legacy numbered reference sheets are not required for new sessions.

## File Status

Use:

```text
file: PASS / REVISION_REQUIRED / BLOCKER — note
```

## Package Integrity

| Check | Result |
| --- | --- |
| All required files exist and open | PASS / BLOCKER |
| Manifest schema and JSON are valid | PASS / BLOCKER |
| Filenames match manifest | PASS / BLOCKER |
| Asset ID/display name consistent | PASS / BLOCKER |
| Package target is supported | PASS / BLOCKER |
| Validation status is PENDING_BUILD | PASS / BLOCKER |

## Production Context Checks

| Check | Result |
| --- | --- |
| Intended use and role are clear | PASS / BLOCKER |
| Scale basis and dimensions are clear | PASS / BLOCKER |
| Front direction and neutral pose are clear | PASS / BLOCKER |
| Interaction/attachment requirements are clear | PASS / BLOCKER |
| Geometry-vs-texture logic is clear | PASS / BLOCKER |
| Animation requirement is clear | PASS / BLOCKER |
| No unresolved high-impact blocker remains | PASS / BLOCKER |

## Reference Visual Checks

| Check | Result |
| --- | --- |
| Correct asset identity | PASS / BLOCKER |
| Left Side, Front, Back, Top/Footprint, and Front-left 3/4 are present | PASS / BLOCKER |
| Views show one consistent model | PASS / BLOCKER |
| Scale label matches Production Context | PASS / BLOCKER |
| Major silhouette and attachments are readable | PASS / BLOCKER |
| No critical camera or layout drift | PASS / BLOCKER |

## Geometry Checks

| Check | Result |
| --- | --- |
| Global envelope is defined | PASS / BLOCKER |
| Build order is defined | PASS / BLOCKER |
| Primary masses and part dimensions are defined | PASS / BLOCKER |
| Hierarchy and attachments are defined | PASS / BLOCKER |
| Ground/contact logic is defined | PASS / BLOCKER |
| Geometry-only and texture-only details are separated | PASS / BLOCKER |
| Forbidden micro-cubes are defined | PASS / BLOCKER |

## Texturing Checks

| Check | Result |
| --- | --- |
| Texture style and atlas are defined | PASS / BLOCKER |
| UV strategy is defined | PASS / BLOCKER |
| Palette/material zones are defined | PASS / BLOCKER |
| Mirrored and unique areas are defined | PASS / BLOCKER |
| Alpha/emissive behavior is explicit | PASS / BLOCKER |
| Classic Bedrock only; no PBR/Vibrant Visuals | PASS / BLOCKER |

## Animation Checks

| Check | Result |
| --- | --- |
| Animation required or skipped is explicit | PASS / BLOCKER |
| Required groups/pivots are defined when relevant | PASS / BLOCKER |
| Motion chains and axes are defined when relevant | PASS / BLOCKER |
| Neutral-pose and ground-contact rules are defined | PASS / BLOCKER |
| Clipping risks are defined | PASS / BLOCKER |

## Validation Checks

| Check | Result |
| --- | --- |
| Required evidence is defined | PASS / BLOCKER |
| Geometry, texture, and animation tests are defined | PASS / BLOCKER |
| PASS / REVISION_REQUIRED / BLOCKER rules are defined | PASS / BLOCKER |
| Final user review is required | PASS / BLOCKER |

## Conflict Rule

Use:

```text
REFERENCE_CONFLICT
```

when Production Context, Reference Visual, manifest, or category documents materially disagree on identity, scale, form, material behavior, hierarchy, or required motion.

Do not resolve a material conflict by guessing.

## Intake Result

- `PASS`: proceed to one-time pre-modelling gate; no user approval needed for intake.
- `REVISION_REQUIRED`: package can be corrected without changing approved design.
- `BLOCKER`: do not edit Blockbench.
- `REFERENCE_CONFLICT`: return to the reference package owner.

## Minimum Geometry Start Condition

Geometry may start only when:

- package intake is PASS;
- pre-modelling gate is PASS;
- one active session/project is confirmed;
- a persistent start checkpoint is ready.
