# BuildIT

Blockbench Auto Model Studio.

BuildIT is a local-first Tauri desktop application for generating Minecraft-style voxel models in Blockbench using Ollama, a local agent engine, and the Blockbench MCP core app.

## Desktop-first direction

BuildIT is intended to be used as a real desktop app, not as a browser-only web UI.

The desktop renderer uses Svelte for a lightweight UI. Tauri owns the native desktop shell and Rust runtime commands:

```bash
npm run dev:desktop
```

The Tauri shell gives BuildIT a local runtime layer that can start/check local services and open local applications.

## Core dependency

BuildIT expects the Blockbench MCP core app to run inside the local Blockbench desktop application:

```txt
https://github.com/achmadawdi/mcp-blockbench
```

Default local endpoint:

```txt
http://localhost:3000/bb-mcp
```

BuildIT owns orchestration, job state, planning, diagnostics, runtime service checks, and stored output data.

The MCP Blockbench core app owns the actual Blockbench runtime integration and tool execution inside Blockbench.

## Supported project types

BuildIT currently focuses on two Blockbench project targets only:

- `Bedrock Entity` - Minecraft Bedrock entity models such as mobs, companions, NPCs, vehicles, and animated-capable entity objects.
- `Bedrock Block` - placeable Minecraft Bedrock custom blocks such as decorative blocks, furniture blocks, lamps, machines, crates, ores, and static world blocks.

`Bedrock Block` must be treated as a Minecraft block that exists in the world, not as a free prop, entity, mob, wearable, or item model.

## Applications

- `apps/desktop` - Tauri desktop application with Svelte renderer.
- `apps/engine` - TypeScript local agent engine and HTTP API.

## Runtime service manager

The desktop app includes runtime controls for:

- checking the BuildIT engine port `3987`.
- starting the BuildIT engine in development mode.
- checking Ollama port `11434`.
- starting Ollama.
- checking installed Ollama models.
- pulling required Ollama models: `qwen3:8b` and `qwen3-vl:4b`.
- opening the local Blockbench desktop application from common install locations.
- checking the Blockbench MCP port `3000`.
- opening the `mcp-blockbench` plugin URL.

The first-time setup still requires the user to approve/install the Blockbench plugin inside Blockbench. BuildIT can open the Blockbench desktop app and the plugin URL, but it should not silently force plugin installation or permissions.

## Core workflow

1. User opens the BuildIT Tauri desktop app.
2. User checks or starts local services from Desktop Controls.
3. User selects Bedrock Entity or Bedrock Block.
4. User uploads an image or writes a prompt.
5. The app validates reference image type and size.
6. The app creates a model generation job.
7. The engine saves `job_snapshot.json` under the job output folder.
8. The engine saves reference images under the job output folder.
9. The engine analyzes reference images using the configured vision model.
10. The engine saves `image_analysis.json` under the job output folder.
11. The engine generates a typed model plan and saves `model_plan.json`.
12. The engine validates the model plan and saves `model_plan_validation.json`.
13. The engine builds geometry and material plans.
14. The engine saves `mcp_geometry_plan.json` and `mcp_material_plan.json`.
15. The Blockbench MCP adapter builds and validates MCP tool calls.
16. The engine saves `mcp_actions.json`.
17. The engine checks the real Blockbench MCP core app capabilities and saves `mcp_tool_schema.json`, `mcp_tool_name_mapping.json`, and `mcp_capabilities.json`.
18. The engine skips missing optional MCP actions before schema matching.
19. The engine adapts arguments, matches schemas, and saves `mcp_argument_shape_adaptation.json` and `mcp_action_schema_match.json`.
20. The engine saves the final `mcp_execution_plan.json`.
21. The engine controls Blockbench through the MCP core app when the adapter output and MCP capabilities are valid.
22. The engine captures a Blockbench preview and saves `blockbench_preview.json`.
23. The engine exports the project and saves `blockbench_export.json` when the optional export tool is available.
24. The engine saves `mcp_execution_report.json`.
25. The engine updates `job_snapshot.json`, `artifact_index.json`, and `stored_data_manifest.json` throughout artifact reads.
26. The desktop app shows progress, workflow stage, health status, recent jobs, artifact availability, preview image, artifact JSON content, and diagnostics.
27. The user is notified when the model is ready in Blockbench.

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

Typecheck all workspaces:

```bash
npm run check
```

Build the engine and desktop renderer:

```bash
npm run build
```

Run the Tauri desktop app:

```bash
npm run dev:desktop
```

Run the Svelte renderer only for debugging:

```bash
npm --workspace apps/desktop run dev:web
```

Run the engine API manually when needed:

```bash
npm run dev:engine
```

Default local services:

- Engine API: `http://localhost:3987`
- Ollama: `http://localhost:11434`
- Main model: `qwen3:8b`
- Vision model: `qwen3-vl:4b`
- Blockbench MCP core app: `http://localhost:3000/bb-mcp`
- Output directory: `outputs`

Full Tauri packaging requires Rust, platform toolchains, and OS-specific WebView dependencies, so packaging should be validated separately on a configured desktop machine.

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

## Documentation index

```txt
docs/tauri-desktop-runtime.md
docs/buildit-mcp-core-boundary.md
docs/blockbench-mcp-integration-plan.md
docs/blockbench-mcp-tool-contract.md
docs/blockbench-mcp-integration-checklist.md
docs/blockbench-mcp-adapter.md
docs/test-checklist.md
```
