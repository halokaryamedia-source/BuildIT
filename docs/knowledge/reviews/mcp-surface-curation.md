# MCP Surface Curation — Bedrock Modelling

**Status:** review ready  
**Date:** 2026-08-08  
**Scope:** tools, resources, and prompts used by the normal Minecraft Bedrock
Entity modelling path.

## Executive Finding

The primary problem is **not a shortage of mutation tools**.

Local already has enough low-level operations to create Cuboids, groups, textures,
animations, screenshots, history entries, and exports. The larger problem is
that the normal MCP surface is still organized around **implementation mechanisms
and upstream capability breadth** instead of the modelling decisions BlockIT
needs to make.

The current creation prompts demonstrate the issue directly:

- `model_creation_ui.md` recommends a tool list and ends in generic UI automation;
- `model_creation_programmatic.md` recommends `risky_eval`;
- `model_creation_geometry.md` and `model_creation_import.md` promote `.geo.json`
  generation/import;
- none of those paths owns the Local whole-form-first visual workflow.

This can make a technically capable agent choose tools before it has a modelling
goal.

The target should instead be:

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

The MCP should make that path easy and safe. It should not become a vision engine,
production director, or automatic modeller.

## Source Comparison

### Local

Strengths:

- enough basic Cuboid/group/history/texture/camera operations already exist;
- `place_cube` already accepts a bounded array;
- targeted search/filter operations exist;
- screenshots, Undo/Redo, validator resources, texture/paint, animation, and export
  already exist.

Weaknesses:

- default prompts are implementation-method-centric;
- read/inspect capability is weaker and less goal-oriented than mutation;
- the raw `nodes` resource is runtime-node-oriented rather than an authored model
  inspector;
- Cuboid-specific UV inspection/editing after placement is incomplete;
- meaningful multi-view visual capture requires manual camera sequencing and has
  state-restoration concerns;
- broad UI/eval/mesh/Hytale/PBR capabilities are too close to the normal Bedrock
  modelling path.

### Rework

Useful ideas:

- expose a smaller stable production tool union instead of every internal tool;
- keep `risky_eval`, UI automation, mesh UV, armature deformation, and PBR out of
  the normal Bedrock Cuboid profile;
- fail a provided missing group instead of silently placing geometry at root;
- allow untextured geometry during Geometry stage;
- prefer explicit mutation targets over accidental selection;
- cancel an opened Undo edit when a mutation fails;
- use bounded heterogeneous edits when they reduce correction churn.

Do **not** recover:

- dynamic stage profiles;
- write leases;
- stage state machines;
- automatic review/approval machinery;
- projection/similarity authority;
- fixed attachment-gap rules;
- giant `apply_cube_transforms` / stage-analyzer coupling.

### Sample

Useful ideas:

- `capture_bedrock_preview`: named generic views, auto-frame, batch capture, and
  restoration of project/texture/selection/animation/camera state;
- `modify_cubes_batch`: heterogeneous explicit Cuboid corrections in one Undo;
- `group_elements` / `reparent_elements` / `translate_group`: clearer hierarchy
  and assembly operations than hiding all structure edits in animation tooling;
- `get_uv_layout`, `set_cube_face_uv`, `fit_cube_face_uv`: real Cuboid UV tools;
- direct `save_project` / `open_project` implementation exists and can be used as
  reference **only if** Local proof shows the existing export/action path is
  insufficient;
- Bedrock prompt explicitly keeps UI automation, `risky_eval`, mesh, armature,
  PBR, and Hytale out of its normal entity path.

Do **not** import wholesale:

- `build_bedrock_entity_asset` end-to-end orchestrator;
- companion host / multi-window / auto-port architecture;
- global anchor system as mandatory modelling policy;
- full custom Bedrock verifier: several checks (for example generic sibling AABB
  overlap warnings) can confuse structural heuristics with visual correctness;
- hierarchy-first / lock-every-number-first prompt rules, which conflict with
  Local whole-form-first policy.

### Upstream `jasonjgardner/blockbench-mcp-project`

Useful ideas:

- filter rather than dump large project state;
- screenshot after meaningful changes, not every edit;
- descriptive naming improves later targeted queries;
- separate modelling, texturing, and animation concerns conceptually.

