# Next Action

Updated: 2026-08-28 — Route 1 generic source/preparation complete; live Blockbench test deferred by user

Working branch: **`Local` only**.

Static green does not prove installed desktop/runtime behavior or model quality.

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

Exact source/preparation commit:

```text
5ecbf25608f8da879497e2f687854cb68781f3cd
fix(route1): package reproducible multiview inputs
```

Canonical MCP proof:

```text
bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS — 363 tests, 0 fail, 3496 expectations, 65 files
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

Surface stayed **65 catalog / 28 Geometry**. Exact source-build identity:

```text
sha256:a2bdb04df6036548d9ebad8ea1bdf949596c5ff6bc494cf1fda2cfdda0bd5598
```

## Development Contract

### Goal

Use approved Route 1 shape evidence as transient 3D guidance, with an object-agnostic preparation layer that packages all required inputs and the exact BlockIT artifact without object-specific modelling rules.

### Success Metric

```text
approved reference + requested dimensions remain authority
→ pinned FRONT + LEFT(SIDE) + BACK Hunyuan inputs
→ approved shape-only GLB + contact sheet
→ strict generic fixture
→ route1:prepare validates fixture/provenance/artifact identity
→ route1:package creates portable test-ready package
→ transient Blockbench 3D evidence
→ normal Groups/Cubes remain production geometry
→ remove reference before production .bbmodel export
```

### Forbidden Proxy / Non-Goal

Do not add object/anatomy-specific fixture fields, mesh-to-Cube conversion, voxelization, cuboid solving, GLB repair/decimation, segmentation, raycast/probe, similarity scoring, custom rendering, persistent Route 1 registry, Geometry compiler/planner, reconnect daemon, or autonomous correction without new evidence. Raw Hunyuan bounds never become target dimensions.

### First Evidence Required

No further source/preparation evidence is missing. When the user reactivates live testing:

```text
prepare/package one approved representative fixture
→ load packaged exact BlockIT artifact
→ stateless local diagnostic
→ fresh Codex Geometry registry
→ representative GLB bridge proof
```

### Failure Classification / first wrong owner

```text
fixture/file/hash failure                    → ROUTE 1 PREPARATION
BlockIT artifact identity failure            → BUILD / INSTALL
Hunyuan input/provenance/reconstruction      → ROUTE 1 / HUNYUAN EVIDENCE
server/process/GLB runtime failure            → BLOCKBENCH_RUNTIME
wrong product/build/phase/plugin              → ENVIRONMENT / INSTALL
fresh required tool absent                    → MCP_PUBLIC_CONTRACT / INSTALL
quantitative invariant failure                → ROUTE 1 MCP SOURCE / RUNTIME
canonical capture failure                     → CAMERA / BLOCKBENCH_RUNTIME
Cube result wrong despite valid evidence      → MODELLING REASONING / SKILL
.bbmodel retains Route 1 reference            → EXPORT / CLEANUP BOUNDARY
```

### Proof Required

Eventual live proof remains:

```text
local fail-fast diagnostic PASS
+ fresh Geometry registry contains manage_geometry_reference
+ representative approved GLB renders in 3D
+ quantitative evidence matches loaded reference
+ pre-Cube explicit views work
+ reference/Cubes share intended coordinate frame
+ reference never becomes Bedrock geometry
+ final .bbmodel is clean after removal
```

Only after live bridge PASS may Route 1 quality/efficiency be compared with image-only authoring.

## Source Boundary

Hunyuan generation is pinned to Hunyuan3D-2mv FRONT + LEFT(SIDE) + BACK, shape-only, `+z`, fp16 / 50 steps / guidance 5.0 / octree 256 / chunks 20000 / seed 12345.

`manage_geometry_reference` reuses Blockbench Reference Models, returns quantitative 3D evidence, recovers through `reference_models://...`, and fails closed on invalid transient-reference invariants. Editable `.bbmodel` export remains blocked until the tool-owned reference is removed.

Generic preparation is **not an MCP callable surface**:

```text
bun run route1:prepare <fixture-directory>
bun run route1:package <fixture-directory>
```

The fixture contains approved reference/GLB/contact sheet, FRONT/LEFT/BACK Hunyuan inputs, source front, requested dimensions, and pinned Hunyuan provenance. Preparation verifies portable paths, non-empty files, GLB 2.0 header, SHA-256 hashes, and BlockIT build identity. Packaging copies those inputs plus `plugin/blockit_mcp.js`, `manifest.json`, and `RUN.md` under ignored `.cache/test-ready/<fixture_id>` by default and refuses overwrite.

Manifest artifact authority is the embedded BlockIT build identity + full bundle SHA-256; `repository_head_at_prepare` is context only.

## Local Runtime Gate

**ROUTE1_BLOCKBENCH_TEST_BLOCKED by deliberate user deferral, not by a known source/preparation blocker.**

When reactivated:

```text
build current BlockIT
→ route1:prepare <approved-representative-fixture>
→ route1:package <approved-representative-fixture>
→ load packaged plugin in Blockbench
→ Geometry active
→ bun run verify:stateless-local
→ continue only after PASS
```

## STOP

Repository/source/preparation work stops here. A representative sample may validate the generic pipeline but must never become an object-specific rule. Resume coding only from specific later runtime/visual evidence.
