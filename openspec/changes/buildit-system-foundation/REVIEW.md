# BuildIT System Foundation Review

Comparison baseline: `e75ebf6b136e65d18d4b848229140b828b9a21ff`  
Reviewed head: current `Rework` foundation snapshot

## Standards

### Accepted strengths

- Canonical vocabulary is now separated by bounded context instead of embedded in implementation instructions.
- Major design choices use Design It Twice and record rejected alternatives.
- Hard-to-reverse decisions are isolated in ADRs.
- Canonical skills remain byte-identical across host adapters.
- Model eligibility is separated from model selection.
- Stale manual identity/lease instructions were removed from active State Machine and Ponytail contracts.
- RouteLLM is isolated behind a stable adapter boundary rather than granted production authority.
- CI path filters now cover foundation contexts, ADRs, architecture, and the bounded foundation change.

### Findings

#### P1 — Broad authority migration is evidence of prior shotgun surgery

The foundation change touches many authority, skill, workflow, routing, and test files. The breadth is justified for this migration, but it proves that rule ownership was previously too distributed.

**Required follow-up:** future policy changes must update one canonical owner and generated/tested summaries, not repeat this migration pattern.

#### P1 — Foundation tests are mainly static contract tests

`system-foundation.test.ts` correctly protects the existence and declared relationships of foundation artifacts. It does not prove workspace transactions, public production behavior, RouteLLM integration, or Blockbench execution.

**Required follow-up:** use these tests as policy checks only. Implement behavior tests through Workspace, Asset Production, Evidence, and Agent Orchestration seams.

#### P1 — Installer lifecycle remains incomplete

The Code Review Graph setup script now pins and verifies the installed version. It still lacks first-class dry-run, repair, and uninstall commands owned by BuildIT.

**Required follow-up:** add a reversible installer lifecycle before onboarding another developer.

#### P1 — Stable-surface naming remains transitional

Normal callers receive a production union, while compatibility payloads and bundle checks may still report `STABLE_FULL_LIBRARY`.

**Disposition:** documented explicitly in `TOOL_PROFILE_CONTRACT.md`. A later compatibility migration should rename metadata only with coordinated client/test updates.

#### P1 — Direct commits to `Rework` weaken review locality

The foundation was written as many connector commits directly on the integration branch. Temporary PRs were needed only to trigger CI.

**Required follow-up:** add reliable push/workflow-dispatch verification and use bounded implementation PRs targeting `Rework` for future runtime slices.

#### P2 — Canonical skills are manually duplicated during connector writes

The sync script correctly verifies byte identity, but connector-based changes required updating canonical and two adapters separately.

**Required follow-up:** prefer canonical-only changes followed by the synchronization command in a normal development checkout.

### Standards verdict

**PASS WITH RECORDED FOLLOW-UPS.** No unaccepted critical source/runtime safety violation was introduced by this foundation change. The largest remaining risks are intentionally represented in the new task backlog rather than disguised as completed work.

## Spec

### Requirements satisfied

- The product architecture remains `ChatGPT Reference Studio → Codex + MCP Blockbench`.
- The prior linear hierarchy was replaced with domain ownership.
- Matt Pocock practices were applied to domain modeling, deep-module design, Design It Twice, TDD/debugging rules, tracer-bullet tasks, and two-axis review.
- A comprehensive, deliberately critical user/developer/operational/security audit was produced.
- Current readiness is scored and stated honestly as internal alpha/sophisticated prototype rather than production-ready.
- RouteLLM is positioned as a candidate Model Selector, while Capability Gate and permissions remain deterministic.
- A bounded foundation OpenSpec change, decision map, architecture, ADRs, and task plan now exist.
- Current skill and production budgets remain unchanged.
- Existing runtime code remains compatible and full CI verification passes.

### Partial requirements / not yet implemented

#### Public Asset Production façade

The target interface is designed:

```text
start_asset
continue_asset
submit_current_stage
apply_review_decision
finalize_asset
```

It is not yet implemented or approved as the final caller interface.

#### Real behavioral proof

The foundation defines Workspace, Evidence, Asset Production, routing, fault-injection, multi-archetype, and Blockbench E2E seams. Those runtime tests and harnesses remain future tracer bullets.

#### RouteLLM

The evaluation boundary, dataset requirements, protected Task Kinds, and acceptance gates are defined. RouteLLM has not been connected to live Codex execution, calibrated, shadowed, or promoted.

#### Product operations

Installer repair/uninstall, user status surface, telemetry, service targets, security threat model, and release qualification remain open.

### Scope control

No Taste Skill, LLMLingua, TOON, new production Stage, new visual style, central event bus, or runtime RouteLLM authority was introduced. The fixed product architecture and existing Stage reviews were preserved.

### Spec verdict

**FOUNDATION DESIGN PASS; IMPLEMENTATION DESTINATION NOT YET COMPLETE.** The request to organize and critically assess the foundation is satisfied. The resulting foundation deliberately exposes rather than closes the remaining runtime/product-readiness gaps.

## Next approval needed

The next decision is whether the proposed Asset Production façade and `production_snapshot` seam are accepted as the implementation frontier. Until that decision is closed, runtime façade work remains intentionally unstarted.
