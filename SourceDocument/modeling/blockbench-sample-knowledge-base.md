# Blockbench Sample Knowledge Base

This document summarizes lessons from the user-provided Blockbench `.bbmodel` samples. Use it to improve Bedrock Entity geometry planning and ChatGPT reference generation.

The samples are reference intelligence only. Do not copy their designs.

## Nearest Sample Selection

After the user explains the target asset, ChatGPT must choose the closest Blockbench sample before generating references.

Use `blockbench_samples/sample_selection_manifest.json` as the strict selection map when it is available.

Select:

- 1 primary sample: the closest structure match
- up to 2 secondary samples: useful supporting patterns
- no sample if none is structurally relevant

Use the sample for modelling logic only: complexity, hierarchy, envelope, cube density, inflate, thin planes, pivots, and texture-size choice.

Do not use the sample as the target design.

## Sample Calibration Output Contract

Before any reference file plan, ChatGPT must output:

```text
Selected Blockbench Sample Calibration:
- Primary sample:
- Secondary sample(s):
- Reason:
- Geometry lessons to use:
- Do not copy:
- Complexity target:
- Texture recommendation:
```

If no sample fits, write `Primary sample: none` and explain why.

## Asset Category Decision Tree

Ask these in order after the user names the asset:

1. Is the main structure held, worn, static, creature, vehicle, or humanoid?
2. Does it need moving groups later: limbs, head, tail, rotor, wheel, jaw, wings, cloth, or weapon part?
3. Does its silhouette depend on thin parts: blade, bone, flap, panel, glass, cloth, or effect plane?
4. Is the main risk overbuilding small surface detail as cubes?

Use the answers to pick the closest primary sample.

## Geometry Blueprint Pass/Fail

Before generating a Codex-ready modelling request, pass all checks:

- selected sample calibration is present or explicitly `none`
- global envelope has height, width, depth, front direction, and contact points
- major part bounding boxes are listed
- moving or attached parts have pivot/attachment notes
- texture-only details are clearly separated from geometry
- complexity target matches the selected sample and asset role
- sample `do_not_copy` constraints are listed

| If the target is... | Primary sample to inspect | What to learn |
| --- | --- | --- |
| weapon, tool, held item, blade, staff, wand | `weapon_katana.geo.bbmodel` | thin silhouette, grip/wrap layering, elongated proportions, attachment-style readiness |
| helmet, mask, wearable head gear, crown, horned armor | `armor_dragon_helmet.geo.bbmodel` | compact wearable envelope, shell layering, crest/flap accents, fitted inflate |
| table, chair, furniture, storage prop, simple static object | `outdoor_table.bbmodel` | few-cube readability, large forms first, stable contact points |
| animal, fantasy creature, mount, quadruped, armored creature | `anky.geo.bbmodel` | segmented creature body, limbs, attachment mounts, animation-ready grouping |
| skeleton creature, fossil, bone monster, large long-bodied creature | `skeleton_spinosaurus.geo.bbmodel` | repeated bone structures, thin planes, large envelope, long-body readability |
| vehicle, aircraft, machine, cockpit, rotor, mechanical prop | `helicopter.geo.bbmodel` | interior/exterior shell, seats, landing gear, moving rotor groups |
| humanoid, NPC, boss, warrior, player-like entity | `ninja_master.geo.bbmodel` | limb hierarchy, clothing layers, humanoid proportions, compact animation-ready body |

If the target combines categories, choose by structure first, not theme. Example: a magical flying chair is closer to `outdoor_table.bbmodel` for base construction and may use `helicopter.geo.bbmodel` only for moving/vehicle-like parts.

## Sample Metrics

