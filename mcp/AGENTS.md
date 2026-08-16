# MCP Package Rules

Applies to `mcp/**`. Root `../AGENTS.md` owns repository routing, proof economy, evidence labels, communication, and general work discipline. This file contains only MCP-package rules that materially change implementation decisions.

## Source Ownership

```text
index.ts        plugin lifecycle entry
server/         MCP transport, tools, resources, prompts
server/tools/   authored project/model/texture/animation operations
lib/            shared factories, schemas, identities, runtime helpers
ui/             Blockbench panel/settings
prompts/        prompt source references
build/          build/docs generation
scripts/        deliberate verification helpers
tests/          contract/integration regressions
docs/           generated API docs; never hand-edit generated entries
```

Use the affected owner and direct callers first. Do not scan every tool family for a bounded change.

## MCP Public Contract Pattern

Tool modules must remain import-safe outside Blockbench because docs/tests load schemas in Bun/Node.

At module scope:

- export the exact Zod parameter schema;
- export the domain `ToolSpec[]` metadata;
- do **not** read Blockbench runtime globals.

At registration/execution scope:

- register through `createTool` and existing family registration;
- use Blockbench globals only where runtime execution owns them;
- keep full runtime validation on the original Zod schema;
- preserve annotations and deterministic identities.

When a broad `ToolSpec` spread weakens inference, restate the same concrete `parameters` schema in `createTool`; do not weaken types or duplicate a competing contract.

## Input / Identity Rules

- Validate all MCP input at the boundary.
- Match optional/default/nullability/refinement semantics to actual execution.
- Reuse shared schemas/identity resolvers before creating near-duplicates.
- Prefer UUID first, then only documented unique exact-name/ID fallback.
- Explicit ambiguous targets fail closed; do not silently choose editor selection or the first match.
- Keep schema construction free of `Formats`, `BarItems`, `Plugins`, Painter, or other Blockbench globals; live-format checks belong inside execution.
- Reject ineffective destructive requests when the owner can determine they are no-ops before Undo.

## Result / Context Efficiency

When structured state exists, `structuredContent` is the canonical machine-readable result.

- Do not mirror the same full JSON again in `content.text`; use a short useful summary.
- The registration boundary compacts an exact single-text JSON mirror, but implementations should still prefer the compact shape directly.
- Keep discovery/list tools summary-first when a focused read already owns detailed state.
- Reuse mutation-returned authored state so callers do not need immediate confirmation reads.
- Filesystem export is metadata-first after a verified path write; return compiled artifact content only when explicitly requested.
- Images and genuinely different explanatory text may accompany structured data.
- Do not remove legitimate authored fields or impose global limits merely to reduce size; static counts identify candidates, not client-visible token cost.

## Generated Documentation / Prompts

`build/docs-manifest.ts` owns generated API surface. `build/docs.ts` writes `docs/api.json` and `docs/index.html`.

When a public schema/description/spec changes:

1. change the source owner;
2. update manifest ownership only when needed;
3. regenerate through `bun run docs:build`;
4. require `bun run docs:check` to pass.

Do not edit generated tool entries manually.

The runtime prompt bundle contains only prompts intentionally exposed by `server/prompts.ts`. Maintainer/reference Markdown may remain source-only and must not be bundled just because it exists in `prompts/`.

## Verification

During normal iteration, run the smallest check that can falsify the changed MCP contract. Do not run the full suite merely because an MCP-adjacent Markdown, routing, planning, or status file changed.

For a final MCP source/config verification when the executable/public contract can actually be affected, the official gate is:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

The GitHub `MCP Verify` workflow is a final relevant gate for executable/config changes on `Local`; it is not an automatic verifier for every repository edit. It is fail-fast, cancels superseded runs, and may also be invoked deliberately with `workflow_dispatch` when a full check is actually required.

Use targeted tests for the public contract being changed; do not add low-value ceremony. GitHub/static proof covers source contracts and buildability, **not** live Blockbench rendering, Undo behavior, playback, persistence, or visual fidelity. Run local proof only when the active user/task explicitly requires it.

## Security / Capability Boundary

- Default server exposure remains loopback-only with present-Origin validation.
- `risky_eval` and `from_geo_json` remain disabled; do not re-enable them indirectly.
- Do not broaden network exposure without separately reviewed authentication design.
- Do not add a router/profile/framework, generic importer, alternate transport, or replacement schema/server stack without a proved current requirement.
- Preserve retained Bedrock capability; reducing tool count is not itself a product requirement.
- Keep dependencies lean and never commit secrets.
