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

`REFERENCE_FIDELITY_TEXTURE_LAYER_CREATE_UNDO_HARDENED`

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
- `create_texture(fill_color=..., layer_name=...)` preserves the existing
  requirement that filled textures receive a layer name, converts the authored
  bitmap into a real base `TextureLayer` with `activateLayers(false)`, and names
  that generated layer inside the existing create-texture transaction;
- `texture_layer_management(action="create_layer")` now uses exactly one outer
  Undo transaction. When layers are disabled it calls `activateLayers(false)`,
  then creates/sizes/adds the requested layer, updates the texture, and finishes
  the outer edit. Failures in activation/construction/addition/update/finish call
  `Undo.cancelEdit(true)`, refresh Canvas/interface state, and rethrow. All other
  layer-management actions retain their previous path.

These are **source implemented**, not live-proven.

## Latest Create-Layer Undo Finding

Before the latest change:

```text
getAndActivateTexture(texture_id)
→ Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ action = create_layer
   → if !texture.layers_enabled
      → texture.activateLayers(true)
         → Blockbench opens/finishes another Undo edit
   → new TextureLayer({ name }, texture)
   → setSize(...)
   → addForEditing()
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: create_layer")
→ updateInterfacePanels()
```

This created a nested Undo boundary the first time layers were enabled, and the
outer MCP edit had no rollback if the create path failed.

Blockbench's native `create_empty_layer` path provides direct source evidence for
the intended transaction model:

```text
Undo.initEdit({ textures: [texture], bitmap: true })
→ if !layers_enabled: texture.activateLayers(false)
→ new TextureLayer(...)
→ setSize(...)
→ addForEditing()
→ Undo.finishEdit(...)
```

Current Local behavior keeps the existing MCP Undo scope and isolates only the
`create_layer` action:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ if action = create_layer
   → try
      → if !layers_enabled: texture.activateLayers(false)
      → create/sizes/add layer
      → texture.updateChangesAfterEdit()
      → Undo.finishEdit("Layer management: create_layer")
   → catch
      → Undo.cancelEdit(true)
      → Canvas.updateAll()
      → updateInterfacePanels()
      → rethrow
   → updateInterfacePanels()
   → return create-layer result
→ all other actions continue through the previous switch/common finish path
```

The `layer_name` fallback, layer size, `addForEditing()`, success result, and
interface refresh remain unchanged. No generic transaction framework or changes
to the other layer actions were introduced.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; GitHub code search has been incomplete.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`texture_layer_management(action="delete_layer")` Blockbench API parity
and Undo recoverability** in:

```text
mcp/server/tools/paint.ts
```

Current observed path is:

```text
outer Undo.initEdit({
  textures: [texture],
  layers: texture.layers,
  bitmap: true
})
→ action = delete_layer
   → require TextureLayer.selected
   → layerToDelete = TextureLayer.selected
   → layerToDelete.remove()
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: delete_layer")
→ updateInterfacePanels()
```

Blockbench owns `TextureLayer.remove(undo)`. Source behavior is:

```text
remove(true)
→ opens its own Undo edit
→ removes layer / selects adjacent layer
→ updateChangesAfterEdit()
→ finishes its own Undo edit

remove(false)
→ removes layer / selects adjacent layer
→ no internal Undo/update
```

The current MCP call omits the required `undo` argument. At runtime the omitted
value is falsy, but that is implicit rather than contract-parity, and the outer
MCP edit still has no rollback if removal, texture update, or `Undo.finishEdit`
fails.

Audit requirements:

1. keep this slice limited to the `delete_layer` action; do not change duplicate,
   merge, opacity, blend, move, rename, flatten, or the now-hardened create action;
2. preserve the selected-layer requirement, Blockbench's adjacent-layer selection
   behavior, success result, `texture.updateChangesAfterEdit()`, and
   `updateInterfacePanels()` behavior;
3. confirm the existing outer Undo scope is sufficient for layer removal; if so,
   call `layerToDelete.remove(false)` explicitly so removal participates in the
   already-open MCP transaction and never starts another Undo edit;
4. if removal/update/outer finish fails, call `Undo.cancelEdit(true)`, refresh the
   required Canvas/interface state, and rethrow;
5. do not redesign layer selection, auto-disable layers when one remains, or add
   generic transaction helpers in this slice.

Prefer the same action-specific transaction isolation now used by `create_layer`,
leaving all other action paths unchanged.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/Undo/Blockbench-source structure
and static diff only. Actual layer creation/deletion/selection, undo/redo, texture
rendering, and viewport appearance remain `LOCAL PROOF REQUIRED` until local
Blockbench testing resumes.
