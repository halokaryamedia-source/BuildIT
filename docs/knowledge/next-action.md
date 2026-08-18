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
ANIMATION_A3_A10_REASONING_POLICY_IMPLEMENTED
ANIMATION_D1_EFFECT_OBSERVABILITY_IMPLEMENTED
ANIMATION_D1_MUTATION_SCHEMA_PENDING_DOCS_TOOLCHAIN
ANIMATION_D2_CONTROLLER_EFFECT_MUTATION_PENDING_DOCS_TOOLCHAIN
ANIMATION_D3_MATH_PROPERTY_OBSERVABILITY_IMPLEMENTED
ANIMATION_D3_PROPERTY_MUTATION_PENDING_DOCS_TOOLCHAIN
ANIMATION_D4_AUTHORED_CONTROLLER_IDENTITY_FIXED
ANIMATION_FINAL_STATIC_AUDIT_PENDING
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7 + R1–R5 + T0–T18 + Animation A0–A10 + D1–D4**.

Actual desktop Painter behavior, UV persistence, animation playback/quality, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.
**Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof.**
**Experimental browser proof below does not upgrade desktop MCP claims.**

The user does not plan local testing in the near term. `Experimental/**` remains **PAUSED BY USER**.

## Texture Boundary

Texture is statically closed through T18. Do not reopen without a concrete defect or mutate it merely to manufacture CI evidence.

## Animation Evidence Baseline

Professional sample evidence: Anky 8/6, Helicopter 3/1, Ninja Master 3/2, Weapon/Katana shared library 89/12 (animations/controllers). Across 3,516 keyframes, motion is overwhelmingly linear and grid-aligned. Samples are evidence, not presets.

Retain:

```text
quality → pose hierarchy + timing + phase + weight + recovery
chain → driver → lagged followers; phase/amplitude may progress
locomotion → designed contact/phase; run != faster walk
idle → subtle baseline + controlled authored variation
action → anticipation → impact → follow-through → recovery → neutral
mechanical → sparse keys valid when rate/state/effects are correct
effects → causal event, not automatic time zero
1P / 3P → same intent may require different motion
```

Molang may own continuous/cyclic/reactive motion; identity-critical action/contact stays authored. `docs/foundation/08-animation-standard.md` owns policy. Preserve Molang text; never evaluate gameplay truth.

## Development Completed This Pass

### D1.1 — effect observability

Commit `7a3fcc2522911c0a578ace871a9b6b0532e1ab9c`.

`inspect_animation(include_effect_keyframes=true)` now exposes:

```text
particle → keyframe UUID + time + data_point_index + effect/locator/bind/script
sound    → keyframe UUID + time + data_point_index + effect/locator
timeline → keyframe UUID + time + data_point_index + stored script
```

No synthetic data-point UUID exists. Particle/sound mutation identity is **keyframe UUID + data_point_index**. Blockbench normalizes effect scripts on Bedrock export; future no-op comparison uses effective export semantics.

### D3.1 — math-property observability

Commit `fbc1be9380ce81df71207858f55bdf41bc335f36`.

Authored Animation summary now returns `anim_time_update` and `blend_weight` as authored string or `null`, without Molang evaluation.

### D4 — authored Animation identity separation

Commit `90284633cfb8a3177f26c29536283756a5ef3f72`.

`resolveCoreAnimation()` now filters AnimationControllers before UUID/name resolution and rejects selected-controller fallback. This fixes shared identity for `manage_keyframes`, graph editor, and copy/paste callers.

Residual: `animation_timeline` and `batch_keyframe_operations` still read `AnimationItem.selected` directly; switch them to authored-Animation resolution before closing D4.

## D1 Mutation Contract — LOCKED

Do not redesign without new native evidence. Use one compact capability inside the existing Animation family; do not overload transform `manage_keyframes` into an incoherent effect contract.

```text
channel   = particle | sound | timeline
operation = add | update | remove
ordered bounded operations
one authored Animation target
one Undo transaction
```

Identity:

```text
particle/sound update-remove → keyframe UUID + data_point_index
timeline update-remove       → keyframe UUID
```

Semantics:
- snap add/move time using target Animation snapping;
- particle/sound add at an occupied same-channel time appends a data point;
- timeline add at occupied time rejects;
- update resolves UUID/index and validates before Undo;
- move onto another occupied same-channel keyframe rejects instead of silently merging identities;
- removing final particle/sound data point removes its keyframe;
- particle owns effect/locator/bind_to_actor/pre_effect_script;
- sound owns effect/locator; timeline owns script;
- optional fields need explicit clear semantics; effect cannot become blank;
- reject effective no-op updates before Undo;
- never evaluate Molang/timeline script;
- return bounded continuation state, not a forced reread.

## Public-Schema / Docs Boundary

D1 mutation, D2 controller-state effects, and D3 property mutation require public schema changes. Repository policy requires canonical generation:

```text
bun run docs:build
bun run docs:check
```

Current environment has no Bun 1.3.14 or usable download path; GitHub connector cannot retrieve the Bun release asset. **Do not commit public schema changes without generated docs and never hand-edit generated API files.** This is a tooling boundary, not a design failure.

## Next Step

1. Finish D4 source-only hardening: route `animation_timeline` and `batch_keyframe_operations` through authored-Animation resolution; inspect continuation-state gaps.
2. With Bun + canonical docs generation available, implement locked **D1 existing-animation effect mutation** and generated docs as one logical delivery.
3. Implement **D2 controller-state particle/sound mutation** by extending `manage_animation_controller`; no separate controller-effect family.
4. Implement D3 mutation parity for `anim_time_update` / `blend_weight` through the smallest existing animation-property owner; never create `math_animation`.
5. Run create → inspect → modify symmetry audit, then final static animation architecture audit. Fix only concrete residuals.
6. Keep blend curves, bone-binding, generic generators, quality scores, and added Bezier complexity deferred without new evidence.

**Local acceptance is not part of this next step.**

Experimental remains paused unless explicitly reopened.
