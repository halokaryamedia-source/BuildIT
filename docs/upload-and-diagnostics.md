# Upload and Diagnostics

BuildIT validates reference images on both the desktop side and the engine side.

## Reference image limits

- File type must be `image/*`.
- File size must be 10 MB or smaller.
- Engine JSON request bodies are limited to 16 MB.
- The MIME type in the Data URL must match the uploaded file MIME type.

## Desktop diagnostics

The desktop app shows:

- main model connection state,
- vision model connection state,
- MCP tool capability state,
- active job status,
- artifact availability count,
- artifact JSON content viewer.

## Artifact viewer

When an artifact is available, the desktop app can read it through the job artifact API and render formatted JSON.

Useful artifacts:

```txt
image_analysis.json
model_plan.json
model_plan_validation.json
mcp_actions.json
mcp_capabilities.json
mcp_execution_report.json
```

This makes debugging possible without manually opening files from the output directory.
