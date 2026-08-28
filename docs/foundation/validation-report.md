# Validation Report

Updated: 2026-08-28 — Route 1 Geometry Evidence Bridge canonical Local static gate green; desktop proof required

This file owns the **proof boundary**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts belong in `CONTEXT.md`.

## Current Evidence Summary

```text
BEDROCK CALLABLE CATALOG:                 65 tools across phases
DEFAULT CLIENT EXPOSURE:                  MCP Core + Geometry (28 tools)
ACTIVE PHASE CONTRACT:                    SOURCE + FULL MCP STATIC PROOF
ROUTE 1 GEOMETRY EVIDENCE BRIDGE:         SOURCE + FULL MCP STATIC PROOF
CODEX FIRST-CALL LEGIBILITY:              SOURCE + FULL MCP STATIC PROOF
BUILD BUNDLE IDENTITY:                    SOURCE + FULL MCP STATIC PROOF
FAIL-FAST LOCAL DIAGNOSTIC CONTRACT:      SOURCE + FULL MCP STATIC PROOF
LATEST FULL MCP VERIFY:                   GREEN @ 4f772e6b0dce6c7655a34539c2efea7a2d846256
LAST OBSERVED FULL CANONICAL GREEN:       4f772e6b0dce6c7655a34539c2efea7a2d846256
LATEST REPOSITORY VERIFY:                 GREEN @ 4f772e6b0dce6c7655a34539c2efea7a2d846256
ACCEPTED LIVE BASELINE:                   2026-08-12 Blockbench 5.1.6
CURRENT ROUTE 1 LIVE RETEST:              LOCAL PROOF REQUIRED
CURRENT MODEL-QUALITY CLAIM:              LOCAL PROOF REQUIRED
```

Current static proof must not be confused with live Blockbench behavior. Source/typecheck/tests/build/docs checks can prove phase ownership, schemas, buildability, generated-doc freshness, source-owned phase surfaces, bundle-fingerprint generation, Route 1 static contracts, and diagnostic classification behavior; they cannot prove GLB rendering in the installed desktop, installed-plugin freshness, a fresh Codex registry, live Blockbench mutation/Undo, visual fidelity, future call efficiency, or Authoring Efficiency.

## Current Agent-Contract Proof

Current source implements:

```text
MCP CORE + exactly one ACTIVE PHASE
GEOMETRY | TEXTURING | ANIMATION
```

Runtime instructions name the active phase, preserve the Bedrock unit/axis invariant, explain foreign-phase absence, and require `HANDOFF_REQUIRED` instead of foreign-tool search. Phase transitions remain deliberate reload/reconnect boundaries rather than in-process surface mutation.

The current full MCP gate passed on exact `Local` commit `4f772e6b0dce6c7655a34539c2efea7a2d846256`:

```text
bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS — 351 tests, 0 fail, 3377 expectations, 63 files
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
Repository Verify              PASS
```

Current regression coverage proves, among other things:

- missing phase defaults to Geometry while explicit invalid phase fails closed;
- default Geometry exposure is Core + Geometry only (28 tools);
- retained callable catalog remains 65 tools across phases;
- `manage_geometry_reference` is Geometry-owned and absent from Texturing/Animation;
- required Geometry acceptance tools remain present in the source-owned Geometry surface;
- Direct Geometry remains free of the retired `plan_id` contract;
- canonical active plugin path is `mcp/dist/blockit_mcp.js`;
- `/health.build_identity`, `product.version`, `instance_id`, and `startup_time` have separate responsibilities;
- active operator guidance requires BlockIT MCP reload/restart plus client reconnect at phase handoff;
- loopback/stateless transport, Origin/Host guards, request bounds, socket cleanup, and fail-closed TCP bind retain regression coverage;
- the existing local smoke script is import-safe for regression tests and remains a diagnostic verifier rather than a new runtime framework;
- local diagnostic preflight classifies the first known wrong owner before downstream surface diagnosis.

## Route 1 Geometry Evidence Bridge Static Proof

Current source adds one experimental Geometry-owned capability:

```text
manage_geometry_reference
```

Its static contract proves:

