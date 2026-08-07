---
name: bun-tooling
description: Specialist for Bun-specific tooling in BlockIT. Use when the primary problem is Bun build behavior, Bun build plugins, Bun.file/Bun.write/Bun.argv usage, package scripts, bunx, dependency/lockfile behavior, or another Bun-specific runtime/tooling issue. Do not use merely because the project uses Bun or a TypeScript file is executed with Bun; prefer the owning MCP, TypeScript, or Blockbench specialist when Bun is only the runner.
---

# Bun Tooling

Own only the **Bun-specific build/tooling boundary** for BlockIT.

BlockIT already uses Bun. Do not scaffold a new Bun project, migrate runtimes, or optimize Bun generically unless the current task proves that the Bun boundary is the problem.

## Use This Skill For

- `Bun.build()` configuration or build failures;
- Bun build plugins and loader/resolver behavior;
- `Bun.file`, `Bun.write`, `Bun.argv`, or other Bun-specific APIs already used by the repository;
- `package.json` scripts whose behavior is specifically Bun-owned;
- `bunx` invocation or Bun package-manager behavior;
- `bun.lock` / dependency resolution when Bun is the proved owner;
- Bun-specific compatibility between the build output and Blockbench plugin packaging;
- Bun-specific local diagnostics when they are required to prove the changed boundary.

## Do Not Use It For

- MCP protocol/tools/resources/prompts/session behavior → `mcp-server-development`;
- TypeScript type-system problems → `typescript-type-safety`;
- Blockbench plugin/runtime/API behavior → Blockbench specialist;
- ordinary `.ts` implementation that simply runs under Bun;
- generic package upgrades, performance tuning, or runtime migration without a demonstrated need;
- introducing `Bun.serve`, Bun SQLite, WebSocket servers, password APIs, or other unrelated Bun features.

## Local Baseline

Inspect only what is relevant. Typical owners are:

- `mcp/package.json` for canonical commands/dependencies;
- `mcp/bun.lock` only for dependency/lockfile issues;
- `mcp/build/index.ts` for the current `Bun.build` pipeline;
- `mcp/build/plugins.ts` for Bun build plugins;
- the directly affected build/helper file.

Current BlockIT-specific facts include:

- build and docs commands are repository-defined Bun scripts;
- the plugin bundle is produced by `Bun.build`;
- custom Bun build plugins adapt text assets and Blockbench compatibility;
- build code already uses `Bun.file`, `Bun.write`, and `Bun.argv`;
- MCP Inspector is invoked through the existing `bunx` package script.

Preserve these patterns unless one of them is the proved cause.

## Procedure

1. **Prove Bun owns the problem**
   - Separate Bun/tooling behavior from MCP logic, TypeScript typing, and Blockbench runtime behavior.
   - If the issue is only that a command is written in TypeScript, do not use this skill.

2. **Read the existing command/build owner**
   - Prefer `package.json` scripts over inventing new command variants.
   - Read the specific build plugin or Bun API call involved.

3. **Make the smallest tooling change**
   - Reuse current scripts and build plugins.
   - Avoid runtime migrations, new bundlers, package-manager changes, or generic optimization work.
   - Do not add a new script when an existing command already expresses the required operation.

4. **Respect Blockbench output constraints**
   - The build exists to produce the Blockbench MCP plugin correctly; Bun-specific improvements that break packaging/runtime compatibility are not improvements.

5. **Use the active proof budget**
   - ChatGPT → GitHub: verify exact script/build/config changes and directly affected build owners. Do not claim a local Bun build succeeded.
   - Codex local: run the smallest existing Bun command that can falsify the changed tooling behavior. Do not automatically run docs, full build, inspector, and unrelated checks together.

## Anti-Slop Rules

- Do not load this skill merely because `package.json` uses Bun.
- Do not scaffold or migrate the project to demonstrate Bun best practices.
- Do not introduce unrelated Bun-native APIs.
- Do not replace working Node-compatible APIs with Bun APIs solely for style or hypothetical speed.
- Do not modify dependency/lockfile state unless dependency behavior is in scope.
- Do not create benchmark/performance work without a demonstrated bottleneck.
- A successful Bun build proves packaging/build success, not MCP runtime or Blockbench visual correctness.

## Completion

Return to the active `development-brief` and confirm:

- the proved Bun/tooling problem is fixed at its existing owner;
- no unrelated runtime/tooling migration was introduced;
- existing project commands remain the canonical interface;
- minimum useful proof for the active execution channel is complete;
- any local build/runtime proof unavailable through GitHub is left explicitly for Codex local rather than inferred.