Do not copy the architecture:

- mandatory `blockbench-use` orchestrator;
- load-all-relevant-skills routing;
- mandatory `list_outline + list_textures` preflight for every mutation;
- fixed checkpoint threshold for 3+ mutations;
- generic cube + mesh/freeform modelling as one default domain;
- tool-catalog-first onboarding as the production modelling workflow.

## Tool Curation Matrix

`HIDE` means **remove from the normal/recommended Bedrock path**, not necessarily
physically delete the capability.

| Capability / current tools | Goal | Decision | Reason / target |
|---|---|---|---|
| `create_project` | Start correct Bedrock Entity project | **KEEP** | G1 corrected default to `bedrock`; local format proof still pending. |
| `get_project_info` | Orient before modelling | **KEEP** | Compact, read-only project identity/format/counts; preferable to eval. |
| project list/select | Identify open project tabs | **MERGE / CONDITIONAL** | `projects` resource already covers listing; explicit selection is useful only for multi-project operations. |
| `list_outline` | Understand hierarchy | **KEEP** | Keep as compact structure map, not mandatory full dump before every write. |
| `find_elements_by_criteria` | Find known target without context dump | **KEEP** | Strong Local/upstream pattern; should be preferred for targeted queries. |
| `get_selection` | Verify selection-scoped operation | **KEEP / CONDITIONAL** | Useful only when a tool intentionally uses selection. |
| **exact authored element inspector** | Read Cube/group transform, parent, size, pivot, visibility, UV/texture refs | **ADD** | Local search returns mainly identity/parent and `nodes` is renderer-node oriented. This is a genuine reasoning/evidence gap. Prefer `inspect_element`/`get_element` over `risky_eval`. |
| `place_cube` | Whole-form primary Cuboid batch | **IMPROVE** | Keep existing array API. Recover Rework safety only: strict provided-group lookup, untextured geometry allowed, preflight where possible, `Undo.cancelEdit()` on failure, structured result. |
| `modify_cube` | Targeted local correction | **IMPROVE** | Prefer explicit target; selection fallback must be intentional. Add rollback-on-failure and per-face UV support rather than more generic transform machinery. |
| `modify_cubes_batch` (Sample idea) | Correct several different primary masses coherently | **ADD** | Small heterogeneous batch is useful after visual findings and avoids several separate Undo steps. Keep it simple: explicit IDs + existing Cube fields + one Undo/cancel-on-failure. Do not copy Rework analyzer/anchor/gap logic. |
| `add_group` | Create purposeful hierarchy | **KEEP + IMPROVE** | Fail missing parent rather than silently creating unexpected root relationships. |
| `group_elements`, `reparent_elements` (Sample ideas) | Organize already-created primary geometry after form is coherent | **ADD / MERGE** | Clear model-structure goal. Prefer these element-domain operations over forcing normal hierarchy work through `bone_rigging`. Preserve world pose when requested. |
| group pivot/update | Refine hierarchy/pivot | **IMPROVE / MERGE** | Capability exists in `bone_rigging`; expose a clearer group-owned update path instead of duplicating animation semantics. |
| `translate_group` (Sample idea) | Move a coherent assembly together | **ADD LATER** | Useful targeted correction, but lower priority than inspection + view evidence + batch Cube correction. |
| duplicate / rename / remove | Local cleanup/correction | **KEEP / CONDITIONAL** | Needed, but not core workflow stages by themselves. Add failure-safe Undo where relevant. |
| `undo`, `redo`, `get_undo_stack` | Recover from demonstrated bad edits | **KEEP** | Clear recovery value. |
| `save_checkpoint` | Mark a risky multi-step boundary | **KEEP / CONDITIONAL** | Do not require based on mutation count. Use only when rollback navigation actually helps. |
| `capture_screenshot` | Capture current targeted visual evidence | **KEEP** | Useful low-level primitive; G4 must restore project state when targeting another project. |
| `set_camera_angle` | Manual camera control | **KEEP / CONDITIONAL** | Low-level fallback; not the normal visual-gate interface. |
| **named multi-view capture** (Sample `capture_bedrock_preview` / Rework `capture_standard_views`) | Primary/full visual gate | **ADD, SIMPLIFIED** | High modelling value. Add generic `front/back/left/right/top/bottom/three_quarter`, auto-frame, optional selected/full bounds, batch views, and complete state restoration. Do not import particles/file-output/large preview framework unless required. |
| `capture_app_screenshot` | UI/debug evidence | **HIDE** | Whole application capture is not normal model-quality evidence. Keep for diagnostics. |
| `create_texture`, `list_textures`, `get_texture`, `apply_texture`, `activate_texture` | Basic texture lifecycle | **KEEP** | Directly useful after geometry passes. |
| `paint_fill_tool`, `draw_shape_tool`, `paint_with_brush`, `eraser_tool` | Pixel texture authoring | **KEEP / CONDITIONAL** | Useful when texture is in scope; prompt should choose only needed operations. |
| brush presets/layers/advanced paint-selection helpers | Advanced texture editing | **HIDE / CONDITIONAL** | Do not flood the default Bedrock modelling surface. |
| **`get_uv_layout`** (Sample/Rework) | Inspect current Cuboid UV map before painting | **ADD** | Strong missing read primitive for Bedrock Cuboid workflow. |
| **`set_cube_face_uv`** (Sample/Rework) | Correct explicit per-face UV after geometry creation | **ADD** | Local mesh UV tools do not solve Cuboid UV editing cleanly. |
| `fit_cube_face_uv` (Sample) | Preserve face aspect / chosen texel density | **ADD LATER / CONDITIONAL** | Useful deterministic helper after explicit UV workflow exists. It must not choose art direction or canvas policy. |
| `tile_cube_face_uv` (Sample) | Repeating material mapping | **HIDE / CONDITIONAL** | Useful for specific material workflows, not a default model requirement. |
| mesh UV tools | Freeform mesh UV | **HIDE** | Not normal Bedrock Cuboid modelling. |
| PBR/material-instance tools | RTX/PBR | **HIDE** | Expose only when user explicitly requests PBR/RTX. |
| mesh modelling tools | Freeform modelling | **HIDE** | Keep upstream capability available for explicit non-Cuboid tasks; do not let it influence normal Bedrock Entity modelling. |
| armature / vertex-weight tools | Mesh deformation | **HIDE** | Not normal Cuboid/bone entity workflow. |
| `create_animation`, `manage_keyframes`, `animation_timeline` | Required animation | **KEEP / CONDITIONAL** | Load/use only when animation is requested. |
| graph editor / batch keyframes / copy-paste | Advanced animation refinement | **HIDE / CONDITIONAL** | Useful only after a concrete animation requirement. |
| `bone_rigging` | Animation rig/hierarchy | **REFOCUS** | Keep for animation-specific rig actions; normal group/reparent/pivot work should have clearer element/group ownership. |
| locators (Sample) | Effect/attachment origin | **HIDE / ADD ONLY WHEN REQUIRED** | Valid Bedrock feature, but outside the current core output unless the requested model needs locators/effects. |
| `export_model`, `list_export_formats` | Non-project export / compile | **KEEP / CONDITIONAL** | Do not make codec discovery ceremony part of every modelling task. |
| direct `save_project` / `open_project` (Sample reference) | Save/reopen `.bbmodel` reliably | **PROOF FIRST** | Product needs save/reopen, but Local may already satisfy it through project codec/actions. Add direct tools only if focused local proof fails. |
| `from_geo_json` | Explicit import/interchange | **HIDE** | Keep as import feature; remove from default creation strategy. It must not become the modelling path. |
| `trigger_action`, `fill_dialog`, `emulate_clicks` | UI escape hatch | **HIDE / DIAGNOSTIC** | Both Rework and Sample keep these out of normal Bedrock flow. Use only when a required capability has no stable API tool. |
| `risky_eval` | Last-resort API/debug escape hatch | **HIDE / DIAGNOSTIC** | Local already has specific reads/writes for normal work. Never recommend it as a modelling strategy. |
| full Sample `build_bedrock_entity_asset` | End-to-end asset orchestration | **DROP FOR LOCAL** | Recreates a large procedure/state engine and encourages locking the whole asset before visual reasoning. |
| full Sample `verify_bedrock_entity_asset` | Broad structural validator | **DO NOT IMPORT WHOLESALE** | Some checks are useful, but generic overlap/hierarchy heuristics can become false modelling authority. Keep native validator + targeted proof instead. |

