# Blockbench Production Workspace

`workspace/` stores active and completed projects. Every project separates user-facing Blockbench files from MCP internals.

```text
workspace/
├─ workspace.example.json
├─ workspace.json                      # local index, ignored by Git
├─ active/
│  └─ <asset_id>/
└─ completed/
   └─ <asset_id>/
```

Each project uses the same layout:

```text
<asset_id>/
├─ blockbench/                         # user-facing; copy this folder alone
│  ├─ <asset_id>.bbmodel
│  ├─ textures/
│  ├─ references/
│  ├─ previews/
│  └─ README.md
└─ mcp/                                # internal workflow and recovery data
   ├─ project.json
   ├─ state.json
   ├─ references/
   ├─ checkpoints/
   ├─ evidence/
   ├─ reports/
   └─ final/                           # temporary validation staging
```

## User Files

Everything required for normal Blockbench use is inside `blockbench/`:

- the canonical `.bbmodel` file;
- PNG textures and other model textures;
- source/reference PNGs;
- approved preview renders.

Users do not need to copy `mcp/` unless they want Codex/MCP revision history and recovery support.

## MCP Files

`mcp/` stores connection metadata, state, technical reference documents, checkpoints, evidence, and reports. Completed projects keep this folder so they can be reopened later without rediscovering the project setup.

Live MCP session IDs, request IDs, sockets, and write leases are never persisted. Reopening always creates a fresh connection and lease from the saved project metadata.

## Commands

Run from `mcp-blockbench/`:

```powershell
bun run workspace -- init <asset_id> --display-name "Display Name"
bun run workspace -- list
bun run workspace -- activate <asset_id>
bun run workspace -- inspect <asset_id>
bun run workspace -- complete <asset_id> --approval-ref "<user approval>"
bun run workspace -- reopen <asset_id> --stage TEXTURE --reason "<reason>"
```

Completion promotes validated files into `blockbench/`, freezes MCP state, and moves the project from `active/` to `completed/`. A reopened revision copies the completed baseline into `active/` while leaving the approved completed baseline unchanged until the new revision is approved.

The full contract lives at `engines/shared/workspace/WORKSPACE_CONTRACT.md`.
