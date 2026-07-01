# Desktop Svelte Architecture

BuildIT desktop uses Tauri for the native desktop shell, Svelte for the lightweight renderer, and Rust commands for local runtime control.

## Final desktop stack

```txt
Tauri desktop shell
Rust runtime commands
Svelte renderer
BuildIT engine HTTP API
Ollama local model runtime
Blockbench desktop application
mcp-blockbench core app inside Blockbench
```

## Why Svelte

Svelte keeps the renderer small and simple for a local-first desktop utility. The UI is compiled ahead of time and does not require React runtime dependencies.

## Renderer files

```txt
apps/desktop/src/App.svelte
apps/desktop/src/main.tsx
apps/desktop/src/styles.css
apps/desktop/vite.config.ts
apps/desktop/svelte.config.js
```

`main.tsx` currently acts only as the Svelte mount entrypoint because the existing `index.html` still points to it. It does not use React or JSX.

## Runtime command boundary

Svelte UI calls Rust/Tauri commands through `@tauri-apps/api/core`.

Commands:

```txt
check_runtime
start_buildit_engine
start_ollama
pull_required_ollama_models
open_blockbench
open_mcp_plugin_page
```

## Blockbench behavior

`open_blockbench` must open the local Blockbench desktop application, not a web page.

Current Windows candidates:

```txt
%USERPROFILE%/AppData/Local/Programs/Blockbench/Blockbench.exe
C:/Program Files/Blockbench/Blockbench.exe
C:/Program Files (x86)/Blockbench/Blockbench.exe
```

The generated model remains in Blockbench. BuildIT only orchestrates the job, sends MCP commands through the engine, and shows readiness/review data.

## First-time MCP setup

BuildIT can open the MCP plugin URL, but the user still approves or loads the plugin inside Blockbench.

```txt
https://achmadawdi.github.io/mcp-blockbench/mcp.js
```

After the plugin is running, BuildIT expects:

```txt
http://localhost:3000/bb-mcp
```

## Validation target

Before local testing, the repo should pass:

```bash
npm install
npm run check
npm run build
```

Full Tauri packaging is validated separately because it requires Rust and OS-specific desktop toolchains.
