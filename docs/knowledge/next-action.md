# Next Action

Updated: 2026-08-28 — Route 1 Geometry Evidence Bridge source/test candidate prepared; canonical generated-docs + Bun gate pending

Working branch: **`Local` only**.

Current source + current proof are authority. Do not restore stale behavior merely to satisfy an old assertion.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
FAIL_FAST_LOCAL_DIAGNOSTIC_READY
STATIC_MCP_VERIFY_GREEN_AT_968ECCB5

ROUTE1_GEOMETRY_BRIDGE_DEVELOPMENT_REACTIVATED
ROUTE1_SOURCE_TEST_CANDIDATE_PREPARED_UNREFERENCED
ROUTE1_CANDIDATE_HEAD_6B66DB8E
LOCAL_SOURCE_HEAD_UNCHANGED_AT_ECA2F497
CANONICAL_DOCS_BUILD_REQUIRED
CANONICAL_MCP_STATIC_GATE_REQUIRED
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
ROUTE1_BLOCKBENCH_LIVE_PROOF_REQUIRED
NO_ROUTE1_PRODUCTION_PASS
```

The previously recorded MCP static proof remains historical proof for the pre-Route1 source only:

```text
MCP Verify @ 968eccb5f4d5a909e5d31d1f2c175eb712875ff7: PASS

bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

It does **not** prove the new Route 1 candidate.

## Active Development Contract — Route 1 Geometry Evidence Bridge v1

### Goal

Allow an approved Route 1 shape-only local `.glb` to enter the existing Geometry workflow as transient 3D reference evidence without becoming Bedrock geometry or a mesh-to-Cube compiler.

### Success Metric

```text
approved local GLB
→ one deterministic 3D reference in Blockbench
→ explicit source-front registration
→ bounded origin / uniform-scale / visibility / wireframe control
→ canonical explicit-envelope capture before or during Cube blockout
→ normal Groups/Cubes remain production geometry
→ Route 1 reference removed before production .bbmodel export
```

Accepted-result quality remains the product gate. Tool/file/coordinate success is not visual resemblance proof.

### Forbidden Proxy / Non-Goal

Do not add:

```text
mesh-to-Cube conversion
voxelizer / cuboid solver
semantic mesh segmentation
GLB cleanup / repair / decimation
raycast / surface probe
IoU / similarity scoring
opacity framework
custom GLB renderer
persistent scene registry
new comparison renderer
Geometry compiler/planner
autonomous correction loop
```

The approved Minecraft reference + requested dimensions remain authority. The GLB is depth/volume/attachment/hidden-side evidence only; raw reconstruction bounds are not target dimensions.

## Prepared Candidate

A complete source/test candidate was prepared from exact `Local` HEAD:

```text
base Local HEAD:
eca2f4977aed6f121461ec60d1d5320bc27fac94

candidate head (unreferenced Git commit):
6b66db8ec1b27fd8828d0357905539c1b9be80f8
```

The candidate changes only these owners:

```text
.agents/skills/blockbench-bedrock-modelling/SKILL.md
mcp/lib/authoringPhase.ts
mcp/server/tools/project.ts
mcp/server/tools/camera.ts
mcp/server/tools/export.ts
mcp/tests/authoring-phase-surface.test.ts
mcp/tests/camera-framing-contract.test.ts
mcp/tests/default-registration-import-safe.test.ts
mcp/tests/geometry-reference-contract.test.ts
mcp/tests/surface-integrity-guard.test.ts
```

Candidate behavior:

- adds one experimental Geometry-owned tool: `manage_geometry_reference`;
- accepts one absolute local `.glb` only; no URL/generic `.gltf` path;
- uses the installed Blockbench `reference_models` element type instead of adding another GLTF loader;
- creates one tool-owned reference at root, locked, `export=false`;
- aligns approved source `+z/-z` to the active Bedrock project `+z/-z` front by deterministic Y yaw;
- allows only origin, positive uniform scale, visibility, and wireframe updates;
- waits for the asynchronous Reference Models load and fails closed/cleans up on timeout or load failure;
- allows `capture_model_views` with `framing=explicit` before Cubes when a loaded visible tool-owned Route 1 reference exists; `framing=model` remains Cube-owned;
- blocks BlockIT editable `.bbmodel` export while a tool-owned Route 1 reference remains active; Bedrock geometry export remains unaffected;
- keeps the modelling authority order explicit: approved image/dimensions first, Route 1 GLB only as supporting 3D evidence.

