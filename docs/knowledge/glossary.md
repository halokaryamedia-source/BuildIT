# Glossary

Use these terms consistently across the vault.

## Core Terms

- **Foundation**: stable product rules, workflow order, and validation boundary in `docs/foundation/`.
- **Knowledge**: working notes, decisions, module maps, reviews, and maintenance notes in `docs/knowledge/`.
- **SSOT**: single source of truth.
- **Needs Validation**: a claim or capability that is not yet proven in this repo.
- **Source-backed claim**: a claim whose source and evidence directly support
  the exact fact being stated; plausibility and confidence are not evidence.
- **Hard No-Guess Rule**: missing evidence blocks the claim or operation; it
  may not be filled with an inference, fallback, confidence score, or repeated
  attempt.
- **Structurally Validated**: data, hierarchy, dimensions, and transforms pass
  structural checks; visual shape is not yet proven.
- **Visually Reviewed**: the result has been checked with visual evidence.
- **Visual gate**: the internal screenshot-backed decision that records
  `RELEASED`, `NEEDS_REVIEW`, or `BLOCKED`; it is not a similarity score.
- **Completed**: the documented completion criteria are satisfied.
- **Selesai**: user-facing status meaning the requested change and its proof are complete.
- **Perlu pemeriksaan**: user-facing status meaning the change may be correct, but required runtime, visual, or external proof is incomplete.
- **Terhenti**: user-facing status meaning safe progress is blocked by an unknown cause, conflicting requirement, missing source of truth, or unavailable proof.
- **Module**: a bounded area of the repo with a clear responsibility.
- **Decision Record**: a short note that captures context, choice, tradeoffs, and follow-up.

## Repo Terms

- **BlockIT**: the workspace and product framing for the Blockbench + MCP flow.
- **Blockbench**: the modelling application used for `.bbmodel` work.
- **MCP**: Model Context Protocol.
- **Reference**: the current object's visual and production requirements.
- **Reference package**: the files that carry the reference image, views,
  dimensions, priorities, and other available requirements.
- **Reference handoff**: the boundary where object requirements are read from
  the reference and technical work is performed by MCP.
- **Parent-relative position**: an element's position measured from its parent
  group rather than from the model origin.
- **Hierarchy**: the parent-and-child structure of model elements.
- **Pivot**: the point around which an element or group rotates.
- **Transform**: the operations that determine position, rotation, and scale.
- **Ponytail**: the minimal-diff, deletion-first working style.
- **Evidence Gate**: the check that blocks unsupported claims, false
  completion, and repeated failed approaches.

## Parent

- [Knowledge Dashboard](index.md)
