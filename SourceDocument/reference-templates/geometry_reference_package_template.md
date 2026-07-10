# Geometry Reference Package Template

Use this template to create a reusable Bedrock Entity reference package before Blockbench modelling.

The approved calibration example is:

```text
SourceDocument/reference-samples/ninja-master-bedrock-entity/
```

## Folder

Use one folder per asset:

```text
SavedData/sessions/[asset]/references/
```

For approved archive samples:

```text
SourceDocument/reference-samples/[asset]/
```

## Required Files

```text
01_[asset]_orthographic_views.png
01_[asset]_orthographic_views.notes.md
02_[asset]_scale_sheet.png
02_[asset]_scale_sheet.notes.md
03_[asset]_silhouette_sheet.png
03_[asset]_silhouette_sheet.notes.md
04_[asset]_part_breakdown_sheet.png
04_[asset]_part_breakdown_sheet.notes.md
05_[asset]_color_palette_sheet.png
05_[asset]_color_palette_sheet.notes.md
06_[asset]_closeup_detail_sheet.png
06_[asset]_closeup_detail_sheet.notes.md
07_[asset]_execution_target_sheet.png
07_[asset]_execution_target_sheet.notes.md
08_[asset]_animation_pivot_sheet_optional.png
08_[asset]_animation_pivot_sheet_optional.notes.md
REFERENCE_PLAN.md
CODEX_REFERENCE_HANDOFF.md
reference_manifest.json
```

Sheet 08 is required only when animation-readiness matters. If skipped, mark it as `not_required` in the manifest.

## Sheet Roles

| Sheet | Role | Authority |
| --- | --- | --- |
| 01 | Orthographic views | Main shape, view matching, front/side/back/top/3/4 |
| 02 | Scale | Model dimensions, block/player reference, atlas target, texture style |
| 03 | Silhouette / part mask | Readability before detail |
| 04 | Part breakdown | Broad construction zones |
| 05 | Color + texture reference | Palette, material roles, texture placement, atlas/style locks |
| 06 | Close-up detail | Detail interpretation; prevent over-modelling |
| 07 | Execution target | DO-only visual locks before modelling/polish |
| 08 | Pivot readiness | Category-level pivot guidance; exact origins in MD |

## Standard Locks

- Target format: Bedrock Entity unless explicitly changed.
- UV default: Per-face UV.
- Atlas target options: `64x64`, `128x128`, `256x256`, `512x512`.
- Texture style is separate from atlas size: usually `16x16 pixel style` or `32x32 pixel style`.
- Do not treat source atlas size as the target unless explicitly approved.

## Build Order

1. Capture or generate clean source/reference views.
2. Make Sheet 01 and Sheet 02 first.
3. Make Sheet 03 and Sheet 04 before any texture/detail sheets.
4. Make Sheet 05 only after scale and construction zones are stable.
5. Make Sheet 06 for details that are easy to misread.
6. Make Sheet 07 as the final visual execution lock.
7. Make Sheet 08 only if animation-readiness is relevant.
8. Create `CODEX_REFERENCE_HANDOFF.md` and `reference_manifest.json`.

## Image vs MD Rule

- Images are for visual alignment.
- Notes are for exact interpretation.
- If a visual is simplified for readability, the matching `.notes.md` is the precision source.

## Pass Before Modelling

- All required images exist.
- Every image has matching notes.
- `reference_manifest.json` is valid JSON.
- `CODEX_REFERENCE_HANDOFF.md` tells Codex read order and sheet priority.
- Scale, atlas target, and texture style are not conflicting.
- Geometry-level details and texture-only details are separated.
- Any simplified visual marker is explained in MD.
