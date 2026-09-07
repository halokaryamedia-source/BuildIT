---
name: blockit-bedrock-animation
description: Minecraft Bedrock Entity animation specialist for authored motion, Molang, controllers, effects, timeline, and bounded correction.
---

# BlockIT Bedrock Animation

Use when `ACTIVE PHASE: ANIMATION`, `Animation Required = YES`, Texturing approved, and participating hierarchy/pivots are suitable.

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
→ continue same task with Geometry specialist
```

Do not search for `bone_rigging` while Animation is active. `create_project` is not an Animation capability; missing project/lifecycle state returns upstream through Gateway rather than rebuilding a project inside Animation.
Before production keys, representative extreme poses must preserve required attachment/contact and clearance. If they cannot, handoff Geometry first.

## Direct Routing
```text
new animation                         → create_animation
unknown animation/controller          → inspect_animation
all timeline/keyframe work            → manage_animation_timeline (operation: keyframes|graph|timeline|batch|copy_paste)
existing animation effects            → manage_animation_effects
controller state/composition/effects  → manage_animation_controller
new-animation particle/sound          → create_animation
pose/time visual evidence             → capture_model_views(animation_preview)
focused correction evidence           → inspect_animation(bone + optional channel/time_range)
```
`new known clip → create_animation → reuse returned UUID/state; timeline if needed`
`existing/unknown detail → inspect_animation`

Known capability → invoke via Gateway. Unknown/stale → `search_capabilities`; schema → `describe_capability` once. When the consolidated timeline branch is already known, request its projected schema with `branch: {field:"operation", value:"keyframes|graph|timeline|batch|copy_paste"}` rather than loading unrelated branches. **Reuse fresh UUID/state; known identity must not fall back to broad hierarchy discovery or confirmation reads.**

Use `manage_animation_timeline`; `batch` owns coherent cohort work, not loops per key. For the batch branch, `operation="batch"` selects the public branch and `batch_operation="offset|scale|reverse|mirror|smooth|bake"` selects the actual cohort mutation. Prefer explicit `animation_id` when the target clip is already known. Controller/effect/graph/copy-paste are conditional.

## Motion Design Contract
Before production keys define:
```text
archetype + intent + duration/snapping intent
primary driver bone(s) + counter-motion/stabilizers
followers / secondary chains
phase + contact / attachment invariants
authored-key vs Molang ownership
external query/variable caller semantics + units/default/reset/direction
causal event for sound/particle
loop seam or neutral/controller handoff
```

Archetypes are categories, **not presets**. No universal FPS, duration, amplitude, phase, keyframe count, or Bezier target. Do not reduce acceptance to an **animation quality score**.

## Procedural Math / Molang
Use Molang for continuous, cyclic, reactive, parameterized motion; explicit authored poses own identity-critical action, impact, contact, silhouette, and acting. Preserve authored Molang text; do not invent unknown query/state values or signed reverse semantics from a distance-like query name.

```text
q.anim_time               → time-driven cycle/response
q.modified_distance_moved → travel-linked phase
q.modified_move_speed     → speed/intensity response
controller blend value    → conditional layer weight
```
Chains use **driver → delayed followers**, deliberate phase/amplitude hierarchy, and attachment continuity.

## Evidence Economy
Do not mutate timeline time repeatedly just to take screenshots. For bounded pose review use one `capture_model_views` call with `animation_preview.animation_id` and explicit sample `times`; keep `views × times <= 8`. The Runtime temporarily poses the clip, captures deterministic views, and restores persistent timeline/selection state.

For a known local defect, inspect only what can explain it:
```text
inspect_animation(
  animation_id,
  bone,
  channel?,
  time_range?,
  diagnostics?
)
```
Use `diagnostics=true` only when technical review candidates matter. Diagnostics may report out-of-length keys/effects, dangling bone animators, and loop-endpoint mismatch candidates; they are not visual scores and cannot create PASS/FAIL.

Prefer:
```text
AUTHOR coherent keys/batch
→ capture representative times once
→ if mismatch: focused inspect affected bone/channel/range
→ one causal correction
→ recapture only affected time/view cohort
```
over per-key inspection, per-time `set_time`, or broad repeated animation dumps.

## Action / Effects / Verification
When material: `anticipation → acceleration/action → impact/contact → overshoot/follow-through → recovery → neutral/handoff`.

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`
Review pose/timing/weight/contact → attachment/clipping → secondary motion/effects → loop seam/neutral return.
Cyclic/idle verification requires repeated full-loop playback; bounded static pose samples locate pose/contact defects but do not by themselves prove timing, phase, contact, or seam.

Correction verdict: `IMPROVED | UNCHANGED | REGRESSED`; tool success is not motion quality. Same causal correction direction failing twice without new evidence → `BLOCKED`.

## Completion / Handoff
Internal Animation `PASS` means `READY_FOR_USER_REVIEW`; user inspects live Blockbench. Explicit approve → checkpoint save → Finalization.
Material rig/pivot/hierarchy blocker → Geometry through Gateway; repair owning structure; re-approve only affected stages.

## Protected Gaps
Controller blend-curve mutation and bone-binding expressions remain protected; do not route through `risky_eval` or generic UI actions. Authored controller state is not proof of Minecraft execution.
