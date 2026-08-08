# Maintenance Flow

Updated: 2026-08-08

Use Maintenance for bugs, review/cleanup, regressions, stale documentation, and
behavior-preserving refactors.

```text
User reports bug/review/cleanup
→ boot AGENTS → CONTEXT → next-action
→ identify affected owner
→ observe/reproduce or inspect the concrete drift
→ cause/scope grounded?
   ├─ no → UNKNOWN / LOCAL PROOF REQUIRED / user-facing limitation
   └─ yes
      → smallest safe correction
      → targeted regression/proof
      → scope/diff review
      → update only the canonical owner whose state changed
```

## Categories

- **Bug** — observe/reproduce, diagnose cause, correct smallest owner, add only
  useful regression proof.
- **Small refactor** — preserve behavior; prefer deletion/simplification.
- **Cross-module refactor** — use `codebase-design` only when ownership/interface
  boundaries genuinely need it.
- **Documentation cleanup** — update the owning note, remove stale routing/
  duplication, verify affected links.
- **Merge conflict** — resolve only the active conflict and verify both intended
  behaviors.

## Rules

- diagnose before patching;
- do not create feature/abstraction work during cleanup unless required by the
  actual cause;
- do not duplicate notes to avoid editing the current owner;
- historical evidence can remain historical; current routing/status belongs in
  current index/owner notes;
- stable product rules move to foundation only when they are truly durable;
- stop repeating the same failed correction direction without new evidence;
- static proof cannot substitute for live Blockbench/visual proof.

## Maintenance Checklist

- [ ] affected owner identified;
- [ ] stale/duplicate claim removed rather than layered over;
- [ ] change stayed inside requested scope;
- [ ] smallest informative validation performed;
- [ ] dashboard/navigation still points to current owner when paths changed;
- [ ] `next-action.md` updated only if active state changed;
- [ ] runtime/visual uncertainty uses the appropriate root evidence label such as
      `LOCAL PROOF REQUIRED` or `UNKNOWN`.

## Retirement Rule

A note can be retired when its useful content has moved to its canonical owner or
it no longer serves current/historical value. Do not delete historical review
evidence merely because its recommendation was later implemented; classify it in
the Review Index instead.

## Parent

- [Knowledge Dashboard](../index.md)
- [Flow](../flow.md)
- [Documentation Audit](../operations/documentation-audit.md)
