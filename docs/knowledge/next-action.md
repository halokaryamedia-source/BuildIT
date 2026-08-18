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
ANIMATION_D1_MUTATION_CANDIDATE_PREPARED_UNREFERENCED
ANIMATION_D2_CONTROLLER_EFFECT_CANDIDATE_PREPARED_UNREFERENCED
ANIMATION_D3_MATH_PROPERTY_OBSERVABILITY_IMPLEMENTED
ANIMATION_D3_PROPERTY_MUTATION_CANDIDATE_PREPARED_UNREFERENCED
ANIMATION_D4_TIMELINE_BATCH_OWNERSHIP_FIXED
ANIMATION_D5_EFFECT_SUMMARY_COUNTS_FIXED
ANIMATION_FINAL_STATIC_AUDIT_PENDING
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. Live desktop animation playback/quality and runtime efficiency remain local-proof-only claims.

## Retained Boundaries

Texture is statically closed through T18; reopen only for a concrete defect. Professional animation evidence + Molang/math reasoning live in `docs/foundation/08-animation-standard.md`; samples are evidence, not presets.

GitHub execution/tool-fit/atomicity/large-file discipline is owned **only** by `GITHUB_RULES.md`. Do not duplicate those operational rules here; this file records continuation state and exact development candidates only.

### Completed source hardening

- D1.1 effect observability — `7a3fcc2522911c0a578ace871a9b6b0532e1ab9c`
  - `inspect_animation` exposes particle/sound/timeline keyframe UUID + time.
  - particle/sound datapoints expose `data_point_index`; no synthetic datapoint UUID.
- D3.1 math-property observability — `fbc1be9380ce81df71207858f55bdf41bc335f36`
  - authored `anim_time_update` / `blend_weight` returned as text/null; never evaluated.
- D4 shared Animation identity — `90284633cfb8a3177f26c29536283756a5ef3f72`
  - controllers cannot resolve as authored Animation.
- D4 timeline/batch ownership — `ec64de58da23b1426527b9d2d7101c5286e015be`
  - timeline resolves authored Animation first; select/batch candidates are target-owned only.
  - snap/setLength/bake/scale/offset use the same authored Animation target.
- D5 effect summary semantics — `279f9b7dec1ebc189068f0c5e9bad7641c4dbf45`
  - `keyframe_count` remains authored editor count.
  - particle/sound payload counts follow native truthy-effect export.
  - timeline `script_count` follows first datapoint + native effective-line filtering.

## D1 Existing-Animation Effect Mutation

Prepared candidate (NOT on `Local`):

```text
238daa0d7c97280d4b7ccd442211ab2570650f09
feat(animation): prepare existing effect mutation
```

Contract:
- channel `particle | sound | timeline`; operation `add | update | remove`;
- particle/sound update-remove targets keyframe UUID + `data_point_index`; timeline targets keyframe UUID;
- snap add/move with target animation snapping; same-time particle/sound add appends point up to native 1000-point limit;
- timeline duplicate time rejects; move never silently merges identities;
- preflight identity/index/time collision + effective no-op before one Undo;
- removing final point removes its keyframe;
- `null` clears optional locator/pre-script or resets actor binding to native default;
- moving particle/sound preserves editor-only `file` linkage; Molang/script is preserved, never evaluated.

Candidate adds `mcp/server/tools/animation-effects.ts`, registers `manage_animation_effects` in the existing Animation family, and adds a bounded regression contract.

## D2 Controller-State Effects

Prepared candidate (NOT on `Local`):

```text
617acc19b02f5854e52899eb9ea9fd65dfc53ec2
feat(animation): prepare controller state effects
```

Candidate extends existing `manage_animation_controller`; **no new tool family**:

```text
add_sound | update_sound | remove_sound
add_particle | update_particle | remove_particle
```

State target resolves exact UUID/unique name; effect update/remove uses native state-entry UUID. Sound owns `effect`; particle owns `effect`, optional `locator`, `bind_to_actor`, `pre_effect_script`. `null` performs native-default clear/reset. Existing controller plan/Undo ownership and preview-only `file` linkage are preserved; effective no-op updates reject before Undo.

## D3 Animation-Level Molang Properties

Prepared candidate (NOT on `Local`):

```text
5b452ec491fe7a563a4477d5342922ee37a54908
feat(animation): prepare Molang property mutation
```

Candidate extends existing `animation_timeline`; **no new math/property tool**:

```text
set_anim_time_update
set_blend_weight
```

Contract:
- payload `molang: string | null`; null clears to native `""`;
- normalization matches Blockbench Animation properties dialog: `trim().replace(/\n/g, "")`;
- whitespace-only text rejects; unrelated timeline actions reject `molang`;
- authored text is preserved and never evaluated by BlockIT;
- effective no-op rejects before Undo;
- mutation uses existing authored-Animation resolver + persistent animation Undo owner;
- result returns `uuid`, `name`, `anim_time_update`, and `blend_weight` so immediate reread is unnecessary.

Exact candidate diff is bounded to `mcp/server/tools/animation.ts` plus `mcp/tests/animation-math-property-mutation.test.ts`; no keyframe/rig/batch/copy-paste behavior is changed.

## Public Schema Boundary

D1, D2, and D3 change public schema/tool surface and require canonical:

```text
bun run docs:build
bun run docs:check
```

Current environment still lacks Bun 1.3.14. **Do not fast-forward public-schema/tool-surface candidates without canonical generated docs; never hand-edit generated API files.**

## Next Step

1. In a Bun/docs-capable execution path, reproduce current D1+D2+D3 final source candidates from current `Local`, run targeted/full required MCP verification, regenerate canonical API docs, and deliver only verified logical changes.
2. Run create → inspect → modify symmetry audit, then final static animation architecture audit; fix concrete residuals only.
3. Keep blend curves, bone-binding, generic generators, quality scores, and added Bezier complexity deferred without new evidence.

**Local acceptance is not part of this next step.**
