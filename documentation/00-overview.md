# 00-overview

## Purpose
- Deliver a local desktop launcher that prepares Blockbench MCP workspace prerequisites in a single flow.
- Provide transparent status and diagnostics for endpoint discovery, MCP startup, and Codex bridge readiness.

## Scope
- Desktop UI flow for setup, launch, monitoring, and settings.
- Local runtime orchestration for `ollmcp` process.
- Codex write-confirm flow that generates MCP config safely and only for the selected workspace.

## Non-goals
- No Blockbench modeling algorithm, mesh generation, or tool orchestration in app code.
- No replacement for Blockbench MCP internals or hosted AI providers.

## Source references
- https://github.com/achmadawdi/mcp-blockbench
- https://github.com/jonigl/mcp-client-for-ollama
- https://github.com/jasonjgardner/blockbench-mcp-project
- https://modelcontextprotocol.io/specification/2025-06-18/basic/transports

## Implementation notes
- Keep one active bridge runtime path to avoid duplicate local listeners.
- Keep source of MCP schema and protocol behavior from upstream contracts.
- Preserve default behavior of upstream MCP; this app only orchestrates lifecycle/configuration.

## Acceptance criteria
- User can complete setup flow from a single dashboard path.
- MCP process can be started/stopped and reflected on UI in near-real time.
- Codex bridge config can be generated/updated and confirmed by user before write.
