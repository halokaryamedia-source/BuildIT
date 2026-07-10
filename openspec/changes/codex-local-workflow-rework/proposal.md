# Proposal: Codex Local Workflow Rework

## Why

The current local workflow is safe but fragmented across legacy reference requirements, too many user-visible phases, repeated preflight reads, duplicated runtime state, approval after internal technical steps, and connection discovery spread across Codex, Blockbench, and the MCP plugin. This creates avoidable token use, MCP calls, context drift, and user interruptions.

The approved ChatGPT reference package now provides one visual authority plus explicit Geometry, Texturing, Animation, and Validation documents. Local Codex should consume that package directly and focus on producing the correct Blockbench result.

## Governance Model

### OpenSpec

OpenSpec is the durable scope and decision contract. It records the goal, scope, non-goals, stage structure, accepted decisions, blockers, deferred improvements, and acceptance criteria. It prevents forgotten agreements, scope drift, and overdevelopment.

### Ponytail

Ponytail is the execution-efficiency filter. It decides whether an action is required now, the smallest complete safe batch, which existing result/tool/checkpoint can be reused, which tools/evidence are needed, what must remain unchanged, and when work should stop.

```text
OpenSpec defines the approved destination and boundaries.
Ponytail chooses the smallest efficient action to reach the current requirement.
```

They complement each other and must not repeat full checklists before every edit.

## Goals

- Make local Codex direct, precise, and reference-driven.
- Use one deterministic Codex ↔ Blockbench MCP connection.
- Eliminate port scanning, alternate server keys, repeated handshakes, and project rediscovery.
- Reduce routine user approvals to one review after each user-visible stage.
- Keep internal technical passes without interrupting the user.
- Use one machine-readable runtime state.
- Reuse one MCP session and persistent checkpoints.
- Restrict tool/document loading to the active stage.
- Apply the one-issue rule only to revision cycles, not initial construction.
- Preserve strict validation and rollback behavior.
- Prevent work that does not contribute to active-stage acceptance criteria.

## Deterministic Local Connection

The Rework branch uses one canonical connection:

```text
Codex server key: blockbench
Transport: Streamable HTTP
URL: http://localhost:3000/bb-mcp
Blockbench plugin ID: mcp
Blockbench instances: one
Codex write sessions: one
Auto-port fallback: disabled
```

One sync command shall validate/install the Codex entry, check the Blockbench process and MCP handshake, verify required common tools, read live runtime/project identity, close the smoke session, write `reports/connection.json`, and update `state.json`.

Codex shall not begin asset preflight or MCP writes until connection readiness is `PASS`.

## User-Visible Stages

1. Geometry
2. Texture
3. Animation, only when required
4. Final Validation

Each completed stage produces previews and waits for user approval or targeted revision instructions. Internal passes do not create separate routine approval gates.

## Scope

### Included

- Replace legacy reference intake requirements with the approved package format.
- Add a single Codex bootstrap entry point.
- Add explicit OpenSpec/Ponytail governance.
- Add a canonical connection profile, connection contract, sync/readiness command, and live runtime-status tool.
- Lock the local runtime to one port, endpoint, and Codex server key.
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

These remain deferred until workflow implementation is functionally complete. Focused local verification remains allowed for changed areas.

### Not Included in the First Pass

- Replacing the MCP server architecture.
- Adding another MCP endpoint.
- Supporting simultaneous Blockbench instances during one asset session.
- Introducing external agent frameworks.
- Rewriting every existing tool.
- Automatically judging visual similarity with an external vision service.
- Adding speculative future features without an active blocker or repeated production need.

## Risks

- Existing Codex installations may need one configuration update and restart.
- Existing Blockbench saved settings may differ, but Rework runtime values are enforced.
- Existing sessions may still use legacy reference packages and must be migrated explicitly.
- Runtime state and Markdown summaries can drift unless generated from one authority.
- Tool-profile enforcement may require later MCP protocol changes.
- Persistent project snapshots may require Blockbench filesystem permission.
- Premature CI can waste time while core workflow contracts are changing.

## Success Criteria

- Codex, Blockbench MCP, and Blockbench share one recorded connection identity.
- One command produces a deterministic readiness report and one safe next action.
- A new reference ZIP starts local work without searching for legacy sheets or connection points.
- Normal startup reads are limited to governance, OpenSpec summary, connection report, state, package core, and active-stage document.
- Geometry, Texture, optional Animation, and Final Validation each have one review gate.
- No approval is requested between internal passes.
- Initial builds support bounded batches; revisions remain local.
- Stage output always contains required preview evidence.
- Final Validation returns PASS, REVISION_REQUIRED, or BLOCKER with evidence.
- Actions unrelated to active-stage acceptance criteria are rejected or deferred.
- Branch `Rework` remains isolated from V1 until explicit final integration approval.
- CI is added only as a final development step after workflow implementation stabilizes.
