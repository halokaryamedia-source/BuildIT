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

`REFERENCE_FIDELITY_GET_TEXTURE_TARGET_HARDENED`

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
  non-empty references resolve exact UUID → exact unique texture ID → exact
  unique name and reject ambiguity/missing before active texture selection. The
  direct paint callers remain unchanged and still call this helper before their
  Undo/Painter operation boundary;
- `get_texture(texture?)` preserves the existing omitted/falsy-reference fallback
  to `Texture.getDefault()`, while explicit non-empty references resolve exact
  UUID → exact unique texture ID → exact unique name and reject ambiguity/missing
  before image data is returned. Shared texture helpers remain unchanged.

These are **source implemented**, not live-proven.

## Latest Texture-Read Finding

Before the latest change:

```text
get_texture(texture?)
├─ omitted / falsy → Texture.getDefault()
└─ explicit → findTextureOrThrow(texture)
              → getProjectTexture(texture)
              → first ID/name/UUID match wins
              → imageContent(target.getDataURL())
```

A duplicate texture name or ID could therefore return image evidence from a
different texture than the caller intended.

Current Local behavior is:

```text
get_texture(texture?)
├─ omitted / falsy → Texture.getDefault()
└─ explicit non-empty reference
    → local read resolver
       ├─ exact UUID → target
       ├─ exact unique texture ID → target
       ├─ exact unique name → target
       └─ ambiguous / missing → ERROR
    → imageContent(target.getDataURL())
```

The tool description now states this target contract. `getTextureParameters`
semantics, default-texture fallback, `findTextureOrThrow()`, `getProjectTexture()`,
paint tools, standalone activation, apply behavior, and PBR/UV behavior were not
changed.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit texture-list identity for `add_texture_group`** in:

```text
mcp/server/tools/texture.ts
```

Current observed path is:

```text
add_texture_group(name, textures?, is_material)
→ Undo.initEdit
→ new TextureGroup(...).add()
→ if textures provided
   → textures.map(getProjectTexture).filter(Boolean)
   → first ID/name/UUID match wins per reference
   → missing individual references are silently dropped
   → if none resolve, ERROR after Undo/group creation
   → resolved textures extend({ group: textureGroup.uuid })
→ Undo.finishEdit
```

This means a duplicate texture name/ID can attach the wrong texture to the new
group, and a partially invalid explicit texture list can succeed after silently
ignoring unresolved references. The all-invalid path also throws only after the
Undo boundary is open and the group has already been added.

Audit requirements:

1. preserve the existing omitted `textures` behavior: creating an empty texture
   group remains valid;
2. when `textures` is provided, resolve every explicit non-empty reference by
   exact UUID first, then exact texture ID, then exact name only when unique;
3. ambiguous or missing provided references must fail as a whole before
   `Undo.initEdit`, group creation, or texture reassignment; do not silently drop
   invalid list entries;
4. preserve current `name`, `is_material`, group creation, and texture assignment
   semantics after successful preflight;
5. keep the change local to `add_texture_group`; do not change shared
   `getProjectTexture()`, PBR create/configure tools, standalone activation,
   `get_texture`, `apply_texture`, paint tools, G3, or create a generic resolver
   framework.

Prefer one complete preflight of the optional texture list before mutation. Do
not expand this slice into a generic transaction framework; later failure after
successful preflight remains a separate recoverability question if source review
proves it material.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error contracts and static diff only.
Actual live paint targeting, standalone activation, `get_texture` reads with
duplicate names/IDs, forced `apply_texture` rollback, and future
`add_texture_group` runtime behavior remain `LOCAL PROOF REQUIRED` until local
Blockbench testing resumes.
