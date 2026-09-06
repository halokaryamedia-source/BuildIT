# Current Validation

Updated: 2026-09-06

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`.

## Current Proof Boundary

```text
BEDROCK SOURCE CALLABLE CATALOG:       52 tools; last installed proof covers 51
SHARED AUTHORING SURFACE:              SOURCE 47; BASIC LIVE PASS covers earlier 46 tools
ANIMATION SURFACE:                     BASIC HANDOFF LIVE PASS — 19 tools
GATEWAY CLIENT SURFACE:                4 fixed tools — SOURCE + SAME-TASK LIVE
AUTHORING TAXONOMY:                    user-selected DIRECT | 3D_ASSISTED — SOURCE/STATIC
MCP RESOURCE/PROMPT CONTRACT:          UPDATED / GENERATORS + REGRESSIONS PASS
DIRECT AUTHORING:                      DISPOSABLE BASIC LIVE PASS / ASSET QUALITY UNVERIFIED
3D_ASSISTED EXTERNAL ORCHESTRATOR:     SOURCE_READY / ENVIRONMENT PREFLIGHT PASS / GPU NOT_RUN
3D_ASSISTED MATERIALIZER + BINDING:     SOURCE_READY / NATIVE LIVE PROOF DEFERRED
GATEWAY LIVE STABILITY:                BASIC PASS — reconnect after restart + phase catalog refresh
REMOTE MCP VERIFY:                     GREEN @ 071d0bb / SOURCE CI ONLY
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

Resource/Prompt/handoff closure is implemented with canonical `prompts:build` and `docs:build` output. Internal PASS remains READY_FOR_USER_REVIEW; Animation readiness requires explicit approval fields and a saved checkpoint. `materialize_3d_assisted_scaffold` is registered in source as a Geometry-owned Elements ToolSpec with only absolute `workspace_path`, behind the existing four-tool Gateway.

## 3D-Assisted Preparation — 2026-09-06

Based on Local `1013cd1f0a96dcaf3c2a326c7a95ae59ec98bd23`; this preparation does not deploy or replace the installed plugin.

- `bun run three-d-assisted:run -- preflight`: PASS. Both backend imports, pinned source, weights/data integrity and CUDA visibility checked; no inference or asset-state writes.
- Hunyuan: Windows Python 3.12 venv at `Experimental/three-d-assisted-hunyuan-poc/.cache/venv`, PyTorch `2.5.1+cu124`; pinned Hunyuan3D-2 source, MultiView model and u2net installed under sibling cache directories. MultiView config/weights match pinned Git/LFS identities; hashes are retained in `environment.py`.
- PrimitiveAnything: WSL2 Ubuntu, `/opt/miniforge3/envs/blockit-pa-poc`, PyTorch 2.1.0 CUDA; source/data/checkpoints under `Experimental/primitiveanything-poc/.cache/PrimitiveAnything`. Both checkpoint SHA-256 values match setup pins. Download cache moved outside the clean upstream checkout.
- RTX 3070 8 GB is visible in both backends. WSL's NAT warning did not prevent setup/download/preflight; no network configuration was changed. Peak inference memory remains unproven.
- Targeted source regressions pass for binding/receipt, rejection before Undo, controlled partial-failure cancellation, resume/invalidation, and missing dependencies before state initialization. These do not prove native Undo or actual asset quality.
- Canonical prompt/API outputs regenerated. Final `bun run verify:full`: PASS on this Local delivery (Bun 1.3.11): repository 32/32, runtime 396/396, authoring 117/117, generated freshness, typechecks, source surface measurements and build. Log: `mcp/.cache/three-d-assisted-verify-full.log`. New built identity: `sha256:8865d0c3fd65849e7957a512b53efe47563c3116782d3e863e11d98b794a6289`; not deployed. The earlier desktop closure below remains historical proof only.

Stop at preparation. GPU inference, deployment, native materializer Undo/stale-state proof and asset approval are user-deferred. Commands and environment paths are owned by `mcp/scripts/three-d-assisted/README.md`.

## Local Source and Desktop Closure — 2026-09-06

Repository: `halokaryamedia-source/BuildIT`, branch `Local`, delivery based on `88331a96973c8c36849f8b15b689ab9a1ed0439a`. Bun **1.3.11**, installed Blockbench **5.1.6**. This section describes the local delivery, not the older remote CI SHA below.

