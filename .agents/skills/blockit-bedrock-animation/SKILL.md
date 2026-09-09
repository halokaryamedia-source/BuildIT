---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist.
---

# BlockIT Bedrock Animation

Use at `ACTIVE PHASE: ANIMATION` after Texturing approval + checkpoint + Animation Readiness Preflight when hierarchy/pivots are suitable.

## Boundary

Animation owns motion, not structural rig mutation. Structural blocker → `HANDOFF_REQUIRED` to geometry + readiness → `switch_authoring_phase` → resume through Gateway. Before keys, extreme poses must preserve contact/clearance. Do not search for `bone_rigging`.

## Direct Routing

```text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
timeline/keyframes                    → manage_animation_timeline (operation: keyframes|graph|timeline|batch|copy_paste)
clip/native property cohort           → manage_animation_timeline (operation: properties)
existing animation effects            → manage_animation_effects
controller state/composition/effects  → manage_animation_controller
nested controller/blend curve         → same tool (native_operations)
client/controller runtime JSON        → same tool (resource_operations)
pose/time evidence                    → capture_model_views(animation_preview)
```

`new known clip → create_animation → reuse returned UUID/state`; existing/unknown → `inspect_animation`.
Known → Gateway. Unknown/stale → `search_capabilities`; schema → `describe_capability` once. Reuse fresh UUID/state; no broad confirmation reads.

`batch` = operation="batch" + batch_operation= for one coherent cohort. `properties` batches clip-native state; `native_operations` owns nested controllers/blend curves. `resource_operations` owns client JSON + file-backed controller variables/remap curves. Client ops cover animation/animate/sound mappings plus `set/remove_pre_animation_variable`, `set/remove_initialize_variable`, `set/remove_public_variable`, and `set/remove_scale`.

## Motion Design Contract

Before keys define:
```text
archetype + intent + duration/snapping
primary driver + counter-motion + followers
phase + contact/attachment invariants
authored-key vs Molang ownership
external query/variable semantics + units/default/reset/direction
causal sound/particle event
loop seam or neutral/controller handoff
```

Archetypes are not presets. No universal FPS, duration, amplitude, phase, key count, or Bezier target. No animation quality score.

Use Molang for continuous/cyclic/reactive motion; authored poses own identity-critical action/contact/silhouette. `q.anim_time` is time-driven; `q.modified_distance_moved` can own travel phase. Never invent caller values/reverse semantics. Chains use `driver → delayed followers`; actions preserve `anticipation → action/impact → follow-through → recovery`.

### Molang / math

No separate math tool. Author Molang through transforms/properties/controller/effect fields. Accept official trig, clamp/rounding, interpolation, power/exponential, random/die-roll, `math.pi`, and `math.ease_{in|out|in_out}_{back|bounce|circ|cubic|elastic|expo|quad|quart|quint|sine}`. Trig uses degrees; easing is version-sensitive.

Diagnostics recognize the stable official QueryFunctions catalog; `q/query`, `v/variable`, `t/temp`, `c/context`, `global`; and structural features including `return`, `this`, `->`, loops, arrays, braces, `??`. Lint never evaluates gameplay truth. Unknown query → review; official internal/deprecated query → invalid authored custom-content candidate.

Controller `variables/input/remap_curve` remain file-backed; use bounded `resource_operations`, never `risky_eval`. `diagnostics=true` reports math/query/dependencies, syntax, native/controller state, motion dynamics, runtime wiring/dependency candidates.

## Evidence Economy

One `capture_model_views` with explicit animation/times; `views × times <= 8`. Author coherent cohort → representative capture → focused inspect only if decision-changing → one causal correction → recapture affected cohort. Verify `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`; record `IMPROVED | UNCHANGED | REGRESSED`. Cyclic/idle needs repeated full-loop playback.

## Completion

Internal `PASS` = `READY_FOR_USER_REVIEW`. User approval → checkpoint → Finalization.

Protected gap: bone-binding expressions beyond `relative_to.rotation=entity`. Source/CI does not prove live Blockbench/Minecraft playback.
