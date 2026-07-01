# BuildIT

Blockbench Auto Model Studio.

BuildIT is a local-first desktop application for generating Minecraft-style voxel models in Blockbench using Ollama, a local agent engine, and Blockbench MCP.

## Goals

- Chat-like interface for image and prompt input.
- Local job manager with progress tracking.
- Ollama integration for planning and image understanding.
- Blockbench MCP integration for creating, previewing, and exporting models.
- Clean architecture with no legacy folders and no stacked version folders.

## Applications

- `apps/desktop` - React desktop interface shell.
- `apps/engine` - TypeScript local agent engine and HTTP API.

## Core workflow

1. User uploads an image or writes a prompt.
2. The app creates a model generation job.
3. The engine saves reference images under the job output folder.
4. The engine analyzes input using Ollama.
5. The engine controls Blockbench through MCP.
6. The app shows progress and preview status.
7. The user is notified when the model is ready in Blockbench.

## Local development

Install dependencies:

```bash
npm install
```

Run the engine API:

```bash
npm run dev:engine
```

Run the desktop UI:

```bash
npm run dev:desktop
```

Default local services:

- Engine API: `http://localhost:3987`
- Ollama: `http://localhost:11434`
- Blockbench MCP: `http://localhost:3000/bb-mcp`
- Output directory: `outputs`

## Engine API

- `GET /api/health` checks Ollama and Blockbench MCP connectivity.
- `POST /api/jobs` creates a model generation job and accepts optional reference image uploads.
- `GET /api/jobs` lists jobs stored in memory.
- `GET /api/jobs/:id` returns a single job and its logs.

Reference images are sent as JSON data URLs and stored at `outputs/jobs/<jobId>/references/`.
