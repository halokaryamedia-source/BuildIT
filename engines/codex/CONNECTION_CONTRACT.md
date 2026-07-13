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
Write owner: one leased MCP session
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

After readiness `PASS`, acquire `manage_project_write_lease` from the active Codex session before any mutation. The lease binds that session to the project UUID, asset session, stage, state revision, and active tool profile. A stage/profile transition releases only the lease; continue in the same Codex and MCP session and reacquire the fresh stage lease. If the readiness script installs a missing Codex config before production begins, restart Codex once, then keep the production session stable.

Do not load a second plugin copy, create another MCP key, bypass ownership, or use a versioned output filename.
