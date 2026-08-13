# Review Index

Updated: 2026-08-13

Reviews are point-in-time evidence. They do **not** own current execution; current source, current policy, the Validation Report, and `next-action.md` do.

## Current Meaning

| Review | Current meaning |
|---|---|
| [MCP Development Quality Audit](mcp-development-quality-audit.md) | **Historical baseline, largely implemented/superseded.** Drove the completed non-local stabilization pass. |
| [Model Creation Effectiveness Audit](model-creation-effectiveness-audit-2026-08-10.md) | **Active product evidence, implemented through P5–P7 contracts.** Defines false-PASS, cross-view, correction-loop, and tool-friction failure classes. |
| [MCP Reference Fidelity Root Cause](mcp-reference-fidelity-root-cause.md) | **Active product evidence.** Technical placement success can coexist with visually wrong global form. |
| [Reference Fidelity Observation Contract](mcp-reference-fidelity-observation-contract.md) | **Implemented with representative local proof.** Observation/correction surfaces exist; later P5–P7 reasoning hardening remains model-facing proof when explicitly evaluated. |
| [MCP Geometry AI-Slop Audit](mcp-geometry-ai-slop-audit.md) | **Active historical evidence.** G-24/G-25 directly inform P7 qualitative convergence; structural/tool PASS is not visual approval. |
| [MCP Surface Curation](mcp-surface-curation.md) | **Historical/superseded.** Later Bedrock semantics audits changed the default surface. |
| [Bedrock Entity Capability Surface Audit](bedrock-entity-capability-surface-audit.md) | **Official-source evidence.** Establishes native Bedrock capability boundary used to prevent accidental pruning. |
| [Bedrock Entity Capability Surface Matrix](bedrock-entity-capability-surface-matrix.md) | **Current capability guardrail / local-proof map.** Maps retained/protected Bedrock capabilities to BlockIT owners. |
| [MCP Pre-local Generic Semantics Audit](mcp-prelocal-generic-semantics-audit-2026-08-10.md) | **Implemented evidence.** Generic/redundant Bedrock-misaligned semantics were narrowed/contained. |
| [BlockIT Agent Skill Surface](blockit-agent-skill-surface-2026-08-10.md) | **Historical skill-surface evidence.** Current inventory additionally includes the later minimal `blockbench-reference-generator` route. |
| [Codex Native Deferred MCP Tool Loading](codex-native-deferred-mcp-tool-loading-2026-08-11.md) | **Static architecture implemented; installed-client parity remains optional local proof.** |
| [Professional Authoring Expressiveness](professional-authoring-expressiveness-2026-08-13.md) | **Implemented evidence.** Identified the bounded `place_cube` parent/inflate creation bottleneck without introducing professional presets. |
| [Professional Sample Forensic Audit](professional-sample-forensic-audit-2026-08-13.md) | **Current static evidence.** Geometry/Texturing/Animation sample patterns drove PRO-4–PRO-7 while remaining learning evidence only. |
| [Professional Animation Controller Prioritization](professional-animation-controller-prioritization-2026-08-13.md) | **Current static evidence.** Read-only controller inspection is bounded; controller creation/mutation is intentionally deferred. |
| [Anti-Slop Skill Candidates](anti-slop-skill-candidates.md) | **Historical research.** Candidate stacks do not override current routing. |
| [Orca CLI MCP Audit](orca-cli-mcp-audit.md) | **Reference/history only.** |
| [Review Template](review-template.md) | Reusable review template. |

## Current Execution Gate

```text
LOCAL Codex + Blockbench acceptance                          COMPLETE (historical baseline)
→ post-acceptance static cleanup                             COMPLETE
→ P0–P7 reasoning/routing/reference-fidelity contracts      COMPLETE (static)
→ minimal Reference Generator route/buildability            COMPLETE (static)
→ PRO-1–PRO-4 professional reasoning + forensic audit       COMPLETE (static)
→ PRO-5 Box-UV batch parity                                  COMPLETE (static)
→ PRO-6 authored Molang transform keyframes                 COMPLETE (static)
→ PRO-7 bounded new-animation sound events                  COMPLETE (static)
→ PRO-8 read-only AnimationController/state inspection      COMPLETE (static)
→ current-state proof/ownership synchronization             COMPLETE
→ NO LOCAL RUN ACTIVE
→ NO FURTHER SAMPLE-DRIVEN SOURCE EXPANSION
```

Current state: [Next Action](../next-action.md).  
Completed local procedure: [Local Acceptance Runbook](../operations/local-acceptance-runbook.md).

Deleted historical plans/experiments remain available through Git history. Do not recreate them merely because an old review links conceptually to that phase.

## Superseded Reference-Generator Decision Note

The 2026-08-08 decision-log entry that kept Reference Generator as foundation-only/no root skill is **superseded by current `Local` source**:

```text
.agents/skills/blockbench-reference-generator/SKILL.md
docs/foundation/04-reference-guide.md
AGENTS.md reference-preparation route
```

Current decision note: [`../decisions/reference-generator-route-current.md`](../decisions/reference-generator-route-current.md).

The useful boundary from the old decision remains: image generation is image-capable pre-modelling work, not MCP geometry authoring. Current source/skill inventory is the execution authority.

## Local Proof Reading Order — Only When Explicitly Reactivated

1. [Next Action](../next-action.md)
2. [Validation Report](../../foundation/validation-report.md)
3. [Local Acceptance Runbook](../operations/local-acceptance-runbook.md) only if the active task points there
4. [MCP README](../../../mcp/README.md)
5. this review index only when a failure needs prior evidence
6. a specific review body only when that evidence can change the next decision

## Reference-fidelity Evidence

1. [Model Creation Effectiveness Audit](model-creation-effectiveness-audit-2026-08-10.md)
2. [Root Cause](mcp-reference-fidelity-root-cause.md)
3. [Reference Fidelity Decision](../decisions/reference-fidelity-loop.md)
4. [Implementation Map](../implementation-map.md)
5. [Validation Report](../../foundation/validation-report.md)

## Status Rule

A review body may say `active`, `next`, `design frozen`, or contain future-looking language because that was true when written. Do not rewrite historical evidence as if produced today; use this index to state its current meaning.

## Review Labels

- `active product evidence` — finding still supports current policy;
- `active local-evidence question` — static work is complete and live proof decides an explicitly active next move;
- `implemented evidence` — corresponding current source/contract exists;
- `historical` — provenance/reasoning only;
- `local proof required` — source exists but a specific live behavior is unverified;
- `superseded` — later source/decision replaced the method/recommendation.

## Parent

- [Knowledge Dashboard](../index.md)
- [Next Action](../next-action.md)
