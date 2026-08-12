---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for inspection, keyframes, interpolation, rig, timeline, batch/copy, and mapped particles.
---

# BlockIT Bedrock Animation

Own animation execution after required geometry/hierarchy/pivots are suitable.

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
mapped particles                      → create_animation / inspect_animation effects
```

Reuse known Group/bone UUIDs. **Call `get_project_info` only when** lifecycle state is unknown/stale or a needed field is missing. **Call `list_outline` only when** participating identity/hierarchy is unknown. Never guess through duplicate bone names.

## Deferred Spec Loading

After routing, load a missing spec with the **exact tool name** + short action; never raw user wording alone.

```text
inspect_animation         → "inspect_animation inspect authored animation keyframes"
manage_keyframes          → "manage_keyframes create edit transform keyframes"
animation_graph_editor    → "animation_graph_editor interpolation Bezier easing"
bone_rigging              → "bone_rigging edit reparent pivot bone rig"
animation_timeline        → "animation_timeline playback time loop"
batch_keyframe_operations → "batch_keyframe_operations batch offset scale keyframes"
animation_copy_paste      → "animation_copy_paste copy mirror paste keyframes"
```

If the exact spec is loaded, call it directly; reformulation keeps the same selected tool name.

## Stage / Anti-Loop

Use `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.

- New animation: establish motion/bones/pivots, create only needed keyframes, then verify relevant motion.
- Existing edit: inspect once when authored state is unknown, diagnose bone/channel/time, mutate only that state, then verify affected motion.
- Known participating identity/state must not fall back to broad outline/project reads.
- Validation failure keeps the selected capability unless state became stale/unknown.
- Do not re-inspect the whole animation when returned state plus focused preview is sufficient.

## Readiness

For end-to-end reference work, production animation starts only after the geometry baseline is accepted and the **participating Group/bone hierarchy and pivots** are suitable. Material geometry `FAIL`, attachment trouble, or pivot uncertainty returns upstream; unresolved required evidence may become `BLOCKED`.

For animation-only revision on an **existing asset**, current geometry is the user-provided baseline when remodelling is out of scope. This **does not certify the static model as reference-accurate**. Inspect only participating bones/pivots and animation state needed by the motion.

A small **diagnostic pose/playback** may test pivot, attachment, or transform direction. If material geometry/hierarchy/pivots change, **consider animation on the affected bones stale** until affected keyframes, arcs, attachments, clipping, and neutral return are rechecked.

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

Do not make `animation_timeline.select_range` a core-correctness dependency; prefer explicit keyframe/time ranges. Particle effects use `create_animation.particle_effects` and `inspect_animation.effects`; preserve Locator names.

## Protected Gaps

Direct MCP authoring still does not own animation controllers, sound-effect keyframes, timeline-effect keyframes, or bone-binding expressions. Do not fake them through `risky_eval`, generic UI actions, or unrelated export paths.

## Verification

After mutation, verify only affected attachment, transform arc, clipping, and return-to-neutral. Preview only relevant motion. Do not claim controller/in-game behavior without direct capability and evidence.
