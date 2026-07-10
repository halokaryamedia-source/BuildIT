# Ninja Master Ground Truth Reference Test

Use this only as an accuracy test target for reference generation.

Source model:

```text
SourceDocument/blockbench-samples/ninja_master.geo.bbmodel
```

## Purpose

This target is useful because the Bedrock model already exists. Reference images can be judged against the actual geometry instead of only visual preference.

The goal is not to design a new ninja. The goal is to test whether ChatGPT can produce accurate Minecraft/Blockbench reference sheets from a known Bedrock Entity sample.

## Model Metrics

| Field | Value |
| --- | --- |
| Format | Bedrock Entity |
| Texture resolution | 160x160 |
| Elements | 33 |
| Unique element names | 22 |
| Animations | 3 |
| Measured mesh bounds X | -8.1 to 8.1 |
| Measured mesh bounds Y | -0.2 to 41.2 |
| Measured mesh bounds Z | -6.1 to 5.1 |
| Measured width | 16.2u |
| Measured height | 41.4u |
| Measured depth | 11.2u |
| Measured height in blocks | 2.59 blocks |
| Player reference | 28.8u / 1.8 blocks |

## Scale Meaning

This sample is taller than a default standing player reference.

```text
41.4u / 16u = 2.59 blocks
41.4u / 28.8u = 1.44x player reference height
```

Do not force this model into 28.8u player height. Treat it as a stylized tall humanoid / boss-like Bedrock Entity.

## Main Geometry Parts

Build/read these as geometry-level forms:

- waist
- torso
- upper torso / neck transition
- left upper arm
- left lower arm
- right upper arm
- right lower arm
- head
- head outer layer / hood
- hair/top knot pieces
- beard pieces
- belt / front buckle
- hanging belt straps
- left and right side cloth panels
- front cloth panel
- rear cloth panel
- upper legs
- lower legs
- feet

## Texture-Only Details

Treat these as texture-only unless the source geometry explicitly contains a cuboid part:

- fabric folds
- small seam lines
- subtle cloth edge shading
- facial pixel detail
- hair texture
- belt surface markings
- tiny costume trim

## Reference Accuracy Checks

Generated reference sheets should preserve:

- tall humanoid silhouette
- broad head/hood read
- narrow depth compared to height
- clear torso/waist/leg separation
- strong front-facing character read
- lower robe/cloth panels around legs
- visible arms attached at shoulder height
- feet extending forward enough to read in side view

Fail if:

- the character becomes player-height instead of taller boss-like height
- the model becomes smooth fantasy concept art
- cloth/fabric detail becomes excessive tiny geometry
- the side view ignores the shallow depth
- arms, legs, or feet do not match the broad blocky Minecraft proportions
- the sheet does not distinguish geometry-level parts from texture-only details

## Required Scale Sheet Values

Use these as ground-truth targets:

```text
Width: 16.2u
Height: 41.4u
Depth: 11.2u
Reference block: 16u x 16u x 16u
Player reference: 28.8u high
UV atlas target: 256x256
```

The scale comparison must show the model taller than the player reference and `2.59` blocks tall.

## Recommended Reference Flow

1. Generate Sheet 01 orthographic views from the existing sample target.
2. Generate `01_ninja_master_orthographic_views.notes.md`.
3. Compare the generated sheet against this ground truth.
4. Only continue to Sheet 02 if Sheet 01 preserves height, width, depth, silhouette, and main part separation.
