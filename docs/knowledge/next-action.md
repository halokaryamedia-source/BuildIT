# Next Action

Updated: 2026-08-28 — Route 1 Geometry Evidence Bridge candidate is under canonical CI validation

Working branch: **`Local` only**.

Current source + current proof are authority. Candidate/CI state is not production proof.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
FAIL_FAST_LOCAL_DIAGNOSTIC_READY
STATIC_MCP_VERIFY_GREEN_AT_968ECCB5

ROUTE1_GEOMETRY_BRIDGE_DEVELOPMENT_REACTIVATED
ROUTE1_CANDIDATE_CI_ACTIVE
CANONICAL_MCP_STATIC_GATE_PENDING
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
ROUTE1_BLOCKBENCH_TEST_BLOCKED
NO_ROUTE1_PRODUCTION_PASS
```

Historical MCP Verify at `968eccb5...` passed install/typecheck/test/surface/build/docs, but does not prove the new Route 1 bridge.

Prepared Route 1 candidate began at `6b66db8ec1b27fd8828d0357905539c1b9be80f8`. Draft validation PR #22 uses `route1-geometry-evidence-ci` only to run the existing repository gates without changing production `Local` source.

## Development Contract

### Goal

Allow an approved Route 1 shape-only local `.glb` to act as transient 3D evidence in Geometry without becoming Bedrock geometry or a mesh-to-Cube converter.

### Success Metric

```text
approved GLB
→ deterministic 3D Reference Model
→ explicit front registration + bounded transform controls
→ canonical explicit-envelope capture before/during Cube blockout
→ normal Groups/Cubes remain production geometry
→ reference removed before production .bbmodel export
```

Accepted visual result remains the product gate.

### Forbidden Proxy / Non-Goal

Do not add mesh-to-Cube conversion, voxelization, cuboid solver, GLB repair/decimation, semantic segmentation, raycast/probe, similarity scorer, opacity framework, custom GLB renderer, comparison framework, Geometry compiler/planner, or autonomous correction.

Approved Minecraft reference + requested dimensions remain authority. GLB is supporting depth/volume/attachment/placement/hidden-side evidence only. Raw GLB bounds are not target dimensions.

### First Evidence Required

Canonical repository gate on the CI candidate:

```text
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Current CI evidence from PR #22:

```text
Bun 1.3.14 setup/install  PASS
typecheck                PASS
first contract-test run  FAIL — stale contracts identified
```

Bridge-specific tests and the new 65-tool / 28-Geometry assertions passed in that run. The four diagnosed failures were stale count/discovery/continuation contracts; fix those owners only, rerun canonical CI, and continue only when green.

### Failure Classification / first wrong owner

```text
count/discovery assertion stale             → STALE TEST / EVAL CONTRACT
canonical docs/type/test/build failure       → MCP_PUBLIC_CONTRACT / exact source owner
Reference Models unavailable                 → ENVIRONMENT / INSTALL
GLB load/transform/cleanup failure            → BLOCKBENCH_RUNTIME
fresh Codex tool absent after green build     → MCP_PUBLIC_CONTRACT / INSTALL
canonical GLB capture failure                 → CAMERA / BLOCKBENCH_RUNTIME
GLB reconstruction materially wrong           → ROUTE 1 / HUNYUAN EVIDENCE
Cube result wrong despite valid evidence      → MODELLING REASONING / SKILL
production .bbmodel retains Route 1 reference → EXPORT / CLEANUP BOUNDARY
```

### Proof Required

Before source delivery:

```text
canonical MCP Verify fully green
+ generated docs fresh
+ retained catalog = 65
+ Geometry surface = 28
+ manage_geometry_reference absent from Texturing/Animation
```

Static green still does **not** prove desktop rendering or model quality.

## Candidate Scope

The bridge adds one experimental Geometry-owned tool: `manage_geometry_reference`.

It accepts one absolute local `.glb`, reuses the installed Blockbench `reference_models` type, creates a root-only locked `export=false` reference, aligns `+z/-z` source front to project front, allows only origin/positive uniform scale/visibility/wireframe updates, waits for async load, and cleans up on failure.

`capture_model_views` keeps `framing=model` Cube-owned but allows `framing=explicit` before Cubes when a loaded visible tool-owned reference exists. Editable `.bbmodel` export is blocked while that transient reference remains; Bedrock geometry export is unaffected.

The modelling Skill keeps approved image/dimensions authoritative and forbids triangle tracing or raw-GLB target sizing.

## Local Runtime Gate

**ROUTE1_BLOCKBENCH_TEST_BLOCKED until canonical source delivery is green.**

After green source is delivered to current `Local`:

```text
fresh build mcp/dist/blockit_mcp.js
→ load only that artifact
→ Geometry active
→ bun run verify:stateless-local
```

If that fails, obey its first classification and STOP.

If it passes:

```text
fresh Codex connection
→ verify manage_geometry_reference is exposed
→ Reference Models plugin active
→ empty Bedrock project
→ load approved elephant GLB, source front +z
→ verify loaded/root/locked/export=false
→ capture GLB-only canonical views with explicit framing
→ author primary Groups/Cubes
→ capture GLB + Cubes
→ one causal correction OR one primary rebuild if required
→ hide reference; capture model-only
→ remove reference
→ export .bbmodel
→ verify no reference_model remains
```

Live bridge acceptance:

```text
GLB is actually 3D in Blockbench
Codex can capture it before Cube blockout
reference and Cubes share intended coordinates
reference never becomes Bedrock geometry
production .bbmodel is clean
```

Only then run the elephant A/B quality comparison: image-only versus image + Route 1 GLB evidence, judged by accepted quality, depth/attachment accuracy, corrections/rebuilds, and Cost to Accepted Result.

## Repository Note

`route1-candidate-preflight-do-not-use` is an accidental unchanged historical branch and must not be used. `route1-geometry-evidence-ci` is validation-only. Final production delivery must remain one coherent `Local` change after canonical gates pass.

## STOP

Do not claim Route 1 source PASS, live MCP PASS, or visual improvement until the matching proof above exists.
