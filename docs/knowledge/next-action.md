# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** review and approve the curated Blockbench MCP surface before any more
  runtime changes.
- **Status:** `MCP_SURFACE_CURATION_REVIEW_READY`.
- **Execution now:** ChatGPT → GitHub.
- **Runtime changes during curation:** none.
- **Review owner:** `docs/knowledge/reviews/mcp-surface-curation.md`.

## Main Finding

The primary current problem is **goal/routing clarity, not lack of mutation
APIs**.

Local already has enough primitives to create Cuboids, groups, textures,
animations, screenshots, history, and exports. The normal creation guidance is
still organized around implementation methods (`ui`, `programmatic`, `import`)
and promotes UI automation, `risky_eval`, and `.geo.json` import too close to the
default Bedrock modelling path.

The recommended normal workflow is instead:

```text
orient project
→ targeted state inspection
→ whole-form primary Cuboid pass
→ primary visual gate
→ targeted correction
→ secondary hierarchy / pivots
→ full geometry review
→ Cuboid UV / texture
→ optional animation
→ final structural + visual proof
→ save .bbmodel
```

## Curation Result

Full matrix: `docs/knowledge/reviews/mcp-surface-curation.md`.

### Keep / improve core

- `create_project`, `get_project_info`;
- `list_outline`, `find_elements_by_criteria`;
- `place_cube`, `modify_cube`;
- `add_group` and focused hierarchy operations;
- `undo`, `redo`, `get_undo_stack`;
- `capture_screenshot` as low-level visual evidence;
- core texture create/list/get/apply/activate + only needed paint operations;
- core animation tools only when animation is required;
- `export_model` only when export is actually needed;
- `validator://status` as structural diagnostics, never visual approval.

### Strong additions/recoveries

1. **Targeted authored-element inspector** — exact Cube/group state without
   `risky_eval` or full dumps.
2. **Simplified named multi-view capture** — recover the useful core of Sample
   `capture_bedrock_preview` / Rework `capture_standard_views`: named generic
   views, auto-frame, batch capture, and state restoration.
3. **Simple heterogeneous `modify_cubes_batch`** — several explicit corrections
   in one Undo; do not copy Rework analyzer/anchor/gap machinery.
4. **Cuboid UV reads/writes** — `get_uv_layout` + `set_cube_face_uv`; consider
   `fit_cube_face_uv` later only if real texture work benefits.
5. **Clear hierarchy operations** — group/reparent/update ownership outside
   animation-only semantics when current `bone_rigging` becomes awkward.

### Hide from normal Bedrock path

Keep available only for explicit/diagnostic work:

```text
risky_eval
trigger_action
fill_dialog
emulate_clicks
capture_app_screenshot
from_geo_json
mesh tools
mesh UV tools
armature / vertex weights
PBR / material instances
Hytale tools/resources/prompts
advanced animation tools
advanced paint/preset/layer tools
```

`HIDE` does not mean delete.

### Do not import

- Rework dynamic profiles/stage state/write leases/review machinery;
- Sample companion host/multi-window/auto-port architecture;
- Sample all-in-one `build_bedrock_entity_asset`;
- Sample full Bedrock verifier as modelling authority;
- upstream mandatory `blockbench-use` orchestrator/multi-skill stack.

## Source Lessons

### Rework

Keep the principle of a **small production surface** and recover focused mutation
safety: strict target/group lookup, explicit targets, untextured Geometry support,
and `Undo.cancelEdit()` on failure. Do not restore its production state machine.

### Sample

Most valuable focused ideas:

- named/restored Bedrock preview capture;
- simple batch Cube correction;
- clearer group/reparent operations;
- Cuboid UV inspection/editing;
- direct save/open implementation only as reference if current Local save proof
  fails.

### Upstream `jasonjgardner/blockbench-mcp-project`

Keep:

- filter instead of dumping state;
- meaningful screenshots rather than per-edit captures;
- descriptive naming;
- conceptual separation of modelling/texturing/animation.

Do not restore its mandatory orchestrator, multi-skill stack, generic mesh-first
breadth, or fixed preflight/checkpoint ceremony.

## Completed Corrections Before Curation

- **G1:** Bedrock Entity default/recommended path — source implemented,
  `LOCAL PROOF REQUIRED` later.
- **G2:** bundled Local prompt authority — source implemented,
  `LOCAL PROOF REQUIRED` later.

## Paused Corrections

- **G3 annotation forwarding:** still paused until curated surface direction is
  accepted.
- **G4 screenshot restoration:** hold; likely folds naturally into the simplified
  named multi-view capture work.
- **G5 bone-rigging Undo preflight:** hold; hierarchy curation may change the
  normal owner/path first.

## Recommended First Implementation Slice

### Slice A — Goal-oriented prompt + recommended surface routing

Do this **before adding a new mutation tool**:

- redefine `model_creation_strategy` around the Local modelling stages;
- stop presenting `ui | programmatic | import` as peer default creation paths;
- remove `risky_eval`, UI automation, and `.geo.json` import from the normal
  Bedrock guidance;
- prefer targeted reads and meaningful visual gates;
- keep developer/import escape hatches available only for explicit needs.

Why first: it tests the strongest demonstrated cause using the smallest change.
Existing Local primitives are already sufficient to attempt a much better
whole-form workflow after the guidance is corrected.

## Later Order

After Slice A is proven useful:

```text
B targeted element inspector
→ C simplified named multi-view capture
→ D safer Cuboid mutations + modify_cubes_batch
→ E Cuboid UV tools
→ F save/open proof and only then direct tools if needed
→ resume G3 / remaining proven gaps
```

## Next Step

Review the curation result with the user. If accepted, implement **Slice A only**
using `development-brief` + `mcp-server-development`, with no new mutation tool
in the same change.
