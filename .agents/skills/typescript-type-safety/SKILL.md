---
name: typescript-type-safety
description: Specialist for TypeScript type-system problems in BlockIT. Use when the primary problem is a TypeScript compiler/type-safety issue: incorrect inference, generics, unions/narrowing, unsafe assertions, declaration typing, public type contracts, or compile-time module typing. Do not use merely because a file is TypeScript. Prefer the owning domain specialist for MCP, Zod, Bun, Blockbench, or modelling work when TypeScript is only the implementation language.
---

# TypeScript Type Safety

Own only the **TypeScript language/type-system boundary** for BlockIT.

Normal `.ts` implementation does not require this skill. Load it only when the difficult part of the task is TypeScript typing itself.

## Use This Skill For

- compiler errors caused by incompatible or incorrectly inferred types;
- generics, constraints, conditional/discriminated union behavior, and narrowing;
- reducing unjustified `any`, `unknown` casts, or unsafe type assertions;
- public TypeScript interfaces/types whose compile-time contract must remain correct;
- declaration files or external-library typings;
- compile-time import/module typing when the issue is genuinely TypeScript-owned;
- TypeScript compiler/type-complexity problems when they are the proved bottleneck.

## Do Not Use It For

- MCP tools/resources/prompts/transport/session contracts → `mcp-server-development`;
- Zod schema semantics or parsing rules → `zod`;
- Bun commands, dependency/lockfile/build-runtime behavior → Bun specialist when retained;
- Blockbench plugin lifecycle, globals, UI, or model manipulation → Blockbench plugin specialist;
- generic refactoring, ordinary implementation, or a file that merely happens to be `.ts`;
- runtime bugs whose cause is not the TypeScript type system.

When another domain owns the actual behavior, keep that domain specialist as the one specialist and apply ordinary TypeScript correctness without stacking this skill.

## Local Baseline

Before changing TypeScript-specific configuration or types, inspect only the relevant owner plus `mcp/tsconfig.json` when compiler configuration matters.

Current BlockIT MCP baseline includes:

- TypeScript in strict mode;
- ESNext modules/target;
- repository alias `@/*`;
- `blockbench-types` declarations;
- Bun-based project commands;
- official MCP SDK and Zod dependencies.

Preserve the established project configuration unless the configuration itself is the proved cause. Do not import generic monorepo, Nx/Turborepo, Biome/ESLint migration, JavaScript-to-TypeScript migration, or alternative module-system advice without a demonstrated BlockIT need.

## Procedure

1. **Prove TypeScript owns the problem**
   - Identify the exact compiler/type contract failure.
   - Separate compile-time typing from runtime behavior, schema semantics, or domain logic.

2. **Read the smallest type surface**
   - Inspect the failing type/interface/function and direct consumers.
   - Read `mcp/tsconfig.json` only when compiler/module configuration is relevant.

3. **Prefer the simplest sound type**
   - Reuse existing project types before creating new abstractions.
   - Prefer explicit, readable interfaces/unions/guards over type gymnastics.
   - Narrow `unknown` from real evidence; do not hide uncertainty with `as` or `any`.
   - Keep public type contracts aligned with the runtime/API behavior they describe.

4. **Fix the shared type owner**
   - Avoid repeated local casts that only silence the compiler.
   - Do not introduce branded types, deep conditional utilities, generic frameworks, declaration files, or compiler flags unless the concrete problem requires them.

5. **Use the active proof budget**
   - ChatGPT → GitHub: inspect the exact type change, directly affected consumers, and tsconfig only when relevant. Do not claim compiler success without local execution.
   - Codex local: run the smallest targeted typecheck/build command that can reproduce the relevant TypeScript failure; do not automatically run tests or full builds unrelated to the type boundary.

## Anti-Slop Rules

- Do not load this skill for every TypeScript file.
- Do not solve runtime/domain problems with increasingly complex types.
- Do not add type-level abstraction merely to demonstrate sophistication.
- Do not change tsconfig, module system, linter, bundler, or monorepo tooling without a proved project need.
- Do not stack this with `zod` when the actual problem is schema validation.
- Do not convert a compiler warning into a broad architecture migration.
- A passing typecheck proves compile-time consistency, not MCP runtime or Blockbench visual correctness.

## Completion

Return to the active `development-brief` and confirm:

- the TypeScript-owned problem is fixed at its real type owner;
- the solution is simpler than equivalent cast/workaround chains;
- unrelated runtime/domain behavior was not changed;
- the minimum useful proof for the active execution channel is complete;
- unavailable Codex-local compiler/runtime proof is reported honestly rather than inferred from static GitHub inspection.
