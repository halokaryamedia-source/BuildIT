# Stage Evidence Contract

Stage previews exist for user review and objective validation. They must be stable, comparable, and minimal.

## 1. General Rules

- Use fixed filenames without timestamps or version suffixes.
- Use the same accepted project state for all views in one review set.
- Hide selection outlines, gizmos, grids, and unrelated UI unless the evidence specifically needs them.
- Use orthographic projection for Front, Left Side, Back, and Top / Footprint.
- Use one consistent orthographic-style Front-left 3/4 view.
- Frame the complete visible model with a small consistent margin.
- Keep the model centered on the same target and ground plane.
- Do not create extra screenshots when required evidence already proves the result.
- Revision cycles recapture only affected views plus mandatory comparison views.

## 2. Standard Camera Contract

Blockbench coordinates use Y as vertical.

The default Reference Visual front is treated as `-Z` unless the approved package defines another front axis.

| View | Direction from target | Projection | Purpose |
|---|---|---|---|
| Front | +Z looking toward target | Orthographic | Width, height, symmetry, front identity |
| Left Side | +X looking toward target | Orthographic | Depth, posture, attachments, ground contact |
| Back | -Z looking toward target | Orthographic | Rear silhouette and hidden drift |
| Top / Footprint | +Y looking downward | Orthographic | Width/depth envelope and contact layout |
| Front-left 3/4 | +X +Z with slight +Y | Orthographic | Volume, attachment continuity, focal read |

When another `front_axis` is approved, rotate the horizontal view directions consistently rather than changing the model.

## 3. Stable Evidence Filenames

### Geometry

```text
evidence/geometry/
├─ geometry_front.png
├─ geometry_left.png
├─ geometry_back.png
├─ geometry_top.png
├─ geometry_front_left_3_4.png
└─ geometry_report.json
```

`geometry_report.json` must include:

- checkpoint path;
- project UUID;
- dimensions;
- cube/group counts;
- hierarchy summary;
- ground-contact result;
- Geometry scorecard result;
- accepted areas;
- open issues.

### Texture

```text
evidence/texture/
├─ texture_front.png
├─ texture_left.png
├─ texture_back.png
├─ texture_front_left_3_4.png
├─ texture_atlas.png
└─ texture_report.json
```

`texture_report.json` must include:

- checkpoint path;
- texture filenames and dimensions;
- UV mode;
- atlas occupancy summary when available;
- palette/material-zone result;
- seam and mirroring result;
- Texture scorecard result;
- accepted areas;
- open issues.

### Animation — when required

```text
evidence/animation/
├─ animation_neutral_pose.png
├─ animation_hierarchy.json
├─ animation_pivots.json
├─ animation_<clip_name>.<supported-preview-format>
└─ animation_report.json
```

`animation_report.json` must include:

- checkpoint path;
- required animation families;
- clip/sample list;
- neutral-pose recovery result;
- ground-contact result;
- clipping/deformation result;
- Animation scorecard result;
- accepted areas;
- open issues.

When animation is not required, no fake preview is created. Record `ANIMATION_SKIPPED` in state.

### Final Validation

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

Include animation evidence only when Animation was required.

## 4. Review Preview Requirements

### Geometry Review

Required:

- Front;
- Left Side;
- Back;
- Top / Footprint;
- Front-left 3/4;
- concise dimensions/hierarchy/cube report.

### Texture Review

Required:

- texture atlas;
- Front;
- Left Side;
- Back;
- Front-left 3/4;
- concise UV/material report.

### Animation Review

Required only when animation exists:

- neutral pose;
- hierarchy/pivot summary;
- each required clip or representative sample;
- clipping and ground-contact result.

### Final Review

Required:

- five standard views;
- final atlas;
- validation result;
- final `.bbmodel` path;
- concise revision summary;
- animation evidence when applicable.

## 5. Focused Revision Evidence

A revision recaptures only what is required to verify the named issue.

Examples:

- Side-tail length issue: Left Side + Front-left 3/4.
- Front-width issue: Front + Top.
- Rear attachment issue: Back + Left Side or 3/4.
- Palette issue: atlas + one or two affected model views.
- Pivot issue: pivot summary + neutral pose + affected clip.

Do not regenerate the complete evidence set after every local correction unless the correction affects global consistency.

## 6. Evidence Validity

Evidence is invalid when:

- different views come from different project states;
- camera orientation is mislabeled;
- model parts are cropped;
- hidden UI state changes the appearance materially;
- the screenshot is taken before the edit is committed;
- a required view cannot prove the stated acceptance criterion;
- filenames or paths do not match this contract.
