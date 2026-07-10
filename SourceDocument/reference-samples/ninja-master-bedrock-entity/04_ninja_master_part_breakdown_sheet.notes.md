# 04 Ninja Master Part Breakdown Sheet Notes

## Sheet Identity

- Image file: `04_ninja_master_part_breakdown_sheet.png`
- Sheet purpose: simplified 3-zone visual part breakdown for the existing `ninja_master.geo.bbmodel` sample.
- Current modelling phase supported: Reference Collection / Main Geometry planning.
- Priority: High.
- Status: Approved.

## What Codex Should Read From This Sheet

- Use this sheet to read the model in three large construction zones before detailing.
- Each panel shows one broad zone across front, side, back, and 3/4 views.
- The simplified zones are intentionally broad so overlapping parts are not mistaken as separate conflicting instructions.
- The source sample has 33 cubes. Treat this as a calibration reference, not a required cube count for every new asset.
- Major construction zones are: head, body, and legs.
- Sheet visuals focus on broad zone cutouts; exact interpretation rules stay in this notes file.
- Build large cuboid masses first, then add only geometry that improves silhouette, structure, stance, or readability.

## Zone Ownership

- `HEAD`: head volume, beard mass, hair/hat top, face plane, and neck connector.
- `BODY`: shoulder armor, arms, torso, waist, belt, cuffs, and upper robe connection.
- `LEGS`: lower robe, side cloth panels, hanging strips, legs, shoes, and ground-contact stance.

## Reading Priority

- Use the panel title as the authority for what that panel is explaining.
- If another zone appears inside a cutout, treat it as position context only.
- Use `FRONT`, `SIDE`, and `BACK` to understand structure and proportions.
- Use `3/4` only to check readability, layering, and how the zone looks in perspective.
- Use the full model reference on the right only to confirm that the three zones still connect correctly.

## Sheet Reading Rules

- Read each panel as one broad construction target.
- Use full-model references only to check placement and scale.
- Small color pixels, shading, trim, and texture noise stay texture-only.

## Geometry Intent

- Head zone: focal identity and tall silhouette.
- Body zone: shoulder width, torso anchor, belt break, and combat readability.
- Legs zone: lower robe flow, side cloth strips, shoes, and stance.

## Build As Geometry

- broad head and beard forms
- readable shoulder and arm mass
- torso / waist core
- belt or strap pieces only if they change silhouette or layer readability
- lower robe and side cloth panels
- legs and shoes for stance and ground contact

## Keep As Texture

- robe checker shading
- metal highlights
- cloth color variation
- face / eye pixels
- small edge trims
- surface noise
- micro cracks or seams

## Do Not Misinterpret

- Do not turn pixel shading into geometry.
- Do not add extra cubes only to copy small texture color changes.
- Do not treat 33 cubes as a mandatory target; use it as a quality calibration point.
- Do not split Sheet 04 back into many tiny panels unless the broad 3-zone read becomes unclear.
- Do not continue to detailing if the head, body, and legs are not readable as separate construction zones.

## Pass / Fail Use

Pass if:

- all major geometry groups are identifiable before texture detail.
- head, body, and legs remain readable as separate zones.
- arms, cloth panels, belt, and shoes remain readable inside their parent zones.
- texture-only details are not modelled as micro-cubes.
- geometry supports silhouette, stance, and focal identity.

Fail if:

- robe checker pattern or metal highlights are built as geometry.
- head, body, and legs merge into one unclear body mass.
- cube count grows from texture copying instead of structural need.
