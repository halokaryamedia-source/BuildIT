# Ninja Master Reference Package Plan

Target source:

```text
SourceDocument/blockbench-samples/ninja_master.geo.bbmodel
```

This package is a calibration reference test based on real Blockbench source views. Do not use AI-generated visual imagination for this calibration package.

This is a template calibration test. Visual sheets may use a clean reference/projection-style layout, but their visual content must be based on real Blockbench screenshots from the source file first.

Do not use AI-generated imagination or naive `.bbmodel` projection as the visual source for this calibration test.

See:

```text
BLOCKBENCH_CAPTURE_GUIDE.md
```

## Ground Truth

- Format: Bedrock Entity
- Source texture resolution: 160x160
- Standard UV atlas target: 256x256
- Elements: 33
- Unique names: 22
- Measured mesh bounds for Sheet 02: `16.2px W x 11.2px D x 41.4px H`
- Measured height: `2.59 blocks`
- Steve reference on sheets: `28.8px`; model height ratio: `1.44x`
- Role: tall humanoid / boss-like entity

## Texture Terms

- Atlas size is the canvas size: use generic options `64x64`, `128x128`, `256x256`, `512x512`.
- Pixel style is separate: `default Minecraft 16x style` or `cleaner 32x style`.
- For this calibration sample target: use `256x256 atlas`, `16x16 pixel style`.

## Required Outputs

| Order | Image | Notes |
| --- | --- | --- |
| 01 | `01_ninja_master_orthographic_views.png` | `01_ninja_master_orthographic_views.notes.md` |
| 02 | `02_ninja_master_scale_sheet.png` | `02_ninja_master_scale_sheet.notes.md` |
| 03 | `03_ninja_master_silhouette_sheet.png` | `03_ninja_master_silhouette_sheet.notes.md` |
| 04 | `04_ninja_master_part_breakdown_sheet.png` | `04_ninja_master_part_breakdown_sheet.notes.md` |
| 05 | `05_ninja_master_color_palette_sheet.png` | `05_ninja_master_color_palette_sheet.notes.md` |
| 06 | `06_ninja_master_closeup_detail_sheet.png` | `06_ninja_master_closeup_detail_sheet.notes.md` |
| 07 | `07_ninja_master_execution_target_sheet.png` | `07_ninja_master_execution_target_sheet.notes.md` |
| 08 | `08_ninja_master_animation_pivot_sheet_optional.png` | `08_ninja_master_animation_pivot_sheet_optional.notes.md` |

Sheet 05 combines the previous color palette and texture reference concepts into one active sheet.
The old separate texture-reference Sheet 06 is superseded to avoid duplicate visual context.

After all sheets are approved:

```text
reference_manifest.json
CODEX_REFERENCE_HANDOFF.md
```

## Shared Sheet Style

- Use the same header pattern on every sheet: centered asset name, centered sheet purpose, `SHEET ##` in the top-right corner.
- Use clean white/off-white background, thin black dividers, and bold uppercase section labels.
- Keep footer text short and instruction-focused.
- Use Minecraft/Blockbench things for scale references: one `16px x 16px x 16px` block, Steve player reference, model view, UV atlas target, and texture style target.
- Do not use source/internal file names in sheet footers.
- Do not use guess-based scale wording on sheet images.

## Approved Sheets

- Sheet 01: approved orthographic reference.
- Sheet 02: approved scale reference.
- Sheet 03: approved part-mask silhouette reference.
- Sheet 04: approved simplified part breakdown reference.
- Sheet 05: approved combined color and texture reference.
- Sheet 06: approved close-up detail reference.
- Sheet 07: approved DO-only visual execution target.
- Sheet 08: approved animation pivot readiness reference.

## Acceptance Rule

Do not continue to the next sheet if the current sheet breaks:

- scale baseline on sheets: `16px = 1 block`, Steve `28.8px`
- tall humanoid scale locked by Sheet 02: `16.2px W x 11.2px D x 41.4px H`
- Minecraft/Blockbench cuboid style
- geometry-vs-texture split
- one image per planned filename
- visual source is actual Blockbench screenshot for this template calibration test
