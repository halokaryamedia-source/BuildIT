# Local Stack Connection Specification

## Canonical Connection

```text
MCP key: blockbench
URL: http://localhost:3000/bb-mcp
Plugin package: mcp-blockbench/
Plugin output: mcp-blockbench/dist/mcp.js
Port: 3000
Endpoint: /bb-mcp
Auto-port: disabled
```

Authority SHALL be `engines/codex/connection-profile.json`.

Only the canonical package output SHALL be loaded in Blockbench. A second plugin copy, versioned output filename, alternate package root, fallback port, or alternate `blockbench_*` key SHALL be forbidden.

## Readiness

`engines/codex/scripts/sync-local-stack.ps1` SHALL:

- verify `mcp-blockbench/dist/mcp.js` exists;
- preserve one canonical Codex MCP entry;
- resolve the selected asset through `workspace/workspace.json`;
- verify exactly one visible Blockbench window;
- initialize MCP and list required core capabilities once;
- call `get_runtime_status` once;
- close its transient smoke session;
- write `workspace/active/<asset>/mcp/reports/connection.json`;
- synchronize project identity into `workspace/active/<asset>/mcp/project.json` and current profile/runtime data into `workspace/active/<asset>/mcp/state.json`.

Work SHALL continue only when readiness is `PASS`. Port scanning, fallback ports, alternate plugin outputs, alternate `blockbench_*` keys, and repeated discovery SHALL be forbidden.

## One-Session Continuity

The initial smoke session MAY close after readiness. The actual production flow SHALL then keep the same loaded plugin, Codex session, and MCP production session across logical stage/profile transitions. Normal transitions SHALL report `reconnect_required = false` and `current_session_continues = true`.