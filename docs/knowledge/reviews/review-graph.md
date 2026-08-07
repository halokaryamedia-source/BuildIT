# Review Graph

Use this note to keep structural review compact.

## Review Questions

- What changed?
- What module boundary moved?
- What depends on this?
- What can be removed?
- What still needs validation?
- What is too coupled?
- What note or rule is now redundant?
- What should become a decision record?

## Good Review Output

- one finding per issue;
- location first;
- impact second;
- fix last.

## Review Labels

- `blocker`: must be fixed before the change can be trusted.
- `needs-follow-up`: should be tracked, but does not block the current change.
- `needs-validation`: the review found a claim without proof.
- `cleanup`: a simplification or deletion is available.

## When to Use Graph Context

- large refactors;
- repeated re-reading of the same area;
- cross-module review;
- maintenance planning after a big change.

## Review Inputs

- changed files;
- affected notes;
- source links;
- test or proof output;
- any unresolved assumptions.

## Parent

- [Knowledge Dashboard](../index.md)
