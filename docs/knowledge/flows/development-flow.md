# Development Flow

This is the end-to-end path for future work in the repo.

```text
Discovery
→ Scope and decision
→ Implementation
→ Review
→ Validation
→ Release and maintenance
```

## Stage Notes

- **Discovery**: identify the real module, source of truth, current state, and hard limits before touching anything.
- **Scope and decision**: choose the smallest change that solves the actual need and record the reason.
- **Implementation**: keep edits local, modular, and reversible where practical.
- **Review**: check boundaries, coupling, and missing validation, not just syntax.
- **Validation**: verify the result against docs, tests, a reproducible check, or explicit `Needs Validation`.
- **Release and maintenance**: record what changed, what is deferred, and what should be cleaned up later.

## Stage Artifacts

- Discovery: problem note, source links, repo map, and relevant constraints.
- Scope and decision: decision record with one chosen path.
- Implementation: code or doc change in the owning module only.
- Review: review note, findings list, or structural follow-up.
- Validation: test output, proof, screenshot, or explicit `Needs Validation`.
- Release and maintenance: maintenance note, cleanup list, and leftover follow-ups.

## Decision Rules

- Do not start implementation until the source of truth is clear.
- Do not widen scope just because adjacent work is visible.
- Do not mix product policy changes with working-note changes in one record unless they are inseparable.
- Do not write a long plan when a short path is already clear.

## Output Rule

- Every completed task should leave behind the smallest set of notes needed to explain the change later.
- If a note is only temporary, say so in the note title or content.

## Default Skills

- `ponytail`: minimize diff and avoid unnecessary layers.
- choose exactly one matching workspace skill from
  `docs/knowledge/skills/activation-matrix.md`;
- use `evidence-gate` when a claim lacks proof or the same approach fails twice;
- use `code-review` only for an existing change.

## Validation Gate

- Prefer one small verification that matches the actual change.
- If the change is documentation-only, verify links and structure.
- If the change affects runtime behavior, verify with the smallest runnable check available.

## Parent

- [Knowledge Dashboard](../index.md)
- [Flow](../flow.md)
