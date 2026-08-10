## BlockIT Local Installation

Build the current `Local` branch and load the generated plugin file from this repository:

```bash
git checkout Local
cd mcp
bun install --frozen-lockfile
bun run build
```

Then load `mcp/dist/mcp.js` as a local plugin in desktop Blockbench.

For BlockIT validation, **do not install the hosted `jasonjgardner.github.io/blockbench-mcp-plugin` artifact**. That URL serves the upstream generic plugin and cannot prove this Bedrock Entity-focused fork.

Default MCP URL after the BlockIT plugin is loaded:

```text
http://127.0.0.1:3000/bb-mcp
```