## Resource Curation Matrix

| Resource | Decision | Reason / target |
|---|---|---|
| `projects://{id}` | **KEEP** | Good read-only project identity, save state, format, paths, counts. |
| `textures://{id}` | **KEEP** | Useful metadata lookup without image/context dump. |
| `nodes://{id}` | **REPLACE / HIDE FROM NORMAL PATH** | Reads `Project.nodes_3d` renderer/runtime nodes and serializes broad internals. It is not a clean authored Cube/group state contract. |
| **`elements://{id}`** or equivalent authored-element read | **ADD** | Type-specific Cube/group read: UUID/name/type/parent, from/to/size/origin/rotation/visibility, group children/pivot, texture/UV summary. This should become the canonical targeted model-state resource or back the `inspect_element` tool. Do not duplicate both unless client ergonomics proves both are needed. |
| `validator://status` | **KEEP** | Good structural diagnostic summary. Explicitly not visual approval. |
| validator checks/errors/warnings split resources | **KEEP / CONDITIONAL** | Useful drill-down after `validator://status` reports a problem; not mandatory reads. |
| `reference_models://{id}` | **HIDE / CONDITIONAL** | Requires plugin and is not the approved Image Reference workflow authority. |
| Hytale resources | **HIDE** | Available only for explicit Hytale work. |

