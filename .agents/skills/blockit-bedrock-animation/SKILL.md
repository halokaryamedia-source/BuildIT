---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for inspection, keyframes, interpolation, rig, timeline, batch/copy, and mapped effects.
---

# BlockIT Bedrock Animation

Own animation execution after required geometry/hierarchy/pivots are suitable.

## Direct Routing

Route from intent + known state:

```text
new animation                         → create_animation
existing animation/controller unknown → inspect_animation
controller create/edit/state machine  → manage_animation_controller
create/edit/delete transform keyframe → manage_keyframes
interpolation / Bezier                → animation_graph_editor
Group/bone structure or pivot edit    → bone_rigging
playback/time/length/FPS/loop         → animation_timeline
coherent multi-key timing/value edit  → batch_keyframe_operations
explicit copy/paste/mirror            → animation_copy_paste
mapped particles / sounds             → create_animation / inspect_animation effects
```

Reuse known Group/bone/controller/state UUIDs. Use `get_project_info` only for unknown/stale lifecycle or a missing needed field. Use `list_outline` only when participating identity/hierarchy is unknown. Never guess duplicate bone names.

## Deferred Spec Loading

Missing spec → load exact tool name + short action. Loaded spec → call directly. One reformulation keeps the same tool name.

## Stage / Anti-Loop

Use `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.

- New animation: establish motion/bones/pivots, author only needed keys, then verify relevant motion.
- Existing edit: inspect once when authored state is unknown, diagnose bone/channel/time, mutate that state, then verify affected motion.
- Controller edit: batch coherent operations; reuse `manage_animation_controller` returned IDs/state instead of immediate re-inspection.
- Known controller state: use `inspect_animation(state=...)` only when focused detail is missing. Focused output is state-only, not a second full controller summary.
- Focused state detail returns exact transition, animation-link, sound, and particle UUIDs; reuse them instead of rediscovering the controller.
- Known participating identity/state must not fall back to broad project/outline reads.
- Validation failure keeps the selected capability unless state became stale/unknown.
- Do not re-inspect a whole animation/controller when returned state plus focused evidence is sufficient.

## Readiness

For end-to-end reference work, production animation starts only after dependent geometry and participating Group/bone hierarchy/pivots are suitable. Material geometry `FAIL`, attachment trouble, or pivot uncertainty returns upstream; unresolved required evidence may become `BLOCKED`.

For animation-only revision on an **existing asset**, current geometry is the user-provided baseline when remodelling is out of scope; this **does not certify reference accuracy**. Inspect only participating bones/pivots and animation state needed by the motion.

A small diagnostic pose/playback may test pivot, attachment, or transform direction. If material geometry/hierarchy/pivots change, treat animation on affected bones as stale until affected keys, arcs, attachment, clipping, and neutral return are rechecked.

No keyframe-count/FPS/Bezier-complexity target. `manage_keyframes` preserves explicit Molang transform strings; do not guess-bake them.

## Direct Animation Surface

```text
create_animation
inspect_animation
manage_animation_controller
manage_keyframes
animation_graph_editor
bone_rigging
animation_timeline
batch_keyframe_operations
animation_copy_paste
```

Do not make `animation_timeline.select_range` a core-correctness dependency; prefer explicit keyframe/time ranges. Particle/sound effects use `create_animation` effect maps and `inspect_animation.effects`.

## Protected Gaps

Existing-animation sound/timeline mutation, controller state particle/sound + blend-curve mutation, and bone-binding expressions remain protected. Do not route them through `risky_eval` or generic UI actions.

## Verification

Verify only affected attachment, transform arc, clipping, effects, and neutral return. Preview only relevant motion. Controller inspection/mutation is authored-state evidence only; controller execution/in-game behavior requires direct runtime proof.
