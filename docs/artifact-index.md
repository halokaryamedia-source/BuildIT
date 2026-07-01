# Artifact Index

BuildIT creates an artifact manifest for every job.

## Purpose

The artifact index gives the desktop app and future export bundle features one stable manifest to inspect.

It tracks:

- artifact name,
- artifact file name,
- availability,
- file size,
- last updated time.

## Output

The manifest is stored as `artifact_index.json` inside each job output folder.

## API behavior

`GET /api/jobs/:id/artifacts` refreshes the manifest and returns both:

- `artifacts`
- `artifactIndex`

`GET /api/jobs/:id/artifacts/artifact_index` refreshes the manifest before returning it.

## Desktop behavior

The desktop app prefers `artifactIndex.artifacts` when available.

This reduces UI coupling to individual artifact checks and keeps artifact metadata consistent.
