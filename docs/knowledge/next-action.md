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

`REFERENCE_FIDELITY_ACTIVATE_TEXTURE_TARGET_HARDENED`

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
- `activate_texture(texture=...)` now requires a non-empty explicit texture
  reference, resolves exact UUID → exact unique texture ID → exact unique name,
  and rejects ambiguous/missing references before active texture selection
  changes. Shared texture helpers remain unchanged.

These are **source implemented**, not live-proven.

## Latest Texture-Activation Finding

Before the latest change:

```text
activate_texture(texture=reference)
→ findTextureOrThrow(reference)
→ getProjectTexture(reference)
→ first ID/name/UUID match wins
→ target.select()
```

A duplicate texture name or ID could therefore activate a different texture than
the caller intended and redirect subsequent paint operations.

Current Local behavior is:

```text
explicit texture reference
→ schema rejects empty string
→ local activation resolver
   ├─ exact UUID → target
   ├─ exact unique texture ID → target
   ├─ exact unique name → target
   └─ ambiguous / missing → ERROR
→ only then target.select()
```

No Undo or generic resolver was introduced. Resolution failure happens before
`target.select()`, so the existing active texture is not intentionally changed by
this tool. `apply_texture`, paint tools, PBR/UV behavior, and shared
`findTextureOrThrow()` / `getProjectTexture()` remain unchanged.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit texture identity at the shared paint activation boundary** in:

```text
mcp/lib/util.ts
mcp/server/tools/paint.ts
```

Current observed paint path is:

```text
paint tool(texture_id?)
→ getAndActivateTexture(texture_id)
   ├─ omitted → current selected texture or default texture
   └─ explicit → getProjectTexture(texture_id)
                 → first ID/name/UUID match wins
                 → texture.select()
→ paint-tool Undo / Painter mutation
```

Direct paint callers currently invoke `getAndActivateTexture()` before their
paint mutation boundary. An ambiguous explicit texture reference can therefore
still select and mutate the wrong texture even though standalone
`activate_texture` is now strict.

Audit requirements:

1. preserve the existing omitted `texture_id` behavior: current selected texture,
   otherwise default texture;
2. for an explicit non-empty `texture_id`, audit UUID → exact unique texture ID
   → exact unique name resolution before selection or paint mutation;
3. ambiguous or missing explicit references must fail before active texture
   selection changes and before the caller opens Undo / starts painting;
4. inspect the direct paint callers first, then harden `getAndActivateTexture`
   only if that shared boundary is proven safe for those callers;
5. do not change `getProjectTexture()` globally, standalone `activate_texture`,
   `apply_texture`, PBR/UV behavior, paint operation semantics, G3, or create a
   generic texture resolver framework.

Prefer the smallest helper-local change if the caller audit proves the helper is
the correct shared owner.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error contracts and static diff only.
Actual live paint targeting with duplicate names/IDs, standalone activation
selection, and forced `apply_texture` rollback remain `LOCAL PROOF REQUIRED`
until local Blockbench testing resumes.
