# Proposal: Codex Local Workflow Rework

## Why

The current local workflow is safe but fragmented across legacy reference requirements, too many user-visible phases, repeated preflight reads, duplicated runtime state, and approval after internal technical steps. This creates avoidable token use, MCP calls, context drift, and user interruptions.

The approved ChatGPT reference package now provides one visual authority plus explicit Geometry, Texturing, Animation, and Validation documents. Local Codex should consume that package directly and focus on producing the correct Blockbench result.

## Governance Model

### OpenSpec

OpenSpec is the durable scope and decision contract.

It records:

- what was agreed;
- the primary goal;
- in-scope work;
- explicit non-goals;
- stage structure;
- stage outputs and review gates;
- accepted decisions;
- blockers;
- deferred improvements;
- acceptance criteria.

Its purpose is to prevent forgotten agreements, scope drift, and overdevelopment.

### Ponytail

Ponytail is the execution-efficiency filter.

It decides:

- whether an action is required now;
- the smallest complete safe batch;
- which existing result/tool/checkpoint can be reused;
- which tools and evidence are actually needed;
- what must remain unchanged;
- when the work should stop.

Its purpose is to prevent unnecessary token use, MCP calls, screenshots, sessions, abstractions, cleanup, and speculative work.

### Combined Rule

```text
OpenSpec defines the approved destination and boundaries.
Ponytail chooses the smallest efficient action to reach the current stage requirement.
```

They must complement each other rather than duplicate full checklists at every edit.

## Goals

- Make local Codex direct, precise, and reference-driven.
- Reduce routine user approvals to one review after each user-visible stage.
- Keep internal technical passes without interrupting the user.
- Use one machine-readable runtime state.
- Reuse one MCP session and persistent checkpoints.
- Restrict tool/document loading to the active stage.
- Apply the one-issue rule only to revision cycles, not initial construction.
- Preserve strict validation and rollback behavior.
- Prevent work that does not contribute to the active stage acceptance criteria.

## User-Visible Stages

1. Geometry
2. Texture
3. Animation, only when required
4. Final Validation

Each completed stage produces previews and waits for user approval or targeted revision instructions.

Internal passes do not create separate routine approval gates.

## Scope

### Included

- Replace legacy reference intake requirements with the approved package format.
- Add a single Codex bootstrap entry point.
- Add explicit OpenSpec/Ponytail governance.
- Add a machine-readable session state template.
- Consolidate production into four user-visible stages.
- Keep Main Geometry/Structural Detail, UV/Base/Detail Texture, and other technical work as internal passes.
- Update gates, checklists, handoff rules, and active-project guidance.
- Add safe source-level efficiency improvements where directly useful.

### Deferred Until Later

- Continuous integration and automated verification on every branch update.
- Pull-request preview deployment during active rework.
- Release preparation.
- Comprehensive final verification pipeline.

These are intentionally deferred until the workflow implementation is functionally complete. Focused local verification remains allowed for changed areas.

### Not Included in the First Pass

- Replacing the MCP server architecture.
- Adding another MCP endpoint.
- Introducing external agent frameworks.
- Rewriting every existing tool.
- Automatically judging visual similarity with an external vision service.
- Adding speculative future features without an active blocker or repeated production need.

## Risks

- Existing sessions may still use legacy reference packages and must be migrated explicitly.
- Runtime state and Markdown summaries can drift unless generated from one authority.
- Tool-profile enforcement may require later MCP protocol changes.
- Persistent project snapshots may require Blockbench filesystem permission.
- Premature CI can waste time while core workflow contracts are still changing.

## Success Criteria

- A new reference ZIP can start local work without searching for legacy sheets.
- Normal startup reads are limited to governance, OpenSpec summary, state, package core, and active-stage document.
- Geometry, Texture, optional Animation, and Final Validation each have one review gate.
- No approval is requested between internal passes.
- Initial builds support bounded batches; revisions remain local.
- Stage output always contains required preview evidence.
- Final Validation returns PASS, REVISION_REQUIRED, or BLOCKER with evidence.
- Actions unrelated to active stage acceptance criteria are rejected or deferred.
- Branch `Rework` remains isolated from V1 until explicit final integration approval.
- CI is added only as a final development step after the workflow implementation stabilizes.
