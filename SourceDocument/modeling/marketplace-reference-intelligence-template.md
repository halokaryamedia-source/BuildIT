# Marketplace Reference Intelligence — Conditional Gap Intake

Do not use this template for every new model.

The approved reference package normally already contains the required intelligence.

Use this document only when a real implementation gap remains after reading:

```text
PRODUCTION_CONTEXT.md
<asset>_reference_visual.png
reference_manifest.json
active-stage category document
```

## 1. Gap Definition

```text
Active stage:
Missing decision:
Why existing package does not resolve it:
Technical consequence:
Can work continue safely without it: Yes / No
```

If the answer is already present in the approved package, stop and do not create this intake.

## 2. Minimal Reference Evidence

Use the smallest set needed:

```text
Primary approved source:
Relevant visual panel/view:
Optional quality calibration sample:
Optional technical sample:
```

Samples may inform quality and execution behavior only. They cannot replace the approved subject identity or dimensions.

## 3. Resolve Only the Active Gap

Possible decision fields:

```text
Asset role:
Scale/envelope:
Silhouette priority:
Geometry budget:
Required hierarchy/attachment:
Atlas baseline:
UV reuse policy:
Material family:
Focal texel area:
Animation family/pivot:
Validation evidence:
```

Fill only fields needed to resolve the current blocker.

## 4. Stage Consequence

### Geometry

```text
Affected mass/part:
Bounding-box or attachment consequence:
Must be geometry:
Must remain texture-only:
Accepted areas to preserve:
Required comparison views:
```

### Texture

```text
Affected material/face:
Atlas/UV consequence:
Unique or mirrored:
Palette/material consequence:
Accepted areas to preserve:
Required atlas/model evidence:
```

### Animation

```text
Affected group/chain:
Pivot/axis/range consequence:
Neutral-pose consequence:
Accepted areas to preserve:
Required motion evidence:
```

### Final Validation

```text
Failed contract item:
Local repair or stage reopen:
Required evidence:
Rollback checkpoint:
```

## 5. Decision Output

```text
Resolution:
Confidence: HIGH / MEDIUM / LOW
Authority used:
State/OpenSpec update required:
Stage reopen required: Yes / No
Smallest safe next action:
Stop condition:
```

A low-confidence answer that affects identity, global scale, broad silhouette, hierarchy architecture, material identity, or required motion becomes:

```text
REFERENCE_CONFLICT
```

## Ponytail Rule

This template must reduce ambiguity for current work.

Do not use it to create a broad marketplace research exercise, duplicate Production Context, or add optional quality features outside the active stage.
