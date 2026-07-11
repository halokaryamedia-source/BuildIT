# Ponytail Execution Scope

## Active Goal

Reduce rework, stale calls, unsafe concurrent edits, oversized evidence payloads, and unverifiable checkpoints without expanding modelling capability or changing the approved four-stage workflow.

## Required Now

```text
Project write lease
→ global mutation guard
→ project/stage/state/profile stale-call checks
→ sandboxed evidence writes
→ omit image payloads when evidence files are written
→ real checkpoint/export SHA-256 metadata
→ matching source-level tests and workflow instructions
```

## Reuse

- existing tool-profile execution wrapper;
- existing session manager;
- existing `atomicFiles` helpers;
- existing `capture_standard_views`;
- existing `save_project_checkpoint` and `export_model`;
- existing production-skill dispatcher.

No parallel MCP server, duplicate evidence tool, duplicate checkpoint tool, or new stage is introduced.

## Stop Condition

Stop this implementation batch when:

1. one composite `manage_project_write_lease` tool exists;
2. normal project/filesystem mutations require the lease;
3. the lease is bound to project UUID, asset, session root, stage, state revision, and tool-profile revision;
4. stage/profile transitions release the lease and require reacquisition after reconnect;
5. standard evidence can write atomically without returning image payloads;
6. checkpoints and final exports return real SHA-256 values;
7. source tests and active workflow docs cover these contracts.

## Deferred Not Required

The following remain `DEFERRED_NOT_REQUIRED` until the first local end-to-end dry run proves a real need:

- transformed world-space bounds refactor;
- deep hierarchy, UV-overlap, pivot, ground-contact, and sampled-animation validation;
- stage-transition crash journal and startup recovery automation;
- MCP resource/prompt profile filtering;
- dynamic skill server or runtime skill-loading enforcement;
- Claude and Ollama adapter completion;
- additional modelling tools;
- visual-similarity scoring;
- CI and merge into `V1`.

These items must not be implemented merely for completeness.
