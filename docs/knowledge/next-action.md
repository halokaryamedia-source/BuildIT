# Next Action

Updated: 2026-08-28 — Route 1 Geometry Evidence Bridge source delivered and exact Local static gate green; local Blockbench proof required

Working branch: **`Local` only**.

Current source + matching proof are authority. Static green does not prove the installed desktop/runtime or model quality.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
FAIL_FAST_LOCAL_DIAGNOSTIC_READY

ROUTE1_GEOMETRY_BRIDGE_SOURCE_APPLIED
ROUTE1_CANONICAL_LOCAL_STATIC_GATE_GREEN
RETAINED_BEDROCK_CATALOG_65
DEFAULT_GEOMETRY_SURFACE_28
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
ROUTE1_BLOCKBENCH_TEST_BLOCKED
NO_ROUTE1_LIVE_PASS
NO_ACTIVE_REPOSITORY_DEVELOPMENT
```

Exact production source commit:

```text
4f772e6b0dce6c7655a34539c2efea7a2d846256
feat(mcp): add Route 1 geometry evidence bridge
```

Exact Local proof:

```text
Repository Verify              PASS
bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS — 351 tests, 0 fail
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

Measured source surface:

```text
catalog tools                  65
Geometry exposure              28
initialize instructions        608 chars
tools/list response            78,400 chars
input schemas                  58,352 chars
max per-tool payload           3,062 chars
```

Built bundle identity from exact Local CI:

```text
sha256:0a0fba34dc15356bf44d7c5bfbddaf35795642446dc30031a66ecabcc0bd03af
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

The repository/source gate is complete. The next evidence must come from the exact local desktop/runtime:

```text
fresh exact Local build
→ installed BlockIT identity match
→ stateless local diagnostic PASS
→ fresh Codex Geometry registry
→ approved elephant GLB bridge proof
```

### Failure Classification / first wrong owner

```text
BLOCKBENCH_SERVER_UNREACHABLE                → BLOCKBENCH_RUNTIME
MCP_HEALTH_UNREADABLE / WRONG_MCP_PRODUCT    → ENVIRONMENT / INSTALL
STALE_BUILD / WRONG_AUTHORING_PHASE           → ENVIRONMENT / INSTALL
SERVER_PROCESS_UNSTABLE                       → BLOCKBENCH_RUNTIME
fresh Codex tool absent after fresh build     → MCP_PUBLIC_CONTRACT / INSTALL
Reference Models unavailable                  → ENVIRONMENT / INSTALL
GLB load/transform/cleanup failure             → BLOCKBENCH_RUNTIME
canonical GLB capture failure                  → CAMERA / BLOCKBENCH_RUNTIME
GLB reconstruction materially wrong            → ROUTE 1 / HUNYUAN EVIDENCE
Cube result wrong despite valid evidence       → MODELLING REASONING / SKILL
production .bbmodel retains Route 1 reference  → EXPORT / CLEANUP BOUNDARY
```

### Proof Required

```text
local fail-fast diagnostic PASS
+ fresh Codex Geometry registry contains manage_geometry_reference
+ GLB actually renders as 3D reference
+ GLB-only explicit canonical views work before Cube blockout
+ reference/Cubes share intended coordinate frame
+ reference never becomes Bedrock geometry
+ production .bbmodel is clean after reference removal
```

Only after bridge PASS may Route 1 quality/efficiency be evaluated against image-only authoring.

## Source Boundary

`manage_geometry_reference` is one experimental Geometry-owned tool. It accepts one absolute local `.glb`, reuses Blockbench's installed `reference_models` type, creates a root-only locked `export=false` reference, aligns approved source `+z/-z` to project front, and allows only origin, positive uniform scale, visibility, and wireframe updates.

Load completion is bounded and fail-closed. `capture_model_views` keeps `framing=model` Cube-owned while `framing=explicit` can capture a loaded visible tool-owned Route 1 reference before Cubes exist. Editable `.bbmodel` export is blocked while the transient tool-owned reference remains; Bedrock geometry export is unaffected.

The modelling Skill keeps approved image/dimensions authoritative, prohibits triangle tracing/raw-GLB target sizing, and requires the reference to be removed before production `.bbmodel` export.

## Local Runtime Gate

**ROUTE1_BLOCKBENCH_TEST_BLOCKED until the fail-fast local runtime diagnostic passes.**

Next exact step on the user's desktop:

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
→ verify Reference Models plugin active
→ empty Bedrock project
→ load approved elephant GLB with source front +z
→ verify loaded/root/locked/export=false
→ capture GLB-only canonical views using explicit framing
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

After bridge PASS, run the elephant A/B quality comparison:

```text
A = approved image only
B = approved image + Route 1 GLB evidence
```

Judge accepted quality, depth/attachment accuracy, material corrections, rebuild need, and Cost to Accepted Result. Do not promote Route 1 from technical bridge to quality improvement without that evidence.

## Repository Note

Draft PR #22 and `route1-geometry-evidence-ci` were validation-only and must not be merged as production history. `route1-candidate-preflight-do-not-use` is accidental unchanged history and must not be used. Delete these refs only through an authorized ref-delete capable channel; do not create workaround commits.

## STOP

Repository development stops here. The next meaningful work is the exact local Blockbench/runtime gate. Do not add more Route 1 tooling or claim live/visual improvement before matching evidence exists.
