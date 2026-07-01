# Job Artifacts API

BuildIT exposes job artifacts through the engine API so the desktop app can show diagnostics without reading local files directly.

## List artifacts

```txt
GET /api/jobs/:id/artifacts
```

Response:

```json
{
  "artifacts": [
    {
      "name": "model_plan",
      "fileName": "model_plan.json",
      "available": true
    }
  ]
}
```

## Read one artifact

```txt
GET /api/jobs/:id/artifacts/:artifactName
```

Supported artifact names:

```txt
image_analysis
model_plan
model_plan_validation
mcp_actions
mcp_capabilities
mcp_execution_report
```

Response:

```json
{
  "artifact": {
    "name": "mcp_capabilities",
    "fileName": "mcp_capabilities.json",
    "available": true,
    "content": {}
  }
}
```

## Desktop diagnostics

The desktop app polls artifact summaries while a job is running and displays whether each artifact is available or still pending.
