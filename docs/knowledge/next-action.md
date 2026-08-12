# Next Action

Updated: 2026-08-12

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns routing; accepted proof detail lives in `docs/foundation/validation-report.md`; source ownership lives in `implementation-map.md`.

## Status

```text
PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE
```

Working branch: **`Local` only**.

The user explicitly does **not** want another local Codex/Blockbench run yet, and does not want other local work in this phase. Use the smallest relevant repository/static proof; do not manually rerun broad or unrelated tests when existing CI covers the changed contract.

## Accepted Baseline

Retained Bedrock capability uses compact structured results, bounded summary-first reads, returned-state reuse, separated asset/repository routing, one runtime prompt (`bedrock_entity_workflow`), and regression-checked ownership.

## GitHub-Only Pretest Hardening

Current isolated serialized surface remains:

```text
62 tools
74,996 tools/list response characters
51,810 input-schema characters
10,885 description characters
initialize instructions: 386 characters
```

These are serialized measurements, not client token/context measurements.

## Native Deferred MCP Discovery

**native deferred MCP tool search exists** in current upstream architecture when tool search is available. BuildIT keeps native deferred loading with exact-name search after semantic routing; installed-client/model parity remains `LOCAL PROOF REQUIRED`.

## P0–P4 Efficiency Hardening

Implemented on `Local`:

```text
P0  DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE
P1  raw static proxy:    Top-1 .5096 / Top-3 .7981 / Top-8 .9231 / MRR .6652
P2  exact-name loading:  Top-1 .8173 / Top-3 .9808 / Top-8 1.0000 / MRR .8990
P3  validation/identity/stale/no-effect/capability failures → bounded recovery
P4  named hot-path defect → mapped source + primary regression first
```

No custom MCP router, recovery engine, extra registration profile, server split, or capability pruning was added.

## Post-P4 Current-State Synchronization

Current routing, ownership, proof/navigation docs, README surfaces, and the bounded hot-path index were synchronized after P4. Historical reviews/runbooks remain provenance rather than current execution authority.

## P5 Semantic Form / Rotation / Contact Hardening

Historical Zebra failures `G-01`, `G-09`, `G-11` drove the current pre-coordinate semantic form, explicit orientation state, pivot-role, and contact-invariant rules. Semantic labels do not authorize coordinates; `[0,0,0]` rotation is not a default modelling answer; required attached masses preserve a declared contact relation.

## P6 Actual Reference Grounding / Claim-Locked Comparison

Reference-driven authoring now requires the actual approved image in active multimodal context. Material decisions trace through a Reference Evidence Map + View Pair Map into Semantic Form, and material `PASS` requires the actual approved reference plus fresh current model evidence. Path/manifest/prose/memory cannot substitute; ambiguous or missing evidence stays `UNVERIFIED/BLOCKED`.

No vision scorer, image→Cube planner, runtime profile, or self-reported semantic field was added.

## P7 Fidelity Convergence / Evaluation Integrity

Historical `G-24`/`G-25` correction failures showed that a technically valid correction could still be another guessed transform. P7 adds one bounded rule:

```text
pre-correction paired evidence
→ causal correction
→ fresh affected paired evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

A correction is progress only when its target mismatch is `IMPROVED` and no previously supported material claim/view becomes `REGRESSED`. `UNCHANGED`/`REGRESSED` is not progress; cross-view regression changes the diagnosis or reopens Primary Form rather than authorizing another patch. This is qualitative, not a numeric fidelity score.

Model-facing evaluation integrity is also frozen without adding a new evaluator runtime:

```text
actual approved image to candidate
+ target facts / normal workflow
+ independent expectations established before candidate output
→ evaluate only:
   decomposition / coverage
   cross-view consistency
   spatial hypothesis quality
   correction direction / convergence
```

The candidate must not receive the expected answer. Expectations may come from user-approved facts, pre-existing audited evidence, or another independently grounded source. The retained Zebra asset is evaluation evidence only, never a Zebra-specific product/runtime law.

Targeted contract regression: `mcp/tests/model-effectiveness-fidelity-convergence.test.ts`.

## Evidence Boundary

GitHub/CI can prove routing, semantic/reference-grounding instructions, qualitative convergence rules, rotation/pivot schema safety, recovery, source/test ownership, buildability, and regression integrity. It **cannot** prove the model interpreted an image correctly or that a generated model visually converges in practice. That remains model-facing/live evidence.

## Continuation Boot

```text
AGENTS.md
→ this file
→ CONTEXT.md only if stable facts matter
→ named MCP-tool defect? Implementation Map Hot-Path Defect Index
→ affected owner + nearest AGENTS.md
→ development-brief
→ at most one relevant specialist
```

## Next Step

```text
WAIT LOCAL — do not run local until the user explicitly requests testing.

P0–P7 + POST-P4 CURRENT-STATE SYNC — IMPLEMENTED ON LOCAL.
Proof budget for P7: one normal MCP Verify run only; no manual broad reruns unless a relevant gate fails.

NEXT PROPOSED — do not add more geometry architecture. Geometry policy/guardrails are feature-complete for the current evidence. The remaining question is model-facing reference-understanding and real convergence quality; evaluate that only with actual images and independent expectations, without exposing a gold answer to the candidate.
```
