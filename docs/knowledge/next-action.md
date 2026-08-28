# Next Action

Updated: 2026-08-28 — Route 1 generic preparation/source complete; live Blockbench test intentionally deferred by user

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
ROUTE1_GENERIC_FIXTURE_CONTRACT_READY
ROUTE1_PREPARE_COMMAND_READY
ROUTE1_PACKAGE_COMMAND_READY
ROUTE1_MULTIVIEW_INPUT_PACKAGE_READY
ROUTE1_ARTIFACT_IDENTITY_MANIFEST_READY
ROUTE1_CANONICAL_LOCAL_STATIC_GATE_GREEN
RETAINED_BEDROCK_CATALOG_65
DEFAULT_GEOMETRY_SURFACE_28
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
ROUTE1_BLOCKBENCH_TEST_BLOCKED
ROUTE1_LIVE_TEST_DEFERRED_BY_USER
NO_ROUTE1_LIVE_PASS
NO_ACTIVE_REPOSITORY_DEVELOPMENT
```

Exact final source/preparation commit:

```text
5ecbf25608f8da879497e2f687854cb68781f3cd
fix(route1): package reproducible multiview inputs
```

Matching canonical MCP proof:

```text
bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS — 363 tests, 0 fail, 3496 expectations, 65 files
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

Measured MCP surface is unchanged:

```text
catalog tools                  65
Geometry exposure              28
initialize instructions        608 chars
tools/list response            78,400 chars
input schemas                  58,352 chars
max per-tool payload           3,062 chars
```

Exact source-build identity from canonical CI:

```text
sha256:a2bdb04df6036548d9ebad8ea1bdf949596c5ff6bc494cf1fda2cfdda0bd5598
```

## Development Contract

### Goal

Use approved Route 1 shape evidence as transient 3D guidance in Geometry, with an object-agnostic fixture/preparation layer that can package all inputs and the exact BlockIT artifact without creating object-specific modelling rules.

### Success Metric

```text
approved reference + requested dimensions remain authority
→ pinned FRONT + LEFT(SIDE) + BACK Hunyuan inputs
→ approved shape-only GLB + contact sheet
→ strict generic fixture contract
→ route1:prepare validates files/provenance/artifact identity
→ route1:package creates portable test-ready package
→ Blockbench bridge uses transient 3D evidence
→ normal Groups/Cubes remain production geometry
→ transient reference removed before production .bbmodel export
```

Accepted visual result remains the product gate.

### Forbidden Proxy / Non-Goal

Do not add object/anatomy-specific fixture fields, mesh-to-Cube conversion, voxelization, cuboid solver, GLB repair/decimation, semantic segmentation, raycast/probe, similarity scoring, opacity framework, custom GLB renderer, comparison framework, persistent Route 1 registry, Geometry compiler/planner, reconnect daemon, or autonomous correction without new evidence.

Raw Hunyuan bounds remain observation only and never requested target dimensions.

### First Evidence Required

No further source or preparation evidence is currently missing. The next new evidence is intentionally deferred until the user chooses to resume live testing:

```text
prepare/package one approved representative fixture
→ load packaged exact BlockIT artifact
→ stateless local diagnostic
→ fresh Codex Geometry registry
→ representative GLB bridge proof
```

Do not start that run until the user reactivates it.

### Failure Classification / first wrong owner

```text
fixture schema/file/hash failure                 → ROUTE 1 PREPARATION
BlockIT artifact identity failure                → BUILD / INSTALL
Hunyuan input/provenance mismatch                → ROUTE 1 / HUNYUAN EVIDENCE
BLOCKBENCH_SERVER_UNREACHABLE                    → BLOCKBENCH_RUNTIME
MCP_HEALTH_UNREADABLE / WRONG_MCP_PRODUCT        → ENVIRONMENT / INSTALL
STALE_BUILD / WRONG_AUTHORING_PHASE              → ENVIRONMENT / INSTALL
SERVER_PROCESS_UNSTABLE                          → BLOCKBENCH_RUNTIME
fresh Codex tool absent after fresh build        → MCP_PUBLIC_CONTRACT / INSTALL
Reference Models unavailable                     → ENVIRONMENT / INSTALL
GLB load/transform/cleanup failure                → BLOCKBENCH_RUNTIME
quantitative evidence/invariant failure           → ROUTE 1 MCP SOURCE / RUNTIME
canonical GLB capture failure                     → CAMERA / BLOCKBENCH_RUNTIME
GLB reconstruction materially wrong               → ROUTE 1 / HUNYUAN EVIDENCE
Cube result wrong despite valid evidence          → MODELLING REASONING / SKILL
production .bbmodel retains Route 1 reference     → EXPORT / CLEANUP BOUNDARY
```

### Proof Required

Source/preparation proof is complete. Eventual live proof remains:

```text
local fail-fast diagnostic PASS
+ fresh Codex Geometry registry contains manage_geometry_reference
+ approved representative GLB renders as 3D reference
+ tool/resource quantitative evidence matches loaded reference
+ GLB-only explicit canonical views work before Cube blockout
+ reference/Cubes share intended coordinate frame
+ reference never becomes Bedrock geometry
+ production .bbmodel is clean after reference removal
```

Only after live bridge PASS may Route 1 quality/efficiency be compared against image-only authoring.

## Source Boundary

Preferred Hunyuan generation is executable and pinned to Hunyuan3D-2mv FRONT + LEFT(SIDE) + BACK, shape-only, `+z` source front, fixed fp16 / 50 steps / guidance 5.0 / octree 256 / chunks 20000 / seed 12345.

`manage_geometry_reference` reuses Blockbench's installed `reference_models` type. It returns raw world AABB, dimensions in Blockbench units/blocks, and mesh/vertex/triangle diagnostics. `reference_models://...` recovers the same evidence/alignment after reconnect. Evidence/capture fails closed if a tool-owned reference becomes non-root, unlocked, export-enabled, or non-uniformly scaled.

Generic preparation is owned by `mcp/scripts/route1-fixture.ts` and is **not an MCP callable surface**:

```text
bun run route1:prepare <fixture-directory>
bun run route1:package <fixture-directory>
```

A fixture contains approved reference, approved GLB, contact sheet, FRONT/LEFT/BACK Hunyuan inputs, source-front direction, requested dimensions, and exact pinned Hunyuan provenance. Preparation verifies portable paths, non-empty files, GLB 2.0 header, SHA-256 hashes, and the canonical BlockIT bundle identity. Packaging copies those inputs plus `plugin/blockit_mcp.js`, `manifest.json`, and `RUN.md` into ignored `.cache/test-ready/<fixture_id>` by default; existing outputs are not overwritten.

The package manifest records the embedded BlockIT build identity and full bundle SHA-256. `repository_head_at_prepare` is context only, not a substitute for artifact identity.

## Local Runtime Gate

**ROUTE1_BLOCKBENCH_TEST_BLOCKED by deliberate user deferral, not by a known source/preparation blocker.**

When live testing is reactivated:

```text
build exact current BlockIT
→ route1:prepare <approved-representative-fixture>
→ route1:package <approved-representative-fixture>
→ load packaged blockit_mcp.js in Blockbench desktop
→ Geometry active
→ bun run verify:stateless-local
→ continue bridge/model-quality proof only after PASS
```

## STOP

Repository/source/preparation development stops here because no justified static gap remains. A representative sample may prove or disprove the generic pipeline, but it must never become an object-specific modelling rule. Resume coding only if later runtime/visual evidence identifies a specific wrong owner.
