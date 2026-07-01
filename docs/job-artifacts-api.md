# Job Artifacts API

BuildIT exposes job artifacts through the engine API so the desktop app can show diagnostics without reading local files directly.

Artifacts are read from the job output folder, so artifact reads can still work even when the job is no longer present in the in-memory job store.

## List artifacts

```txt
GET /api/jobs/:id/artifacts
```

This endpoint refreshes the job artifact index and job bundle manifest before returning.

Response:

```json
{
  "artifacts": [
    {
      "name": "model_plan",
      "fileName": "model_plan.json",
      "available": true,
      "sizeBytes": 1024,
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "artifactIndex": {
    "jobId": "job_123",
    "generatedAt": "2026-01-01T00:00:00.000Z",
    "artifactCount": 11,
    "availableCount": 5,
    "artifacts": []
  },
  "jobBundle": {
    "jobId": "job_123",
    "bundleVersion": 1,
    "bundleType": "buildit_job_output",
    "ready": true,
    "missingRequiredFiles": [],
    "files": []
  }
}
```

## Read one artifact

```txt
GET /api/jobs/:id/artifacts/:artifactName
```

Supported artifact names:

```txt
job_snapshot
artifact_index
job_bundle
image_analysis
model_plan
model_plan_validation
mcp_actions
mcp_capabilities
blockbench_preview
blockbench_export
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

When `artifactIndex` is available, the desktop app prefers the manifest artifact list because it also includes file size and update time.
