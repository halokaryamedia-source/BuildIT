# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

Do not reconstruct implementation history here; use the linked decision/review/
implementation notes.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, texture, and
material decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_TEXTURE_LAYER_DELETE_UNDO_HARDENED`

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
→ secondary geometry/hierarchy/pivots/textures
```

## Completed Source Boundary

Current Local source already contains:

- Bedrock-first modelling prompt route plus `inspect_model_bounds`,
  `capture_model_views`, and `inspect_element` observation paths;
- strict Cube/hierarchy/rotation/pivot targeting and explicit UUID-based
  correction routing;
- safer group/bone/destructive-element targeting with bounded rollback;
- strict texture identity for material filtering, `apply_texture`, standalone
  activation, paint activation, `get_texture`, texture groups, PBR material
  creation/configuration, and channel assignment;
- rollback boundaries for `apply_texture`, `add_texture_group`,
  `create_pbr_material`, `configure_material`, `assign_texture_channel`, and
  `create_texture` mutation paths;
- strict file-local PBR material/TextureGroup targeting for the proven material
  callers in `texture.ts` without changing the still-un-audited shared
  `findTextureGroupOrThrow()` helper;
- `create_texture(group=...)` resolves a supplied non-empty TextureGroup target
  before Undo and passes the concrete UUID into the Texture constructor;
- `create_texture` applies schema-provided `render_mode` and `render_sides`
  exactly once through the initial Texture constructor;
- `list_textures` remains read-only and exposes `render_mode` and `render_sides`
  while preserving its existing identity/group fields;
- `create_texture(fill_color=..., layer_name=...)` converts the authored bitmap
  into a real named base `TextureLayer` inside the create-texture transaction;
- `texture_layer_management(action="create_layer")` uses one outer Undo
  transaction, calls `activateLayers(false)` when layers are disabled, and rolls
  back activation/construction/addition/update/finish failures;
- `texture_layer_management(action="delete_layer")` now uses the same outer
  transaction model. It keeps the selected-layer requirement, calls
  `TextureLayer.remove(false)` explicitly so Blockbench does not open an internal
  Undo edit, then updates the Texture and finishes the existing MCP edit.
  Failures—including missing selected layer, removal, update, or finish—call
  `Undo.cancelEdit(true)`, refresh Canvas/interface state, and rethrow. Other
  layer-management actions retain their previous path.

These are **source implemented**, not live-proven.

## Latest Delete-Layer Undo Finding

Before the latest change:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ action = delete_layer
   → require TextureLayer.selected
   → layerToDelete.remove()
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: delete_layer")
→ updateInterfacePanels()
```

Blockbench owns `TextureLayer.remove(undo)`:

```text
remove(true)
→ opens internal Undo
→ removes layer / selects adjacent layer
→ updates Texture
→ finishes internal Undo

remove(false)
→ removes layer / selects adjacent layer
→ no internal Undo/update
```

The omitted argument was runtime-falsy but left transaction ownership implicit,
and the MCP outer edit had no rollback if the action failed.

Current Local behavior is:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ if action = delete_layer
   → try
      → require TextureLayer.selected
      → layerToDelete.remove(false)
      → texture.updateChangesAfterEdit()
      → Undo.finishEdit("Layer management: delete_layer")
   → catch
      → Undo.cancelEdit(true)
      → Canvas.updateAll()
      → updateInterfacePanels()
      → rethrow
   → updateInterfacePanels()
   → return delete-layer result
→ remaining actions continue through their previous path
```

The existing Undo scope was retained because it already captures the target
Texture, current layers, and bitmap state. Blockbench's `remove(false)` preserves
its native adjacent-layer selection behavior without creating another Undo edit.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; GitHub code search has been incomplete.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`texture_layer_management(action="duplicate_layer")` Blockbench API
parity and Undo recoverability** in:

```text
mcp/server/tools/paint.ts
```

Current Local path is:

```text
outer Undo.initEdit({
  textures: [texture],
  layers: texture.layers,
  bitmap: true
})
→ action = duplicate_layer
   → require TextureLayer.selected
   → layerToDuplicate = TextureLayer.selected
   → duplicatedLayer = layerToDuplicate.duplicate()
   → duplicatedLayer.name = `${layerToDuplicate.name} copy`
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: duplicate_layer")
→ updateInterfacePanels()
```

Current Blockbench `TextureLayer` source/typing does **not** expose a
`TextureLayer.duplicate()` method. Blockbench's native layer duplicate action is
implemented explicitly as:

```text
original = texture.getActiveLayer()
→ copy = original.getUndoCopy(true)
→ adjust copy name
→ Undo.initEdit({ textures: [texture], bitmap: true })
→ duplicate = new TextureLayer(copy, texture)
→ duplicate.addForEditing()
→ texture.updateLayerChanges(true)
→ Undo.finishEdit("Duplicate layer")
```

So the MCP action currently depends on an unsupported runtime method instead of
the Blockbench-owned duplication lifecycle.

Audit requirements:

1. keep this slice limited to `duplicate_layer`; do not change merge, opacity,
   blend, move, rename, flatten, create, or delete actions;
2. preserve the selected-layer requirement, current MCP naming/result semantics,
   duplicated bitmap/property state, selected duplicated layer behavior, and
   interface refresh;
3. replace the unsupported `.duplicate()` call only with the minimum
   Blockbench-owned sequence grounded by `getUndoCopy(true)`, `new TextureLayer`,
   and `addForEditing()` while participating in the already-open MCP Undo edit;
4. confirm whether the existing outer Undo scope is sufficient and avoid a nested
   Undo transaction;
5. if copy/construction/addition/update/outer finish fails, cancel/revert the open
   edit, refresh required Canvas/interface state, and rethrow;
6. do not redesign layer naming, selection semantics, or add a generic layer
   transaction/clone helper in this slice.

Prefer the same action-specific transaction isolation used by `create_layer` and
`delete_layer`, leaving all remaining action paths unchanged.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/API/Undo/Blockbench-source
structure and static diff only. Actual layer duplication/selection, undo/redo,
texture rendering, and viewport appearance remain `LOCAL PROOF REQUIRED` until
local Blockbench testing resumes.
