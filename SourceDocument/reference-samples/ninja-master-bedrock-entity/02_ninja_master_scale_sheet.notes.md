# 02 Ninja Master Scale Sheet Notes

## Sheet Identity

- Image file: `02_ninja_master_scale_sheet.png`
- Sheet purpose: scale reference for the existing `ninja_master.geo.bbmodel` sample.
- Current modelling phase supported: Reference Collection / Main Geometry planning.
- Priority: High.
- Status: Approved.

## Scale Values

- Minecraft pixel rule used on sheet: `1 block = 16px`.
- Steve standing reference shown on sheet: `28.8px`.
- Model measured height: `41.4px`.
- Model measured width: `16.2px`.
- Model measured depth: `11.2px`.
- UV atlas standard target: `256x256`.
- Texture style target: `16x16 pixel style`.

Values are rounded to `0.1px` for readable modelling instructions.

## How Codex Should Use This Sheet

- Use this sheet for model scale only.
- Use Sheet 01 for silhouette, view matching, and part readability.
- Keep the model taller than the default Minecraft player reference shown in the scale comparison.
- Do not resize the model down to Steve height.
- Treat `256x256` as the standardized UV atlas target for this reference workflow.
- Treat `16x16 pixel style` as the default Minecraft texture style target unless a later sheet explicitly changes it.

## Do Not Misinterpret

- Do not read Sheet 01 footer as scale authority.
- Do not use the original nonstandard source atlas size as the target atlas.
- Do not confuse UV atlas size with texture style.
- Do not replace measured scale values with visual guesses.
- Do not use the top view as the height or width authority.

## Pass / Fail Use

Pass if:

- target UV atlas remains `256x256`.
- texture style remains `16x16 pixel style`.
- model height remains `41.4px` for this calibration sample.

Fail if:

- the model is treated as `28.8px` tall.
- the scale sheet uses guess-based wording.
- the UV atlas target is set back to `160x160`.
- the sheet omits the texture style target.
