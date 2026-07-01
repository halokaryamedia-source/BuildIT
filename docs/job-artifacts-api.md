# Job Artifacts API

BuildIT exposes job artifacts through the engine API so the desktop app can show diagnostics without reading local files directly.

Artifacts are read from the job stored data folder, so artifact reads can still work even when the job is no longer present in the in-memory job store.

## List artifacts

```txt
GET /api/jobs/:id/artifacts
```

This endpoint refreshes the job artifact index and stored data manifest before returning.

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
    "artifactCount": 13,
    "availableCount": 5,
    "artifacts": []
  },
  "storedDataManifest": {
    "jobId": "job_123",
    "manifestVersion": 1,
    "manifestType": "buildit_stored_data",
    "storedDataRoot": "outputs/jobs/job_123",
    "openTargetPath": "outputs/jobs/job_123",
    "ready": true,
    "missingRequiredFiles": []
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
stored_data_manifest
image_analysis
model_plan
model_plan_validation
mcp_actions
mcp_tool_schema
mcp_tool_name_mapping
mcp_action_schema_match
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

`GET /api/jobs/:id` first checks the in-memory job store. If the job is not available in memory, the engine attempts to return `job_snapshot.json` from the job stored data folder.

## Desktop diagnostics

The desktop app polls artifact summaries while a job is running and displays whether each artifact is available or still pending.

When `artifactIndex` is available, the desktop app prefers the manifest artifact list because it also includes file size and update time.

When `storedDataManifest` is available, the desktop app shows the Stored Data Root so the saved output location is clear.
