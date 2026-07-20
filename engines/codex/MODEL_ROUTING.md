# BuildIT Codex Model Routing

## Purpose

Select the lowest-cost eligible execution route that meets quality and safety requirements without mixing model choice with permission policy.

Canonical vocabulary is defined in `engines/codex/CONTEXT.md`. Architectural decision: `docs/adr/0002-routellm-evaluation-boundary.md`.

## Routing architecture

```text
Task
→ deterministic Capability Gate
→ Candidate Pool
→ Model Selector
→ Route Decision with fixed permissions
→ execution
→ deterministic evidence
```

The Capability Gate and Model Selector are separate modules.

### Capability Gate owns

- Task Kind;
- read-only versus Writer eligibility;
- Blockbench MCP mutation permission;
- stage/tool allowlist;
- visual-input requirement;
- critical escalation eligibility;
- maximum effort;
- Candidate Pool.

### Model Selector owns

- selecting one route already present in the Candidate Pool;
- returning a score/justification appropriate to the selector;
- declining when required inputs are unavailable.

A Model Selector cannot add candidates, grant tools, create a second Writer, raise maximum effort, or bypass deterministic validation.

## Current eligible routes

```text
parent default          gpt-5.6-terra / medium
routine auditor         gpt-5.4-mini / low / read-only
fallback builder        gpt-5.6-terra / medium / sole Writer
visual director         gpt-5.6-sol / medium / read-only visual judgment
critical reviewer       gpt-5.6-sol / high / read-only decision packet
maximum effort          high
max agent threads       2
max depth               1
```

Model availability is verified against the installed Codex/provider environment. A missing optional route uses the documented eligible fallback and does not interrupt the user.

## Task Kinds and Capability Gate

| Task Kind | Required capability | Candidate Pool policy |
| --- | --- | --- |
| `MICRO_READ` | trivial inspection or tiny reversible edit | parent; do not delegate solely for cost |
| `MECHANICAL_AUDIT` | sizeable deterministic read-only work | routine auditor + parent fallback |
| `REPOSITORY_BUILD` | repository write, tests, commands | selected repository Writer |
| `ASSET_MUTATION` | Blockbench MCP write | exactly one eligible Terra Writer |
| `VISUAL_JUDGMENT` | image inspection and subjective comparison | visual director + bounded eligible fallback |
| `CRITICAL_DECISION` | approved critical reason after normal route cannot resolve | critical reviewer once + safe stop fallback |
| `PERMISSION_OR_STATE` | lease, stage, identity, transition, safety | deterministic only; no learned selection |

A single-candidate pool does not call a Model Selector.

## Current runtime selector

`DeterministicBaselineSelector` is the current runtime baseline.

Its purpose is not to become permanent. It provides:

- auditable current behavior;
- a safe fallback;
- representative Route Decisions for evaluation;
- a baseline against which RouteLLM must prove improvement.

The baseline must be extracted into behavior fixtures rather than protected only by prose or source markers.

## RouteLLM adapter

Status:

```text
EVALUATION_ONLY
```

RouteLLM may implement:

```text
select(task_summary, candidate_pool, routing_policy)
→ route_decision
```

It is useful only when the Candidate Pool contains a meaningful strong/weak pair. It is not invoked for one eligible Writer, permission decisions, stage transitions, or deterministic-only tasks.

### Feasibility gate

Before offline routing evaluation, prove whether the current Codex authentication/provider mode exposes a supported integration seam for a RouteLLM-compatible controller or proxy without losing required Codex features, tool use, agent roles, or supportability.

The provider prototype is a bounded foundation decision. A failed prototype rejects runtime integration but does not invalidate RouteLLM as an offline evaluation tool.

### Evaluation dataset

Use representative BuildIT Tasks, not generic chat prompts:

- file and symbol inventory;
- mechanical test/log review;
- TypeScript feature implementation;
- bug diagnosis;
- architecture analysis;
- MCP tool contract change;
- workspace migration review;
- visual comparison;
- Blockbench Asset mutation;
- final validation decision.

Each fixture records:

```text
task_kind
input summary
required capabilities
candidate pool
baseline route
candidate route
acceptance result
correction count
tool failures
latency
input/output tokens
cost
```

Raw private user content is not required in the routing dataset.

### Acceptance for shadow mode

RouteLLM may produce non-executing shadow recommendations only when:

- provider feasibility is resolved;
- the chosen strong/weak pair is explicit;
- thresholds are calibrated on BuildIT fixtures;
- protected Task Kinds are excluded;
- routing output is deterministic enough for repeatable evaluation;
- evaluation has no unacceptable quality regression;
- deterministic fallback is tested.

### Acceptance for controlled runtime

A later explicit decision is required. At minimum:

- shadow recommendations are stable over representative real work;
- quality and correction cycles are no worse than the accepted limit;
- cost reduction remains after correction/retry cost;
- route failures fall back safely;
- route decisions are observable and auditable;
- only read-only, reversible, non-critical Tasks are enabled first.

## Visual routing

Reference inspection is not automatically a Sol call. The selected Writer may inspect bounded previews and use deterministic visual analysis.

Use a visual route only when:

- affected views conflict;
- deterministic metrics cannot identify the visual root cause;
- the user requests a subjective change after deterministic PASS;
- final artistic acceptance remains genuinely unresolved.

Do not use visual routes for hashes, state, typecheck, tests, profiles, dimensions, fixed-scale metrics, evidence freshness, review readiness, or export integrity.

A visual decision receives a compact packet: objective, reason, Stage, relevant views, current analyzer summary, last change, preserve/forbidden constraints, and one decision question. It returns immediately to the Writer and deterministic evidence.

## Critical routing

Critical review is eligible only for an approved reason code after the normal eligible route cannot close a high-impact decision. It is read-only, packet-based, and invoked at most once for that decision.

Critical review does not grant mutation or override failed deterministic gates.

## Route Decision contract

Every selected route records:

```text
task_kind
selector_id
selector_mode
candidate_pool
selected_model
reasoning_effort
role
read_only or writer
allowed_tools
justification
fallback
required_evidence
```

User-facing output normally reports only the route class and justified escalation, not internal routing scores.

## Call and session budget

- Never spend a model call only to choose another model.
- Keep one active Writer.
- Avoid broad fan-out and recursive delegation.
- Keep reasoning effort at or below High until measured evidence justifies change.
- Deterministic tools answer mechanical questions first.
- A RouteLLM scoring request counts as routing overhead and must be included in cost evaluation.

## Failure handling

```text
optional route unavailable
→ use eligible fallback in current session

Model Selector unavailable
→ DeterministicBaselineSelector

selected route violates Capability Gate
→ ROUTING_CONFLICT and no execution

Writer already owned by another session
→ writer conflict blocker

RouteLLM provider prototype unsupported
→ retain deterministic runtime; continue offline evaluation only
```

## Reporting

Record the Route Decision, execution result, validation result, and next safe operation or blocker. Do not ask the user to select worker models or test internal routing components.

## Invariants

1. Capability eligibility is deterministic.
2. A Model Selector never grants permission.
3. One active Writer exists.
4. A single-candidate pool skips model selection.
5. RouteLLM remains evaluation-only until a later accepted decision promotes it.
6. Every advisory route returns to the Writer and deterministic validation.
7. Current source/runtime evidence outranks cached routing assumptions.
8. Cost is evaluated together with failures, retries, and corrections.
