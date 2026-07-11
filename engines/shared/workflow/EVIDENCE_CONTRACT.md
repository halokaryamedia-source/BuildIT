# Evidence Contract

Use stable canonical filenames. Revision-only and rotation-check files may use scoped paths but must not replace canonical review evidence until accepted.

## Geometry canonical evidence

```text
geometry_front.png
geometry_left.png
geometry_back.png
geometry_top.png
geometry_front_left_3_4.png
geometry_visual_metrics.json
geometry_visual_diff.png
geometry_visual_report.json
geometry_runtime.json
geometry_report.json
```

### Fixed-scale metrics

`geometry_visual_metrics.json` must be produced by `geometry_projection_region_v2` and bind:

- project UUID;
- current Geometry fingerprint;
- actual approved Reference Visual SHA-256;
- approved coordinate envelope;
- fixed pixels per Blockbench unit;
- approved center axis and ground line;
- `free_rescale_current_model: false`;
- all compared views;
- global silhouette IoU;
- row and column profile errors;
- fixed-scale bounding-box score;
- semantic-region scores and critical-region failures;
- failing view, region, direction, magnitude, affected parts, and recommendation;
- local or major repair route.

Final canonical metrics must include all five standard views. Partial primary/detail comparisons may use the same canonical file during work, but cannot authorize review.

### Diff evidence

`geometry_visual_diff.png` is one compact sheet:

```text
Reference | Current | Difference
```

- green: overlap;
- red: approved silhouette missing from current Geometry;
- blue: current Geometry exceeds the approved silhouette.

Reference and current masks share fixed approved scale. The current mask must not be independently fitted.

### Multimodal report

`geometry_visual_report.json` records Codex's direct image inspection and binds:

- project UUID;
- current Geometry fingerprint;
- approved Reference Visual SHA-256;
- compared views;
- result and revision scope;
- structured visual issues;
- rotation audit;
- transformed world bounds.

Final report must include all five standard views.

### Runtime phase and convergence

`geometry_runtime.json` records:

- `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, `FINAL_REVIEW_READY`, or `VISUAL_CONVERGENCE_FAILED`;
- attempt and score history per phase;
- non-improving cycles;
- last views and issues;
- recommended repair scope/profile;
- blocker when present.

`FINAL_REVIEW_READY` is required for user review. Any Geometry mutation invalidates previous canonical visual evidence.

### Structural report

`geometry_report.json` keeps separate:

```text
structural_status
visual_status
deterministic_visual_status
rotation_status
evidence_status
result
```

It also records transformed world bounds, cube/group/mesh/animation counts, true ground contacts, machine-readable part constraint results, rotation audit, review-gate result, and all issues.

Final Geometry result is `PASS` only when every required status passes.

### Rotation evidence

Contract rotation checks are stored under:

```text
evidence/geometry/rotation_checks/<cube>/before/
evidence/geometry/rotation_checks/<cube>/after/
```

They record the contract, axis, angle, derived pivot, direction alignment, connection gap, affected views, and before/after score. A rejected rotation is rolled back and cannot change canonical evidence.

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

Five standard views, final atlas, `validation_report.json`, and `completed_VALIDATION.md`. Final Validation must re-run `verify_geometry_review_ready` against the current model.

## Focused revisions

Recapture only affected views plus one collateral-drift view. Major-form revisions require Left, Front, Top / Footprint, then final full five-view evidence. Earlier checkpoints remain immutable.
