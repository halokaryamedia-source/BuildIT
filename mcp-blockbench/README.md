# MCP Blockbench

The complete Blockbench MCP plugin package.

## Package Map

| Path | Purpose |
| --- | --- |
| `src/` | Plugin, MCP runtime, tools, resources, and UI. |
| `scripts/` | Build, prompt-manifest, and API-documentation tooling. |
| `prompts/` | MCP prompt assets. |
| `tests/` | Focused package and workflow verification. |
| `dist/` | Generated Blockbench plugin output. |

## Local Commands

Run from this directory:

```powershell
bun install
bun run typecheck
bun test
bun run dev
```

Generated API documentation is written only to `../docs/api/`.

Do not create versioned package folders or parallel source roots.