- input is one absolute local `.glb`, not URL/generic importer semantics;
- the installed Blockbench `reference_models` element type is reused instead of adding another GLTF loader;
- the tool-owned reference is root-only, locked, `export=false`, and transient;
- source front `+z/-z` is registered deterministically to project front by Y yaw;
- updates are bounded to origin, positive uniform scale, visibility, and wireframe;
- asynchronous load is bounded and failure cleanup is fail-closed;
- `capture_model_views` keeps `framing=model` Cube-owned while `framing=explicit` can use a loaded visible tool-owned Route 1 reference before Cubes exist;
- editable `.bbmodel` export is refused while a tool-owned Route 1 reference remains active; Bedrock geometry export is unaffected;
- modelling guidance keeps the approved image + requested dimensions authoritative and forbids triangle tracing/raw-GLB target sizing.

This does **not** prove that the user's desktop Reference Models plugin loads the approved elephant GLB correctly or that Codex sees useful live views. That remains the next local proof.

## Fail-Fast Local Diagnostic Proof

The existing `bun run verify:stateless-local` separates environment/runtime failures from real MCP public-contract failures.

Its preflight order is:

```text
server reachable
→ /health readable
→ product.id == blockit-bedrock-entity-mcp
→ local build_identity == live /health.build_identity
→ instance_id + startup_time remain stable across health reads
→ requested profile / authoring phase match
→ stateless JSON transport contract matches
→ exposed_tool_count matches source phase count
→ initialize contract
→ exact tools/list surface
→ required Geometry capability
→ Direct Geometry plan_id guard
```

The diagnostic codes are:

```text
BLOCKBENCH_SERVER_UNREACHABLE   → BLOCKBENCH_RUNTIME
MCP_HEALTH_UNREADABLE           → ENVIRONMENT / INSTALL
WRONG_MCP_PRODUCT               → ENVIRONMENT / INSTALL
STALE_BUILD                     → ENVIRONMENT / INSTALL
SERVER_PROCESS_UNSTABLE         → BLOCKBENCH_RUNTIME
WRONG_AUTHORING_PHASE           → ENVIRONMENT / INSTALL
MCP_HEALTH_CONTRACT_MISMATCH    → MCP_PUBLIC_CONTRACT
MCP_INITIALIZE_CONTRACT_MISMATCH→ MCP_PUBLIC_CONTRACT
SURFACE_MISMATCH                → MCP_PUBLIC_CONTRACT
GEOMETRY_CAPABILITY_MISSING     → MCP_PUBLIC_CONTRACT
RETIRED_PLAN_ID_EXPOSED         → MCP_PUBLIC_CONTRACT
```

Environment/install and Blockbench-runtime failures STOP before downstream `tools/list` diagnosis.

For Geometry, the required acceptance capability is:

```text
create_project
manage_geometry_reference
add_group
place_cube
modify_cube
modify_cubes_batch
modify_group
reparent_element
capture_model_views
bone_rigging
export_model
```

The plan-free schema guard is:

```text
manage_geometry_reference
add_group
place_cube
modify_cube
modify_cubes_batch
modify_group
reparent_element
```

This is still static preparation. It does not prove which diagnostic code, if any, will occur on the user's desktop.

## Bundle Freshness Identity

The production build computes SHA-256 over the emitted MCP bundle before adding the diagnostic banner, then injects:

```text
globalThis.__BLOCKIT_BUILD_ID__ = "sha256:<64 lowercase hex>"
```

For exact Local commit `4f772e6b...`, MCP Verify built:

```text
sha256:0a0fba34dc15356bf44d7c5bfbddaf35795642446dc30031a66ecabcc0bd03af
```

Identity ownership remains:

```text
product.version    = release/development version; currently 0.1.0
build_identity     = exact built-bundle SHA-256 identity
instance_id        = running server-process identity
startup_time       = running server-process start time
```

The fingerprint is diagnosis only. It is not a cache-buster, release version, session key, UI state, telemetry stream, or reconnect mechanism.

## Discovery / Static Footprint Proof

Current discovery evaluation on exact Local source:

```text
raw semantic stress:
top_1_accuracy  0.5472
top_3_recall    0.7736
top_8_recall    0.8868
MRR             0.6822

routed exact-name loading:
top_1_accuracy  0.8302
top_3_recall    0.9340
top_8_recall    1.0000
MRR             0.8913
top_8_misses    0
```

