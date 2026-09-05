# Current Validation

Updated: 2026-09-05

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`.

## Current Proof Boundary

```text
BEDROCK RUNTIME CALLABLE CATALOG:      51 tools across phases
NATIVE GEOMETRY EXPOSURE:              25 tools
NATIVE TEXTURING EXPOSURE:             35 tools
NATIVE ANIMATION EXPOSURE:             19 tools
GATEWAY CLIENT SURFACE:                 4 fixed tools — SOURCE/STATIC
AUTHORING TAXONOMY:                     user-selected DIRECT | 3D_ASSISTED — SOURCE/STATIC
DIRECT AUTHORING:                       SOURCE_READY
3D_ASSISTED EXTERNAL ORCHESTRATOR:      SOURCE_READY / LOCAL GPU PROOF REQUIRED
3D_ASSISTED MATERIALIZER ENGINE:        SOURCE_READY / PUBLIC TOOL BINDING PENDING LOCAL_CODE
LEGACY UI FALLBACKS:                    debug/maintenance only
GATEWAY LIVE STABILITY:                 PENDING — local Codex + Blockbench required
CURRENT MODEL-QUALITY CLAIM:            NONE
```

The retired user-facing `optional 3D Evidence` model does not return. `manage_geometry_reference` is supporting comparison inside `3D_ASSISTED`, not a peer route or production geometry.

## Source / Static Proof

Current source owns:

- fixed four-tool Gateway and phase-filtered Runtime surfaces;
- explicit user-selected `DIRECT | 3D_ASSISTED` with no automatic fallback;
- approval/checkpoint-aware forward handoff;
- one resumable external 3D-Assisted orchestrator using canonical Active Workspace paths;
- pinned Hunyuan3D v1 and PrimitiveAnything provenance, strict state/decomposition schemas, SHA-256 stale detection, and explicit Shape/Decomposition gates;
- an internal Blockbench materializer engine that prevalidates canonical workspace state before one Group+Cube Undo transaction and cancels the edit on failure.

The materializer engine is intentionally **not yet registered as a public MCP ToolSpec** in REMOTE_GITHUB because that change requires canonical generated API docs. Binding + `docs:build/docs:check` is the narrow LOCAL_CODE handoff.

## What Is Not Yet Proven

Static source/CI **cannot prove visual fidelity** or live installed behavior. It does not prove:

- Gateway survival across Blockbench/plugin lifecycle changes;
- installed plugin/build identity until local deploy;
- Hunyuan Shape GLB quality on the selected asset;
- PrimitiveAnything decomposition quality on the selected asset;
- public materializer binding/generated docs until LOCAL_CODE executes it;
- materializer native Undo/stale-state behavior inside desktop Blockbench;
- final DIRECT or 3D_ASSISTED visual quality.

## 3D-Assisted Proof Model

```text
Approved Reference + Requested Dimensions
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D v1 → Shape GLB Gate → shape.glb
→ PrimitiveAnything → Primitive Decomposition Gate
→ primitive-decomposition.json + state.json
→ atomic Cuboid Materialization
→ Cuboid Materialization Gate
→ Semantic Geometry Cleanup
→ final Geometry verification
```

Approved image remains visual authority; requested dimensions remain numeric authority. `shape.glb`, decomposition, and Cuboid scaffold are intermediate evidence/starting state only.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the actual approved reference image plus fresh evidence from the current model/revision. Tool success, source/CI success, hashes, coordinates, export, GLB/decomposition existence, or scalar scores cannot create visual PASS by themselves.

If evidence is unavailable, use `UNVERIFIED` or `LOCAL PROOF REQUIRED`.

## Authoring Efficiency

**Authoring Efficiency** means **Cost to Accepted Result**. Static Footprint/raw call count are guardrails only; quality must stay accepted while avoidable discovery, readback, retry, recovery, or correction cost decreases.

## Current Local Gate

```text
exact Local → verify:mcp → deploy exact plugin → Gateway lifecycle + DIRECT smoke
→ external 3D_ASSISTED GPU proof
→ bind materializer ToolSpec + docs:build/docs:check + verify:mcp
→ live atomic materializer proof → end-to-end 3D_ASSISTED
```

## Industrial Elevator External Handoff

The latest live asset state is intentionally **not visually accepted**. The approved reference and editable checkpoint are kept at:

- `workspace/active/industrial-elevator/references/approved-reference.png`
- `workspace/active/industrial-elevator/industrial-elevator.bbmodel`
- `workspace/active/industrial-elevator/industrial-elevator-atlas-v2.png`

Verified on 2026-09-05 through the BlockIT Gateway: model envelope `80 × 80 × 96`, 27 rendered Cubes, no positive-volume Cube overlaps, UV coordinates in bounds, no fractional/degenerate UVs, no partial-overlap UV gate failure, and explicit UV locking on the added control-panel frame pieces. These are structural/technical checks only; they do not constitute visual reference acceptance.

User-reported remaining visual defects: texture and UV placements still do not match the approved elevator reference, the atlas arrangement is not yet accepted as clean, and previous editor views appeared broken. Continue outside Codex from the saved `.bbmodel`; do not begin animation until the user accepts front, 3/4, side, back, top, and bottom texture views.

Detailed procedure lives in `docs/knowledge/operations/local-acceptance-runbook.md`.
