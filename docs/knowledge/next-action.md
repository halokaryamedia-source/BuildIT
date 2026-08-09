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

`REFERENCE_FIDELITY_TEXTURE_LAYER_BLEND_CONTRACT_HARDENED`

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
- `texture_layer_management(action="merge_down")` participates only in the outer
  MCP Undo transaction via `mergeDown(false)`, preserving native compositing,
  removal, adjacent selection, and no-lower-layer behavior while rolling back
  merge/update/finish failures;
- `texture_layer_management(action="set_opacity")` preserves the public and
  Blockbench-native 0..100 percentage contract, performs one texture update, and
  rolls back assignment/update/finish failures;
- `texture_layer_management(action="set_blend_mode")` now validates against the
  current Blockbench-owned `TextureLayer.blend_mode` values before execution:
  `default`, `set_opacity`, `color`, `multiply`, `add`, `darken`, `lighten`,
  `screen`, `overlay`, `difference`, and `alpha_mask`. The schema is local to
  `paint.ts`; the older shared `layerBlendModeEnum` and paint-tool
  `blendModeEnum` remain unchanged because exhaustive shared-caller proof is not
  available through current GitHub indexing.

These are **source implemented**, not live-proven.

## Latest Layer-Blend Contract Finding

Before the latest change, `texture_layer_management.blend_mode` reused shared
`layerBlendModeEnum`:

```text
normal
multiply
screen
overlay
soft_light
hard_light
color_dodge
color_burn
darken
lighten
difference
exclusion
```

Current Blockbench `TextureLayer.blend_mode` values are:

```text
default
set_opacity
color
multiply
add
darken
lighten
screen
overlay
difference
alpha_mask
```

The old MCP contract therefore accepted several unsupported values and rejected
several native values, while execution assigned the supplied value directly to
`TextureLayer.selected.blend_mode`.

A repository code-search attempt for `layerBlendModeEnum` returned:

```text
total_count: 0
incomplete_results: true
```

That result is not exhaustive proof, so the shared owner was deliberately not
changed. Current Local instead uses a file-local schema for the exact
`TextureLayer` contract:

```text
textureLayerBlendModeEnum
→ z.enum([
    "default",
    "set_opacity",
    "color",
    "multiply",
    "add",
    "darken",
    "lighten",
    "screen",
    "overlay",
    "difference",
    "alpha_mask"
  ])

textureLayerManagementParameters.blend_mode
→ textureLayerBlendModeEnum.optional()
```

`mcp/lib/zodObjects.ts::layerBlendModeEnum` remains byte-for-byte unchanged.
Paint-tool blend-mode contracts also remain unchanged. Runtime direct assignment,
result text, Undo scope, and update behavior were intentionally left for a
separate runtime slice.

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

Audit **`texture_layer_management(action="set_blend_mode")` Undo recoverability
and update parity** in:

```text
mcp/server/tools/paint.ts
```

Current post-contract path is:

```text
outer Undo.initEdit({
  textures: [texture],
  layers: texture.layers,
  bitmap: true
})
→ action = set_blend_mode
   → require TextureLayer.selected
   → require validated blend_mode
   → TextureLayer.selected.blend_mode = blend_mode
   → texture.updateChangesAfterEdit()
   → result = `Set layer blend mode to ${blend_mode}`
→ common texture.updateChangesAfterEdit() again
→ Undo.finishEdit("Layer management: set_blend_mode")
→ updateInterfacePanels()
```

The input contract is now correct, but this action still performs the texture
update twice and has no rollback boundary if assignment/update/outer finish
fails.

Audit requirements:

1. keep this slice limited to `set_blend_mode`; do not change move, rename,
   flatten, or the hardened create/delete/duplicate/merge/opacity actions;
2. preserve the new file-local Blockbench-native blend-mode schema, selected-layer
   requirement, direct assignment, result text, and interface refresh;
3. confirm the existing outer Undo scope is sufficient for changing the selected
   layer property; do not add nested Undo or expand capture without source proof;
4. perform only one required texture update and finish the existing MCP edit;
5. if assignment/update/outer finish fails, cancel/revert the open edit, refresh
   required Canvas/interface state, and rethrow;
6. do not change shared blend enums, add aliases/translations, or introduce a
   generic transaction helper in this slice.

Primary semantic owner for the next slice is Blockbench runtime/Undo mechanics.
Use `blockbench-runtime-development` after the mandatory `development-brief`.

## Proof Boundary

ChatGPT→GitHub may establish schema/control-flow/API/Undo/Blockbench-source
structure and static diff only. Actual layer blend rendering, layer selection,
undo/redo, texture rendering, and viewport appearance remain
`LOCAL PROOF REQUIRED` until local Blockbench testing resumes.
