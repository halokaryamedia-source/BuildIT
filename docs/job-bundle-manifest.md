# Job Bundle Manifest

BuildIT creates a bundle manifest for every job.

## Purpose

`job_bundle.json` is a foundation for future download/export package features.

It does not create a ZIP archive yet. It describes what should be included in a future bundle.

## Output

The manifest is stored as `job_bundle.json` inside each job output folder.

## Contents

The bundle manifest includes:

- job id,
- bundle version,
- bundle type,
- readiness state,
- missing required files,
- files grouped by role,
- artifact index snapshot.

## File roles

Bundle files can be grouped as:

- `state`
- `input`
- `plan`
- `validation`
- `mcp`
- `preview`
- `export`
- `diagnostic`
- `manifest`

## API behavior

`GET /api/jobs/:id/artifacts` refreshes both `artifact_index.json` and `job_bundle.json`.

`GET /api/jobs/:id/artifacts/job_bundle` refreshes the bundle manifest before returning it.

## Future use

A later slice can turn this manifest into:

- ZIP download,
- export package,
- shareable debug bundle,
- resource-pack output bundle.
