# Tauri Desktop Runtime

BuildIT desktop is a Tauri application with a Svelte renderer and a Rust runtime layer.

The app should not be treated as a browser-only UI. The renderer debug server is only for development.

## Responsibility split

```txt
BuildIT Tauri app
- user-facing desktop window
- lightweight Svelte UI
- prompt and reference-image input
- local runtime controls
- service readiness display
- job progress and artifact review

BuildIT engine
- local HTTP API
- job orchestration
- Ollama planning and image analysis
- model plan validation
- MCP action generation and execution reporting

Blockbench MCP core app
- runs inside the local Blockbench desktop application
- exposes the MCP endpoint
- executes tool calls in Blockbench

Blockbench
- local desktop application
- actual model workspace
- generated model remains visible/editable there
```

## Runtime controls

The Tauri backend exposes commands for:

- `check_runtime`
- `start_buildit_engine`
- `start_ollama`
- `pull_required_ollama_models`
- `open_blockbench`
- `open_mcp_plugin_page`

The Svelte renderer calls these commands through `@tauri-apps/api/core`.

## Required local services

```txt
BuildIT engine: http://localhost:3987
Ollama: http://localhost:11434
Blockbench MCP: http://localhost:3000/bb-mcp
```

## Required Ollama models

```txt
qwen3:8b
qwen3-vl:4b
```

The app checks installed models with `ollama list` and reports missing models in Desktop Controls.

## First-time Blockbench setup

BuildIT can open the local Blockbench desktop application and the MCP plugin URL, but the first plugin installation/approval still happens inside Blockbench.

The expected plugin URL is:

```txt
https://achmadawdi.github.io/mcp-blockbench/mcp.js
```

After the plugin is loaded and the MCP server is enabled, the app should detect port `3000` as open and the engine health should show MCP tools as valid.

## Development commands

Run the Tauri app:

```bash
npm run dev:desktop
```

Run the Svelte renderer only for debugging:

```bash
npm --workspace apps/desktop run dev:web
```

Run the engine manually when needed:

```bash
npm run dev:engine
```

Build renderer and engine workspaces:

```bash
npm run build
```

The regular CI build intentionally validates the TypeScript/Svelte renderer and engine. Full Tauri packaging requires Rust, platform toolchains, and OS-specific WebView dependencies, so it should be validated separately on a configured desktop machine.

## Acceptance criteria

- `npm run dev:desktop` opens a native BuildIT desktop window.
- Desktop Controls can start/check the BuildIT engine.
- Desktop Controls can start/check Ollama.
- Desktop Controls can show installed and missing Ollama models.
- Desktop Controls can start pulling the required Ollama models.
- Desktop Controls can open the local Blockbench desktop application from common install locations.
- Desktop Controls can open the MCP plugin URL.
- Engine Health shows Ollama and Blockbench MCP readiness.
- Generated results remain in Blockbench.
- BuildIT notifies the user with `Model ready in Blockbench` when the job succeeds.
