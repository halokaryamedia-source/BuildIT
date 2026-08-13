# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** modelling workspace built around a local Blockbench MCP plugin. `Local` is the current product/development authority.

## Product Flow

```text
1. PREPARE REFERENCE
2. AUTHOR BEDROCK MODEL
3. FINISH ASSET
```

Root `AGENTS.md` owns routing. `docs/knowledge/flow.md` owns the detailed current flow. Tool success is execution evidence, not visual approval.

## Current Documentation Owners

- `CONTEXT.md` — stable facts
- `docs/knowledge/next-action.md` — active continuation
- `docs/knowledge/implementation-map.md` — source/tool ownership
- `docs/foundation/` — durable current policy and proof state
- `docs/knowledge/operations/local-acceptance-runbook.md` — local procedure only when reactivated

Compact files retained under `docs/knowledge/reviews/`, `decisions/`, and `skills/` are regression-support only. Historical audits, decisions, plans, and experiments live in Git history.

## Repository Map

```text
.agents/skills/     canonical skills
mcp/                plugin/runtime/build/tests/generated API docs
docs/foundation/    durable current policy
docs/knowledge/     current flow/continuation/ownership/procedure
workspace/fixtures/ reusable acceptance fixtures
```

## MCP Development

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production output is the local build at `mcp/dist/mcp.js`. Do not use the upstream hosted plugin as BlockIT proof.

Current static surface:

```text
62 enabled tools
76,439 tools/list response characters
53,493 input-schema characters
10,645 description characters
max per-tool payload: 3,167 characters
```

P0–P7, Reference Generator, and PRO-1–PRO-8 are implemented at their documented proof level. PRO-8 is read-only controller/state inspection; controller creation/mutation remains deferred. Character counts are not token measurements.

## Hygiene

One current owner per responsibility. Git history owns removed historical documentation. Do not add another routing, planning, review, scoring, or packaging layer without concrete need.

## License

GPL-3.0-only; see `LICENSE`.
