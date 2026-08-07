# Open Spec Guide

This is the lightweight working standard for changes in this repo.

## SSOT Rules

- `docs/foundation/` is the source of truth for product rules.
- `docs/knowledge/` is the source of truth for working decisions and flow.
- Code and docs must not disagree silently.

## When To Write A Decision

- when a choice affects more than one note or module;
- when a workflow changes in a way another agent must understand later;
- when the repo needs a stable rule instead of a chat-only agreement;
- when a tradeoff matters more than the implementation detail.

## Change Rules

- Make the smallest change that solves the verified problem.
- Reuse existing skills, docs, and modules before adding anything new.
- Do not add abstractions without a proven need.
- Keep unverified items labeled `Needs Validation`.
- If a shorter note can say the same thing, use the shorter note.
- Do not turn a temporary workaround into a permanent rule.

## Decision Boundaries

- Product policy changes belong in `docs/foundation/` if they are stable enough.
- Working decisions belong in `docs/knowledge/decisions/`.
- Module ownership changes belong in `docs/knowledge/modules/`.
- Review findings belong in `docs/knowledge/reviews/`.

## Decision Record Format

Use this shape for a new note:

```text
Context
Decision
Why
Tradeoffs
Validation
Follow-up
```

## Full OpenSpec Threshold

The lightweight guide above is the default. Do not open a full OpenSpec change
for ordinary bounded work.

A formal OpenSpec proposal is justified only when at least one real complexity
boundary requires it, such as:

- multiple subsystems must change as one coordinated contract;
- a public MCP API, tool contract, compatibility promise, or migration changes;
- work spans several independently executable phases or developers;
- a durable architectural tradeoff cannot be represented clearly by the
  existing decision log and task snapshot.

Do **not** use the full lifecycle for documentation cleanup, a single tool or
schema fix, one modelling-workflow correction, or speculative future work.

When full OpenSpec is justified, start with the smallest required proposal.
Activate later lifecycle steps only after the change actually reaches them; do
not stack explore, propose, apply, sync, and archive as one default workflow.

## Review Rules

- Review structure before polishing wording.
- Use `code-review-graph` concepts for large or cross-cutting changes.
- Use `ponytail` when a simpler path can remove work.
- Use `grilling` only when the user asks to stress-test a plan, decision, or
  idea; it is not the implementation review step.

## Validation Rules

- Verify the change against the relevant docs or tests.
- If visual or runtime proof is missing, say so plainly.
- Do not upgrade an assumption into a rule without proof.
- If a decision has no validation yet, mark it and keep moving.
