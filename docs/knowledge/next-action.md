# Next Action

Updated: 2026-08-19

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
PRO-1–PRO-8 STATIC HARDENING RETAINED
TEXTURING_T0_T18_STATIC_HARDENING_COMPLETE
ANIMATION_SAMPLE_FORENSICS_COMPLETE
ANIMATION_MATH_RESEARCH_COMPLETE
ANIMATION_D1_EFFECT_OBSERVABILITY_IMPLEMENTED
ANIMATION_D2_CONTROLLER_EFFECT_CANDIDATE_PREPARED
ANIMATION_D3_MATH_PROPERTY_OBSERVABILITY_IMPLEMENTED
ANIMATION_D4_TIMELINE_BATCH_OWNERSHIP_FIXED
ANIMATION_D5_EFFECT_SUMMARY_COUNTS_FIXED
ANIMATION_FINAL_STATIC_INTEGRATION_CANDIDATE_PREPARED
ANIMATION_CREATE_INSPECT_MODIFY_SYMMETRY_STATIC_AUDIT_COMPLETE
ANIMATION_FINAL_STATIC_ARCHITECTURE_AUDIT_COMPLETE
ANIMATION_CANONICAL_INTEGRATION_WAITING_FOR_BUN_GATE
ANIMATION_SOURCE_CLOSURE_PENDING_CANONICAL_GATE
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. GitHub execution discipline is owned only by `GITHUB_RULES.md`; do not duplicate it here.

## Retained Proof Boundary

Static/source work may continue without desktop acceptance. Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof. Experimental/browser/static proof does not upgrade desktop MCP claims. Visual fidelity, desktop playback, persistence, actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.

## Closed Source Hardening

- Effect/timeline identity inspection — `7a3fcc2522911c0a578ace871a9b6b0532e1ab9c`.
- `anim_time_update` / `blend_weight` inspection — `fbc1be9380ce81df71207858f55bdf41bc335f36`.
- authored Animation/controller identity separation — `90284633cfb8a3177f26c29536283756a5ef3f72`.
- timeline/batch target ownership — `ec64de58da23b1426527b9d2d7101c5286e015be`.
- effect summary export semantics — `279f9b7dec1ebc189068f0c5e9bad7641c4dbf45`.
- stale D4 ownership assertion — `862c7f36be7c7d78a85a5d2f17ae8fbf4624fadf`.

Professional animation reasoning remains owned by `docs/foundation/08-animation-standard.md` and `.agents/skills/blockit-bedrock-animation/SKILL.md`.

## Final Static Integration Candidate

Reference candidate, **NOT on `Local`**:

```text
8cd1a4e86b28af8ff4ecaa0cbfa72051c6de194c
feat(animation): prepare canonical effect and Molang closure
```

It was built as one logical commit on a prior `Local`. Final delivery must reproduce the candidate from the then-current `Local`; do not merge orphan history blindly.

Candidate scope:
- D1 `manage_animation_effects`: particle/sound/timeline add/update/remove, exact inspected identity, snapping/collision/no-op preflight, one Undo, native point cap, split-on-move, final-point removal, preview `file` preservation, strict schemas, inspector/export-compatible continuation.
- D2 extends existing `manage_animation_controller` with state sound/particle lifecycle; no new controller tool.
- D3 extends existing `animation_timeline` with `set_anim_time_update` / `set_blend_weight`; no `math_animation`.
- canonical docs manifest/runtime registration include `manage_animation_effects`; inspector covers particle/sound/timeline.
- skill/policy/runtime workflow stop classifying implemented D1/D2 as protected gaps; detailed routing remains owned by the animation skill.
- regression owners cover D1/D2/D3, routing, strict schemas, one-Undo behavior, docs registration, and inspection parity.
- implementation map owns `manage_animation_effects`, default inventory 64, and remaining protected gaps.
- only exact tool inventory changes 63 → 64 statically; serialized character ceilings remain unchanged until measured.

## Static Symmetry / Architecture Closure

Verified static lifecycle coverage:

```text
transform keys          create/manage → inspect_animation → manage_keyframes/graph/batch → inspect
Molang transforms       manage_keyframes → inspect_animation → manage_keyframes → inspect
animation effects       create_animation or manage_animation_effects → inspect_animation → manage_animation_effects → inspect
controller composition  manage_animation_controller → inspect_animation(state) → manage_animation_controller → inspect
controller effects      manage_animation_controller → inspect_animation(state) → manage_animation_controller → inspect
animation properties    animation_timeline → inspect_animation → animation_timeline → inspect
loop/length/snapping    create/timeline → inspect_animation → animation_timeline → inspect
```

Architecture audit found no missing owner/tool that justifies new public surface. Identity, Undo ownership, collision/no-op preflight, Molang preservation, effect ownership, controller composition, continuation state, routing, docs-manifest ownership, and 64-tool inventory are coherent at source/static level.

A broader action-specific strictness cleanup for legacy `animation_timeline` fields was reviewed but **not promoted**: the loose multi-action schema predates D3 and no current failure evidence justifies widening this closure into unrelated schema redesign. D3 already rejects missing Molang and Molang on unrelated actions. Reopen only with concrete test/runtime evidence.

Remaining protected animation gaps: controller blend-curve mutation and bone-binding expressions. Generic generators, quality scores, and added Bezier complexity remain deferred.

## Canonical Gate Blocker

D1/D2/D3 change public MCP schema/surface. Final delivery requires:

```text
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:build
bun run docs:check
```

**Environment boundary:** the user's workstation is Windows and is not required for this verification step. Repo-owned `.github/workflows/mcp-verify.yml` uses `ubuntu-latest`; that CI runner is the Linux environment relevant to the canonical gate. The assistant sandbox is separate and is not repository authority.

Current assistant environment has no Bun, no cached canonical dependencies, no preloaded Bun image, no authenticated `gh` workflow-dispatch path, and no usable package/binary download transport. Do not create a temporary workflow/branch, push incomplete public schema merely to trigger CI, hand-edit generated API docs, weaken verification, or repeatedly probe equivalent transport paths.

Generated artifacts remain intentionally outside the orphan candidate until canonical generation is possible:
- `mcp/docs/api.json`
- `mcp/docs/index.html`
- `mcp/prompts/manifest.json`

## Next Step

1. Use the repo-owned GitHub Actions `ubuntu-latest` verifier or another repository-authorized Bun-capable execution surface; do not involve the user's Windows desktop.
2. Reproduce `8cd1a4e86b28af8ff4ecaa0cbfa72051c6de194c` from the then-current `Local` as one logical delivery.
3. Run the canonical gate. `measure:surface` must confirm 64 tools and determine whether any existing character ceiling actually needs adjustment; do not inflate ceilings speculatively.
4. Regenerate prompt/API artifacts through canonical generators and include them in the same verified delivery.
5. If canonical verification changes executable source beyond generated artifacts or evidence-backed budget values, rerun the affected static audit only; otherwise mark **ANIMATION SOURCE CLOSED**.

**Local acceptance remains deferred and is not part of this next step.**
