---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist.
---

# BlockIT Bedrock Animation

Use at `ACTIVE PHASE: ANIMATION` after Texturing approval + checkpoint + Animation Readiness Preflight when participating hierarchy/pivots are suitable.

## Boundary

Animation owns motion, not structural rig mutation. Blocker → `HANDOFF_REQUIRED`, `target_phase: geometry` + readiness → `switch_authoring_phase` → resume same task through Gateway; if motion structure is unsuitable, handoff Geometry first. Before keys, representative extreme poses preserve contact/clearance. Do not search for `bone_rigging`.

## Artist-Facing Controller Boundary
Animation Controller is in scope as an **artist-facing composition and preview mechanism**: combine authored clips, test transition/blend continuity, coordinate controller-local effects, and inspect how an animation set behaves as one character/object performance.

Do not turn model authoring into addon gameplay development. Behavior Pack/server controllers, components/events/AI/combat state, Script API, pack manifests, `client_entity` construction, and property-driven gameplay integration are out of scope. A transition that depends on an external gameplay state remains an integration contract; do not invent that caller state merely to make the preview self-contained.

For normal model creation, use in-Blockbench controller `operations` / `native_operations`. File-backed `resource_operations` remain compatibility/inspection infrastructure and are **not a normal asset-authoring route**.

## Direct Routing

```text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
all timeline/keyframe work            → manage_animation_timeline (operation: keyframes|graph|timeline|batch|copy_paste)
clip/native property cohort           → manage_animation_timeline (operation: properties)
existing animation effects            → manage_animation_effects
controller state/composition/effects  → manage_animation_controller
nested controller/blend curve         → same tool (native_operations)
pose/time visual evidence              → capture_model_views(animation_preview)
```

`new known clip → create_animation → reuse returned UUID/state; timeline if needed`
`existing/unknown detail → inspect_animation`

Known → Gateway; unknown/stale → `search_capabilities`; schema → `describe_capability` once. Reuse fresh UUID/state; known identity must not fall back to broad hierarchy discovery or confirmation reads.

`batch` uses operation="batch" + batch_operation= for one coherent cohort, not loops per key. `properties` owns clip state; `native_operations` nested controllers/curves. Controller/effect/graph/copy-paste are conditional. `resource_operations` are excluded from the normal model-authoring hot path.

## Motion Design Contract

Before keys define:
```text
archetype + intent + duration/snapping
primary driver + counter-motion + followers
phase + contact/attachment invariants
authored-key vs Molang ownership
caller/query semantics that are intrinsic to visual motion
causal event for sound/particle
loop seam or neutral/controller handoff
```

Archetypes are not presets. No universal FPS, duration, amplitude, phase, keyframe count, or Bezier target. Do not use an animation quality score.

Use Molang for continuous/cyclic/reactive **visual motion**; authored poses own identity-critical action/contact/silhouette. `q.anim_time` is time-driven; `q.modified_distance_moved` can own travel phase. Never invent external gameplay property values or signed reverse semantics. Chains use `driver → delayed followers`. Actions preserve `anticipation → action/impact → follow-through → recovery`.

### Molang / math

No separate math tool. Author Molang through existing transforms/properties/controller/effect fields. Accept official trig, clamp/rounding, interpolation, exponential/power, random/die-roll, `math.pi`, and `math.ease_{in|out|in_out}_{back|bounce|circ|cubic|elastic|expo|quad|quart|quint|sine}`. Easing math is version-sensitive; trig uses degrees.

In-memory controller variables/remap may support artist preview when their meaning is intrinsic to the animation composition. File-backed client `initialize`, public variables, `pre_animation`, scale, and external property wiring are not part of normal model creation. Diagnostics may inspect them for compatibility without expanding scope. Never `risky_eval` or evaluate gameplay truth.

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

## Completion

Internal `PASS` = `READY_FOR_USER_REVIEW`. User approval → checkpoint → Finalization.

Protected gap: bone-binding expressions beyond `relative_to.rotation=entity`. Source/CI does not prove live Blockbench/Minecraft playback.
