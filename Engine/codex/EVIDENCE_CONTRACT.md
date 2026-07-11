# Stage Evidence Contract

Stage evidence exists for user review and objective validation. It must be stable, comparable, minimal, and machine-readable.

## General Rules

- Use fixed filenames without timestamps or version suffixes.
- Use one committed project state for each review set.
- Hide selection outlines, gizmos, grids, and unrelated UI.
- Use orthographic Front, Left Side, Back, and Top / Footprint.
- Use one stable orthographic-style Front-left 3/4 view.
- Frame the complete model with a consistent margin and ground plane.
- Do not create extra screenshots when required evidence is sufficient.
- A local revision recaptures affected views plus the minimum comparison view.

Default front axis is `-Z` unless the approved package says otherwise.

## Required Report Result

Every stage JSON report must contain one top-level field:

```json
{
  "result": "PASS"
}
```

Allowed values:

```text
PASS
REVISION_REQUIRED
BLOCKER
```

`complete_stage` refuses approval when the required report is missing, has no explicit result, or is not `PASS`.

## Geometry

```text
evidence/geometry/
├─ geometry_front.png
├─ geometry_left.png
├─ geometry_back.png
├─ geometry_top.png
├─ geometry_front_left_3_4.png
└─ geometry_report.json
```

`geometry_report.json` includes:

```text
result
checkpoint
project_uuid
dimensions
cube_count
group_count
hierarchy_summary
ground_contact
accepted_areas
open_issues
```

Before review, call `validate_reference_contract` with `stage=GEOMETRY` and `require_evidence=true`. Merge its compact issue result into the report; do not repeat each underlying check manually.

## Texture

```text
evidence/texture/
├─ texture_atlas.png
├─ texture_front.png
├─ texture_left.png
├─ texture_back.png
├─ texture_front_left_3_4.png
└─ texture_report.json
```

Write `texture_atlas.png` with `save_texture_evidence`; do not return the full PNG as base64 merely to persist it.

`texture_report.json` includes:

```text
result
checkpoint
project_uuid
texture_files
texture_dimensions
uv_mode
palette_material_result
seam_mirroring_result
accepted_areas
open_issues
```

## Animation — Only When Required

```text
evidence/animation/
├─ animation_neutral_pose.png
├─ animation_hierarchy.json
├─ animation_pivots.json
├─ animation_<clip_name>.<supported-preview-format>
└─ animation_report.json
```

`animation_report.json` includes:

```text
result
checkpoint
required_animation_families
clips_or_samples
neutral_pose_recovery
ground_contact
clipping_deformation
accepted_areas
open_issues
```

When Animation is not required, create no fake evidence. Record `ANIMATION_SKIPPED` in state.

## Final Validation

```text
evidence/final/
├─ final_front.png
├─ final_left.png
├─ final_back.png
├─ final_top.png
├─ final_front_left_3_4.png
├─ final_texture_atlas.png
├─ validation_report.json
└─ completed_VALIDATION.md
```

Also required:

```text
final/<asset>.bbmodel
final/textures/
```

Write the final atlas with `save_texture_evidence`. Run `validate_reference_contract` with `stage=FINAL_VALIDATION` and `require_evidence=true`.

`validation_report.json` must contain top-level `result: PASS` before final approval can be completed.

## Camera Contract

For default `-Z` front:

| View | Direction |
|---|---|
| Front | camera at -Z |
| Left Side | camera at -X |
| Back | camera at +Z |
| Top / Footprint | camera at +Y |
| Front-left 3/4 | camera at -X/-Z with slight +Y |

Rotate all horizontal directions together when another front axis is approved. Do not rotate the model merely to satisfy evidence labels.

## Focused Revision Examples

- tail length: Left Side + Front-left 3/4;
- front width: Front + Top;
- rear attachment: Back + Left Side or 3/4;
- palette: atlas + affected views;
- pivot: pivot summary + neutral pose + affected clip.

## Invalid Evidence

Evidence is invalid when:

- views come from different project states;
- camera labels are wrong;
- model parts are cropped;
- screenshots precede committed edits;
- files do not match stable paths;
- the report lacks an explicit result;
- the evidence does not prove the stated acceptance criterion.
