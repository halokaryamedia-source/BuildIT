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

Gateway does not choose the modelling strategy.

```text
Approved Reference + Dimensions + Requirements
→ user selects DIRECT | 3D_ASSISTED
→ shared AUTHORING surface: Geometry/UV ↔ Texturing/PBR
→ Animation surface when required
→ Finalization
```

`DIRECT` is normal reference-guided Geometry.

`3D_ASSISTED` is one package: Shape Reconstruction → PrimitiveAnything → dedicated atomic Cuboid Materialization → Semantic Geometry Cleanup. `manage_geometry_reference` may support comparison inside 3D-Assisted Geometry, but it is not a separate route.

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

Known hot-path capabilities should be invoked directly. Search is for unknown/stale capability names, not progress confirmation. `search_capabilities` returns at most **4 results by default**; callers may explicitly request a larger bound when truncation is material. `describe_capability` is for actual schema uncertainty, not reassurance before every call.

Fallback search also recognizes compact workflow aliases for exact-pixel transactions, render/alpha profiles, native Animation properties/Molang, controller blend composition, and Animation effects. These aliases improve recovery only; they do not replace direct routing from the active specialist.

Tiering never deletes capability. Exact intent may still discover an exposed support/experimental/maintenance capability.

## Project / Tab Affinity

One Gateway process represents one authoring task and retains only two lightweight routing values:

```text
project UUID affinity
+ authoring phase affinity (geometry | texturing | animation)
```

It does not cache model objects, selections, textures, animations, Undo state, or other authored project data.

Project binding is intentionally conservative:

```text
0 open projects
→ no binding

1 open project
→ first project-sensitive Runtime invocation reuses the existing health probe
→ that single project UUID becomes this Gateway's affinity

2+ open projects
→ automatic first-bind is refused before authoring
→ select the intended Blockbench tab
→ status(adopt_active_project=true) once
→ continue normal authoring
```

The UUID and phase are then carried as passive local HTTP headers on the Runtime requests that already occur. Binding and phase isolation add no heartbeat, polling, background synchronizer, or extra MCP round trip.

When another project tab is active, a project-sensitive Runtime `tools/call` temporarily activates the Gateway-bound project through Blockbench's native `ModelProject.select()`. The target tab is locked for the duration of the call so user tab switching/close cannot redirect a mutation midway. After ordinary calls, Blockbench restores the previously active project tab. Runtime `tools/call` requests are serialized across Gateway processes because Blockbench project globals are process-wide.

`create_project` is the intentional exception: the newly created project remains active and the Gateway automatically adopts its returned project UUID. No manual rebind is required.

If the bound project was closed, the Gateway fails closed with `PROJECT_CONTEXT_LOST` **before normal tool execution** instead of silently editing whichever tab happens to be active. To intentionally move an existing chat/Gateway to another open tab:

```text
select intended Blockbench project tab manually
→ status(adopt_active_project=true) once
→ continue normal direct capability calls
```

Do not poll `status` for project affinity. Binding/rebinding is a one-time or exceptional action, not part of the authoring hot path.

For multiple simultaneous chats, bind each Gateway once to its intended Blockbench tab. Each Gateway then keeps its own project UUID and phase affinity; Runtime serialization prevents project-bound tool calls from racing Blockbench's process-wide globals.

## Authoring / Animation Handoff

Geometry↔Texturing is **not** a Gateway handoff. Both capability families remain present on the AUTHORING Runtime surface; semantic ownership decides which specialist governs the correction.

A successful `switch_authoring_phase` call is reserved for the AUTHORING↔Animation boundary and remains Gateway-managed:

```text
invoke switch_authoring_phase through Gateway A
→ Gateway A changes only its own phase affinity
→ Gateway A invalidates its backend client/catalog
→ next capability request reconnects and refetches A's requested surface
→ Gateway B/C/D/E keep their own phase surfaces unchanged
→ AI client continues the same task/chat
```

The backend reconnect above is internal to the Gateway. Gateway normalizes the result with `client_reconnect_required=false` and `new_chat_required=false`; normal AI-client use does not manually reconnect. Direct Runtime/Inspector clients without Gateway phase affinity retain the Runtime-global phase behavior for debug/conformance compatibility.

## Context / Result Economy

The Runtime remains the complete native/debug evidence owner. The Gateway may present a smaller continuation-oriented result when the omitted material is redundant for normal AI authoring; it must preserve failure/uncertainty evidence needed to recover safely.

Normal authoring does not use `status`, search, describe, repository tests, or Runtime resources as confirmation ceremonies after a successful mutation.

