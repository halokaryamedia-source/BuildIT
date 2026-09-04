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

Current source/static contracts prove:

- Gateway client surface remains exactly four tools;
- Runtime surfaces remain phase-filtered;
- Geometry Strategy is explicit and user-selected: `DIRECT | 3D_ASSISTED`;
- Codex must not infer/default/auto-switch Geometry Strategy;
- normal forward phase handoff waits for user approval + checkpoint;
- Gateway invalidates only backend catalog/client after phase handoff;
- no blind automatic mutation retry occurs after transport interruption;
- internal `extended` compatibility does not create a second authoring profile;
- `risky_eval` and `from_geo_json` remain disabled;
- 3D-Assisted target ownership is split between external local orchestration and Geometry Runtime materialization.

## What Is Not Yet Proven

Static source/CI does **not** prove:

- Codex-facing Gateway survives Blockbench plugin reload, close/open, or Runtime rebuild;
- installed local plugin matches current source until locally built/deployed and identified;
- Hunyuan3D produces an acceptable current `shape.glb` for the selected fixture;
- PrimitiveAnything produces an acceptable current decomposition;
- the target dedicated scaffold materializer exists or behaves atomically;
- Undo/stale-state rejection for the future materializer;
- final DIRECT or 3D_ASSISTED visual fidelity.

These are local/live proof tasks.

## 3D-Assisted Proof Model

Canonical target:

```text
Approved Reference
+ Requested Dimensions
→ deterministic LEFT/FRONT/BACK extraction
→ Shape Reconstruction / Hunyuan3D v1
→ Shape GLB Gate
→ shape.glb
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

Phase-scoped discovery remains deliberate. Prior static discovery evidence materially favored keeping Geometry/Texturing/Animation separation, so cleanup does not reduce the Runtime catalog merely for a smaller number.

Capability tiering is a routing optimization, not proof of better authoring by itself.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the actual approved reference image plus fresh evidence from the current model/revision for material views being judged.

Tool success, source/CI success, valid coordinates/hierarchy/export, GLB/decomposition existence, or scalar similarity scores cannot create visual PASS by themselves.

If required evidence is unavailable, use `UNVERIFIED` or `LOCAL PROOF REQUIRED`, not inferred success.

## Authoring Efficiency

**Authoring Efficiency** means **Cost to Accepted Result**. Static footprint and raw call count are guardrails only. Quality must remain accepted while avoidable discovery, readback, retry, recovery, or correction cost decreases.

## Current Local Gate

Local/Codex handoff is now the next proof boundary. Sequence is owned by `next-action.md` and `operations/local-acceptance-runbook.md`:

```text
exact Local checkout
→ verify:mcp
→ deploy exact plugin
→ configure Codex through Gateway
→ Gateway lifecycle proof
→ small DIRECT smoke
→ implement/prove 3D-Assisted external orchestrator
→ implement/prove atomic materializer
→ end-to-end 3D_ASSISTED
```
