# Bedrock MCP Modelling Focus

## Active Categories

- Bedrock Entity for entity models.
- Bedrock Entity for all active model targets, including static display props.

## Defaults

- Default UV Mode: Per-face UV for Bedrock Entity.
- Default UV Mode: Per-face UV for Bedrock Entity.
- UV size starts at 16x16 unless the brief or reference requires higher resolution.
- Prefer Minecraft / Blockbench cube geometry before mesh or generic 3D forms.

## Professional Sample: Ninja Weapon Academy

Sample path:

`D:\Research\Maps Browser\Sample Marketplace\29#NinjaWeaponAcademy\resource_packs\rp0`

Observed pack contents:

- 850 files total.
- 125 `.geo.json` geometry files.
- 48 animation JSON files.
- 5 animation controller files.
- 219 client entity JSON files.
- 50 attachable JSON files.
- 332 PNG textures.

Key structure:

- Entity definitions live under `entity/`.
- Geometry lives under `models/entity/`.
- Animations live under `animations/`.
- Animation controllers live under `animation_controllers/`.
- Render controllers live under `render_controllers/`.
- Textures live under `textures/entity/`, `textures/items/`, `textures/particle/`, and `textures/ui/`.
- Weapons are mostly entity/attachable-style assets, not generic item-only models.

Geometry patterns:

- Models are cube-based; inspected samples used no poly mesh faces.
- Humanoid mobs use a clear bone hierarchy: root/main, body, waist, torso, head, upper/lower limbs, feet, props, cloth pieces.
- Decorative cloth, banners, effects, and UI-like panels often use zero-thickness cubes/planes.
- `inflate`, `mirror`, parented bones, pivots, and locators are used heavily.
- Visible bounds are set on entity geometry.

Texture patterns:

- Common texture sizes: 32x32, 128x128, 16x16, 64x64, 80x80, 96x96, 120x120, 160x160, 176x176, 256x256.
- Bosses and complex armor often use 128x128 to 256x256.
- Simple props, particles, icons, and small weapons often use 16x16 to 64x64.
- Atlases are used for icons, numbers, UI panels, and animated/effect frames.

Animation patterns:

- Entity models are tied to client entity JSON with animations, controllers, scripts, particle effects, and render controllers.
- Common animation set: idle, walk, run, attack, death, hit reaction, look-at, healthbar.
- Animation controllers separate movement, attack, hit reaction, boss, mob, NPC, player, and misc behavior.
- Keyframes use rotation, position, scale, loop, hold-on-last-frame, and query-driven timing.

Prompting implication:

- Future MCP prompts should request a complete Bedrock asset package shape: project format, per-face UV, texture size, geometry hierarchy, pivots, visible bounds, texture plan, animation plan if entity, and visual QA.
- For high-quality output, ask for named bones and gameplay purpose, not just visual appearance.
- For block-like props, treat the target as a static Bedrock Entity display prop unless explicitly overridden.

## Acceptance Criteria

- Future MCP modelling prompts target Bedrock Entity unless explicitly overridden.
- Per-face UV is requested for both target categories.
- Sample pack is used as reference for hierarchy, texture size, pivots, animation, and QA.
- Unverified target behavior is marked `Needs verification`.
