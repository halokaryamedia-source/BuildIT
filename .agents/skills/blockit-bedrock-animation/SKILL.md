---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for authored motion, Molang, controllers, effects, timeline, and bounded correction.
---

# BlockIT Bedrock Animation

Use at `ACTIVE PHASE: ANIMATION` after Texturing approval + checkpoint + Animation Readiness Preflight when hierarchy/pivots are suitable.

## Boundary

Animation owns motion, not structural rig mutation. Bone/pivot/IK/parenting defect → `HANDOFF_REQUIRED` to Geometry with reason/readiness/resume target → `switch_authoring_phase` → continue same task. Do not search for `bone_rigging` in Animation. `create_project` is not an Animation capability.

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

Known capability → Gateway directly. Unknown/stale → one `search_capabilities`; uncertain schema → `describe_capability` once. Reuse fresh UUID/state; no confirmation read after a successful mutation.

`batch` owns coherent key cohorts, never loops per key; use `batch_operation="offset|scale|reverse|mirror|smooth|bake"`. `operation="properties"` sets any applicable cohort of length/snapping/loop, `anim_time_update`, `blend_weight`, `start_delay`, `loop_delay`, `override_previous_animation`, and bone `relative_to.rotation=entity|parent` in one Undo unit.

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

Archetypes are categories, not presets. No universal FPS, duration, amplitude, phase, keyframe count, or Bezier target. Do not use an animation quality score.

Use Molang for continuous/cyclic/reactive/parameterized motion; authored poses own identity-critical action/contact/silhouette. `q.anim_time` is time-driven; `q.modified_distance_moved` can own travel phase. Chains use `driver → delayed followers`. Material actions preserve `anticipation → action/impact → follow-through → recovery`.

### Molang / math

No separate math tool. Author Molang directly through transforms, animation properties, controller conditions/blends, and effect scripts. Current official math surface is supported as authored text: trig/inverse trig; clamp/min/max/sign/rounding/mod; lerp/inverse_lerp/lerprotate/hermite; pow/exp/ln/sqrt; random/die-roll; `math.pi`; and `math.ease_{in|out|in_out}_{back|bounce|circ|cubic|elastic|expo|quad|quart|quint|sine}`. Easing math is version-sensitive. Trig uses degrees.

`diagnostics=true` reports used/unknown math, dependencies, version-sensitive/nondeterministic math, native properties, motion dynamics, and loaded client-entity mapping evidence. It never evaluates gameplay truth.

## Evidence Economy

Do not `set_time` repeatedly for screenshots. Use one `capture_model_views` with `animation_preview.animation_id` and explicit `times`; require `views × times <= 8`.

```text
AUTHOR coherent keys/batch
→ capture representative times
→ focused inspect only when evidence can change correction
→ one causal correction
→ recapture affected cohort
```

Verify `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`; record `IMPROVED | UNCHANGED | REGRESSED`. Cyclic/idle verification requires repeated full-loop playback; snapshots do not prove timing or seam.

## Completion

Internal `PASS` means `READY_FOR_USER_REVIEW`. User approval → checkpoint → Finalization. Structural blocker → Geometry and re-approve affected stages only.

Controller blend-curve mutation and bone-binding expressions beyond native `relative_to.rotation=entity` remain protected; never use `risky_eval` or generic UI fallbacks.
