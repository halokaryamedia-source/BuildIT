# Industrial Elevator

Asset / Goal: Minecraft Bedrock Entity industrial elevator cabin with iron doors.

Approved Reference: `references/approved-reference.png`

Requested Dimensions: width=5 height=5 length=6 blocks (80 × 80 × 96 Blockbench units)

Geometry Strategy: DIRECT

Animation Required: YES — open/close iron doors only.

Current Stage: AUTHORING — GEOMETRY SURFACE / UV QUALITY REOPENED

Geometry: REOPENED BY USER REVIEW — previous technical overlap audit was clean, but visible gap/z-fighting appearance is not accepted
Texturing: REOPENED — UV/material mapping is technically in-bounds but visually disorganized and unaccepted
Animation: NOT_STARTED

Current model file: [industrial-elevator.bbmodel](industrial-elevator.bbmodel) — editable baseline, not accepted completion.

Material constraints: preserve the 80 × 80 × 96 envelope unless the approved reference proves the envelope interpretation wrong; retain meaningful left/right door hierarchy and pivots for later open/close animation; canonical front is the elevator entrance.

Known structural concern: the current `ControlPanel` cohort is internally inconsistent. `ControlPanelBody`, `ControlButtonTop`, and `ControlButtonMid` are authored at negative X while `ControlButtonLow` and `EmergencyButton` remain at positive X. Treat the panel as one semantic assembly: decide the intended side from the approved reference, then use a shared Group transform or one complete coherent correction instead of independent partial moves.

The prior statement that front shell z-fighting was resolved is no longer an acceptance lock. A clean positive-volume overlap audit is technical evidence only; it does not prove absence of visible coplanar-surface, seam, contact, or gap defects. User visual review reopens the affected Geometry gate.

UV next step: do not patch styling on top of the current mapping until important faces are reviewed for aspect ratio, texel density, orientation, seam/padding, and semantic UV reuse. Exact reuse is valid only where surfaces intentionally need the same pixels. Rebuild/remap affected UVs first, then Texture Styling and Texture Verify on front, 3/4, sides, back, top, and bottom.

Current handoff state: REOPENED_AUTHORING. Continue from the current `.bbmodel` and approved reference. Do not start Animation until the user explicitly accepts the corrected Geometry + Texture result.
