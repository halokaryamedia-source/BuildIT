---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for authored motion, Molang, controllers, effects, timeline, and bounded correction.
---

# BlockIT Bedrock Animation

Use only when `ACTIVE PHASE: ANIMATION` and participating hierarchy/pivots are suitable.

## Phase Boundary

Animation owns motion, not structural rig mutation.

```text
bone/pivot/IK/parenting structure must change
→ HANDOFF_REQUIRED
  target_phase: geometry
  reason: <observed rig defect>
  readiness: <which hierarchy/pivot/IK prerequisite failed>
  resume_from: <current model/project + immediate animation/bone target identifiers>
  action: set MCP Authoring Phase=geometry; reload BlockIT MCP
→ STOP
```

Do not `tool_search` for `bone_rigging` while Animation is active.

## Direct Routing

```text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
transform keyframes / Molang values   → manage_keyframes
coherent time/value cohort transform  → batch_keyframe_operations
time/length/FPS/loop/Molang controls  → animation_timeline
curve change with evidence            → animation_graph_editor
explicit copy/paste/mirror            → animation_copy_paste
existing animation effects            → manage_animation_effects
controller state/composition/effects  → manage_animation_controller
new-animation particle/sound          → create_animation
```

Load the exact active-phase tool only. Reuse fresh UUID/state; known identity **must not fall back to broad hierarchy discovery or confirmation reads**. If one offset/scale/mirror/bake intent applies to several existing keys, use one `batch_keyframe_operations`; do not loop `manage_keyframes` per key. Per-key authored value changes remain `manage_keyframes`. Prefer batch coherent operations for one shared cohort intent.

Controller/effect/graph/copy-paste tools are conditional: use them only when that behavior is requested or evidenced, not because search ranks them near a basic keyframe/timeline route.

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

Archetypes are categories, not presets. No universal FPS, duration, amplitude, phase, keyframe count, or Bezier target. Do not reduce acceptance to an **animation quality score**.

## Procedural Math / Molang

Use Molang for continuous, cyclic, reactive, parameterized motion; explicit authored poses own identity-critical action, impact, contact, silhouette, and acting. Preserve authored Molang text; do not invent unknown query/state values.

```text
q.anim_time               → time-driven cycle/response
q.modified_distance_moved → travel-linked phase
q.modified_move_speed     → speed/intensity response
controller blend value    → conditional layer weight
```

Periodic motion tracks base + amplitude + frequency + phase. Chains use driver → delayed followers, deliberate phase/amplitude hierarchy, and attachment continuity.

## Action / Effects / Verification

When material: `anticipation → acceleration/action → impact/contact → overshoot/follow-through → recovery → neutral/handoff`.

Bind particles/sounds to named causal events, not time zero unless start is the cause.

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`

Review pose/readability → timing/phase → weight/contact → attachment/clipping → secondary motion → effect synchronization → loop seam/neutral return.

Correction verdict: `IMPROVED | UNCHANGED | REGRESSED`; tool success is not motion quality. Same causal correction direction failing twice without new evidence → `BLOCKED`.

## Completion / Handoff

Requested Animation scope is complete only when the required motion/effect behavior is verified. If another phase is requested afterward, emit `HANDOFF_REQUIRED` with the latest verified readiness and STOP rather than preloading another specialist.

## Protected Gaps

Controller blend-curve mutation and bone-binding expressions remain protected; do not route them through `risky_eval` or generic UI actions. Authored controller state is not proof of Minecraft execution.
