# BuildIT System Foundation

## Product promise

A user supplies a source subject to ChatGPT Reference Studio, approves a production contract and one Reference Visual, then Codex and MCP Blockbench produce a reviewed, validated, reusable Blockbench package without requiring the user to manage workspace JSON, model routing, tool profiles, leases, checkpoints, or internal tests.

```text
Source Subject
→ approved Reference Package
→ reviewed Blockbench production
→ completed user-facing package
```

The foundation optimizes for five properties:

1. **Correctness** — current evidence proves the active asset matches the approved contract.
2. **Recoverability** — interrupted or revised work resumes without rediscovery or duplicate outputs.
3. **Low user burden** — the user makes product and visual decisions, not internal orchestration decisions.
4. **Developer locality** — each concern changes behind one small interface rather than across many guards and documents.
5. **Measured efficiency** — context, model calls, image payloads, and correction cycles are reduced only when quality evidence remains intact.

## Design It Twice comparison

### Design A — Linear hierarchy

```text
OpenSpec → Ponytail → Engineering Discipline → Code Review Graph → tools
```

**Strength:** simple to explain.

**Failure:** these concepts answer different questions. A linear order implies that a scope policy can overrule a correctness method, or that a graph result is subordinate product intent. It creates unnecessary authority disputes and has already produced contradictory documents.

**Decision:** rejected.

### Design B — Domain-owned control plane

```text
Task Router
├─ requirements domain       OpenSpec + explicit user decision
├─ scope domain              Ponytail
├─ engineering domain        Engineering Discipline
├─ context intelligence      Code Review Graph
├─ model execution           Capability Gate + Model Selector
└─ technical evidence        source/tests/build/runtime
```

**Strength:** every component owns one question. Conflicts are resolved by question type. New adapters can be added without changing product truth.

**Cost:** requires a precise task vocabulary and explicit interfaces.

**Decision:** selected.

### Design C — Event-driven orchestration platform

Every document, tool, stage, model route, and approval emits events consumed by a central orchestration service.

**Strength:** strong observability and extensibility.

**Failure:** adds a new distributed state authority, migration burden, event schema, daemon, and operational surface before the local workflow has passed one diverse acceptance suite.

**Decision:** rejected for the current destination. Event telemetry may be reconsidered only after measured production use proves it necessary.

## Selected architecture

BuildIT uses a **domain-owned control plane over a local production data plane**.

```text
┌──────────────────────────────── CONTROL PLANE ────────────────────────────────┐
│ Product Contract │ Scope Policy │ Engineering Method │ Context Intelligence │
│ Capability Gate  │ Model Selector │ Review Decisions │ Recovery Policy       │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │ Execution Plan
┌──────────────────────────────── DATA PLANE ───────────────────────────────────┐
│ ChatGPT Reference Studio │ Codex │ MCP Blockbench │ Workspace │ Evidence      │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │ Current proof
┌──────────────────────────────── EVIDENCE PLANE ───────────────────────────────┐
│ source │ diff │ tests │ typecheck │ build │ rendered views │ runtime │ hashes │
└───────────────────────────────────────────────────────────────────────────────┘
```

No plane may silently take ownership from another:

- product contracts do not choose models;
- model selectors do not grant tools or write permission;
- scope policy does not waive correctness evidence;
- graph intelligence does not override current source;
- technical evidence does not silently reinterpret user intent.

## Deep modules and seams

### 1. Reference Package module

**Interface**

```text
prepare_reference(source_subject, user_constraints)
→ reference_candidate

approve_production_context(candidate)
→ context_approved_candidate

approve_reference_visual(candidate)
→ approved_reference_package
```

The interface owns approval status, blocking errors, package identity, and integrity. Prompt variants, image generation, crop extraction, manifest creation, and package audit remain hidden implementation details.

**Primary seam:** an approved Reference Package that can be validated independently of ChatGPT conversation history.

### 2. Asset Production module

**Target external interface**

```text
start_asset(reference_package)
→ production_snapshot

continue_asset(asset_id)
→ production_snapshot

submit_current_stage(asset_id)
→ review_snapshot

apply_review_decision(asset_id, decision)
→ production_snapshot

finalize_asset(asset_id)
→ completed_package
```

Geometry, Texture, Animation, evidence capture, checkpoint selection, UUID synchronization, profile changes, and lease preparation belong behind this interface. The existing low-level MCP tools remain implementation tools, not the long-term caller interface.

**Primary seam:** a production snapshot containing current stage, visible progress, current blockers, review material, and one next safe operation.

### 3. Workspace module

**Interface**

```text
prepare(reference_package) → active_workspace
load(asset_id) → workspace_snapshot
complete(asset_id, approval) → completed_workspace
reopen(asset_id, stage, reason) → active_workspace
```

Path derivation, state/project templates, reference copying, index updates, promotion, backup, and rollback are hidden.

**Primary seam:** workspace lifecycle behavior tested against real temporary directories.

### 4. Evidence module

**Interface**

```text
capture(evidence_request) → evidence_set
validate(contract, evidence_set) → validation_result
bind(asset_snapshot, evidence_set) → bound_evidence
is_current(bound_evidence, asset_snapshot) → boolean
```

Every pass/fail claim must identify its independent source of truth. Source-marker tests and self-derived expected values are not sufficient evidence for production behavior.

**Primary seam:** deterministic validation from fixture contracts, actual model snapshots, and captured outputs.

