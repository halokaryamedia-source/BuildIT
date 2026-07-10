# 05 Ninja Master Color Palette Sheet Notes

## Sheet Identity

- Image file: `05_ninja_master_color_palette_sheet.png`
- Sheet purpose: combined color palette, texture target locks, and texture placement guide for the existing `ninja_master.geo.bbmodel` sample.
- Current modelling phase supported: UV Texture / Base Texturing / Detail Texturing planning.
- Priority: High.
- Status: Approved.

## What Codex Should Read From This Sheet

- Use this sheet to preserve the color hierarchy and texture placement of the source sample.
- The sheet image intentionally shows only the working target: `256x256` UV atlas.
- The original sample atlas is `160x160` ground-truth evidence only; do not use `160x160` as the template target.
- Texture style remains `16x16 pixel style`, not smooth painting.
- Palette colors are calibration anchors, not a requirement to use every exact hex value.
- Keep the material hierarchy readable before adding small texture variation.
- Use the all-side preview to verify that colors read correctly from front, side, back, top, and 3/4 views.
- This sheet replaces the separate Sheet 06 texture reference; keep color and placement guidance together here.

## Material Color Roles

- `Robe Teal`: dominant model color; use dark, mid, bright, and edge values for blocky robe shading.
- `Robe Side Cyan`: side cloth / robe strip accent only; do not treat it as skin, face, or eye color.
- `Hair / Beard`: high-value white/gray identity area; keep contrast soft but readable.
- `Belt / Straps`: red accent zone; use sparingly so it stays a waist/motion cue.
- `Armor / Metal`: neutral gray armor and cuff material; do not shift it too blue.
- `Skin / Face`: small skin and face pixels; `Eye Blue` is only for the eye pixels.
- `Shoes / Darks`: black/dark gray grounding material for feet and soles.

## Target Locks

- UV atlas target: `256x256`.
- Texturing style: `16x16 pixel style`.
- The original sample texture exists at `160x160`; it is source evidence only, not a target size for new work.

## Do Not Misinterpret

- Do not model color changes as geometry.
- Do not turn checker shading, highlights, or trim pixels into cubes.
- Do not use the palette as a gradient painting guide; keep stepped Minecraft-style shading.
- Do not let red accents dominate over the teal robe mass.

## Pass / Fail Use

Pass if:

- teal remains the dominant robe color.
- white/gray hair and beard remain the focal identity color.
- red is limited to belt/strap accents.
- metal stays neutral gray.
- texture detail supports the geometry zones from Sheet 04.

Fail if:

- colors become smooth or painterly.
- atlas size and texture style are treated as the same thing.
- small texture pixels are converted into geometry.
- the palette loses the source material hierarchy.
