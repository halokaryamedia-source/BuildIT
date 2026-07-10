# 08 Ninja Master Animation Pivot Readiness Notes

## Sheet Identity

- Image file: `08_ninja_master_animation_pivot_sheet_optional.png`
- Sheet purpose: readable pivot-category reference for animation-readiness checks.
- Current modelling phase supported: Geometry Detailing / Polish / Final Review.
- Priority: Optional, but useful if the asset will animate later.
- Status: Approved.

## What Codex Should Read From This Sheet

- This sheet is not an animation pose sheet.
- Use it to preserve pivot-friendly hierarchy while modelling.
- The image is a readable category guide, not a precise origin map.
- The image shows only 5 pivot categories: head, arms, waist anchor, cloth/belt, and feet.
- Exact detailed source group origins are listed below and override the visual marker placement when precision matters.
- Do not invent movement from this sheet; only use it to keep future animation possible.
- If the target asset is static, use this sheet only as a hierarchy sanity check.

## Pivot Groups

- Root / Waist: main body anchor; the whole model should not drift away from this structure.
- Head / Beard: head turns from the head pivot; beard follows the head identity area.
- Arms: upper arms pivot at shoulder level; forearms pivot lower.
- Cloth / Belt: dense waist pivots are visually consolidated on the sheet; use the exact anchors below when separating belt and cloth groups.
- Legs / Feet: legs pivot from hip/leg groups; feet preserve ground contact.

## Actual Source Pivot Anchors

- `waist`: `[0, 17.7, 0]`
- `torso`: `[0, 17.7, 0]`
- `head`: `[0, 29, 0]`
- `beard`: `[0, 29.65, -4.2]`
- `leftArm0`: `[-4.7, 27, 0]`
- `rightArm0`: `[4.7, 27, 0]`
- `leftArm1`: `[-5.7, 21.2, 0.3]`
- `rightArm1`: `[5.7, 21.2, 0.3]`
- `belt`: `[0, 17.5, -3.4]`
- `cloth_1`: `[-4.3, 17.5, 0]`
- `cloth_2`: `[4.3, 17.5, 0]`
- `cloth_3`: `[0, 17.5, -2.3]`
- `cloth_4`: `[0, 17.5, 2.3]`
- `leftLeg0`: `[-2.5, 17.1, 0.4]`
- `rightLeg0`: `[2.5, 17.1, 0.4]`
- `foot_l`: `[-2.5, 2.3, 0.4]`
- `foot_r`: `[2.5, 2.3, 0.4]`

## Do Not Misinterpret

- Do not use pivot markers as extra geometry.
- Do not treat this as a required animation plan.
- Do not change major proportions only to expose pivots.
- Do not detach cloth, beard, belt, or feet from their visual parent areas.

## Pass / Fail Use

Pass if:

- future moving parts remain logically parented.
- arms, head, cloth, belt, legs, and feet have readable pivot areas.
- feet still preserve ground contact.
- no visual sheet before this one is contradicted.

Fail if:

- pivots are ignored and parts become hard to animate later.
- cloth or belt becomes visually detached from the waist.
- head/beard identity stops following the head area.
- feet lose baseline contact.
