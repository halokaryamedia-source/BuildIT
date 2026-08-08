# Source Map

Updated: 2026-08-08

This note connects the Obsidian vault to the current repository authorities. It
links owners; it does not copy source content.

## Authority Order

| Need | Current owner |
|---|---|
| Agent behavior / proof boundary | [`AGENTS.md`](../../../AGENTS.md) |
| Stable workspace facts | [`CONTEXT.md`](../../../CONTEXT.md) |
| Active task state | [Next Action](../next-action.md) |
| Product/modelling policy | [Foundation](../../foundation/README.md) |
| Runtime implementation | [`mcp/`](../../../mcp/) source + relevant proof |
| Canonical skills | [`/.agents/skills/`](../../../.agents/skills/) |
| Project/model packages | [`workspace/`](../../../workspace/) |

## MCP Runtime Sources

Start with:

- [MCP README](../../../mcp/README.md)
- [MCP Agent Rules](../../../mcp/AGENTS.md)
- `mcp/server/tools/` for tool behavior;
- `mcp/lib/` for shared helpers/schemas/factories;
- `mcp/prompts/bedrock.md` for the normal Bedrock modelling route;
- `mcp/build/docs-manifest.ts` for generated API documentation ownership.

For current Reference Fidelity implementation, use
[Implementation Map](../implementation-map.md) rather than reconstructing the
source graph from old review notes.

## Canonical Skill Source

All BlockIT repository-wide skills are under:

`/.agents/skills/`

Current six-skill inventory and lineage:

- [Skill Map](../skills/skill-map.md)
- [Activation Matrix](../skills/activation-matrix.md)

The following are **not current sources**:

```text
mcp/.agents/skills/
mcp/.github/skills/
mcp/workflow/skills/
```

Do not recreate them because an old note mentions them.

## Reference Source

Source Image → Modelling Brief policy is:

- [Reference Guide](../../foundation/04-reference-guide.md)

Reference generation is not a root Codex skill. The approved Modelling Brief is
then consumed by the Bedrock modelling workflow.

## Evidence / Review Sources

- [Foundation Validation](../../foundation/validation-report.md) — current
  source/official/local-proof matrix.
- [Decision Log](../decision-log.md) — durable decisions and superseded rules.
- [Review Index](../reviews/review-graph.md) — current status of historical
  reviews/audits.
- [Reference Fidelity Root Cause](../reviews/mcp-reference-fidelity-root-cause.md)
  — evidence for the current fidelity architecture.

## Historical Upstream Records

`docs/foundation/08-source-selection.md` and `09-merge-map.md` document the
historical adoption boundary from upstream repositories. They are useful history,
but current Local source is now the runtime authority.

## Use Rule

Open only the source area relevant to the question. A review, sample, old branch,
or upstream repository can explain lineage but cannot override current Local
source/policy without a new explicit decision.

## Parent

- [Knowledge Dashboard](../index.md)
- [Implementation Map](../implementation-map.md)
