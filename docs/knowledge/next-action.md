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
ANIMATION_D3_PROPERTY_CANDIDATE_PREPARED_UNREFERENCED
ANIMATION_D4_TIMELINE_BATCH_OWNERSHIP_FIXED
ANIMATION_D5_EFFECT_SUMMARY_COUNTS_FIXED
ANIMATION_D1_D3_COMBINED_SOURCE_CANDIDATE_PREPARED
ANIMATION_CANONICAL_INTEGRATION_WAITING_FOR_BUN_GATE
ANIMATION_FINAL_STATIC_AUDIT_PENDING
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. GitHub tool-fit/atomicity/large-file discipline is owned only by `GITHUB_RULES.md`; do not duplicate it here.

## Closed Source Hardening

- D1.1 effect inspection — `7a3fcc2522911c0a578ace871a9b6b0532e1ab9c`
- D3.1 `anim_time_update` / `blend_weight` inspection — `fbc1be9380ce81df71207858f55bdf41bc335f36`
- authored Animation/controller identity separation — `90284633cfb8a3177f26c29536283756a5ef3f72`
- timeline/batch target ownership — `ec64de58da23b1426527b9d2d7101c5286e015be`
- effect summary export semantics — `279f9b7dec1ebc189068f0c5e9bad7641c4dbf45`
- stale D4 batch ownership assertion fixed — `862c7f36be7c7d78a85a5d2f17ae8fbf4624fadf`

Professional animation reasoning remains owned by `docs/foundation/08-animation-standard.md` and `.agents/skills/blockit-bedrock-animation/SKILL.md`.

## Public Mutation Candidates

### D1 — Existing Animation Effects

Reference candidate: `238daa0d7c97280d4b7ccd442211ab2570650f09`.

`manage_animation_effects` owns bounded `particle | sound | timeline` add/update/remove for one authored Animation and one Undo. Particle/sound update-remove target keyframe UUID + inspected `data_point_index`; timeline targets keyframe UUID. Preflight covers snapping, collisions, no-op, point identity, native max 1000 datapoints, split-on-move, final-point removal, explicit clear semantics, and editor-only `file` preservation. Molang/script is preserved, never evaluated.

### D2 — Controller State Effects

Reference candidate: `617acc19b02f5854e52899eb9ea9fd65dfc53ec2`.

Extends existing `manage_animation_controller`; **no new tool**. Adds sound/particle add/update/remove through native state-entry UUID, preserves preview `file`, rejects no-op before the existing one-controller/one-Undo mutation, and returns created/removed receipts plus affected effect counts.

### D3 — Animation-Level Molang

Reference candidate: `5b452ec491fe7a563a4477d5342922ee37a54908`.

Extends existing `animation_timeline`; **no `math_animation` tool**. Adds `set_anim_time_update` and `set_blend_weight`. `molang` is authored string or `null`; native normalization is `trim().replace(/\n/g, "")`, `null` clears to `""`, whitespace-only text fails, no-op fails before Undo, and BlockIT never evaluates the expression.

## Combined Integration Candidate

Current-HEAD combined source candidate (NOT on `Local`):

```text
f87452fb2fe8458a70b8283aac7d85125b8b5276
feat(animation): integrate effect and Molang mutation candidates
```

Exact diff is bounded to:

```text
mcp/build/docs-manifest.ts
mcp/server/tools.ts
mcp/server/tools/animation-effects.ts
mcp/server/tools/animation-controller.ts
mcp/server/tools/animation.ts
mcp/tests/animation-effect-mutation-contract.test.ts
mcp/tests/animation-controller-effects-mutation.test.ts
mcp/tests/animation-math-property-mutation.test.ts
```

This combined candidate also fixes a D1 integration omission: `animationEffectToolDocs` is included in the canonical Animation docs manifest before controller/inspection docs.

Do **not** merge older orphan candidates blindly. Reproduce/finalize from current `Local` when the canonical gate is executable.

## Canonical Integration Gate

D1/D2/D3 change public MCP schema/surface. Final delivery requires the repo-owned Bun gate:

```text
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:build
bun run docs:check
```

Current environment has Node/npm but no Bun 1.3.14 and no usable package/download network path. Existing `mcp-verify.yml` has the correct Bun setup and gate, but the available GitHub connector cannot dispatch a new workflow run. Do not create a temporary workflow or weaken docs verification to compensate.

### Known gate obligations

1. **Generated API docs** — source changes require canonical `docs:build`; never hand-edit generated tool entries.
2. **Prompt generation** — `mcp/prompts/bedrock_entity_workflow.md` still names existing-animation effects as a protected gap; final integration must update that source and regenerate its canonical manifest so runtime guidance matches capability.
3. **Animation specialist routing** — after verified source integration, route existing-animation effects → `manage_animation_effects`, controller state effects → `manage_animation_controller`, and animation-level Molang properties → `animation_timeline`; remove only those implemented gaps from Protected Gaps.
4. **Default surface measurement** — `measure-default-surface.ts` currently requires exactly `tool_count: 63`. D1 intentionally adds one sample-proven tool, so final measurement must establish the actual 64-tool payload/schema metrics before any evidence-backed ceiling update. Do not inflate character budgets speculatively and do not overload an unrelated existing tool merely to preserve 63.

## Next Executable Step

1. Obtain a Bun/docs-capable execution path without changing repository architecture.
2. Reproduce the combined candidate from current `Local` plus the required prompt/skill routing changes.
3. Run the canonical gate; use actual `measure:surface` output to update only surface ceilings that are proven necessary.
4. Regenerate and commit canonical prompt/API artifacts in the same verified logical delivery.
5. Run create → inspect → modify symmetry audit, then final static animation architecture audit; fix concrete residuals only.
6. Keep blend curves, bone-binding expressions, generic generators, quality scores, and added Bezier complexity deferred without new evidence.

**Local acceptance remains outside this next step.**
