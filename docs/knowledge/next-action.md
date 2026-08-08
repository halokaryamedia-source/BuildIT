# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, and material
reference decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_PAINT_TEXTURE_TARGET_HARDENED`

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
- `inspect_model_bounds` + `capture_model_views` observation;
- `inspect_element` authored-state inspection in
  `mcp/server/tools/element-inspection.ts`;
- strict explicit Cube extents, hierarchy targets, rotation activation, Cube
  pivot semantics, and deterministic initial texture targeting;
- explicit UUID-based single/batch Cube correction routing;
- safer `add_group` + hardened `bone_rigging` targeting/pivot/rollback behavior;
- strict destructive element target resolution plus bounded Undo rollback for
  remove/duplicate/rename;
- strict optional Group scope and fail-closed regex filtering in element discovery;
- `filter_by_material(texture=...)` resolves UUID → exact texture ID → exact
  unique name and rejects ambiguous/missing explicit references;
- `apply_texture(id=..., texture=...)` requires non-empty explicit targets,
  resolves element UUID → exact unique name across Cube/Mesh/Group, resolves
  texture UUID → exact ID → exact unique name, and rejects ambiguity/missing
  before descendant expansion and Undo;
- `apply_texture` keeps selection restoration in an inner `finally` while an
  outer rollback boundary covers texture apply/update, selection restoration,
  and `Undo.finishEdit`; failure calls `Undo.cancelEdit(true)` and rethrows;
- `activate_texture(texture=...)` requires a non-empty explicit texture
  reference, resolves exact UUID → exact unique texture ID → exact unique name,
  and rejects ambiguous/missing references before active texture selection
  changes;
- `getAndActivateTexture(texture_id?)` preserves the existing omitted-reference
  fallback to current selected texture or default texture, while explicit
  non-empty references now resolve exact UUID → exact unique texture ID → exact
  unique name and reject ambiguity/missing before active texture selection. The
  direct paint callers remain unchanged and still call this helper before their
  Undo/Painter operation boundary.

These are **source implemented**, not live-proven.

## Latest Paint-Texture Finding

Before the latest change:

```text
paint tool(texture_id?)
→ getAndActivateTexture(texture_id)
   ├─ omitted → current selected texture or default texture
   └─ explicit → getProjectTexture(texture_id)
                 → first ID/name/UUID match wins
                 → texture.select()
→ paint-tool Undo / Painter operation
```

A duplicate texture name or ID could therefore select the wrong texture before a
paint caller opened its Undo boundary and then mutate/read that unintended
texture.

The direct caller audit found nine `getAndActivateTexture()` calls in
`mcp/server/tools/paint.ts`. The mutating paint callers resolve/activate before
`Undo.initEdit` and Painter mutation; the color-picker caller resolves/activates
before reading from the texture. This makes the helper the smallest shared owner
for explicit paint texture identity without changing paint operation semantics.

Current Local behavior is:

```text
paint tool(texture_id?)
→ getAndActivateTexture(texture_id)
   ├─ omitted → current selected texture or default texture
   └─ explicit non-empty reference
       → exact UUID
       → exact unique texture ID
       → exact unique name
       → ambiguous / missing = ERROR
       → only then texture.select()
→ caller Undo / Painter operation
```

`getProjectTexture()` remains unchanged for unrelated legacy callers. No paint
tool schema, Undo scope, Painter operation, PBR/UV behavior, `apply_texture`, or
standalone `activate_texture` behavior was changed.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit texture identity for read-only `get_texture`** in:

```text
mcp/server/tools/texture.ts
```

Current observed path is:

```text
get_texture(texture?)
├─ omitted / falsy → Texture.getDefault()
└─ explicit → findTextureOrThrow(texture)
              → getProjectTexture(texture)
              → first ID/name/UUID match wins
              → imageContent(target.getDataURL())
```

A duplicate texture name or ID can therefore return image evidence from a
different texture than the caller intended, even though apply/activation/paint
targeting are now strict at their audited boundaries.

Audit requirements:

1. preserve the existing omitted-reference behavior that returns the default
   texture;
2. for an explicit non-empty texture reference, resolve exact UUID first, then
   exact texture ID, then exact name only when unique;
3. ambiguous or missing explicit references must fail before image data is
   returned;
4. keep the change local to `get_texture`; do not change shared
   `findTextureOrThrow()` / `getProjectTexture()` without caller proof;
5. do not change paint tools, standalone `activate_texture`, `apply_texture`,
   PBR/UV behavior, G3, or create a generic texture resolver framework.

Prefer the same small local strict-reference semantics already used by the other
audited texture boundaries rather than widening a shared legacy helper.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error contracts and static diff only.
Actual live paint targeting with duplicate names/IDs, standalone activation
selection, forced `apply_texture` rollback, and future `get_texture` runtime reads
remain `LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
