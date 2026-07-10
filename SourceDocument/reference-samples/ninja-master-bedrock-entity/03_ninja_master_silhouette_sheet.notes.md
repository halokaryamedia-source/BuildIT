# 03 Ninja Master Silhouette Sheet Notes

## Sheet Identity

- Image file: `03_ninja_master_silhouette_sheet.png`
- Sheet purpose: part-mask silhouette readability reference for the existing `ninja_master.geo.bbmodel` sample.
- Current modelling phase supported: Reference Collection / Main Geometry planning.
- Priority: High.
- Status: Approved.

## What Codex Should Read From This Sheet

- The model must read clearly from silhouette before texture or small detail is added.
- Color regions mark visible geometry part masks, not texture pixels.
- Front and back part masks must preserve the broad shoulders, tall head/hair top, beard/head mass, robe mass, belt/straps, side cloth panels, lower robe, and separated shoes/feet.
- Side part mask must stay narrow and tall while still showing robe, arm/armor, belt, cloth panels, and head volume.
- Footprint silhouette is for layout/readability only, not scale authority.
- 3/4 silhouette preview is for overall shape confirmation only, not measurement.

## Part Mask Legend

- White / light gray: head, hair/top piece, and beard cubes.
- Green: main body and robe cubes.
- Blue-gray: armor and arm mass.
- Red: belt and strap cubes.
- Cyan: cloth panel cubes.
- Teal: lower robe / lower body mass.
- Black / dark gray: shoes and feet.

These colors are visible part labels only. They are not final texture colors and are not sampled from the texture paint.

## Main Silhouette Locks

- Tall head and hair/top piece remain visible.
- Shoulder width remains a strong front/back feature.
- Beard/head mass remains distinct from the torso.
- Armor/arms remain separate from the robe mass.
- Belt and hanging cloth create the lower-body read.
- Feet touch the baseline and remain separate.
- Long side cloth strips remain visible without becoming random thin noise.

## Do Not Misinterpret

- Do not use this sheet for exact dimensions; use Sheet 02 for scale.
- Do not treat the color zones as final texture palette.
- Do not interpret this sheet as texture-color masking; it is visible geometry part masking.
- Do not use texture detail to rescue a weak silhouette.
- Do not turn every small outline notch into extra geometry.
- Do not widen the side view beyond the approved narrow read.

## Pass / Fail Use

Pass if:

- part mask preserves both the major outline and the important functional geometry zones.
- main form still reads as a tall Minecraft-style humanoid.
- head/beard, torso/robe core, armor/arms, belt/straps, side cloth panels, lower robe, and shoes/feet are identifiable.
- side silhouette remains narrow.
- 3/4 silhouette still reads as the same tall humanoid form.

Fail if:

- silhouette becomes player-height or generic.
- shoulders, head/beard, torso/robe core, armor/arms, belt/straps, side cloth panels, lower robe, or shoes/feet lose their clear read.
- thin cloth strips become noisy or oversized geometry.
