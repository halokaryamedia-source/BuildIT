# 01-source-contract

## Purpose
- Define stable references so local runtime and UI follow upstream MCP contracts instead of custom behavior.

## Scope
- Contracts consumed from `contracts/upstream/mcp-blockbench/api.json` and external MCP protocol specification.
- Baseline behavior expected from source projects and local workspace conventions.

## Non-goals
- Tidak menambatkan ke satu provider AI tertentu.
- Tidak mengunci format workspace UI selain pola yang dibutuhkan untuk integrasi MCP.

## Source references
- Source MCP repos listed in overview.
- MCP specification v2025-06-18 transport docs.

## Implementation notes
- Runtime reads and validates contract assumptions at startup.
- Any unsupported tool or endpoint is surfaced in logs instead of being silently ignored.
- Configuration generation follows source contract keys and request shapes.

## Acceptance criteria
- App continues bekerja ketika upstream menambah endpoint, selama skema kompatibel.
- Gagal kontrak harus tampil sebagai warning/error yang jelas tanpa crash UI.
