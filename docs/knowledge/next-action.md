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

`REFERENCE_FIDELITY_ADD_TEXTURE_GROUP_TARGET_HARDENED`

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
  before image data is returned. Shared texture helpers remain unchanged;
- `add_texture_group(name, textures?, is_material)` preserves omitted `textures`
  as valid empty-group creation. A provided list must now be non-empty and contain
  non-empty references; every reference is preflighted by exact UUID → exact
  unique texture ID → exact unique name before `Undo.initEdit`. Any missing or
  ambiguous entry fails the whole call before group creation or texture
  reassignment. Shared `getProjectTexture()` remains unchanged.

These are **source implemented**, not live-proven.

## Latest Texture-Group Targeting Finding

Before the latest change:

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

A duplicate texture name/ID could attach the wrong texture, a partially invalid
list could silently succeed, and an all-invalid list failed only after mutation
had already started.

Current Local behavior is:

```text
add_texture_group(name, textures?, is_material)
├─ textures omitted → []
└─ textures provided
   → schema requires non-empty list of non-empty references
   → preflight every reference
      ├─ exact UUID → target
      ├─ exact unique texture ID → target
      ├─ exact unique name → target
      └─ ambiguous / missing → ERROR
→ only after complete preflight: Undo.initEdit
→ new TextureGroup(...).add()
→ resolved textures extend({ group: textureGroup.uuid })
→ Undo.finishEdit
```

The public schema/tool description now states the explicit-list contract. The
shared `getProjectTexture()` helper was not changed; its now-unused import was
removed only from `texture.ts`. PBR create/configure tools, standalone activation,
`get_texture`, `apply_texture`, paint tools, and G3 were not changed.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`add_texture_group` mutation/Undo recoverability after successful target
preflight** in:

```text
mcp/server/tools/texture.ts
```

Current post-preflight path is:

```text
resolved textureList
→ Undo.initEdit({ elements: [], outliner: true, collections: [], textures: [] })
→ new TextureGroup(...).add()
→ textureList.forEach(texture.extend({ group: textureGroup.uuid }))
→ Undo.finishEdit
→ Canvas.updateAll
```

There is no rollback boundary after `Undo.initEdit`. If group creation, texture
reassignment, or `Undo.finishEdit` throws, the source currently does not call
`Undo.cancelEdit(true)`. The current Undo scope also does not explicitly include
`texture_groups` or the resolved textures even though those are the states being
mutated, so rollback coverage must be audited rather than assumed.

Audit requirements:

1. preserve the new complete texture-list preflight unchanged and before all
   mutation;
2. determine the minimum correct Undo capture scope for creating the texture
   group and reassigning the already-resolved textures, using existing Local
   TextureGroup mutation patterns as evidence;
3. if any operation fails after `Undo.initEdit`, cancel/revert the open edit and
   rethrow;
4. preserve omitted-texture empty-group behavior, `name`, `is_material`, texture
   assignment, success return, and Canvas refresh semantics;
5. keep the change local to `add_texture_group`; do not change shared texture
   resolvers, PBR create/configure tools, standalone activation, `get_texture`,
   `apply_texture`, paint tools, G3, or create a generic transaction framework.

Prefer the smallest bounded Undo scope + try/catch rollback that matches existing
TextureGroup patterns. Do not expand this into a broad texture transaction
abstraction.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error/Undo structure and static diff
only. Actual live paint targeting, standalone activation, `get_texture` reads,
forced `apply_texture` rollback, and `add_texture_group` target/rollback behavior
remain `LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
