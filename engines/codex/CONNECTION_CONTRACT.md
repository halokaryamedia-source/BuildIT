# Codex ↔ Blockbench MCP Connection Contract

```text
Codex MCP key: blockbench
Transport: Streamable HTTP
URL: http://localhost:3000/bb-mcp
Plugin ID: mcp
Port: 3000
Endpoint: /bb-mcp
Auto-port: disabled
Session timeout: minimum 30 minutes
```

Machine authority: `engines/codex/connection-profile.json`.

Use exactly one visible Blockbench window and one Codex write session. If port 3000 is occupied, stop with `BLOCKER`; do not scan another port.

After plugin source changes:

```powershell
bun install
bun run dev
```

Reload `dist/mcp.js`, grant local network permission, open the intended project, then run `scripts/sync-local-stack.ps1`.
