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

`REFERENCE_FIDELITY_CONFIGURE_MATERIAL_ROLLBACK_HARDENED`

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
  as valid empty-group creation. A provided list must be non-empty and contain
  non-empty references; every reference is preflighted by exact UUID → exact
  unique texture ID → exact unique name before `Undo.initEdit`. Any missing or
  ambiguous entry fails the whole call before group creation or texture
  reassignment;
- after successful `add_texture_group` preflight, Undo captures
  `texture_groups: []` plus the exact resolved `textureList`; group add, texture
  reassignment, and `Undo.finishEdit` run inside a rollback boundary that calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows on failure;
- `create_pbr_material` keeps all channel texture references optional, but a
  supplied reference must be non-empty. Each supplied color/normal/height/MER
  reference is resolved exactly once before `Undo.initEdit` by exact UUID → exact
  unique texture ID → exact unique name. Missing or ambiguous supplied references
  fail before Undo/material mutation, and the exact preflighted Texture objects
  are reused for channel assignment;
- after successful `create_pbr_material` channel preflight, the existing Undo
  capture remains `texture_groups: []` plus the exact `texturesToAdd`. Material
  config mutation, group add, channel assignment, `updateMaterial`, and
  `Undo.finishEdit` run inside a rollback boundary; failure calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows;
- `configure_material` preserves omitted channel fields and the exact `"none"`
  sentinel behavior. Every provided non-`"none"` color/normal/height/MER target
  must be non-empty and is resolved exactly once before `Undo.initEdit` by
  exact UUID → exact unique texture ID → exact unique name. Missing or ambiguous
  references fail before mutation, the preflighted Texture objects are reused for
  assignment, and Undo texture capture includes both the material's current
  textures and any external assignment targets;
- after successful `configure_material` preflight, the existing Undo scope remains
  `texture_groups: [textureGroup]` plus the deduplicated `undoTextures`. Channel
  resets/assignments, uniform config mutation, `updateMaterial`, and
  `Undo.finishEdit` now run inside a rollback boundary; failure calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows. Material target lookup,
  omitted/`"none"` semantics, success return, and success Canvas refresh remain
  unchanged.

These are **source implemented**, not live-proven.

## Latest Configure-Material Rollback Finding

Before the latest change, channel target identity and Undo texture capture were
already preflighted, but mutation continued as:

```text
preflighted channel targets + undoTextures
→ Undo.initEdit({ texture_groups: [textureGroup], textures: undoTextures })
→ apply "none" resets / preflighted channel assignments
→ update uniform values / saved flag
→ textureGroup.updateMaterial()
→ Undo.finishEdit
→ Canvas.updateAll()
```

A failure after `Undo.initEdit` had no rollback boundary and could leave an open
or partially applied edit.

Current Local behavior is:

```text
preflighted channel targets + undoTextures
→ Undo.initEdit({ texture_groups: [textureGroup], textures: undoTextures })
→ try
   → apply "none" resets / preflighted channel assignments
   → update uniform values / saved flag
   → textureGroup.updateMaterial()
   → Undo.finishEdit
→ catch
   → Undo.cancelEdit(true)
   → Canvas.updateAll()
   → rethrow
→ Canvas.updateAll()
→ success return
```

The strict preflight, omitted-field behavior, exact `"none"` sentinel, and
expanded `undoTextures` capture remain unchanged before all mutation. The Undo
scope was retained because it already covers the existing TextureGroup state and
all Texture objects whose group/channel fields can change.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit texture identity and Undo texture capture for
`assign_texture_channel`** in:

```text
mcp/server/tools/texture.ts
```

Current observed path is:

```text
assign_texture_channel(material, texture, channel)
→ findTextureGroupOrThrow(material)
→ findTextureOrThrow(texture)
   → getProjectTexture(texture)
   → first ID/name/UUID match wins
→ Undo.initEdit({ texture_groups: [textureGroup], textures: [targetTexture] })
→ existingTextures = textureGroup.getTextures()
→ existing textures in the requested channel (except target)
   → pbr_channel = "color"
→ targetTexture.extend({ group: textureGroup.uuid, pbr_channel: channel })
→ saved = false
→ textureGroup.updateMaterial()
→ Undo.finishEdit
→ Canvas.updateAll()
```

`findTextureOrThrow()` delegates to the first-match `getProjectTexture()`, so a
duplicate texture name/ID can select the wrong assignment target. The required
`texture` schema also currently accepts an empty string. In addition, Undo only
captures the assignment target even though existing textures already occupying
the requested channel may have their `pbr_channel` reset to `"color"`.

Audit requirements:

1. preserve the current material target lookup and channel enum behavior for this
   slice;
2. require the explicit `texture` reference to be non-empty and resolve it exactly
   once before `Undo.initEdit`: exact UUID first, then exact texture ID, then
   exact name only when unique;
3. ambiguous or missing texture references must fail before Undo/material
   mutation;
4. determine the exact existing textures whose `pbr_channel` can be reset for the
   requested channel, then make Undo capture the unique union of those textures
   plus the preflighted assignment target;
5. reuse the exact preflighted Texture object for assignment after Undo and
   preserve current reset, assignment, `saved`, `updateMaterial`, return, and
   success Canvas semantics;
6. keep the change local to `assign_texture_channel`; do not change material
   target lookup, `configure_material`, `create_pbr_material`, shared texture
   resolvers, `add_texture_group`, standalone activation, `get_texture`,
   `apply_texture`, paint tools, G3, or create a generic resolver/transaction
   framework.

Keep post-preflight `assign_texture_channel` rollback as a separate follow-up
unless this identity/capture audit proves it cannot be safely separated.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error/Undo structure and static diff
only. Actual live paint targeting, standalone activation, `get_texture` reads,
forced `apply_texture` rollback, `add_texture_group` target/rollback behavior,
`create_pbr_material` target/rollback behavior, `configure_material`
target/rollback behavior, and future `assign_texture_channel` runtime behavior
remain `LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
