# Source Map

Updated: 2026-08-11

This note connects repository memory to **current `Local` authorities**. It links owners; it does not duplicate source behavior.

## Authority Order

| Need | Current owner |
|---|---|
| Task routing / proof discipline | [`AGENTS.md`](../../../AGENTS.md) |
| Stable workspace facts | [`CONTEXT.md`](../../../CONTEXT.md) |
| Active repository continuation | [Next Action](../next-action.md) |
| Local acceptance procedure | [Local Acceptance Runbook](../operations/local-acceptance-runbook.md) |
| Product/modelling policy | [Foundation](../../foundation/README.md) |
| Runtime implementation | [`mcp/`](../../../mcp/) source + relevant proof |
| Canonical skills | [`/.agents/skills/`](../../../.agents/skills/) |
| Current evidence status | [Validation Report](../../foundation/validation-report.md) |
| Model/project packages | [`workspace/`](../../../workspace/) |

## MCP Runtime Sources

Start with:

- [MCP README](../../../mcp/README.md) — build/load/endpoint/default product boundary;
- [MCP Agent Rules](../../../mcp/AGENTS.md) — source engineering invariants;
- `mcp/server/tools/` — tool behavior;
- `mcp/lib/` — factories, shared schemas/identity/runtime helpers;
- `mcp/prompts/bedrock_entity_workflow.md` — canonical bundled Bedrock authoring prompt;
- `mcp/build/docs-manifest.ts` — generated API documentation ownership.

Use [Implementation Map](../implementation-map.md) to locate the current owner before reading old review notes.

## Skill Source

Current repository-owned skill inventory/routing:

- [Skill Map](../skills/skill-map.md)
- [Activation Matrix](../skills/activation-matrix.md)
- [Skill README](../../../.agents/skills/README.md)

Do not route new work to retired nested roots:

```text
mcp/.agents/skills/
mcp/.github/skills/
mcp/workflow/skills/
```

## Reference Source

Source Image/user intent → approved Modelling Brief:

- [Reference Guide](../../foundation/04-reference-guide.md)

Reference generation is not a root Codex skill. The approved brief is consumed by the BlockIT asset-authoring route.

## Evidence / Review Sources

- [Validation Report](../../foundation/validation-report.md) — current source/CI/official/local-proof matrix.
- [Review Index](../reviews/review-graph.md) — current meaning/status of historical reviews.
- [Decision Log](../decision-log.md) — durable decisions/superseded rules.
- [Deferred Tool Loading Review](../reviews/codex-native-deferred-mcp-tool-loading-2026-08-11.md) — local evidence questions for native Codex exposure/search.
- [Reference Fidelity Root Cause](../reviews/mcp-reference-fidelity-root-cause.md) — evidence behind the current visual-feedback architecture.

Historical review bodies may retain old tool names/surface recommendations. Current source, this map, the Review Index, Validation Report, and `next-action.md` determine current meaning.

## Historical Upstream Records

`docs/foundation/08-source-selection.md` and `09-merge-map.md` document historical adoption from upstream sources. `Rework` and `Sample` are reference/history, not current runtime authorities.

## Use Rule

Open only the owner relevant to the active question. A review, sample, old branch, generated file, or upstream repository can explain lineage but cannot override current `Local` source/policy without a new evidence-backed decision.

## Parent

- [Knowledge Dashboard](../index.md)
- [Implementation Map](../implementation-map.md)
