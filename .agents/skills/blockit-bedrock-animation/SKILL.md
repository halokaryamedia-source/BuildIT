---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for authored animation inspection, BoneAnimator transforms, keyframes, graph interpolation, rig changes, timeline playback, batch/copy operations, and mapped particle effects. Preserve unsupported native controller/sound/timeline-effect capability as explicit gaps.
---

# BlockIT Bedrock Animation

Own animation execution after the geometry/hierarchy/pivots needed by the requested motion are suitable.

## Preflight

1. Reuse project lifecycle/format state already returned. **Call `get_project_info` only when** active project state is unknown, stale, or missing a field needed by the animation decision.
2. Reuse known Group/bone UUIDs. **Call `list_outline` only when** a participating identity or hierarchy relationship remains unknown.
3. For an existing animation, use `inspect_animation` before mutation instead of inferring authored keyframes from screenshots.
4. Route unclear pivot/hierarchy judgement back to `blockbench-bedrock-modelling`.

## Readiness

For end-to-end reference work, production animation starts only after the relevant geometry baseline is accepted and the **participating Group/bone hierarchy and pivots** are suitable. A material geometry `FAIL`, attachment problem, or pivot uncertainty returns upstream; required unresolved evidence may become `BLOCKED`.

For an animation-only revision on an **existing asset**, current geometry is the user-provided baseline when remodelling is outside scope. This **does not certify the static model as reference-accurate**. Inspect only participating bones/pivots and animation state required by the requested motion.

A small diagnostic pose/playback may test pivot, attachment, or transform direction without counting as production progress. If material geometry/hierarchy/pivots later change, **consider animation on the affected bones stale** until the affected keyframes, arcs, attachments, clipping, and neutral return are rechecked.

## Direct Animation Surface

```text
create_animation             create native Bedrock animation + mapped particles
inspect_animation            authored animation/bone/keyframe/effect state
manage_keyframes             create/edit/delete/select transform keyframes
animation_graph_editor       interpolation / Bezier
bone_rigging                 explicit Group/bone structure and pivots
animation_timeline           playback/time/length/FPS/loop
batch_keyframe_operations    bounded timing/value operations
animation_copy_paste         explicit copy/paste/mirror
```

Use Group UUIDs when possible. Duplicate/colliding bone names are a determinism problem; do not guess through them.

## Create / Edit

**New animation:** establish motion and participating bones, verify pivots, create only necessary keyframes, then inspect/preview the result.

**Existing animation:** inspect first, diagnose the affected bone/channel/time, edit only that state, then re-inspect and preview the affected motion.

Do not make `animation_timeline.select_range` a core-correctness dependency until its lifecycle is explicitly supported; prefer explicit keyframe/time ranges on editing tools.

Particle effects are mapped through `create_animation.particle_effects` and inspected through `inspect_animation.effects`. Preserve referenced Locator names.

## Protected Gaps

Direct MCP authoring still does not own animation controllers, sound-effect keyframes, timeline-effect keyframes, or bone-binding expressions. Do not fake these through `risky_eval`, generic UI actions, or unrelated export paths. Preserve existing authored data and state the gap when required.

## Verification

After mutation, inspect authored continuity only where needed and preview only the relevant motion. Verify attachment, transform arc, clipping, and return-to-neutral for the request. Do not claim controller/in-game behavior without the corresponding direct capability and evidence.
