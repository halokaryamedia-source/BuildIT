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

Design input is historical failure evidence, especially Zebra audit `G-01`, `G-09`, and `G-11`: arbitrary transforms, disconnected-looking Cube-by-Cube construction, and visibly sloped masses left axis-aligned.

Implemented in the modelling specialist + runtime workflow:

```text
REFERENCE
→ Semantic Form Contract
   identity / primary masses / must-exist reason
   landmarks / count-symmetry / topology
   negative spaces / representation / evidence state
→ per-mass orientation: AXIS_ALIGNED | ROTATED | UNRESOLVED
→ required contact target/invariant
→ Primary Form Hypothesis
→ exact from/to/origin/rotation
→ AUTHOR
```

Rules:

- semantic labels never authorize coordinates;
- each primary Cube maps to a declared mass/landmark or justified split; no orphan/filler Cube;
- `[0,0,0]` rotation is not a default modelling answer: material slopes require `ROTATED`, while material `UNRESOLVED` orientation becomes `BLOCKED`;
- rotated masses require explicit pivot/origin plus a transform role (`MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`);
- required attachments declare contact target/invariant before coordinates; rotating an attached mass must preserve that relationship;
- technical overlap/hierarchy/touching remains structural evidence only; paired visual evidence owns contact validity;
- no self-reported semantic fields were added to `place_cube`; the MCP server cannot validate whether prose reasoning is visually true.

Targeted contract regression is `mcp/tests/model-effectiveness-semantic-form.test.ts`. It ties the new rules back to historical failures and preserves the existing structural non-zero-rotation→explicit-pivot guard.

**Proof boundary:** this is repository/contract hardening. It proves the system is instructed to reason before placement and that structural rotation safety remains enforced. It does **not** prove Codex/model object understanding or final reference fidelity without a model-facing/live evaluation.

## Evidence Boundary

GitHub/CI can prove routing, semantic-form instructions, rotation/pivot schema safety, recovery, mapped source/test ownership, buildability, and regression integrity. Installed model decisions, image understanding, live Blockbench appearance, and actual object-quality improvement remain unproven by static CI.

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

P0–P5 + POST-P4 CURRENT-STATE SYNC — IMPLEMENTED ON LOCAL.
Proof budget for P5: one normal MCP Verify run only; no manual broad reruns unless a relevant gate fails.

NEXT PROPOSED — evaluate semantic object understanding without local Blockbench only if a real model-facing non-local evaluation path can be made honest. Do not create a fake benchmark that merely tests its own expected answers, and do not claim static prompt assertions prove object understanding.
```
