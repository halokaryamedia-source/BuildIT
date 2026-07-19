# BuildIT MCP Server

The Blockbench MCP plugin used by BuildIT.

## Fixed production architecture

```text
ChatGPT Reference Studio
→ approved reference package
→ Codex + MCP Blockbench
→ Geometry
→ Texture
→ optional Animation
→ Final Validation
→ completed Blockbench package
```

ChatGPT Reference Studio remains the reference-package authority. Codex owns technical production after receiving that package.

## Intended user experience

Normal project production requires one package intake call:

```text
get_runtime_status once
→ create_project(reference_package_root)
→ inspect_reference_visual_preview once
→ Geometry
→ Texture
→ optional Animation
→ Final Validation
→ complete_stage(FINAL_VALIDATION)
→ WORKSPACE_COMPLETE
```

`create_project(reference_package_root)` automatically:

- reads `reference_manifest.json` from the extracted ChatGPT package;
- derives the canonical asset ID and display name;
- creates `workspace/active/<asset>/blockbench/` and `mcp/`;
- copies technical references and user-facing reference images;
- writes `state.json`, `project.json`, and `workspace.json`;
- creates and saves the Blockbench project;
- synchronizes runtime identity and stage profile;
- prepares current-session write ownership.

Optional `workspace_root`, `asset_id`, and project name are override inputs. The user and Codex do not calculate a save path, create workspace folders, edit JSON, synchronize UUIDs, activate profiles, or manage write leases during normal production.

Final Validation approval automatically promotes the validated model, textures, references, and previews to `workspace/completed/<asset>/blockbench/`, freezes MCP metadata, updates integrity data, removes temporary final staging, and returns the final output path.

## Codex efficiency

- The MCP schema is a stable union of normal production tools, not the entire internal library.
- Manual identity, profile, lease, and full tool inspection are diagnostic-only.
- `get_stage_context` returns compact state, active issues, runtime phase, diagnosis, and contract summaries rather than repeating the full manifest.
- Full authority remains in the approved ChatGPT package and local workspace files.

## Geometry quality

For rotation and pivot work:

- use `rotate_cube_about_attachment` when the approved manifest contract accurately describes the visible attachment;
- use `apply_cube_transforms` for explicit reference-driven transforms, missing or inaccurate contracts, or one bounded related-part batch;
- Blockbench rendered `matrixWorld` corners are the runtime authority when available;
- deterministic Euler transforms remain only as a fallback before render data exists;
- affected-view and final required-view analysis remain mandatory before review.

The existing Geometry validator also supports optional package-defined semantic landmarks. These can validate rendered anchor points and connections such as nose tips, horn tips, neck/head joints, foot contacts, and tail roots independently of the global silhouette score.

## Plugin identity

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

## Package map

| Path | Purpose |
| --- | --- |
| `src/index.ts` | Dependency-free plugin registration bootstrap. |
| `src/runtime.ts` | MCP server, UI, sessions, prompts, and shutdown runtime. |
| `src/lib/workspaceBootstrap.ts` | ChatGPT package intake and canonical workspace creation. |
| `src/lib/renderedGeometry.ts` | Shared rendered pivot, anchor, and parent-space transform authority. |
| `src/server/tools/geometry-direct-transform.ts` | Batched reference-driven cube transforms. |
| `src/server/geometry-landmark-validation-guard.ts` | Optional semantic landmark and connection validation. |
| `src/server/automatic-workspace-finalization.ts` | Final approval output promotion and workspace completion. |
| `scripts/` | Build, manifest, documentation, and maintenance tooling. |
| `tests/` | Workflow, transform, profile, skill, and workspace verification. |
| `dist/mcp.js` | Canonical downloadable plugin bundle. |

## Development commands

Run from this directory:

```powershell
bun install
bun run skills:check
bun run typecheck
bun test
bun run build
```

## Bundle publication

Pull requests validate the freshly generated plugin bundle. After approved source changes reach `Rework`, `.github/workflows/publish-blockbench-plugin.yml` rebuilds and commits only:

```text
mcp-blockbench/dist/mcp.js
```

Source code remains authoritative.

## Developer workspace utilities

```powershell
bun run workspace -- init <asset_id> --display-name "Display Name"
bun run workspace -- list
bun run workspace -- activate <asset_id>
bun run workspace -- inspect <asset_id>
bun run workspace -- complete <asset_id> --approval-ref "<user approval>"
bun run workspace -- reopen <asset_id> --stage TEXTURE --reason "<reason>"
```

These are developer recovery and maintenance utilities. Normal package intake and completion run through MCP automatically.

User files live in `workspace/*/<asset>/blockbench/`. MCP state and recovery data live in the sibling `mcp/` folder.

After editing canonical production skills:

```powershell
bun run skills:sync
bun run skills:check
```

Generated API documentation is written only to `../docs/api/`.

Do not create versioned package folders, parallel source roots, duplicate local plugin entries, or manually edit generated skill adapters.
