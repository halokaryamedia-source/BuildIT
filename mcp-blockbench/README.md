# MCP Blockbench

The complete Blockbench MCP plugin package.

## Package Map

| Path | Purpose |
| --- | --- |
| `src/` | Plugin, MCP runtime, tools, resources, and UI. |
| `scripts/` | Build, prompt-manifest, API-documentation, and maintenance tooling. |
| `prompts/` | MCP prompt assets. |
| `tests/` | Focused package, workflow, tool-profile, skill-profile, and workspace verification. |
| `dist/` | Generated Blockbench plugin output. |

## Local Commands

Run from this directory:

```powershell
bun install
bun run skills:check
bun run typecheck
bun test
bun run dev
```

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

Do not create versioned package folders, parallel source roots, or manually edit generated skill adapters.
