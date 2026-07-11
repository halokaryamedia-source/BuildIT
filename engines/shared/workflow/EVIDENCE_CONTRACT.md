# Evidence Contract

Use stable canonical filenames for stage evidence. Revision-only comparison files may use a scoped prefix but must not replace approved canonical evidence until the revision is accepted.

## Geometry

Required canonical files:

```text
geometry_front.png
geometry_left.png
geometry_back.png
geometry_top.png
geometry_front_left_3_4.png
geometry_visual_report.json
geometry_report.json
```

`geometry_visual_report.json` must bind the visual judgment to:

- project UUID;
- current Geometry fingerprint;
- approved Reference Visual SHA-256;
- compared views;
- visual result;
- revision scope;
- structured issues;
- rotation audit;
- rotation-aware world bounds.

Any Geometry mutation after the visual report makes it stale. A stale report cannot authorize review or approval.

`geometry_report.json` must keep these statuses separate:

```text
structural_status
visual_status
rotation_status
evidence_status
result
```

Final Geometry `result` is PASS only when required statuses pass.

## Texture

```text
texture_atlas.png
texture_front.png
texture_left.png
texture_back.png
texture_front_left_3_4.png
texture_report.json
```

## Animation

Only when required: neutral pose, hierarchy, pivots, required clip previews, and `animation_report.json`.

## Final

Five standard views, final atlas, `validation_report.json`, and `completed_VALIDATION.md`.

## Focused revisions

Recapture only affected views plus one comparison view proving no collateral drift. Major-form revisions must capture Left, Front, Top / Footprint, and final full five-view evidence before review.
