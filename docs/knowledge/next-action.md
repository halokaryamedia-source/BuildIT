# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T18_STATIC_HARDENING_COMPLETE
TEXTURING_CI_TERMINAL_PROOF_BLOCKED_BY_CURRENT_ENVIRONMENT
ANIMATION_SAMPLE_FORENSICS_COMPLETE
ANIMATION_MATH_RESEARCH_COMPLETE
ANIMATION_A0_NO_CHANGE_REQUIRED
ANIMATION_A1_A2_NATIVE_SEMANTICS_CONFIRMED
ANIMATION_A1_A2_PUBLIC_SCHEMA_DEFERRED_UNTIL_DOCS_TOOLCHAIN
ANIMATION_A3_A9_REASONING_POLICY_IMPLEMENTED
ANIMATION_A10_CONVERGENCE_POLICY_IMPLEMENTED
ANIMATION_A10_FINAL_STATIC_AUDIT_PENDING
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7 + R1–R5 + T0–T18 + Animation A0–A10**.

Actual desktop Painter behavior, UV persistence, animation playback/quality, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.
**Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof.**
**Experimental browser proof below does not upgrade desktop MCP claims.**

`Experimental/**` remains **PAUSED BY USER**. Local acceptance stays inactive until a fresh explicit user instruction reactivates it.

## Texture Continuation

Texture work is statically closed through T18: one base-color atlas, logical UV 128×128, 128-based bitmap, global UV audit, Box-UV lock, explicit texture identity, texel-density/material-detail reasoning, and difference-first convergence. Final static audit fixed CI routing and PBR-group ownership. No further texture redesign is justified without a concrete defect.

Terminal push-run proof remains inaccessible here (`gh` unavailable; connector lacks direct-push runs; container has no GitHub DNS). Do not mutate texture source merely to manufacture proof.

## Animation Evidence Baseline

Seven supplied professional `.bbmodel` samples were inspected. Direct motion evidence:

```text
Anky            8 animations / 6 controllers
Helicopter      3 animations / 1 controller
Ninja Master    3 animations / 2 controllers
Weapon/Katana  89 animations / 12 controllers
```

Helmet, Outdoor Table, and Skeleton Spinosaurus supplied files have no animation tracks.

Across 3,516 inspected keyframes, professional samples are overwhelmingly linear and obey their chosen snapping grid. No universal FPS, duration, amplitude, phase, keyframe count, or controller topology is inferred.

Generalizable findings:

```text
quality → pose hierarchy + timing + phase + weight + recovery
organic chain → driver → lagged followers; phase/amplitude may progress
locomotion → designed left/right phase; run != faster walk
idle → subtle baseline + occasional authored identity variation
action → anticipation → impact → follow-through → recovery → neutral
mechanical → sparse keys acceptable when rate/state/effects are correct
effects → synchronize to causal event, not automatically time zero
1P / 3P → same intent may require different motion
```

Continuous cyclic/response motion may use Molang; identity-critical action/contact should use deliberate authored poses. Controller owns state/context/composition.

## Math / Molang Baseline

Molang math is part of normal Bedrock animation, not a separate subsystem.

Useful causal drivers:

```text
q.anim_time                 → time-driven cycles
q.modified_distance_moved   → travel-linked phase
q.modified_move_speed       → movement intensity
controller blend value      → conditional/continuous layer weight
```

Trig uses degrees. Retain periodic motion, phase-shifted gait/chains, bounded remapping (`clamp + inverse_lerp + lerp`), smooth response, damped settling, and shortest-angle interpolation as reasoning forms, not presets.

Use math for continuous/cyclic/reactive motion; preserve Molang text without evaluating gameplay truth; do not invent queries, random-jitter bones, turn actions into sine waves, replace contact posing with generic cosine, or increase Bezier complexity without evidence.

## A0–A7 Source Audit Result

### A0 — no change required

`animation_timeline` already owns `once | loop | hold` and explicit FPS/snapping changes. Do not widen `create_animation` only for convenience without measured call-cost evidence.

### A1 — existing-animation effects

Official Blockbench confirms mutable `particle`, `sound`, and `timeline` channels with native Keyframe identity/edit/removal. Implementation is deferred because the MCP mutation schema requires canonical generated-doc regeneration, unavailable here. Never hand-edit generated API docs.

### A2 — controller-state effects

Official Blockbench confirms controller states own/export deep-copied particle/sound arrays, already retained by BlockIT's snapshot/Undo plan. Defer mutation for the same docs-toolchain reason. Extend `manage_animation_controller`; do not add a controller-effect tool family. Blend curves stay deferred.

### A3–A10 — reasoning hardening

Native Animation also owns `anim_time_update` and `blend_weight`; current BlockIT creation/inspection does not yet fully own that parity. Add authoring/inspection through existing animation surfaces when public-contract docs can be regenerated; do not add a separate math-animation tool.

`docs/foundation/08-animation-standard.md` is the durable policy owner. The active skill requires a **Motion Design Contract** covering archetype/intent, duration/snapping, driver/counter-motion/followers, phase/contact/attachment, keyframe-vs-Molang ownership, causal effects, and loop/neutral handoff. It also owns gait/chains, action weight phases, driver selection, and effect synchronization. These are constraints, not sample presets or a quality score.

## Proof / CI Boundary

This phase changes policy/skill plus regression routing/tests; it does not prove live playback. `mcp-verify.yml` watches the animation skill and Animation Standard because MCP tests consume them. Terminal direct-push Actions status remains inaccessible here, so no CI PASS/FAIL is inferred.

## Next Step

1. Verify the A3–A10 policy/regression patch through MCP Verify + Repository Verify when terminal push-run visibility is available.
2. In an environment with Bun and the canonical docs generator, implement **A1 existing-animation effect mutation** in the existing animation family and **A2 controller-state particle/sound mutation** in `manage_animation_controller`.
3. Regenerate API docs through the repository generator; never hand-edit generated entries.
4. Diagnose only exact failing owners if a gate fails.
5. After A1/A2 and animation-level math-property parity are implemented, perform the **A10 final static animation architecture audit** and close only concrete remaining gaps.
6. Keep blend-curve mutation, bone-binding expressions, and added Bezier complexity deferred unless new evidence changes priority.

**Local acceptance is not part of this next step.**

Experimental remains paused unless explicitly reopened.
