---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for authored motion, Molang, controllers, effects, timeline, and bounded correction.
---

# BlockIT Bedrock Animation

Use at `ACTIVE PHASE: ANIMATION` after Texturing approval + checkpoint + Animation Readiness Preflight when participating hierarchy/pivots are suitable.

## Boundary

Animation owns motion, not structural rig mutation. Structural blocker → `HANDOFF_REQUIRED` with `target_phase: geometry`, reason, readiness, resume target → `switch_authoring_phase` → resume same task. Before keys, representative extreme poses preserve attachment/contact/clearance; otherwise handoff Geometry first. Do not search for `bone_rigging`; `create_project` is not Animation.

## Direct Routing

```text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
all timeline/keyframe work            → manage_animation_timeline (operation: keyframes|graph|timeline|batch|copy_paste)
clip/native property cohort           → manage_animation_timeline (operation: properties)
existing animation effects            → manage_animation_effects
controller state/composition/effects  → manage_animation_controller
pose/time visual evidence             → capture_model_views(animation_preview)
```

`new known clip → create_animation → reuse returned UUID/state; timeline if needed`
`existing/unknown detail → inspect_animation`

Known → Gateway. Unknown/stale → `search_capabilities`; schema → `describe_capability` once. Reuse fresh UUID/state; known identity must not fall back to broad hierarchy discovery or confirmation reads.

`batch` owns one coherent cohort, not loops per key; use `operation="batch"` + `batch_operation="offset|scale|reverse|mirror|smooth|bake"`. `operation="properties"` batches length/loop, `anim_time_update`, `blend_weight`, `start_delay`, `loop_delay`, `override_previous_animation`, and bone `relative_to.rotation=entity|parent` in one Undo. Controller/effect/graph/copy-paste are conditional.

## Motion Design Contract

Before keys define:
```text
archetype + intent + duration/snapping
primary driver + counter-motion + followers
phase + contact/attachment invariants
authored-key vs Molang ownership
external query/variable caller semantics + units/default/reset/direction
causal event for sound/particle
loop seam or neutral/controller handoff
```

Archetypes are not presets. No universal FPS, duration, amplitude, phase, keyframe count, or Bezier target. Do not use an animation quality score.

Use Molang for continuous/cyclic/reactive/parameterized motion; authored poses own identity-critical action/contact/silhouette. `q.anim_time` is time-driven; `q.modified_distance_moved` can own travel phase. Never invent unknown caller values or signed reverse semantics. Chains use `driver → delayed followers`. Material actions preserve `anticipation → action/impact → follow-through → recovery`.

### Molang / math

No separate math tool. Author Molang through transforms, properties, controller conditions/blends, and effects. Current official math surface is accepted: trig/inverse trig; clamp/min/max/sign/rounding/mod; lerp/inverse_lerp/lerprotate/hermite; pow/exp/ln/sqrt; random/die-roll; `math.pi`; and `math.ease_{in|out|in_out}_{back|bounce|circ|cubic|elastic|expo|quad|quart|quint|sine}`. Easing math is version-sensitive; trig uses degrees.

`diagnostics=true` reports math/dependencies, native properties, motion dynamics, and loaded client-entity wiring without evaluating gameplay truth.

## Evidence Economy

Do not `set_time` repeatedly. One `capture_model_views` with `animation_preview.animation_id` + explicit times; `views × times <= 8`.

```text
AUTHOR coherent keys/batch
→ capture representative times
→ focused inspect only when evidence can change correction
→ one causal correction
→ recapture affected cohort
```

Verify `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`; record `IMPROVED | UNCHANGED | REGRESSED`. Cyclic/idle verification requires repeated full-loop playback; three static snapshots do not prove timing, phase, contact, or seam.

## Completion

Internal `PASS` = `READY_FOR_USER_REVIEW`. User approval → checkpoint → Finalization.

Controller blend-curve mutation and bone-binding expressions beyond native `relative_to.rotation=entity` remain protected; never use `risky_eval` or generic UI fallbacks.
