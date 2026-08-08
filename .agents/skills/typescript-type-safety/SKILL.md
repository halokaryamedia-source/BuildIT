---
name: typescript-type-safety
description: Specialist for TypeScript type-system problems in BlockIT. Use only when the primary problem is compiler/type-safety behavior such as inference, generics, unions/narrowing, unsafe assertions, declaration typing, public type contracts, or compile-time module typing. Do not use merely because a file is TypeScript; prefer the owning MCP, Bun, Blockbench-runtime, or modelling specialist when TypeScript is only the implementation language.
---

# TypeScript Type Safety

Own only the **TypeScript language/type-system boundary** for BlockIT.
Normal `.ts` implementation does not require this skill.

## Use This Skill For

- compiler errors caused by incompatible or incorrectly inferred types;
- generics, constraints, conditional/discriminated unions, and narrowing;
- removing unjustified `any`, casts, or unsafe assertions;
- public TypeScript interfaces/types whose compile-time contract matters;
- declaration files or external-library typings;
- compile-time import/module typing when TypeScript owns the failure;
- compiler/type-complexity problems when they are the proved bottleneck.

Adjacent owners:

- MCP tools/resources/prompts/input-schema semantics → `mcp-server-development`;
- Bun commands/build/dependency/lockfile behavior → `bun-tooling`;
- Blockbench lifecycle/globals/UI/mutation mechanics →
  `blockbench-runtime-development`;
- Bedrock model shape/visual judgement → `blockbench-bedrock-modelling`.

When another domain owns the behavior, keep that domain specialist as the one
specialist and apply ordinary TypeScript correctness without stacking this skill.

## Local Baseline

Inspect the failing type surface and direct consumers first. Read
`mcp/tsconfig.json` only when compiler/module configuration is relevant.

Current baseline includes strict TypeScript, ESNext modules/target, `@/*` alias,
`blockbench-types`, Bun-based commands, the official MCP SDK, and Zod.

Preserve established configuration unless configuration itself is the proved
cause. Do not introduce monorepo, linter/bundler migration, JS→TS migration, or
alternative module-system work without a demonstrated BlockIT need.

## Procedure

1. Prove the failure is compile-time/type-system-owned rather than runtime,
   schema, or domain logic.
2. Read the smallest failing type/interface/function surface and direct consumers.
3. Prefer readable existing interfaces/unions/guards over type gymnastics.
4. Narrow `unknown` from evidence; do not hide uncertainty with `as` or `any`.
5. Fix the shared type owner rather than repeating local casts.
6. Do not add branded/deep conditional/generic abstractions or tsconfig changes
   unless the concrete problem requires them.
7. Apply root `AGENTS.md` minimum-proof rules; a passing typecheck proves
   compile-time consistency only.

Do not create or load a separate Zod specialist for ordinary MCP schemas; that
boundary is owned by `mcp-server-development`.

## Completion

Return to `development-brief` and confirm the TypeScript-owned problem is fixed
at its real type owner, unrelated runtime/domain behavior stayed outside scope,
and unavailable local compiler/runtime proof is reported rather than inferred.
