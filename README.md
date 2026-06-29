# Blockbench MCP

https://github.com/user-attachments/assets/ab1b7e63-b6f0-4d5b-85ab-79d328de31db

## Plugin Installation

Open the desktop version of Blockbench, go to File > Plugins and click the "Load Plugin from URL" and paste in this URL:

**[https://jasonjgardner.github.io/blockbench-mcp-plugin/mcp.js](https://jasonjgardner.github.io/blockbench-mcp-plugin/mcp.js)**

## Model Context Protocol Server

Configure the MCP server under Blockbench settings: **Settings** > **General** > **MCP Server Port** and **MCP Server Endpoint**

The following examples use the default values of `:3000/bb-mcp`

### Multiple Blockbench Windows

When more than one Blockbench window is open, the plugin can auto-select the next available port (Settings > General > **Auto-select Available Port**, enabled by default).

Example:

- Window 1: `http://localhost:3000/bb-mcp`
- Window 2: `http://localhost:3001/bb-mcp`
- Window 3: `http://localhost:3002/bb-mcp`

Use the MCP panel in each Blockbench window to copy the exact URL or client config snippet. Each window needs a **unique** `mcpServers` key in your client config.

**Cursor — two projects:**

```json
{
  "mcpServers": {
    "blockbench_project_a": {
      "url": "http://localhost:3000/bb-mcp"
    },
    "blockbench_project_b": {
      "url": "http://localhost:3001/bb-mcp"
    }
  }
}
```

**Codex — two projects:**

```toml
[mcp_servers.blockbench_project_a]
url = "http://localhost:3000/bb-mcp"

[mcp_servers.blockbench_project_b]
url = "http://localhost:3001/bb-mcp"
```

Settings apply on plugin reload or Blockbench restart.

### Per-Face UV for Texture Painting

For custom texture atlases (furniture, items, multi-part models), use per-face UV:

1. `create_project` with `box_uv: false` and set `texture_width` / `texture_height`
2. `place_cube` with explicit `{ face, uv }` rectangles
3. `get_uv_layout` to export face regions before painting
4. Use the `texture_uv_workflow` MCP prompt for the full guide

### Installation


#### General

```bash
npx mcp-add --type http --url "http://localhost:3000/bb-mcp" --scope project
```

#### VS Code

**`.vscode/mcp.json`**

```json
{
  "servers": {
    "blockbench": {
      "url": "http://localhost:3000/bb-mcp",
      "type": "http"
    }
  }
}
```

#### Claude Desktop

**`claude_desktop_config.json`**

```json
{
  "mcpServers": {
    "blockbench": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:3000/bb-mcp"]
    }
  }
}
```

#### Claude Code

```bash
claude mcp add blockbench --transport http http://localhost:3000/bb-mcp
```

#### Cursor

**`.cursor/mcp.json`** (project) or **`~/.cursor/mcp.json`** (global)

```json
{
  "mcpServers": {
    "blockbench": {
      "url": "http://localhost:3000/bb-mcp"
    }
  }
}
```

Blockbench must be running with the plugin loaded. Enable the server in **Settings > MCP**.

#### Codex

**`~/.codex/config.toml`** (or project `.codex/config.toml` in trusted projects)

Direct Streamable HTTP:

```toml
[mcp_servers.blockbench]
url = "http://localhost:3000/bb-mcp"
```

If direct HTTP fails to list tools (known Codex CLI limitations), use the stdio bridge:

```toml
[mcp_servers.blockbench]
command = "npx"
args = ["mcp-remote", "http://localhost:3000/bb-mcp"]
```

#### [Antigravity](https://antigravity.google/docs/mcp#connecting-custom-mcp-servers)

```json
{
  "mcpServers": {
    "blockbench": {
      "serverUrl": "http://localhost:3000/bb-mcp"
    }
  }
}
```

#### Cline

<img width="674" height="486" alt="Connecting to Blockbench MCP plugin through Cline" src="https://github.com/user-attachments/assets/f27f2304-dd56-4c60-b159-86fbd5af65ee" />

**`cline_mcp_settings.json`**

```json
{
  "mcpServers": {
    "blockbench": {
      "url": "http://localhost:3000/bb-mcp",
      "type": "streamableHttp",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

#### Ollama

```bash
uvx ollmcp -u http://localhost:3000/bb-mcp
```

Recommended: [jonigl/mcp-client-for-ollama](https://github.com/jonigl/mcp-client-for-ollama)

#### OpenCode

```bash
opencode mcp add
```

<img width="504" height="300" alt="Connecting to Blockbench MCP plugin through OpenCode." src="https://github.com/user-attachments/assets/238971fc-0048-4b8d-95dd-6681604bbe90" />


## Usage

[See sample project](https://github.com/jasonjgardner/blockbench-mcp-project) for prompt examples.

### [Skills](https://skills.sh/jasonjgardner/blockbench-mcp-project)

Use Agent Skills to orchestrate tool usage.

## Plugin Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on setting up the development environment and how to add new tools, resources, and prompts.
