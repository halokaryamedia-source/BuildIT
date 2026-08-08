# Next Action

Updated: 2026-08-08

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, and correction decisions evidence-backed
rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_EXPLICIT_SINGLE_CUBE_TARGET_HARDENED`

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
- `modify_cube.id` is now required; editor selection is no longer an implicit
  single-Cube mutation target;
- strict `place_cube` Group targeting, no silent root fallback;
- safer `add_group` parent/default behavior;
- hardened `bone_rigging` preflight/rollback/Group pivot semantics;
- Cube pivot-only correction using `Cube.transferOrigin()`;
- explicit origin requirement for new non-zero-rotation Cubes;
- explicit finite `from/to` requirement for every new `place_cube` element;
- zero→non-zero rotation activation on an existing Cube requires explicit
  `origin` before Undo; already-rotated Cubes may adjust angle while reusing the
  existing pivot.

These are **source implemented**, not live-proven.

## Latest Caller/Compatibility Finding

The removed `modify_cube` selected-Cube fallback had no current Local workflow
owner/caller that required omitted `id`:

- normal Bedrock prompt already required confirmed UUID targeting;
- modelling workflow already requires inspect-before-correction;
- docs manifest derives the public tool contract from `cubeToolDocs`;
- no internal runtime helper depends on `modify_cube` being selection-scoped.

The fallback was explicitly described in source as legacy behavior, so retaining
it would preserve implicit editor state without a proved current need.

## Confirmed Failure Evidence

Prior testing established:

1. Cube existence/attachment can be mistaken for visual progress/approval;
2. rotation can become arbitrary without reference-visible form/motion evidence;
3. pivots/origins can become abstract/distant without a real transform/joint/
   attachment reason.

Target identity is part of the same no-guess boundary: a correct correction
applied to the wrong element is still a failed model mutation.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **shared destructive element target ambiguity** around:

```text
mcp/lib/util.ts → findElementOrThrow(id)
```

Current source evidence:

```text
remove_element    → findElementOrThrow(id)
duplicate_element → findElementOrThrow(id)
rename_element    → findElementOrThrow(id)
```

`findElementOrThrow` currently resolves:

```text
el.uuid === id || el.name === id
```

using the first `.find(...)` match. Therefore duplicate exact names may silently
resolve to one element instead of failing as ambiguous.

Audit requirements:

1. confirm all current callers and whether any depend on first-name-match
   behavior;
2. determine whether the shared helper can safely become UUID-first + unique
   exact-name resolution without affecting unrelated tool semantics;
3. preflight ambiguity before destructive mutation;
4. do not mix texture lookup, mesh-only selection fallback, hierarchy, UV, G3,
   or broad utility refactoring into this slice.

If caller evidence shows the shared helper is too broad to change safely, harden
only the destructive element tools rather than creating a generic resolver
framework.

## Proof Boundary

ChatGPT→GitHub may establish caller/source contracts and static diff only.
Actual Blockbench removal/duplication/rename behavior remains
`LOCAL PROOF REQUIRED` if that runtime path changes.
