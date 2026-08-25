# Validation Report

Updated: 2026-08-25 — phase-scoped agent-contract hardening

This file owns the **proof boundary**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts belong in `CONTEXT.md`.

## Current Evidence Summary

```text
BEDROCK CALLABLE CATALOG:                 64 tools across phases
DEFAULT CLIENT EXPOSURE:                  MCP Core + Geometry (27 tools)
ACTIVE PHASE CONTRACT:                    SOURCE + TARGETED TEST PROOF
LATEST FULL MCP VERIFY:                   RED — legacy test reconciliation required
LAST OBSERVED FULL CANONICAL GREEN:       d8c0899 (pre-phase 64-tool exposure)
ACCEPTED LIVE BASELINE:                   2026-08-12 Blockbench 5.1.6
LATEST USER AUTHORING BASELINE:           QUALITY FAIL reported 2026-08-25
CURRENT HARDENING LIVE RETEST:            DEFERRED BY USER
CURRENT MODEL-QUALITY CLAIM:              LOCAL PROOF REQUIRED
```

Current static proof must not be confused with live Blockbench behavior. Source/typecheck/targeted tests can prove phase ownership, prompt filtering, handoff semantics, schemas, and build-facing contracts; they cannot prove visual fidelity, playback, installed-plugin freshness, or Authoring Efficiency.

## Current Agent-Contract Proof

Current source implements:

```text
MCP CORE + exactly one ACTIVE PHASE
GEOMETRY | TEXTURING | ANIMATION
```

Runtime initialize instructions name `ACTIVE PHASE`, explain that foreign-phase tools are intentionally unavailable, and require `HANDOFF_REQUIRED` rather than foreign-tool search. Runtime workflow generation is phase-filtered: shared minimum-evidence guidance + only the current phase workflow + compact readiness/handoff state.

The targeted `authoring-phase-surface.test.ts` contract currently covers:

- missing phase defaults to Geometry while explicit invalid phase fails closed;
- default Geometry exposure is Core + Geometry only;
- retained callable tools have one ownership category;
- initialize instructions name phase, foreign-tool absence, readiness, handoff, and STOP;
- Geometry/Texturing/Animation runtime prompt bodies exclude foreign-phase authoring routes;
- specialists do not direct-call foreign-phase mutation;
- root/workspace routing loads the active specialist only;
- compact handoff state preserves resume-critical context without a UUID registry.

The latest full MCP verification still stops in legacy contract tests. That is **STALE_TEST / PROOF_FAILURE debt**, not evidence that the phase contract itself failed. Each legacy failure must be classified as current invariant, stale exact-string/retired ceremony, or legitimate regression before mutation.

## 2026-08-25 User Baseline Failure

The latest authoring baseline supplied by the user was a **QUALITY FAIL**: texturing remained visually flat/poor and the simple rigid model took too much apparent guessing/repetition. The exact current phase-scoped artifact has not been live-retested, so no before/after speed or quality improvement is claimed.

## Current Static / Source State

Current retained source includes:

- 64-tool normal Bedrock callable catalog across phases;
- client exposure narrowed to MCP Core + exactly one active phase;
- phase-specific runtime workflow and active-specialist-only routing;
- deterministic `HANDOFF_REQUIRED` with readiness + compact resume state;
- coherent Cube and Group batching;
- deterministic non-overlapping Box-UV packing and returned `box_uv_region`;
- logical UV resolution 128 default / 256 opt-in;
- Texture Atlas/Painter/PBR/material-instance authoring;
- Bedrock animation, effects, controller mutation/inspection;
- Locator/Null Object lifecycle;
- Undo/history, `.bbmodel`, and Bedrock geometry export;
- loopback-only request-owned/stateless transport;
- `risky_eval` and `from_geo_json` disabled.

## Box-UV / Phase Boundary

Geometry owns UV Layout mutation. After Geometry `PASS`, final Box-UV state is locked with `autouv=0` where applicable, then `list_textures` performs the global UV audit. Texturing may read/audit UV state but must return a required UV/geometry correction to Geometry via `HANDOFF_REQUIRED`.

```text
Geometry PASS
→ UV Layout finalization
→ final Box-UV lock
→ list_textures audit
→ UV Layout PASS
→ HANDOFF_REQUIRED(texturing)
```

## Canonical Static Proof History

Commit `d8c0899` remains the last observed **full canonical green** from the older pre-phase surface. It is historical proof, not proof of the current phase-scoped source.

Current phase hardening has newer source/typecheck/targeted-test evidence, but the full suite remains red until legacy tests are reconciled. Never restore retired ceremony merely to recover a green check.

## Local Runtime History

### Accepted baseline — 2026-08-12

Historical live coverage included loopback/stateless transport, then-current tool surface, geometry/correction/Undo, texture/Painter/PBR/material instances, animation basics, Locator/Null Object lifecycle, persistence, and export.

### TEST 1 — 2026-08-24

Historical mechanics coverage included representative project/group/cube creation, correction, Undo/redo rejection behavior, Painter bounds, PBR/material instances, Molang/controller paths, Locator/Null Object behavior, persistence/export, and selected lifecycle checks on the artifacts used in that run.

Neither historical run automatically proves current phase-scoped behavior.

## Surface Guard

```text
retained Bedrock callable catalog  64 tools
default Geometry exposure           27 tools
initialize instructions             <= 700 characters
catalog tools/list budget           <= 82,000 characters
catalog input schemas               <= 58,000 characters
catalog descriptions                <= 11,500 characters
max per-tool payload                <= 3,200 characters
canonical workflow source           < 9,000 characters
```

These are **Static Footprint** regression ceilings. Character counts are regression ceilings, not client token measurements and not Authoring Efficiency proof. `bun run measure:surface` owns exact current serialized catalog values once the full gate reaches that step.

## Visual / Reference Proof Rule

Reference-driven approval requires:

```text
actual approved reference image
+ fresh current-revision model image(s)
+ difference-first comparison
```

Paths, filenames, manifests, prose, memory, coordinates, bounds, tool success, and scalar similarity cannot independently justify visual `PASS`.

## Authoring Efficiency Rule

Authoring Efficiency is evaluated only for an accepted result:

```text
QUALITY FAIL → no efficiency success claim
QUALITY PASS → compare justified vs unnecessary work → Cost to Accepted Result
```

Useful runtime observations include discovery calls, redundant readbacks, tool-search misses, placement batching, capture calls, correction outcomes, recovery, and same-cause retries. Unknown token/latency remains `UNVERIFIED` rather than estimated.

## Protected Gaps

```text
AnimationController blend-curve mutation
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animated-texture authoring
bone-binding expressions
```

## Current Boundary

Phase-context hardening has static/source proof only. **No claim is made that the current source produces a better/faster model or eliminates live Codex looping until an exact-current authoring run is explicitly performed and inspected.**
