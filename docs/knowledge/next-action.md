# Next Action

Updated: 2026-08-08

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, and destructive
mutation decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_NAME_PATTERN_FAILURE_HARDENED`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred** by current priority.

## Current Architecture

Canonical decision:

- [Reference Fidelity Loop v1](decisions/reference-fidelity-loop.md)

Current source ownership/status:

- [Implementation Map](implementation-map.md)
- [Foundation Validation Report](../foundation/validation-report.md)

Short loop:

```text
Approved Modelling Brief
→ cross-view consistency
→ coordinate frame + target envelope
→ Primary Form Hypothesis
→ explicit coarse Cube authoring
→ inspect_model_bounds
→ capture_model_views
→ Reference ↔ model comparison
→ GLOBAL rebuild or LOCAL inspect/correct
→ fresh affected evidence
→ secondary geometry/hierarchy/pivots
```

## Completed Source Boundary

Current Local source already contains:

- Bedrock-first modelling prompt route;
- `inspect_model_bounds` + shared rendered-bounds reader;
- `capture_model_views` canonical observations;
- `inspect_element` authored-state inspection;
- `modify_cubes_batch` exact-UUID heterogeneous correction;
- `modify_cube.id` required; editor selection is not an implicit single-Cube
  mutation target;
- strict `place_cube` Group targeting, no silent root fallback;
- safer `add_group` parent/default behavior;
- hardened `bone_rigging` preflight/rollback/Group pivot semantics;
- Cube pivot-only correction using `Cube.transferOrigin()`;
- explicit origin requirement for new non-zero-rotation Cubes;
- explicit finite `from/to` requirement for every new `place_cube` element;
- zero→non-zero rotation activation on an existing Cube requires explicit
  `origin` before Undo;
- `remove_element`, `duplicate_element`, and `rename_element` use UUID-first /
  exact-unique-name destructive target resolution;
- `duplicate_element` recursive Cube/Group/Mesh cloning is wrapped in one
  recoverable Undo boundary;
- `find_elements_by_criteria(parent_group=...)` and
  `select_all_of_type(parent_group=...)` resolve explicit Group scope UUID-first /
  exact-unique-name; ambiguous or missing scopes fail before search or selection
  state changes;
- explicit invalid/rejected `find_elements_by_criteria(name_pattern=...)` now
  fails instead of silently continuing without the requested regex filter.

These are **source implemented**, not live-proven.

## Latest Discovery Finding

Before the latest change, `safeCompileRegex()` treated three explicit failures as
if no regex filter had been requested:

```text
pattern too long
or nested-quantifier safety rejection
or invalid regex syntax
↓
console.warn
↓
return null
↓
search continues without regex
```

Current Local behavior is:

```text
name_pattern omitted / ""
→ no regex filter

explicit valid pattern
→ compiled RegExp

explicit overlong pattern
→ ERROR

explicit nested-quantifier safety rejection
→ ERROR

explicit invalid regex syntax
→ ERROR with compile reason
```

The existing 512-character and catastrophic-backtracking protections remain in
place. Only the failure semantics changed from “warn and broaden search” to
“fail the explicit filter request.”

## Confirmed Failure Evidence

Prior testing established:

1. Cube existence/attachment can be mistaken for visual progress/approval;
2. rotation can become arbitrary without reference-visible form/motion evidence;
3. pivots/origins can become abstract/distant without a real transform/joint/
   attachment reason.

Discovery correctness is part of the same no-guess boundary: an explicit search
constraint must not disappear silently before candidate UUIDs are chosen.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **single-step destructive Undo recoverability** for:

```text
remove_element
rename_element
```

Current source already resolves each target before Undo, but then executes:

```text
Undo.initEdit
→ element.remove() / element.extend(...)
→ Undo.finishEdit
```

without the `try/catch + Undo.cancelEdit(true)` failure boundary now used by
`duplicate_element`, Cube mutation paths, and hardened hierarchy creation.

Audit requirements:

1. confirm the exact mutation/finish failure boundary for remove and rename;
2. preserve existing strict target resolution and operation semantics;
3. if the existing Local Undo contract applies cleanly, wrap each bounded
   operation so a runtime failure after Undo opens cancels/reverts the edit;
4. keep normal Canvas refresh after successful `finishEdit`; refresh after
   rollback only as needed;
5. do not change duplicate logic, discovery filters/scopes, hierarchy, UV,
   texture lookup, G3, or create a generic transaction framework.

If source evidence shows a single-step operation cannot leave meaningful partial
state, `No change required` remains valid; do not add rollback ceremony without a
real failure boundary.

## Proof Boundary

ChatGPT→GitHub may establish source transaction structure and static diff only.
Actual rollback behavior after a forced remove/rename runtime failure remains
`LOCAL PROOF REQUIRED` if those paths are changed.
