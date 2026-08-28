# Next Action

Updated: 2026-08-28 — Route 1 source/static coding complete; live Blockbench test intentionally deferred by user

Working branch: **`Local` only**.

Current source + matching proof are authority. Static green does not prove the installed desktop/runtime or model quality.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
FAIL_FAST_LOCAL_DIAGNOSTIC_READY

ROUTE1_SOURCE_STATIC_CODING_COMPLETE
ROUTE1_MULTIVIEW_EXECUTABLE_TRACKED
ROUTE1_QUANTITATIVE_3D_EVIDENCE_READY
ROUTE1_RECONNECT_EVIDENCE_READY
ROUTE1_REFERENCE_OWNERSHIP_HARDENED
ROUTE1_CANONICAL_LOCAL_STATIC_GATE_GREEN
RETAINED_BEDROCK_CATALOG_65
DEFAULT_GEOMETRY_SURFACE_28
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
ROUTE1_BLOCKBENCH_TEST_BLOCKED
ROUTE1_LIVE_TEST_DEFERRED_BY_USER
NO_ROUTE1_LIVE_PASS
NO_ACTIVE_REPOSITORY_DEVELOPMENT
```

Exact final source commit:

```text
5bcaa8a7e9217dc84fb0d11d96c319ba1154e417
fix(mcp): preserve Route 1 reference ownership invariants
```

Matching canonical MCP proof:

```text
bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS — 358 tests, 0 fail, 3461 expectations, 64 files
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

Measured surface remains:

```text
catalog tools                  65
Geometry exposure              28
initialize instructions        608 chars
tools/list response            78,400 chars
input schemas                  58,352 chars
max per-tool payload           3,062 chars
```

Exact source bundle identity:

```text
sha256:6fab9790e4d912724fd0f23416ad5b164e402d2314b710e724c8b7e49c7210be
```

## Development Contract

### Goal

Use an approved Route 1 shape-only local `.glb` as transient 3D evidence in Geometry without converting mesh triangles into Bedrock geometry.

### Success Metric

```text
approved Minecraft image + requested dimensions remain authority
→ pinned FRONT + LEFT(SIDE) + BACK Hunyuan MultiView shape evidence
→ deterministic transient Blockbench Reference Model
→ quantitative 3D evidence + reconnect recovery
→ explicit-envelope capture before/during Cube blockout
→ normal Groups/Cubes remain production geometry
→ transient reference removed before production .bbmodel export
```

Accepted visual result remains the product gate.

### Forbidden Proxy / Non-Goal

Do not add mesh-to-Cube conversion, voxelization, cuboid solver, GLB repair/decimation, semantic segmentation, raycast/probe, similarity scoring, opacity framework, custom GLB renderer, comparison framework, persistent Route 1 registry, Geometry compiler/planner, reconnect daemon, or autonomous correction without new evidence.

Raw Hunyuan bounds are observation only and never requested target dimensions.

### First Evidence Required

No further source evidence is currently missing. The next new evidence is intentionally deferred until the user chooses to resume live testing:

```text
exact current Local build
→ installed BlockIT identity match
→ stateless local diagnostic
→ fresh Codex Geometry registry
→ approved elephant GLB bridge proof
```

Do not start that run until the user reactivates it.

### Failure Classification / first wrong owner

```text
BLOCKBENCH_SERVER_UNREACHABLE                 → BLOCKBENCH_RUNTIME
MCP_HEALTH_UNREADABLE / WRONG_MCP_PRODUCT     → ENVIRONMENT / INSTALL
STALE_BUILD / WRONG_AUTHORING_PHASE            → ENVIRONMENT / INSTALL
SERVER_PROCESS_UNSTABLE                        → BLOCKBENCH_RUNTIME
fresh Codex tool absent after fresh build      → MCP_PUBLIC_CONTRACT / INSTALL
Reference Models unavailable                   → ENVIRONMENT / INSTALL
GLB load/transform/cleanup failure              → BLOCKBENCH_RUNTIME
quantitative evidence/invariant failure         → ROUTE 1 MCP SOURCE / RUNTIME
canonical GLB capture failure                   → CAMERA / BLOCKBENCH_RUNTIME
GLB reconstruction materially wrong             → ROUTE 1 / HUNYUAN EVIDENCE
Cube result wrong despite valid evidence        → MODELLING REASONING / SKILL
production .bbmodel retains Route 1 reference   → EXPORT / CLEANUP BOUNDARY
```

### Proof Required

Source/static proof is complete. Eventual live proof remains:

```text
local fail-fast diagnostic PASS
+ fresh Codex Geometry registry contains manage_geometry_reference
+ approved GLB renders as 3D reference
+ tool/resource quantitative evidence matches loaded reference
+ GLB-only explicit canonical views work before Cube blockout
+ reference/Cubes share intended coordinate frame
+ reference never becomes Bedrock geometry
+ production .bbmodel is clean after reference removal
```

Only after live bridge PASS may Route 1 quality/efficiency be compared against image-only authoring.

## Source Boundary

Preferred Hunyuan generation is now executable and pinned:

```text
model        tencent/Hunyuan3D-2mv @ 3a761b539b29fe4ff64714813aa9560fd66f5de0
views        FRONT + LEFT(SIDE) + BACK
settings     fp16 / 50 steps / guidance 5.0 / octree 256 / chunks 20000 / seed 12345
front        +z
output       shape-only GLB
```

`manage_geometry_reference` reuses Blockbench's installed `reference_models` type. It returns raw world AABB, dimensions in Blockbench units/blocks, and mesh/vertex/triangle diagnostics. The existing `reference_models://...` resource recovers the same evidence and alignment after reconnect.

Tool-owned references remain detectable after rename. Evidence/capture fails closed if a Route 1 reference becomes non-root, unlocked, export-enabled, or non-uniformly scaled. Dedicated removal remains available for cleanup.

`capture_model_views` keeps `framing=model` Cube-owned while `framing=explicit` supports pre-Cube Route 1 evidence. Editable `.bbmodel` export is blocked while the transient Route 1 reference remains; Bedrock geometry export is unaffected.

## Local Runtime Gate

**ROUTE1_BLOCKBENCH_TEST_BLOCKED by deliberate user deferral, not by a known source blocker.**

When the user later reactivates testing, resume exactly here:

```text
sync current Local
→ build mcp/dist/blockit_mcp.js
→ load only that artifact in Blockbench desktop
→ Geometry active
→ bun run verify:stateless-local
```

If diagnostic PASS:

```text
fresh Codex connection
→ verify manage_geometry_reference
→ verify Reference Models plugin active
→ empty Bedrock project
→ load approved elephant GLB, source front +z
→ inspect quantitative Route 1 evidence
→ capture GLB-only explicit views
→ author primary Groups/Cubes
→ capture GLB + Cubes
→ one causal correction OR one primary rebuild if required
→ hide/remove reference
→ capture model-only
→ export clean .bbmodel
```

After technical bridge PASS, compare:

```text
A = approved image only
B = approved image + Route 1 GLB evidence
```

Judge accepted quality, depth/attachment accuracy, corrections/rebuilds, and Cost to Accepted Result.

## STOP

Repository/source development stops here because no justified static gap remains. Do not add more Route 1 tooling merely because live proof has not yet been run. Resume coding only if later runtime/visual evidence identifies a specific wrong owner.
