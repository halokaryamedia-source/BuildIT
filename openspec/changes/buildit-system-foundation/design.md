# Design: BuildIT System Foundation

## Destination

A future developer can identify the owning context, highest test seam, eligible execution route, current evidence, and next safe operation without reading the entire repository or reconciling contradictory documents.

## Contexts

The canonical map is `CONTEXT-MAP.md`.

```text
Reference Design
Asset Production
Agent Orchestration
Workflow Governance
Repository Development
```

Each context owns a glossary and a set of module interfaces. Cross-context artifacts are consumed, not redefined.

## Control model

BuildIT uses domain ownership coordinated by deterministic task classification.

```text
Task
→ classify question and required capability
→ consult domain owners
→ produce Execution Plan
→ execute through one Writer or read-only route
→ prove result through current evidence
```

### Domain ownership

| Question | Owner |
| --- | --- |
| What outcome is required? | explicit user decision and active OpenSpec |
| What is the smallest sufficient slice now? | Ponytail |
| How should implementation be built and verified? | Engineering Discipline |
| Which source and dependents are relevant? | Code Review Graph, confirmed by source |
| Which capabilities and permissions are eligible? | Capability Gate |
| Which eligible model route should execute? | Model Selector |
| Did the implementation work? | current source, tests, build, runtime, and evidence |

## Module design

The target interfaces and seams are defined in `docs/architecture/SYSTEM_FOUNDATION.md`.

### Reference Package

Input: source subject and user constraints.

Output: independently validatable approved Reference Package.

### Asset Production

Target façade:

```text
start_asset
continue_asset
submit_current_stage
apply_review_decision
finalize_asset
```

The façade returns one production snapshot and one next safe operation. Low-level tools remain behind the seam.

### Workspace

Target interface:

```text
prepare
load
complete
reopen
```

Every operation is transactional, root-contained, collision-safe, and recoverable.

### Evidence

Target interface:

```text
capture
validate
bind
is_current
```

Expected values come from independent contracts or known-good fixtures.

### Agent Orchestration

Target interface:

```text
plan_task(task, context) → execution_plan
```

Implementation:

```text
Capability Gate → Candidate Pool → Model Selector
```

### Model Selector

Adapters:

```text
DeterministicBaselineSelector
RouteLLMSelector
```

RouteLLM is evaluation-only until ADR 0002 acceptance requirements are met.

## Transition from current state

### Keep

- ChatGPT Reference Studio → Codex + MCP Blockbench architecture;
- one Reference Visual and executable manifest;
- active/completed workspace separation;
- one writer and write-lease invariant;
- current stage review gates;
- evidence freshness and checkpoint recovery;
- deterministic visual and structural validation;
- existing production skills while the façade is introduced.

### Change

- replace linear authority wording with domain ownership;
- stop extending the old monolithic OpenSpec change;
- remove stale manual identity/lease instructions;
- consolidate model routing around Capability Gate and Model Selector;
- move critical tests from source markers to public behavior;
- introduce façade tools incrementally rather than another parallel tool system;
- measure production runs before further optimization.

### Do not change yet

- user-visible stage count;
- Reference Studio approval count;
- Blockbench model category support;
- runtime model selector;
- final release branch;
- plugin distribution method.

## Tracer-bullet sequence

1. **Authority coherence** — active docs agree on domain ownership and automatic coordination.
2. **Workspace behavior seam** — bootstrap/finalize/reopen tested on real temporary directories.
3. **Production snapshot seam** — one read interface returns stage, blockers, review state, and next operation.
4. **Façade start path** — `start_asset` drives package intake and canonical project preparation.
5. **Façade stage path** — one stage submission/review/revision round trip.
6. **Blockbench acceptance harness** — real plugin load, create, save, reopen, and export.
7. **Multi-archetype corpus** — representative visual and production fixtures.
8. **RouteLLM feasibility** — prove provider seam and run offline evaluation.
9. **Controlled routing rollout** — only after measured acceptance.

## Error model

Every public interface returns either:

```text
PASS + snapshot + next_safe_operation
```

or:

```text
BLOCKED + stable error code + user-safe explanation + preserved state + recovery route
```

Internal errors may contain technical diagnostics, but ordinary user output does not expose profiles, leases, UUIDs, fingerprints, or checkpoint filenames unless support detail is requested.

## Observability

Production run summaries record counts and timings without raw source/reference content. Routing evaluation records task fixture, candidate pool, baseline route, candidate route, result, corrections, latency, and cost.

## Compatibility

The current production tool surface remains available during migration. Façade tools must call existing validated behavior rather than fork it. Once the façade covers a workflow, normal skills stop exposing the replaced low-level coordination steps. Diagnostic access remains separate.

## Rollback

Foundation documentation and contracts are additive. Runtime migration slices must be independently reversible. RouteLLM remains disabled by default and cannot affect current routing until explicitly promoted by a later decision.
