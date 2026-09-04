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
  readiness: <failed hierarchy/pivot/IK prerequisite>
  resume_from: <current project + immediate animation/bone target>
→ invoke switch_authoring_phase through Gateway
→ Gateway refreshes Runtime catalog
→ continue same task with Geometry specialist
```

Do not search for `bone_rigging` while Animation is active. No normal phase handoff requires reconnect, Blockbench reload, or a new chat.

## Direct Routing

```text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
all timeline/keyframe work            → manage_animation_timeline (operation: keyframes|graph|timeline|batch|copy_paste)
existing animation effects            → manage_animation_effects
controller state/composition/effects  → manage_animation_controller
new-animation particle/sound          → create_animation
```

Primary normal path:

```text
create_animation
inspect_animation
manage_animation_timeline
```

Conditional support:

```text
manage_animation_effects
manage_animation_controller
```

Known exact capability → invoke through Gateway. Unknown/stale capability → one focused `search_capabilities`; exact current schema needed → `describe_capability` once. **Reuse fresh UUID/state; known identity must not fall back to broad hierarchy discovery or confirmation reads.**

Route all timeline/keyframe intents through `manage_animation_timeline`; use `batch` for one shared cohort intent instead of looping per key. Prefer **batch coherent operations** when one intent covers several keys. Controller/effect/graph/copy-paste tools are conditional; use them only when behavior is requested or evidenced.

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

Archetypes are categories, **not presets**. No universal FPS, duration, amplitude, phase, keyframe count, or Bezier target. Do not reduce acceptance to an **animation quality score**.

## Procedural Math / Molang

Use Molang for continuous, cyclic, reactive, parameterized motion; explicit authored poses own identity-critical action, impact, contact, silhouette, and acting. Preserve authored Molang text; do not invent unknown query/state values.

```text
q.anim_time               → time-driven cycle/response
q.modified_distance_moved → travel-linked phase
q.modified_move_speed     → speed/intensity response
controller blend value    → conditional layer weight
```

Periodic motion tracks base + amplitude + frequency + phase. Chains use **driver → delayed followers**, deliberate phase/amplitude hierarchy, and attachment continuity.

## Action / Effects / Verification

When material: `anticipation → acceleration/action → impact/contact → overshoot/follow-through → recovery → neutral/handoff`.

Bind particles/sounds to named causal events, not time zero unless start is the cause.

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`

Review pose/readability → timing/phase → weight/contact → attachment/clipping → secondary motion → effect synchronization → loop seam/neutral return.

Correction verdict: `IMPROVED | UNCHANGED | REGRESSED`; tool success is not motion quality. Same causal correction direction failing twice without new evidence → `BLOCKED`.

## Completion / Handoff

Requested Animation scope is complete only when required motion/effect behavior is verified. If another phase is needed afterward, preserve resume-critical state, switch through the Gateway, and continue the same task with only the target specialist loaded.

## Protected Gaps

Controller blend-curve mutation and bone-binding expressions remain protected; do not route them through `risky_eval` or generic UI actions. Authored controller state is not proof of Minecraft execution.
