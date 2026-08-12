# Review Index

Updated: 2026-08-12

Reviews are point-in-time evidence. They do **not** own current execution; source, current policy, Validation Report, and `next-action.md` do.

## Current meaning

| Review | Current meaning |
|---|---|
| [MCP Development Quality Audit](mcp-development-quality-audit.md) | **Historical baseline, largely implemented/superseded.** Drove the completed non-local stabilization pass. |
| [Model Creation Effectiveness Audit](model-creation-effectiveness-audit-2026-08-10.md) | **Active product evidence, implemented in current workflow.** Defines false-PASS, cross-view, correction-loop, and tool-friction failure classes. |
| [MCP Reference Fidelity Root Cause](mcp-reference-fidelity-root-cause.md) | **Active product evidence.** Technical placement success can coexist with visually wrong global form. |
| [Reference Fidelity Observation Contract](mcp-reference-fidelity-observation-contract.md) | **Implemented with representative local proof.** Observation/correction surfaces exist; exact branch-specific camera/runtime claims still follow the Validation Report evidence boundary. |
| [MCP Geometry AI-Slop Audit](mcp-geometry-ai-slop-audit.md) | **Historical evidence, still relevant.** Structural/tool PASS is not visual approval. |
| [MCP Surface Curation](mcp-surface-curation.md) | **Historical/superseded.** Later Bedrock semantics audits changed the default surface. |
| [Bedrock Entity Capability Surface Audit](bedrock-entity-capability-surface-audit.md) | **Official-source evidence.** Establishes native Bedrock capability boundary used to prevent accidental pruning. |
| [Bedrock Entity Capability Surface Matrix](bedrock-entity-capability-surface-matrix.md) | **Current capability guardrail / local-proof map.** Maps retained/protected Bedrock capabilities to BlockIT owners. |
| [MCP Pre-local Generic Semantics Audit](mcp-prelocal-generic-semantics-audit-2026-08-10.md) | **Implemented evidence.** Generic/redundant Bedrock-misaligned semantics were narrowed/contained. |
| [BlockIT Agent Skill Surface](blockit-agent-skill-surface-2026-08-10.md) | **Implemented evidence.** Current asset route is orchestrator + modelling/texturing/animation specialists. |
| [Codex Native Deferred MCP Tool Loading](codex-native-deferred-mcp-tool-loading-2026-08-11.md) | **Static architecture implemented; installed-client parity remains optional local proof.** Upstream deferred search plus P1/P2 static retrieval evidence support the current exact-name loading route; real installed Codex/model behavior remains `LOCAL PROOF REQUIRED` if that claim becomes necessary. |
| [Anti-Slop Skill Candidates](anti-slop-skill-candidates.md) | **Historical research.** Candidate stacks do not override current routing. |
| [Orca CLI MCP Audit](orca-cli-mcp-audit.md) | **Reference/history only.** |
| [Review Template](review-template.md) | Reusable review template. |

## Current execution gate

```text
LOCAL Codex + Blockbench acceptance COMPLETE
→ post-acceptance static cleanup COMPLETE
→ P0–P4 routing / deferred-loading / recovery / defect-navigation hardening COMPLETE
→ current-state documentation synchronization COMPLETE
→ WAIT for next product/defect task or explicit local-proof request
```

Current state: [Next Action](../next-action.md).  
Completed local procedure: [Local Acceptance Runbook](../operations/local-acceptance-runbook.md).

Deleted historical plans/experiments remain available through Git history. Do not recreate them merely because an old review links conceptually to that phase.

## Local proof reading order — only when explicitly reactivated

1. [Next Action](../next-action.md)
2. [Local Acceptance Runbook](../operations/local-acceptance-runbook.md) only if the active task points there
3. [Validation Report](../../foundation/validation-report.md)
4. [MCP README](../../../mcp/README.md)
5. this review index only when a failure needs prior evidence
6. a specific review body only when that evidence can change the next decision

## Reference-fidelity evidence

1. [Model Creation Effectiveness Audit](model-creation-effectiveness-audit-2026-08-10.md)
2. [Root Cause](mcp-reference-fidelity-root-cause.md)
3. [Reference Fidelity Decision](../decisions/reference-fidelity-loop.md)
4. [Implementation Map](../implementation-map.md)
5. [Validation Report](../../foundation/validation-report.md)

## Status rule

A review body may say `active`, `next`, `design frozen`, or contain future-looking language because that was true when written. Do not rewrite historical evidence as if produced today; use this index to state its current meaning.

## Review labels

- `active product evidence` — finding still supports current policy;
- `active local-evidence question` — static work is complete and live proof decides an explicitly active next move;
- `implemented evidence` — corresponding current source/contract exists;
- `historical` — provenance/reasoning only;
- `local proof required` — source exists but a specific live behavior is unverified;
- `superseded` — later source/decision replaced the method/recommendation.

## Parent

- [Knowledge Dashboard](../index.md)
- [Next Action](../next-action.md)
