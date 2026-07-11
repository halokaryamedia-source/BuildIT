# BuildIT MCP Server

The complete Blockbench MCP plugin package used by BuildIT.

## Plugin Identity

| Field | Value |
| --- | --- |
| Title | `BuildIT MCP Server` |
| Author | `MIVUBI` |
| Plugin ID | `mcp` |
| Version | `1.6.3` |
| Canonical endpoint | `http://localhost:3000/bb-mcp` |
| Canonical bundle | `dist/mcp.js` |

The expected Blockbench plugin card is **BuildIT MCP Server — by MIVUBI**. A plain local entry displayed only as `mcp` with version `0.0.1` means the bundle failed before `BBPlugin.register()` completed.

## Install in Blockbench

### Preferred distribution method: URL

After `mcp-blockbench/dist/mcp.js` is published on branch `Rework`, use **File → Plugins → Load Plugin from URL** with:

```text
https://raw.githubusercontent.com/halokaryamedia-source/BuildIT/Rework/mcp-blockbench/dist/mcp.js
```

URL installation is preferred for normal use because Blockbench remembers the remote source and downloads the same canonical bundle. It does not bypass runtime errors; the bundle must still execute successfully.

### Local development method: File

1. Build from `mcp-blockbench/` with `bun run build`.
2. Open exactly one Blockbench desktop window.
3. Use **File → Plugins → Load Plugin from File**.
4. Select `mcp-blockbench/dist/mcp.js`.
5. Grant the requested process and network permissions.
6. Confirm the plugin card shows `BuildIT MCP Server`, author `MIVUBI`, version `1.6.3`.
7. Confirm the plugin reports `BuildIT MCP ready at http://localhost:3000/bb-mcp`.

Do not keep multiple local or remote copies active at the same time.

## Bootstrap Reliability

The dependency-free entry in `src/index.ts` registers the plugin identity before loading the MCP runtime from `src/runtime.ts`. This prevents Blockbench from leaving a failed local bundle as the fallback `mcp v0.0.1` entry with an empty author.

## Package Map

| Path | Purpose |
| --- | --- |
| `src/index.ts` | Dependency-free Blockbench plugin registration bootstrap. |
| `src/runtime.ts` | Deferred MCP server, UI, sessions, prompts, and shutdown runtime. |
| `src/` | Remaining MCP runtime, tools, resources, and UI. |
| `scripts/` | Build, prompt-manifest, API-documentation, and maintenance tooling. |
| `prompts/` | MCP prompt assets. |
| `tests/` | Focused package, workflow, tool-profile, skill-profile, and workspace verification. |
| `dist/mcp.js` | Canonical downloadable Blockbench plugin bundle. |

## Local Commands

Run from this directory:

```powershell
bun install
bun run skills:check
bun run typecheck
bun test
bun run dev
```

Use the production build when refreshing the committed bundle:

```powershell
bun run build
```

## GitHub Bundle Publication

`.github/workflows/publish-blockbench-plugin.yml` validates and rebuilds the canonical bundle after `Rework` source changes. The workflow commits only:

```text
mcp-blockbench/dist/mcp.js
```

Source code remains authoritative; the tracked bundle exists so Blockbench can load the exact validated plugin directly from GitHub without depending on an old local build.

## Workspace Commands

The workspace keeps user-facing Blockbench assets separate from MCP internals:

```powershell
bun run workspace -- init <asset_id> --display-name "Display Name"
bun run workspace -- list
bun run workspace -- activate <asset_id>
bun run workspace -- inspect <asset_id>
bun run workspace -- complete <asset_id> --approval-ref "<user approval>"
bun run workspace -- reopen <asset_id> --stage TEXTURE --reason "<reason>"
```

User files live in `workspace/*/<asset>/blockbench/`. MCP state and recovery data live in the sibling `mcp/` folder.

After editing canonical production skills:

```powershell
bun run skills:sync
bun run skills:check
```

Generated API documentation is written only to `../docs/api/`.

Do not create versioned package folders, parallel source roots, duplicate local plugin entries, or manually edit generated skill adapters.
