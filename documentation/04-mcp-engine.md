# 04-mcp-engine

## Purpose
- Explain how the app handles MCP runtime lifecycle for local Blockbench usage.

## Scope
- Process launch/stop for `ollmcp`.
- Status polling and stream log collection.
- Safety checks before running a command.

## Implementation notes
- Command runner executes local binary from selected workspace context.
- Engine emits start/stop/ready/error events to shared app state.
- Errors dari `stderr` dicapture dengan mapping message agar mudah dibaca non-technical user.

## Non-goals
- Tidak mengimplementasikan transport parser selain yang dibutuhkan UI.
- Tidak mengubah spec MCP internals.

## Acceptance criteria
- A process start must produce explicit `started` or `failed` state.
- Stop action must terminate process reliably and clear stale state.
- Log retention is bounded and tidak memunculkan data sensitif.
