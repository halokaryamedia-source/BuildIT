# Current Validation

Updated: 2026-09-05

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`.

## Current Proof Boundary

```text
BEDROCK RUNTIME CALLABLE CATALOG: 51 tools across phases
NATIVE GEOMETRY EXPOSURE:        25 tools
NATIVE TEXTURING EXPOSURE:       35 tools
NATIVE ANIMATION EXPOSURE:       19 tools
GATEWAY CLIENT SURFACE:           4 fixed tools — SOURCE/STATIC
AUTHORING TAXONOMY:               user-selected DIRECT | 3D_ASSISTED — SOURCE/STATIC
DIRECT AUTHORING:                 SOURCE_READY
3D_ASSISTED TARGET PIPELINE:      DESIGN_LOCKED / IMPLEMENTATION PENDING
LEGACY UI FALLBACKS:              debug/maintenance only
GATEWAY LIVE STABILITY:           PENDING — local Codex + Blockbench required
CURRENT MODEL-QUALITY CLAIM:      NONE
```

The previous user-facing `optional 3D Evidence` model is retired. `manage_geometry_reference` may still be used as a supporting Geometry capability inside `3D_ASSISTED`, but it is not a user-facing route or strategy.

## What Source / Static Proof Establishes

Current source/static contracts prove fixed Gateway surface, phase-filtered Runtime surfaces, explicit user-selected `DIRECT | 3D_ASSISTED`, approval/checkpoint-aware forward handoff, backend-only catalog invalidation, no blind mutation retry, Legacy UI fallback isolation, and the split between external 3D orchestration and Runtime materialization.

## What Is Not Yet Proven

Static source/CI **cannot prove visual fidelity** or live installed behavior. It does not prove:

- Gateway survival across Blockbench/plugin lifecycle changes;
- current locally installed plugin identity until built/deployed;
- acceptable Hunyuan `shape.glb` quality;
- acceptable PrimitiveAnything decomposition;
- dedicated scaffold materializer existence/atomic behavior;
- materializer Undo/stale-state rejection;
- final DIRECT or 3D_ASSISTED visual quality.

These are local/live proof tasks.

## 3D-Assisted Proof Model

```text
Approved Reference + Requested Dimensions
→ deterministic LEFT/FRONT/BACK extraction
→ Shape Reconstruction / Hunyuan3D v1
→ Shape GLB Gate → shape.glb
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ primitive-decomposition.json + state.json
→ dedicated atomic Cuboid Materialization
→ Semantic Geometry Cleanup
→ final Geometry verification
```

Authority:

```text
approved image       = visual authority
requested dimensions = numeric authority
shape.glb            = intermediate reconstructed shape
PrimitiveAnything    = intermediate decomposition
Cuboid Scaffold      = temporary editable starting hypothesis
```

Neither `shape.glb` nor PrimitiveAnything output may silently become final production geometry. Shape GLB may remain locked/non-export during semantic cleanup as supporting comparison evidence, then must be removed before final Geometry review/export.

## Routing Effectiveness

Phase-scoped discovery remains deliberate. Prior static discovery evidence favored keeping Geometry/Texturing/Animation separation; capability tiering is routing priority, not proof of better authoring by itself.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the actual approved reference image plus fresh evidence from the current model/revision for material views being judged. Tool success, source/CI success, valid coordinates/hierarchy/export, GLB/decomposition existence, or scalar scores cannot create visual PASS by themselves.

If required evidence is unavailable, use `UNVERIFIED` or `LOCAL PROOF REQUIRED`, not inferred success.

## Authoring Efficiency

**Authoring Efficiency** means **Cost to Accepted Result**. Static Footprint and raw call count are guardrails only. Quality must remain accepted while avoidable discovery, readback, retry, recovery, or correction cost decreases.

## Current Local Gate

```text
exact Local checkout → verify:mcp → deploy exact plugin
→ configure Codex through Gateway
→ Gateway lifecycle proof → small DIRECT smoke
→ external 3D-Assisted orchestrator/proof
→ atomic materializer/proof
→ end-to-end 3D_ASSISTED
```

Detailed execution lives in `docs/knowledge/operations/local-acceptance-runbook.md`.
