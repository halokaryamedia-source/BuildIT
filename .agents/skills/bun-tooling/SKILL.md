---
name: bun-tooling
description: Specialist for Bun-specific tooling in BlockIT. Use when the primary problem is Bun build behavior, build plugins, Bun.file/Bun.write/Bun.argv usage, package scripts, bunx, dependency/lockfile behavior, or another Bun-owned tooling issue. Do not use merely because BlockIT runs on Bun; prefer the owning MCP, TypeScript, Blockbench-runtime, or modelling specialist when Bun is only the runner.
---

# Bun Tooling

Own only the **Bun-specific build/tooling boundary** for BlockIT.

## Use This Skill For

- `Bun.build()` configuration or build failures;
- Bun build plugins/loaders/resolvers;
- `Bun.file`, `Bun.write`, `Bun.argv`, or another Bun API already used by Local;
- repository package scripts whose behavior is specifically Bun-owned;
- `bunx`, Bun dependency resolution, or `bun.lock` behavior;
- Bun-specific packaging compatibility with the Blockbench plugin;
- targeted Bun diagnostics when Bun itself is the proved owner.

Adjacent owners:

- MCP public/protocol contracts → `mcp-server-development`;
- TypeScript type-system failures → `typescript-type-safety`;
- Blockbench lifecycle/API/UI/mutation mechanics →
  `blockbench-runtime-development`;
- Bedrock model judgement → `blockbench-bedrock-modelling`.

## Local Baseline

Read only the relevant owner:

- `mcp/package.json` for canonical commands/dependencies;
- `mcp/bun.lock` for lock/dependency issues;
- `mcp/build/index.ts` for `Bun.build`;
- `mcp/build/plugins.ts` for build plugins;
- the directly affected helper.

BlockIT already uses Bun for its build/docs/package workflow. Do not scaffold a
new Bun project, migrate runtimes, replace bundlers, or introduce unrelated
Bun-native APIs without a demonstrated requirement.

## Procedure

1. Prove Bun owns the problem rather than MCP logic, TypeScript typing, or
   Blockbench runtime behavior.
2. Reuse existing package scripts/build plugins before adding another command or
   abstraction.
3. Make the smallest Bun-specific change.
4. Preserve Blockbench bundle/runtime compatibility; a faster or cleaner build
   that breaks the plugin is not an improvement.
5. Apply root `AGENTS.md` minimum-proof rules. In Codex local, prefer the
   smallest existing Bun command that can falsify the changed tooling behavior.

## Anti-Slop Boundary

- Do not load this skill merely because a command starts with `bun`.
- Do not migrate or benchmark Bun without a proved need.
- Do not replace working Node-compatible APIs with Bun APIs solely for style.
- Do not touch dependency/lockfile state unless dependency behavior is in scope.
- A successful Bun build proves build/package behavior, not MCP runtime or
  Blockbench visual correctness.

## Completion

Return to `development-brief` and confirm the Bun-owned problem is fixed at its
existing owner, project commands remain canonical, unrelated runtime/tooling work
stayed outside scope, and unavailable local proof is reported rather than
inferred.