### 5. Agent Orchestration module

**Interface**

```text
plan_task(task, current_context)
→ execution_plan
```

An `execution_plan` contains:

```text
task_kind
required_capabilities
candidate_pool
selected_route
permission_set
writer_identity or read_only
required_evidence
stop_conditions
```

The implementation is two steps:

```text
Capability Gate
→ Model Selector
```

The Capability Gate is deterministic and non-negotiable. The Model Selector is replaceable.

### 6. Model Selector adapters

```text
DeterministicBaselineSelector
RouteLLMSelector
```

Both satisfy:

```text
select(task_summary, candidate_pool, routing_policy)
→ route_decision
```

A selector cannot add a model to the Candidate Pool, raise permissions, create a second writer, or bypass a stage/tool guard.

RouteLLM begins as an evaluation adapter. Runtime use requires:

- a supported Codex/provider integration seam;
- representative BuildIT routing data;
- calibrated thresholds for the actual strong/weak pair;
- no meaningful quality regression on protected task classes;
- auditable fallback to the deterministic baseline.

### 7. Repository Development module

**Interface**

```text
plan_change(change_contract) → verified_change_plan
implement_slice(verified_change_plan) → change_result
review_change(change_result) → standards_report + spec_report
```

OpenSpec, Ponytail, Engineering Discipline, and Code Review Graph participate by domain. None becomes a global controller.

## Deterministic task router

| Task kind | Primary domain | Required support |
| --- | --- | --- |
| Requirement or acceptance change | Product Contract | Scope Policy, Engineering Method |
| New feature | Product Contract | Scope Policy, Engineering Method, Context Intelligence |
| Bug or performance regression | Engineering Method | Context Intelligence, Scope Policy, Product Contract check |
| Refactor | Engineering Method | Context Intelligence, Scope Policy |
| Architecture decision | Engineering Method | Product Contract when behavior changes, Scope Policy |
| Code review | Engineering Method | Context Intelligence, Product Contract for Spec axis |
| Asset mutation | Asset Production | Capability Gate, Writer ownership, Evidence |
| Visual judgment | Review Decision | deterministic evidence, eligible visual route |
| Mechanical read-only audit | Context Intelligence | low-cost eligible route |

The router classifies by task semantics; it does not spend a model call solely to choose a model.

## System invariants

1. One Asset has one canonical identity and one canonical model filename.
2. One active Asset has at most one Writer.
3. A Model Selector cannot grant capabilities.
4. A Review Gate is user-visible; an Internal Pass is not.
5. Every approval binds current identity, state revision, contract, and evidence.
6. A mutation invalidates dependent evidence.
7. Completed Baselines are immutable until explicitly reopened into an Active Workspace.
8. User-facing output remains usable without MCP internal files.
9. No document duplicates executable arrays owned by a machine-readable contract.
10. Every operation returns one next safe operation or one explicit blocker.
11. Production and repository-development skills never share one active skill profile.
12. RouteLLM cannot enter production runtime before evaluation acceptance is recorded.

## User journey

The user should need to understand only:

```text
what is being built
what the approved reference looks like
which stage is currently under review
what visible issue remains
where the final package is located
```

The user should not need to understand:

```text
MCP profiles
write leases
UUID reconciliation
state revisions
checkpoint filenames
model-role selection
graph freshness
internal validation commands
```

## Developer journey

A developer starts from one of two entry points:

```text
Asset production change → active product/workflow OpenSpec
Repository foundation change → active foundation OpenSpec
```

Then:

```text
identify bounded context
→ identify highest existing seam
→ write or reproduce failing behavior
→ implement one vertical slice
→ run targeted checks
→ review Standards and Spec separately
→ run full verification once
```

## Testing strategy

### Highest seams

1. Reference Package validation from an extracted package fixture.
2. Asset lifecycle from `start_asset` through finalization using a temporary workspace.
3. Geometry mutation and review through the public MCP production interface.
4. Route planning from representative Task fixtures to execution plans.
5. Plugin load/connect/create/save/reopen/export in real Blockbench.

### Test classes

- **Contract tests:** schema, state transitions, permission rules, adapter compatibility.
- **Behavior tests:** real filesystem and public tool behavior.
- **Golden tests:** known-good Reference Packages and model outputs across several archetypes.
- **Negative tests:** stale evidence, conflicting authority, concurrent writer, unsafe transform, corrupted package.
- **End-to-end tests:** fresh workstation profile to completed user package.

Source-string marker tests may protect generated artifacts or compatibility wording, but they must not be the primary proof of runtime behavior.

## Observability required before optimization

Record per production run:

```text
stage duration
MCP call count
stage-context bytes
tool failures and retries
model route and effort
input/output tokens
visual correction cycles
evidence regeneration count
checkpoint size
final validation result
user revision count
```

Record per repository change:

```text
files changed
blast radius
targeted tests
full verification result
review findings
regressions after merge
```

Optimization without these measurements is a hypothesis, not evidence.

## Foundation destination

The foundation is ready for implementation when:

- domain terms and ownership are consistent;
- stale linear hierarchy language is removed;
- the public production interface is selected;
- RouteLLM feasibility is proven or rejected through a bounded prototype;
- representative evaluation fixtures exist;
- one real Blockbench end-to-end acceptance harness is designed;
- product, developer, and operational risks have explicit owners and acceptance criteria.
