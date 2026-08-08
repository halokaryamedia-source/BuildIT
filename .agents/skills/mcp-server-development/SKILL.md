---
name: mcp-server-development
description: Specialist for the BlockIT MCP server and public contract boundary. Use when a Developing task changes MCP tools, resources, prompts, input schemas/validation, server registration, request/result contracts, annotations, Streamable HTTP transport, session lifecycle, or MCP protocol behavior. Follow the existing TypeScript/Bun/official-SDK architecture instead of scaffolding a generic MCP server. Do not use for a TypeScript type-system-only issue, Bun tooling issue, Blockbench runtime/API issue, or Bedrock modelling task unless the MCP public contract itself is the primary change.
---

# MCP Server Development

Own the **MCP protocol/server and input-contract boundary** for BlockIT. Preserve
the current repository architecture and make the smallest contract change
required by the active `development-brief`.

## Boundary

Use this skill for:

- MCP tool/resource/prompt registration and public descriptions;
- MCP input schemas, accepted/rejected values, defaults, optionality, and refinements;
- MCP request/result shape and structured output decisions;
- tool annotations and protocol-facing error behavior;
- server reconstruction/registration behavior;
- Streamable HTTP transport and MCP session lifecycle;
- MCP SDK/protocol compatibility.

Adjacent owners:

- TypeScript type-system problems → `typescript-type-safety`;
- Bun/package/build tooling → `bun-tooling`;
- Blockbench lifecycle/UI/globals/mutation mechanics →
  `blockbench-runtime-development`;
- model shape/proportion/visual judgement → `blockbench-bedrock-modelling`.

When several technologies are present, use this skill only when the **primary
semantic owner is the MCP public contract**. Do not stack specialists merely
because the implementation also uses TypeScript, Bun, or Blockbench APIs.

## Local Architecture First

Inspect only what is relevant:

1. `mcp/AGENTS.md`;
2. the affected MCP source and direct registration/callers;
3. `mcp/lib/factories.ts` for tool/resource/prompt registration;
4. `mcp/lib/zodObjects.ts` for shared input schemas;
5. `mcp/server/net.ts` and session code only for transport/session work;
6. `mcp/package.json` only when dependency/build context matters.

BlockIT already uses TypeScript + Bun, the official
`@modelcontextprotocol/sdk`, repository registration factories, Zod for MCP
input schemas, and a repository-specific Streamable HTTP/session implementation.

Do not replace those with Python/FastMCP, Express scaffolding, stdio, another
schema library, another transport, or a new server layout without a proved
migration requirement.

## Input Contract Rules

- Validate external/MCP input at the boundary.
- Make optional/default/nullability/refinement semantics match real execution.
- Reuse shared schemas before creating near-duplicates.
- Derive TypeScript types from the schema when that keeps one contract owner.
- Keep untrusted data `unknown` until validated.
- Avoid duplicate validation unless each check proves a distinct invariant.
- Keep schema construction free of Blockbench globals; docs/build import schemas
  outside Blockbench.
- Put live-Blockbench validation inside execution.
- Keep protocol-facing errors specific and actionable.

Zod is an implementation mechanism inside this owner, not a separate specialist.

## Procedure

1. Identify the exact client-visible MCP contract that must change.
2. Prove the problem is MCP-owned rather than TypeScript/Bun/Blockbench/modelling-owned.
3. Inspect the existing factory/schema/registration/session owner and direct impact.
4. Make the smallest shared contract change; do not add capabilities, fallbacks,
   pagination, abstractions, or formats without a demonstrated need.
5. Update the source manifest/spec/schema when the public MCP surface changed;
   do not hand-edit generated docs.
6. Apply root `AGENTS.md` minimum-proof rules for the active execution channel.

## Anti-Slop Boundary

- Do not build a generic MCP server inside the existing Blockbench MCP project.
- Do not implement broad API coverage when one focused operation solves the need.
- Do not create a separate schema skill for ordinary MCP Zod work.
- Do not replace working transport/session/schema architecture without evidence.
- A valid schema or successful MCP call is not proof of Blockbench visual quality.

## Completion

Return to `development-brief` and confirm the intended MCP contract changed,
unrelated behavior stayed outside scope, public descriptions/results match the
implementation, and any unavailable live proof is reported rather than inferred.
