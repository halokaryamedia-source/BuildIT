# Persistent Job History

BuildIT stores every job snapshot so job history can survive engine restarts.

## Job list behavior

`GET /api/jobs` merges two sources:

- jobs currently in memory,
- persisted job snapshots found in the output folder.

When the same job exists in both sources, the in-memory job wins because it is the freshest runtime state.

## Single job behavior

`GET /api/jobs/:id` first checks the in-memory job store. If the job is missing from memory, the engine attempts to read the persisted job snapshot from the job output folder.

## Desktop behavior

The desktop app shows recent jobs in the sidebar.

A recent job can be opened even after the engine has restarted, as long as its output folder and snapshot still exist.
