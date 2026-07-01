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
- Confirm `mcpCapabilities.missingTools` is empty when the MCP server is compatible.
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
- Confirm `job_snapshot.json` appears in the artifact list.
- Confirm `artifact_index.json` appears in the artifact list.
- Confirm `stored_data_manifest.json` appears in the artifact list.
- Confirm `mcp_tool_schema.json` appears in the artifact list after MCP capability discovery.
- Confirm `mcp_action_schema_match.json` appears in the artifact list before MCP execution.
- Confirm requests larger than 16 MB are rejected by the engine API.
- Confirm non-image reference uploads are rejected by the engine.
- Confirm reference images larger than 10 MB are rejected by the engine.

## Desktop

- Run `npm run dev:desktop`.
- Confirm the project type selector only shows Bedrock Entity and Bedrock Block.
- Confirm the helper text explains that Bedrock Block is a placeable Minecraft Bedrock custom block.
- Confirm the sidebar shows main model, vision model, and MCP tool health.
- Confirm the sidebar shows recent jobs.
- Confirm the sidebar shows Stored Data Root when a job has artifacts.
- Confirm clicking Open Stored Data opens the job output folder directly.
- Confirm clicking a recent job opens that job and its artifacts.
- Confirm selecting a non-image file shows a validation message.
- Confirm selecting an image larger than 10 MB shows a validation message.
- Select Bedrock Entity and create a job.
- Select Bedrock Block and create a job.
- Select one valid reference image.
- Click Generate.
- Confirm a job is created.
- Confirm the active job status appears in the sidebar.
- Confirm workflow stage appears in the sidebar and job card.
- Confirm recent job logs appear in the job card.
- Confirm artifact availability appears in the sidebar.
- Confirm the job artifacts card shows available and pending artifact files.
- Confirm available artifact rows show size and update time.
- Click View on an available artifact.
- Confirm the artifact JSON viewer displays formatted JSON.
- Confirm `mcp_tool_schema.json` displays the captured Blockbench MCP tool definitions.
- Confirm `mcp_action_schema_match.json` displays original and normalized MCP actions.
- Confirm `blockbench_preview.json` displays an image when `imageDataUrl` is present.
- Confirm the logs mention reference image analysis when an image is selected.
- Confirm the logs mention typed model plan generation.
- Confirm the logs mention model plan validation.
- Confirm the logs mention MCP action list creation.
- Confirm the logs mention MCP tool schema reporting.
- Confirm the logs mention MCP action schema matching.
- Confirm the logs mention MCP capability reporting.
- Confirm the logs mention MCP execution reporting after execution.

## Output files

- Confirm uploaded references are saved under `outputs/jobs/<jobId>/references/`.
- Confirm `outputs/jobs/<jobId>/job_snapshot.json` is created and updated during progress.
- Confirm `outputs/jobs/<jobId>/artifact_index.json` is created when artifact summaries are requested.
- Confirm `outputs/jobs/<jobId>/stored_data_manifest.json` is created when artifact summaries are requested.
- Confirm `outputs/jobs/<jobId>/image_analysis.json` is created when an image is selected.
- Confirm `outputs/jobs/<jobId>/model_plan.json` is created.
- Confirm `outputs/jobs/<jobId>/model_plan_validation.json` is created.
- Confirm `outputs/jobs/<jobId>/mcp_actions.json` is created.
- Confirm `mcp_actions.json` includes `valid`, `format`, `actionCount`, `issues`, and `actions`.
- Confirm `outputs/jobs/<jobId>/mcp_tool_schema.json` is created after `tools/list` succeeds.
- Confirm `outputs/jobs/<jobId>/mcp_action_schema_match.json` is created after MCP schema matching.
- Confirm `mcp_action_schema_match.json` includes original actions, normalized actions, removed arguments, warnings, and errors.
- Confirm `outputs/jobs/<jobId>/mcp_capabilities.json` is created before execution.
- Confirm `mcp_capabilities.json` includes `availableTools`, `requiredTools`, `optionalTools`, `missingTools`, `missingOptionalTools`, and `valid`.
- Confirm `outputs/jobs/<jobId>/blockbench_preview.json` is created when preview capture runs.
- Confirm `outputs/jobs/<jobId>/blockbench_export.json` is created only when optional export runs.
- Confirm `outputs/jobs/<jobId>/mcp_execution_report.json` is created after execution starts.
- Confirm skipped optional tools are recorded with `skipped: true` in `mcp_execution_report.json`.
- Confirm Bedrock Entity jobs use `format: "bedrock"` in `model_plan.json`.
- Confirm Bedrock Block jobs use `format: "bedrock_block"` in `model_plan.json`.
- Confirm Bedrock Block validation keeps the plan in placeable Minecraft custom block context.
- Confirm the job response includes `input.imagePaths`.
- Confirm the job response includes `input.referenceImages` metadata.
