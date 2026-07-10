# Blockbench Sample Library

These files are user-provided Blockbench samples for reference analysis.

Use them as structural quality references only:

- Do not copy the assets, names, textures, animations, or distinctive design.
- Learn the modelling decisions: scale envelope, part grouping, cube density, use of inflate, thin planes, texture resolution, and animation-ready hierarchy.
- Keep the active target as Bedrock Entity unless the user explicitly overrides it.
- Prefer marketplace-grade readability over dense cube noise.

## Samples

| File | Reference role |
| --- | --- |
| `weapon_katana.geo.bbmodel` | Item/weapon silhouette, wraps, thin elongated form, attachment-style animation context. |
| `armor_dragon_helmet.geo.bbmodel` | Wearable head armor, shell layering, crest/flap accents, compact asymmetric detail. |
| `outdoor_table.bbmodel` | Static furniture-like entity, simple readable large forms, multiple texture slots. |
| `anky.geo.bbmodel` | Complex creature, segmented body, limbs, armor/accessory attachments, animation-ready naming. |
| `skeleton_spinosaurus.geo.bbmodel` | Large creature skeleton, repeated bone structures, thin planes, large atlas use. |
| `helicopter.geo.bbmodel` | Vehicle entity, interior/exterior shell, seats, landing gear, animated rotor groups. |
| `ninja_master.geo.bbmodel` | Humanoid entity, limb hierarchy, layered clothing, compact animation-ready body. |

## Usage In ChatGPT Reference Flow

When included in the ChatGPT upload package, these samples should be treated as Blockbench format examples and quality calibration, not as target references.

ChatGPT should still ask the user what asset to make before generating any reference package.

ChatGPT should read `sample_selection_manifest.json`, choose the closest primary sample after the user answers, then use only the selected sample lessons while generating references.
