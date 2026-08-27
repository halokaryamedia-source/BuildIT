# Next Action

Updated: 2026-08-27 — non-local MCP preparation complete; local runtime verification deferred by user

Working branch: **`Local` only**.

Current source + current proof are authority. Do not restore stale behavior merely to satisfy an old assertion.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
BUILD_BUNDLE_SHA256_FINGERPRINT_READY
NON_LOCAL_ACCEPTANCE_PREP_COMPLETE
STATIC_MCP_VERIFY_GREEN_AT_90C9B3D4
REPOSITORY_VERIFY_GREEN_AT_90C9B3D4
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
LOCAL_RUNTIME_TEST_DEFERRED_BY_USER
ROUTE1_BLOCKBENCH_TEST_BLOCKED
NO_ACTIVE_LOCAL_ACCEPTANCE_RUN
NO_ACTIVE_DEVELOPMENT
```

Current non-local proof:

```text
MCP Verify        @ 90c9b3d42bdd82ab3ebbc3278b8e2f4402ece1f1: PASS
Repository Verify @ 90c9b3d42bdd82ab3ebbc3278b8e2f4402ece1f1: PASS

bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

All known non-local acceptance preparation is now locked before desktop testing:

- canonical plugin artifact is `mcp/dist/blockit_mcp.js` everywhere active;
- production build embeds deterministic `sha256:<64 hex>` identity while version remains `0.1.0`;
- 64 retained Bedrock callable tools and 27 default Geometry-exposed tools remain separate contracts;
- required Geometry acceptance tools are source-regression guarded;
- Direct Geometry remains free of retired `plan_id`;
- phase handoff instructions consistently require BlockIT MCP reload/restart plus client reconnect;
- existing `bun run verify:stateless-local` now compares exact bundle identity, profile/phase, surface count, initialize phase, exact `tools/list`, forbidden tools, required Geometry tools, and live plan-free Geometry schemas;
- the local acceptance runbook preserves quality/efficiency evidence boundaries and forbids invented token/latency numbers.

No reconnect daemon, new profile/router, telemetry layer, alternate transport, version cache-buster, Geometry compiler, or Route 1 workaround was added.

## Development Contract

### Goal

Preserve the current non-local-safe MCP state. Desktop Blockbench/Codex verification remains required eventually, but is explicitly deferred until the user reactivates it.

### Success Metric

```text
full MCP static gate green
+ repository contract green
+ deterministic build freshness identity
+ one canonical production artifact path
+ 64 catalog / 27 default Geometry exposure preserved
+ required Geometry acceptance surface regression-guarded
+ Direct Geometry plan-free
+ future local smoke gate deterministic
+ no unnecessary architecture
```

### Forbidden Proxy / Non-Goal

Do not treat these as additional success work:

```text
more tools
version bump/cache busting
reconnect daemon/framework
telemetry/session logging
alternate transport
new Geometry compiler/planner
Route 1 model changes
more static cleanup without a new failing invariant
```

Static green still does **not** prove the installed Blockbench/Codex surface or visual quality.

### First Evidence Required

There is no active repository implementation task. A new repository change requires a new concrete failing invariant.

When local verification is explicitly reactivated, first evidence is the one-command direct smoke result from the exact freshly built artifact, followed by a fresh Codex registry check.

### Failure Classification / first wrong owner

```text
source/static regression                        → first failing source/test owner
local bundle identity != /health identity       → ENVIRONMENT / INSTALL
server smoke PASS + fresh Codex registry differs→ ENVIRONMENT / INSTALL first
fresh server tools/list differs from source     → MCP_PUBLIC_CONTRACT
live schema exposes retired plan_id              → MCP_PUBLIC_CONTRACT
Blockbench lifecycle/load failure                → BLOCKBENCH_RUNTIME
```

Do not change Route 1/model logic to compensate for MCP/install defects.

### Proof Required

Completed non-local proof is the MCP + Repository Verify result above.

Deferred live proof remains:

```text
exact local build + embedded build_identity
+ bun run verify:stateless-local
+ fresh Codex registry
+ representative Blockbench mutation + Undo
+ required phase handoff/reload proof
+ visual/reference quality proof when authoring begins
```

That live proof is **deferred, not passed**.

## Repository Gate

Preserve these invariants:

- verifier assertions prefer owned behavior/contracts over mutable prose or formatting;
- canonical artifact is `mcp/dist/blockit_mcp.js`;
- canonical workflow Static Footprint ceiling is `< 9,000` characters;
- Static Footprint is not Authoring Efficiency proof;
- 64-tool catalog and 27-tool default Geometry surface remain separate concepts;
- `blockit_mcp`, version `0.1.0`, fail-closed startup, stateless loopback transport, immutable per-connection phase surface, and Geometry-owned `bone_rigging` remain preserved;
- bundle fingerprint is diagnosis only, not versioning/cache-busting/UI/session state;
- local smoke script remains an existing bounded verifier, not a new runtime framework.

Do not reopen repository cleanup without new evidence.

## Local Runtime Gate

**DEFERRED BY USER — DO NOT RUN YET.**

When explicitly reactivated, follow `docs/knowledge/operations/local-acceptance-runbook.md`. The intended first pass is:

```text
sync current Local
→ build mcp/dist/blockit_mcp.js
→ load only that artifact
→ Geometry active
→ bun run verify:stateless-local
→ fresh Codex connection/tool registry
```

The smoke gate must PASS before representative Blockbench mutation/Undo or Route 1 authoring.

Required live Geometry capability includes:

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

These live schemas must not expose or require `plan_id`:

```text
add_group
place_cube
modify_cube
modify_cubes_batch
modify_group
reparent_element
```

If live evidence differs, STOP and classify the first wrong owner before any patch.

## Route 1 Gate

ROUTE1_BLOCKBENCH_TEST_BLOCKED until the deferred Local Runtime Gate is explicitly reactivated and passes.

The approved GLB remains evidence for depth/volume/hidden sides only. Do not voxelize/import it as final geometry or create a solver/compiler layer without demonstrated evidence that owns that need.

## STOP

All currently identifiable non-local MCP preparation is complete. Do not continue repository development merely to make the system more sophisticated. Wait for either a new concrete static failure or explicit user reactivation of the Local Runtime Gate.