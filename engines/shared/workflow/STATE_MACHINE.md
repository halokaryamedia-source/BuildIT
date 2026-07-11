# Runtime State Machine

## Production workflow

```text
REFERENCE_READY
→ GEOMETRY_IN_PROGRESS
→ GEOMETRY_VISUAL_CHECK
→ GEOMETRY_REVIEW
→ GEOMETRY_APPROVED
→ TEXTURE_IN_PROGRESS
→ TEXTURE_REVIEW
→ TEXTURE_APPROVED
→ ANIMATION_IN_PROGRESS or ANIMATION_SKIPPED
→ ANIMATION_REVIEW when required
→ ANIMATION_APPROVED when required
→ FINAL_VALIDATION
→ FINAL_REVIEW
→ DONE
```

`GEOMETRY_VISUAL_CHECK` is an internal gate. It requires current-model image feedback, a recorded visual result, and rotation-safe world-transform validation. It is not a user approval state.

Geometry review requires:

```text
structural_status = PASS
visual_status = PASS
rotation_status = PASS or non-blocking WARNING
evidence_status = CURRENT
```

A structural PASS alone must never transition to `GEOMETRY_REVIEW` or `GEOMETRY_APPROVED`.

## Geometry revision routing

```text
LOCAL_REPAIR
→ GEOMETRY_LOCAL_REPAIR

MAJOR_FORM_REVISION
→ GEOMETRY_VISUAL_REBUILD

REFERENCE_REOPEN
→ return to approved reference workflow

REFERENCE_CONFLICT
→ stop
```

Use `MAJOR_FORM_REVISION` when multiple primary masses or multiple standard views fail. Previous checkpoints remain immutable.

Any Geometry mutation, including a cube rotation, invalidates the current visual report until new affected-view evidence is inspected and recorded.

## Workspace lifecycle

```text
workspace/active/<asset>
→ workflow DONE + final user approval
→ workspace completion promotion
→ workspace/completed/<asset>

workspace/completed/<asset>
→ read-only inspect
or
→ reopen earliest affected stage
→ workspace/active/<asset> revision copy
→ downstream revalidation
→ final user approval
→ atomically replace completed baseline
```

The completed baseline remains immutable while a reopened revision is active.

Every write checks project UUID, active profile, workflow state, state revision, owner session, and MCP session root. `mcp/state.json` overrides Markdown summaries. `workspace.json` is only an index and never overrides project state.
