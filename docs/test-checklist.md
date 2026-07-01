# Test Checklist

Use this checklist before merging a development slice into `V1`.

## Engine

- Run `npm run dev:engine`.
- Open `http://localhost:3987/api/health`.
- Confirm the API returns JSON.
- Confirm `ollamaConnected` reflects the local main model state.
- Confirm `visionConnected` reflects the local vision model state.
- Confirm `blockbench.connected` reflects the local Blockbench MCP state.

## Desktop

- Run `npm run dev:desktop`.
- Confirm the project type selector only shows Bedrock Entity and Bedrock Block.
- Confirm the helper text explains that Bedrock Block is a placeable Minecraft Bedrock custom block.
- Select Bedrock Entity and create a job.
- Select Bedrock Block and create a job.
- Select one reference image.
- Click Generate.
- Confirm a job is created.
- Confirm the active job status appears in the sidebar.
- Confirm recent job logs appear in the job card.
- Confirm the logs mention reference image analysis when an image is selected.
- Confirm the logs mention typed model plan generation.

## Output files

- Confirm uploaded references are saved under `outputs/jobs/<jobId>/references/`.
- Confirm `outputs/jobs/<jobId>/image_analysis.json` is created when an image is selected.
- Confirm `outputs/jobs/<jobId>/model_plan.json` is created.
- Confirm Bedrock Entity jobs use `format: "bedrock"` in `model_plan.json`.
- Confirm Bedrock Block jobs use `format: "bedrock_block"` in `model_plan.json`.
- Confirm the job response includes `input.imagePaths`.
- Confirm the job response includes `input.referenceImages` metadata.
