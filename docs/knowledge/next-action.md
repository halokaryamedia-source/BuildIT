# Next Action

Updated: 2026-08-27 — MCP verification hardening

Working branch: **`Local` only**.

Current source + relevant proof are authority. Do not restore stale behavior merely to satisfy an old assertion.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
MCP_HEALTH_FRESHNESS_IDENTITY_READY
STATIC_MCP_VERIFY_REPAIR_IN_PROGRESS
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
ROUTE1_BLOCKBENCH_TEST_BLOCKED
NO_ACTIVE_LOCAL_ACCEPTANCE_RUN
```

Last observed gate on `0df55bf1735ea5ac01290663cc5d9617627929aa`:

```text
typecheck: PASS
bun test: 323 PASS / 16 FAIL
measure:surface/build/docs: not reached by MCP Verify after test failure
```

The 16 failures are dominated by stale verifier coupling: assertions against comments, exact natural-language prose, implementation location, removed UI labels, or intentionally disabled tools. `default-registration-import-safe.test.ts` itself passes and correctly distinguishes the 64-tool catalog from the 27-tool Geometry exposure.

## Development Contract

### Goal

Restore a trustworthy, lightweight MCP verification gate without changing correct MCP behavior to satisfy stale tests.

### Success Metric

```text
full MCP static gate green on current Local
+ 64-tool retained Bedrock catalog preserved
+ default Geometry exposure remains 27 tools
+ Direct Geometry remains plan-free
+ blockit_mcp identity/version/fail-closed startup preserved
+ no new router/profile/framework/compatibility layer
```

### Forbidden Proxy / Non-Goal

Do not treat any of these as success by themselves:

```text
changing comments to satisfy tests
re-adding disabled generic tools
raising tool count
version bump/cache busting
bundle string presence
Route 1 model output
```

Do not modify Route 1, model logic, Geometry schemas, or phase ownership unless new evidence identifies one of them as the first wrong owner.

### First Evidence Required

Use the exact current `MCP Verify` failure, then the affected source/public contract. A stale string assertion is `STALE_TEST`; a real mismatch between advertised/runtime behavior is `MCP_PUBLIC_CONTRACT` or the nearest implementation owner.

### Failure Classification / first wrong owner

```text
stale prose/comment/location assertion → STALE_TEST
disabled tool still present in evaluator fixture → STALE_TEST
public schema/result/transport mismatch → MCP_PUBLIC_CONTRACT
Blockbench lifecycle/UI mismatch → BLOCKBENCH_RUNTIME
fresh source correct + installed live surface differs → ENVIRONMENT / INSTALL
```

### In Scope / Out of Scope

In scope: current failing regressions, discovery-eval fixture alignment, continuation cleanup, and the minimum static proof needed to reach the local gate.

Out of scope: new MCP tools, automatic reconnect, telemetry, alternate transport, compatibility layers, Route 1 redesign, texture public-contract work.

### Proof Required

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Only a completed successful current run is static PASS.

## Repository Gate

The verifier must test behavior/contracts rather than exact comments or ordinary wording. Exact prose is valid only when that text is itself a machine/public contract.

The raw discovery evaluator must include only currently enabled catalog tools. Intentionally disabled helpers such as generic screenshots/checkpoints must not remain expected cases.

The canonical workflow footprint ceiling is `< 9,000` characters, matching the existing context/payload guard and proof owner; do not maintain competing 7,000/9,000 ceilings.

If the repository gate is green, stop repository repair and continue with the local runtime gate.

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

If source/static proof is green but fresh live `tools/list` differs, STOP. Compare live `/health` + exact `tools/list` with `getMcpSurfaceToolNames("bedrock_entity", "geometry")` and classify `ENVIRONMENT / INSTALL` versus `MCP_PUBLIC_CONTRACT`. Do not patch the model or Route 1 to compensate.

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

The GLB is depth/volume/hidden-side evidence only. Do not voxelize/import it as final Blockbench geometry or create a new solver/compiler layer without a demonstrated failure that owns that need.

## STOP

Stop when the current static gate is green and the next required evidence is local runtime proof. If a new failure appears, fix only its first wrong owner; do not reopen closed cleanup or broaden the architecture.
