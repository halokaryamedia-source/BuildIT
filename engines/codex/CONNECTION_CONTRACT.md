# Codex ↔ Blockbench MCP Connection Contract

```text
Codex MCP key: blockbench
Transport: Streamable HTTP
URL: http://localhost:3000/bb-mcp
Plugin ID: mcp
Plugin file: mcp-blockbench/dist/mcp.js
Port: 3000
Endpoint: /bb-mcp
Auto-port: disabled
Session timeout: minimum 30 minutes
```

Machine authority: `engines/codex/connection-profile.json`.

Use exactly one visible Blockbench window and one Codex write session. If port 3000 is occupied, stop with `BLOCKER`; do not scan another port.

After plugin source changes:

```powershell
cd mcp-blockbench
bun install
bun run dev
cd ..
```

Reload exactly `mcp-blockbench/dist/mcp.js`, grant local network permission, open the intended project, then run:

```powershell
powershell -ExecutionPolicy Bypass -File engines/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

Do not load a second plugin copy, create another MCP key, or use a versioned output filename.
