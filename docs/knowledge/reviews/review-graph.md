# Review Index

Updated: 2026-08-11

Use this note to understand **how historical reviews relate to current `Local`**. Review bodies are evidence captured at a point in time; they do not own current execution.

## Current Review Status

| Review | Current meaning |
|---|---|
| [MCP Development Quality Audit](mcp-development-quality-audit.md) | **Historical baseline, largely implemented/superseded.** Its stabilization/reduction findings drove the completed non-local pass. It no longer controls current execution order. |
| [MCP Reference Fidelity Root Cause](mcp-reference-fidelity-root-cause.md) | **Active product evidence.** The core finding remains valid: technical placement success can coexist with visually wrong global form. |
| [Reference Fidelity Observation Contract](mcp-reference-fidelity-observation-contract.md) | **Implemented in source; local proof required.** Observation/correction surfaces exist, but live camera/image/runtime behavior still needs acceptance. |
| [MCP Geometry AI-Slop Audit](mcp-geometry-ai-slop-audit.md) | **Historical evidence, still relevant.** Demonstrates structural/tool PASS is not visual approval. |
| [MCP Surface Curation](mcp-surface-curation.md) | **Historical/superseded.** Later Bedrock semantics audits changed the default surface; do not use its old `apply_texture`/generic recommendations as current truth. |
| [MCP Pre-local Generic Semantics Audit](mcp-prelocal-generic-semantics-audit-2026-08-10.md) | **Implemented evidence.** Generic/redundant Bedrock-misaligned semantics were narrowed/contained before local acceptance. |
| [BlockIT Agent Skill Surface](blockit-agent-skill-surface-2026-08-10.md) | **Implemented evidence.** Current asset route is orchestrator + modelling/texturing/animation specialists. |
| [Codex Native Deferred MCP Tool Loading](codex-native-deferred-mcp-tool-loading-2026-08-11.md) | **Active local-evidence plan.** Source audit is complete; real Codex exposure/search behavior must now be measured locally. |
| [Anti-Slop Skill Candidates](anti-slop-skill-candidates.md) | **Historical research.** Candidate stacks do not override the current nine repository-owned skill packages or task-class routing. |
| [Orca CLI MCP Audit](orca-cli-mcp-audit.md) | **Reference/history only.** Does not override current `Local`. |
| [Review Template](review-template.md) | Current reusable template. |

## Current Execution Gate

The active sequence is now:

```text
non-local source/contract/CI cleanup COMPLETE
↓
repository/documentation handoff aligned
↓
LOCAL — Codex + Blockbench acceptance
↓
reproduce/classify any live failure
↓
smallest evidence-backed fix only
↓
update proof state / next action
```

Current status: [Next Action](../next-action.md).  
Current procedure: [Local Acceptance Runbook](../operations/local-acceptance-runbook.md).

Historical stabilization plans/reviews must not be reopened as current work merely because their body still contains unchecked or future-looking language from the date they were written.

## Reading Order For Local Acceptance

1. [Next Action](../next-action.md)
2. [Local Acceptance Runbook](../operations/local-acceptance-runbook.md)
3. [Validation Report](../../foundation/validation-report.md)
4. [MCP README](../../../mcp/README.md)
5. [Codex Native Deferred MCP Tool Loading](codex-native-deferred-mcp-tool-loading-2026-08-11.md) only when interpreting exposure/search evidence
6. Other reviews only when a reproduced failure needs their evidence

## Reading Order For Reference Fidelity Evidence

1. [Root Cause](mcp-reference-fidelity-root-cause.md)
2. [Reference Fidelity Decision](../decisions/reference-fidelity-loop.md)
3. [Implementation Map](../implementation-map.md)
4. [Validation Report](../../foundation/validation-report.md)

Use older Geometry AI-Slop/Surface Curation reviews only for historical reasoning.

## Status Rule

A review may say `active`, `design frozen`, `next`, or similar because that was true when written. **Current status is owned by source, this index, Validation Report, and `next-action.md`.**

Do not rewrite old evidence to pretend it was produced today. Instead update this index when its current meaning changes.

## Review Labels

- `active product evidence` — finding still supports current product policy;
- `active local-evidence plan` — review defines a question that now requires live proof;
- `implemented evidence` — corresponding source/contract change exists;
- `historical` — reasoning/provenance only;
- `local proof required` — source exists but live behavior is unverified;
- `superseded` — later source/decision replaced the old method/recommendation.

## Review Questions

When adding a review, answer:

- what concrete failure/decision is being reviewed;
- what current owner/source/policy controls it;
- what evidence could disprove the conclusion;
- what was implemented vs proposed;
- what should move to a durable owner instead of remaining review prose.

## Parent

- [Knowledge Dashboard](../index.md)
- [Next Action](../next-action.md)
