---
name: mcp-server-development
description: Specialist for BlockIT MCP public contracts: tools/resources/prompts, input schemas, result shapes, registration, annotations, Streamable HTTP transport, and MCP protocol behavior. Use when that client-facing boundary is the primary change; package invariants remain owned by mcp/AGENTS.md.
---

# MCP Server Development

Own **client-visible MCP semantics**. The active development route defines goal/scope; `mcp/AGENTS.md` owns package-wide schema/runtime/result/docs/security rules. Do not repeat those rules here.

## Use This Owner For

- tool/resource/prompt public registration and descriptions;
- accepted/rejected input, defaults, optionality, refinements, and protocol errors;
- result/`structuredContent` contract decisions;
- MCP annotations;
- request-owned registration/reconstruction;
- Streamable HTTP / MCP protocol/session behavior;
- SDK compatibility where the MCP boundary itself changes.

Route elsewhere when the primary semantic owner is:

```text
TypeScript type system        → typescript-type-safety
Bun/build/package tooling     → bun-tooling
Blockbench API/Undo/UI/runtime→ blockbench-runtime-development
visual/model judgement        → blockbench-bedrock-modelling
```

Do not stack those specialists merely because the implementation uses their technologies.

## Decision Procedure

1. **Name the exact client-visible contract.** State what a caller currently sees/accepts and what must change.
2. **Preflight generated ownership.** If a public schema/description/spec may change, satisfy the generated-output capability preflight in `mcp/AGENTS.md` **before implementation**; do not accumulate source edits until the active channel can produce the required canonical generated state.
3. **Prove ownership.** Distinguish an MCP contract defect from an underlying Blockbench/runtime, TypeScript, Bun, or modelling problem.
4. **Inspect the narrow owner.** Start with affected source/direct callers; inspect `lib/factories.ts`, shared schemas, registration profile, or `server/net.ts` only when the contract touches them.
5. **Make the smallest contract change.** Reuse current factories/Zod/official SDK architecture. Do not add pagination, profiles, fallback APIs, transports, formats, or abstractions unless the requirement actually needs them.
6. **Keep advertised and runtime semantics aligned.** Required/optional/default/refinement behavior, branch intent, annotations, descriptions, errors, and result shape must tell the same story as execution.
7. **Update generated/public ownership through its source.** Never patch generated docs as the implementation.
8. **Use the proof budget from the active development route.** Static contract proof is not live Blockbench or visual proof.

## Efficiency Checks

When the task is about AI/Codex usage, prefer source-provable waste first:

- duplicated equivalent result representations;
- summary tools returning detail owned by focused reads;
- stale/duplicated public descriptions or prompt content;
- unnecessarily broad defaults where a larger explicit bound already exists.

Do **not** infer model-visible token cost from character count alone, remove retained capability solely to lower tool count, or build a custom router/profile without client evidence.

## Completion

Return to the same development route and confirm:

- the intended MCP contract changed and unrelated contracts did not;
- public schema/description/result semantics match implementation;
- required generated state/gates are current;
- any live/runtime evidence still unavailable is reported rather than inferred.
