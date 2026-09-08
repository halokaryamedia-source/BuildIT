# BlockIT — Animation Standard

**Status:** Active Policy  
**Version:** 1.1  
**Updated:** 2026-09-09

## Purpose

Define professional Minecraft Bedrock Entity animation policy after participating hierarchy and pivots are suitable.

This policy governs **reasoning and authored state**, not proof of live playback. Tool success, static tests, controller structure, or valid Molang do not prove final motion quality in Minecraft.

## Core Principle

**Motion intent, causality, phase, and weight come before keyframe density or curve complexity.**

Use the smallest representation that preserves the intended result:

```text
explicit keyframes
→ deliberate pose/action/timing

Molang procedural expression
→ continuous, cyclic, reactive, or parameterized motion

AnimationController
→ state selection, conditions, composition, and blend ownership
```

Hybrid authoring is expected when responsibilities genuinely differ. Professional samples are learning evidence only; archetypes are categories, not presets. Do not impose one global FPS, duration, amplitude, phase, keyframe count, interpolation, or controller topology.

## Motion Design Contract

Before production animation, define only applicable facts:

```text
motion archetype / intent
duration + snapping intent
primary driver bone(s)
counter-motion / stabilizers
secondary followers / chains
phase relationships
contact / attachment invariants
explicit-key vs Molang ownership
external query/variable caller semantics
causal sound / particle event
loop seam or neutral / controller handoff
```

Reasoning archetypes may include:

```text
PROCEDURAL_LAYER
LOOP_ORGANIC
LOCOMOTION
ACTION
MECHANICAL
HOLD_POSE
IDLE_VARIANT
FIRST_PERSON_ACTION
THIRD_PERSON_ACTION
```

## Native Bedrock Clip Semantics

One clip may need more than transforms. Treat these as first-class authored semantics:

```text
length / snapping
loop: once | loop | hold
anim_time_update
blend_weight
start_delay
loop_delay
override_previous_animation
relative_to.rotation = entity
```

`start_delay` delays the first start; `loop_delay` delays subsequent loops. `override_previous_animation` resets affected bones to default pose before the clip contributes. `relative_to.rotation = entity` changes a bone rotation from parent-relative to entity-relative space and is useful for look/head behavior.

Batch related native properties through one `manage_animation_timeline(operation="properties")` call. Do not split a coherent property change into repeated calls.

## Timing / Snapping

Choose a snapping grid because it fits the motion, then keep authored numeric key times coherent with that grid.

A subtle idle, rapid attack, mechanical cycle, and first-person action may legitimately use different timing density.

Interpolation is a means, not a quality target. Prefer the simplest interpolation that preserves the intended motion. Do not add Bezier complexity merely to make an animation appear more sophisticated. Bedrock-native delivery uses linear/Catmull-Rom or pre/post discontinuity; editor-only Bezier curves must be baked when direct Bedrock transform output requires it.

## Procedural Math / Molang

Molang may own transform values, animation timing, blend behavior, controller conditions, and effect scripts where the runtime cause is mathematical or reactive. BlockIT preserves authored text; it must not evaluate the expression as gameplay truth or invent unknown query values. Authored poses keep identity-critical action/contact/silhouette ownership when procedural math is not the real motion cause.

Molang trigonometric functions use degrees. Aliases such as `q.`, `v.`, `t.`, and `c.` are equivalent to query/variable/temp/context namespaces.

The current official Bedrock math surface is accepted as authored Molang. Keep the static guidance compact rather than expanding every function into the prompt. Families include:

```text
abs / sign / min / max / clamp
floor / ceil / round / trunc / mod
sin / cos / asin / acos / atan / atan2
lerp / inverse_lerp / lerprotate / hermite_blend
pow / exp / ln / sqrt
random / random_integer / die_roll / die_roll_integer
math.pi
math.ease_{in|out|in_out}_{back|bounce|circ|cubic|elastic|expo|quad|quart|quint|sine}
```

Easing math is version-sensitive and must respect target Bedrock engine/format support. Unknown `math.*` names are diagnostics, not automatically rewritten or evaluated.

### Driver selection

Choose the variable that corresponds to the actual cause:

```text
q.anim_time
→ time-driven breathing, sway, vibration, or cycle

q.modified_distance_moved
→ travel-linked phase such as locomotion or wheel rotation

q.modified_move_speed
→ movement intensity / amplitude response

controller animation blend value
→ conditional or continuously weighted layer
```

A time driver is not automatically appropriate for locomotion. If phase should stop when travel stops, a travel-linked driver is the stronger semantic owner.

### Periodic reasoning

General form:

```text
value = base + amplitude * math.sin(360 * frequency * time + phase)
```

The author chooses base, amplitude, frequency, and phase from the asset and intent. This is not a fixed breathing/tail preset.

### Normalized response

When an input must map into a bounded response:

```text
p = clamp(inverse_lerp(input_min, input_max, input), 0, 1)
value = lerp(output_min, output_max, p)
```

Use for bounded speed response, charge, look response, or other continuous controls when runtime state supports it. `lerprotate` is preferred when angular interpolation must take the shortest circular path.

### Secondary chain / traveling phase

For tail, cloth, rope, beard, antenna, or similar chains:

```text
driver
→ follower 1
→ follower 2
→ follower 3
```

