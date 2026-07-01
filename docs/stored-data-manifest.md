# Stored Data Manifest

BuildIT stores every job output in a stable stored data folder.

## Purpose

`stored_data_manifest.json` describes where a job's generated files are stored and which files are ready to open.

This is not a ZIP or packaged archive workflow. The intended workflow is to open the stored data folder directly.

## Output

The manifest is stored as `stored_data_manifest.json` inside each job output folder.

## Contents

The manifest includes:

- job id,
- manifest version,
- manifest type,
- stored data root,
- open target path,
- readiness state,
- missing required files,
- files grouped by role,
- artifact index snapshot.

## File roles

Stored data files can be grouped as:

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

`GET /api/jobs/:id/artifacts` refreshes both `artifact_index.json` and `stored_data_manifest.json`.

`GET /api/jobs/:id/artifacts/stored_data_manifest` refreshes the stored data manifest before returning it.

## Future use

A later slice can add an Open Stored Data action in the desktop app that opens `openTargetPath` directly in the system file explorer.
