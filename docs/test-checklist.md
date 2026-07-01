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
- Write a prompt.
- Select one reference image.
- Click Generate.
- Confirm a job is created.
- Confirm the active job status appears in the sidebar.
- Confirm recent job logs appear in the job card.
- Confirm the logs mention reference image analysis when an image is selected.

## Output files

- Confirm uploaded references are saved under `outputs/jobs/<jobId>/references/`.
- Confirm `outputs/jobs/<jobId>/image_analysis.json` is created when an image is selected.
- Confirm the job response includes `input.imagePaths`.
- Confirm the job response includes `input.referenceImages` metadata.
