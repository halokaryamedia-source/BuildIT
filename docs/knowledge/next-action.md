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

`REFERENCE_FIDELITY_SCOPED_GROUP_LOOKUP_HARDENED`

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
  `select_all_of_type(parent_group=...)` now resolve explicit Group scope
  UUID-first / exact-unique-name; ambiguous or missing scopes fail before search
  or selection state changes; omitted/empty scope remains no-scope behavior.

These are **source implemented**, not live-proven.

## Latest Discovery Finding

Before the latest change, both scoped element operations used:

```text
Group.all.find(g => g.uuid === parent_group || g.name === parent_group)
```

so duplicate exact Group names could silently scope the operation to the first
match.

Current source uses a small local `resolveOptionalGroupScope()`:

```text
parent_group omitted / empty
→ no scope

exact UUID
→ target Group

exact unique name
→ target Group

duplicate exact name
→ ERROR + candidate UUIDs

missing explicit scope
→ ERROR
```

The resolver intentionally does **not** inherit `add_group`'s special literal
`root` semantics. An explicit `root` string is treated like an ordinary Group
reference, preserving the previous discovery/selection contract rather than
creating a new root-scope feature.

## Confirmed Failure Evidence

Prior testing established:

1. Cube existence/attachment can be mistaken for visual progress/approval;
2. rotation can become arbitrary without reference-visible form/motion evidence;
3. pivots/origins can become abstract/distant without a real transform/joint/
   attachment reason.

Discovery correctness is part of the same no-guess boundary: strict mutation
identity cannot repair reasoning that started from a silently wrong scope.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit `name_pattern` filter failure semantics** in:

```text
mcp/server/tools/element.ts
```

Current source path:

```text
name_pattern supplied
↓
safeCompileRegex(name_pattern)
↓
pattern too long / nested-quantifier safety rejection / invalid regex syntax
↓
console.warn(...)
↓
return null
↓
find_elements_by_criteria continues with no regex filter
```

This can silently broaden an explicitly filtered discovery query and return
candidate elements the caller did not ask for.

Audit requirements:

1. preserve omitted/empty `name_pattern` as “no regex filter”;
2. distinguish an explicit rejected/invalid pattern from an omitted pattern;
3. explicit invalid/rejected pattern should fail clearly instead of broadening
   the search;
4. preserve the existing length and catastrophic-backtracking safety checks;
5. do not change `name_contains`, type/min/max/selection filters, scoped Group
   resolver, destructive tools, texture lookup, UV, G3, or add a regex framework.

Prefer the smallest local contract change: make explicit pattern compilation
return a usable RegExp or throw an actionable error.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error contracts and static diff only.
Actual MCP error delivery for invalid patterns remains `LOCAL PROOF REQUIRED`
until local testing resumes.
