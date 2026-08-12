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

Design input is the remaining historical false-review evidence, especially `G-06`, `G-17`, `G-21`, `G-22`, `G-23`: fluent review could replace truth, model/reference evidence was insufficiently paired, semantic items were unnamed, and criterion outcomes were too free-form.

Implemented contract:

```text
actual approved reference image visible to the model
→ Reference Evidence Map
   claim_id + observable claim + supporting reference view(s) + evidence state
→ View Pair Map
   reference label → matching canonical capture_model_views view
→ Semantic Form Contract links material items to grounded claim_id(s)
→ Primary Form Hypothesis / authoring
→ fresh current model view(s)
→ claim-locked reference ↔ model difference-first verdict
```

Rules:

- user brief/target owns identity/function; approved image owns visible form; approved dimensions own numeric envelope;
- filename/path/manifest/ASSET_REFERENCE/prose summary/prior observation/memory is not image evidence;
- if the actual approved image cannot be inspected, reference-driven authoring is `BLOCKED` rather than reconstructed from generic object knowledge;
- ambiguous/mirrored view pairing remains `UNVERIFIED`; unlike views cannot approve each other;
- a material `PASS` requires actual approved reference image + fresh current-revision model image in the active comparison context;
- claim review uses `claim_id`, paired views, observed difference, and `FAIL / UNVERIFIED / PASS` rather than generic positive prose;
- after material mutation, affected model image evidence is stale until re-captured;
- Reference Evidence Map is a derived working index, never authority over the actual image;
- similarity/IoU/projection scores remain non-authoritative; no vision scorer, image→Cube planner, runtime profile, or self-reported semantic field was added.

Targeted contract regression: `mcp/tests/model-effectiveness-reference-grounding.test.ts`.

**Proof boundary:** repository/CI can prove this fail-closed grounding contract exists. It cannot prove the model interpreted a reference correctly; that remains model-facing evidence. The intended anti-slop behavior is therefore not “guess better” but “no material geometry/PASS without actual image evidence; uncertainty stays explicit or blocks.”

## Evidence Boundary

GitHub/CI can prove routing, semantic/reference-grounding instructions, rotation/pivot schema safety, recovery, mapped source/test ownership, buildability, and regression integrity. Installed model decisions, image understanding, live Blockbench appearance, and actual object-quality improvement remain unproven by static CI.

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

P0–P6 + POST-P4 CURRENT-STATE SYNC — IMPLEMENTED ON LOCAL.
Proof budget for P6: one normal MCP Verify run only; no manual broad reruns unless a relevant gate fails.

NEXT PROPOSED — only pursue a model-facing non-local reference-understanding evaluation if it can use actual images plus independently grounded expectations. Do not create a circular benchmark whose expected answer is authored by the same model being evaluated, and do not claim prompt/source assertions prove image understanding.
```
