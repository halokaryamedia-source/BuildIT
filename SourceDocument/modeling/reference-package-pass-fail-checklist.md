# Reference Package Pass/Fail Checklist

Use this when the user provides a reference package before Codex starts Blockbench work.

Execution quick path:
- Baca [compact-geometric-pipeline.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/compact-geometric-pipeline.md) dulu.
- Setelah itu checklist ini hanya sebagai verifikasi pass/fail.

## Required Files

```text
01_[asset]_orthographic_views.png:
Pass / Fail / Missing

02_[asset]_scale_sheet.png:
Pass / Fail / Missing

03_[asset]_silhouette_sheet.png:
Pass / Fail / Missing

04_[asset]_part_breakdown_sheet.png:
Pass / Fail / Missing

05_[asset]_color_palette_sheet.png:
Pass / Fail / Missing

06_[asset]_closeup_detail_sheet.png:
Pass / Fail / Missing

07_[asset]_execution_target_sheet.png:
Pass / Fail / Missing

08_[asset]_animation_pivot_sheet_optional.png:
Pass / Optional / Missing
```

### Naming Convention (single version)

Referensi pakai format tunggal:

- `01_[asset]_orthographic_views.png`
- `02_[asset]_scale_sheet.png`
- `03_[asset]_silhouette_sheet.png`
- `04_[asset]_part_breakdown_sheet.png`
- `05_[asset]_color_palette_sheet.png`
- `06_[asset]_closeup_detail_sheet.png`
- `07_[asset]_execution_target_sheet.png`
- `08_[asset]_animation_pivot_sheet_optional.png`

## Required companion metadata

Sertakan metadata final agar fase pemakaian bisa dipaksakan:

- `REFERENCE_PLAN.md`
- `CODEX_REFERENCE_HANDOFF.md`
- `reference_manifest.json`

Versi lama yang tidak mengikuti format di atas dianggap non-relevan dan tidak dipakai.

## Minimum Required To Start Main Geometry

Main Geometry may start only if these pass or missing items are accepted assumptions:

- Orthographic views.
- Scale sheet.
- Silhouette sheet.
- Part breakdown sheet.
- Execution target sheet.
- `CODEX_REFERENCE_HANDOFF.md`.
- Valid `reference_manifest.json`.
- Geometry Blueprint:
  - global envelope,
  - part build order,
  - major part bounding boxes,
  - attachment points.

Jika salah satu fail, jangan lanjut geometri sampai direvisi.

Texture phases require:

- Color palette sheet.
- Texture placement and palette guidance from Sheet 05.
- Close-up detail sheet for focal areas.

Animation is out of scope unless Sheet 08 is present and explicitly opened.

## Conflict Check

```text
Front direction consistent:
Yes / No / Needs verification

Scale consistent:
Yes / No / Needs verification

Silhouette consistent with orthographic:
Yes / No / Needs verification

Part breakdown matches visible model:
Yes / No / Needs verification

Texture-only details clearly separated:
Yes / No / Needs verification
```

If a conflict affects major geometry, stop and ask the user.

## Quick per-file status

Gunakan format saat review:

`file: status (PASS / PARTIAL / BLOCKER) - next_action`

Default aturan:

- `PASS`: siap lanjut isu geometri berikutnya.
- `PARTIAL`: revisi kecil dengan scope terarah.
- `BLOCKER`: rollback + perbaikan referensi/prasyarat.

## Acceptance Criteria

- References are complete enough for the requested phase.
- Conflicts are marked before modelling.
- Geometry and texture roles are separated.
