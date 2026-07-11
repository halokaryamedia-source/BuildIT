# Runtime State Machine

## Production Workflow

```text
REFERENCE_READY
→ GEOMETRY_IN_PROGRESS
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

Revision states remain inside the affected stage. Broad feedback reopens the earliest affected approved stage. Accepted areas are immutable by default.

## Workspace Lifecycle

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
