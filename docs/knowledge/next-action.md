# Next Action

Updated: 2026-08-28 — Route 1 Geometry Evidence Bridge source ready for Local delivery; exact Local CI still required

Working branch: **`Local` only**.

Current source + matching proof are authority. Static proof never upgrades desktop/runtime/visual claims.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
FAIL_FAST_LOCAL_DIAGNOSTIC_READY

ROUTE1_GEOMETRY_BRIDGE_SOURCE_APPLIED
ROUTE1_CANDIDATE_CANONICAL_GATE_GREEN
RETAINED_BEDROCK_CATALOG_65
DEFAULT_GEOMETRY_SURFACE_28
LOCAL_BRANCH_MCP_VERIFY_REQUIRED
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
ROUTE1_BLOCKBENCH_TEST_BLOCKED
NO_ROUTE1_LIVE_PASS
```

The production source delivery is the Route 1 Geometry Evidence Bridge validated on draft PR #22. The green validation merge snapshot was `39a9cd274809ce92088b223e09ac70e5b2844b28` with source head `036aae1173d08ec337786d4005001ba3765aa841` against Local base `7c0d53cc9b4449d4b49cf4e156d2cf6d795a55fc`.

Candidate canonical proof:

```text
Bun 1.3.14 / frozen install  PASS
bun run typecheck            PASS
bun run test                 PASS — 351 tests, 0 fail
bun run measure:surface      PASS
bun run build                PASS
bun run docs:check           PASS
Repository Verify            PASS
```

Measured default surface:

```text
catalog tools                65
Geometry exposure            28
initialize instructions      608 chars
tools/list response          78,400 chars
input schemas                58,352 chars
max per-tool payload         3,062 chars
```

## Development Contract

### Goal

Use an approved Route 1 shape-only local `.glb` as transient 3D evidence in Geometry without converting the mesh into Bedrock geometry.

### Success Metric

```text
approved GLB
→ deterministic Blockbench 3D reference
→ explicit front registration + bounded transform controls
→ explicit-envelope canonical capture before/during Cube blockout
→ normal Groups/Cubes remain production geometry
→ reference removed before production .bbmodel export
```

Accepted visual result remains the product gate.

### Forbidden Proxy / Non-Goal

Do not add mesh-to-Cube conversion, voxelization, cuboid solver, GLB repair/decimation, semantic segmentation, raycast/probe, similarity scoring, opacity framework, custom GLB renderer, comparison framework, Geometry compiler/planner, or autonomous correction.

Approved Minecraft image + requested dimensions remain authority. GLB is supporting depth/volume/attachment/placement/hidden-side evidence only; raw GLB bounds are not target dimensions.

### First Evidence Required

After the source commit reaches `Local`, require the exact Local canonical gate. If any check fails, diagnose the first wrong owner and stop downstream runtime testing.

### Failure Classification / first wrong owner

```text
Local type/test/surface/build/docs failure    → exact MCP/source/test owner
Reference Models unavailable                  → ENVIRONMENT / INSTALL
GLB load/transform/cleanup failure             → BLOCKBENCH_RUNTIME
fresh Codex tool absent after green build      → MCP_PUBLIC_CONTRACT / INSTALL
canonical GLB capture failure                  → CAMERA / BLOCKBENCH_RUNTIME
GLB reconstruction materially wrong            → ROUTE 1 / HUNYUAN EVIDENCE
Cube result wrong despite valid evidence       → MODELLING REASONING / SKILL
production .bbmodel retains Route 1 reference  → EXPORT / CLEANUP BOUNDARY
```

### Proof Required

```text
exact Local MCP Verify green
+ exact Local Repository Verify green
+ local fail-fast diagnostic PASS
+ fresh Codex Geometry registry
+ live elephant GLB bridge proof
```

## Source Boundary

`manage_geometry_reference` is one experimental Geometry-owned tool. It accepts an absolute local `.glb`, reuses the installed Blockbench `reference_models` type, creates a root-only locked `export=false` reference, aligns `+z/-z` source front to project front, and allows only origin, positive uniform scale, visibility, and wireframe updates.

Load completion is bounded and fail-closed. `capture_model_views` keeps `framing=model` Cube-owned while `framing=explicit` can capture a loaded visible tool-owned Route 1 reference before Cubes exist. Editable `.bbmodel` export is blocked while that transient reference remains; Bedrock geometry export is unaffected.

The modelling Skill keeps approved image/dimensions authoritative, prohibits triangle tracing/raw-GLB target sizing, and requires the reference to be removed before production `.bbmodel` export.

## Local Runtime Gate

**ROUTE1_BLOCKBENCH_TEST_BLOCKED until the exact Local source gate is green.**

Then run:

```text
sync exact Local
→ build mcp/dist/blockit_mcp.js
→ load only that artifact in Blockbench desktop
→ Geometry active
→ bun run verify:stateless-local
```

If the diagnostic fails, obey its first classification and STOP.

If it passes:

```text
fresh Codex connection
→ verify manage_geometry_reference in Geometry surface
→ Reference Models plugin active
→ empty Bedrock project
→ load approved elephant GLB, source front +z
→ verify reference loaded/root/locked/export=false
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
reference and Cubes share intended coordinate frame
reference never becomes Bedrock geometry
production .bbmodel is clean
```

Only after bridge PASS run the elephant A/B quality comparison: image-only versus image + Route 1 GLB evidence, judged by accepted quality, depth/attachment accuracy, corrections/rebuilds, and Cost to Accepted Result.

## Repository Note

`route1-candidate-preflight-do-not-use` is accidental unchanged history and must not be used. `route1-geometry-evidence-ci` and draft PR #22 are validation-only; do not merge that history into production.

## STOP

After exact Local canonical CI is green, stop repository development and move to the local Blockbench gate. Do not claim live MCP PASS or visual improvement before that proof.