### Resource preference

For normal Bedrock modelling, prefer compact reads:

```text
get_project_info / projects
→ list_outline or find_elements_by_criteria
→ inspect one exact authored element
→ read texture/UV state only when needed
→ validator status only for structural diagnostics
```

Do not use raw renderer-node dumps as a substitute for authored model inspection.

## Prompt Curation Matrix

| Prompt / guidance | Decision | Reason / target |
|---|---|---|
| `model_creation_strategy` | **IMPROVE / REDEFINE** | This should become the normal goal-oriented entrypoint, not a selector for `ui | programmatic | import`. Default Bedrock path should describe modelling stages and recommended capability classes. |
| `bedrock.md` | **IMPROVE** | Keep format identity guidance, but make it the concise Bedrock Entity workflow bridge to whole-form-first modelling. Do not duplicate the full foundation. |
| `model_creation_ui.md` | **REMOVE FROM DEFAULT / RETIRE AS STRATEGY** | Tool catalog + UI escape hatches are not a modelling strategy. |
| `model_creation_programmatic.md` | **REMOVE FROM DEFAULT / DEVELOPER-ONLY** | Promotes `risky_eval`; inappropriate as production modelling guidance. |
| `model_creation_geometry.md` | **REMOVE FROM DEFAULT** | `.geo.json`-first is an import/programmatic path, not Local reference-driven modelling. |
| `model_creation_import.md` | **HIDE / EXPLICIT IMPORT ONLY** | Keep only when the user actually requests GeoJSON import. |
| **Bedrock texture/UV workflow** (Sample ideas) | **ADD, SLIM** | Add conditional prompt focused on Cuboid UV inspection → mapping → texture → visual gate. Reject Sample hierarchy-first/numeric-lock rules and arbitrary fixed canvas examples as policy. |
| animation workflow | **KEEP/ADD ONLY WHEN REQUESTED** | Keep concise: validate hierarchy/pivots → create required clip → inspect exact keyframes → visual animation gate. |
| `blockbench_native_apis` | **DEVELOPER/DIAGNOSTIC** | Plugin-development/runtime fallback information, not modelling guidance. |
| `blockbench_code_eval_safety` | **DEVELOPER/DIAGNOSTIC** | Useful only if eval/native APIs are actually required. |
| Hytale prompts | **HIDE** | Explicit Hytale use only. |
| upstream `blockbench-use` orchestration | **DO NOT IMPORT** | Useful ideas (filter, meaningful screenshots, naming) are already baseline/foundation-level behavior. The mandatory dispatcher/multi-skill stack conflicts with Local architecture. |
| upstream MCP overview | **REFERENCE ONLY** | Useful catalog when investigating capabilities; should not be the production modelling prompt. |

## Recommended Minimal Default Surface

