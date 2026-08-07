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

## Review Rules

- Review structure before polishing wording.
- Use `code-review-graph` concepts for large or cross-cutting changes.
- Use `ponytail` when a simpler path can remove work.

## Validation Rules

- Verify the change against the relevant docs or tests.
- If visual or runtime proof is missing, say so plainly.
- Do not upgrade an assumption into a rule without proof.
- If a decision has no validation yet, mark it and keep moving.
