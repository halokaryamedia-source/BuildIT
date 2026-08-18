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
ANIMATION_D3_PROPERTY_MUTATION_PENDING_DOCS_TOOLCHAIN
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

Locked behavior:

```text
channel   = particle | sound | timeline
operation = add | update | remove
one authored Animation + ordered bounded operations + one Undo
```

Identity/rules:
- particle/sound update-remove → keyframe UUID + `data_point_index`; timeline → keyframe UUID;
- snap add/move with target animation snapping;
- particle/sound same-time add appends point; native max 1000 datapoints enforced;
- timeline duplicate time rejects;
- preflight identity/index/time collision + effective no-op before Undo;
- moving a particle/sound datapoint splits it to a new keyframe and never silently merges into occupied time;
- removal of final point removes its keyframe;
- `null` clears optional locator/pre-script or resets actor binding to native default;
- moving particle/sound preserves editor-only `file` linkage; Molang/script is preserved, never evaluated.

Prepared candidate (NOT on `Local`):

```text
238daa0d7c97280d4b7ccd442211ab2570650f09
feat(animation): prepare existing effect mutation
```

Candidate adds `mcp/server/tools/animation-effects.ts`, registers `manage_animation_effects` in the existing Animation family, and adds its bounded regression contract.

## D2 Controller-State Effects

Prepared candidate (NOT on `Local`):

```text
617acc19b02f5854e52899eb9ea9fd65dfc53ec2
feat(animation): prepare controller state effects
```

Candidate extends existing `manage_animation_controller`; **no new tool family**. Added bounded operations:

```text
add_sound | update_sound | remove_sound
add_particle | update_particle | remove_particle
```

Contract:
- state target resolves exact UUID/unique name; effect update/remove uses native state-entry UUID;
- sound owns `effect` only;
- particle owns `effect`, optional `locator`, `bind_to_actor`, `pre_effect_script`;
- `null` clears locator/pre-script and resets actor binding to native default true;
- updates preserve editor-only `file` linkage through the existing controller plan snapshot/extend round-trip;
- effective no-op updates reject before Undo;
- all operations remain in the existing one-controller/one-Undo plan and return created/removed UUID receipts plus affected-state effect counts.

Candidate diff is bounded to `mcp/server/tools/animation-controller.ts` plus `mcp/tests/animation-controller-effects-mutation.test.ts`.

## Public Schema Boundary

D1, D2, and D3 property mutation change public schemas/tool surface and require canonical:

```text
bun run docs:build
bun run docs:check
```

Current environment still lacks Bun 1.3.14. **Do not fast-forward public-schema/tool-surface candidates without canonical generated docs; never hand-edit generated API files.**

## Next Step

1. Prepare D3 `anim_time_update` / `blend_weight` mutation through the smallest coherent existing Animation property owner; never create `math_animation`.
2. In a Bun/docs-capable execution path, reproduce current D1+D2+D3 final source candidates from current `Local`, run targeted/full required MCP verification, regenerate canonical API docs, and deliver only verified logical changes.
3. Run create → inspect → modify symmetry audit, then final static animation architecture audit; fix concrete residuals only.
4. Keep blend curves, bone-binding, generic generators, quality scores, and added Bezier complexity deferred without new evidence.

**Local acceptance is not part of this next step.**
