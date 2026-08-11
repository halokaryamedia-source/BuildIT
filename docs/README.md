# BlockIT Docs

Updated: 2026-08-11

This folder is the human-readable documentation layer for BlockIT. Root `AGENTS.md` owns task-class routing; these docs provide durable product policy and repository memory.

## Start With The Task Class

### Asset authoring

For normal Bedrock Entity creation/revision/texture/animation/export, do **not** boot the whole documentation vault. Follow root `AGENTS.md`:

```text
current request/reference
→ blockit-bedrock-entity-mcp
→ only the active modelling/texturing/animation specialist
```

Open a foundation/knowledge note only when a specific asset decision depends on that policy, capability boundary, or repository state.

### Repository / plugin work

For source/docs/CI/MCP/plugin work:

```text
AGENTS.md
→ CONTEXT.md when stable facts matter
→ docs/knowledge/next-action.md when continuing current work
→ affected owner/source
```

The current continuation is local acceptance. When `next-action.md` points there, use:

[Local Acceptance Runbook](knowledge/operations/local-acceptance-runbook.md)

## Obsidian

Open `docs/knowledge/` as the repo-local Obsidian vault. Human landing note:

- [Knowledge Dashboard](knowledge/index.md)

Repository notes and current `Local` source are authority; chat history is supporting context only.

## Document Roles

| Area | Role | Authority |
|---|---|---|
| [Foundation](foundation/README.md) | durable product, modelling, reference, geometry, texture, visual-validation policy | durable policy |
| [Knowledge](knowledge/index.md) | continuity, source/skill maps, decisions, reviews, operations | repository memory/navigation |
| [Next Action](knowledge/next-action.md) | one active repository continuation state | current status |
| [Local Acceptance Runbook](knowledge/operations/local-acceptance-runbook.md) | exact Codex + Blockbench acceptance procedure | active procedure only when selected by next-action |
| [Implementation Map](knowledge/implementation-map.md) | current Local source ownership/surface | current source map |
| [Validation Report](foundation/validation-report.md) | source/official/local proof state | proof-status reference |
| `mcp/docs/` | generated MCP API documentation | generated output; secondary to source |

## Current Product Architecture

```text
Approved Modelling Brief
→ Primary Form Hypothesis
→ coarse Cube/Group form
→ minimum structural + corresponding visual evidence
→ difference-first FAIL / UNVERIFIED / PASS
→ local causal correction or global rebuild
→ secondary structure after primary PASS
→ texture/PBR when required
→ animation when required
→ final validation
→ save/export
```

Tool success, valid coordinates, hierarchy, validator output, or file persistence do not issue visual approval.

## Status Language

- `CURRENT-PROJECT VERIFIED` — proven in the current target environment.
- `OFFICIALLY VERIFIED` — supported by authoritative upstream source/docs; local integration may still need proof.
- `LOCAL PROOF REQUIRED` — source/contract exists, live environment proof pending.
- `UNSUPPORTED` — evidence says not to rely on the method.
- `UNKNOWN` — evidence is insufficient/conflicting.

Historical reviews/plans retain their captured evidence. Use the Review Index, Validation Report, current source, and `next-action.md` to interpret them today.
