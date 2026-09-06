# Oil palm bunch

## Animation checkpoint
- User explicitly approved texture and requested animation. AUTHORING to Animation handoff completed in same task.
- fall_roll authored on motion/heading/roll; see ANIMATION.md for parameter contract and rendered-pose test results. Project, geometry and animation JSON saved. Animation ready for user review, not yet user-approved final.

## Latest correction — atlas and core
- Supersedes cleanup-unverified checkpoint below: atlas cleanup now visually verified after disabling paint side restriction and alpha lock. Unused template marks removed with isolated bounded eraser stamps, mapped colors preserved.
- Three fibrous core cubes reduced to 72% horizontal width/depth, heights retained; paired UVs resized uniformly per corresponding dimension with exact mirrored reuse. 61 cubes retained, no new small elements. Fruit cohort and rest tilt unchanged.
- Fresh front/back/left/top/three-quarter evidence: protruding vertical wood strips resolved, cut stalk remains intentional. Atlas has transparent unused space; UV partial overlap zero. Fractional UV review remains intentional for exact face aspect.
- Project and PNG saved. Texture ready for user review; animation still pending user acceptance.

## Current texture checkpoint
- Correction: texture cleanup remains UNVERIFIED. Residual template pixels were visible outside painted islands. A bulk eraser unexpectedly removed mapped pixels too; that edit was undone and restored project re-saved. Do not treat transparent-unused-area claim below as verified or proceed to Animation yet.
- Geometry approved; texture ready for user review. Saved project and extracted embedded oil_palm_bunch.png; texture-preview.png shows mapped front view.
- Single 128x128 atlas, six shared red/orange fruit variants with dark tips and small scars; mirrored opposite faces, three crown variants, brown fibrous core and cut stalk. Unused area transparent with one-pixel island padding.
- Native template generated before bounded per-face UV mapping. Mapping locked autouv=0; exact aspect preserved at 4 texels/unit for fruit and 1 texel/unit for larger core. Fractional endpoints intentionally preserve fractional geometry dimensions; automatic gate remains review_required (FRACTIONAL_UV), not automatic ready.
- Audit: 366 valid faces, zero invalid/out-of-bounds/degenerate/collapsed UVs, zero partial overlap; 30 intentional shared regions. Front, top and three-quarter mapped views inspected. Voxel fruit lobes remain coarser than botanical photo by approved geometry budget.
- Next: user Texture approval, then load Animation specialist and hand off through Gateway in same task. Animation not yet authored.

- User-approved plan: one whole oil-palm fruit bunch, DIRECT, max 16x16x16 units at rest. Original botanical photo reference.png.
- Animation required: parameterized fall then heavy short roll; initial height0..16 blocks, default4; heading default+X; g16 blocks/s^2; roll0.5 blocks in1.2 seconds; no large bounce; hold final pose.
- Rig: motion owns translation/contact correction, heading owns yaw, roll owns whole rigid-body rotation around center [0,8,0]. No independently falling fruit.
- Visual interpretation: compact upright oval bunch, visible overlapping fruit lobes surrounding a fibrous core, cut woody base and restrained slender bracts. Unseen rear inferred as same continuous bunch, not extra unsupported structure.
- Geometry owns mass/silhouette/fruit protrusions/bracts. Texture owns red-orange gradients, dark tips, fine fibers and small fruit marks. Planned geometry60..90 Cubes, 128px atlas with semantic reuse/mirroring and transparent unused space.
- Front +z. Stage: GEOMETRY. User geometry review required before production UV; texture review before Animation.
- Deliverables after stages: bbmodel, PNG, geometry JSON, animation JSON and parameter instructions. Flat-ground visual animation only; no behavior pack or terrain collision.

## Geometry review checkpoint
- Project UUID34b21027-9a13-f354-2d8f-b2b6279e89cc; native bedrock; saved oil_palm_bunch.bbmodel, filesystem verified.
- 73 Cubes: 3 closed overlapping core masses, 1 cut stalk, 57 fruit lobes including crown, 12 silhouette bracts. 6 Groups: motion -> heading -> roll -> core/fruits/bracts. Rigid body roll center[0,8,0].
- Rendered bounds min[-6.47047,0,-6.51695],max[6.47047,16,6.51695]; dimensions12.94094x16x13.03391 units, within approved16-unit maximum all axes.
- Fresh front/back/left/top/three-quarter reviewed. Compact tapered bunch silhouette, coherent connected core, staggered fruit surface, crown coverage and grounded cut stalk. Front and back differ slightly through angular staggering. Photo has much finer/more numerous fruit and bracts; reduced silhouette detail is deliberate for73-cube budget. Fine fruit tips/gradients/fibers remain texture-owned.
- geometry-preview.png uses temporary element colors, not final material. Status READY_FOR_USER_REVIEW; user Geometry approval pending. Native UV not generated; thin bracts require per-face handling to avoid collapse.
- Next: obtain geometry approval -> native UV with explicit density / audit / semantic shared reuse -> texture specialist -> user Texture approval -> animation handoff.
- Animation must derive support-height correction from actual rotated final cuboid vertices (or equivalent exact support function), not fixed radius alone. Heading rotates aroundY and should not change support height; gravity uses input height in blocks converted to model units. Test heights0/1/4/16 and heading0/90/180/270 before finalization. No authored animation yet.

## Approved geometry optimization
- User approved form, requested removal of all dimensions below1 unit and rest X tilt20..25 degrees.
- Removed12 bracts (0.36-unit thickness) and their empty Group;61 Cubes remain. All remaining Cube dimensions exceed1 unit; fruit/core form retained.
- User-edited motion X20 was replaced by neutral motion and roll X22.5 so future global translation remains independent of rest tilt. Heading/roll and descendant origins plus whole Cube cohort shifted down0.03493859 units to ground the rotated bunch.
- Latest bounds12.94094x15.77705x13.51532, minY effectively0. Rest roll pivot[0,7.9650614086,0]. Future animation support correction must include this base tilt.
- Fresh front/three-quarter reviewed; saved verified oil_palm_bunch.bbmodel. UV/texture not authored yet. Geometry approval with this requested correction received.

## Final acceptance
- User approved completed animation and requested final save. Final .bbmodel saved through Gateway with verified write; PNG, geometry JSON and animation JSON present. Asset authoring complete.
