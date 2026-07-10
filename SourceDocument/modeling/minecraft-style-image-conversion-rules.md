# Minecraft Style Image Conversion Rules

Use this when an uploaded source image is not Minecraft style and must be converted into a Minecraft Bedrock / Blockbench-ready reference.

## Mandatory Prompt

For image generation, use the full canonical prompt:

```text
SourceDocument/modeling/minecraft-style-image-conversion-mandatory-prompt.md
```

Do not replace it with a short summary for the first style-conversion test.
Only append asset-specific details after the mandatory prompt, such as subject name, scale, atlas target, texture style, and weapon/prop requirements.

## Mandatory Preflight

Before any image generation, fill:

```text
SourceDocument/modeling/minecraft-style-image-conversion-preflight.md
```

The preflight must run the prompt logic first: subject type, recognition features, source analysis, Blockbench groups, geometry-vs-texture split, geometry plan, texture logic, and final generation permission.

If the preflight status is not `PASS`, do not generate.

## Core Rule

Do not make random voxel art, a generic Minecraft skin, or a pixelated copy of the image.

Translate the source into a practical Minecraft Marketplace-quality Blockbench model design:

- preserve the subject identity,
- preserve the main silhouette and proportions,
- preserve iconic features,
- simplify intelligently for Minecraft production,
- use clean cuboids for large forms,
- use texture for small surface detail,
- keep the design buildable, optimized, and readable in-game.

## Source Priority

1. Image A is the primary source of truth.
2. Supporting images are only style or simplification examples.
3. The final result must still clearly look like Image A.
4. Do not copy supporting samples unless explicitly requested.

## Conversion Pipeline

1. Identify the subject type.
   - Humanoid, animal, creature, vehicle, weapon, armor, prop, machine, furniture, block, or object.

2. Identify what makes it recognizable.
   - Examples: elephant = ears/trunk/tusks/body; samurai = helmet/armor/weapon/sash/shoulder plates.

3. Analyze Image A.
   - Main silhouette.
   - Proportions.
   - Pose or stance.
   - Largest shape masses.
   - Iconic features.
   - Accessories or weapons.
   - Main palette and material zones.
   - Mood/personality.

4. Break it into Blockbench groups.
   - Humanoid: head, torso, arms, legs, armor, clothing layers, hair, accessories, weapon.
   - Creature/animal: head, body, ears, horn, wing, tail, legs, feet, snout/trunk/tusks/claws.
   - Object/vehicle/tool: main body, base, frame, handles, panels, wheels, blades, attachments.

5. Classify details.
   - Silhouette-critical: geometry.
   - Secondary forms: simplified larger cuboids.
   - Surface detail: texture only.

6. Convert to Blockbench geometry.
   - Use clean cubes/cuboids.
   - Use long cuboids when possible.
   - Use limited rotated cuboids for horns, blades, wings, ears, tails, shoulder plates, cloth flaps, hair chunks, tools, or important silhouette detail.
   - Avoid dense voxel sculpture and micro-cube ornaments.

7. Apply strict detail budget.
   - Large forms = geometry.
   - Medium features = simplified cuboids.
   - Small decoration = texture only.
   - No physical detail smaller than what can read in 16x16 or 32x32 texture logic.

8. Apply Minecraft pixel-art texture logic.
   - Use bold pixel clusters, simple color blocks, clean borders, broad shade clusters, sparse accents, and readable material zones.
   - Avoid high-resolution fabric detail, realistic wrinkles, tiny repeated motifs, painterly shading, and random noise.

9. Final quality check.
   - Still looks like Image A.
   - Main silhouette is preserved.
   - Cube count feels efficient.
   - Large forms use large cuboids.
   - Small details are texture-only.
   - Texture is feasible for the target pixel style.
   - Turnaround views are consistent.

## Geometry vs Texture Decision

Build as geometry when the detail changes the outer shape:

- large horns,
- wings,
- tails,
- major crests,
- shoulder pieces,
- weapons,
- shields,
- large cloth panels,
- armor plates,
- large ears,
- large accessories,
- wheels,
- blades,
- handles.

Use texture when the detail is surface-only:

- engravings,
- seams,
- stitching,
- scratches,
- tiny ornaments,
- buckles,
- repeated motifs,
- fabric patterns,
- small panel lines,
- wrinkles,
- spots,
- scales,
- decorative markings.

## Prompt Block

This short block is only a reminder. It does not replace the mandatory prompt above.

Use it only for quick notes after the full mandatory prompt has already been included:

```text
Transform Image A into a Minecraft-style, Blockbench-ready, Minecraft Marketplace-quality model reference.

Do not create random voxel art, a generic Minecraft skin, or a merely pixelated copy.
Translate the uploaded subject into practical Minecraft Bedrock / Blockbench model language.

Preserve Image A's identity, silhouette, proportions, pose or stance, major shapes, key costume/armor/creature/object features, main colors, material zones, visual hierarchy, mood, and personality.

Simplify the design intelligently:
- large silhouette-critical details become geometry,
- secondary forms become fewer larger cuboids,
- small ornaments, seams, engravings, fabric motifs, scratches, trim, tiny studs, wrinkles, and fine markings become Minecraft pixel-art texture only.

Use clean cube and cuboid construction with varied rectangular proportions.
Use limited rotated cuboids only when they improve important silhouette details such as horns, blades, wings, ears, tails, shoulder plates, cloth flaps, hair chunks, tools, or accessories.

Avoid dense voxel sculpture, excessive tiny cubes, random pixel noise, high-poly concept art, realistic PBR detail, painterly texture, and surface details that cannot work at 16x16 or 32x32 Minecraft texture logic.

The result must feel like a real custom Minecraft Bedrock entity/model that could be built in Blockbench, optimized, textured, and used in a Marketplace-quality pack.
```

## Showcase Output Format

Use this format only when asking for a visual style-conversion showcase:

```text
Create a polished model showcase sheet.
Use one large 3/4 hero render at the top.
Below it, include smaller consistent turnaround views: front, left side, back, and right side.
Use the same exact model design across all views.
Use a clean dark or neutral studio background.
Do not include text, labels, logos, watermark, environment scene, or extra characters.
```

For the 8-sheet reference workflow, this showcase logic is a style calibration step. Sheet 01 still follows the approved orthographic sheet structure.

## Reject Output If

- It looks like a realistic concept render.
- It looks like a generic Minecraft skin.
- It is only pixelated but not Blockbench-buildable.
- It uses too many tiny cubes.
- It copies supporting samples.
- It drifts away from Image A.
- Turnaround views are inconsistent.
- Texture detail is too noisy or too high-resolution.
