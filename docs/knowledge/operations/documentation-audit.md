# Documentation Audit

This note records cleanup decisions for workspace documentation. It is an
audit record, not part of the agent boot path.

## Resolved

- The official boot path is `AGENTS.md` → `CONTEXT.md` → `next-action.md` → matching area index.
- `mcp/workflow/skills/` is the single workspace skill source of truth.
- The global Reference Generator entry is a junction to its canonical
  workspace skill, not a second workflow.
- MCP generated output is validation-only, not startup context.
- Foundation policy no longer contains live `OK/TIGHTEN` audit marks.
- Foundation read order now includes source-selection and merge-map documents.

## Remaining Review

- Recheck policy status after the next product/foundation review.
- Recheck workspace-level Markdown links after future module moves.

## Parent

- [Operations](README.md)
- [Knowledge Dashboard](../index.md)
