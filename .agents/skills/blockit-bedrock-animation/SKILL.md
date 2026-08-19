---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for authored motion, Molang, controllers, effects, rig, timeline, and bounded correction.
---

# BlockIT Bedrock Animation

Use after participating hierarchy/pivots are suitable. Motion causality outranks keyframe count or curve complexity.

## Direct Routing

```text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
controller state/composition/effects  → manage_animation_controller
existing animation effects            → manage_animation_effects
transform keyframes / Molang values   → manage_keyframes
curve change with evidence            → animation_graph_editor
bone/pivot/IK                         → bone_rigging
time/length/FPS/loop/Molang controls  → animation_timeline
batch coherent operations             → batch_keyframe_operations
explicit copy/paste/mirror            → animation_copy_paste
new-animation particle/sound          → create_animation
```

## Deferred Spec Loading

Load the **exact tool name** only. Reuse fresh UUID/state; known participating identity/state must not fall back to broad hierarchy discovery or confirmation reads.

## Motion Design Contract

Before production keys define:

```text
archetype + intent + duration/snapping intent
primary driver bone(s) + counter-motion/stabilizers
followers / secondary chains
phase + contact / attachment invariants
authored-key vs Molang ownership
causal event for sound/particle
loop seam or neutral/controller handoff
```

Archetypes are categories, **not presets**. No universal FPS, duration, amplitude, phase, keyframe count, or Bezier target; use the simplest interpolation that preserves motion.

## Procedural Math / Molang

Use Molang for continuous, cyclic, reactive, parameterized motion; explicit authored poses own identity-critical action, impact, contact, silhouette, and acting. Preserve authored Molang text; do not invent unknown query/state values.

```text
q.anim_time               → time-driven cycle/response
q.modified_distance_moved → travel-linked phase
q.modified_move_speed     → speed/intensity response
controller blend value    → conditional layer weight
```

Periodic motion tracks base + amplitude + frequency + phase. Chains use `driver → delayed followers`, deliberate phase/amplitude hierarchy, and attachment continuity. Mirror/copy is not a gait generator; contact remains authored; run is not merely faster walk.

## Action / Weight / Effects

When material: `anticipation → acceleration/action → impact/contact → overshoot/follow-through → recovery → neutral/handoff`.

Use counter-motion when weight needs it; secondary parts normally lag the driver. Bind each particle/sound to a named **causal event** (release/contact/ignition/landing/start/stop), not time zero unless start is the cause.

## Authoring / Verification

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`. Geometry/hierarchy/pivot changes invalidate only affected animation assumptions.

Review: pose/readability → timing/phase → weight/contact → attachment/clipping → secondary motion → effect synchronization → loop seam/neutral return.

Correction verdict: `IMPROVED | UNCHANGED | REGRESSED`; tool success is not motion quality. Same causal correction direction failing twice without new evidence → `BLOCKED`. Do not use an animation quality score.

## Protected Gaps

Controller blend-curve mutation and bone-binding expressions remain protected; do not route them through `risky_eval` or generic UI actions. Authored controller state is not proof of Minecraft execution; live playback/visual quality requires direct runtime evidence when explicitly activated.
