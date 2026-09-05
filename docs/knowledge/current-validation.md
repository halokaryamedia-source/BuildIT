# Current Validation

Updated: 2026-09-06

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`.

## Current Proof Boundary

```text
BEDROCK RUNTIME CALLABLE CATALOG:      51 tools across retained families
SHARED AUTHORING SURFACE:              SOURCE UPDATED — Geometry/Texturing startup stages share one surface
ANIMATION SURFACE:                     separate runtime surface
GATEWAY CLIENT SURFACE:                4 fixed tools — SOURCE/STATIC
AUTHORING TAXONOMY:                    user-selected DIRECT | 3D_ASSISTED — SOURCE/STATIC
MCP RESOURCE/PROMPT CONTRACT:          AUDITED / LOCAL_CODE UPDATE REQUIRED
DIRECT AUTHORING:                      SOURCE_READY / LOCAL LIVE PROOF REQUIRED
3D_ASSISTED EXTERNAL ORCHESTRATOR:     SOURCE_READY / LOCAL GPU PROOF REQUIRED
3D_ASSISTED MATERIALIZER ENGINE:       SOURCE_READY / PUBLIC TOOL BINDING PENDING LOCAL_CODE
GATEWAY LIVE STABILITY:                PENDING — local Codex + Blockbench required
REMOTE MCP VERIFY:                     GREEN @ 6e44fef / LOCAL verify:full REQUIRED
CURRENT MODEL-QUALITY CLAIM:           NONE
```

Geometry and Texturing keep separate semantic ownership, but their Runtime capabilities are no longer mutually hidden. Geometry↔Texturing correction stays in the same AUTHORING session. `HANDOFF_REQUIRED` is for AUTHORING↔Animation.

## Source / Static Proof

Current source owns:

- fixed four-tool Gateway and a shared Geometry+Texturing AUTHORING Runtime surface;
- explicit user-selected `DIRECT | 3D_ASSISTED` with no automatic fallback;
- semantic stage ownership while allowing bounded upstream Geometry/UV correction during Texturing without a phase bounce;
- one resumable external 3D-Assisted orchestrator using canonical Active Workspace paths;
- pinned Hunyuan3D v1 and PrimitiveAnything provenance, strict state/decomposition schemas, SHA-256 stale detection, and explicit Shape/Decomposition gates;
- an internal Blockbench materializer engine that prevalidates canonical workspace state before one Group+Cube Undo transaction and cancels on failure.

The public Resource/Prompt/handoff closure remains intentionally deferred to `LOCAL_CODE` because canonical prompt and API changes require `prompts:build`, `docs:build`, and committed generated output. The materializer engine is likewise not yet registered as a public MCP ToolSpec.

## Static Verification State

Exact `Local` commit `6e44fefba7c8351f26dd81596036eb43d526016d` has a successful GitHub **MCP Verify** after stale prose assertions, duplicated verifier composition, and the noisy relative-latency test gate were corrected. **Repository Verify** was green on immediate parent `d81a643e4a38b4a4bc2d1750d394b545991972f3`; the final commit changed only the Runtime benchmark test owner. This is REMOTE_GITHUB evidence, not local execution or an exact `verify:full` run.

Before Local acceptance, the receiving `LOCAL_CODE` context must run `bun run verify:full` on its exact clean checkout. Static/CI success still cannot prove live Blockbench behavior or visual fidelity.

## What Is Not Yet Proven

Static source/CI does not prove:

- installed shared AUTHORING `tools/list` until local deploy;
- Gateway survival across Blockbench/plugin lifecycle changes;
- final geometry surface/gap quality or semantic-cohort correctness;
- final UV layout quality, texel density, orientation, seams, or mapped styling;
- Hunyuan Shape GLB quality on a selected asset;
- PrimitiveAnything decomposition quality on a selected asset;
- public Resource/Prompt/materializer binding until LOCAL_CODE regenerates exact outputs;
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

## Active Asset Proof

No active asset project exists under `workspace/active/`. Historical Industrial Elevator evidence is not current active-asset proof and must not be resumed automatically.

## Current Local Gate

```text
exact Local
→ verify:full
→ deploy exact plugin
→ prove shared AUTHORING + AUTHORING↔Animation Gateway lifecycle
→ DIRECT smoke: Geometry APPROVED → UV Layout PASS → Texture APPROVED → Finalization
→ external 3D_ASSISTED GPU proof
→ public materializer binding + generated docs
→ live atomic materializer proof
→ end-to-end 3D_ASSISTED
```
