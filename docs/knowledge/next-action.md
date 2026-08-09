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

`REFERENCE_FIDELITY_TEXTURE_LAYER_MERGE_UNDO_HARDENED`

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
- `texture_layer_management(action="duplicate_layer")` follows Blockbench's
  native copy lifecycle (`getUndoCopy(true)` → `new TextureLayer` →
  `addForEditing()`), preserves the MCP `"<name> copy"` naming rule, and rolls
  back copy/construction/addition/update/finish failures;
- `texture_layer_management(action="merge_down")` now participates only in the
  existing outer MCP Undo transaction. It keeps the selected-layer requirement,
  calls `TextureLayer.selected.mergeDown(false)` so Blockbench does not open an
  internal edit, preserves native compositing/removal/adjacent selection and the
  existing no-lower-layer behavior, then updates the Texture and finishes the
  outer edit. Merge/update/finish failures cancel/revert the open edit, refresh
  Canvas/interface state, and rethrow. Remaining layer actions retain their
  previous path.

These are **source implemented**, not live-proven.

## Latest Merge-Layer Undo Finding

Before the latest change:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ action = merge_down
   → require TextureLayer.selected
   → TextureLayer.selected.mergeDown(true)
      → Blockbench opens/finishes an internal Undo edit
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: merge_down")
→ updateInterfacePanels()
```

Blockbench owns `TextureLayer.mergeDown(undo = true)`. The method performs the
same compositing, source-layer removal, and adjacent-layer selection with
`undo=false`, but skips its internal Undo/update boundary. If the selected layer
has no lower layer, it preserves the existing early-return behavior.

Current Local behavior is:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ if action = merge_down
   → try
      → require TextureLayer.selected
      → TextureLayer.selected.mergeDown(false)
      → texture.updateChangesAfterEdit()
      → Undo.finishEdit("Layer management: merge_down")
   → catch
      → Undo.cancelEdit(true)
      → Canvas.updateAll()
      → updateInterfacePanels()
      → rethrow
   → updateInterfacePanels()
   → return "Merged layer down"
→ remaining actions continue through their previous path
```

The existing Undo scope was retained because it already captures the target
Texture, all current layers, and bitmap state needed for both the source and
lower layer. No generic transaction helper or merge semantic redesign was added.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; GitHub code search has been incomplete.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **`texture_layer_management(action="set_opacity")` value-contract parity
and Undo recoverability** in:

```text
mcp/server/tools/paint.ts
```

Current Local contract/path is:

```text
opacity schema
→ number 0..100
→ described as layer opacity percentage

outer Undo.initEdit({
  textures: [texture],
  layers: texture.layers,
  bitmap: true
})
→ action = set_opacity
   → require TextureLayer.selected
   → require opacity
   → TextureLayer.selected.opacity = opacity / 100
   → texture.updateChangesAfterEdit()
   → result = `Set layer opacity to ${opacity}%`
→ texture.updateChangesAfterEdit() again
→ Undo.finishEdit("Layer management: set_opacity")
→ updateInterfacePanels()
```

Blockbench's `TextureLayer.opacity` contract is percentage-based, not normalized
0..1. Its native layer-opacity slider is configured as `min: 0, max: 100,
default: 100`, reads `layer.opacity` directly, and assigns the clamped 0..100
value directly back to `layer.opacity`.

The current MCP `/ 100` conversion therefore turns a requested `50%` into a
stored value of `0.5`, which Blockbench interprets as approximately `0.5%`.
The current common path also invokes `updateChangesAfterEdit()` twice for this
action and has no rollback boundary if assignment/update/finish fails.

Audit requirements:

1. keep this slice limited to `set_opacity`; do not change blend, move, rename,
   flatten, or the hardened create/delete/duplicate/merge actions;
2. preserve the public 0..100 percentage input contract, selected-layer and
   required-opacity checks, success result, and interface refresh;
3. confirm direct assignment of the validated percentage to
   `TextureLayer.selected.opacity` matches current Blockbench source/typing;
4. preserve the existing outer Undo scope if sufficient, perform only one
   required texture update, and finish the existing MCP edit without nested Undo;
5. if assignment/update/outer finish fails, cancel/revert the open edit, refresh
   required Canvas/interface state, and rethrow;
6. do not redesign opacity schema/range, layer selection, blend behavior, or add
   a generic transaction helper in this slice.

Prefer the same action-specific transaction isolation used by create/delete/
duplicate/merge, leaving all remaining action paths unchanged.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/API/Undo/Blockbench-source
structure and static diff only. Actual layer opacity rendering, layer selection,
undo/redo, texture rendering, and viewport appearance remain
`LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
