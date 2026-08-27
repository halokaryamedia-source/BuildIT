# Next Action

Updated: 2026-08-27 — fail-fast local diagnostic preparation complete; local runtime verification deferred by user

Working branch: **`Local` only**.

Current source + current proof are authority. Do not restore stale behavior merely to satisfy an old assertion.

## Current State

```text
MCP_CONNECTION_STABILITY_REPAIR_APPLIED
MCP_DIRECT_GEOMETRY_REPAIRED
PLUGIN_ID_STABLE_BLOCKIT_MCP
MCP_VERSION_STABLE_0_1_0
BUILD_BUNDLE_SHA256_FINGERPRINT_READY
FAIL_FAST_LOCAL_DIAGNOSTIC_READY
STATIC_MCP_VERIFY_GREEN_AT_968ECCB5
LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED
LOCAL_RUNTIME_TEST_DEFERRED_BY_USER
ROUTE1_BLOCKBENCH_TEST_BLOCKED
NO_ACTIVE_LOCAL_ACCEPTANCE_RUN
NO_ACTIVE_DEVELOPMENT
```

Current functional non-local proof:

```text
MCP Verify @ 968eccb5f4d5a909e5d31d1f2c175eb712875ff7: PASS

bun install --frozen-lockfile  PASS
bun run typecheck              PASS
bun run test                   PASS
bun run measure:surface        PASS
bun run build                  PASS
bun run docs:check             PASS
```

All known pre-local connection diagnosis is now prepared:

- canonical plugin artifact remains `mcp/dist/blockit_mcp.js`;
- local bundle SHA-256 must match live `/health.build_identity`;
- `/health.product.id` must identify BlockIT before tool-surface diagnosis;
- two health reads must keep the same `instance_id`, `startup_time`, and build identity;
- requested profile/phase must match before MCP protocol checks;
- environment/install and Blockbench-runtime failures STOP before `tools/list`;
- only a fresh-bundle protocol/surface mismatch reopens MCP public-contract work;
- required Geometry capability and Direct Geometry `plan_id` guards remain intact.

No reconnect daemon, new profile/router, telemetry layer, alternate transport, version cache-buster, Geometry compiler, or Route 1 workaround was added.

## Development Contract

### Goal

Preserve the current non-local-safe MCP and use one fail-fast diagnostic pass when local verification is later reactivated.

### Success Metric

```text
full MCP static gate green
+ deterministic bundle identity
+ wrong-product detection
+ stale-build fail-fast
+ process-stability check
+ phase mismatch classification
+ exact live surface comparison after preflight only
+ required Geometry surface guarded
+ Direct Geometry plan-free
+ no unnecessary architecture
```

### Forbidden Proxy / Non-Goal

Do not treat these as additional success work:

```text
more tools
version bump/cache busting
reconnect daemon/framework
auto-kill process
auto-restart Blockbench
telemetry/session logging
alternate transport
dynamic phase redesign
new Geometry compiler/planner
Route 1 model changes
more static cleanup without a new failing invariant
```

Static green still does **not** prove the installed Blockbench/Codex surface or visual quality.

### First Evidence Required

There is no active repository implementation task.

When local verification is explicitly reactivated, first evidence is:

```text
bun run verify:stateless-local
```

from the exact freshly built artifact, followed by a fresh Codex registry check only if the direct diagnostic passes.

### Failure Classification / first wrong owner

```text
BLOCKBENCH_SERVER_UNREACHABLE    → BLOCKBENCH_RUNTIME
MCP_HEALTH_UNREADABLE            → ENVIRONMENT / INSTALL
WRONG_MCP_PRODUCT                → ENVIRONMENT / INSTALL
STALE_BUILD                      → ENVIRONMENT / INSTALL
SERVER_PROCESS_UNSTABLE          → BLOCKBENCH_RUNTIME
WRONG_AUTHORING_PHASE            → ENVIRONMENT / INSTALL
MCP_HEALTH_CONTRACT_MISMATCH     → MCP_PUBLIC_CONTRACT
MCP_INITIALIZE_CONTRACT_MISMATCH → MCP_PUBLIC_CONTRACT
SURFACE_MISMATCH                 → MCP_PUBLIC_CONTRACT
GEOMETRY_CAPABILITY_MISSING      → MCP_PUBLIC_CONTRACT
RETIRED_PLAN_ID_EXPOSED          → MCP_PUBLIC_CONTRACT
```

Do not change Route 1/model logic to compensate for MCP/install defects.

### Proof Required

Completed non-local proof is the MCP Verify result above plus the final Repository Verify for this docs reconciliation.

Deferred live proof remains:

```text
exact local build + embedded build_identity
+ fail-fast direct diagnostic PASS
+ fresh Codex registry
+ representative Blockbench mutation + Undo
+ required phase handoff/reload proof
+ visual/reference quality proof when authoring begins
```

That live proof is **deferred, not passed**.

## Repository Gate

Preserve these invariants:

- canonical artifact is `mcp/dist/blockit_mcp.js`;
- 64-tool retained catalog and 27-tool default Geometry exposure remain separate concepts;
- `blockit_mcp`, version `0.1.0`, fail-closed startup, stateless loopback transport, immutable per-connection phase surface, and Geometry-owned `bone_rigging` remain preserved;
- bundle fingerprint is diagnosis only, not versioning/cache-busting/UI/session state;
- local diagnostic script remains a verifier, not a runtime manager;
- environment/runtime preflight failure must not cascade into missing-tool/schema source diagnosis;
- canonical workflow Static Footprint ceiling remains `< 9,000` characters;
- Static Footprint is not Authoring Efficiency proof.

Do not reopen repository cleanup without new evidence.

## Local Runtime Gate

**DEFERRED BY USER — DO NOT RUN YET.**

When explicitly reactivated, follow `docs/knowledge/operations/local-acceptance-runbook.md`.

Intended first pass:

```text
sync current Local
→ build mcp/dist/blockit_mcp.js
→ load only that artifact
→ Geometry active
→ bun run verify:stateless-local
```

If the direct diagnostic FAILS, obey its first classification and STOP. Do not continue to Codex registry or model authoring from downstream symptoms.

If the direct diagnostic PASSES:

```text
fresh Codex connection
→ compare fresh registry
→ representative Blockbench mutation + Undo
→ required phase handoff/reload proof
```

Required live Geometry capability remains:

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

## Route 1 Gate

ROUTE1_BLOCKBENCH_TEST_BLOCKED until the deferred Local Runtime Gate is explicitly reactivated and passes.

The approved GLB remains evidence for depth/volume/hidden sides only. Do not voxelize/import it as final geometry or create a solver/compiler layer without demonstrated evidence that owns that need.

## STOP

All currently identifiable non-local MCP connection preparation is complete. Do not continue repository development merely to make the system more sophisticated. Wait for either a new concrete static failure or explicit user reactivation of the Local Runtime Gate.