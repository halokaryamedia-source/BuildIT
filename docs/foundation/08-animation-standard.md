# BlockIT — Animation Standard

**Status:** Active Policy  
**Version:** 1.0  
**Updated:** 2026-08-18

## Purpose

Define professional Minecraft Bedrock Entity animation policy after the participating hierarchy and pivots are suitable.

This policy governs **reasoning and authored state**, not proof of live playback. Tool success, static tests, or controller structure do not prove final motion quality.

## Core Principle

**Motion intent, causality, phase, and weight come before keyframe density or curve complexity.**

Use the smallest animation representation that preserves the intended result:

```text
explicit keyframes
→ deliberate pose/action/timing

Molang procedural expression
→ continuous, cyclic, reactive, or parameterized motion

AnimationController
→ state selection, conditions, composition, and blend ownership
```

Hybrid authoring is expected when those responsibilities genuinely differ.

Professional samples are learning evidence only. They do not define universal FPS, duration, amplitude, phase, keyframe count, interpolation, or controller topology.

## Motion Design Contract

Before production animation, define only the applicable facts:

```text
motion archetype / intent
duration + snapping intent
primary driver bone(s)
counter-motion / stabilizers
secondary followers / chains
phase relationships
contact / attachment invariants
explicit-key vs Molang ownership
causal sound / particle events
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

These are analysis categories, not preset generators.

## Timing / Snapping

Choose a snapping grid because it fits the motion, then keep authored numeric key times coherent with that grid.

Do not impose one global FPS. A subtle idle, rapid attack, mechanical cycle, and first-person action may legitimately use different timing density.

Interpolation is a means, not a quality target. Prefer the simplest interpolation that preserves the intended motion. Do not add Bezier complexity merely to make an animation appear more sophisticated.

## Procedural Math / Molang

Molang expressions may own transform values, animation timing, and blend behavior where the runtime cause is mathematical or reactive. BlockIT preserves authored Molang text; it must not evaluate the expression as gameplay truth or invent unknown query values.

Molang trigonometric functions use degrees.

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

A time driver is not automatically appropriate for locomotion. If phase should stop when actual travel stops, a travel-linked driver is the stronger semantic owner.

### Periodic reasoning

General form:

```text
value = base + amplitude * math.sin(360 * frequency * time + phase)
```

The author chooses base, amplitude, frequency, and phase from the asset and intent. This is not a fixed breathing/tail preset.

### Normalized response

When an input must map into a bounded animation response:

```text
p = clamp(inverse_lerp(input_min, input_max, input), 0, 1)
value = lerp(output_min, output_max, p)
```

Use this concept for bounded speed response, charge, look response, or other continuous controls when supported by the intended runtime state.

### Smooth response

A normalized parameter may be reshaped with an appropriate mathematical blend such as Hermite before interpolation. This is useful for response curves; it must not replace deliberate identity-critical poses.

### Secondary chain / traveling phase

For tail, cloth, rope, beard, antenna, or similar chains:

```text
driver
→ follower 1
→ follower 2
→ follower 3
```

Reason about:
- phase progression;
- lag relative to the driver;
- amplitude hierarchy;
- attachment continuity;
- whether the chain is ambient/procedural or part of an authored action.

For a continuous wave, each segment may use a related expression with a different phase/amplitude. Do not make every segment move identically.

### Damped settling

A bounded one-shot/state response may use a decaying oscillation concept:

```text
base + A * exp(-damping * time) * sin(360 * frequency * time + phase)
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

## Idle

A professional idle does not require constant large motion.

Prefer:

```text
low-amplitude living baseline
+
occasional identity gesture when appropriate
```

Controlled variation should normally select authored clips/states rather than inject arbitrary per-frame random transforms. Do not use continuous `math.random` as generic jitter.

## Action / Weight

When relevant, structure the action explicitly:

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

Identity-critical attacks, smashes, interactions, and contact poses generally favor explicit authored key poses over a generic sine response.

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

only when those layers have distinct semantic ownership.

Controller randomness should normally select among intentional authored alternatives rather than randomize arbitrary bone transforms every frame.

## Perspective

First-person and third-person presentations may share action intent without sharing identical motion.

When both are required, evaluate:
- framing;
- visible bones;
- weapon/readability path;
- camera proximity;
- clipping;
- recovery silhouette.

Reuse only motion that remains valid for both perspectives.

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

Only `IMPROVED` without a supported regression is progress. If the same causal correction direction fails twice without new evidence, stop and mark the relevant claim `BLOCKED`.

Do not create an animation quality score.

## Current Capability Boundary

Retained current strengths include numeric/Molang transform keys, rig/pivots, timeline settings, batch/copy operations, authored Animation inspection, new-animation particle/sound effects, and bounded AnimationController state-machine mutation.

Protected gaps remain:
- existing-animation direct effect mutation;
- controller-state particle/sound mutation;
- controller blend-curve mutation;
- bone-binding expressions.

Do not route protected gaps through `risky_eval`, generic UI actions, or direct JSON surgery as a normal modelling workflow.

Current source/static proof does not upgrade live Blockbench playback, Minecraft controller execution, persistence, or visual quality.