Expected catalog/surface after final merge:

```text
retained catalog: 65 tools
Geometry exposure: 28 tools
Texturing/Animation: manage_geometry_reference absent
```

## Proof Obtained For Candidate

Only the following preflight was available in the current execution channel:

```text
candidate blob hashes matched intended local candidate files
Git diff whitespace check: PASS
TypeScript syntax parse preflight: PASS
candidate changed-file review: 10 files, bounded to declared owners
```

This is **not** canonical MCP static proof. The current execution channel has no Bun/project dependency environment and cannot run the canonical docs generator. Generated MCP API docs were therefore intentionally not hand-edited and the candidate was intentionally not moved onto `Local`.

## Next Exact Step — Bun-capable Repository Channel

Do this before any Route 1 live Blockbench claim:

```text
1. sync current Local and re-pin HEAD
2. materialize the candidate diff from 6b66db8ec1b27fd8828d0357905539c1b9be80f8
3. preserve one logical final delivery; do not publish the candidate commits as separate production history
4. run bun install --frozen-lockfile
5. run bun run docs:build
6. run bun run typecheck
7. run bun run test
8. run bun run measure:surface
9. run bun run build
10. run bun run docs:check
```

If any gate fails, diagnose the first wrong owner and fix only that owner. Do not move `Local` to the candidate merely to trigger CI.

If the full gate passes:

```text
re-check Local HEAD
→ create one atomic source + tests + generated-docs delivery
→ update stable counts/ownership docs only if the merged source actually changed them
→ then proceed to local runtime proof
```

## Local Runtime / Route 1 Proof

Static source proof cannot prove the desktop integration. After the final source delivery is green, use the existing fail-fast local diagnostic first:

```text
exact fresh Local build
→ load only mcp/dist/blockit_mcp.js
→ Geometry active
→ bun run verify:stateless-local
```

If that passes:

```text
fresh Codex connection
→ verify Geometry surface includes manage_geometry_reference
→ Reference Models plugin active
→ empty Bedrock project
→ load approved elephant Route 1 GLB (source front +z)
→ verify 3D reference is loaded/root/locked/export=false
→ capture GLB-only canonical views with explicit framing
→ create primary Groups/Cubes
→ capture GLB + Cubes
→ one causal correction or one primary rebuild if required
→ hide reference and capture model-only
→ remove Route 1 reference
→ export .bbmodel
→ verify no reference_model remains in production project
```

Required live acceptance for the bridge:

```text
GLB is actually 3D in Blockbench
Codex can capture it before Cube blockout
reference and Cubes share the intended coordinate frame
reference never becomes Bedrock geometry
production .bbmodel is clean after reference removal
```

Only after that bridge proof should the elephant A/B quality test compare image-only authoring versus image + Route 1 GLB evidence by accepted quality, depth/attachment accuracy, material corrections, rebuild need, and Cost to Accepted Result.

## Failure Classification / First Wrong Owner

```text
canonical docs/type/test/build failure     → MCP_PUBLIC_CONTRACT / source owner
Reference Models unavailable               → ENVIRONMENT / INSTALL
GLB fails to load / transform / cleanup     → BLOCKBENCH_RUNTIME
fresh Codex tool absent after green build   → MCP_PUBLIC_CONTRACT / install diagnosis
canonical GLB capture fails                 → CAMERA / BLOCKBENCH_RUNTIME
GLB evidence itself materially wrong        → ROUTE 1 / HUNYUAN EVIDENCE
Cube result wrong despite valid evidence    → MODELLING REASONING / SKILL
production .bbmodel retains tool ref         → EXPORT / CLEANUP BOUNDARY
```

Do not change Hunyuan evidence to compensate for MCP/install defects, and do not change MCP geometry logic to compensate for a materially bad Route 1 reconstruction.

## Repository Note

A temporary branch named `route1-candidate-preflight-do-not-use` was accidentally created during candidate preparation. It points only to the unchanged historical `eca2f497...` source and contains none of the candidate changes. The current connector exposes no safe branch-delete operation, so do not use or advance that branch; delete it through an authorized ref-delete capable channel when convenient.

The usable candidate is the unreferenced commit SHA above, not that branch.

## STOP

Do not claim Route 1 source PASS, live MCP PASS, or visual-quality improvement yet. The next meaningful work is the canonical generated-docs + Bun static gate on the prepared candidate, followed by the exact local Blockbench/elephant proof only after that gate passes.
