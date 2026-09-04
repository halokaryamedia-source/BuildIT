# BlockIT MCP Gateway

BlockIT Gateway is the stable MCP client boundary in front of the volatile Blockbench runtime.

```text
Codex / MCP client
        |
        | stdio (stable for the client lifetime)
        v
BlockIT Gateway
        |
        | Streamable HTTP, loopback only
        v
BlockIT Runtime inside Blockbench
```

## Why this boundary exists

Blockbench and its plugin are expected to reload during development and normal editor maintenance. A client connection must not share that lifecycle. The Gateway therefore starts independently, exposes a deliberately small fixed MCP surface, and reconnects to the runtime lazily on the next operation.

The normal Gateway tool list is intentionally stable:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Backend tools may still change. In this first foundation, the backend MCP tool name is also its capability ID. A later capability manifest can map stable semantic capability IDs to changing backend implementation names without changing the four Gateway tools.

## Reliability invariants

- Gateway startup does not require Blockbench to be open.
- Blockbench/plugin reload does not terminate the Gateway process.
- Runtime health is checked before catalog-dependent operations.
- A changed runtime build/profile/phase invalidates the cached backend catalog.
- A successful `switch_authoring_phase` immediately drops only the Gateway's Runtime client/catalog; the Codex-facing stdio process remains alive and refreshes on the next capability request.
- Gateway backend calls are serialized to avoid concurrent editor mutations.
- `tools/call` is never automatically retried after a transport interruption.
- An interrupted non-read-only operation returns `OUTCOME_UNKNOWN`; inspect model state before retrying.
- Gateway owns no Cube, Group, texture, animation, Undo, or project state. Blockbench remains authoritative.
- Gateway connects only to localhost/loopback runtime URLs.
- Native BlockIT MCP remains available for Inspector, conformance, and runtime debugging.

## Run locally

From `mcp/`:

```bash
bun run gateway
```

The runtime endpoint defaults to:

```text
http://127.0.0.1:3000/bb-mcp
```

Override only with another loopback URL:

```text
BLOCKIT_RUNTIME_URL=http://127.0.0.1:3000/bb-mcp
```

## Codex configuration

Use the Gateway as the configured MCP server instead of pointing Codex directly at the Blockbench HTTP endpoint. Use an absolute repository path; forward slashes are convenient on Windows TOML.

```toml
[mcp_servers.blockit]
command = "bun"
args = ["run", "C:/absolute/path/to/BuildIT/mcp/gateway/index.ts"]
```

Codex then owns the Gateway process lifecycle. Closing/reloading Blockbench does not replace the Codex-facing MCP process.

## Current foundation boundary

Source/static contracts are ready, but the Gateway is not promoted to a live-proven canonical client boundary until one continuous Codex task survives repeated BlockIT runtime rebuild/reload and Blockbench close/open cycles with no Codex restart, new chat, or manual MCP reconnect. Only after that connection gate passes should broader stable domain tools such as Geometry/Texturing/Animation facades be promoted.