- Frozen-lockfile install, canonical generators, Geometry/UV regressions, and final `bun run verify:full`: PASS. Tests cover async template completion/error/cancellation/audit rollback, retained redo history, meaningful collapsed UV, complete discovery schemas, approval requirements, and native numeric-slider mutation.
- No user project was open before cleanup. No old checkout build/dependency/cache directories existed initially. Removed only legacy `mcp.js`, `mcp.about.md`, `mcp.icon.svg` from the verified Blockbench plugin directory; no legacy registry entry was loaded. Other plugins/settings/assets/credentials were retained.
- Canonical installed path: `C:/Users/Administrator/AppData/Roaming/Blockbench/plugins/blockit_mcp.js`; its registration was aligned from checkout `dist` to this path. Deployment byte comparison and runtime `build_identity` match: `sha256:ed62edfdf0e0674fc4808b9f84d30253608f2b1f1e1922e7e3457a454977046c`.
- `bun run verify:stateless-local`: **12/12 PASS**. Gateway survives Blockbench restart in the same task and refreshes its catalog; final AUTHORING catalog is 46 tools. Texturing focus retained Geometry capabilities with `surface_changed=false`; Animation exposed 19 tools and returned to Geometry without a new task. Missing Animation readiness was rejected. Positive handoff used clearly labeled synthetic disposable-test readiness, never asset approval.
- `bun run scripts/verify-template-live.ts --confirm-disposable`: PASS. Native density 32 gives 2 bitmap pixels/UV unit; rebuild density 16 gives 1. Brush sizes 1/2 change exactly 1/4 decoded pixels. Brush and rebuild Undo/Redo restore full atlas hashes; rebuild retains UUID and one atlas. Editable disposable checkpoint export was verified. Python/Pillow was used only for decoded-pixel comparison.
- `bun run verify:surface-gap-live -- --confirm-disposable`: PASS. Open 0.5-unit gap warns; contact or complete coverage clears warning; hidden cover restores warning.

Cancellation/error restoration has local controlled regression proof; live successful template/rebuild/brush Undo has native desktop proof. Interactive cancellation, long-running lifecycle endurance, real-asset persistence/visual quality and 3D-assisted execution are not claimed. Disposable fixtures under `mcp/.cache/template-live/` are development artifacts, not Active Workspace assets.

## Static Verification State

GitHub **MCP Verify** run `33992971202` completed successfully for exact `Local` commit `071d0bb41c8103f8a58fafc16bd0440788b66f47` and executed `bun run verify:mcp`. This is REMOTE_GITHUB source/build/generated-freshness evidence, not local execution or installed-plugin proof. This record does not establish a completed exact `verify:full` or a same-SHA full composite.

Device-independent acceptance follows `GITHUB_RULES.md`: accept an exact successful full source gate from CI or a capable development workspace; do not mandate a duplicate local `verify:full`. The gate may use `verify:repository` + `verify:mcp` on the same exact `Local` SHA, reported as composite source evidence. Static/CI success still cannot prove live Blockbench behavior or visual fidelity.

## What Is Not Yet Proven

Static source/CI does not prove:

- long-running Gateway lifecycle endurance beyond the tested restart/handoffs;
- final geometry surface/gap quality or semantic-cohort correctness;
- final UV layout quality, texel density, orientation, seams, or mapped styling;
- Hunyuan Shape GLB quality on a selected asset;
- PrimitiveAnything decomposition quality on a selected asset;
- installed availability of the new source-registered materializer binding;
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
→ accepted exact full source gate (CI or capable workspace; see GITHUB_RULES.md)
→ deploy exact plugin
→ prove shared AUTHORING + AUTHORING↔Animation Gateway lifecycle
→ DIRECT smoke: Geometry APPROVED → UV Layout PASS → Texture APPROVED → Finalization
→ 3D_ASSISTED setup + public binding + generated/source checks
→ STOP ready-to-test while user defers GPU/live work
→ later external 3D_ASSISTED GPU proof
→ deploy matching materializer binding
→ live atomic materializer proof
→ end-to-end 3D_ASSISTED
```
