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

`REFERENCE_FIDELITY_CREATE_PBR_ROLLBACK_HARDENED`

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
  `Undo.finishEdit` now run inside a rollback boundary; failure calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows. Optional channels,
  uniform `color_value`, `mer_value`, `subsurface_value`, result shape, and
  success Canvas refresh remain unchanged.

These are **source implemented**, not live-proven.

## Latest PBR Rollback Finding

Before the latest change, channel target identity was already preflighted, but the
post-preflight mutation path was:

```text
preflighted optional channel Texture objects
→ texturesToAdd
→ Undo.initEdit({ texture_groups: [], textures: texturesToAdd })
→ construct TextureGroup
→ mutate material_config values / saved flag
→ textureGroup.add()
→ preflighted textures extend({ group, pbr_channel })
→ textureGroup.updateMaterial()
→ Undo.finishEdit
→ Canvas.updateAll()
```

The Undo capture covered the relevant group-list and texture states, but a failure
at any point after `Undo.initEdit` had no rollback boundary.

Current Local behavior is:

```text
preflighted optional channel Texture objects
→ texturesToAdd
→ construct unadded TextureGroup
→ Undo.initEdit({ texture_groups: [], textures: texturesToAdd })
→ try
   → mutate material_config values / saved flag
   → textureGroup.add()
   → assign preflighted channel textures
   → textureGroup.updateMaterial()
   → Undo.finishEdit
→ catch
   → Undo.cancelEdit(true)
   → Canvas.updateAll()
   → rethrow
→ Canvas.updateAll()
→ success result
```

The strict one-time channel-target preflight remains before all mutation. Existing
Undo capture was retained because Local TextureGroup mutation patterns already use
`texture_groups` for group-list state and exact `textures` for texture field
changes. No PBR uniform-value, result, or success-refresh semantics were changed.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **explicit channel texture identity for `configure_material`** in:

```text
mcp/server/tools/texture.ts
```

Current observed path is:

```text
configure_material(material, optional channel refs / "none", uniform values)
→ findTextureGroupOrThrow(material)
→ current textures = textureGroup.getTextures()
→ Undo.initEdit({ texture_groups: [textureGroup], textures: current textures })
→ for each channel
   ├─ omitted → no channel-target change
   ├─ "none" → remove/reset the existing channel assignment
   └─ explicit reference
       → findTextureOrThrow(reference)
       → getProjectTexture(reference)
       → first ID/name/UUID match wins
       → texture.extend({ group: textureGroup.uuid, pbr_channel: channel })
→ update uniform values / saved flag
→ textureGroup.updateMaterial()
→ Undo.finishEdit
→ Canvas.updateAll()
```

A duplicate texture name/ID can therefore bind the wrong texture to an existing
material. Missing references fail only after Undo has opened, and an explicit
empty string currently behaves like an omitted/falsy field instead of a rejected
explicit target. A newly assigned texture from outside the material is also not
necessarily present in the initial `textures` Undo capture.

Audit requirements:

1. preserve omitted channel fields and the exact `"none"` sentinel behavior;
2. for every provided non-`"none"` channel reference, require a non-empty explicit
   reference and resolve it exactly once before `Undo.initEdit`: exact UUID first,
   then exact texture ID, then exact name only when unique;
3. preflight all supplied non-`"none"` channel references before any mutation;
   ambiguous or missing references must fail before Undo/material changes;
4. reuse the exact preflighted Texture objects after Undo and audit the texture
   capture so it contains the current material textures plus any external
   preflighted assignment targets whose `group`/`pbr_channel` fields can change;
5. preserve current uniform `color_value`, `mer_value`, `subsurface_value`,
   `saved`, material update, return, and success Canvas behavior. Keep the
   existing material target lookup unchanged for this slice;
6. keep the change local to `configure_material`; do not change
   `create_pbr_material`, `assign_texture_channel`, shared texture resolvers,
   `add_texture_group`, standalone activation, `get_texture`, `apply_texture`,
   paint tools, G3, or create a generic resolver/transaction framework.

Prefer the same small local strict-reference semantics already used by the other
texture boundaries. Keep post-preflight `configure_material` rollback as a
separate follow-up unless this identity/capture audit proves it cannot be safely
separated.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error/Undo structure and static diff
only. Actual live paint targeting, standalone activation, `get_texture` reads,
forced `apply_texture` rollback, `add_texture_group` target/rollback behavior,
`create_pbr_material` target/rollback behavior, and future `configure_material`
runtime targeting remain `LOCAL PROOF REQUIRED` until local Blockbench testing
resumes.
