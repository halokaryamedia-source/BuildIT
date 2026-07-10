# Ninja Master Reference Handoff

Status: Approved.

Use this package as the reference calibration pack for Bedrock Entity modelling. The visuals are based on real Blockbench source views from `ninja_master.geo.bbmodel`.

## Read Order

1. `REFERENCE_PLAN.md`
2. `ninja_master_ground_truth.md`
3. Sheets 01-08 in order, reading each `.png` with its matching `.notes.md`

## Sheet Priority

- Sheet 02 is the scale authority.
- Sheet 01 is the main orthographic shape authority.
- Sheet 03 is the silhouette and part-mask readability authority.
- Sheet 04 is the broad construction-zone authority.
- Sheet 05 is the atlas, texture style, palette, and placement authority.
- Sheet 06 clarifies close-up detail interpretation.
- Sheet 07 is the visual execution lock.
- Sheet 08 is pivot-readiness guidance; exact origins live in its notes.

## Locked Targets

- Format: Bedrock Entity.
- Scale: `16px = 1 Minecraft block`.
- Model bounds: `16.2px W x 11.2px D x 41.4px H`.
- Player reference: `28.8px`.
- UV atlas target: `256x256`.
- Texture style: `16x16 pixel style`.

## Image vs MD Rule

- Use images for fast visual alignment.
- Use MD notes for exact interpretation rules.
- If an image marker is simplified for readability, the matching MD notes are the source of precision.

## Do Not Reopen

- Do not restore the old separate Sheet 06 texture reference.
- Do not treat the source `160x160` texture as the target atlas.
- Do not force all Sheet 08 pivots to overlap visually; exact pivot origins are documented in MD.
