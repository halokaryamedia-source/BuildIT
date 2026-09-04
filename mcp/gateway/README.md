# BlockIT MCP Gateway

BlockIT Gateway is the stable MCP client boundary in front of the volatile Blockbench Runtime.

```text
Codex / MCP client
        |
        | stdio — stable for client lifetime
        v
BlockIT Gateway
        |
        | Streamable HTTP — loopback only
        v
BlockIT Runtime inside Blockbench
```

## Canonical Authoring Model

Gateway does not choose the modelling strategy. Normal authoring is:

```text
Approved Reference + Dimensions + Requirements
→ user selects DIRECT | 3D_ASSISTED
→ Geometry
→ Texturing
→ Animation when required
→ Finalization
```

`DIRECT` is normal reference-guided Geometry.

`3D_ASSISTED` is one package: Shape Reconstruction → PrimitiveAnything → dedicated atomic Cuboid Materialization → Semantic Geometry Cleanup. `manage_geometry_reference` may be used as supporting comparison evidence inside 3D-Assisted Geometry, but it is not a separate route.

## Stable Client Surface

```text
status
search_capabilities
describe_capability
invoke_capability
```

Blockbench/plugin reload and Runtime phase changes do not change this client-facing `tools/list`.

## Capability Discovery

The live Runtime catalog is phase-filtered. Gateway search assigns internal priority only for discovery:

```text
PRIMARY      normal authoring hot path
SUPPORT      valid conditional capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  legacy/debug fallback; de-prioritized
```

Tiering never deletes capability. Exact intent may still discover an exposed support/experimental/maintenance capability.

## Phase Handoff

A successful Runtime `switch_authoring_phase` call is Gateway-managed:

```text
invoke switch_authoring_phase
→ Runtime phase changes
→ Gateway invalidates backend client/catalog
→ next capability request reconnects and refetches
→ continue same task/chat
```

Gateway normalizes the result with `client_reconnect_required=false` and `new_chat_required=false`. Direct Runtime clients used for debug/conformance bypass this protection.

## Reliability Invariants

- Gateway startup does not require Blockbench to be open.
- Blockbench/plugin reload does not terminate the Gateway process.
- Runtime health is checked before catalog-dependent operations.
- Changed Runtime build/profile/phase invalidates cached backend catalog.
- Backend calls are serialized to avoid concurrent editor mutations.
- `tools/call` is never automatically retried after transport interruption.
- Interrupted non-read-only operations return `OUTCOME_UNKNOWN`; inspect current model state before retrying.
- Gateway owns no Cube, Group, texture, animation, Undo, or project state.
- Gateway connects only to localhost/loopback Runtime URLs.
- Native Runtime MCP remains available for Inspector/conformance/debugging.

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

## Codex Configuration

Use the Gateway instead of pointing Codex directly at Blockbench. Use an absolute repository path.

```toml
[mcp_servers.blockit]
command = "bun"
args = ["run", "C:/absolute/path/to/BuildIT/mcp/gateway/index.ts"]
```

Codex owns the Gateway process lifecycle. Reloading/closing Blockbench does not replace the Codex-facing MCP process.

## Current Surface

```text
Gateway client tools     4
Runtime callable union  51
Geometry surface        25
Texturing surface       35
Animation surface       19
```

## Proof Boundary

Source/static tests prove the fixed Gateway surface, loopback containment, capability priority, catalog invalidation, and retry semantics. They do not prove the live client survives Runtime lifecycle changes.

The next local gate is one continuous Codex task that starts with Blockbench closed, observes Runtime offline→online, switches Geometry↔Texturing, survives plugin reload and Blockbench close/open, and performs no manual Codex MCP reconnect or new chat.
