# Source Contract

## Official sources
- Blockbench MCP source: https://github.com/achmadawdi/mcp-blockbench
- Blockbench MCP README: https://github.com/achmadawdi/mcp-blockbench/blob/master/README.md
- Blockbench MCP API schema: https://github.com/achmadawdi/mcp-blockbench/blob/master/docs/api.json
- Blockbench MCP AGENTS guide: https://github.com/achmadawdi/mcp-blockbench/blob/master/AGENTS.md
- Blockbench skill source: https://github.com/jasonjgardner/blockbench-mcp-project
- Blockbench skill docs: https://github.com/jasonjgardner/blockbench-mcp-project/tree/main/skills/blockbench-use
- Ollama MCP client: https://github.com/jonigl/mcp-client-for-ollama
- MCP specification: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
- Tauri v2: https://v2.tauri.app/
- uv/uvx: https://docs.astral.sh/uv/guides/tools/
- Ollama API: https://github.com/ollama/ollama/blob/main/docs/api.md

## Required rules
- Do not invent MCP tools, parameters, schemas, or workflows.
- Use docs/api.json as the tool schema contract.
- One active MCP bridge engine only.
- No folders named legacy, old, v1, v2, v3, new-engine, engine-final, engine-fixed.
- Do not implement Blockbench modeling logic.
- Do not replace ollmcp with custom loops.
- Remote endpoints require explicit user confirmation.

## Pinned references
- Upstream MCP source commit: `contracts/upstream/mcp-blockbench/pinned-commit.txt`
- Copied API schema: `contracts/upstream/mcp-blockbench/api.json`
