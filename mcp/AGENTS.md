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

Before substantial implementation of any task that can change a public schema/description/spec, perform this capability preflight:

1. classify whether canonical generated API output will change;
2. confirm the active execution channel can run `bun run docs:build` and `bun run docs:check` before final repository delivery;
3. if it cannot, switch to a fitting local/Codex workspace or **STOP/defer the exact public-contract task before source edits accumulate**.

GitHub Actions may verify generated freshness, but it is not the authoring path for generated MCP docs and must not create/commit them back to `Local`.

When a public schema/description/spec changes:

1. change the source owner;
2. update manifest ownership only when needed;
3. regenerate through `bun run docs:build`;
4. require `bun run docs:check` to pass.

Do not edit generated tool entries manually.

The runtime prompt bundle contains only prompts intentionally exposed by `server/prompts.ts`. Maintainer/reference Markdown may remain source-only and must not be bundled just because it exists in `prompts/`.

## Verification

Verification follows the changed claim; do not use the full MCP gate as an iteration loop.

### During iteration

- Run the smallest targeted regression that can falsify the changed behavior or public contract.
- Run `bun run typecheck` when TypeScript/source shape changes make it materially useful.
- For public schema/description/spec changes, regenerate canonical docs before the final delivery and require `bun run docs:check` on the final state.
- Do not repeatedly run the full canonical gate after each edit.

### Final MCP gate

For one final logical change that affects MCP executable source, public MCP contracts, build output, or generated API ownership, run the canonical gate once on the final state:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Repository-policy/static regressions stored under `mcp/tests/` are owned by **Repository Verify** when the change does not affect MCP executable/public-contract behavior. Their filesystem location alone does not require a full MCP Verify run.

GitHub/static proof covers source contracts and buildability, **not** live Blockbench rendering, Undo behavior, playback, persistence, or visual fidelity. Run local proof only when the active user/task explicitly requires it.

## Security / Capability Boundary

- Default server exposure remains loopback-only with present-Origin validation.
- `risky_eval` and `from_geo_json` remain disabled; do not re-enable them indirectly.
- Do not broaden network exposure without separately reviewed authentication design.
- Do not add a router/profile/framework, generic importer, alternate transport, or replacement schema/server stack without a proved current requirement.
- Preserve retained Bedrock capability; reducing tool count is not itself a product requirement.
- Keep dependencies lean and never commit secrets.
