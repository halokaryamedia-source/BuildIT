# BuildIT

Blockbench Auto Model Studio.

BuildIT is a local-first desktop application for generating Minecraft-style voxel models in Blockbench using Ollama, a local agent engine, and Blockbench MCP.

## Supported project types

BuildIT currently focuses on two Blockbench project targets only:

- `Bedrock Entity` - Minecraft Bedrock entity models such as mobs, companions, NPCs, vehicles, and animated-capable entity objects.
- `Bedrock Block` - placeable Minecraft Bedrock custom blocks such as decorative blocks, furniture blocks, lamps, machines, crates, ores, and static world blocks.

`Bedrock Block` must be treated as a Minecraft block that exists in the world, not as a free prop, entity, mob, wearable, or item model.

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

1. User selects Bedrock Entity or Bedrock Block.
2. User uploads an image or writes a prompt.
3. The app validates reference image type and size.
4. The app creates a model generation job.
5. The engine saves reference images under the job output folder.
6. The engine analyzes reference images using the configured vision model.
7. The engine saves `image_analysis.json` under the job output folder.
8. The engine generates a typed model plan and saves `model_plan.json`.
9. The engine validates the model plan and saves `model_plan_validation.json`.
10. The engine stops before Blockbench execution if validation fails.
11. The Blockbench MCP adapter builds and validates MCP tool calls.
12. The engine saves `mcp_actions.json`.
13. The engine checks the real Blockbench MCP tool capabilities and saves `mcp_capabilities.json`.
14. The engine controls Blockbench through MCP when the adapter output and MCP capabilities are valid.
15. The engine saves `mcp_execution_report.json`.
16. The desktop app shows progress, health status, artifact availability, artifact JSON content, and diagnostics.
17. The user is notified when the model is ready in Blockbench.

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
- Main model: `qwen3:8b`
- Vision model: `qwen3-vl:4b`
- Blockbench MCP: `http://localhost:3000/bb-mcp`
- Output directory: `outputs`

## Engine API

- `GET /api/health` checks main model, vision model, Blockbench MCP connectivity, and MCP tool capabilities.
- `POST /api/jobs` creates a model generation job and accepts optional reference image uploads.
- `GET /api/jobs` lists jobs stored in memory.
- `GET /api/jobs/:id` returns a single job and its logs.
- `GET /api/jobs/:id/artifacts` lists available job artifacts.
- `GET /api/jobs/:id/artifacts/:artifactName` returns one job artifact.

Supported `POST /api/jobs` formats:

- `bedrock` for Bedrock Entity.
- `bedrock_block` for Bedrock Block.

Reference images must be image files and must be 10 MB or smaller.
Request bodies are limited to 16 MB.
Reference images are sent as JSON data URLs and stored at `outputs/jobs/<jobId>/references/`.
Vision analysis is stored at `outputs/jobs/<jobId>/image_analysis.json`.
Typed model plans are stored at `outputs/jobs/<jobId>/model_plan.json`.
Model plan validation reports are stored at `outputs/jobs/<jobId>/model_plan_validation.json`.
MCP action lists are stored at `outputs/jobs/<jobId>/mcp_actions.json`.
MCP capability reports are stored at `outputs/jobs/<jobId>/mcp_capabilities.json`.
MCP execution reports are stored at `outputs/jobs/<jobId>/mcp_execution_report.json`.
