# BuildIT MCP Server

The complete Blockbench MCP plugin package used by BuildIT.

## Plugin Identity

| Field | Value |
| --- | --- |
| Title | `BuildIT MCP Server` |
| Author | `achmadawdi` |
| Plugin ID | `mcp` |
| Version source | `package.json` |
| Canonical endpoint | `http://localhost:3000/bb-mcp` |
| Canonical bundle | `dist/mcp.js` |

The expected Blockbench plugin card is **BuildIT MCP Server — by achmadawdi**. A plain local entry displayed only as `mcp` should be treated as an old or incomplete local copy.

## Install in Blockbench

1. Download `mcp-blockbench/dist/mcp.js` from branch `Rework`.
2. Open exactly one Blockbench desktop window.
3. Use **File → Plugins → Load Plugin from File**.
4. Select the downloaded `mcp.js`.
5. Grant the local network permission requested by Blockbench.
6. Confirm the plugin reports `BuildIT MCP ready at http://localhost:3000/bb-mcp`.

Do not keep multiple local copies active at the same time.

## Package Map

| Path | Purpose |
| --- | --- |
| `src/` | Plugin, MCP runtime, tools, resources, and UI. |
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

`.github/workflows/publish-blockbench-plugin.yml` validates and rebuilds the canonical bundle after relevant `Rework` source changes. The workflow commits only:

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
