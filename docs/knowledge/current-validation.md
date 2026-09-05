# Current Validation

Updated: 2026-09-05

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`.

## Current Proof Boundary

```text
BEDROCK RUNTIME CALLABLE CATALOG:      51 tools across retained families
SHARED AUTHORING SURFACE:              SOURCE UPDATED — Geometry/Texturing startup stages share one surface
ANIMATION SURFACE:                     separate runtime surface
GATEWAY CLIENT SURFACE:                4 fixed tools — SOURCE/STATIC
AUTHORING TAXONOMY:                    user-selected DIRECT | 3D_ASSISTED — SOURCE/STATIC
DIRECT AUTHORING:                       SOURCE_READY / LOCAL LIVE PROOF REQUIRED
3D_ASSISTED EXTERNAL ORCHESTRATOR:      SOURCE_READY / LOCAL GPU PROOF REQUIRED
3D_ASSISTED MATERIALIZER ENGINE:        SOURCE_READY / PUBLIC TOOL BINDING PENDING LOCAL_CODE
LEGACY UI FALLBACKS:                    debug/maintenance only
GATEWAY LIVE STABILITY:                 PENDING — local Codex + Blockbench required
CURRENT MODEL-QUALITY CLAIM:            NONE
```

Geometry and Texturing keep separate semantic ownership, but their Runtime capabilities are no longer mutually hidden. Geometry↔Texturing correction should stay in the same AUTHORING session. `HANDOFF_REQUIRED` is for AUTHORING↔Animation.

## Source / Static Proof

Current source owns:

- fixed four-tool Gateway and a shared Geometry+Texturing AUTHORING Runtime surface;
- explicit user-selected `DIRECT | 3D_ASSISTED` with no automatic fallback;
- semantic stage ownership while allowing bounded upstream Geometry/UV correction during Texturing without a phase bounce;
- approval/checkpoint-aware Animation handoff;
- one resumable external 3D-Assisted orchestrator using canonical Active Workspace paths;
- pinned Hunyuan3D v1 and PrimitiveAnything provenance, strict state/decomposition schemas, SHA-256 stale detection, and explicit Shape/Decomposition gates;
- an internal Blockbench materializer engine that prevalidates canonical workspace state before one Group+Cube Undo transaction and cancels the edit on failure.

The materializer engine is intentionally **not yet registered as a public MCP ToolSpec** in REMOTE_GITHUB because that change requires canonical generated API docs. Binding + `docs:build/docs:check` is the narrow LOCAL_CODE handoff.

## What Is Not Yet Proven

Static source/CI **cannot prove visual fidelity** or live installed behavior. It does not prove:

- installed shared AUTHORING `tools/list` until local deploy;
- Gateway survival across Blockbench/plugin lifecycle changes;
- final geometry surface/gap quality or semantic-cohort correctness;
- final UV layout quality, texel density, orientation, seams, or mapped styling;
- Hunyuan Shape GLB quality on the selected asset;
- PrimitiveAnything decomposition quality on the selected asset;
- public materializer binding/generated docs until LOCAL_CODE executes it;
- materializer native Undo/stale-state behavior inside desktop Blockbench.

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

A visual/reference `PASS` requires the actual approved reference image plus fresh evidence from the current model/revision. Tool success, source/CI success, hashes, coordinates, export, GLB/decomposition existence, scalar scores, or a clean positive-volume overlap audit cannot create visual PASS by themselves.

If evidence is unavailable, use `UNVERIFIED` or `LOCAL PROOF REQUIRED`.

## Authoring Efficiency

**Authoring Efficiency** means **Cost to Accepted Result**. Static Footprint/raw call count are guardrails only; quality must stay accepted while avoidable discovery, readback, phase bouncing, retry, recovery, or correction cost decreases.

## Current Local Gate

```text
exact Local → verify:mcp → deploy exact plugin
→ prove shared AUTHORING surface + AUTHORING↔Animation Gateway lifecycle
→ DIRECT surface/cohort + UV-quality smoke
→ external 3D_ASSISTED GPU proof
→ bind materializer ToolSpec + docs:build/docs:check + verify:mcp
→ live atomic materializer proof → end-to-end 3D_ASSISTED
```

## Industrial Elevator Reopened Gate

The latest `.bbmodel` remains an editable baseline, **not visually accepted**:

- `workspace/active/industrial-elevator/references/approved-reference.png`
- `workspace/active/industrial-elevator/industrial-elevator.bbmodel`
- `workspace/active/industrial-elevator/industrial-elevator-atlas-v2.png`

Previous Gateway checks established envelope `80 × 80 × 96`, 27 rendered Cubes, no positive-volume Cube overlap, in-bounds UV coordinates, and no partial-overlap UV gate failure. Those checks are technical evidence only.

User review now reopens both upstream gates: visible geometry still appears to contain gap/z-fighting problems, and UV/material mapping remains disorganized. The current model also contains a split `ControlPanel` cohort: body/top/mid controls occupy the opposite X side from low/emergency controls, so the assembly must be reviewed as one semantic relationship rather than as independent successful Cube mutations.

Do not start Animation. First repair observed geometry/cohort defects, then re-author affected UV layout with face proportion, texel density, orientation, padding/seams, and semantic exact-reuse checks, then Texture Verify against canonical views.
