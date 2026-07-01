# Job Artifacts API

BuildIT exposes job artifacts through the engine API so the desktop app can show diagnostics without reading local files directly.

Artifacts are read from the job output folder, so artifact reads can still work even when the job is no longer present in the in-memory job store.

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
job_snapshot
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

## Job snapshot fallback

`GET /api/jobs/:id` first checks the in-memory job store. If the job is not available in memory, the engine attempts to return `job_snapshot.json` from the job output folder.

## Desktop diagnostics

The desktop app polls artifact summaries while a job is running and displays whether each artifact is available or still pending.
