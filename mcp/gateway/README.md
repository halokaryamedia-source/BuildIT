# BlockIT MCP Gateway

BlockIT Gateway is the stable MCP client boundary in front of the volatile Blockbench Runtime.

```text
AI client
   ↓ stdio — stable for client lifetime
BlockIT Gateway
   ↓ loopback Streamable HTTP
BlockIT Runtime inside Blockbench
```

## Canonical Authoring Model

```text
Approved Reference + Dimensions + Requirements
→ native BlockIT Geometry/UV on shared AUTHORING
→ Texturing/PBR on shared AUTHORING
→ Animation surface when required
→ Finalization
```

Gateway does not choose a modelling strategy. BlockIT has one current native Geometry authoring path.

## Stable Client Surface

```text
status
search_capabilities
describe_capability
invoke_capability
```

Blockbench/plugin reload and Runtime stage changes do not change this client-facing `tools/list`.

The Gateway intentionally exposes **tools only**. Runtime MCP resources and prompts are not proxied through the Gateway. `validator://*`, broad Runtime resources, and the Runtime prompt surface remain Direct Runtime/Inspector/conformance surfaces; normal Gateway authoring must not search for or emulate those names as capabilities.

## Capability Discovery

The live Runtime catalog is surface-filtered. Geometry and Texturing startup focus values expose the same shared AUTHORING capabilities; Animation has its own surface. Gateway search assigns internal priority only for discovery:

```text
PRIMARY      normal authoring hot path
SUPPORT      valid conditional capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  legacy/debug fallback; de-prioritized
```

Known hot-path capabilities should be invoked directly. Search is for unknown/stale capability names, not progress confirmation. `search_capabilities` returns at most **4 results by default**; `describe_capability` is for actual schema uncertainty, not reassurance before every call.

Tiering never deletes capability. Exact intent may still discover an exposed support/experimental/maintenance capability.

## Project / Tab Affinity

One Gateway process represents one authoring task and retains only:

```text
project UUID affinity
+ authoring phase affinity (geometry | texturing | animation)
```

It does not cache model objects, selections, textures, animations, Undo state, or other authored project data.

Project binding is conservative:

```text
0 open projects → no binding
1 open project  → first project-sensitive invocation binds that UUID
2+ projects     → select intended tab and call status(adopt_active_project=true) once
```

After binding, Runtime requests carry passive local affinity headers. Project-sensitive calls temporarily select and lock the bound Blockbench project for native dispatch, then restore the previous tab when appropriate. Runtime calls are serialized because Blockbench project globals are process-wide.

`create_project` is the intentional exception: the new project stays active and the Gateway adopts its returned UUID. If a bound project closes, normal tool execution fails closed with `PROJECT_CONTEXT_LOST` rather than editing another tab.

Do not poll `status` for affinity. Rebinding is exceptional.

## Authoring / Animation Handoff

Geometry↔Texturing is **not** a Gateway handoff. Both capability families remain present on the AUTHORING Runtime surface; semantic ownership decides which specialist governs the correction.

A successful `switch_authoring_phase` call is reserved for AUTHORING↔Animation:

```text
invoke switch_authoring_phase through Gateway
→ Gateway changes its own phase affinity
→ backend client/catalog invalidates
→ next request reconnects and refetches the requested surface
→ AI client continues the same task/chat
```

Gateway normalizes the result with `client_reconnect_required=false` and `new_chat_required=false`; normal AI-client use continues **without a manual AI-client reconnect**.

## Context / Result Economy

The Runtime remains the complete native/debug evidence owner. The Gateway may present a smaller continuation-oriented result when omitted material is redundant for normal authoring; it must preserve failure/uncertainty evidence needed for safe recovery.

Normal authoring does not use `status`, search, describe, repository tests, or Runtime resources as confirmation ceremonies after successful mutation.

Reliability hardening is failure-path only. The Gateway does not add heartbeat chatter, background catalog polling, automatic confirmation reads, or mutation retries.

## Reliability Invariants

- Gateway startup does not require Blockbench to be open.
- Blockbench/plugin reload does not terminate the Gateway process.
- Runtime health is checked before catalog-dependent operations.
- Changed Runtime build/profile/stage invalidates cached backend catalog.
- Each Gateway owns one project UUID affinity and one authoring-phase affinity.
- Automatic first-bind is allowed only with exactly one Blockbench project open.
- Active UI selection is not durable authority after binding.
- Cross-Gateway Runtime calls are serialized before project-tab switching.
- Bound project loss fails closed.
- Backend calls and queue depth are bounded.
- Runtime connect/catalog/capability calls have finite deadlines.
- `tools/call` is never automatically retried after transport interruption or timeout.
- Interrupted non-read-only operations return `OUTCOME_UNKNOWN`; inspect state before retrying.
- Gateway owns no authored model state.
- Gateway connects only to loopback Runtime URLs.
- Native Runtime MCP remains available for Inspector/conformance/debugging.

Default reliability settings:

```text
BLOCKIT_RUNTIME_TIMEOUT_MS=1500
BLOCKIT_RUNTIME_CONNECT_TIMEOUT_MS=5000
BLOCKIT_RUNTIME_CALL_TIMEOUT_MS=120000
BLOCKIT_RUNTIME_CLOSE_TIMEOUT_MS=2000
BLOCKIT_GATEWAY_MAX_QUEUE_DEPTH=8
```

## Run Locally

From `mcp/`:

```bash
bun run gateway
```

Runtime endpoint default:

```text
http://127.0.0.1:3000/bb-mcp
```

## AI Client Configuration

Use the Gateway instead of pointing a normal client directly at Blockbench:

```toml
[mcp_servers.blockit]
command = "bun"
args = ["run", "C:/absolute/path/to/BuildIT/mcp/gateway/index.ts"]
```

The AI client owns the Gateway process lifecycle; reloading/closing Blockbench does not replace the client-facing MCP process.

## Current Source Surface

```text
Gateway client tools      4
Runtime callable union   54
AUTHORING surface        47
Animation surface        20
```

These are active source-owned phase counts. Exact installed Runtime identity and lifecycle behavior remain verification results in `../docs/knowledge/current-validation.md`.

## Proof Boundary

Source/static tests can prove the fixed Gateway surface, request-scoped phase filtering, shared AUTHORING routing contract, loopback containment, capability priority, catalog invalidation, bounded queue/deadline semantics, retry semantics, result compaction, project-affinity state machine, and fail-closed multi-tab binding contracts. They do not prove live client-process ownership, native Blockbench tab switching/locking, persistence, visual fidelity, or reduced model usage.
