# Source Map

Updated: 2026-08-11

This note connects current documentation to repository authorities. It points to owners instead of copying their contents.

## Authority order

| Need | Current owner |
|---|---|
| agent/task/proof rules | [`AGENTS.md`](../../../AGENTS.md) |
| stable workspace facts | [`CONTEXT.md`](../../../CONTEXT.md) |
| active repository continuation | [Next Action](../next-action.md) |
| current local procedure | [Local Acceptance Runbook](../operations/local-acceptance-runbook.md) |
| product/modelling policy | [Foundation](../../foundation/README.md) |
| current runtime behavior | `mcp/` source + relevant proof |
| current source ownership summary | [Implementation Map](../implementation-map.md) |
| skill routing | [Activation Matrix](../skills/activation-matrix.md) |
| project/reference packages | `workspace/` |
| current evidence status | [Validation Report](../../foundation/validation-report.md) |

## MCP sources

Start with:

- [MCP README](../../../mcp/README.md)
- [MCP Agent Rules](../../../mcp/AGENTS.md)
- `mcp/server/tools/` for tool behavior;
- `mcp/lib/` for shared schemas/factories/helpers;
- `mcp/prompts/bedrock_entity_workflow.md` for the enabled authoring workflow;
- `mcp/build/docs-manifest.ts` for generated API ownership;
- `mcp/tests/` for contract/integration regression ownership.

Do not use deleted nested `mcp/.github/` prompts/instructions or upstream standalone-repo configuration as BlockIT authority.

## Skills

All repository-owned skills live under:

```text
.agents/skills/
```

- [Skill Map](../skills/skill-map.md) — inventory and concise lineage.
- [Activation Matrix](../skills/activation-matrix.md) — current routing.

## References / workspace

Source Image/user intent → approved Modelling Brief policy:

- [Reference Guide](../../foundation/04-reference-guide.md)

Intentional model/reference packages live under `workspace/`. Preview/cache output is local/transient and ignored.

## Decisions / reviews

- [Decision Log](../decision-log.md) — durable why.
- [Review Index](../reviews/review-graph.md) — current meaning of historical evidence.
- [Capability Surface Matrix](../reviews/bedrock-entity-capability-surface-matrix.md) — protected native Bedrock mapping guardrail.
- [Model Creation Effectiveness Audit](../reviews/model-creation-effectiveness-audit-2026-08-10.md) — reference-fidelity/tool-efficiency problem evidence.

Historical Git revisions remain available for deleted plans, standalone-upstream files, or obsolete experiments. Do not keep duplicate active documents solely for provenance.

## Use rule

Open only the source area needed by the current decision. Historical reviews, old branches, upstream repositories, or Git history may explain lineage but never silently override current `Local` source/policy.

## Parent

- [Knowledge Dashboard](../index.md)
- [Implementation Map](../implementation-map.md)
