# BlockIT Merge Map

This document turns source selection into a concrete merge decision.

## Keep From `jasonjgardner/blockbench-mcp-plugin`

Keep the Blockbench plugin shell and the parts that already match the current workspace goal:

- `index.ts`
- `server/server.ts`
- `server/tools.ts`
- `server/resources.ts`
- `server/net.ts`
- `lib/factories.ts`
- `lib/constants.ts`
- `lib/util.ts`
- `lib/zodObjects.ts`
- `ui/index.ts`
- `ui/settings.ts`
- `build/docs-manifest.ts`
- `build/docs.ts`
- `prompts/manifest.json`
- `prompts/*.md`

## Borrow From `sigee-min/ashfox`

Borrow only the parts that add safety, structure, or maintainability without changing the Blockbench-first shape:

- `packages/runtime/src/config.ts`
- `packages/runtime/src/dispatcher.ts`
- `packages/runtime/src/logging.ts`
- `packages/runtime/src/session.ts`
- `packages/runtime/src/server.ts`
- `packages/backend-core/src/errors.ts`
- `packages/backend-core/src/locks.ts`
- `packages/backend-core/src/persistence.ts`
- `packages/backend-core/src/registry.ts`
- `packages/contracts/src/mcpSchemas/*`
- `packages/contracts/src/types/*`

## Drop From Both

Do not carry these forward unless a later requirement proves they are needed:

- `apps/web`
- `apps/worker`
- `apps/mcp-gateway`
- Hytale-specific helpers and prompts
- generated output that is not source of truth
- duplicate path names that make the workspace harder to read

## Merge Rule

If a source file only adds a second way to do the same thing, do not merge it.

If a source file gives us a clearer contract, a safer runtime flow, or a simpler maintenance path, keep it.

## Practical Outcome

- `mcp/` stays the active working plugin.
- `docs/` records the decision boundary so future updates stay consistent.
