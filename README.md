# BuildIT

Blockbench Auto Model Studio.

BuildIT is a local-first desktop application for generating Minecraft-style voxel models in Blockbench using Ollama, a local agent engine, and the Blockbench MCP core app.

## Core dependency

BuildIT expects the Blockbench MCP core app to be running separately:

```txt
https://github.com/achmadawdi/mcp-blockbench
```

Default local endpoint:

```txt
http://localhost:3000/bb-mcp
```

BuildIT owns orchestration, job state, planning, diagnostics, and stored output data.

The MCP Blockbench core app owns the actual Blockbench runtime integration and tool execution inside Blockbench.

## Supported project types

BuildIT currently focuses on two Blockbench project targets only:

- `Bedrock Entity` - Minecraft Bedrock entity models such as mobs, companions, NPCs, vehicles, and animated-capable entity objects.
- `Bedrock Block` - placeable Minecraft Bedrock custom blocks such as decorative blocks, furniture blocks, lamps, machines, crates, ores, and static world blocks.

`Bedrock Block` must be treated as a Minecraft block that exists in the world, not as a free prop, entity, mob, wearable, or item model.

## Goals

- Chat-like interface for image and prompt input.
- Local job manager with progress tracking.
- Ollama integration for planning and image understanding.
- Blockbench MCP core app integration for creating, previewing, and exporting models.
- Stored Data Root output folder per job.
- Clean architecture with no legacy folders and no stacked version folders.

## Applications

- `apps/desktop` - React desktop interface shell.
- `apps/engine` - TypeScript local agent engine and HTTP API.

## Core workflow

1. User selects Bedrock Entity or Bedrock Block.
2. User uploads an image or writes a prompt.
3. The app validates reference image type and size.
4. The app creates a model generation job.
5. The engine saves `job_snapshot.json` under the job output folder.
6. The engine saves reference images under the job output folder.
7. The engine analyzes reference images using the configured vision model.
8. The engine saves `image_analysis.json` under the job output folder.
9. The engine generates a typed model plan and saves `model_plan.json`.
10. The engine validates the model plan and saves `model_plan_validation.json`.
11. The engine builds geometry and material plans.
12. The engine saves `mcp_geometry_plan.json` and `mcp_material_plan.json`.
13. The Blockbench MCP adapter builds and validates MCP tool calls.
14. The engine saves `mcp_actions.json`.
15. The engine checks the real Blockbench MCP core app capabilities and saves `mcp_tool_schema.json`, `mcp_tool_name_mapping.json`, and `mcp_capabilities.json`.
16. The engine adapts arguments, matches schemas, and saves `mcp_argument_shape_adaptation.json` and `mcp_action_schema_match.json`.
17. The engine saves the final `mcp_execution_plan.json`.
18. The engine controls Blockbench through the MCP core app when the adapter output and MCP capabilities are valid.
19. The engine captures a Blockbench preview and saves `blockbench_preview.json`.
20. The engine exports the project and saves `blockbench_export.json` when the optional export tool is available.
21. The engine saves `mcp_execution_report.json`.
22. The engine updates `job_snapshot.json`, `artifact_index.json`, and `stored_data_manifest.json` throughout artifact reads.
23. The desktop app shows progress, workflow stage, health status, recent jobs, artifact availability, preview image, artifact JSON content, and diagnostics.
24. The user is notified when the model is ready in Blockbench.

## Workflow stages

Jobs include a `stage` field so the desktop app can show clear progress:

```txt
queued
saving_references
analyzing_image
planning_model
validating_plan
building_mcp_actions
checking_mcp_capabilities
executing_mcp
capturing_preview
exporting_model
completed
failed
```

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
- Blockbench MCP core app: `http://localhost:3000/bb-mcp`
- Output directory: `outputs`

## Engine API

- `GET /api/health` checks main model, vision model, Blockbench MCP connectivity, and MCP tool capabilities.
- `POST /api/jobs` creates a model generation job and accepts optional reference image uploads.
- `GET /api/jobs` lists jobs from memory and persisted `job_snapshot.json` files.
- `GET /api/jobs/:id` returns a single job and its logs. If the job is no longer in memory, the engine attempts to read `job_snapshot.json`.
- `GET /api/jobs/:id/artifacts` refreshes `artifact_index.json` and `stored_data_manifest.json`, then returns artifact metadata.
- `GET /api/jobs/:id/artifacts/:artifactName` returns one job artifact from the output folder.
- `POST /api/jobs/:id/open-stored-data` opens the job Stored Data Root folder.

Supported `POST /api/jobs` formats:

- `bedrock` for Bedrock Entity.
- `bedrock_block` for Bedrock Block.

Reference images must be image files and must be 10 MB or smaller.
Request bodies are limited to 16 MB.
Reference images are sent as JSON data URLs and stored at `outputs/jobs/<jobId>/references/`.

## Job artifacts

Common job artifacts:

```txt
job_snapshot.json
artifact_index.json
stored_data_manifest.json
image_analysis.json
model_plan.json
model_plan_validation.json
mcp_geometry_plan.json
mcp_material_plan.json
mcp_actions.json
mcp_tool_schema.json
mcp_tool_name_mapping.json
mcp_argument_shape_adaptation.json
mcp_action_schema_match.json
mcp_execution_plan.json
mcp_capabilities.json
blockbench_preview.json
blockbench_export.json
mcp_execution_report.json
```

## MCP core app integration docs

```txt
docs/blockbench-mcp-integration-plan.md
docs/blockbench-mcp-tool-contract.md
docs/blockbench-mcp-integration-checklist.md
docs/blockbench-mcp-adapter.md
```
