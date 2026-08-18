# Next Action

Updated: 2026-08-18

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
ANIMATION_CANONICAL_INTEGRATION_WAITING_FOR_BUN_GATE
ANIMATION_FINAL_STATIC_AUDIT_PENDING
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. GitHub execution discipline is owned only by `GITHUB_RULES.md`; do not duplicate it here.

## Retained Proof Boundary

Static/source work may continue without desktop acceptance. Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof. Experimental browser proof below does not upgrade desktop MCP claims. Visual fidelity, desktop playback, persistence, actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**.

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

This candidate was built as one logical commit on the then-current `Local` (`18c4aedd0fdc2ec7200ae718ca72bfd15155d5cb`). This continuation update advances `Local`; therefore final delivery must reproduce the candidate from the then-current HEAD rather than merge orphan history blindly.

Candidate scope:
- D1 `manage_animation_effects`: bounded particle/sound/timeline add/update/remove, exact inspected identity, snapping/collision/no-op preflight, one Undo, 1000-point cap, split-on-move, final-point removal, preview `file` preservation, strict schemas, and inspector/export-compatible continuation state.
- D2 extends existing `manage_animation_controller` with state sound/particle lifecycle; no new controller tool.
- D3 extends existing `animation_timeline` with `set_anim_time_update` / `set_blend_weight`; no `math_animation`.
- canonical Animation docs manifest and runtime registration include `manage_animation_effects`.
- `inspect_animation` effect surface explicitly covers particle/sound/timeline.
- animation skill/policy/runtime workflow stop classifying implemented D1/D2 as protected gaps; detailed routing remains owned by the animation skill.
- professional-reasoning and D1 regression tests require the new owners, strict schemas, one-Undo behavior, docs-manifest registration, and inspection parity.
- `implementation-map.md` gains the `manage_animation_effects` Hot-Path source/test owner, updates default inventory 63 → 64, and removes implemented D1/D2 from protected gaps. `documentation-handoff.test.ts` follows that ownership.
- only exact `tool_count` changes to 64 statically; serialized character ceilings remain unchanged until measured.
- workflow prompt candidate is below its `<7000` JavaScript string-length contract; animation skill remains below `<4500`.

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

**Environment boundary:** the user's workstation is Windows and is **not** required for this current verification step. The repo-owned `.github/workflows/mcp-verify.yml` runs the canonical verifier on `ubuntu-latest`; that CI runner is the Linux environment relevant to this gate. The assistant sandbox may also be Linux-like but is not repository authority. Do not ask the user to install/use a Linux Bun binary for this gate, and do not conflate CI/sandbox OS with the user's Windows desktop.

Repo-owned `bun-tooling` provides no alternate runtime path and explicitly requires unavailable proof to remain reported rather than inferred. Current assistant execution environment has no Bun, no preloaded Bun container/image, no `gh` workflow-dispatch path, and no usable binary/package download transport. Do not create a temporary workflow/branch, hand-edit generated API docs, weaken verification, or repeatedly probe equivalent transport paths.

Generated artifacts intentionally remain outside the orphan candidate until canonical generation is possible:
- `mcp/docs/api.json`
- `mcp/docs/index.html`
- `mcp/prompts/manifest.json`

## Next Step

1. Use the repo-owned GitHub Actions `ubuntu-latest` verifier (or another repository-authorized Bun-capable execution surface) without involving the user's Windows desktop.
2. Reproduce `8cd1a4e86b28af8ff4ecaa0cbfa72051c6de194c` from the then-current `Local` as one logical delivery.
3. Run the canonical gate. `measure:surface` must confirm 64 tools and show whether any current character ceiling actually needs adjustment; do not inflate ceilings speculatively.
4. Regenerate prompt/API artifacts through canonical generators and include them in the same verified delivery.
5. Run create → inspect → modify symmetry audit, then final static animation architecture audit; fix concrete residuals only.

**Local acceptance remains deferred and is not part of this next step.**
