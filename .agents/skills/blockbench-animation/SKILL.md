---
name: blockbench-animation
description: "Optional Animation-stage skill for approved Bedrock cuboid assets. Creates only required group/bone motion, captures hierarchy and pivot evidence, validates Animation, and stops for review."
---

# Blockbench Animation

Load only when the approved manifest or `ANIMATION.md` requires motion. Use `BEDROCK_CUBOID_ANIMATION` or `ANIMATION_LOCAL_REPAIR`.

Create only required rigid cuboid group/bone motion, preserve Geometry and Texture, verify pivots, hierarchy, ground contact, clipping, and neutral-pose recovery, capture required evidence, validate, and stop at `ANIMATION_REVIEW`.

Do not use mesh armatures, vertex weights, new geometry, texture redesign, optional clips, or final export.
