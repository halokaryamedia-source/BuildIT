# Lift

## Batas selesai dan audit sistem

Selesai untuk pengguna di Blockbench: Geometry, Texture dan Animation APPROVED. Tidak ada agenda Minecraft. Persetujuan bukan klaim tekstur identik sempurna; pengguna masih menilai kualitas pewarnaan belum optimal.

Perbaikan berikutnya menyasar sistem, bukan mengerjakan ulang lift utama. Salinan uji: `.cache/lift-authoring-audit/lift-audit.bbmodel` di root repo. SHA256 baseline model utama: 2B86BFF2A202355CDF3822DFD3A754081AEDD361C7C6C163BDC91ECEC8DF12F1.

Kegagalan yang dipertahankan sebagai konteks: jendela/pintu perlu koreksi; kualitas shading keliru ditafsirkan menjadi 4K; warna pucat, outline tebal dan shading per-Cube menimbulkan repaint berulang; peringatan face kecil Box UV; atlas 1K hanya 11,01% terpakai (115456 texel, bentang 512x516); timeline mengikuti klip terpilih alih-alih ID permintaan. Kesalahan Painter belum terbukti. Usage historis tidak diukur.

Keputusan audit: reference wajib cocok visual ketat pada view/skala sebanding; density 16x tetap; ukuran atlas minimum yang terbukti muat dengan padding boleh digunakan pada fixture/sistem. Jangan memaksakan 256 atau mengubah geometry/UV lift utama. Catatan sebab/pemilik/status lengkap: `docs/knowledge/current-validation.md`; tindak lanjut: `docs/knowledge/next-action.md`.

Asset / Goal: Reference-grounded Bedrock lift; DIRECT MCP authoring test.
Approved Reference: references/approved-reference.png; references/window-detail.png. Latest approved repaint plan uses frontal reference and front-left reference; three visual door fields.
Requested Dimensions: outer depth 6 x width 5 x height 5 blocks; X=80 Y=80 Z=96 units; ground Y=0.
Geometry Strategy: DIRECT
Animation Required: YES
front_direction: +z
Design: Complete cabin, enlarged three-panel left window, closed separately grouped doors. Base-color pixel art, no PBR.

Current Stage: DELIVERED - user approved Geometry, Texture and Animation
Geometry: APPROVED
UV Layout: PASS
Texturing: APPROVED
Animation: APPROVED
Current model file: lift.bbmodel; final repaint review checkpoint saved through MCP.
Current next step: None for requested asset authoring. Live reopen verification remains unavailable through the current Gateway.

## Authoritative requirements
Keep 1024x1024 / 16x / 1 physical pixel per model unit. Improve painting rather than resolution. Geometry and UV unchanged.
Runtime now contains only the active 1K texture c0826723-15e2-fd4b-4b2e-6d447cb0d434; all 240 faces use it. No old 4K texture in latest checkpoint.

## Repaint outcome
Old face colors replaced with material bases, then a new complete painting. Front/left evaluated first, followed by remaining surfaces.
Three visual door fields: exactly two single-texel seams at floor(world X)=-6 and 6; no seam at X=0. Global door reflection continues across both Cubes. Real recess shadow beneath header; no blanket dark face outline. Coplanar front metal uses shared world coordinates.
Wood joints: exactly one row at floor(world Y)=22,40,58 where wood exists. No duplicate half-unit rows, parallel shadow bands or decorative panel borders. Low-contrast irregular horizontal fibers, shadows at actual contacts. Glass, controls, rails, tiles and charcoal repainted consistently.
Native draw_shape_tool and bounded paint_with_brush calls through Gateway. 1K atlas/16x preserved.

## Verification
Fresh front, left, back, three-quarter, atlas and interior cutaway inspected. Roof/ceiling restored with Undo. Compiled before/after comparison confirms unchanged element geometry, hierarchy and UV. Single texture 1024x1024. Live UV audit ready with no blockers. Texture and Animation explicitly approved by user.

## Prior tests / remaining proof
PASS: live Gateway discovery/schema/invocation, native project/group/cube batches, bounds, door correction and Undo/Redo, user-authorized diffuser thickness correction to 1 unit, native UV template/audit, native painting, verified checkpoint writes.
General validator://status access was unavailable through Gateway; not re-proven here and no general validator PASS claimed.
PASS: final native project and Bedrock geometry exports; embedded PNG extracted unchanged; native animation export collected. NOT TESTED: live reopen and Minecraft execution.
No source/API changes, deployment, PBR or gameplay package.
Latest color correction follows measured medians from user frontal reference: door top RGB 207/198/191, middle 131/128/127, lower 89/84/78; jamb top 198/188/181 and bottom 73/68/63. Increased warm light-dark range rather than resolution. Repainted metal with world-space vertical color ramps, kept two seams and no X=0 seam; wood/charcoal palette adjusted, buttons made small recessed squares instead of bars. Fresh mapped front/left/three-quarter and atlas inspected. Still 1024x1024/16x, unchanged geometry/UV. Saved checkpoint; subsequent user Texture approval recorded. Exact reference equality is not claimed.
User Texture APPROVED. User now requests door opening and closing animations, then completion. Animation Required=YES. Texture checkpoint saved. Handoff to Animation: door_left and door_right translate symmetrically into existing side pockets; geometry, UV and texture remain unchanged.

## Final animation delivery
User inspected both animations in Blockbench and explicitly approved them.
- animation.lift.door_open: 1.2 s, once, closed to open.
- animation.lift.door_close: 1.2 s, hold last frame, open to closed.
- door_left / door_right authored X travel: -18 / +18 units. Two keys per bone, symmetric zero-slope Bezier handles at +/-0.4 s. No other bones animated.
- Closed rest pose, approved geometry, UV and 1024x1024 texture preserved. Half-open pose reviewed through native capture; playback invoked; user supplied final motion acceptance.
Deliverables: lift.bbmodel (editable, embedded texture and both animations), lift.geo.json, lift.png, lift.animation.json.
Animation JSON is the native Blockbench export saved by the user at C:/Users/Administrator/Downloads/model.animation.json, copied without modification; it bakes Bezier motion into numeric Bedrock keys.
File readback verified JSON structure, 40 Cubes, two 1.2 s animations and one 1024x1024 texture. This is filesystem readback, not a live reopen test.
Runtime limitation: timeline operations act on the currently selected animation; animation_id is not used by the timeline handler (mcp/server/tools/animation.ts). Opening remains once; closing holds its final pose. No source fix attempted.
Current Gateway has no animation selection, native animation export, or open-existing-project capability. Native .bbmodel re-open proof and Minecraft playback are not claimed. General validator resource remains unavailable as previously recorded.
