# Animation parameters

Animation: animation.oil_palm_bunch.fall_roll

- variable.palm_height: initial bottom-to-ground clearance in blocks, clamped 0–16; fallback 4.
- variable.palm_direction: degrees; fallback 0. In Blockbench, 0 = +X, 90 = -Z, 180 = -X, 270 = +Z. Bedrock export mirrors model X, so exported direction 0 = -X, 90 = -Z, 180 = +X, 270 = +Z relative to entity axes. Entity yaw additionally rotates these directions.
- Caller must set both variables before starting and keep them constant throughout a run. Undefined-value fallback is for preview convenience; supply explicit values in Minecraft.
- Flat ground Y=0 relative to entity origin. Keep entity origin fixed during the visual animation; this is not world collision or entity movement.
- Restart: leave/deactivate the animation, set parameters, then re-enter/re-activate from animation time 0. In Blockbench pause, move time to 0, press Play. Do not merely change height while playing.

Fall g=16 blocks/s², impact time sqrt(height/8). Roll travels 8 model units over 1.2 seconds with quadratic ease-out. Rotation uses effective radius 7.9 units plus a small damped impact wobble. Exact contact support is the maximum over 25 hull vertices of the approved tilted geometry, not a fixed-radius vertical approximation. Geometry edits require recalculating this support expression.

Run once; hold_on_last_frame. Clip duration 2.65 seconds accommodates maximum height; motion finishes earlier for lower heights and holds. Default motion finishes at 1.907107 seconds.

## Verification
Live Blockbench rendered-pose tests: heights 0/1/4/16 with headings 0/90/180/270, at start/contact/mid-roll/end/2.65s. Fall durations 0/0.353553/0.707107/1.414214 seconds. Ground clearance after contact within 0.000002 model units. End bounds identical to later held bounds. Native Molang evaluated the authored scripts during these tests; no adjacent + - operators used. No Minecraft runtime test performed. Standalone animation JSON converted from authored values with Bedrock position-X and rotation-X/Y sign conversion; geometry exported by native codec.

Texture approved by user. Animation approved by user in Blockbench; final project saved.


