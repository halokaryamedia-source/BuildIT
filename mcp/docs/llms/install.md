## Install BlockIT Locally

BlockIT must be validated from this repository's **`Local` branch**. Do **not** use the upstream hosted Blockbench MCP plugin as proof of BlockIT; it is a different product surface.

Build the local plugin from `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Load the generated file in desktop Blockbench:

```text
mcp/dist/mcp.js
```

Default MCP endpoint after the plugin is running:

```text
http://127.0.0.1:3000/bb-mcp
```

Keep the **Extended MCP Profile** off for the normal Bedrock Entity baseline. `risky_eval` and `from_geo_json` remain disabled.

For the current repository acceptance procedure, follow root `docs/knowledge/next-action.md` and `docs/knowledge/operations/local-acceptance-runbook.md`. This install fragment only owns local build/load guidance; it does not replace repository task routing.