Evaluation corpus: 65 enabled tools, 53 expected tools, 106 intent cases. Raw semantic search remains a stress metric; the normal path is active-phase routing first, then exact routed spec loading when needed.

## Surface Guard

Measured exact Local surface:

```text
retained Bedrock callable catalog  65 tools
default Geometry exposure           28 tools
initialize instructions             608 characters
catalog tools/list response         78,400 characters
catalog input schemas               58,352 characters
catalog descriptions                7,080 characters
max per-tool payload                3,062 characters
canonical workflow source           7,619 characters
```

Regression ceilings remain:

```text
initialize instructions             <= 700 characters
catalog tools/list budget           <= 82,000 characters
catalog input schemas               <= 58,500 characters
catalog descriptions                <= 11,500 characters
max per-tool payload                <= 3,200 characters
canonical workflow source           < 9,000 characters
```

These are **Static Footprint** guardrails. Character counts are regression ceilings, not client token measurements and not Authoring Efficiency proof.

## Visual / Reference Proof Rule

Reference-driven approval requires:

```text
actual approved reference image
+ fresh current-revision model image(s)
+ difference-first comparison
```

An approved Route 1 GLB may supplement the approved image with 3D evidence; it never replaces image/dimension authority. Static CI cannot prove visual fidelity. Paths, filenames, manifests, prose, memory, coordinates, bounds, tool success, and scalar similarity cannot independently justify visual `PASS`.

## Authoring Efficiency Rule

Authoring Efficiency is evaluated only for an accepted result:

```text
QUALITY FAIL → no efficiency success claim
QUALITY PASS → compare justified vs unnecessary work → Cost to Accepted Result
```

Useful runtime observations include Discovery calls, Redundant readbacks, tool-search misses, batching, capture calls, Correction attempts, recovery, Same-cause retries, and whether corrections are `IMPROVED`, `UNCHANGED`, or `REGRESSED`. Do not invent token or latency numbers; unknown values remain `UNVERIFIED`.

## Current Static / Source State

Current retained source includes:

- 65-tool normal Bedrock callable catalog across phases;
- 28-tool default Core + Geometry exposure;
- transient Route 1 GLB geometry-reference evidence via `manage_geometry_reference`;
- explicit-envelope Route 1 reference capture before Cube blockout;
- production `.bbmodel` guard for tool-owned transient Route 1 references;
- phase-specific workflow and active-specialist routing;
- deterministic `HANDOFF_REQUIRED` state;
- coherent Cube/Group batching;
- Geometry-owned UV Layout and Box-UV workflow;
- Texture Atlas/Painter/PBR/material-instance authoring;
- Bedrock animation/controller authoring;
- Locator/Null Object lifecycle;
- Undo/history and `.bbmodel`/Bedrock export;
- loopback-only request-owned/stateless transport;
- fail-closed startup;
- SHA-256 packaged-bundle freshness identity;
- fail-fast local diagnostic classification;
- `risky_eval` and `from_geo_json` disabled.

The bridge did **not** add mesh-to-Cube conversion, voxelization, cuboid solving, GLB cleanup/decimation, raycast/probe, similarity scoring, a custom GLB renderer, a reconnect daemon, new routing/profile architecture, telemetry, alternate transport, or a Geometry compiler.

## Local Runtime History

### ACCEPTED LIVE BASELINE — 2026-08-12

Historical live coverage included the then-current transport/tool surface, geometry/correction/Undo, texture/Painter/PBR/material instances, animation basics, Locator/Null Object lifecycle, persistence, and export.

Historical live runs do not automatically prove the exact-current installed BlockIT/Codex surface or the new Route 1 bridge.

## Protected Gaps

```text
AnimationController blend-curve mutation
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animated-texture authoring
bone-binding expressions
```

## Current Boundary

Exact-current **non-local** MCP proof is green on `Local` commit `4f772e6b0dce6c7655a34539c2efea7a2d846256`. The next required evidence is the local installed-runtime gate followed by the approved elephant GLB bridge proof. No live Geometry-surface, fresh Codex-registry, Route 1 rendering, visual-quality, or Authoring Efficiency PASS is claimed.

Run the strengthened direct diagnostic first. If it reports an environment/install or Blockbench-runtime code, STOP before treating downstream tool symptoms as source defects. Only a fresh-bundle MCP contract mismatch should reopen MCP source work.
