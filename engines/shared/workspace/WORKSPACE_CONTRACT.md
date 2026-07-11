# Workspace Lifecycle Contract

## Purpose

`workspace/` stores active and completed Blockbench work while keeping user-facing model assets separate from MCP runtime data.

```text
workspace/
├─ workspace.json                     # local index and selected project
├─ active/<asset_id>/
└─ completed/<asset_id>/
```

Every project has exactly two top-level data areas:

```text
<asset_id>/
├─ blockbench/                        # user-facing files; safe to copy alone
└─ mcp/                               # MCP state, contracts, evidence, and recovery data
```

## User-Facing Blockbench Package

```text
blockbench/
├─ <asset_id>.bbmodel
├─ textures/
├─ references/
├─ previews/
└─ README.md
```

This folder contains only files useful to a Blockbench user:

- the canonical `.bbmodel` project;
- PNG textures and other texture images;
- source/reference PNGs used to build the model;
- approved preview renders;
- a short usage note.

A user may copy the entire `blockbench/` folder without taking MCP internals.

## MCP Internal Package

```text
mcp/
├─ project.json
├─ state.json
├─ references/                        # technical reference contract
├─ checkpoints/
├─ evidence/
├─ reports/
└─ final/                             # temporary final-validation staging only
```

This folder contains agent/runtime data and is not required for ordinary Blockbench use. It is retained after completion so the project can be reopened without rediscovery.

Do not store live session IDs, sockets, request IDs, or write leases in completed data. A reopened project always creates a fresh MCP session and write lease.

## Lifecycle

```text
ACTIVE
→ final user approval
→ promote validated files into blockbench/
→ freeze MCP state
→ move project directory to completed/

COMPLETED
→ inspect read-only without reopening
→ or copy to active/ for a targeted revision
→ revalidate downstream stages
→ final user approval
→ atomically replace completed project
```

The completed baseline remains immutable while a reopened revision is active.

## Naming

Use one canonical asset ID and one canonical model filename:

```text
<asset_id>.bbmodel
```

Do not create `v2`, `latest`, `backup`, `final-final`, or parallel project folders. Git/filesystem history and approved checkpoints hold revisions.

## Retention

Keep after completion:

- `blockbench/` in full;
- technical reference contract;
- frozen `state.json` and `project.json`;
- approved checkpoints;
- approved/final evidence;
- validation report and approval reference;
- integrity hashes.

Remove temporary `.tmp`/`.bak` files, failed evidence attempts, transient session logs, write leases, and temporary final staging after successful completion.
