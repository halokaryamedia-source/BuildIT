# Maintenance Flow

Use maintenance for bugs, reviews, cleanup, refactors, and stale documentation.

```text
User reports bug/review/cleanup
→ Boot context and identify the affected area
→ Diagnose cause or inspect the requested change
→ Is the cause and scope proven?
  → No: stop and report Terhenti or Perlu pemeriksaan
  → Yes: make the smallest safe correction
→ Run regression or targeted validation
→ Review the diff and scope
→ Update only changed state, decisions, or ownership
→ Report result and limitations
```

## Maintenance Categories

- **Bug**: reproduce or observe the failure, diagnose the cause, then add the
  smallest regression proof available.
- **Small refactor**: use `ponytail` first and preserve behavior.
- **Cross-module refactor**: inspect the boundary with `codebase-design`; use
  structural review only when the change genuinely crosses modules.
- **Documentation cleanup**: update the owning note, remove stale duplication,
  and verify links.
- **Merge conflict**: resolve only the active conflict and validate both sides.

## Maintenance Rules

- delete obsolete notes instead of duplicating them;
- keep one note per decision;
- keep one map per module;
- move stable rules into `docs/foundation/` only when they are proven;
- keep temporary notes short-lived;
- do not create a new feature, abstraction, or unrelated cleanup during maintenance;
- do not patch a symptom without evidence of the underlying cause;
- stop after repeated failure of the same approach and reassess the scope.

## Maintenance Checklist

- remove stale or duplicated notes;
- merge overlapping pages;
- move proven workflow facts into foundation if they are stable;
- add follow-up links for unresolved work;
- recheck the dashboard after cleanup;
- confirm that the active task snapshot reflects the new state;
- record `Needs Validation` when runtime, visual, or external proof is unavailable.

## Retirement Rule

- A note can be retired when its content has been moved into a more stable page or is no longer needed for active work.

## Parent

- [Knowledge Dashboard](../index.md)
- [Flow](../flow.md)
