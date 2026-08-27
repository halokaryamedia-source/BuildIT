# Next Action

Updated: 2026-08-27 — static MCP gate green; local runtime verification next

Working branch: **`Local` only**.

Current source + relevant proof are authority. Do not restore stale behavior merely to satisfy an old assertion.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
MCP_HEALTH_FRESHNESS_IDENTITY_READY
STATIC_MCP_VERIFY_GREEN_AT_39C8F1DA
REPOSITORY_VERIFY_GREEN_AT_766AE308
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
ROUTE1_BLOCKBENCH_TEST_BLOCKED
NO_ACTIVE_LOCAL_ACCEPTANCE_RUN
```

Verified repository/static proof:

```text
Repository Verify @ 766ae3083afc5739dd4c0646d57bdf395a85225f: PASS
MCP Verify        @ 39c8f1dad5aab73140901d70cb052e22fca08bfd: PASS

bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

The recurring static failures were verifier drift, not evidence that the current MCP runtime contract needed another redesign. Old assertions were coupled to comments, exact prose, implementation location, removed UI labels, intentionally disabled tools, and a historical discovery threshold. The repaired gate now checks the owned behavior/contract instead.

The discovery evaluator retains the 64-tool catalog, evaluates only currently enabled expected tools, and keeps the actual routed-search requirement: default limit 8 has full recall while routed exact-name loading must improve over raw semantic search.

No MCP runtime implementation, Geometry schema, phase ownership, transport behavior, or Route 1 model logic was changed by the verification-hardening repair.

## Development Contract

### Goal

Verify that the exact-current installed BlockIT/Codex connection exposes the source-owned Geometry surface before any Route 1 authoring begins.

### Success Metric

```text
fresh /health identifies the expected current build/instance
+ active phase = Geometry
+ live tools/list matches source-owned Geometry exposure
+ required Direct Geometry tools are present
+ Direct Geometry schemas do not require plan_id
```

### Forbidden Proxy / Non-Goal

Do not treat any of these as live success by themselves:

```text
static CI green
bundle contains tool-name strings
plugin panel appears loaded
port exists
version changed
raw tool count alone
Route 1 GLB/model output
```

Do not add automatic reconnect, telemetry, cache-buster versioning, alternate transport, compatibility layers, a Geometry compiler, or a new routing framework.

### First Evidence Required

Capture the exact-current local `/health` and live `tools/list` after a clean Blockbench/Codex restart using only `mcp/dist/blockit_mcp.js` with active phase Geometry.

### Failure Classification / first wrong owner

```text
source/static green + stale/incorrect installed instance → ENVIRONMENT / INSTALL
fresh installed instance + live tools/list differs from source surface → MCP_PUBLIC_CONTRACT
live schema unexpectedly requires plan_id → MCP_PUBLIC_CONTRACT
Blockbench plugin lifecycle/load failure → BLOCKBENCH_RUNTIME
matching live surface → PASS; proceed to Route 1 gate
```

### In Scope / Out of Scope

In scope: local install/connection freshness and exact live Geometry surface verification.

Out of scope: Route 1 redesign, new MCP tools, texture public-contract work, reconnect daemon, telemetry, compatibility layers, or model changes made to hide a connection defect.

### Proof Required

```text
fresh local /health
+ fresh live tools/list
+ exact comparison with getMcpSurfaceToolNames("bedrock_entity", "geometry")
+ required schema check for Direct Geometry tools
```

Static source/CI proof cannot substitute for this live evidence.

## Repository Gate

Repository repair is complete for the current static failure set. Preserve these rules:

- verifier assertions test behavior/contracts rather than ordinary comments or wording;
- intentionally disabled helpers are not expected discovery targets;
- canonical workflow Static Footprint ceiling is `< 9,000` characters;
- Static Footprint is not Authoring Efficiency proof;
- current catalog remains 64 tools across phases; default Geometry exposure remains 27;
- `blockit_mcp`, version `0.1.0`, fail-closed startup, immutable per-connection phase surface, and Geometry-owned `bone_rigging` remain preserved.

Do not reopen repository cleanup without a new failing invariant.

## Local Runtime Gate

On the Local PC:

```text
sync/pull current Local
build final MCP bundle
close Codex completely
close Blockbench completely
ensure no old BlockIT/MCP instance owns the loopback port
remove/disable duplicate old plugin entries
load only mcp/dist/blockit_mcp.js
set active phase = Geometry
confirm /health matches the expected build/instance
open Codex and create a fresh MCP connection/task
capture live tools/list
```

Required live Geometry capability includes at minimum:

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

These live schemas must not require `plan_id`:

```text
add_group
place_cube
modify_cube
modify_cubes_batch
modify_group
reparent_element
```

If fresh live `tools/list` differs, STOP. Compare `/health` + exact live names with `getMcpSurfaceToolNames("bedrock_entity", "geometry")` and fix only the first wrong owner. Do not patch Route 1 or the model to compensate.

## Route 1 Gate

Only after the Local Runtime Gate passes:

```text
approved Minecraft reference
+ approved MultiView GLB/contact-sheet evidence
+ approved dimensions/constraints
→ existing Geometry MCP
→ primary Groups/Cubes
→ fresh capture_model_views
→ difference-first visual comparison
```

Authority order remains:

```text
1. explicit user requirement
2. actual approved Minecraft reference
3. approved MultiView GLB/contact sheet for depth/volume/hidden-side evidence
4. simplest Minecraft-buildable interpretation
```

The GLB is evidence only. Do not voxelize/import it as final geometry or add a solver/compiler layer without a demonstrated failure that owns that need.

## STOP

Repository/static repair is complete. Stop repository development until local runtime evidence identifies a new first wrong owner. If the live Geometry surface passes, proceed to the bounded Route 1 Blockbench test.
