# Local Stack Connection Specification

## Canonical Connection

```text
MCP key: blockbench
URL: http://localhost:3000/bb-mcp
Port: 3000
Endpoint: /bb-mcp
Auto-port: disabled
```

Authority SHALL be `engines/codex/connection-profile.json`.

## Readiness

`engines/codex/scripts/sync-local-stack.ps1` SHALL:

- preserve one canonical Codex MCP entry;
- verify exactly one visible Blockbench window;
- initialize MCP and list required core capabilities once;
- call `get_runtime_status` once;
- close its transient smoke session;
- write `workspace/sessions/<asset>/reports/connection.json`;
- synchronize project/profile data into session state.

Work SHALL continue only when readiness is `PASS`. Port scanning, fallback ports, alternate `blockbench_*` keys, and repeated discovery SHALL be forbidden.
