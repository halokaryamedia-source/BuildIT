# Stage Quality Scorecard

Use one compact scorecard at the end of each user-visible stage.

Do not create a separate scorecard for internal passes.

## Stage Identity

```text
Asset:
Stage: GEOMETRY / TEXTURE / ANIMATION / FINAL_VALIDATION
Session ID:
Project UUID:
Checkpoint:
Reference Visual:
Active category document:
Date:
```

## Result Values

- `PASS`
- `REVISION_REQUIRED`
- `BLOCKER`

Rules:

- `PASS`: required output and evidence are ready for user review.
- `REVISION_REQUIRED`: one or more named local corrections are required.
- `BLOCKER`: safe continuation is not possible.
- Maximum automatic local fixes during Final Validation: 2.
- Same blocker after two focused attempts: stop and request strategy reset.

## Ponytail Evidence

```text
Approved goal served:
Smallest complete batch used:
Reused work/checkpoints/tools:
Unnecessary work avoided:
Accepted areas preserved:
Stop condition reached: Yes / No
```

## Geometry Scorecard

Fill only for Geometry.

```text
Scale envelope: PASS / REVISION_REQUIRED / BLOCKER
Front silhouette: PASS / REVISION_REQUIRED / BLOCKER
Left Side silhouette: PASS / REVISION_REQUIRED / BLOCKER
Back silhouette: PASS / REVISION_REQUIRED / BLOCKER
Top / Footprint: PASS / REVISION_REQUIRED / BLOCKER
Front-left 3/4: PASS / REVISION_REQUIRED / BLOCKER
Hierarchy/attachments: PASS / REVISION_REQUIRED / BLOCKER
Ground contacts: PASS / REVISION_REQUIRED / BLOCKER
Collision/z-fighting: PASS / REVISION_REQUIRED / BLOCKER
Cube-purpose discipline: PASS / REVISION_REQUIRED / BLOCKER
Geometry-vs-texture split: PASS / REVISION_REQUIRED / BLOCKER
```

## Texture Scorecard

Fill only for Texture.

```text
Atlas size/strategy: PASS / REVISION_REQUIRED / BLOCKER
UV compactness: PASS / REVISION_REQUIRED / BLOCKER
Safe mirroring/reuse: PASS / REVISION_REQUIRED / BLOCKER
Focal texel density: PASS / REVISION_REQUIRED / BLOCKER
Palette match: PASS / REVISION_REQUIRED / BLOCKER
Material zones: PASS / REVISION_REQUIRED / BLOCKER
Pixel sharpness: PASS / REVISION_REQUIRED / BLOCKER
Visible seams: PASS / REVISION_REQUIRED / BLOCKER
Alpha/emissive behavior: PASS / REVISION_REQUIRED / BLOCKER
Classic Bedrock compliance: PASS / REVISION_REQUIRED / BLOCKER
```

## Animation Scorecard

Fill only when Animation is required.

```text
Hierarchy: PASS / REVISION_REQUIRED / BLOCKER
Pivots: PASS / REVISION_REQUIRED / BLOCKER
Allowed axes/ranges: PASS / REVISION_REQUIRED / BLOCKER
Required clips/samples: PASS / REVISION_REQUIRED / BLOCKER
Neutral-pose recovery: PASS / REVISION_REQUIRED / BLOCKER
Ground contact: PASS / REVISION_REQUIRED / BLOCKER
Clipping: PASS / REVISION_REQUIRED / BLOCKER
Rigid-cuboid behavior: PASS / REVISION_REQUIRED / BLOCKER
```

When skipped:

```text
Animation status: ANIMATION_SKIPPED
Reason: not required by approved package
```

## Final Validation Scorecard

Fill only for Final Validation.

```text
Package/file integrity: PASS / REVISION_REQUIRED / BLOCKER
Final .bbmodel: PASS / REVISION_REQUIRED / BLOCKER
Textures: PASS / REVISION_REQUIRED / BLOCKER
Five standard views: PASS / REVISION_REQUIRED / BLOCKER
Reference match: PASS / REVISION_REQUIRED / BLOCKER
Geometry contract: PASS / REVISION_REQUIRED / BLOCKER
Texture contract: PASS / REVISION_REQUIRED / BLOCKER
Animation contract or skip: PASS / REVISION_REQUIRED / BLOCKER
Blockbench validator: PASS / REVISION_REQUIRED / BLOCKER
Naming/export readiness: PASS / REVISION_REQUIRED / BLOCKER
Completed VALIDATION.md: PASS / REVISION_REQUIRED / BLOCKER
```

## Critical Issues

Maximum two local issues in one revision cycle.

```text
1. Stage:
   Part:
   Issue:
   Expected:
   Do not change:
   Verification:

2. Stage:
   Part:
   Issue:
   Expected:
   Do not change:
   Verification:
```

Broad issues must reopen the relevant earlier stage instead of being hidden in this scorecard.

## Evidence

```text
Required evidence present: Yes / No
Evidence paths:
- ...
Missing evidence:
- ...
```

## Stage Decision

```text
Overall result: PASS / REVISION_REQUIRED / BLOCKER
Blockers:
Required revisions:
Deferred not required:
User decision: PENDING / APPROVED / REVISION_REQUESTED
Next safe action:
```

## Compact User Review Report

```text
Stage:
Status:
Completed:
Preserved:
Evidence:
Issues:
Next user action: APPROVED or REVISION: ...
```

## Acceptance Criteria

- Only the active stage section is filled.
- Result is explicit.
- Required evidence exists.
- Accepted work is preserved.
- Revision scope is local and named.
- No internal-pass approval is requested.
