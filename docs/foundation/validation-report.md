# Validation Report

Updated: 2026-08-27 — fail-fast local diagnostic gate statically verified; local runtime proof deferred

This file owns the **proof boundary**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts belong in `CONTEXT.md`.

## Current Evidence Summary

```text
BEDROCK CALLABLE CATALOG:                 64 tools across phases
DEFAULT CLIENT EXPOSURE:                  MCP Core + Geometry (27 tools)
ACTIVE PHASE CONTRACT:                    SOURCE + FULL MCP STATIC PROOF
CODEX FIRST-CALL LEGIBILITY:              SOURCE + FULL MCP STATIC PROOF
BUILD BUNDLE IDENTITY:                    SOURCE + FULL MCP STATIC PROOF
FAIL-FAST LOCAL DIAGNOSTIC CONTRACT:      SOURCE + FULL MCP STATIC PROOF
LATEST FULL MCP VERIFY:                   GREEN @ 968eccb5f4d5a909e5d31d1f2c175eb712875ff7
LAST OBSERVED FULL CANONICAL GREEN:       968eccb5f4d5a909e5d31d1f2c175eb712875ff7
LATEST REPOSITORY VERIFY:                 pending docs reconciliation gate
ACCEPTED LIVE BASELINE:                   2026-08-12 Blockbench 5.1.6
CURRENT HARDENING LIVE RETEST:            DEFERRED BY USER; LOCAL PROOF REQUIRED
CURRENT MODEL-QUALITY CLAIM:              LOCAL PROOF REQUIRED
```

Current static proof must not be confused with live Blockbench behavior. Source/typecheck/tests/build/docs checks can prove phase ownership, schemas, buildability, generated-doc freshness, source-owned phase surfaces, bundle-fingerprint generation, and diagnostic classification behavior; they cannot prove visual fidelity, installed-plugin freshness, a fresh Codex registry, live Blockbench mutation/Undo, playback, future call efficiency, or Authoring Efficiency.

## Current Agent-Contract Proof

Current source implements:

```text
MCP CORE + exactly one ACTIVE PHASE
GEOMETRY | TEXTURING | ANIMATION
```

Runtime instructions name the active phase, preserve the Bedrock unit/axis invariant, explain foreign-phase absence, and require `HANDOFF_REQUIRED` instead of foreign-tool search. Phase transitions remain deliberate reload/reconnect boundaries rather than in-process surface mutation.

The current full MCP gate passed at `968eccb5f4d5a909e5d31d1f2c175eb712875ff7`:

```text
bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

The current full test suite has no failing contract tests.

Current regression coverage proves, among other things:

- missing phase defaults to Geometry while explicit invalid phase fails closed;
- default Geometry exposure is Core + Geometry only (27 tools);
- retained callable catalog remains 64 tools across phases;
- required Geometry acceptance tools remain present in the source-owned Geometry surface;
- Direct Geometry remains free of the retired `plan_id` contract;
- canonical active plugin path is `mcp/dist/blockit_mcp.js`;
- `/health.build_identity`, `product.version`, `instance_id`, and `startup_time` have separate responsibilities;
- active operator guidance requires BlockIT MCP reload/restart plus client reconnect at phase handoff;
- loopback/stateless transport, Origin/Host guards, request bounds, socket cleanup, and fail-closed TCP bind retain regression coverage;
- the existing local smoke script is import-safe for regression tests and remains a diagnostic verifier rather than a new runtime framework;
- local diagnostic preflight classifies the first known wrong owner before downstream surface diagnosis.

## Fail-Fast Local Diagnostic Proof

The existing `bun run verify:stateless-local` now separates environment/runtime failures from real MCP public-contract failures.

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

Environment/install and Blockbench-runtime failures STOP before downstream `tools/list` diagnosis. This prevents one stale plugin/process from being misread as several missing-tool/schema bugs.

For Geometry, the required acceptance capability remains:

```text
create_project
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

The plan-free schema guard remains:

```text
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

Identity ownership remains:

```text
product.version    = release/development version; currently 0.1.0
build_identity     = exact built-bundle SHA-256 identity
instance_id        = running server-process identity
startup_time       = running server-process start time
```

The fingerprint is diagnosis only. It is not a cache-buster, release version, session key, UI state, telemetry stream, or reconnect mechanism.

## Discovery / Static Footprint Proof

Current routed exact-name discovery remains:

```text
raw semantic stress:
top_1_accuracy  0.5385
top_3_recall    0.7788
top_8_recall    0.8846
MRR             0.6790

routed exact-name loading:
top_1_accuracy  0.8173
top_3_recall    0.9327
top_8_recall    1.0000
MRR             0.8844
top_8_misses    0
```

Raw semantic search remains a stress metric; the normal path is active-phase routing first, then exact routed spec loading when needed.

## Surface Guard

```text
retained Bedrock callable catalog  64 tools
default Geometry exposure           27 tools
initialize instructions             <= 700 characters
catalog tools/list budget           <= 82,000 characters
catalog input schemas               <= 58,000 characters
catalog descriptions                <= 11,500 characters
max per-tool payload                <= 3,200 characters
canonical workflow source           < 9,000 characters
```

These are **Static Footprint** regression ceilings. Character counts are regression ceilings, not client token measurements and not Authoring Efficiency proof.

## Visual / Reference Proof Rule

Reference-driven approval requires:

```text
actual approved reference image
+ fresh current-revision model image(s)
+ difference-first comparison
```

Static CI cannot prove visual fidelity. Paths, filenames, manifests, prose, memory, coordinates, bounds, tool success, and scalar similarity cannot independently justify visual `PASS`.

## Authoring Efficiency Rule

Authoring Efficiency is evaluated only for an accepted result:

```text
QUALITY FAIL → no efficiency success claim
QUALITY PASS → compare justified vs unnecessary work → Cost to Accepted Result
```

Useful runtime observations include Discovery calls, Redundant readbacks, tool-search misses, batching, capture calls, Correction attempts, recovery, Same-cause retries, and whether corrections are `IMPROVED`, `UNCHANGED`, or `REGRESSED`. Do not invent token or latency numbers; unknown values remain `UNVERIFIED`.

## Current Static / Source State

Current retained source includes:

- 64-tool normal Bedrock callable catalog across phases;
- 27-tool default Core + Geometry exposure;
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

The hardening did **not** add a reconnect daemon, registration profile, router, telemetry layer, alternate transport, compatibility framework, version cache-buster, Geometry compiler, or Route 1 workaround.

## Local Runtime History

### ACCEPTED LIVE BASELINE — 2026-08-12

Historical live coverage included the then-current transport/tool surface, geometry/correction/Undo, texture/Painter/PBR/material instances, animation basics, Locator/Null Object lifecycle, persistence, and export.

Historical live runs do not automatically prove the exact-current installed BlockIT/Codex surface.

## Protected Gaps

```text
AnimationController blend-curve mutation
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animated-texture authoring
bone-binding expressions
```

## Current Boundary

All currently identifiable **non-local** MCP acceptance preparation is complete and the latest full MCP gate is green at `968eccb5f4d5a909e5d31d1f2c175eb712875ff7`. The local installed-runtime retest is **DEFERRED BY USER** and remains `LOCAL PROOF REQUIRED`; no live Geometry-surface, Codex-registry, visual-quality, or Authoring Efficiency PASS is claimed.

When the user later reactivates local verification, run the strengthened direct diagnostic first. If it reports an environment/install or Blockbench-runtime code, STOP before treating downstream tool symptoms as source defects. Only a fresh-bundle MCP contract mismatch should reopen MCP source work.