This is the **recommended path**, not yet a hard runtime allowlist.

### 1. Orient / inspect

```text
get_project_info
list_outline
find_elements_by_criteria
inspect_element        # new
get_selection          # only for intentional selection workflow
```

### 2. Primary / correction geometry

```text
create_project
add_group
place_cube
modify_cube
modify_cubes_batch     # new, simple
reparent_elements      # later / when hierarchy needed
undo / redo / get_undo_stack
```

### 3. Visual evidence

```text
capture_model_views    # new simplified named-view + auto-frame + restore
capture_screenshot     # targeted current-view fallback
```

### 4. Texture / UV when required

```text
list_textures / get_texture
create_texture / apply_texture / activate_texture
get_uv_layout          # new
set_cube_face_uv       # new
paint_fill_tool / draw_shape_tool / paint_with_brush / eraser_tool as needed
```

### 5. Animation only when required

```text
create_animation
manage_keyframes
animation_timeline
animation-specific rig helpers only as needed
```

### 6. Finish

```text
validator://status     # structural only, when informative
capture_model_views    # final visual proof
save/reopen existing path first; direct save/open tool only if proof fails
```

## Normal-Path Hidden Surface

Keep available only for explicit/diagnostic use:

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

This reduces decision noise without deleting upstream capability.

## Recommended Implementation Order

### Slice A — Goal-oriented prompt + recommended surface

**Do first.** No new mutation tool yet.

- redefine `model_creation_strategy` around the Local modelling stages;
- stop recommending `ui/programmatic/import` as peer creation strategies;
- remove `risky_eval`, UI automation, and `.geo.json` from the normal Bedrock path;
- explicitly prefer targeted reads (`get_project_info`, `find_elements_by_criteria`)
  and meaningful visual gates;
- retain import/developer escape hatches only for explicit needs.

**Why first:** existing tools are already sufficient to attempt a much better
whole-form path. This tests whether goal/routing clarity is the dominant failure
before adding more APIs.

### Slice B — Targeted authored-element inspection

Add one compact exact-state inspector (tool or resource, not redundant copies by
default). This gives the modeller a reliable way to diagnose one Cube/group
without `risky_eval` or full outline dumps.

### Slice C — Meaningful multi-view visual evidence

Recover the small useful core of Sample `capture_bedrock_preview` / Rework
`capture_standard_views`: named generic views, auto-frame, batch capture, state
restore. Do not import particle/file-output/production-evidence machinery.

### Slice D — Safer / lower-churn geometry correction

- strengthen `place_cube` and `modify_cube` with strict lookup/preflight and
  `Undo.cancelEdit()` on failure;
- add simple `modify_cubes_batch` for heterogeneous explicit corrections;
- optionally add clear reparent/group operations when hierarchy correction proves
  cumbersome.

### Slice E — Bedrock Cuboid UV

Add `get_uv_layout` + `set_cube_face_uv`; then consider `fit_cube_face_uv` only if
real texture work benefits from it.

### Slice F — Save/open proof

Test current project codec/action. Only recover Sample direct `save_project` /
`open_project` if current Local cannot reliably save/reopen `.bbmodel`.

### Then resume G3/G4/G5

Once the intended default surface is clear:

- G3 forward annotations for the curated public surface;
- G4 restore project state for screenshots / incorporate restoration in the new
  visual helper;
- G5 preflight hierarchy mutation before Undo, or supersede the problematic path
  with clearer hierarchy operations.

## Rejected Shortcuts

Do not solve this curation by:

- copying Sample wholesale;
- restoring Rework profiles/stage machinery;
- installing upstream skill stacks into the repository;
- adding an AI visual scorer;
- adding a new all-in-one build tool;
- deleting every broad upstream capability;
- hiding a tool solely because it is advanced;
- creating one tool per workflow stage when existing primitives already serve the
  stage.

## Recommended Decision

Adopt a **goal-oriented recommended surface with diagnostic escape hatches**.

The core product should make the normal Bedrock modelling sequence obvious and
small, while keeping broad upstream Blockbench capability available only when a
specific task proves it is needed.

The first implementation slice should be **Slice A: prompt + recommended-surface
routing**, then evaluate modelling behavior before adding Slice B/C/D/E.
