# Industrial Elevator

Asset / Goal: Minecraft Bedrock Entity industrial elevator cabin with iron doors.

Approved Reference: `references/approved-reference.png`

Requested Dimensions: width=5 height=5 length=6 blocks (80 × 80 × 96 Blockbench units)

Geometry Strategy: DIRECT

Animation Required: YES — open/close iron doors only.

Current Stage: AUTHORING — GEOMETRY CORRECTION / TEXTURING PAUSED

Geometry: FAILED USER VISUAL REVIEW — envelope is correct, but the front shell and left glass cohort contain visible gaps
Texturing: PAUSED — previous template/UV attempt was invalid and must not be reused
Animation: NOT_STARTED

Current model file: [industrial-elevator-clean.bbmodel](industrial-elevator-clean.bbmodel) — editable baseline only; the active live rebuild is not an accepted checkpoint.

Material constraints: preserve the 80 × 80 × 96 envelope unless the approved reference proves the envelope interpretation wrong; retain meaningful left/right door hierarchy and pivots for later open/close animation; canonical front is the elevator entrance.

The previous dirty baseline's `ControlPanel` cohort concern is not carried into the clean project; the new panel and buttons are authored as one right-side semantic assembly. The current visual failure is a separate front-shell continuity defect.

The prior statement that front shell z-fighting was resolved is no longer an acceptance lock. A clean positive-volume overlap audit is technical evidence only; it does not prove absence of visible coplanar-surface, seam, contact, or gap defects. User visual review reopens the affected Geometry gate.

UV state: the earlier 16×16 native-template result was rejected after audit (162 enabled faces, 0 valid, invalid UVs). Do not paint or carry forward that texture. A new native template must be generated only after Geometry passes.

Current handoff state: GEOMETRY CORRECTION. Continue from the approved reference and dimensions, repair the complete shell/cohort, capture fresh canonical views, and obtain explicit user approval before UV Layout/Texturing. Do not start Animation until the user explicitly accepts the corrected Geometry + Texture result.

## Failure Record / Lessons

The previous build treated a successful `manage_cubes` call, exact bounds, and a clean positive-volume overlap check as if they proved visual correctness. They do not. The live model had the correct `80×80×96` envelope and 23 visible Cubes, but its surfaces were not continuous.

Observed authored gaps in the live rebuild:

- Front left: `LeftWall x=-40..-36`, `FrontLeftJamb x=-28..-24`; the intervening `x=-36..-28` region is empty.
- Front door transition: the left jamb ends at `x=-24`, while `DoorLeft` starts at `x=-20`; the `4`-unit strip is empty. The right side mirrors this defect.
- Left glass: `LeftGlassFront z=-40..-28` to `LeftGlassMiddle z=-27..-14`, and `LeftGlassMiddle` to `LeftGlassRear z=-13..0`; each transition leaves a `1`-unit gap.

Root cause: the approved reference was not converted into a complete surface-coverage map and explicit open/closed-space invariants before coordinates were authored. Disconnected local Cubes were assembled under the right envelope, but no whole-form front/side continuity gate ran before Geometry was treated as complete. The visual reference was therefore available, while the construction and proof process did not operationalize it.

Correct authoring order:

`approved reference + dimensions + DIRECT strategy`
→ `semantic surface map: required solids, intentional openings, contacts, glass spans`
→ `coordinate frame and envelope`
→ `cohesive primary shell and semantic cohorts`
→ `fresh front/3⁄4/side/back/top/bottom views`
→ `gap/contact/penetration review`
→ `user Geometry approval`
→ `native UV template and UV audit`
→ `pixel-accurate Texture Styling`
→ `Texture Verify`
→ `Animation`

No texture, UV styling, or animation may be used to conceal an unresolved Geometry defect.
