---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist.
---

# BlockIT Bedrock Animation

Use at `ACTIVE PHASE: ANIMATION` after Texturing approval + checkpoint + Animation Readiness Preflight when participating hierarchy/pivots are suitable.

## Boundary

Animation owns motion, not structural rig mutation. Blocker → `HANDOFF_REQUIRED`, `target_phase: geometry` + readiness → `switch_authoring_phase` → resume same task through Gateway; if motion structure is unsuitable, handoff Geometry first. Before keys, representative extreme poses preserve contact/clearance. Do not search for `bone_rigging`.

## Artist-Facing Controller Boundary
Animation Controller is artist-facing composition/preview for transition/blend continuity and effects; BP/gameplay integration is out. `resource_operations` is **not a normal asset-authoring route**.

Particle is asset-only. `particle-reference`: Direct Runtime/Inspector only; no client-entity wiring.

## Direct Routing

```text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
all timeline/keyframe work            → manage_animation_timeline (operation: keyframes|graph|timeline|batch|copy_paste)
clip/native property cohort           → manage_animation_timeline (operation: properties)
existing animation effects            → manage_animation_effects
particle inspect/create/patch/save/preview → inspect_particle / manage_particle
controller state/composition/effects  → manage_animation_controller
nested controller/blend curve         → same tool (native_operations)
pose/time visual evidence             → capture_model_views(animation_preview)
```

`new known clip → create_animation → reuse returned UUID/state; timeline if needed`
`existing/unknown detail → inspect_animation`

Known → Gateway; unknown/stale → `search_capabilities`; schema → `describe_capability` once. Reuse fresh UUID/state; known identity must not fall back to broad hierarchy discovery or confirmation reads.

`batch` uses operation="batch" + batch_operation= for one coherent cohort, not loops per key. `properties` owns clip state; `native_operations` nested controllers/curves. Controller/effect/graph/copy-paste are conditional.

## Motion Design Contract

Before keys define:
```text
archetype + intent + duration/snapping
primary driver + counter-motion + followers
phase + contact/attachment invariants
support/flight/impact events + center-of-mass path + foot plant/release times
authored-key vs Molang ownership
external query/variable caller semantics + units/default/reset/direction
causal event for sound/particle
loop seam or neutral/controller handoff
```

Archetypes are not presets. No universal FPS, duration, amplitude, phase, keyframe count, or Bezier target. Do not use an animation quality score.
Author the smallest judgeable motion cohort first. Validate its contact and curves before propagating followers. Dense baked samples need a specific interpolation/export reason; mathematical offline generation or many keys does not prove advanced motion. Record what visible behavior each Molang expression owns, not merely that math exists.

Use Molang for continuous/cyclic/reactive **visual motion**; authored poses own identity-critical action/contact/silhouette. `q.anim_time` is time-driven; `q.modified_distance_moved` can own travel phase. External gameplay callers remain integration contracts; never invent caller values or signed reverse semantics. Chains use `driver → delayed followers`. Actions preserve `anticipation → action/impact → follow-through → recovery`.

### Molang / math

No separate math tool. Author Molang through existing transforms/properties/controller/effect fields. Accept official trig, clamp/rounding, interpolation, exponential/power, random/die-roll, `math.pi`, and `math.ease_{in|out|in_out}_{back|bounce|circ|cubic|elastic|expo|quad|quart|quint|sine}`. Easing math is version-sensitive; trig uses degrees.

File-backed client/runtime wiring remains compatibility/inspection, not normal model creation. Never `risky_eval` or evaluate gameplay truth.

## Evidence Economy

Do not `set_time` repeatedly. One `capture_model_views` with explicit times; `views × times <= 8`.

```text
AUTHOR coherent keys/batch
→ capture representative times
→ focused inspect only when evidence can change correction
→ one causal correction
→ recapture affected cohort
```

Verify `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`; record `IMPROVED | UNCHANGED | REGRESSED`. Cyclic/idle verification requires repeated full-loop playback; three static snapshots do not prove timing/phase/contact/seam.
Observe at least three consecutive cycles for cyclic review. Check plant/release, foot sliding, floor penetration, weight transfer, follow-through and loop velocity continuity; action clips also require landing/recovery and any intended preview transition. Retain a playable evidence clip with revision, duration and view at review boundaries. Playback unavailable or interrupted means `UNVERIFIED`, not a replacement static PASS.

## Completion

Internal `PASS` = `READY_FOR_USER_REVIEW`. User approval → checkpoint → Finalization.

Protected gap: bone-binding expressions beyond `relative_to.rotation=entity`. Source/CI does not prove live Blockbench/Minecraft playback.