Reason about phase progression, lag, amplitude hierarchy, attachment continuity, and whether the chain is ambient/procedural or part of an authored action. Do not make every segment move identically.

### Damped settling

A bounded one-shot/state response may use:

```text
base + A * exp(-damping * time) * math.sin(360 * frequency * time + phase)
```

Potential uses include recoil settling, spring response, or post-impact vibration. It is an approximation, not a universal action generator.

## Locomotion

A gait is a designed relationship, not a mirrored transform.

Required reasoning when material:

```text
left/right phase
contact / support phase
stride amplitude
body compensation
head/tail/secondary response
speed-dependent change
```

Copy/mirror may initialize symmetric values, but it does not establish gait timing.

**Run is not merely walk played faster.** It may require different stride, amplitude, timing, body compensation, secondary response, or contact pattern.

Root-motion diagnostics are measurements, not gameplay-motion proof. Compare authored displacement, travel-linked phase, and intended entity speed before concluding that a gait is synchronized.

## Idle

A professional idle does not require constant large motion.

Prefer:

```text
low-amplitude living baseline
+
occasional identity gesture when appropriate
```

Use `start_delay`/`loop_delay` or intentional controller selection when appropriate rather than forcing identical repetition. Controlled variation should normally select authored clips/states instead of arbitrary per-frame transforms. Do not use continuous `math.random` as generic jitter.

## Action / Weight

When relevant:

```text
anticipation
→ acceleration / action
→ impact / contact
→ overshoot / follow-through
→ recovery
→ neutral or controller handoff
```

The attacking extremity is not always the only motion owner. If weight transfer is visible, use appropriate body counter-motion and support/stabilization.

Secondary motion normally follows the primary driver with deliberate lag rather than changing every participating bone at one timestamp.

Identity-critical attacks, smashes, interactions, and contact poses generally favor explicit authored key poses over generic procedural oscillation.

## Mechanical Motion

Mechanical quality can come from very few keyframes when the important facts are correct:

```text
pivot / axis
rate or travel relationship
start / steady / stop state
effect synchronization
```

Do not increase keyframe density solely because organic animations use more articulation.

## Effects

Every authored sound or particle should have a named causal event when one exists:

```text
release
contact
ignition
landing
start
stop
state entry
```

Place the event at the causal/visible phase. Timestamp zero is correct only when animation/state start is itself the event.

Effects are part of motion design, not decoration added after timing is finished.

## Controller Composition

Animation clips own motion and timeline-bound effects. Controllers own state/context and layer composition.

Prefer controlled composition:

```text
base authored motion
+ procedural look / response layer
+ secondary procedural layer
+ conditional action layer
```

only when layers have distinct semantic ownership. Controller randomness should normally select intentional authored alternatives rather than randomize arbitrary bone transforms every frame.

`blend_transition` and `blend_via_shortest_path` are supported. Controller blend-curve mutation remains protected until a bounded native mutation contract is implemented and verified.

## Perspective

First-person and third-person presentations may share action intent without sharing identical motion.

When both are required, evaluate framing, visible bones, weapon/readability path, camera proximity, clipping, and recovery silhouette. Reuse only motion that remains valid for both perspectives.

## Diagnostics / Quality Evidence

`inspect_animation(..., diagnostics=true)` is the bounded deep-inspection path. It should combine existing technical checks with:

```text
native clip property summary
used / unknown Molang math symbols
query / variable / temp / context dependencies
version-sensitive and nondeterministic math
loaded client-entity mapping / pre_animation evidence
numeric motion path / speed / acceleration / jerk
loop boundary velocity evidence
root-motion and loop-seam/cadence evidence
```

These are review candidates, not an animation quality score. Numeric motion dynamics use Blockbench units for position, degrees for rotation, and unitless scale. They cannot prove weight, contact quality, gameplay velocity, or visual appeal without visual/runtime evidence.

## Verification / Convergence

Review affected motion in this order:

```text
pose / readability
→ timing / phase
→ weight / contact
→ attachment / clipping
→ secondary motion
→ effect synchronization
→ loop seam / neutral return
```

A correction is:

```text
IMPROVED | UNCHANGED | REGRESSED
```

Only `IMPROVED` without supported regression is progress. If the same causal correction direction fails twice without new evidence, stop and mark the relevant claim `BLOCKED`.

For cyclic/idle motion, static snapshots are not enough; repeated full-loop playback is required to judge timing and phase. Source/static proof does not upgrade live Blockbench playback or Minecraft runtime behavior.

## Current Capability Boundary

Retained strengths include numeric/Molang transform keys, rig/pivots, timeline settings, batch/copy operations, authored Animation inspection, new-animation particle/sound effects, existing-animation particle/sound/timeline effect mutation, animation-level `anim_time_update` / `blend_weight`, bounded AnimationController state-machine/effects, native clip `start_delay` / `loop_delay` / `override_previous_animation`, hold mode, and native `relative_to.rotation=entity` authoring.

Protected gaps remain:
- controller blend-curve mutation;
- bone-binding expressions beyond native `relative_to.rotation=entity`;
- authoring client-entity `description.animations`, `scripts.animate`, and `scripts.pre_animation`;
- controller variable/remap-curve authoring where the current Blockbench native controller model does not expose a safe bounded mutation owner.

Do not route protected gaps through `risky_eval`, generic UI actions, or direct JSON surgery as a normal authoring workflow.
