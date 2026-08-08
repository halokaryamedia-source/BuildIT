# BlockIT Docs

Updated: 2026-08-08

This folder is the human-readable documentation layer for BlockIT. It is split
between durable product/modelling policy and the repo-local Obsidian knowledge
vault.

## Obsidian

Open `docs/knowledge/` as the Obsidian vault. The main landing note is:

- [Knowledge Dashboard](knowledge/index.md)

The vault is intentionally repository-backed: chat history is useful context,
but repository notes and source remain the authority.

## Fast Reading Order

For a new ChatGPT/Codex session:

1. [`AGENTS.md`](../AGENTS.md) — agent rules, proof boundary, skill budget.
2. [`CONTEXT.md`](../CONTEXT.md) — stable project facts and terminology.
3. [Next Action](knowledge/next-action.md) — the single active task snapshot.
4. Open only the foundation/source note that owns the current boundary.

For a human browsing in Obsidian, start from the dashboard and follow the links
for Product, Current Implementation, Decisions, Reviews, or Operations.

## Current Product Architecture

The current modelling control loop is:

```text
Approved Modelling Brief
↓
Cross-view consistency
↓
Coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Explicit coarse Cube extents / intentional rotation+pivot
↓
inspect_model_bounds
↓
capture_model_views
↓
Reference ↔ model comparison
↓
GLOBAL failure → revise/rebuild hypothesis
LOCAL failure  → inspect_element → causal correction
↓
Secondary geometry / hierarchy / pivots
↓
Texture / optional animation / final proof
```

This loop exists to prevent the proven failure mode where technically valid or
attached Cubes are mistaken for visual correctness.

## Document Roles

| Area | Role | Authority |
|---|---|---|
| [Foundation](foundation/README.md) | durable product, modelling, reference, geometry, texture, and visual-validation policy | policy source of truth |
| [Knowledge](knowledge/index.md) | Obsidian navigation, continuity, decisions, ownership, reviews, operations | project-memory/navigation |
| [Next Action](knowledge/next-action.md) | current goal/status/blocker/next step only | active-task snapshot |
| [Implementation Map](knowledge/implementation-map.md) | what current Local source already implements | repository/source map |
| [Validation Report](foundation/validation-report.md) | source-backed vs local-proof-required capability matrix | proof-status reference |
| `mcp/docs/` | generated MCP API documentation | generated output; secondary to source |

## Status Language

- **Active policy** — approved BlockIT rule; it may still depend on runtime proof.
- **Historical review/record** — kept for reasoning/history; current status is
  shown by dashboard/review indexes rather than rewriting the original evidence.
- **LOCAL PROOF REQUIRED** — source/design is sufficient to proceed, but live
  Blockbench/MCP behavior has not yet been proven in the local environment.

Do not interpret a successful tool call, valid coordinates, hierarchy, or saved
file as visual approval.
