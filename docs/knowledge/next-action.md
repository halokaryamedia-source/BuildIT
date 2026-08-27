# Next Action

Updated: 2026-08-27 — static safety hardening complete; local runtime verification deferred by user

Working branch: **`Local` only**.

Current source + current proof are authority. Do not restore stale behavior merely to satisfy an old assertion.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
BUILD_BUNDLE_SHA256_FINGERPRINT_READY
STATIC_MCP_VERIFY_GREEN_AT_F2DB2887
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
LOCAL_RUNTIME_TEST_DEFERRED_BY_USER
ROUTE1_BLOCKBENCH_TEST_BLOCKED
NO_ACTIVE_LOCAL_ACCEPTANCE_RUN
NO_ACTIVE_DEVELOPMENT
```

Current static proof:

```text
MCP Verify @ f2db288764382d4e4a2c6daca80e65359ad670a4: PASS

bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

The production build now embeds a deterministic `sha256:<64 hex>` identity derived from the emitted MCP bundle. `/health.build_identity` reports that bundle identity; unbundled source falls back to `source`. `product.version` remains the release/development version `0.1.0`, while `instance_id` + `startup_time` remain process identity. Do not use version bumps as cache invalidation.

The recurring static failures were verifier drift, not evidence that the MCP needed another redesign. Verifiers now prefer owned behavior/invariants over comments, log wording, implementation location, removed UI labels, disabled tools, or historical metric thresholds.

Catalog and phase architecture remain unchanged: 64 retained Bedrock callable tools across phases; default Geometry exposure remains 27.

## Development Contract

### Goal

Preserve the exact-current static-safe MCP without further architecture work. Local installed-runtime verification remains required eventually, but is explicitly deferred until the user reactivates it.

### Success Metric

```text
full MCP static gate green
+ production bundle has deterministic SHA-256 health identity
+ version remains 0.1.0 and separate from build identity
+ 64-tool catalog / 27-tool default Geometry exposure preserved
+ Direct Geometry remains plan-free
+ fail-closed bind/startup preserved
+ verifier contracts are behavior-owned rather than ordinary prose-owned
+ no new router/profile/daemon/telemetry/compatibility layer
```

### Forbidden Proxy / Non-Goal

Do not treat any of these as additional success work:

```text
more tools
version bump/cache busting
new reconnect framework
telemetry/session logging
alternate transport
new Geometry compiler/planner
Route 1 model changes
repeated static cleanup without a new failing invariant
```

Static green still does **not** prove the installed Blockbench/Codex surface.

### First Evidence Required

There is no active repository implementation task. If a new static failure appears, use that exact current CI failure and inspect its first wrong owner.

When the user later reactivates local verification, the first evidence is exact-current `/health` plus live `tools/list` from a clean Blockbench/Codex restart.

### Failure Classification / first wrong owner

```text
stale prose/comment/location assertion        → STALE_TEST
build output lacks/changes fingerprint contract→ BUILD_TOOLING
source/static green + stale installed instance → ENVIRONMENT / INSTALL
fresh live tools/list differs from source       → MCP_PUBLIC_CONTRACT
Blockbench plugin lifecycle/load failure        → BLOCKBENCH_RUNTIME
```

Do not change Route 1 or model logic to compensate for an MCP/install defect.

### Proof Required

Completed static proof is the full MCP Verify sequence above. Live proof remains:

```text
fresh local /health
+ fresh live tools/list
+ comparison with getMcpSurfaceToolNames("bedrock_entity", "geometry")
+ Direct Geometry schema check for retired plan_id
```

That live proof is **deferred, not passed**.

## Repository Gate

Current repository/static repair is complete. Preserve these invariants:

- verifier assertions test behavior/contracts rather than ordinary comments or log wording;
- intentionally disabled helpers are not expected discovery targets;
- canonical workflow Static Footprint ceiling is `< 9,000` characters;
- Static Footprint is not Authoring Efficiency proof;
- 64-tool catalog and 27-tool default Geometry surface remain separate concepts;
- `blockit_mcp`, version `0.1.0`, fail-closed startup, immutable per-connection phase surface, and Geometry-owned `bone_rigging` remain preserved;
- bundle fingerprint is diagnosis only, not a versioning or cache-busting mechanism;
- build fingerprint stays out of the normal Blockbench panel/UI.

Do not reopen static cleanup without new evidence.

## Local Runtime Gate

**DEFERRED BY USER — DO NOT RUN YET.**

When explicitly reactivated:

```text
sync current Local
build final MCP bundle and note printed sha256 build identity
close Codex + Blockbench completely
ensure no old MCP owns the loopback port
load only mcp/dist/blockit_mcp.js
set active phase = Geometry
confirm /health build_identity matches the locally built bundle
open a fresh Codex connection
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

If live names/schemas differ, STOP and classify the first wrong owner before any patch.

## Route 1 Gate

ROUTE1_BLOCKBENCH_TEST_BLOCKED until the deferred Local Runtime Gate is explicitly reactivated and passes.

The approved GLB remains evidence for depth/volume/hidden sides only. Do not voxelize/import it as final geometry or create a solver/compiler layer without demonstrated evidence that owns that need.

## STOP

Static safety hardening is complete. Do not continue repository development merely to make the MCP look more sophisticated. Wait for either a new concrete static failure or explicit user reactivation of the Local Runtime Gate.