Reliability hardening is deliberately **failure-path only**. The Gateway does not add heartbeat chatter, background catalog polling, automatic confirmation reads, or mutation retries. Queue/timeout counters are passive and appear only when `status` is explicitly requested. Project and phase affinity piggyback on the health probe already required by Gateway catalog safety and on the existing Runtime request itself.

## Reliability Invariants

- Gateway startup does not require Blockbench to be open.
- Blockbench/plugin reload does not terminate the Gateway process.
- Runtime health is checked before catalog-dependent operations.
- Changed Runtime build/profile/stage invalidates cached backend catalog.
- Each Gateway owns one lightweight project UUID affinity and one lightweight authoring-phase affinity.
- Automatic project first-bind is allowed only when exactly one Blockbench project is open; multi-tab authoring requires one explicit bind before mutation.
- Active UI selection is not durable authority after binding.
- A Gateway phase handoff changes that Gateway's requested Runtime surface, not another Gateway's authoring surface.
- Cross-Gateway Runtime `tools/call` execution is serialized before project-tab switching.
- A queued cross-Gateway tool call re-checks socket liveness immediately before native dispatch; an already-disconnected waiter is dropped before any Blockbench operation can execute late.
- Bound project loss fails closed; `create_project` alone automatically advances affinity to its new project UUID.
- Backend calls are serialized to avoid concurrent editor mutations.
- The serialized Gateway queue is bounded so a stalled Runtime cannot grow Gateway memory without limit.
- Runtime connect/catalog calls and capability calls have finite configurable deadlines; the normal hot path performs no extra network round trip for those guards.
- Incomplete local HTTP requests have a finite idle deadline; that input timeout is disabled after a complete MCP request is parsed so legitimate long-running authoring uses the Gateway/SDK call deadline instead.
- `tools/call` is never automatically retried after transport interruption or timeout.
- Interrupted or timed-out non-read-only operations return `OUTCOME_UNKNOWN`; inspect current model state before retrying.
- Gateway cleanup has its own short deadline so a dead backend cannot pin shutdown indefinitely.
- Gateway owns no Cube, Group, texture, animation, Undo, or authored project state.
- Gateway connects only to localhost/loopback Runtime URLs.
- Native Runtime MCP remains available for Inspector/conformance/debugging.

Default reliability settings:

```text
BLOCKIT_RUNTIME_TIMEOUT_MS=1500          # /health only
BLOCKIT_RUNTIME_CONNECT_TIMEOUT_MS=5000  # connect + tools/list
BLOCKIT_RUNTIME_CALL_TIMEOUT_MS=120000   # one Runtime capability call
BLOCKIT_RUNTIME_CLOSE_TIMEOUT_MS=2000    # best-effort backend cleanup
BLOCKIT_GATEWAY_MAX_QUEUE_DEPTH=8        # waiting operations; active call is separate
```

These settings are intentionally conservative. Increase the call timeout only for a proven legitimate long-running capability; do not disable mutation uncertainty handling or add automatic retries to hide slow/stalled Runtime behavior.

## Run Locally

From `mcp/`:

```bash
bun run gateway
```

Runtime endpoint default:

```text
http://127.0.0.1:3000/bb-mcp
```

Optional loopback override:

```text
BLOCKIT_RUNTIME_URL=http://127.0.0.1:3000/bb-mcp
```

## AI Client Configuration

Use the Gateway instead of pointing a normal client directly at Blockbench. Use an absolute repository path.

```toml
[mcp_servers.blockit]
command = "bun"
args = ["run", "C:/absolute/path/to/BuildIT/mcp/gateway/index.ts"]
```

A project-scoped client configuration may carry the same command when the repository is trusted. The AI client owns the Gateway process lifecycle; reloading/closing Blockbench does not replace the client-facing MCP process.

## Current Source Surface

```text
Gateway client tools     4
Runtime callable union  54
AUTHORING surface       49
Animation surface       18
```

These are source-owned counts. Exact installed Runtime identity and lifecycle behavior remain verification results in `../docs/knowledge/current-validation.md`.

## Proof Boundary

Source/static tests can prove the fixed Gateway surface, request-scoped phase filtering, shared AUTHORING routing contract, loopback containment, capability priority, catalog invalidation, bounded queue/deadline semantics, retry semantics, result compaction, project-affinity state machine, and fail-closed multi-tab binding contracts. They do not prove live client-process ownership, native Blockbench tab switching/locking, persistence, visual fidelity, or reduced model usage.

The pending live gate should exercise the real operating ceiling where practical: up to five Gateway-backed jobs/projects, explicit multi-tab binding, cross-project mutation isolation, independent AUTHORING/Animation phase state, plugin lifecycle, native authoring/history, and persistence where applicable—without a manual AI-client reconnect or new chat.
