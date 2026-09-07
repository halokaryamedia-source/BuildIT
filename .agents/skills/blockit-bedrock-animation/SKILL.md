---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for authored motion, Molang, controllers, effects, timeline, and bounded correction.
---

# BlockIT Bedrock Animation

Use at `ACTIVE PHASE: ANIMATION` after Texturing approval and a suitable hierarchy/pivot setup.

## Boundary

Animation owns motion, not structural rig mutation. If bone/pivot/IK/parenting must change: `HANDOFF_REQUIRED` → `switch_authoring_phase` to Geometry with reason/readiness/resume target, then continue the same task. Do not search for `bone_rigging` in Animation. `create_project` is not an Animation capability. Before production keys, representative extreme poses must preserve attachment/contact/clearance; otherwise handoff Geometry first.

## Direct Routing

```text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
all timeline/keyframe work            → manage_animation_timeline (operation: keyframes|graph|timeline|batch|copy_paste)
existing animation effects            → manage_animation_effects
controller state/composition/effects  → manage_animation_controller
pose/time visual evidence             → capture_model_views(animation_preview)
```

`new known clip → create_animation → reuse returned UUID/state; timeline if needed`
`existing/unknown detail → inspect_animation`

Known capability → invoke through Gateway. Unknown/stale → `search_capabilities`; uncertain schema → `describe_capability` once. If a timeline branch is known, describe only `branch:{field:"operation",value:"keyframes|graph|timeline|batch|copy_paste"}`. Reuse fresh UUID/state.

Use `manage_animation_timeline`; `batch` owns coherent cohort work, not loops per key. Batch uses `operation="batch"` plus `batch_operation="offset|scale|reverse|mirror|smooth|bake"`; pass known `animation_id`. Controller/effect/graph/copy-paste are conditional.

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

Archetypes are categories, not presets. No universal FPS, duration, amplitude, phase, key count, or Bezier target. Do not use an animation quality score.

Use Molang for continuous, cyclic, reactive or parameterized motion; authored poses own identity-critical action/contact/silhouette. `q.anim_time` is time-driven; `q.modified_distance_moved` can drive travel phase. Never invent unknown caller values or signed reverse semantics. Chains use `driver → delayed followers`.

For material actions preserve `anticipation → action/impact → follow-through → recovery`.

## Evidence Economy

Do not `set_time` repeatedly just to capture frames. Use one `capture_model_views` with `animation_preview.animation_id` and explicit `times`; require `views × times <= 8`. Runtime temporarily poses the clip and restores timeline/selection state.

For a local defect use focused `inspect_animation(animation_id,bone,channel?,time_range?,diagnostics?)`. `diagnostics=true` reports technical candidates such as keys/effects outside length, dangling bone animators, or loop endpoint mismatch; it never creates visual PASS/FAIL.

Preferred loop:
```text
AUTHOR coherent keys/batch
→ capture representative times
→ focused inspect only the affected bone/channel/range when needed
→ one causal correction
→ recapture affected time/view cohort
```

Verify `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE` and record `IMPROVED | UNCHANGED | REGRESSED`. Review pose/timing/weight/contact, clipping, secondary motion/effects, then loop seam/neutral return. Cyclic/idle verification requires repeated full-loop playback; three static snapshots do not prove timing, phase, contact, or seam.

## Completion

Internal `PASS` means `READY_FOR_USER_REVIEW`. User approval → checkpoint → Finalization. Structural blocker → Geometry and re-approve affected stages only.

Controller blend-curve mutation and bone-binding expressions remain protected; never use `risky_eval` or generic UI fallbacks.
