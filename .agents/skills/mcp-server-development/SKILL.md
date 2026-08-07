---
name: mcp-server-development
description: Specialist for the BlockIT MCP server boundary. Use when a Developing task changes MCP tools, resources, prompts, server registration, tool/result contracts, annotations, Streamable HTTP transport, session lifecycle, or MCP protocol behavior. Follow the existing TypeScript/Bun/official-SDK architecture instead of scaffolding a generic MCP server. Do not use for a Zod-only issue, general TypeScript issue, Bun tooling issue, Blockbench plugin/UI/runtime API issue, or 3D modelling task unless the MCP server contract itself is the primary change.
---

# MCP Server Development

Own the **MCP protocol/server boundary** for BlockIT. Preserve the current repository architecture and make the smallest contract change required by the `development-brief`.

## Boundary

Use this skill for:

- MCP tool/resource/prompt registration and public descriptions;
- MCP request/result shape and structured output decisions;
- tool annotations and protocol-facing error behavior;
- server reconstruction/registration behavior;
- Streamable HTTP transport and MCP session lifecycle;
- protocol compatibility or MCP SDK integration changes.

Do not absorb adjacent specialist domains:

- schema semantics only → `zod`;
- general TypeScript typing/module problems → `typescript-expert`;
- Bun/package/build tooling → `bun-development`;
- Blockbench plugin lifecycle, UI, globals, or model manipulation → `blockbench-plugins`;
- modelling decisions → Blockbench modelling skill when available.

When a task touches several areas, keep this skill only if the **primary semantic owner is the MCP server contract**. Apply existing repository rules at adjacent boundaries rather than stacking overlapping specialists.

## Local Architecture First

Before editing, inspect only what is relevant:

1. `mcp/AGENTS.md`;
2. `mcp/package.json`;
3. the affected MCP source and direct registration/callers;
4. `mcp/lib/factories.ts` when tool/resource/prompt registration is involved;
5. `mcp/server/net.ts` and session code only when transport/session behavior is involved.

BlockIT already uses:

- TypeScript + Bun;
- the official `@modelcontextprotocol/sdk`;
- `McpServer` and `registerTool`/resource/prompt registration;
- Zod at MCP input boundaries;
- a repository-specific Streamable HTTP/session implementation;
- generated MCP documentation from repository-owned specs/manifests.

Do **not** replace this with Python/FastMCP, Express scaffolding, stdio, a new server layout, or another transport merely because a generic MCP guide recommends it.

## Development Procedure

1. **Identify the exact MCP contract**
   - What client-visible behavior or protocol boundary must change?
   - Is the problem actually MCP-owned, or is it Blockbench/Zod/TypeScript/Bun-owned?

2. **Inspect the existing owner**
   - Reuse current factories, registration patterns, session lifecycle, and docs source.
   - Check direct callers/registration only as far as needed to establish impact.

3. **Define the smallest contract change**
   - Keep tool names/descriptions accurate and concise.
   - Keep annotations consistent with real behavior.
   - Add structured output only when it gives the client a concrete benefit.
   - Do not add pagination, API clients, formats, capabilities, fallbacks, or abstractions without a demonstrated BlockIT need.

4. **Implement at the shared owner**
   - Avoid duplicate protocol logic across tools.
   - Keep build-time schemas free of Blockbench runtime globals.
   - Preserve current valid transport/session behavior unless that behavior is the proved problem.

5. **Update generated/public documentation only when the public MCP surface changed**
   - Change the source manifest/spec, not generated output by hand.

6. **Use the active proof budget**
   - ChatGPT → GitHub: inspect exact diff, affected registration/callers/contracts, and repository consistency. Do not claim live MCP behavior.
   - Codex local: use the smallest MCP Inspector/live-client/runtime check that can falsify the changed contract. Add build/typecheck only when informative.

## Anti-Slop Rules

- Do not build a generic MCP server inside the existing Blockbench MCP project.
- Do not implement broad API coverage when one focused Blockbench operation solves the need.
- Do not require a synthetic evaluation suite or fixed number of evaluation questions for ordinary changes.
- Do not treat more tools as better capability by default.
- Do not duplicate Zod, TypeScript, Bun, or Blockbench specialist guidance here.
- Do not replace current session/transport architecture without explicit evidence and a migration requirement.
- A successful MCP call proves execution, not Blockbench visual quality.

## Completion

Return to the original `development-brief` and confirm:

- the intended MCP contract changed as required;
- unrelated MCP behavior stayed outside scope;
- client-facing descriptions/result semantics match implementation;
- the minimum useful proof for the active execution channel is complete;
- any live Blockbench/MCP behavior not testable through GitHub is explicitly left for the final Codex-local proof instead of being fabricated.
