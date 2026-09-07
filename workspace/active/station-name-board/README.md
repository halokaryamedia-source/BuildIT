# station_name_board
DIRECT Bedrock static model. Geometry ready for user review; UV/texturing not started.
9 cubes, groups posts/frame/panel. Bounds 32 x 24 x 2.5 units (XYZ). Front +Z, ground Y=0. Panel 28 x 10 x 1 units.
Two white posts and frame, two rear mounting tabs. Frame fills the reported post-to-tab gap; reviewed visually, no missing surface.
Reference is reference.png. Simplification: square-section frame rather than round pipe; panel seated directly inside frame.
Next after user geometry approval: native UV, 256 x 256 texture at 4 pixels/unit; two text variants KEBON SAWIT / +106 MDPL and MURIA BARU / +1602 MDPL. Both sides readable; no logo. Dark blue lower-right stripes, stepped white/steel gradients. No blank variants or animation.
Final deliverables after texture approval: bbmodel, two PNGs, Bedrock geometry and variant instructions. No Minecraft integration testing.

Geometry approved. Two textures painted; texture user review pending. Native box packing at 4px/unit required 512x512 because a frame net spans 68 logical units (272 pixels), exceeding 256; density retained, atlas differs from initial plan. Text front/back normal orientation. UV native audit 54 valid faces, zero partial overlap/out-of-bounds/collapsed UV.

Texture revision: stronger stepped cool-white gradients, inset panel edge shadow, narrow steel highlights, frame fasteners, shaded post bases. Applied to both variants preserving text pixels. Front/back and underside previews checked. User texture review pending.

## Final — user approved
Geometry and both revised textures approved. Saved station_name_board.bbmodel, station_name_board.geo.json, kebon_sawit.png, muria_baru.png.
Geometry identifier: geometry.station_name_board. Native project re-export may use geometry.unknown; set identifier to geometry.station_name_board when re-exporting.
Dimensions XYZ: 32 x 24 x 2.5 units. Front +Z, ground Y=0, 16 units per block. 9 cubes; no animation.
PNG bitmap size 512 x 512; logical geometry UV canvas 128 x 128. Keep these logical values: the 4:1 ratio provides 4 texture pixels per model unit.
Choose kebon_sawit or muria_baru in the Blockbench texture list via Activate Texture; only one variant is displayed at a time. In Bedrock, bind the chosen PNG to the same geometry through the caller's resource-pack configuration.
Names: KEBON SAWIT / +106 MDPL; MURIA BARU / +1602 MDPL. Both sides readable normally, no logo.
To create future variants, duplicate an atlas and replace text in both panel islands without moving UVs. Pixel rectangles (half-open): north [4,44]-[116,84], south [120,44]-[232,84]. Preserve margins and the lower-right stripes.
Verified using Blockbench previews and UV audit. No Minecraft runtime testing, behavior pack, or in-game variant selector is supplied.
