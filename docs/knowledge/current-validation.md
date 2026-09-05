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

Previous Gateway checks established envelope `80 × 80 × 96`, first with 27 Cubes and later with a clean rebuild of 23 Cubes, plus no positive-volume Cube overlap. Those checks are technical evidence only.

User review now reopens Geometry before Texturing: the live clean rebuild visibly contains holes/gaps. The previous UV/material attempt is also invalid and remains paused. The current rebuild has 23 Cubes, 4 Groups, exact bounds `80 × 80 × 96`, and three left-glass Cubes, but those facts do not prove continuous surfaces.

### Incident diagnosis

The front shell was authored as isolated side wall, jamb, beam, and door pieces without a coverage invariant for the front plane. Exact live state showed:

- `LeftLowerWall x=-40..-36` and `FrontLeftJamb x=-28..-24`, leaving an `8`-unit front gap between them.
- `FrontLeftJamb` ends at `x=-24` and `DoorLeft` starts at `x=-20`, leaving a `4`-unit door-transition gap.
- The mirrored right-side relationship has the same defect.
- Left glass spans `z=-40..-28`, `-27..-14`, and `-13..0`, leaving two `1`-unit gaps.

The root failure is process-level: reference evidence and numeric envelope were present, but no semantic surface map, required-continuity invariant, or fresh whole-form visual gate was applied before Geometry was considered complete. `manage_cubes` success, bounds, hierarchy, and positive-volume overlap checks cannot detect this class of visual hole.

Separately, the first native texture-template attempt returned a `16×16` texture with `162` enabled faces and `0` valid UV faces. The native generator had no selected model elements because the tool did not reproduce the UI's selection step. This was a tool integration defect, not a reason to paint or manually guess UVs. The source fix now selects the outliner model automatically and rejects a returned template unless the UV audit is valid; it still requires a fresh runtime reload and live proof.

The continuity/state failure is also documented: the asset README previously described Geometry as user-approved and UV as clean while the live visual result was not accepted. Visual user evidence supersedes those stale technical claims; both gates are reopened.

Do not start Animation. First repair observed geometry/cohort defects, then re-author affected UV layout with face proportion, texel density, orientation, padding/seams, and semantic exact-reuse checks, then Texture Verify against canonical views.
