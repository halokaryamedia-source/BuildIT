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

`REFERENCE_FIDELITY_TEXTURE_LAYER_DUPLICATE_API_HARDENED`

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
- `texture_layer_management(action="delete_layer")` uses the same outer
  transaction model, calls `TextureLayer.remove(false)` explicitly, and rolls
  back removal/update/finish failures;
- `texture_layer_management(action="duplicate_layer")` no longer calls the
  unsupported `TextureLayer.duplicate()` method. It keeps the selected-layer
  requirement, snapshots the source with `getUndoCopy(true)`, preserves the MCP
  naming rule (`"<name> copy"`), constructs a new `TextureLayer` from that copy,
  adds/selects it with `addForEditing()`, updates layer composition, and finishes
  the existing outer MCP edit. Copy/construction/addition/update/finish failures
  cancel/revert the outer Undo edit, refresh Canvas/interface state, and rethrow.
  Remaining layer-management actions retain their previous path.

These are **source implemented**, not live-proven.

## Latest Duplicate-Layer API Finding

Before the latest change:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ action = duplicate_layer
   → require TextureLayer.selected
   → layerToDuplicate.duplicate()
   → rename duplicate to "<name> copy"
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: duplicate_layer")
→ updateInterfacePanels()
```

Current Blockbench `TextureLayer` typing/source does not define `.duplicate()`.
Its native duplicate action is instead:

```text
original.getUndoCopy(true)
→ adjust copied name
→ new TextureLayer(copy, texture)
→ addForEditing()
→ texture.updateLayerChanges(true)
```

Current Local behavior now follows that Blockbench-owned lifecycle inside the
already-open MCP transaction:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ if action = duplicate_layer
   → try
      → require TextureLayer.selected
      → layerCopy = selected.getUndoCopy(true)
      → layerCopy.name = "<original> copy"
      → duplicatedLayer = new TextureLayer(layerCopy, texture)
      → duplicatedLayer.addForEditing()
      → texture.updateLayerChanges(true)
      → Undo.finishEdit("Layer management: duplicate_layer")
   → catch
      → Undo.cancelEdit(true)
      → Canvas.updateAll()
      → updateInterfacePanels()
      → rethrow
   → updateInterfacePanels()
   → return duplicate result
```

`getUndoCopy(true)` carries the source layer bitmap/property state, while
`addForEditing()` preserves the native behavior of inserting above the selected
layer and selecting the duplicate. No nested Undo or generic clone helper was
introduced.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; GitHub code search has been incomplete.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`texture_layer_management(action="merge_down")` Blockbench Undo parity
and recoverability** in:

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
→ action = merge_down
   → require TextureLayer.selected
   → TextureLayer.selected.mergeDown(true)
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: merge_down")
→ updateInterfacePanels()
```

Blockbench owns `TextureLayer.mergeDown(undo = true)`. With `undo=true` it opens
and finishes its own Undo edit around compositing the selected layer into the
layer below, removing the selected layer, and selecting the adjacent layer. With
`undo=false` it performs the same layer/canvas mutation without opening or
finishing an internal Undo edit.

The MCP tool has already opened an outer Undo transaction, so the current
`mergeDown(true)` creates a nested transaction boundary.

Audit requirements:

1. keep this slice limited to `merge_down`; do not change opacity, blend, move,
   rename, flatten, or the hardened create/delete/duplicate actions;
2. preserve the selected-layer requirement, Blockbench merge/compositing and
   adjacent-layer selection behavior, current success result, texture update,
   and interface refresh;
3. confirm the existing outer Undo scope is sufficient for both source/lower
   layer bitmap changes and selected-layer removal; if so, call
   `TextureLayer.selected.mergeDown(false)` so the mutation participates in the
   already-open MCP transaction;
4. if merge/update/outer finish fails, cancel/revert the open edit, refresh the
   required Canvas/interface state, and rethrow;
5. do not redesign the existing no-lower-layer behavior, layer selection rules,
   blend semantics, or add a generic transaction helper in this slice.

Prefer the same action-specific transaction isolation used by create/delete/
duplicate, leaving all remaining action paths unchanged.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/API/Undo/Blockbench-source
structure and static diff only. Actual layer duplication/merge/selection,
undo/redo, texture rendering, and viewport appearance remain
`LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
