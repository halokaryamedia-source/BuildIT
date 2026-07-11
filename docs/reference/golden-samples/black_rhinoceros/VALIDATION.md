# Final Validation Contract

Status: `APPROVED`

## Authority

- `PRODUCTION_CONTEXT.md`
- `reference_manifest.json`
- Sheets 01–04
- `GEOMETRY.md`
- `TEXTURING.md`
- `ANIMATION.md`

## Project lock

- Asset ID: `black_rhinoceros`
- Canonical Model Filename: `black_rhinoceros.bbmodel`
- Format: Bedrock Entity
- Geometry: cuboid-only
- UV Mode: Box UV baseline
- Atlas: `128 × 128`
- Front Direction: `-Z`
- Animation: `ANIMATION_SKIPPED`

## Geometry acceptance

- height approximately `40u`;
- width approximately `27.2u`;
- length approximately `52.8u`;
- bounds tolerance `±1u`;
- hierarchy matches `GEOMETRY.md`;
- all four feet contact `Y = 0`;
- both horns, both ears, four legs, four feet, and tail are present;
- shoulder remains higher/heavier than rear;
- no mesh geometry;
- no major z-fighting or floating primary parts.

## Texture acceptance

- atlas is `128 × 128`;
- pixel style remains `16x`;
- palette matches Sheet 03;
- body remains warm gray-brown;
- horns, hooves, eyes, nostrils, mouth, and ear interiors are correctly separated;
- UVs are valid;
- no PBR or Vibrant Visuals assets exist.

## Animation acceptance

- no required clips;
- `ANIMATION_SKIPPED` is recorded;
- hierarchy remains pivot-ready.

## Required evidence

- `final_front.png`
- `final_left.png`
- `final_back.png`
- `final_top.png`
- `final_front_left_3_4.png`
- `final_texture_atlas.png`
- `validation_report.json`
- canonical `black_rhinoceros.bbmodel`
- SHA-256 hashes

## Final result

```text
PASS
REVISION_REQUIRED
BLOCKER
```

Route failures to the earliest affected stage. Final Validation must not silently repair Geometry or Texture.
