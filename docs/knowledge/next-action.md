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
ANIMATION_D4_TIMELINE_BATCH_OWNERSHIP_PENDING
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

Texture is statically closed through T18. Reopen only for a concrete defect; do not mutate it merely to manufacture CI evidence.

## Animation Baseline

Professional evidence: Anky 8/6, Helicopter 3/1, Ninja Master 3/2, Weapon/Katana shared library 89/12 (animations/controllers); 3,516 inspected keyframes are overwhelmingly linear and grid-aligned. Samples are evidence, not presets.

```text
quality → pose hierarchy + timing + phase + weight + recovery
chain → driver → lagged followers
locomotion → contact/phase; run != faster walk
idle → subtle baseline + controlled authored variation
action → anticipation → impact → follow-through → recovery → neutral
mechanical → sparse keys valid when rate/state/effects are correct
effects → causal event, not automatic time zero
1P/3P → same intent may require different motion
```

Molang may own continuous/cyclic/reactive motion; identity-critical action/contact stays authored. `docs/foundation/08-animation-standard.md` owns policy. Preserve Molang text; never evaluate gameplay truth.

## Development Completed

### D1.1 — effect observability

`7a3fcc2522911c0a578ace871a9b6b0532e1ab9c`

`inspect_animation(include_effect_keyframes=true)` now returns particle/sound/timeline keyframe UUID + time. Particle/sound data points expose `data_point_index`; timeline also exposes its stored script. No synthetic data-point UUID exists. Future mutation identity is **keyframe UUID + data_point_index** for particle/sound and keyframe UUID for timeline. Blockbench export normalization owns effective script comparison.

### D3.1 — math-property observability

`fbc1be9380ce81df71207858f55bdf41bc335f36`

Authored Animation summary returns `anim_time_update` and `blend_weight` as string or `null`, without Molang evaluation.

### D4 — authored Animation identity

`90284633cfb8a3177f26c29536283756a5ef3f72`

`resolveCoreAnimation()` filters AnimationControllers before UUID/name resolution and rejects selected-controller fallback. Shared users (`manage_keyframes`, graph editor, copy/paste) now fail closed.

Residual:

```text
animation_timeline
→ resolve selected authored Animation first

batch_keyframe_operations
→ resolve authored Animation before reading Timeline collections
→ all/selected/range/pattern candidates require keyframe.animator.animation === target
→ use target for snap/setLength/Undo; never raw AnimationItem.selected
```

Filtering selected item alone is insufficient because `Timeline.keyframes` / `Timeline.selected` are global UI collections and may retain non-target state.

## D1 Mutation Contract — LOCKED

Existing Animation family; no generic effect family or transform-keyframe overload.

```text
channel   = particle | sound | timeline
operation = add | update | remove
ordered bounded operations
one authored Animation target + one Undo transaction
```

Rules:
- particle/sound update-remove → keyframe UUID + data_point_index; timeline → keyframe UUID;
- snap add/move time with target snapping;
- particle/sound add at same-channel time appends a data point; timeline duplicate time rejects;
- preflight UUID/index/time collision before Undo;
- moving onto another occupied same-channel keyframe rejects rather than silently merging identity;
- removing final particle/sound point removes keyframe; timeline remove removes keyframe;
- particle owns effect/locator/bind/pre-script; sound owns effect/locator; timeline owns script;
- explicit clear semantics for optional fields; effect cannot become blank;
- reject effective no-op; never evaluate Molang/script;
- return bounded continuation state, not forced reread.

## Public Schema Boundary

D1 mutation, D2 state effects, and D3 property mutation change public schemas and therefore require canonical:

```text
bun run docs:build
bun run docs:check
```

This environment has no Bun 1.3.14 or usable release-download path. **Do not commit public schema changes without generated docs; never hand-edit generated API files.** This is a tooling boundary, not a design failure.

## Next Step

1. Finish D4 source-only hardening in `animation.ts`: authored resolver for timeline/batch, target-owned keyframe filtering, and compact continuation state for persistent timeline edits only if it removes a real reread.
2. With Bun + canonical docs generation, implement locked **D1 existing-animation effect mutation** plus generated docs in one logical delivery.
3. Implement **D2 controller-state particle/sound mutation** by extending `manage_animation_controller`; no new effect family.
4. Implement D3 mutation parity for `anim_time_update` / `blend_weight` through the smallest existing animation-property owner; never create `math_animation`.
5. Run create → inspect → modify symmetry audit, then final static animation architecture audit; fix only concrete residuals.
6. Keep blend curves, bone-binding, generic generators, quality scores, and added Bezier complexity deferred without new evidence.

**Local acceptance is not part of this next step.**

Experimental remains paused unless explicitly reopened.
