# Blockbench Capture Guide For Ninja Master Reference Test

Use real Blockbench screenshots as the source of truth for this template calibration.

The final output may still be a clean reference/projection-style sheet. The rule is that its visual content must be traced from the real opened Blockbench file first, not invented.

Do not use AI-generated imagination or naive `.bbmodel` projection as the visual source for this calibration test.

## Why The Projection Sheet Was Rejected

The rejected projection sheet did not match the actual Blockbench render because it simplified:

- UV face orientation
- cube render order
- rotated elements
- inflated/negative-inflated layers
- texture transparency and face selection
- Blockbench camera/render shading

For template accuracy, screenshots must come from Blockbench itself before any reference sheet is generated.

## Required Source Screenshots

Capture these from the opened `ninja_master.geo.bbmodel` project:

```text
source_views/front_blockbench_ground_truth.png
source_views/side_blockbench_ground_truth.png
source_views/back_blockbench_ground_truth.png
source_views/top_blockbench_ground_truth.png
source_views/front_3_4_blockbench_ground_truth.png
```

Optional but useful:

```text
source_views/texture_atlas_ground_truth.png
source_views/outliner_ground_truth.png
```

## Capture Rules

- Use the actual Blockbench viewport/render.
- Use orthographic view for front, side, back, and top if available.
- Keep the model centered.
- Keep the whole model visible, including feet, hair/top knot, cloth panels, and straps.
- Use the same zoom level for front/side/back when possible.
- Avoid perspective distortion for orthographic sheets.
- Do not hide geometry parts.
- Do not repaint, edit, or simplify the model before capture.

## Sheet Construction Rule

Build final reference sheets by arranging, cropping, or lightly annotating these real screenshots into the template layout.

The `.bbmodel` metrics provide labels and checks, but the visual source must be the Blockbench screenshots.

After this template passes against the original Blockbench sample, the same sheet structure can be reused for imagined assets.

## Current Accepted Sources

```text
source_views/front_blockbench_ground_truth.png
source_views/side_blockbench_ground_truth.png
source_views/back_blockbench_ground_truth.png
source_views/top_blockbench_ground_truth.png
source_views/front_3_4_blockbench_ground_truth.png
```
