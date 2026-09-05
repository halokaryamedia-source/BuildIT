# Industrial Elevator

Asset / Goal: Minecraft Bedrock Entity industrial elevator cabin with iron doors.

Approved Reference: `references/approved-reference.png`

Requested Dimensions: width=5 height=5 length=6 blocks (80 × 80 × 96 Blockbench units)

Geometry Strategy: DIRECT

Animation Required: YES — open/close iron doors only.

Current Stage: TEXTURING — EXTERNAL CONTINUATION REQUIRED

Geometry: STRUCTURALLY VERIFIED — front shell z-fighting audit clean; control-panel opening rebuilt through Gateway; visual acceptance not granted
Texturing: UNACCEPTED — atlas is reference-derived, but several UV/material placements remain visually incorrect
Animation: NOT_STARTED

Current model file: [industrial-elevator.bbmodel](industrial-elevator.bbmodel) (latest external-continuation checkpoint saved).

Material handoff constraints: retain a meaningful door hierarchy/pivot for the later open/close animation; canonical front is the elevator entrance/front view. Revision applied: central door inset gap closed; left wall window opening/frame and glass panel retained. Front shell substrates stop at z=-44 so the front trim/frame strip owns z=-48..-44. The control panel is cut into the reference-right front jamb with dedicated surround cubes; current live audit found no positive-volume cube overlap and the outer 80 × 80 × 96 envelope is preserved. The active atlas is `industrial-elevator-atlas-v2.png`; UV coordinates are in bounds and have no partial-overlap gate failure, but visual material placement remains unaccepted.

Current next step — continue outside Codex by opening the latest `.bbmodel` in Blockbench and remapping the full UV atlas against `references/approved-reference.png`; inspect front, both 3/4 views, right/left sides, back, top, and bottom. Do not start animation until the user accepts the visual texture/UV result.

Known blocker(s): visual acceptance failed. The current model is a documented handoff state, not a finished asset. Remaining defects reported by the user: several material regions do not align to the reference, UV layout still appears visually disorganized, and some editor views were previously perceived as broken/z-fighting despite the structural overlap audit being clean.

Current handoff state: EXTERNAL_CONTINUATION — user will continue texture/UV correction outside Codex. Preserve geometry dimensions, door hierarchy, control-panel placement, active atlas, and current `.bbmodel`; do not overwrite the approved reference.
