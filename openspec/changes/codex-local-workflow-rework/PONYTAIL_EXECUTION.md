# Ponytail Execution Scope

## Active Goal

Make completed Blockbench work easy for users to take, preserve enough MCP context for future revisions, and avoid repeated discovery or duplicate project data without expanding modelling capability or changing the approved four-stage workflow.

## Required Now

```text
active/ and completed/ lifecycle
→ one local workspace index
→ user-facing blockbench/ package
→ separate mcp/ internal package
→ completion promotion from validated staging
→ immutable completed baseline during reopen
→ selected-project connection lookup
→ source-level tests and workflow instructions
```

## Reuse

- existing `state.json` and `project.json` concepts;
- existing final export/checkpoint/evidence outputs;
- existing canonical MCP connection profile;
- existing write lease and stale-call guard;
- existing active-stage skills and tool profiles;
- one compact engine-neutral workspace CLI.

No new MCP modelling tool, stage, approval gate, connection key, live-session persistence, duplicate final model, or versioned filename is introduced.

## Separation Rule

```text
blockbench/
= canonical .bbmodel, textures, reference images, approved previews

mcp/
= project/state metadata, technical reference contract, checkpoints, evidence, reports
```

Temporary final-validation staging may exist only under `mcp/final/`. Successful completion promotes it into `blockbench/` and removes the staging copy.

## Stop Condition

Stop this implementation batch when:

1. `workspace/workspace.json` selects one project without folder scanning;
2. active and completed projects use the same `blockbench/` plus `mcp/` layout;
3. one lifecycle command supports init, list, activate, inspect, complete, and reopen;
4. completion requires `DONE`, promotes validated outputs, freezes MCP state, and moves the project to `completed/`;
5. reopen preserves the completed baseline and marks downstream stages for revalidation;
6. Codex readiness/profile scripts resolve `workspace/active/<asset>/mcp` automatically;
7. source tests and active documentation cover the lifecycle and separation.

## Deferred Not Required

The following remain `DEFERRED_NOT_REQUIRED` until local lifecycle and end-to-end dry runs prove a real need:

- Git LFS or remote completed-artifact storage;
- automatic ZIP packaging of `blockbench/`;
- multiple simultaneous selected projects;
- persistent live MCP sessions or write leases;
- transformed world-space bounds refactor;
- deep hierarchy, UV-overlap, pivot, ground-contact, and sampled-animation validation;
- stage-transition crash journal beyond the current atomic replacement safeguards;
- MCP resource/prompt profile filtering;
- dynamic skill server or runtime skill-loading enforcement;
- Claude and Ollama adapter completion;
- additional modelling tools;
- visual-similarity scoring;
- CI and merge into `V1`.

These items must not be implemented merely for completeness.
