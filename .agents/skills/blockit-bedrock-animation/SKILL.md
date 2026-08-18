---
name: blockit-bedrock-animation
description: Bedrock Entity animation specialist for motion, Molang, controllers, effects, rig, and timeline.
---

# BlockIT Bedrock Animation

Own animation after participating Group/Bone hierarchy and pivots are suitable. Production animation waits for them. Motion intent and causality outrank density or curve complexity.

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

Reuse known state. `get_project_info` only when project state is unknown/stale; `list_outline` only when identity/hierarchy is unresolved. Load the exact tool name only. Known participating identity/state must not fall back to broad discovery.

Existing-asset geometry may be a baseline; it does not certify reference accuracy. Diagnostic pose/playback is temporary: after geometry/hierarchy/pivot change, mark only affected bones stale.

## Motion Design Contract

Before production keys define only what matters:

```text
archetype + intent
duration / snapping intent
primary driver bone(s)
counter-motion / stabilizers
followers / secondary chains
phase + contact / attachment invariants
authored-key vs Molang ownership
causal sound/particle event(s)
loop seam or neutral/handoff requirement
```

Archetypes are categories, **not presets**: `PROCEDURAL_LAYER | LOOP_ORGANIC | LOCOMOTION | ACTION | MECHANICAL | HOLD_POSE | IDLE_VARIANT | FIRST_PERSON_ACTION | THIRD_PERSON_ACTION`.

No universal FPS, duration, amplitude, phase, or keyframe-count target. No Bezier target or Bezier-complexity target. Prefer the simplest interpolation that preserves intended motion; do not guess-bake motion merely to add keys.

## Procedural Math / Molang

Use Molang for continuous, cyclic, reactive, or parameterized motion; use authored poses for identity-critical action/contact/silhouette. `manage_keyframes` preserves authored Molang text; never evaluate it as gameplay truth or invent unknown query/state values.

Choose the driver by cause:

```text
q.anim_time                 → time-driven cycle/response
q.modified_distance_moved   → travel-linked phase
q.modified_move_speed       → speed/intensity response
controller blend value      → conditional/continuous layer weight
```

For periodic motion track `base + amplitude + frequency + phase`; trig uses degrees. For a chain define `driver → delayed followers`, phase progression, amplitude hierarchy, and attachment continuity. Mirror/copy is not a gait generator; contact phases remain authored, and run is not merely faster walk.

## Action / Weight / Effects

When material:

```text
anticipation
→ acceleration / action
→ impact or contact
→ overshoot / follow-through
→ recovery
→ neutral or controller handoff
```

Use counter-motion/stabilization when intended weight requires it. Secondary parts normally lag their driver. Bind each particle/sound to a named **causal event** such as release, contact, ignition, landing, start, or stop; time zero is correct only when start is the cause.

## Authoring / Verification

Use `DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`. Review pose → timing/phase → weight/contact → attachment/clipping → secondary motion → effects → loop seam.

Correction verdict is `IMPROVED | UNCHANGED | REGRESSED`; tool success is not motion quality. Same causal correction direction failing twice without new evidence → `BLOCKED`. Do not use an animation quality score.

## Protected Gaps

Controller blend-curve mutation and bone-binding expressions remain protected. Do not route protected gaps through `risky_eval` or generic UI actions. Controller authored-state inspection/mutation is not proof of controller execution in Minecraft; live playback/visual quality needs direct runtime evidence when explicitly activated.
