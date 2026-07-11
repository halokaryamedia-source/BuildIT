# Final Validation Contract

Status: `DRAFT`

## Authority

- Production Context
- reference_manifest.json
- Sheets 01–04
- GEOMETRY.md
- TEXTURING.md
- ANIMATION.md

## Project validation

- Target Format:
- Asset ID:
- Canonical Model Filename:
- Project UUID Match Required: true
- UV Mode:
- Texture Width:
- Texture Height:
- Front Direction:

## Geometry acceptance

- scale and bounds match the manifest;
- hierarchy matches Sheet 02;
- required groups and attachments exist;
- ground contact is correct;
- no missing major parts;
- no unsupported geometry type;
- no major z-fighting or floating primary parts.

## Texture acceptance

- palette and material zones match Sheet 03;
- atlas dimensions and UV strategy are correct;
- texture is pixel-sharp;
- no PBR or Vibrant Visuals assets exist;
- no invalid or missing texture references;
- no unapproved visual redesign.

## Animation acceptance

- when required, required clips, pivots, axes, and neutral recovery match Sheet 04 and ANIMATION.md;
- when skipped, no animation clips are required and the manifest records `ANIMATION_SKIPPED`;
- no major clipping or ground-contact failure.

## Evidence required

- final front
- final left
- final back
- final top
- final front-left three-quarter
- final texture atlas
- validation report
- canonical final `.bbmodel`
- file hashes

## Final review result

```text
PASS
REVISION_REQUIRED
BLOCKER
```

Failures must route to the earliest affected stage. Final Validation must not silently repair Geometry, Texture, or Animation.
