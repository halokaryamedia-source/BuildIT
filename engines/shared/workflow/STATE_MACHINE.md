# Runtime State Machine

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

Every write checks project UUID, active profile, workflow state, and state revision. `state.json` overrides Markdown summaries.
