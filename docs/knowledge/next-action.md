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

`REFERENCE_FIDELITY_TEXTURE_LAYER_FLATTEN_HARDENED`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred** by current priority.

## Current Texture Exit Strategy

The user-approved direction is:

```text
finish remaining high-value Texture layer gaps
→ run one closing Texture source audit
→ if no critical/major source gap remains, freeze Texture
→ move the engineering sequence to Animation
```

The remaining layer-management actions have now been source-audited/hardened.
Do not continue low-level Texture work by inertia. The next step is the single
closing Texture source audit.

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
- `texture_layer_management(action="delete_layer")` calls
  `TextureLayer.remove(false)` inside the existing outer edit and rolls back
  removal/update/finish failures;
- `texture_layer_management(action="duplicate_layer")` follows Blockbench's
  native copy lifecycle (`getUndoCopy(true)` → `new TextureLayer` →
  `addForEditing()`), preserves the MCP `"<name> copy"` naming rule, and rolls
  back copy/construction/addition/update/finish failures;
- `texture_layer_management(action="merge_down")` participates only in the outer
  MCP Undo transaction via `mergeDown(false)`, preserving native compositing,
  removal, adjacent selection, and no-lower-layer behavior while rolling back
  merge/update/finish failures;
- `texture_layer_management(action="set_opacity")` preserves the Blockbench-native
  0..100 percentage contract, performs one texture update, and rolls back
  assignment/update/finish failures;
- `texture_layer_management(action="set_blend_mode")` validates against the
  current Blockbench-owned blend-mode values with a file-local schema, performs
  one texture update, and has an action-specific rollback boundary;
- `texture_layer_management(action="move_layer")` treats `target_index` as an
  explicit 0-based final layer index, rejects fractional/negative/out-of-range
  positions, preserves native remove/splice reorder semantics, and rolls back
  validation/reorder/update/finish failures;
- `texture_layer_management(action="rename_layer")` preserves the current
  truthy-name/direct-property contract and now rolls back
  validation/assignment/update/finish failures without changing `create_layer`
  name fallback behavior;
- `texture_layer_management(action="flatten_layers")` no longer calls the stale
  `Texture.flattenLayers()` method. Current Blockbench typing does not declare
  that method and source search produced no definition. Local now follows the
  native Disable Texture Layers lifecycle inside the existing outer MCP edit:
  preserve the already-composited texture canvas, set `layers_enabled = false`,
  clear `selected_layer`, empty the layer list, update the texture once, and
  finish the edit. Failure cancels/reverts the open edit and refreshes
  Canvas/interface state; success clears `UVEditor.vue.layer`, refreshes panels,
  and updates bar conditions.

These are **source implemented**, not live-proven.

## Latest Flatten-Layer Finding

Before the latest change, Local did:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ require texture.layers_enabled
→ texture.flattenLayers()
→ texture.updateChangesAfterEdit()
→ Undo.finishEdit("Layer management: flatten_layers")
```

Current Blockbench `Texture` typing does not expose `flattenLayers()`, and a
current official-source code search for `flattenLayers` produced no definition.
The call was therefore stale/unsupported rather than merely missing rollback.

Blockbench's native `disable_texture_layers` action owns the equivalent flatten-
to-bitmap lifecycle:

```text
Undo.initEdit({ textures: [texture], bitmap: true })
→ texture.layers_enabled = false
→ texture.selected_layer = null
→ texture.layers.empty()
→ Undo.finishEdit("Disable layers on texture")
→ UVEditor.vue.layer = null
→ updateInterfacePanels()
→ BARS.updateConditions()
```

Local already opens a broader outer MCP edit before dispatching the action, so it
does not open another Undo. Current Local behavior is now:

```text
outer Undo.initEdit({ textures: [texture], layers: texture.layers, bitmap: true })
→ if action = flatten_layers
   → try
      → require texture.layers_enabled
      → texture.layers_enabled = false
      → texture.selected_layer = null
      → texture.layers.empty()
      → result = "Flattened all layers"
      → texture.updateChangesAfterEdit()
      → Undo.finishEdit("Layer management: flatten_layers")
   → catch
      → Undo.cancelEdit(true)
      → Canvas.updateAll()
      → updateInterfacePanels()
      → rethrow
   → UVEditor.vue.layer = null
   → updateInterfacePanels()
   → BARS.updateConditions()
   → return result
```

The outer texture+bitmap capture is sufficient to preserve the pre-flatten
layer list, selected-layer identity, and bitmap state for cancellation/Undo at
the source-contract level. Live Blockbench proof is still required before
claiming actual Undo/Redo and visual bitmap fidelity.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited; GitHub code search has been incomplete.
- shared `layerBlendModeEnum` cleanup: deferred until direct callers can be
  exhaustively audited; `texture_layer_management` no longer depends on it.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Run the single **closing Texture source audit** before moving to Animation.

Audit only the current high-value Texture/UV/paint/material execution surface,
with emphasis on concrete failures that could still materially break the
Reference Fidelity workflow:

1. stale/unsupported Blockbench API calls in current Texture/paint/UV paths;
2. explicit mutation targets that can still silently select the wrong
   texture/material/group where that path is materially used by the workflow;
3. public value contracts that are provably incompatible with current Blockbench
   runtime values;
4. mutation paths that open Undo and can leave partial state on a normal failure;
5. missing update/persistence/observability behavior that makes an existing core
   Texture workflow provably unusable.

Do **not** use this audit to chase theoretical completeness, cosmetic cleanup,
minor enum/helper debt, paused shared-helper migration, new UV/paint features, or
broad refactors. Do not perform live Blockbench claims through GitHub.

Closing decision:

```text
no critical/major source gap
→ freeze Texture source-hardening phase
→ set the single next step to Animation source audit

one critical/major source gap proven
→ select exactly one smallest source slice
→ fix it before freezing Texture
```

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/API/Undo/Blockbench-source
structure and static diff only. Actual layer flattening/renaming/selection,
undo/redo, texture rendering, UV/paint behavior, save/reopen persistence, and
viewport appearance remain `LOCAL PROOF REQUIRED` until local Blockbench testing
resumes.
