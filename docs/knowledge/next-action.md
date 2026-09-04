# Next Action

Updated: 2026-09-05 — local/Codex handoff activated

Working branch: **`Local` only**. Continuation only; facts → `CONTEXT.md`, proof → `current-validation.md`, ownership → `implementation-map.md`.

## Current Status

```text
BLOCKIT GATEWAY: SOURCE_READY / LIVE PROOF NEXT
AUTHORING TAXONOMY: DESIGN_LOCKED — user-selected DIRECT | 3D_ASSISTED
DIRECT AUTHORING: SOURCE_READY / LOCAL SMOKE NEXT
3D_ASSISTED TARGET PIPELINE: DESIGN_LOCKED / IMPLEMENTATION PENDING
REFERENCE GENERATION: CHATGPT
STAGE APPROVAL: USER IN LIVE BLOCKBENCH
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
LOCAL/CODEX HANDOFF: READY FOR DEVELOPMENT BASELINE
```

Canonical flow:

```text
ChatGPT reference → Active Workspace + Requirement Gate
→ user selects DIRECT | 3D_ASSISTED
→ create Blockbench project
→ Geometry → approve/checkpoint
→ Texturing → approve/checkpoint
→ Animation when required → approve/checkpoint
→ Finalization → final save
```

## Next Step 1 — Establish Local/Codex Baseline

Do this before 3D-Assisted implementation so Gateway/runtime/environment defects are isolated first.

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD

cd mcp
bun install --frozen-lockfile
bun run verify:mcp
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

Then configure Codex to use `mcp/gateway/index.ts` through the four-tool stdio Gateway. Do not point Codex directly at the Runtime endpoint.

Required continuous-session proof:

```text
Blockbench closed → Gateway status Runtime offline
→ open Blockbench → same Codex task Runtime online
→ search/describe/invoke one safe Geometry capability
→ switch Geometry → Texturing
→ same task sees Texturing capabilities
→ switch Texturing → Geometry
→ reload BlockIT plugin and recover
→ close/open Blockbench and recover
```

PASS requires zero manual MCP reconnect and zero new chat after initial Gateway configuration.

## Next Step 2 — DIRECT Smoke

Use one small disposable reference-driven asset to prove the normal product path before adding 3D complexity:

```text
Approved Reference + Dimensions
+ Geometry Strategy = DIRECT
+ Animation Required = NO
→ Geometry internal verify
→ user review/approve
→ checkpoint
→ Texturing
→ user review/approve
→ Finalization
→ editable .bbmodel
```

This is a smoke proof, not a model-quality benchmark suite.

## Next Step 3 — Implement Thin 3D-Assisted External Orchestrator

Create one normal-use resumable local entrypoint. Do not build a provider framework.

```text
Active Workspace
→ validate approved reference + dimensions + strategy
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D v1 Shape Reconstruction
→ bounded Shape GLB Gate
→ persist 3d-assisted/shape.glb
→ PrimitiveAnything
→ bounded Primitive Decomposition Gate
→ persist primitive-decomposition.json + state.json
```

The orchestrator owns only external pipeline state/hashes/resume. It does not author Blockbench Cubes.

Implementation should reuse the pinned Hunyuan and PrimitiveAnything POCs; those directories are implementation evidence, not alternate product routes.

## Next Step 4 — Prove External 3D Pipeline Locally

Before Runtime materializer work, prove one representative fixture reaches an acceptable decomposition:

```text
approved board
→ shape.glb PASS
→ PrimitiveAnything decomposition PASS
→ canonical state/artifact hashes valid
```

If Shape Reconstruction or PrimitiveAnything fails materially, stop at that owner. Do not build Runtime compensation for bad external decomposition.

## Next Step 5 — Implement Dedicated Geometry Scaffold Materializer

Only after Step 4 passes.

Target contract:

```text
Active Workspace path only
→ validate state.json + primitive-decomposition.json + hashes/schema
→ full pre-validation
→ one atomic Undo transaction
→ one temporary pa_<id> Group/Bone + Cube per primitive
→ complete scaffold or no accepted scaffold state
```

Keep Gateway at four tools. The materializer is one Geometry Runtime capability, not a fifth Gateway tool. No `from_geo_json`, arbitrary primitive arrays, generic UI import, or custom `.bbmodel` serializer.

## Next Step 6 — End-to-End 3D_ASSISTED

```text
Approved Reference + Dimensions + 3D_ASSISTED
→ external orchestrator
→ atomic Cuboid Scaffold
→ Semantic Geometry Cleanup
→ remove live Shape GLB
→ Geometry review/approve
→ Texturing review/approve
→ optional Animation
→ Finalization
```

Proof must include atomic failure behavior, Undo, stale/hash rejection, no production Mesh/reference_model, and user-visible final fidelity.

## Stop / Non-Goals

Do not add:

- automatic strategy classifier;
- provider router/interface before a second real Shape Reconstruction implementation exists;
- GLB-only or PrimitiveAnything-only product routes;
- fifth Gateway tool;
- generic `from_geo_json` revival;
- automatic fallback from `3D_ASSISTED` to `DIRECT`;
- large benchmark/profile systems before one representative end-to-end local proof.
