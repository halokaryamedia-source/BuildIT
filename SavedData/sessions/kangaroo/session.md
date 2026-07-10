# Kangaroo Session Summary

Runtime authority:

```text
SavedData/sessions/kangaroo/state.json
```

This file is a human-readable summary and must not override `state.json`.

## Current Migration Status

- Asset: `kangaroo`
- Target: Bedrock Entity
- New workflow: four-stage Codex local flow
- Current state: `BLOCKED`
- Required next action: migrate or verify the legacy reference package, then run the one-time preflight
- Existing manual edits: preserve until explicitly inventoried
- Legacy MCP session ID: recorded in `state.json`; verify before reuse

## New Stage Order

```text
Geometry
→ Geometry Review
→ Texture
→ Texture Review
→ Animation when required
→ Animation Review
→ Final Validation
→ Final Review
```

## Review Policy

- No approval between internal Geometry passes.
- No approval between UV, Base Texture, and Detail Texture.
- Animation is skipped when not required.
- Each completed user-visible stage must provide preview evidence and wait for approval or targeted revision feedback.

## Reference Migration

The old numbered kangaroo sample package is not automatically treated as an approved build target.

Before the next write:

1. import or verify the approved package format;
2. update `state.json.reference` paths and status;
3. run `reference-package-pass-fail-checklist.md`;
4. run `pre-modelling-gate.md`;
5. save a persistent session-start checkpoint;
6. set `workflow.status` to `IN_PROGRESS` only after all checks pass.

## Recovery Rule

When another Codex chat or computer resumes this asset, read:

1. `Engine/codex/BOOTSTRAP.md`
2. `SavedData/sessions/kangaroo/state.json`
3. approved package core
4. active-stage document

Do not reconstruct progress from legacy phase notes.
