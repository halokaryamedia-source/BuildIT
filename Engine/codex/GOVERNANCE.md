# Codex Workflow Governance

This document defines how OpenSpec and Ponytail work together.

## Core Separation

```text
OpenSpec = what was agreed, why it matters, boundaries, stages, and acceptance criteria
Ponytail = the smallest efficient action needed right now to satisfy that agreement
```

They are complementary and must not duplicate each other.

## OpenSpec Responsibility

OpenSpec is the durable project memory and scope contract.

It must preserve:

- the primary goal;
- approved reference-package format;
- user-visible stages;
- in-scope work;
- explicit non-goals;
- stage inputs and outputs;
- review gates;
- acceptance criteria;
- decisions already approved;
- unresolved blockers;
- deferred improvements;
- conditions that require reopening an earlier stage.

OpenSpec prevents:

- forgetting previous agreements;
- silently changing the goal;
- merging unrelated improvements into the current task;
- repeating resolved decisions;
- overdeveloping features that do not improve the approved result.

### OpenSpec Read Rule

Read at:

1. session start;
2. stage transition;
3. scope conflict;
4. proposed broad change;
5. recovery after context loss.

Do not reread or restate the entire spec before every small MCP edit.

## Ponytail Responsibility

Ponytail is the execution-efficiency filter.

Before a meaningful batch, ask:

```text
What approved goal does this action serve?
Is it required now?
What is the smallest safe action that produces visible progress?
Can an existing tool, document, checkpoint, or accepted result be reused?
What must not change?
How will the result be verified?
When should the work stop?
```

Ponytail rejects:

- speculative features;
- unrelated cleanup;
- duplicate documents;
- repeated full preflights;
- unnecessary MCP sessions;
- unnecessary screenshots;
- large data dumps when focused evidence is enough;
- micro-cubes for texture details;
- broad rebuilds when a local patch is enough;
- new tools when an existing safe tool already solves the need;
- polishing before the active stage is structurally complete;
- CI/build work before the workflow implementation is ready for final verification.

## Execution Order

```text
1. OpenSpec confirms the approved destination and boundaries.
2. state.json confirms current runtime position.
3. Active-stage document defines required work and evidence.
4. Ponytail selects the smallest complete execution batch.
5. MCP performs the batch.
6. Focused verification checks only the affected requirements.
7. state.json and evidence are updated.
8. Work stops when stage acceptance criteria are met.
```

## Ponytail Batch Gate

Use this compact gate before a meaningful batch:

```text
Stage:
Approved goal:
Required now: Yes / No
Smallest complete batch:
Reuse available:
Forbidden changes:
Required tool profile:
Verification:
Stop condition:
Estimated MCP/evidence cost: Low / Medium / High
```

If `Required now` is `No`, do not execute it. Record it as deferred only when it is genuinely useful later.

## Overdevelopment Test

A proposed action is overdevelopment when one or more are true:

- it does not contribute to the active stage acceptance criteria;
- the user did not request it and the approved package does not require it;
- it creates a new abstraction without reducing current risk or repeated work;
- it adds maintenance cost greater than the expected production benefit;
- it solves a hypothetical future problem rather than a current blocker;
- it duplicates state or authority already stored elsewhere;
- it requires reopening accepted work without a proven reference conflict;
- it consumes significant tokens/tool calls without producing reviewable progress.

Default response:

```text
DEFERRED_NOT_REQUIRED
Reason:
Revisit condition:
```

## Stage-Specific Efficiency

### Geometry

Do:

- bounded primary-form and structural-detail batches;
- five standard views at review;
- local revision after feedback.

Avoid:

- one MCP call for every cube when one safe batch is possible;
- UV, texture, animation, or export work;
- repeated full-model inspection after local changes.

### Texture

Do:

- UV, Base Texture, and Detail Texture as internal passes;
- one atlas and focused model evidence at review.

Avoid:

- approval between internal passes;
- geometry rebuild to solve pixel detail;
- repeated atlas screenshots after every paint action.

### Animation

Do:

- skip automatically when not required;
- build only approved pivots, chains, and clips.

Avoid:

- adding optional animations for completeness;
- changing accepted geometry or texture unless a blocker is proven.

### Final Validation

Do:

- execute the approved validation contract;
- repair at most two local failures automatically;
- return broad failures to the relevant stage.

Avoid:

- new features;
- broad polish outside validation failures;
- CI/release work until local workflow implementation is intentionally ready for final verification.

## Documentation Rule

Normal session read set:

1. `GOVERNANCE.md` once per session or after context loss;
2. active OpenSpec summary;
3. `state.json`;
4. reference core;
5. active-stage document.

Detailed playbooks are conditional resources, not mandatory startup reading.

## Completion Rule

A batch is complete when:

- the required change exists;
- focused verification passes;
- no unrelated accepted area changed;
- state/evidence are updated;
- the active stage has either reached its review gate or has one clearly named next requirement.

Do not continue merely because more improvements are possible.
