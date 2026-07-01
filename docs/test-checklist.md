# Test Checklist

Use this checklist before merging a development slice into `V1`.

## Engine

- Run `npm run dev:engine`.
- Open `http://localhost:3987/api/health`.
- Confirm the API returns JSON.
- Confirm `ollamaConnected` reflects the local main model state.
- Confirm `visionConnected` reflects the local vision model state.
- Confirm `blockbench.connected` reflects the local Blockbench MCP state.
- Confirm `mcpCapabilities.valid` reflects whether the required MCP tools are available.
- Confirm `mcpCapabilities.toolNameResolutions` includes canonical and resolved tool names.
- Confirm `mcpCapabilities.missingTools` is empty when required canonical tools are resolved.
- Confirm `mcpCapabilities.optionalTools` includes optional progressive enhancement tools.
- Confirm `mcpCapabilities.missingOptionalTools` can include optional tools without making `valid` false.
- Open `http://localhost:3987/api/jobs` after creating a job.
- Confirm the job list includes memory jobs and persisted job snapshots.
- Open `http://localhost:3987/api/jobs/<jobId>/artifacts` after creating a job.
- Confirm the artifact API returns available and pending artifact summaries.
- Confirm the artifact API returns `artifactIndex`.
- Confirm the artifact API returns `storedDataManifest`.
- Confirm `artifactIndex.artifacts` includes size and update metadata for available artifacts.
- Confirm `storedDataManifest.files` groups files by role.
- Confirm `storedDataManifest.ready` reflects missing required files.
- Confirm `storedDataManifest.openTargetPath` points to the job stored data folder.
- Send `POST http://localhost:3987/api/jobs/<jobId>/open-stored-data`.
- Confirm the engine opens the job stored data folder through the system file explorer.
- Confirm `mcp_geometry_plan.json` appears before MCP actions.
- Confirm `mcp_tool_schema.json`, `mcp_tool_name_mapping.json`, `mcp_argument_shape_adaptation.json`, and `mcp_action_schema_match.json` appear before MCP execution.
- Confirm requests larger than 16 MB are rejected by the engine API.
- Confirm non-image reference uploads are rejected by the engine.
- Confirm reference images larger than 10 MB are rejected by the engine.

## Desktop

- Run `npm run dev:desktop`.
- Confirm the project type selector only shows Bedrock Entity and Bedrock Block.
- Confirm the sidebar shows health, recent jobs, Stored Data Root, and artifact availability.
- Confirm clicking Open Stored Data opens the job output folder directly.
- Confirm selecting a non-image file or image larger than 10 MB shows validation.
- Create one Bedrock Entity job and one Bedrock Block job.
- Confirm workflow stage, recent logs, artifact rows, artifact sizes, and artifact update times display.
- Confirm `mcp_geometry_plan.json` displays groups, cubes, bounds, centers, issues, and preflight.
- Confirm Bedrock Block jobs show `base`, `block_body`, and `decorative_details` groups.
- Confirm Bedrock Entity jobs show `body`, `head`, and `accessories` groups.
- Confirm MCP schema, tool-name mapping, argument adaptation, and action schema reports display as JSON.
- Confirm `blockbench_preview.json` displays an image when `imageDataUrl` is present.

## Output files

- Confirm uploaded references are saved under `outputs/jobs/<jobId>/references/`.
- Confirm `job_snapshot.json`, `artifact_index.json`, and `stored_data_manifest.json` are created.
- Confirm `image_analysis.json` is created when an image is selected.
- Confirm `model_plan.json` and `model_plan_validation.json` are created.
- Confirm `mcp_geometry_plan.json` includes format bounds, groups, cubes, issues, and `preflight`.
- Confirm `preflight.status` is `ready`, `warning`, or `blocked`.
- Confirm `preflight.score` and `preflight.metrics` are present.
- Confirm Bedrock Block geometry is clamped to block-style bounds and has block-style groups.
- Confirm Bedrock Entity geometry is clamped to entity-style bounds and has entity-style groups.
- Confirm `mcp_actions.json` includes `valid`, `format`, `actionCount`, `issues`, and `actions`.
- Confirm `mcp_tool_schema.json`, `mcp_tool_name_mapping.json`, `mcp_argument_shape_adaptation.json`, and `mcp_action_schema_match.json` are created before execution.
- Confirm `mcp_capabilities.json` includes `availableTools`, `requiredTools`, `optionalTools`, `missingTools`, `missingOptionalTools`, `toolNameResolutions`, and `valid`.
- Confirm `blockbench_preview.json` is created when preview capture runs.
- Confirm `blockbench_export.json` is created only when optional export runs.
- Confirm `mcp_execution_report.json` is created after execution starts.
- Confirm skipped optional tools are recorded with `skipped: true` in `mcp_execution_report.json`.
- Confirm Bedrock Entity jobs use `format: "bedrock"` in `model_plan.json`.
- Confirm Bedrock Block jobs use `format: "bedrock_block"` in `model_plan.json`.
