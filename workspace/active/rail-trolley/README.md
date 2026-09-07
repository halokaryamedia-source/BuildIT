# Rail trolley

DIRECT Bedrock asset, front +Z. Dimensions X20 Y40 Z48. 60 cubes, minimum thickness1. Geometry approved. Texture revision ready for user review; Animation not yet authored.

## Current checkpoint
rail_trolley.bbmodel and rail_trolley.png saved. texture-preview.png shows latest three-quarter view. Atlas256x256, uniform1pixel/model unit. Native repack reproduced mixed material layout and rounding of7.5-unit glass width; bounded UV relocation now organizes roof, body, chassis/wheels, interior and glass into separated horizontal bands. Exact aspect preserved, including per-face glass exception. All autouv0; shared identical regions retained. No unintended overlap or out-of-bounds regions. Space between independent islands at least2pixels. No geometry changes.

Texture revised after user reported flat colors: stronger stepped ramps, different paint/steel/upholstery response, roof plate seams, restrained panel highlights, seat stitching, tread plate floor, layered lamp colors. Original blue/navy/red livery retained. Hidden surfaces remain simplified. Post-save audit:0 solid alpha errors,0 unused opaque pixels,8449 mapped pixels. Mapped front/back/left/right/top/bottom/three-quarter reviewed. User texture approval pending.

## Rig and next stage
Body locators: seat_driver [0,17,12], seat_passenger_1 [0,17,0], seat_passenger_2 [0,17,-12]. Four separate wheel bones under chassis. Body includes seats, cabin, roof and rails. No player/rails/behavior integration.

After user texture approval: handoff Animation in same task, author drive from modified_distance_moved and body-only2sec engine_idle. Resolve stepped-wheel rolling radius/contact envelope before motion validation. Final geometry/animation exports and playback instructions pending.

Final gradient correction: broad flat bands replaced with approximately12-level spatial gradients. Roof has directional highlights, seats have shaped cushion shading, side paint has graded reflections.85 opaque paint colors across8334 pixels; glass preserved. UV/geometry unchanged. Fresh top/side/three-quarter evidence shows stronger gradients; user review pending.

Underside completion: graded floor underside/red sill, frame, axles, wheel faces/hubs, step, pedestal and console.60 unique face islands repainted. Shared UV unchanged. Bottom, back, right, top and three-quarter captures reviewed. Saved checkpoint still pending user texture approval.

Interior roof correction:35 distinct UV faces with fewer than3 colors and area greater than2 pixels were corrected, including roof underside and rim, seat edges, narrow metal faces. Post-save audit over every solid face: no remaining low-variation faces larger than2 pixels, roof underside11 colors, zero alpha holes. Pixel-sized caps necessarily remain single texels. Canonical bottom capture is occluded by floor and does not prove an interior camera view. Texture review remains pending.

Texture APPROVED. Animation checkpoint: drive and engine_idle authored and saved. Geometry JSON and animation JSON delivered. See ANIMATION.md for usage, numeric verification and remaining contact/preview limitations. Animation user review pending.

FINAL: User approved animation and requested saving. Project checkpoint saved. Previous review-pending status superseded. Known limitations remain documented in ANIMATION.md.
