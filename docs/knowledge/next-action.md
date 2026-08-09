# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity by making Cube,
rotation, pivot, hierarchy, targeting, discovery, correction, texture, and
material decisions evidence-backed rather than assumption-driven.

## Current Status

`REFERENCE_FIDELITY_TEXTURE_SELECTION_MATRIX_HARDENED`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred** by current priority.

## Texture Exit Strategy

User-approved direction remains:

```text
finish remaining high-value Texture gaps
→ closing Texture source audit
→ if no critical/major source gap remains, freeze Texture
→ move to Animation
```

Texture is not frozen yet because the resumed closing audit has established one
remaining major selection-state/operation contract gap described below.

## Latest Completed Selection-Matrix Slice

Current Blockbench `IntMatrix` does not expose Local's former calls:

```text
selection.invert()
selection.expand(radius)
selection.contract(radius)
selection.feather(radius)
```

The corrected Local source now follows current Blockbench ownership instead:

### `invert_selection`

Current Blockbench native paint-selection flow uses:

```text
Undo.initSelection({ texture_selection: true })
→ if custom matrix: forEachPixel and flip each matrix value
→ otherwise: setOverride(!override)
→ UVEditor.updateSelectionOutline()
→ Undo.finishSelection("Invert selection")
```

Local now follows that lifecycle and cancels/reverts the selection transaction if
the matrix mutation or finish path fails.

### `expand_selection` / `contract_selection`

A later source check established that these operations **are still supported** by
Blockbench, but through the native `expand_texture_selection` action rather than
`IntMatrix.expand()` / `contract()` methods.

Blockbench's native action performs a pixel-matrix dilation/erosion using
`IntMatrix.forEachPixel()` and `get()`:

- positive radius expands the selection;
- negative radius contracts it;
- the dialog's default corner mode is round;
- contracting a full-selection override converts it into a custom matrix and
  removes the requested border radius.

Local preserves the public `expand_selection` and `contract_selection` actions,
uses the current Blockbench matrix primitives with the native round-radius
behavior, wraps the mutation in `Undo.initSelection({ texture_selection: true })`,
refreshes the selection outline, and cancels/reverts on failure.

### `feather_selection`

No current Blockbench texture-selection feather equivalent was found in the
current source/API surface. The public `feather_selection` action was therefore
removed instead of inventing a new image-processing subsystem.

### Source sequence

```text
b1fab8ff0e89b79751d071b2b9ccb51dd15ab23a
fix: align texture selection actions

ea4339b7ffd975539d4ddf1ca612e9e3a8bdd284
fix: preserve supported texture selection growth

370e2c5463753d934d3c55f49b568adf8b6c3fdf
fix: restore brush preset annotation
```

The first source pass was corrected after current Blockbench source proved that
expand/contract still exist under a different native owner. A full-file write
also changed the unrelated `load_brush_preset` annotation; that drift was
immediately restored. Net source change from the slice starting head is therefore
limited to the intended `texture_selection` contract/runtime path.

## Closing Audit Finding — Remaining Selection State / Operation Parity

One major blocker remains before Texture can be frozen.

Current Local still publicly exposes:

```text
mode = create | add | subtract | intersect
```

Blockbench current source confirms these are real native selection-tool operation
modes, but Local currently destructures `mode` and does not use it. Rectangle and
ellipse therefore always behave as a replacement/create operation regardless of
the requested mode.

The remaining common selection path also still uses stale state mechanics:

```text
select_rectangle
→ selection.clear()
→ assign selection.start_x/start_y/end_x/end_y
→ assign selection.is_custom = false

select_ellipse
→ selection.clear()
→ assign selection.is_custom = true
→ set ellipse pixels

select_all
→ selection.clear()
→ assign start/end pseudo-fields
→ assign selection.is_custom = false

clear_selection
→ selection.clear()
```

Current Blockbench `IntMatrix` does not own `start_x/start_y/end_x/end_y`, and
`is_custom` is a getter derived from `override === null`, not a writable state
field. Native selection state is expressed through `setOverride(...)` and the
pixel matrix.

In addition, these remaining actions currently open:

```text
Undo.initEdit({ textures: [texture], bitmap: true })
```

while current Blockbench paint-selection actions use selection history:

```text
Undo.initSelection({ texture_selection: true })
...
Undo.finishSelection(...)
```

This is one coherent remaining selection-state/operation parity problem, not a
request for broader UV redesign.

## Completed Texture Boundary Kept In Place

Do not reopen already-hardened work unless new evidence directly invalidates it:

- deterministic texture/material/group targeting on proven mutation paths;
- rollback boundaries for core texture/PBR creation/configuration/assignment;
- `create_texture` group/render/fill-layer parity and render observability;
- layer create/delete/duplicate/merge/opacity/blend/move/rename/flatten source
  hardening;
- stale `Texture.flattenLayers()` replacement with Blockbench's native
  disable-layer lifecycle;
- `paint_settings` global-settings shadowing fix and requested-setting preflight;
- selection invert/expand/contract current-API parity and removal of unsupported
  feather selection.

These remain **source implemented**, not live-proven.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- shared `findTextureGroupOrThrow()` hardening: deferred until remaining callers
  can be exhaustively audited.
- shared `layerBlendModeEnum` cleanup: deferred until direct callers can be
  exhaustively audited.
- save/reopen proof: later local validation.
- new UV/paint features: only after a concrete workflow proves a gap.
- broad public-surface reduction: later.

## Next Step

Audit and correct **only the remaining `texture_selection` state/operation-mode
parity** in:

```text
mcp/server/tools/paint.ts
```

Requirements:

1. keep the slice limited to `select_rectangle`, `select_ellipse`, `select_all`,
   `clear_selection`, and their existing `mode` contract; do not reopen
   invert/expand/contract, layer management, `paint_settings`, PBR, or unrelated
   UV/paint tools;
2. replace pseudo-field writes (`start_x/start_y/end_x/end_y` and writable
   `is_custom`) with current `IntMatrix` state primitives;
3. implement or narrow the already-public `create/add/subtract/intersect` mode
   contract according to current Blockbench selection-tool semantics; do not
   silently ignore a supplied mode;
4. use texture-selection Undo (`Undo.initSelection({ texture_selection: true })`)
   and matching finish/cancel behavior for selection-only mutations rather than
   bitmap/model edit history;
5. preserve current rectangle/ellipse/select-all/clear action meanings and result
   text where compatible with current Blockbench behavior;
6. no new selection shapes, no generic selection framework, no broad UV redesign.

After this slice, resume the closing Texture decision. If no additional
critical/major source blocker is proven, freeze Texture and set the single next
step to the Animation source audit.

## Proof Boundary

ChatGPT→GitHub can prove source ownership/control flow/API compatibility and static
diff only. Actual selection geometry, operation-mode combination, visual outline,
Undo/Redo, texture rendering, UV behavior, and persistence remain
`LOCAL PROOF REQUIRED` until local runtime testing resumes.
