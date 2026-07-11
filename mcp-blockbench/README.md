# MCP Blockbench

The complete Blockbench MCP plugin package.

## Package Map

| Path | Purpose |
| --- | --- |
| `src/` | Plugin, MCP runtime, tools, resources, and UI. |
| `scripts/` | Build, prompt-manifest, API-documentation, and maintenance tooling. |
| `prompts/` | MCP prompt assets. |
| `tests/` | Focused package, workflow, tool-profile, and skill-profile verification. |
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

After editing canonical production skills:

```powershell
bun run skills:sync
bun run skills:check
```

Generated API documentation is written only to `../docs/api/`.

Do not create versioned package folders, parallel source roots, or manually edit generated skill adapters.
