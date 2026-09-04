# Current Validation

Updated: 2026-09-04

This file owns **current proof interpretation**. Active continuation belongs in `docs/knowledge/next-action.md`; stable product facts belong in `CONTEXT.md`; exact source/test ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Proof Boundary

```text
BEDROCK RUNTIME CALLABLE CATALOG: 51 tools across phases
NATIVE GEOMETRY EXPOSURE:        25 tools
NATIVE TEXTURING EXPOSURE:       35 tools
NATIVE ANIMATION EXPOSURE:       19 tools
GATEWAY CLIENT SURFACE:          4 fixed tools — SOURCE/STATIC
AUTHORING TAXONOMY:              one Reference-Grounded flow — SOURCE/STATIC
OPTIONAL 3D EVIDENCE:            Geometry-only / experimental
LEGACY UI FALLBACKS:             debug/maintenance only
GATEWAY LIVE STABILITY:          PENDING — local Codex + Blockbench required
ACCEPTED LIVE BASELINE:          2026-08-12 Blockbench 5.1.6
CURRENT MODEL-QUALITY CLAIM:     NONE
```

Current source/static contracts prove that normal authoring no longer requires a user-facing Image-vs-3D route choice or Standard-vs-Extended authoring profile choice. The canonical model is approved image + optional 3D Evidence → Geometry → Texturing → optional Animation.

They also prove:

- fixed four-tool Gateway client surface;
- phase-filtered Runtime capability surfaces;
- Gateway backend catalog invalidation after phase handoff;
- no blind automatic mutation retry after transport interruption;
- capability-priority metadata that de-prioritizes maintenance fallbacks without deleting capability;
- `manage_geometry_reference` remains optional experimental Geometry evidence;
- internal `extended` compatibility does not redefine the normal authoring flow;
- `risky_eval` and `from_geo_json` remain disabled.

These source/static contracts do **not** prove the real Codex-facing Gateway survives repeated Blockbench plugin reload, application close/open, backend rebuild, or phase-switch cycles. That remains the next live gate.

## Routing Effectiveness Interpretation

Existing phase-scoped discovery evidence materially favors keeping Geometry/Texturing/Animation separation: the static Codex-like discovery proxy previously improved from roughly 60% top-1 on the unscoped catalog to above 90% top-1 with phase-scoped routing, while top-3 recall reached 100%.

Therefore current cleanup does **not** optimize by reducing the 51-tool Runtime catalog. It reduces conceptual state and adds Gateway capability priority. Texturing consolidation remains evidence-gated: only repeated accepted-result overhead should justify removing/merging capability.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the **actual approved reference image** plus fresh evidence from the current model/revision for the material views being judged.

```text
approved image       = visual authority
requested dimensions = numeric authority
optional 3D Evidence = supporting depth/volume/attachment evidence
raw GLB bounds       = observation only
```

Optional 3D Evidence cannot replace the approved image, cannot define target size, and cannot become production geometry.

The following cannot create visual `PASS` by themselves:

- successful MCP/tool execution;
- static source or CI success;
- valid coordinates/hierarchy/export;
- optional 3D Evidence or raw GLB bounds;
- a scalar similarity score;
- a saved artifact whose visual result was not inspected.

Front-view agreement does not prove hidden depth or full 3D fidelity. If required evidence is unavailable, use `UNVERIFIED` or `LOCAL PROOF REQUIRED`, not inferred success.

## Authoring Efficiency

**Static Footprint** and raw call count are guardrails, not Authoring Efficiency proof.

Authoring Efficiency means **Cost to Accepted Result**: the justified work needed to reach accepted quality, including avoidable discovery, readback, retries, recovery, and correction. A smaller prompt, Skill, schema, or tool surface is not improvement if quality regresses or work simply moves elsewhere.

Capability tiering is therefore a routing optimization, not proof of better authoring by itself. Live acceptance must compare actual task completion quality and cost.

## Evidence Limits

Static source/CI evidence can prove schemas, routing, deterministic generated output, buildability, phase ownership, Gateway contract invariants, and fail-closed source behavior.

It **cannot prove visual fidelity**, installed-plugin freshness, live Gateway survival, Blockbench Undo/playback/persistence, or model-quality improvement unless those surfaces actually ran.

Current live proof for optional 3D Evidence remains bounded to previously observed Reference Model loading; final Gateway + optional-evidence authoring remains pending the explicit local gate in `next-action.md`.