| Sample | Role | Texture | Elements | Names | Animations | Notable geometry signals |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `weapon_katana.geo.bbmodel` | Weapon / attachable-style item | 64x64 | 28 | 23 | 89 | Long thin silhouette, segmented blade, inflated wraps/holster. |
| `armor_dragon_helmet.geo.bbmodel` | Wearable armor | 128x128 | 22 | 14 | 1 | Inflated shell, rotated crest/flaps, compact head envelope. |
| `outdoor_table.bbmodel` | Static furniture prop | 146x146, 3 textures | 12 | 5 | 1 | Few large cubes, no rotation/inflate, strong readable construction. |
| `anky.geo.bbmodel` | Complex creature | 256x256 | 61 | 57 | 8 | Segmented body, limbs, accessory mounts, animation-ready parts. |
| `skeleton_spinosaurus.geo.bbmodel` | Large skeleton creature | 512x512 | 70 | 39 | 1 | Repeated bones, thin planes, long body envelope. |
| `helicopter.geo.bbmodel` | Vehicle | 288x288 | 51 | 12 | 3 | Interior/exterior shell, seats, landing gear, rotor groups, negative inflate. |
| `ninja_master.geo.bbmodel` | Humanoid entity | 160x160 | 33 | 22 | 3 | Limb hierarchy, layered clothing, negative inflate, compact readable body. |

## Geometry Lessons

1. Match element count to asset role.
   - Simple props can be excellent with 10-20 cubes when silhouette is strong.
   - Humanoids and wearable armor usually stay readable around 20-40 cubes.
   - Vehicles and medium creatures often need 40-70 cubes.
   - Large complex creatures can exceed 70 cubes, but only when repeated structures and pivots justify it.

2. Plan the scale envelope before details.
   - Strong samples have a clear total height, width, depth, front direction, and contact points.
   - Geometry should first satisfy the envelope and silhouette, then add secondary parts.

3. Use repeated named parts deliberately.
   - Repeated names such as blade segments, flaps, limbs, ribs, seats, or rotors imply modular construction.
   - Repetition is good when it supports identity or animation.
   - Repetition is bad when it becomes random cube noise.

4. Treat inflate as a precision tool.
   - Positive inflate helps layered shells, wraps, armor, and readable overlap.
   - Negative inflate helps fitted layers or panel alignment, but should be explicit because it can hide z-fighting mistakes.
   - Inflate should not be used to rescue a wrong base shape.

5. Use thin planes only when the asset needs thin surfaces.
   - Thin planes are useful for bones, glass, blades, flat panels, cloth-like flaps, and effects.
   - They should be called out in the Geometry Blueprint so Codex knows they are intentional.

6. Separate geometry detail from texture detail.
   - Geometry should carry silhouette, pivots, attachments, large panels, limbs, supports, and focal shapes.
   - Texture should carry seams, small trims, scratches, gradients, shadows, bands, and tiny material transitions.

7. Make animation readiness visible in the hierarchy.
   - If the asset may animate, create named groups for moving parts early.
   - Common moving groups: head, jaw, limbs, tail, wings, rotors, wheels, weapon handle, cloth/flaps, doors, mounts.
   - Static display entities still need clean groups for maintainability.

## ChatGPT Reference Requirements

When ChatGPT generates references after reading this knowledge base, it should include:

- selected primary and secondary Blockbench samples, with a short reason
- a Geometry Blueprint with total envelope and major part bounding boxes
- a part build order from large masses to secondary attachments
- a geometry-vs-texture split for every important visual detail
- notes for inflate, thin planes, rotations, pivots, and attachment points
- a complexity target: simple, medium, complex, or large-complex
- a texture-size recommendation based on role, not visual ambition alone

## Complexity Targets

| Target | Recommended use | Rough geometry budget |
| --- | --- | --- |
| Simple | Small prop, furniture, static display item | 8-20 elements |
| Medium | Wearable, humanoid, detailed item, compact creature | 20-45 elements |
| Complex | Vehicle, creature, boss prop, animated object | 45-80 elements |
| Large-complex | Large creature or skeletal/mechanical build | 80+ only when justified |

These are planning budgets, not hard limits. Readability and correct hierarchy matter more than cube count.
