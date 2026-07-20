# Proposal: BuildIT System Foundation

## Problem Statement

BuildIT has a strong product direction and extensive runtime safeguards, but its foundation is difficult to reason about. Requirements, scope control, implementation method, model routing, runtime state, incident history, regression checklists, and future work are distributed across overlapping documents. Several documents contradict current automatic behavior. Green CI does not yet prove the complete user journey.

From the user's perspective, the system promises a simple reference-to-final-package workflow but still exposes installation complexity, multiple review points, and unclear failure ownership.

From the developer's perspective, one behavior may require reading OpenSpec, Ponytail, AGENTS, governance, state machine, model routing, profiles, skills, tests, and wrapper order. The current active OpenSpec change has become a long-lived project notebook rather than a bounded change contract.

## Solution

Establish a domain-owned system foundation with:

- a bounded-context map and canonical glossary;
- one architecture document defining modules, interfaces, seams, and invariants;
- domain-specific decision ownership instead of a linear authority hierarchy;
- a deterministic task router that coordinates product, scope, engineering, context, routing, and evidence domains;
- a stable public Asset Production interface that hides low-level orchestration;
- RouteLLM isolated behind a deterministic Capability Gate and evaluated before runtime adoption;
- a credible behavioral-test and workstation end-to-end strategy;
- a prioritized remediation plan for current user, developer, operational, and security gaps.

## User Stories

1. As an asset requester, I want to understand the current stage and visible blocker without understanding MCP internals, so that I can make the required decision quickly.
2. As an asset requester, I want the final Blockbench package to remain usable without agent state files, so that I can deliver or edit it normally.
3. As an asset requester, I want accepted work preserved during revision, so that a targeted correction does not restart production.
4. As an asset requester, I want installation described honestly as one-time setup rather than hidden manual work, so that expectations are accurate.
5. As a developer, I want one context map and canonical vocabulary, so that the same term is not used with several meanings.
6. As a developer, I want every rule class to have one owner, so that documentation does not drift.
7. As a developer, I want a small public production interface, so that internal tool and guard changes do not break callers.
8. As a developer, I want runtime behavior tested through public seams, so that green tests prove behavior rather than source wording.
9. As a developer, I want each OpenSpec change to have one bounded destination, so that completion and review are meaningful.
10. As a developer, I want model permissions separated from model selection, so that cost optimization cannot grant unsafe capability.
11. As a developer, I want RouteLLM compared against a measurable baseline, so that routing changes are evidence-based.
12. As a maintainer, I want filesystem transitions tested under failure, so that completion and recovery cannot corrupt the workspace.
13. As a maintainer, I want one reproducible Blockbench acceptance harness, so that CI and local testing prove the actual product path.
14. As a reviewer, I want Standards and Spec findings reported separately, so that clean code cannot hide wrong behavior and correct behavior cannot hide poor engineering.
15. As a project owner, I want a readiness score based on diverse assets and real runs, so that production claims are not based on one Golden Sample.

## Implementation Decisions

- BuildIT uses five bounded contexts: Reference Design, Asset Production, Agent Orchestration, Workflow Governance, and Repository Development.
- OpenSpec, Ponytail, Engineering Discipline, Code Review Graph, model routing, and technical evidence have separate domain ownership. They are not one global hierarchy.
- Asset Production will move toward a small façade interface: start, continue, submit current stage, apply review, and finalize.
- Existing low-level MCP tools remain internal implementation and diagnostic surfaces until the façade is behaviorally proven.
- Agent Orchestration is split into a deterministic Capability Gate and a replaceable Model Selector.
- RouteLLM is a candidate Model Selector adapter in evaluation mode, not a runtime authority.
- The old `codex-local-workflow-rework` change remains implementation history and must not absorb new foundation scope.
- Human-readable documents summarize; machine-readable contracts own executable arrays and state.
- Work proceeds in tracer-bullet slices through the highest existing seam.

## Testing Decisions

- Tests will prefer the highest public seam that can observe required behavior.
- Source-marker tests remain only for generated-adapter identity, explicit compatibility strings, and static policy declarations.
- Workspace lifecycle tests use real temporary directories and fault injection.
- Asset lifecycle tests cover reference import, project creation, mutation, evidence invalidation, review, save/reopen, finalization, and recovery.
- Routing tests use representative Task fixtures and compare deterministic baseline decisions with candidate RouteLLM recommendations.
- A Windows-first Blockbench end-to-end harness is required before repeatable-production readiness.
- Visual-quality acceptance uses several asset archetypes rather than one subject.

## Out of Scope

- Replacing the current runtime router with RouteLLM before feasibility and evaluation pass.
- Adding new Blockbench modelling categories, rendering styles, review stages, or approval modes.
- Merging `Rework` into `V1` or publishing a production release.
- Building a central event-driven orchestration service.
- Rewriting the full MCP plugin before façade seams are proven.
- Removing existing recovery safeguards without equivalent behavior tests.

## Acceptance Criteria

The foundation change is complete when:

1. bounded contexts and canonical terms are documented;
2. domain ownership replaces linear hierarchy language in active development authorities;
3. system modules, interfaces, seams, and invariants are explicit;
4. the old monolithic change is identified as implementation history;
5. stale manual identity/lease instructions are removed from active workflow docs;
6. model routing distinguishes Capability Gate from Model Selector;
7. RouteLLM evaluation requirements and protected task classes are explicit;
8. public production façade and behavioral test seams are selected;
9. a prioritized audit and decision map exist;
10. CI verifies the foundation contracts and current package remains green.
