# BlockIT Navigator

BlockIT Navigator is the **front-line context and routing layer** for the existing four-tool Gateway.

It is the first machine-facing authority used to orient a modelling task before authoring begins, but it is **not a warehouse that duplicates every source file**.

## Front-line contract

```text
user task
→ Navigator intake
→ resolve live project/runtime/workspace state
→ select exact canonical context
→ declare readiness + blockers
→ choose minimum legal route
→ Gateway capability
→ Runtime
→ Blockbench
```

Navigator collects **decision-relevant state and references** from canonical owners. Exact specialist knowledge, Tool schemas, workflow rules and asset state remain owned by their original sources.

The principle is:

```text
INTAKE EVERYTHING NEEDED TO DECIDE
STORE NOTHING THAT CREATES A SECOND AUTHORITY
SELECT, DON'T SUMMARIZE
```

## What Navigator owns

Navigator owns only navigation concerns:

- current task identity;
- Runtime/Gateway health needed for routing;
- project affinity and current authoring domain;
- current Active Workspace projection when available;
- content-addressed context handles;
- bounded source/capability ownership metadata;
- modelling readiness and blockers;
- continuation delta and invalidation after mutations.

Navigator does **not** own:

- duplicated Tool schemas;
- copied Skill or Prompt prose;
- a second asset-state file;
- visual acceptance decisions;
- modelling, texturing or animation implementation;
- build/install/runtime truth outside the canonical owners.

## Gateway boundary

The public Gateway remains exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

No Navigator-specific public tool family is required.

## Startup / resume

Normal asset authoring begins with one front-line bootstrap when orientation is unknown or materially stale:

```text
status
→ navigation.task_context_id
→ navigation.readiness
→ navigation.project
→ navigation.authoring
→ navigation.workspace
→ navigation.context
→ navigation.blockers
```

`readiness.modelling_start` is one of:

```text
READY
NEEDS_ORIENTATION
BLOCKED
```

It prevents the client from reconstructing readiness by repeatedly reading unrelated sources.

`workspace_state=UNAVAILABLE` does not automatically mean authoring is impossible. A new project may not have an Active Workspace README yet. Runtime/project/domain/context readiness are evaluated independently.

## Routing priority

Navigator follows one direct-first contract:

```text
known capability        → INVOKE_CAPABILITY
unknown capability      → SEARCH_CAPABILITIES
schema uncertainty      → DESCRIBE_CAPABILITY
stale/lost orientation  → STATUS
unresolved source task  → bounded base context, then targeted search
```

Search is discovery fallback, not ceremony. Describe is schema fallback, not ceremony. A known capability with known arguments should invoke directly.

The intended discovery ceiling is four results. The Gateway implementation should enforce this ceiling rather than rely only on caller discipline.

## Context projection

Canonical content is referenced by logical ID + SHA-256 identity. Navigator does not paraphrase canonical Skills/Prompts into a second knowledge base.

A caller can return exact `known_context_ids` to `status`. Unchanged handles are omitted; changed members of the same context family are invalidated and redelivered.

This keeps context reuse safe while reducing repeated instruction delivery.

## Workspace projection

The Active Workspace README remains the asset-state authority.

Navigator reads only the fields needed for navigation:

```text
asset
Current Stage
Geometry
UV Layout
Texturing
Animation
Current next step
Known blocker(s)
```

The projection is cached using file metadata and content-addressed with SHA-256. Navigator never creates a competing workspace state file.

## Mutation continuation

Successful operations return `navigation_delta`.

Ordinary mutations should not force a full `status` reread. Instead, the delta explicitly states what knowledge is no longer safe to reuse:

```text
invalidates.authoring_domains
invalidates.workspace_projection
invalidates.acceptance_gates
```

Example:

```text
manage_cubes succeeds
→ Geometry runtime mutation accepted
→ Geometry workspace/acceptance knowledge becomes stale
→ continue or verify Geometry
→ no automatic full status round-trip
```

Gateway/Runtime authority changes such as phase handoff or project-affinity changes still set `requires_status_refresh=true`.

This separates two different concepts:

```text
runtime orientation changed → refresh status
asset acceptance knowledge changed → invalidate affected knowledge
```

That distinction is required for both correctness and low call overhead.

## Source-development mode

For BlockIT source work:

```text
status(
  task_mode=MCP_DEVELOPMENT,
  task_intent=<concrete problem>
)
```

Navigator resolves a bounded source/specialist/test owner set and excludes unrelated asset workspace context. Ambiguous or unknown intent fails closed as `UNRESOLVED` rather than guessing.

## Current architectural rule

There is one authoritative route:

```text
Codex / AI client
→ Gateway + Navigator
→ Runtime
→ Blockbench
```

Navigator is the front line, not another layer beside the Gateway.

## Efficiency rule

The target remains **Cost to Accepted Result**, not minimum token count in isolation.

Navigator is successful when it reduces avoidable context loading, discovery, readback, stale-state reuse, phase bouncing and recovery while preserving or improving accepted output quality.

Static packet size and tool-call count are diagnostics only. Whole-task efficiency must eventually be demonstrated on representative accepted modelling work.
