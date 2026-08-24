# Validation Report

Updated: 2026-08-25 — baseline-driven UV / authoring-convergence hardening

This file owns the **proof boundary**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts belong in `CONTEXT.md`.

## Current Evidence Summary

```text
DEFAULT MCP SURFACE:                    64 enabled tools
LAST OBSERVED CANONICAL GREEN:          d8c0899 (64-tool source)
ACCEPTED LIVE BASELINE:                 2026-08-12 Blockbench 5.1.6
LOCAL TEST 1 MECHANICS:                 executed 2026-08-24 on pre-cleanup artifacts
LATEST USER AUTHORING BASELINE:         QUALITY FAIL reported 2026-08-25
CURRENT UV/CONVERGENCE SOURCE HARDENING: APPLIED
CURRENT HARDENING LIVE RETEST:          DEFERRED BY USER
CURRENT MODEL-QUALITY CLAIM:             LOCAL PROOF REQUIRED
```

Do not infer live Blockbench behavior, visual fidelity, persistence, installed-plugin freshness, or actual Authoring Efficiency from source/CI unless that exact surface ran.

## 2026-08-25 User Baseline Failure

The user supplied a Blockbench screenshot from the latest authoring attempt and reported:

- UV/texturing remained poor and visually flat, dominated by fill-color regions without sufficient form/value/detail treatment;
- geometry and texturing took too long for a simple rigid model and appeared to involve excessive guessing/repetition.

This is sufficient evidence to classify the previous authoring result as a **QUALITY FAIL** and to justify targeted source hardening. The exact plugin artifact hash and complete call trace for that failed session were not recorded here, so it is **not** a quantitative before/after efficiency benchmark.

Historical pre-cleanup model data also showed manually authored Box-UV offsets and deeply nested rigid-part Groups. That historical artifact is supporting diagnostic evidence only and does not define fixture-specific policy.

## Current Static / Source State

Current retained source includes:

- 64-tool default Bedrock Entity surface;
- coherent Cube and Group batching;
- deterministic non-overlapping Box-UV offset packing for new `place_cube` Box-UV geometry;
- returned per-Cube `box_uv_region` continuation state;
- project logical UV resolution `128` default / `256` opt-in;
- texture/Painter/PBR/material-instance authoring;
- source repair for the previously reproduced `flatten_layers` base-bitmap loss;
- Bedrock animation and bounded AnimationController mutation;
- Locator/Null Object lifecycle;
- Undo/history, `.bbmodel`, and Bedrock geometry export;
- loopback-only request-owned/stateless MCP transport;
- `risky_eval` and `from_geo_json` disabled.

Current modelling/texturing guidance additionally distinguishes a simple rigid fast path from complex reference analysis and routes production texture work beyond flat fill into existing material/value/form/identity Painter operations.

## Box-UV Source Contract

For new Box-UV Cube creation:

```text
known existing Box-UV occupancy
+ incoming Cube footprints
→ deterministic non-overlap packing
→ place Cube with planned uv_offset
→ keep autouv active while geometry can still change
→ return box_uv_region with authored state
```

Production paint still requires the final UV gate. After geometry `PASS`, the intended flow is one coherent `modify_cubes_batch` lock to `autouv=0`, followed by production painting. Geometry changes can alter UV footprint, so the final `list_textures` audit remains authoritative for overlap/bounds review before paint.

## Canonical Static Proof History

Commit `d8c0899` was observed green on the canonical 64-tool verification surface, including typecheck, contract tests, surface measurement, build, and generated-doc freshness.

Later source hardening remains source/static evidence unless a matching later CI or local runtime result is explicitly observed. GitHub CI status is transient external state; do not duplicate stale run-status prose across README/CONTEXT/continuation files.

## Local Runtime History

### Accepted baseline — 2026-08-12

Representative live coverage included loopback/stateless transport, then-current default tool surface, geometry/correction/Undo, texture/Painter/PBR/material instances, animation basics, Locator/Null Object lifecycle, `.bbmodel` persistence, and Bedrock geometry export.

This is historical live evidence, not automatic proof of later source revisions.

### TEST 1 — 2026-08-24

A local mechanics pass verified representative project/group/cube creation, rotated Cube handling, causal correction, Undo/redo rejection behavior, Painter bounds, PBR/material instances, Molang preservation, controller batching, Locator/Null Object behavior, persistence/export, and selected lifecycle checks on the artifacts used in that run.

One texture-canvas sizing defect was fixed and rerun-verified during that pass. The `flatten_layers` pixel-loss defect was reproduced live before its later source repair; exact-current live closure was not claimed.

## Surface Guard

```text
64 enabled tools
initialize instructions          <= 700 characters
tools/list response              <= 82,000 characters
input schemas                    <= 58,000 characters
descriptions                     <= 11,500 characters
max per-tool payload             <= 3,200 characters
runtime workflow prompt          < 7,000 characters
```

These are **Static Footprint** regression ceilings, not Authoring Efficiency metrics. `bun run measure:surface` owns exact current serialized values.

## Visual / Reference Proof Rule

Reference-driven approval requires:

```text
actual approved reference image
+ fresh current-revision model image(s)
+ difference-first comparison
```

Paths, filenames, manifests, prose, memory, coordinates, bounds, tool success, and low call count cannot independently justify visual `PASS`.

## Authoring Efficiency Rule

Authoring Efficiency is evaluated only for an accepted result:

```text
QUALITY FAIL → no efficiency success claim
QUALITY PASS → compare justified vs unnecessary work → Cost to Accepted Result
```

When a client exposes enough trace, useful observations include discovery calls, redundant readbacks, tool-search misses, placement batching, capture calls, correction outcomes, recovery, and same-cause retries. Unknown token/latency remains `UNVERIFIED` rather than estimated.

## Protected Gaps

```text
AnimationController blend-curve mutation
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animated-texture authoring
bone-binding expressions
```

## Current Boundary

The baseline failure is recorded and targeted source hardening is applied. **No claim is made that the new source produces a better or faster model until the user elects to run the exact hardened artifact and inspect the result.**
