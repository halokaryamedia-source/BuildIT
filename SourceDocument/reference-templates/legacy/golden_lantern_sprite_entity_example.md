# Golden Example: Lantern Sprite Entity Reference Package

Use this as the quality target for ChatGPT reference output. It is not the required asset; it is a filled example showing the expected detail level for a Bedrock Entity.

## User Answer Example

```text
1. What do you want to make?
   A small floating lantern sprite.

2. Is it animated later, or just a static display entity?
   Animated later.

3. What should it do in-game?
   A friendly companion entity that floats near the player and glows.

4. How big should it feel?
   Tiny pet, about half player height.

5. What style or theme should it have?
   Cozy magical forest, brass lantern frame, blue flame core, small cloth tassels.

6. Which 3-5 parts are most important visually?
   Lantern body, flame core, top handle, side fins, cloth tassels.

7. Should it be animation-ready later?
   Yes: gentle floating, flame pulse, tassel sway.

8. Do you want references generated from scratch, or will you upload references?
   Generate from scratch.

9. Any must-have details?
   Clear glowing flame core, readable lantern frame, small floating tassels.

10. Anything to avoid?
   No tiny cube scratches, no realistic glass shards, no messy dangling chains.

Optional texture size:
   32x32.
```

## Geometry Blueprint Table Example

```text
part | role | bbox height/width/depth | position from root | attachment | rotation | geometry/texture
root_core | primary mass | 8/6/4 | center, floating origin | root | none | geometry
lantern_frame_front | front silhouette | 8/6/1 | front face | root_core front | none | geometry
lantern_frame_back | rear silhouette | 8/6/1 | back face | root_core back | none | geometry
top_handle | top silhouette | 3/4/1 | above root_core | root_core top | slight arch/stepped shape | geometry
left_fin | side identity | 4/2/1 | left middle | root_core left | slight outward angle | geometry
right_fin | side identity | 4/2/1 | right middle | root_core right | slight outward angle | geometry
bottom_tassel | animation-ready accent | 3/1/1 | below root_core | root_core bottom | none | geometry
flame_core | focal identity | 5/3/2 | inside root_core | root_core center | none | geometry
brass_trim_lines | surface detail | texture-only | frame edges | n/a | n/a | texture-only
glass_highlights | surface detail | texture-only | front/back panels | n/a | n/a | texture-only
flame_glow_pixels | material effect | texture-only | flame_core faces | n/a | n/a | texture-only
```

## Negative Geometry Constraints

Do not model these as cubes:

- brass scratches
- glass highlight streaks
- small glow pixels
- tiny chain links
- cloth weave
- thin outline lines
- tiny flame sparkles

## View Consistency Example

```text
front_side_back_agree: PASS
scale_matches_orthographic: PASS
part_breakdown_matches_silhouette: PASS
texture_only_details_are_not_geometry: PASS
```

## Codex-Ready Request Example

```text
Project Name: lantern_sprite
Target Category: Bedrock Entity
Asset Name: Lantern Sprite
Identifier Prefix: lantern_sprite
In-game Function: Friendly floating companion entity
Target Visual Quality: Minecraft Bedrock, readable magical companion
Current Production Phase: Reference Collection
Phase Goal: Validate references and Geometry Blueprint only

Approved Inputs:
- 01_lantern_sprite_orthographic_views.png
- 02_lantern_sprite_scale_sheet.png
- 03_lantern_sprite_silhouette_sheet.png
- 04_lantern_sprite_part_breakdown_sheet.png
- 08_lantern_sprite_do_dont_sheet.png
- reference_manifest.json

Reference Priority:
1. Orthographic views
2. Scale sheet
3. Silhouette sheet
4. Part breakdown
5. Do / Don't

Geometry Blueprint:
- Global envelope: 11 high, 8 wide, 5 deep, front direction marked by visible frame
- Ground/contact points: none, floating entity origin below root_core
- Part build order: root_core, front/back frame, top_handle, side fins, flame_core, tassel
- Major bounding boxes: use Geometry Blueprint table

Geometry Decision Notes:
- Scale envelope: tiny pet, about half player height
- Front/Side Silhouette: lantern frame and side fins must read first
- Parent/Pivot/Attachment: side fins, tassel, and flame_core parent to root_core
- Collision/Z-Fighting Risks: frame panels must sit outside core faces
- Cube Noise To Avoid: scratches, glow pixels, chain links, glass streaks
- Defer To Texture: brass scratches, glass highlights, flame glow pixels, cloth weave

First Codex Action:
Run Reference Collection only. Do not edit Blockbench until Geometry Blueprint is accepted.

Do Not Continue Beyond:
Reference Collection.

Acceptance Criteria:
- reference_manifest.json is valid
- Geometry Blueprint is complete
- Front and side silhouette are clear
- Entity hierarchy can support future float, flame pulse, and tassel sway
- Texture-only details are not requested as cubes
```

## Acceptance Criteria

- Example is Bedrock Entity only.
- Example shows static and animation-ready entity decisions without opening an animation phase.
- Example separates geometry from texture-only details.
- Example starts Codex at Reference Collection, not direct modelling.
