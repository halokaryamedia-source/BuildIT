---
name: mcp-server-development
description: Specialist for the BlockIT MCP server and public contract boundary. Use when a Developing task changes MCP tools, resources, prompts, input schemas/validation, server registration, request/result contracts, annotations, Streamable HTTP transport, session lifecycle, or MCP protocol behavior. Follow the existing TypeScript/Bun/official-SDK architecture instead of scaffolding a generic MCP server. Do not use for a TypeScript type-system-only issue, Bun tooling issue, Blockbench plugin/UI/runtime API issue, or 3D modelling task unless the MCP server contract itself is the primary change.
---

# MCP Server Development

Own the **MCP protocol/server and input-contract boundary** for BlockIT. Preserve the current repository architecture and make the smallest contract change required by the `development-brief`.

## Boundary

Use this skill for:

- MCP tool/resource/prompt registration and public descriptions;
- MCP input schemas, accepted/rejected values, defaults, optionality, and refinements;
- MCP request/result shape and structured output decisions;
- tool annotations and protocol-facing error behavior;
- server reconstruction/registration behavior;
- Streamable HTTP transport and MCP session lifecycle;
- protocol compatibility or MCP SDK integration changes.

Do not absorb adjacent specialist domains:

- TypeScript inference/generics/declaration/type-system problems → `typescript-type-safety`;
- Bun/package/build tooling → Bun specialist when retained;
- Blockbench plugin lifecycle, UI, globals, or model manipulation → Blockbench plugin specialist;
- modelling decisions → Blockbench modelling skill when available.

When a task touches several areas, keep this skill only if the **primary semantic owner is the MCP server/public contract**. Apply ordinary language/tool correctness at adjacent boundaries instead of stacking overlapping specialists.

## Local Architecture First

Before editing, inspect only what is relevant:

1. `mcp/AGENTS.md`;
2. `mcp/package.json` when dependency/build context matters;
3. the affected MCP source and direct registration/callers;
4. `mcp/lib/factories.ts` when tool/resource/prompt registration is involved;
5. `mcp/lib/zodObjects.ts` when a shared input schema is involved;
6. `mcp/server/net.ts` and session code only when transport/session behavior is involved.

BlockIT already uses:

- TypeScript + Bun;
- the official `@modelcontextprotocol/sdk`;
- `McpServer` and repository registration factories;
- Zod for MCP input schemas;
- a repository-specific Streamable HTTP/session implementation;
- generated MCP documentation from repository-owned specs/manifests.

Do **not** replace this with Python/FastMCP, Express scaffolding, stdio, a new server layout, another schema library, or another transport merely because a generic guide recommends it.

## Input Schema Rules

Treat a Zod schema as part of the MCP contract, not as a place for generic framework experimentation.

- validate external/MCP input at the boundary;
- express the values the tool actually accepts—do not make fields optional merely for convenience;
- distinguish `optional`, `default`, nullable values, coercion, transforms, and refinements by real runtime meaning;
- reuse existing shared schemas before creating near-duplicates;
- derive TypeScript types from the schema when that keeps one contract owner; do not maintain conflicting manual copies;
- use `unknown` for untrusted data until the schema or explicit runtime check establishes shape;
- avoid duplicate validation of the same boundary unless each check proves a distinct invariant;
- keep schema construction free of Blockbench runtime globals because docs/build import schemas outside Blockbench;
- place validation that truly depends on live Blockbench state inside execution, not module-level schema construction;
- keep errors specific enough to identify invalid input without exposing unrelated internals.

Do not import form-validation/i18n/bundle-optimization/Zod-Mini/performance patterns unless a concrete BlockIT requirement proves they are needed.

## Development Procedure

1. **Identify the exact MCP contract**
   - What client-visible behavior, accepted input, result, or protocol boundary must change?
   - Is the problem actually MCP-owned, or is it Blockbench/Bun/TypeScript-type-system-owned?

2. **Inspect the existing owner**
   - Reuse current factories, shared schemas, registration patterns, session lifecycle, and docs source.
   - Check direct callers/registration only as far as needed to establish impact.

3. **Define the smallest contract change**
   - Keep tool names/descriptions accurate and concise.
   - Keep annotations consistent with real behavior.
   - Make schema constraints/defaults match actual execution semantics.
   - Add structured output only when it gives the client a concrete benefit.
   - Do not add pagination, API clients, formats, capabilities, fallbacks, or abstractions without a demonstrated BlockIT need.

4. **Implement at the shared owner**
   - Avoid duplicate protocol/schema logic across tools.
   - Keep build-time schemas free of Blockbench runtime globals.
   - Preserve current valid transport/session behavior unless that behavior is the proved problem.

5. **Update generated/public documentation only when the public MCP surface changed**
   - Change the source manifest/spec/schema, not generated output by hand.

6. **Use the active proof budget**
   - ChatGPT → GitHub: inspect exact diff, affected registration/callers/schema contracts, and repository consistency. Do not claim live MCP behavior.
   - Codex local: use the smallest MCP Inspector/live-client/runtime or targeted build/typecheck check that can falsify the changed contract. Do not run unrelated suites.

## Anti-Slop Rules

- Do not build a generic MCP server inside the existing Blockbench MCP project.
- Do not implement broad API coverage when one focused Blockbench operation solves the need.
- Do not load a separate schema skill for ordinary MCP Zod work.
- Do not require a synthetic evaluation suite or fixed number of evaluation questions for ordinary changes.
- Do not treat more tools, more schema layers, or more validation passes as better capability by default.
- Do not replace current session/transport/schema architecture without explicit evidence and a migration requirement.
- A valid schema or successful MCP call proves contract/execution behavior, not Blockbench visual quality.

## Completion

Return to the original `development-brief` and confirm:

- the intended MCP/input contract changed as required;
- accepted/rejected/defaulted input semantics match execution;
- unrelated MCP behavior stayed outside scope;
- client-facing descriptions/result semantics match implementation;
- the minimum useful proof for the active execution channel is complete;
- any live Blockbench/MCP behavior not testable through GitHub is explicitly left for final Codex-local proof instead of being fabricated.
