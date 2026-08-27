# Validation Report

Updated: 2026-08-27 — non-local MCP preparation verified; local runtime proof deferred

This file owns the **proof boundary**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts belong in `CONTEXT.md`.

## Current Evidence Summary

```text
BEDROCK CALLABLE CATALOG:                 64 tools across phases
DEFAULT CLIENT EXPOSURE:                  MCP Core + Geometry (27 tools)
ACTIVE PHASE CONTRACT:                    SOURCE + FULL MCP STATIC PROOF
CODEX FIRST-CALL LEGIBILITY:              SOURCE + FULL MCP STATIC PROOF
BUILD BUNDLE IDENTITY:                    SOURCE + FULL MCP STATIC PROOF
DEFERRED LOCAL SMOKE CONTRACT:            SOURCE + FULL MCP STATIC PROOF
LATEST FULL MCP VERIFY:                   GREEN @ 90c9b3d42bdd82ab3ebbc3278b8e2f4402ece1f1
LAST OBSERVED FULL CANONICAL GREEN:       90c9b3d42bdd82ab3ebbc3278b8e2f4402ece1f1
LATEST REPOSITORY VERIFY:                 GREEN @ 90c9b3d42bdd82ab3ebbc3278b8e2f4402ece1f1
ACCEPTED LIVE BASELINE:                   2026-08-12 Blockbench 5.1.6
CURRENT HARDENING LIVE RETEST:            DEFERRED BY USER; LOCAL PROOF REQUIRED
CURRENT MODEL-QUALITY CLAIM:              LOCAL PROOF REQUIRED
```

Current static proof must not be confused with live Blockbench behavior. Source/typecheck/tests/build/docs checks can prove phase ownership, schemas, buildability, generated-doc freshness, source-owned phase surfaces, bundle-fingerprint generation, and the deferred smoke-gate contract; they cannot prove visual fidelity, installed-plugin freshness, a fresh Codex registry, live Blockbench mutation/Undo, playback, future call efficiency, or Authoring Efficiency.

## Current Agent-Contract Proof

Current source implements:

```text
MCP CORE + exactly one ACTIVE PHASE
GEOMETRY | TEXTURING | ANIMATION
```

Runtime instructions name the active phase, preserve the Bedrock unit/axis invariant, explain foreign-phase absence, and require `HANDOFF_REQUIRED` instead of foreign-tool search. Phase transitions remain deliberate reload/reconnect boundaries rather than in-process surface mutation.

The current full MCP gate passed at `90c9b3d42bdd82ab3ebbc3278b8e2f4402ece1f1`:

```text
bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

Repository Verify also passed on the same commit. The current full test suite has no failing contract tests.

Current regression coverage proves, among other things:

- missing phase defaults to Geometry while explicit invalid phase fails closed;
- default Geometry exposure is Core + Geometry only (27 tools);
- retained callable catalog remains 64 tools across phases;
- required Geometry acceptance tools are present in the source-owned Geometry surface;
- Direct Geometry remains free of the retired `plan_id` contract;
- Geometry/Texturing/Animation prompt bodies exclude foreign-phase authoring routes;
- specialists do not direct-call foreign-phase mutation;
- routed exact-name discovery retains full recall at default limit 8;
- loopback/stateless transport, Origin/Host guards, request bounds, active socket cleanup, and fail-closed TCP bind retain regression coverage;
- build output receives a deterministic SHA-256 identity without changing release version;
- `/health.build_identity`, `product.version`, `instance_id`, and `startup_time` have separate responsibilities;
- canonical active plugin path is `mcp/dist/blockit_mcp.js`;
- active operator guidance requires BlockIT MCP reload/restart plus client reconnect at phase handoff;
- the local acceptance runbook preserves observable quality/efficiency vocabulary and explicitly says: `Do not invent token or latency numbers`.

## Non-Local Acceptance Preparation Proof

Everything identifiable before desktop execution is now prepared and regression-guarded.

The existing `bun run verify:stateless-local` script was strengthened without adding a new runtime framework. When local testing is later reactivated, it can check in one bounded pass:

```text
/health stateless JSON mode
live profile + requested authoring phase
local dist/blockit_mcp.js embedded build_identity == /health.build_identity
health exposed_tool_count == source-owned phase count
initialize reports expected ACTIVE PHASE
live tools/list exactly == getMcpSurfaceToolNames(profile, phase)
risky_eval / from_geo_json absent
required Geometry acceptance tools present
Direct Geometry schemas do not expose or require plan_id
```

For Geometry, the required acceptance capability is:

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

The plan-free schema guard covers:

```text
add_group
place_cube
modify_cube
modify_cubes_batch
modify_group
reparent_element
```

This reduces the eventual local session to artifact loading + one direct smoke + fresh Codex registry + representative Blockbench behavior. It does not turn a static check into live proof.

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
- `risky_eval` and `from_geo_json` disabled.

The non-local hardening did **not** add a reconnect daemon, registration profile, router, telemetry layer, alternate transport, compatibility framework, version cache-buster, Geometry compiler, or Route 1 workaround.

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

All currently identifiable **non-local** MCP acceptance preparation is complete and statically verified at `90c9b3d42bdd82ab3ebbc3278b8e2f4402ece1f1`. The local installed-runtime retest is **DEFERRED BY USER** and remains `LOCAL PROOF REQUIRED`; no live Geometry-surface, Codex-registry, visual-quality, or Authoring Efficiency PASS is claimed.

When the user later reactivates local verification, follow `docs/knowledge/operations/local-acceptance-runbook.md`: build the exact artifact, run the strengthened direct smoke, verify a fresh Codex registry, then perform only the representative Blockbench behavior needed by the gate. Until then, do not continue static development without a new concrete failing invariant.