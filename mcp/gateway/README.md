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

## Canonical authoring model

The Gateway does not create a second authoring workflow. Normal authoring remains:

```text
approved image + optional 3D Evidence
→ Geometry
→ Texturing
→ Animation when required
```

Optional 3D Evidence is a Geometry-only Runtime capability, not a separate route.

## Stable client surface

```text
status
search_capabilities
describe_capability
invoke_capability
```

Blockbench/plugin reload and Runtime phase changes do not change this client-facing `tools/list`.

## Capability discovery

The live Runtime catalog is phase-filtered. Gateway search assigns internal priority only for discovery:

```text
PRIMARY      normal authoring hot path
SUPPORT      valid conditional capability
EXPERIMENTAL explicit matching intent only
MAINTENANCE  legacy/debug fallback; de-prioritized
```

Tiering never deletes capability. Exact intent can still discover an exposed support/experimental/maintenance capability. Empty discovery omits maintenance fallbacks.

`manage_geometry_reference` is experimental optional 3D Evidence. Generic UI compatibility such as `trigger_action`, `emulate_clicks`, and `fill_dialog` is maintenance/debug fallback and must not outrank authored BlockIT operations.

## Phase handoff

A successful Runtime `switch_authoring_phase` call is Gateway-managed:

```text
invoke switch_authoring_phase
→ Runtime phase changes
→ Gateway invalidates backend client/catalog
→ next capability request reconnects and refetches
→ continue same task/chat
```

The Gateway normalizes the result with `client_reconnect_required=false` and `new_chat_required=false`. Direct Runtime clients used for debug/conformance bypass this protection.

## Reliability invariants

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

## Run locally

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

## Codex configuration

Use the Gateway instead of pointing Codex directly at Blockbench. Use an absolute repository path.

```toml
[mcp_servers.blockit]
command = "bun"
args = ["run", "C:/absolute/path/to/BuildIT/mcp/gateway/index.ts"]
```

Codex owns the Gateway process lifecycle. Reloading/closing Blockbench does not replace the Codex-facing MCP process.

## Proof boundary

Source/static tests can prove fixed Gateway surface, loopback containment, capability priority, catalog invalidation, and retry semantics. The live acceptance gate remains one continuous Codex task surviving Runtime phase switches, plugin reloads, Blockbench close/open, and backend rebuilds without Codex restart/new chat/manual MCP reconnect.
