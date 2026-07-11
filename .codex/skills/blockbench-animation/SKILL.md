---
name: blockbench-animation
description: "Optional Animation-stage skill for approved Bedrock cuboid assets. Creates only required group/bone motion, captures hierarchy and pivot evidence, validates Animation, and stops for review."
---

# Blockbench Animation

## Entry

Load only when the manifest or `ANIMATION.md` requires at least one animation family or interactive motion. Otherwise mark Animation skipped and proceed to Final Validation without loading this skill.

Use tool profile `BEDROCK_CUBOID_ANIMATION` or `ANIMATION_LOCAL_REPAIR`, and require the current MCP session to own the project write lease.

Read:

1. `PRODUCTION_CONTEXT.md`
2. the approved Reference Visual
3. `GEOMETRY.md`
4. `ANIMATION.md`
5. the current session state

## Work

- Verify required groups, hierarchy, neutral pose, and pivots.
- Create only required clips.
- Use rigid cuboid group/bone motion.
- Preserve Geometry and Texture.
- Check inherited motion, ground contact, clipping, and neutral-pose recovery.
- Use one named issue or tightly related pair during revision.

## Forbidden

- mesh armatures or vertex weights for normal cuboid assets;
- new geometry, texture redesign, or optional clips;
- motion outside approved axes/ranges;
- final export.

## Review Output

1. Save the Animation review checkpoint inside the active session.
2. Write hierarchy, pivot, neutral-pose, and required clip evidence only once at review.
3. Run `validate_reference_contract` for Animation.
4. Write `animation_report.json` and stop for `APPROVED` or `REVISION: ...`.

Do not create extra clips or captures merely for completeness.
