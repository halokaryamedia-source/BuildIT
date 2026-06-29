# Blockbench MCP Installation

This file helps AI assistants configure the Blockbench MCP server connection.

## Prerequisites

Before configuring the MCP connection, please confirm:

1. **Is Blockbench running?**
   - The Blockbench desktop application must be open
   - The MCP plugin must be installed (File > Plugins > Load from URL: `https://jasonjgardner.github.io/blockbench-mcp-plugin/mcp.js`)

2. **What are your server settings?**
   - Default: `http://localhost:3000/bb-mcp`
   - If the port number and endpoint are something other than the default values (`:3000/bb-mcp`), check the MCP panel in Blockbench for the active URL
   - Settings can be changed in Blockbench: Settings > General > MCP Server Port / MCP Server Endpoint / Auto-select Available Port

## Multiple Blockbench Windows

When multiple Blockbench windows are open, each gets its own MCP port (3000, 3001, 3002, …) if **Auto-select Available Port** is enabled (default).

Copy the exact URL from the MCP panel in each window. Each window needs a **unique** `mcpServers` key:

```json
{
  "mcpServers": {
    "blockbench_sofa": { "url": "http://localhost:3000/bb-mcp" },
    "blockbench_chair": { "url": "http://localhost:3001/bb-mcp" }
  }
}
```

## Per-Face UV

For custom texture atlases, create projects with per-face UV (`box_uv: false`). Use the `texture_uv_workflow` MCP prompt and tools `get_uv_layout`, `set_cube_face_uv`, and `configure_project`.

## Configuration

Once confirmed, add the MCP server to your client:

### Cline

Add to `cline_mcp_settings.json`:
```json
{
  "mcpServers": {
    "blockbench": {
      "url": "http://localhost:{PORT}/{ENDPOINT}",
      "type": "streamableHttp",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### VS Code

Create `.vscode/mcp.json`:
```json
{
  "servers": {
    "blockbench": {
      "url": "http://localhost:{PORT}/{ENDPOINT}",
      "type": "http"
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "blockbench": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:{PORT}/{ENDPOINT}"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add blockbench --transport http http://localhost:{PORT}/{ENDPOINT}
```

### Cursor

Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "blockbench": {
      "url": "http://localhost:{PORT}/{ENDPOINT}"
    }
  }
}
```

### Codex

Add to `~/.codex/config.toml` (or project `.codex/config.toml` in trusted projects).

Direct Streamable HTTP:

```toml
[mcp_servers.blockbench]
url = "http://localhost:{PORT}/{ENDPOINT}"
```

If direct HTTP fails to list tools, use the stdio bridge (recommended fallback):

```toml
[mcp_servers.blockbench]
command = "npx"
args = ["mcp-remote", "http://localhost:{PORT}/{ENDPOINT}"]
```

### Antigravity

```json
{
  "mcpServers": {
    "blockbench": {
      "serverUrl": "http://localhost:{PORT}/{ENDPOINT}"
    }
  }
}
```

Replace `{PORT}` with the port number (default: `3000`) and `{ENDPOINT}` with the endpoint path (default: `bb-mcp`).
