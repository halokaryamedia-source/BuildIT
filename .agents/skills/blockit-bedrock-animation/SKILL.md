---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for animation inspection, BoneAnimator transforms, keyframes, interpolation, rig changes, timeline playback, batch/copy operations, and mapped particles.
---

# BlockIT Bedrock Animation

Own animation execution after the geometry/hierarchy/pivots needed by the requested motion are suitable.

## Direct Routing

Decide from intent + known state before discovery:

```text
new animation                         → create_animation
existing animation state unknown      → inspect_animation
create/edit/delete transform keyframe → manage_keyframes
interpolation / Bezier                → animation_graph_editor
Group/bone structure or pivot edit    → bone_rigging
playback/time/length/FPS/loop         → animation_timeline
coherent multi-key timing/value edit  → batch_keyframe_operations
explicit copy/paste/mirror            → animation_copy_paste
mapped particle effects               → create_animation / inspect_animation effects
```

Reuse known Group/bone UUIDs. **Call `get_project_info` only when** lifecycle state is unknown/stale or a needed field is missing. **Call `list_outline` only when** participating identity/hierarchy is unknown. Duplicate/colliding bone names are a determinism problem; do not guess through them.

## Deferred Spec Loading

After routing selects the animation tool, load a missing spec with **exact tool name + short animation action**; do not send raw user wording alone.

```text
inspect_animation          → "inspect_animation inspect authored animation keyframes"
manage_keyframes           → "manage_keyframes create edit transform keyframes"
animation_graph_editor     → "animation_graph_editor interpolation Bezier easing"
bone_rigging               → "bone_rigging edit reparent pivot bone rig"
animation_timeline         → "animation_timeline playback time loop animation"
batch_keyframe_operations  → "batch_keyframe_operations batch offset scale keyframes"
animation_copy_paste       → "animation_copy_paste copy mirror paste keyframes"
```

If the exact spec is already loaded, call it directly. A search reformulation keeps the same exact selected tool name; it does not reopen tool selection.

## Stage / Anti-Loop

Use the parent stage lock: `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.

- New animation: establish motion/participating bones and pivots, create only needed keyframes, then verify the relevant motion.
- Existing animation edit: inspect once when authored state is unknown, diagnose bone/channel/time, mutate only that state, then verify the affected motion.
- Known participating identity/state must not fall back to broad outline/project reads.
- A validation failure keeps the selected animation capability unless required identity/state became stale/unknown.
- Do not re-inspect the whole animation after a local edit when returned state plus a focused preview is sufficient.

## Readiness

For end-to-end reference work, production animation starts only after the relevant geometry baseline is accepted and the **participating Group/bone hierarchy and pivots** are suitable. A material geometry `FAIL`, attachment problem, or pivot uncertainty returns upstream; required unresolved evidence may become `BLOCKED`.

For an animation-only revision on an **existing asset**, current geometry is the user-provided baseline when remodelling is outside scope. This **does not certify the static model as reference-accurate**. Inspect only participating bones/pivots and animation state required by the motion.

A small diagnostic pose/playback may test pivot, attachment, or transform direction without counting as production progress. If material geometry/hierarchy/pivots later change, **consider animation on the affected bones stale** until affected keyframes, arcs, attachments, clipping, and neutral return are rechecked.

## Direct Animation Surface

```text
create_animation
inspect_animation
manage_keyframes
animation_graph_editor
bone_rigging
animation_timeline
batch_keyframe_operations
animation_copy_paste
```

Do not make `animation_timeline.select_range` a core-correctness dependency until its lifecycle is explicitly supported; prefer explicit keyframe/time ranges.

Particle effects are mapped through `create_animation.particle_effects` and inspected through `inspect_animation.effects`. Preserve referenced Locator names.

## Protected Gaps

Direct MCP authoring still does not own animation controllers, sound-effect keyframes, timeline-effect keyframes, or bone-binding expressions. Do not fake these through `risky_eval`, generic UI actions, or unrelated export paths. Preserve existing authored data and state the gap when required.

## Verification

After mutation, verify only the affected attachment, transform arc, clipping, and return-to-neutral. Preview only the relevant motion. Do not claim controller/in-game behavior without the corresponding direct capability and evidence.
