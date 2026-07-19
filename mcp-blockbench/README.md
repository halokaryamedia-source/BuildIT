# BuildIT MCP Server

The Blockbench MCP plugin used by BuildIT.

## Intended User Experience

The user provides an instruction and reference. Codex owns the technical workflow from a fresh Blockbench project through Geometry, Texture, optional Animation, validation, save, and export.

Normal production must not require the user or Codex to manually calculate a model path, edit workspace JSON, synchronize a project UUID, activate a tool profile, manage a write lease, reconnect MCP, or restart Codex.

```text
get_runtime_status once
→ get_stage_context once
→ create_project(session_root, asset_id)
→ Geometry
→ Texture
→ optional Animation
→ Final Validation
→ export
```

`create_project(session_root, asset_id)` derives the canonical model path, persists the project, synchronizes runtime identity and workspace metadata, activates the recorded stage profile, and prepares current-session write ownership automatically.

For Geometry rotation and pivot work:

- use `rotate_cube_about_attachment` when the approved manifest contract accurately describes the visible attachment;
- use `apply_cube_transforms` for explicit reference-driven transforms, missing or inaccurate contracts, or one bounded related-part batch;
- Blockbench rendered `matrixWorld` corners are the runtime authority when available;
- deterministic Euler transforms remain only as a fallback before render data exists;
- affected-view and final required-view analysis remain mandatory before review.

## Plugin Identity

| Field | Value |
| --- | --- |
| Title | `BuildIT MCP Server` |
| Author | `MIVUBI` |
| Plugin ID | `mcp` |
| Version | Generated from `package.json` |
| Canonical endpoint | `http://localhost:3000/bb-mcp` |
| Canonical bundle | `dist/mcp.js` |

The expected Blockbench plugin card is **BuildIT MCP Server — by MIVUBI**. A plain local entry displayed only as `mcp` with version `0.0.1` means the bundle failed before `BBPlugin.register()` completed.

## Install in Blockbench

### Preferred distribution method: URL

After `mcp-blockbench/dist/mcp.js` is published on branch `Rework`, use **File → Plugins → Load Plugin from URL** with:

```text
https://raw.githubusercontent.com/halokaryamedia-source/BuildIT/Rework/mcp-blockbench/dist/mcp.js
```

Blockbench remembers the remote source and downloads the canonical validated bundle. Keep only one local or remote copy active.

### Local development method

1. Build from `mcp-blockbench/` with `bun run build`.
2. Open one Blockbench desktop window.
3. Use **File → Plugins → Load Plugin from File**.
4. Select `mcp-blockbench/dist/mcp.js`.
5. Grant process and network permissions.
6. Confirm the plugin reports `BuildIT MCP ready at http://localhost:3000/bb-mcp`.

## Package Map

| Path | Purpose |
| --- | --- |
| `src/index.ts` | Dependency-free plugin registration bootstrap. |
| `src/runtime.ts` | MCP server, UI, sessions, prompts, and shutdown runtime. |
| `src/lib/renderedGeometry.ts` | Shared rendered pivot, anchor, and parent-space transform authority. |
| `src/server/tools/geometry-direct-transform.ts` | Batched reference-driven cube transforms. |
| `scripts/` | Build, manifest, documentation, and maintenance tooling. |
| `tests/` | Workflow, transform, profile, skill, and workspace verification. |
| `dist/mcp.js` | Canonical downloadable plugin bundle. |

## Development Commands

Run from this directory:

```powershell
bun install
bun run skills:check
bun run typecheck
bun test
bun run build
```

## Bundle Publication

Pull requests validate the freshly generated plugin bundle. After approved source changes reach `Rework`, `.github/workflows/publish-blockbench-plugin.yml` rebuilds and commits only:

```text
mcp-blockbench/dist/mcp.js
```

Source code remains authoritative.

## Workspace Maintenance

```powershell
bun run workspace -- init <asset_id> --display-name "Display Name"
bun run workspace -- list
bun run workspace -- activate <asset_id>
bun run workspace -- inspect <asset_id>
bun run workspace -- complete <asset_id> --approval-ref "<user approval>"
bun run workspace -- reopen <asset_id> --stage TEXTURE --reason "<reason>"
```

These commands are developer maintenance utilities. Normal production should be initialized and advanced by Codex through MCP.

User files live in `workspace/*/<asset>/blockbench/`. MCP state and recovery data live in the sibling `mcp/` folder.

After editing canonical production skills:

```powershell
bun run skills:sync
bun run skills:check
```

Generated API documentation is written only to `../docs/api/`.

Do not create versioned package folders, parallel source roots, duplicate local plugin entries, or manually edit generated skill adapters.
