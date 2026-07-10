# [Asset Name] Reference Package Plan

Status: Draft.

Use this file to control the package before modelling starts.

## Target Source

```text
[source reference, brief, or Blockbench sample path]
```

## Ground Truth

- Format:
- Source texture resolution:
- UV atlas target:
- Texture style:
- Measured or intended bounds:
- Role:

## Required Outputs

| Order | Image | Notes | Status |
| --- | --- | --- | --- |
| 01 | `01_[asset]_orthographic_views.png` | `01_[asset]_orthographic_views.notes.md` | Draft |
| 02 | `02_[asset]_scale_sheet.png` | `02_[asset]_scale_sheet.notes.md` | Draft |
| 03 | `03_[asset]_silhouette_sheet.png` | `03_[asset]_silhouette_sheet.notes.md` | Draft |
| 04 | `04_[asset]_part_breakdown_sheet.png` | `04_[asset]_part_breakdown_sheet.notes.md` | Draft |
| 05 | `05_[asset]_color_palette_sheet.png` | `05_[asset]_color_palette_sheet.notes.md` | Draft |
| 06 | `06_[asset]_closeup_detail_sheet.png` | `06_[asset]_closeup_detail_sheet.notes.md` | Draft |
| 07 | `07_[asset]_execution_target_sheet.png` | `07_[asset]_execution_target_sheet.notes.md` | Draft |
| 08 | `08_[asset]_animation_pivot_sheet_optional.png` | `08_[asset]_animation_pivot_sheet_optional.notes.md` | Optional |

## Shared Sheet Style

- Same header pattern on every sheet.
- `SHEET ##` in the top-right corner.
- Clean white/off-white background.
- Thin dividers and bold uppercase section labels.
- Minimal text on images; detailed interpretation belongs in `.notes.md`.

## Acceptance Rule

Do not start Blockbench modelling until:

- required sheets are approved.
- every required image has matching notes.
- `reference_manifest.json` is valid.
- `CODEX_REFERENCE_HANDOFF.md` exists.
- scale, atlas target, and texture style are locked.
- geometry-level and texture-only details are separated.
