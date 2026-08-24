# Validation Report

Updated: 2026-08-24 — cleanup reconciliation

This file owns the **proof boundary**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts belong in `CONTEXT.md`.

## Current Evidence Summary

```text
DEFAULT MCP SURFACE:              64 enabled tools
LAST OBSERVED CANONICAL GREEN:    d8c0899 (64-tool source)
ACCEPTED LIVE BASELINE:           2026-08-12 Blockbench 5.1.6
LOCAL TEST 1 MECHANICS:           executed 2026-08-24 on pre-cleanup artifacts
CURRENT CLEANUP LIVE VISUAL PROOF: NOT CLAIMED
CURRENT MODEL-QUALITY CLAIM:       LOCAL PROOF REQUIRED
```

Do not infer live Blockbench behavior, visual fidelity, playback, persistence, installed-plugin freshness, or actual call-efficiency from source/CI unless that exact surface ran.

## Static / Source State

Current retained source includes:

- 64-tool default Bedrock Entity surface;
- coherent Cube placement batching;
- coherent Group creation batching;
- project logical UV resolution `128` default / `256` opt-in;
- texture/Painter/PBR/material-instance authoring;
- source repair for the previously reproduced `flatten_layers` base-bitmap loss;
- Bedrock animation and bounded AnimationController mutation;
- Locator/Null Object lifecycle;
- Undo/history, `.bbmodel`, and Bedrock geometry export;
- loopback-only request-owned/stateless MCP transport;
- `risky_eval` and `from_geo_json` disabled.

The 2026-08-24 cleanup removes repository/policy/workspace drift without claiming a new live modelling result.

## Canonical Static Proof History

Commit `d8c0899` was observed green on the canonical 64-tool verification surface, including typecheck, contract tests, surface measurement, build, and generated-doc freshness.

Subsequent source hardening added geometry/texturing fixes. Those changes remain source/static evidence unless a matching later CI or local runtime result is explicitly observed. GitHub CI status is transient external state; do not duplicate stale run-status prose across README/CONTEXT/continuation files.

## Local Runtime History

### Accepted baseline — 2026-08-12

Representative live coverage included loopback/stateless transport, then-current default tool surface, geometry/correction/Undo, texture/Painter/PBR/material instances, animation basics, Locator/Null Object lifecycle, `.bbmodel` persistence, and Bedrock geometry export.

This is historical live evidence, not automatic proof of later source revisions.

### TEST 1 — 2026-08-24

A local mechanics pass verified representative project/group/cube creation, rotated Cube handling, causal correction, Undo/redo rejection behavior, Painter bounds, PBR/material instances, Molang preservation, controller batching, Locator/Null Object behavior, persistence/export, and selected lifecycle checks on the artifacts used in that run.

One texture-canvas sizing defect was fixed and rerun-verified during that pass.

The `flatten_layers` pixel-loss defect was reproduced live before the later source repair. The repair is retained in current source, but **live closure on the exact current cleanup artifact is not claimed here**.

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

`bun run measure:surface` owns exact current serialized values. Character counts are regression ceilings, not installed-client token measurements.

## Visual / Reference Proof Rule

Reference-driven approval requires:

```text
actual approved reference image
+ fresh current-revision model image(s)
+ difference-first comparison
```

Paths, filenames, manifests, prose, memory, coordinates, bounds, tool success, and similarity scores cannot independently justify visual `PASS`.

## Protected Gaps

```text
AnimationController blend-curve mutation
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animated-texture authoring
bone-binding expressions
```

## Current Boundary

The repository is cleaned and current source is coherent at the source/policy level. **No live model-quality improvement is claimed for the exact cleanup HEAD.** If that claim becomes necessary, follow the bounded current-artifact local test described in `docs/knowledge/next-action.md`.
