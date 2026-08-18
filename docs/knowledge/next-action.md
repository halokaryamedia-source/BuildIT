# Next Action

Updated: 2026-08-18

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
TEXTURING_T0_T18_STATIC_HARDENING_COMPLETE
TEXTURING_CI_TERMINAL_PROOF_BLOCKED_BY_CURRENT_ENVIRONMENT
ANIMATION_SAMPLE_FORENSICS_COMPLETE
ANIMATION_MATH_RESEARCH_COMPLETE
ANIMATION_A3_A10_REASONING_POLICY_IMPLEMENTED
ANIMATION_D1_EFFECT_OBSERVABILITY_IMPLEMENTED
ANIMATION_D1_MUTATION_SCHEMA_PENDING_DOCS_TOOLCHAIN
ANIMATION_D2_CONTROLLER_EFFECT_MUTATION_PENDING_DOCS_TOOLCHAIN
ANIMATION_D3_MATH_PROPERTY_OBSERVABILITY_IMPLEMENTED
ANIMATION_D3_PROPERTY_MUTATION_PENDING_DOCS_TOOLCHAIN
ANIMATION_D4_SHARED_IDENTITY_FIXED
ANIMATION_D4_TIMELINE_BATCH_OWNERSHIP_PENDING
ANIMATION_D5_EFFECT_SUMMARY_COUNT_DEFECT_IDENTIFIED
ANIMATION_FINAL_STATIC_AUDIT_PENDING
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. Live desktop playback/quality and runtime efficiency remain **LOCAL PROOF REQUIRED**; local acceptance is not a current next step.

## Closed / Retained Owners

Texture is statically closed through T18; reopen only for a concrete defect.

Professional animation evidence and Molang/math reasoning are retained in `docs/foundation/08-animation-standard.md`. Key rule: quality comes from pose/timing/phase/weight/recovery; continuous cyclic/reactive motion may use Molang; identity-critical action/contact stays authored. Samples are evidence, not presets.

## Development Completed

### D1.1 — effect observability

`7a3fcc2522911c0a578ace871a9b6b0532e1ab9c`

`inspect_animation(include_effect_keyframes=true)` exposes particle/sound/timeline keyframe UUID + time. Particle/sound data points expose `data_point_index`; timeline exposes stored script. No synthetic data-point UUID exists.

### D3.1 — math-property observability

`fbc1be9380ce81df71207858f55bdf41bc335f36`

Authored Animation summary returns `anim_time_update` and `blend_weight` as string or `null`, without Molang evaluation.

### D4 — shared authored Animation identity

`90284633cfb8a3177f26c29536283756a5ef3f72`

`resolveCoreAnimation()` filters AnimationControllers before UUID/name resolution and rejects selected-controller fallback. `manage_keyframes`, graph editor, and copy/paste inherit this fail-closed owner.

## D4 Remaining Patch — LOCKED

`mcp/server/tools/animation.ts` still bypasses the shared owner in timeline/batch:

```text
animation_timeline
→ resolve selected authored Animation before action
→ controller selection fails closed
→ select_range touches only target-owned keyframes

batch_keyframe_operations
→ resolve authored Animation before Timeline collections
→ all/selected/range/pattern require
   keyframe.animator.animation === target
→ use target consistently for snap/setLength/bake/scale/offset ownership
```

`Timeline.keyframes` and `Timeline.selected` are global UI collections; selected-item validation alone is insufficient.

Current environment cannot safely write this owner: connector supports full-file replacement only, `animation.ts` is ~89 KB, no repo checkout is mounted, and container GitHub DNS is unavailable. **Do not manually reserialize the file or move the guard to a wrong central owner.** Apply this exact patch from a patch-capable checkout/action and add bounded ownership regression tests.

## D5 Inspector Count Defect

`animation-inspection.ts` summary currently counts data points rather than effective Bedrock exports:

```text
particle_count → includes blank-effect points
sound_count    → includes blank-effect points
timeline.script_count → counts data points, not effective exported script lines
```

Native compilation filters blanks and splits timeline scripts into effective lines. Keep full data-point observability, but make these summary counts reflect export semantics. Do not rename fields or add scores.

## D1 Mutation Contract — LOCKED

Use the existing Animation family:

```text
channel   = particle | sound | timeline
operation = add | update | remove
one authored Animation + ordered bounded operations + one Undo
```

Identity and mutation rules:
- particle/sound update-remove → keyframe UUID + `data_point_index`; timeline → keyframe UUID;
- snap add/move time with target snapping;
- particle/sound same-time add appends point; timeline duplicate time rejects;
- preflight UUID/index/time collisions and effective no-op before Undo;
- move onto occupied same-channel keyframe rejects rather than silently merging identity;
- removing final particle/sound point removes keyframe;
- particle owns effect/locator/bind/pre-script; sound owns effect/locator; timeline owns script;
- optional fields need explicit clear semantics; effect cannot become blank;
- never evaluate Molang/script; return bounded continuation state.

## Public Schema Boundary

D1 mutation, D2 state effects, and D3 property mutation change public schemas and require canonical:

```text
bun run docs:build
bun run docs:check
```

This environment has no Bun 1.3.14 or usable release-download path. **Never commit those schema changes without generated docs or hand-edit generated API files.**

## Next Step

1. Patch-capable checkout/action: close D4 timeline/batch target ownership + regressions.
2. Fix D5 effective effect-summary counts.
3. With Bun/docs generation: implement locked D1 existing-animation effects, then D2 controller-state effects, then D3 `anim_time_update`/`blend_weight` mutation through existing owners.
4. Run create → inspect → modify symmetry audit and final static animation audit; fix concrete residuals only.
5. Keep blend curves, bone-binding, generic generators, quality scores, and added Bezier complexity deferred without new evidence.

**Local acceptance is not part of this next step.**
