# BlockIT Source Selection

This document records which files we will actually use from the two upstream source repos.

## Use From `sigee-min/ashfox`

Take the runtime flow and safety model from these areas:

- `README.md`
- `apps/plugin-desktop/src/index.ts`
- `packages/runtime/src/config.ts`
- `packages/runtime/src/dispatcher.ts`
- `packages/runtime/src/logging.ts`
- `packages/runtime/src/plugin.ts`
- `packages/runtime/src/server.ts`
- `packages/runtime/src/session.ts`
- `packages/runtime/src/types.ts`
- `packages/backend-core/src/errors.ts`
- `packages/backend-core/src/locks.ts`
- `packages/backend-core/src/persistence.ts`
- `packages/backend-core/src/registry.ts`
- `packages/backend-core/src/types.ts`
- `packages/contracts/src/mcpSchemas/*`
- `packages/contracts/src/types/*`

## Use From `jasonjgardner/blockbench-mcp-plugin`

Take the Blockbench plugin structure and tooling from these areas:

- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `index.ts`
- `server/server.ts`
- `server/tools.ts`
- `server/resources.ts`
- `server/prompts.ts`
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

## Do Not Use

- `apps/web`
- `apps/worker`
- `apps/mcp-gateway`
- Hytale-specific files
- generated output that is not source of truth
- legacy naming that makes the workspace harder to read

## Rule

If a file does not help with runtime flow, plugin structure, docs, or clarity, do not bring it forward.
