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

`REFERENCE_FIDELITY_ASSIGN_TEXTURE_CHANNEL_ROLLBACK_HARDENED`

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
  and rejects ambiguity/missing references before active texture selection
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
  `Undo.finishEdit` run inside a rollback boundary; failure calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows;
- `assign_texture_channel(texture=...)` requires a non-empty explicit texture
  reference and resolves it exactly once before `Undo.initEdit` by exact UUID →
  exact unique texture ID → exact unique name. Missing or ambiguous references
  fail before mutation. Existing textures occupying the requested channel are
  identified before Undo, excluding the assignment target, and Undo texture
  capture is the unique union of the preflighted target plus every texture whose
  `pbr_channel` will be reset to `"color"`. The exact preflighted target is reused
  for assignment;
- after successful `assign_texture_channel` target/reset preflight, the Undo scope
  remains `texture_groups: [textureGroup]` plus the deduplicated `undoTextures`.
  Channel resets, target assignment, material `saved` mutation, `updateMaterial`,
  and `Undo.finishEdit` now run inside a rollback boundary; failure calls
  `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows. Material target lookup,
  channel enum, reset semantics, return, and success Canvas behavior remain
  unchanged.

These are **source implemented**, not live-proven.

## Latest Assign-Texture-Channel Rollback Finding

Before the latest change, target identity and exact Undo texture capture were
already preflighted, but mutation continued as:

```text
preflighted target + resetTextures + undoTextures
→ Undo.initEdit({ texture_groups: [textureGroup], textures: undoTextures })
→ resetTextures pbr_channel = "color"
→ target.extend({ group: textureGroup.uuid, pbr_channel: channel })
→ saved = false
→ textureGroup.updateMaterial()
→ Undo.finishEdit
→ Canvas.updateAll()
```

A failure after `Undo.initEdit` had no rollback boundary and could leave an open
or partially applied edit.

Current Local behavior is:

```text
preflighted target + resetTextures + undoTextures
→ Undo.initEdit({ texture_groups: [textureGroup], textures: undoTextures })
→ try
   → resetTextures pbr_channel = "color"
   → target.extend({ group: textureGroup.uuid, pbr_channel: channel })
   → saved = false
   → textureGroup.updateMaterial()
   → Undo.finishEdit
→ catch
   → Undo.cancelEdit(true)
   → Canvas.updateAll()
   → rethrow
→ Canvas.updateAll()
→ success return
```

The strict target preflight, `resetTextures`, and deduplicated `undoTextures`
remain unchanged before all mutation. The Undo scope was retained because it
already covers the TextureGroup state, the assignment target, and every existing
channel texture whose `pbr_channel` is reset.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- save/reopen proof: later local validation.
- UV/texture feature additions: only after a concrete workflow proves a gap.
- broad public-surface reduction: after the core fidelity path is proven.

## Next Step

Audit **shared material / TextureGroup target identity** around
`findTextureGroupOrThrow()` in:

```text
mcp/lib/util.ts
mcp/server/tools/texture.ts
```

Current shared resolver is:

```text
findTextureGroupOrThrow(material)
→ TextureGroup.all.find(group.uuid === material || group.name === material)
→ first UUID/name match wins
```

Current material-target callers in `texture.ts` include at least:

```text
configure_material
get_material_info
assign_texture_channel
save_material_config
```

Exact UUID targeting is deterministic, but duplicate TextureGroup/material names
can select the wrong group because name matching is first-match. The public
`material` fields also use plain string schemas rather than an explicit strict
identity contract.

Audit requirements:

1. audit every direct `findTextureGroupOrThrow()` caller affected by a shared
   resolver change before editing the helper;
2. preserve exact UUID precedence and existing successful unique-name behavior;
3. require an explicit material target to resolve exact UUID first, otherwise an
   exact name must be unique; ambiguous names must fail with candidate UUIDs and
   missing references must remain actionable before caller mutation/read effects;
4. determine whether the affected public `material` schemas should require a
   non-empty string so the MCP contract matches the strict resolver; preserve
   each tool's result and mutation semantics otherwise;
5. keep this identity slice separate from PBR channel redesign, material-type
   validation, save behavior changes, or a generic resolver framework.

Prefer hardening the existing shared owner if and only if the caller audit proves
all direct callers require the same UUID → unique-name semantics. Otherwise keep
the correction local to the unsafe caller boundary.

## Proof Boundary

ChatGPT→GitHub may establish source/schema/error/Undo structure and static diff
only. Actual live paint targeting, standalone activation, `get_texture` reads,
forced mutation rollback behavior, PBR material targeting, and future shared
TextureGroup/material target resolution remain `LOCAL PROOF REQUIRED` until
local Blockbench testing resumes.
