# Current Validation

Updated: 2026-08-30

This file owns **current proof interpretation**. Active continuation belongs in `docs/knowledge/next-action.md`; stable product facts belong in `CONTEXT.md`; exact source/test ownership belongs in `docs/knowledge/implementation-map.md`.

Do not copy every passing workflow run, test count, or historical proof snapshot here. GitHub Actions and Git history own exact run/commit archaeology. Update this file only when the meaningful proof boundary changes.

## Current Proof Boundary

```text
BEDROCK CALLABLE CATALOG:        65 tools across phases
DEFAULT CLIENT EXPOSURE:         MCP Core + Geometry (28 tools)
KNOWN FULL MCP BASELINE:         PASS @ 5ecbf25608f8da879497e2f687854cb68781f3cd
ACCEPTED LIVE BASELINE:          2026-08-12 Blockbench 5.1.6
CURRENT ROUTE 1 LIVE RETEST:     LOCAL PROOF REQUIRED — DEFERRED BY USER
CURRENT MODEL-QUALITY CLAIM:     LOCAL PROOF REQUIRED
```

`KNOWN FULL MCP BASELINE` is the last deliberately retained full canonical executable/source baseline, not a claim that this file tracks the newest CI run. Current workflow status must be read from the exact current commit/run when it matters.

## Current Agent-Contract Proof

Current source defines:

```text
MCP CORE + exactly one ACTIVE PHASE
GEOMETRY | TEXTURING | ANIMATION
```

Static/current source contracts retain:

- 65 callable Bedrock tools across phases;
- default Core + Geometry exposure of 28 tools;
- strict foreign-phase `HANDOFF_REQUIRED` behavior;
- Route 1 as transient Geometry-owned reference evidence rather than production geometry;
- fail-closed targeting, mutation, export, and phase boundaries;
- generated API/prompt ownership through canonical source + generator;
- repository, authoring-policy, executable MCP, experimental runtime, and release verification as separate proof surfaces.

Exact regression ownership and protected capability gaps live in `docs/knowledge/implementation-map.md`; this file does not duplicate them.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the **actual approved reference image** plus fresh evidence from the current model/revision for the material views being judged.

The following cannot create visual `PASS` by themselves:

- successful MCP/tool execution;
- static source or CI success;
- valid coordinates/hierarchy/export;
- a Route 1 GLB or raw GLB bounds;
- a scalar similarity score;
- a saved artifact whose visual result was not inspected.

Front-view agreement does not prove hidden depth or full 3D fidelity. If required evidence is unavailable, the correct state is `UNVERIFIED` or `LOCAL PROOF REQUIRED`, not inferred success.

## Authoring Efficiency

**Static Footprint** and raw call count are guardrails, not Authoring Efficiency proof.

Authoring Efficiency means **Cost to Accepted Result**: the justified work needed to reach an accepted-quality result, including avoidable discovery, readback, retries, recovery, and correction. A smaller prompt/Skill/tool surface is not an improvement if quality regresses or work merely moves elsewhere.

Runtime Authoring Efficiency or model-quality claims require the matching local acceptance procedure and accepted artifact evidence.

## Evidence Limits

Static source/CI evidence can prove the contracts it actually executes, such as schemas, routing, deterministic generated output, buildability, phase ownership, pinned reproducibility inputs, and fail-closed source invariants.

It **cannot prove visual fidelity**, installed-plugin freshness, fresh client registry state, desktop GLB rendering, live Blockbench Undo/playback/persistence, or model-quality improvement unless those surfaces actually ran.

User-deferred Route 1 live validation and Geometry cleanup remain deferred until explicitly reactivated.
