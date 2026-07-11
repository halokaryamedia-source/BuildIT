# Codex Local Workflow Specification

## Governance

OpenSpec SHALL preserve approved scope and decisions. Ponytail SHALL select the smallest safe action required by the active stage.

Normal context recovery SHALL read:

1. `engines/shared/workflow/GOVERNANCE.md`;
2. active OpenSpec summary;
3. `workspace/active-session.json`;
4. session `state.json`;
5. reference core;
6. active-stage document.

## Reference Intake

The approved package SHALL contain Production Context, one Reference Visual, Geometry, Texturing, Animation, Validation, manifest, and Codex handoff. Legacy numbered sheets SHALL NOT be required.

## Runtime State

`workspace/sessions/<asset>/state.json` SHALL be the runtime authority. Markdown summaries SHALL NOT override it.

## State Sequence

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

Broad feedback SHALL reopen the earliest affected stage. Accepted areas SHALL remain protected by default.

## One-Time Preflight

Before the first write, Codex SHALL verify connection, project UUID, format, UV mode, texture size, exact Geometry profile, reference package, manual edits, and checkpoint readiness. Fresh checks SHALL NOT be repeated.

## Stage Reviews

- Geometry SHALL end with one checkpoint, five standard views, compact validation, and user review.
- Texture SHALL end with one checkpoint, atlas, model views, compact validation, and user review.
- Animation SHALL run only when required and end with hierarchy/pivot/clip evidence and user review.
- Final Validation SHALL execute `VALIDATION.md`, export final outputs, and wait for final approval.

Internal passes SHALL NOT add approval gates. Initial work MAY use bounded batches; revision work SHALL target one named issue or tightly related pair.

## Efficiency

Codex SHALL use the active exact tool profile, structured outputs, direct evidence writes, atomic checkpoints, and `complete_stage`. Unrelated work SHALL be rejected as `DEFERRED_NOT_REQUIRED`.
