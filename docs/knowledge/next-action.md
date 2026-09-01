# Next Action

Updated: 2026-09-01 — Geometry, Texturing, Animation, and final Core/cross-phase gap curation completed; remote-safe foundations prepared; public consolidation/build/live proof remains local

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; complete capability decisions belong in `docs/knowledge/mcp-capability-backlog.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

`FULL_MCP_COVERAGE_CURATED_LOCAL_IMPLEMENTATION_REQUIRED`

Geometry, Texturing, Animation, and the final Core/project-lifecycle surface have now been re-audited against official Blockbench documentation/native source, current Minecraft Bedrock behavior/schema, and surveyed public Blockbench MCP implementations.

The design goal is locked:

```text
full relevant Bedrock/Blockbench capability coverage
+
one obvious owner per normal intent
+
conditional/lazy coverage for uncommon editor/native extensions
+
no tool-count parity for its own sake
```

Do **not** restart broad external feature hunting before local implementation unless a concrete missing production capability appears.

## Remote-safe foundations already on `Local`

```text
CORE / PROJECT
mcp/lib/bedrockProjectSemantics.ts

GEOMETRY
mcp/lib/orientedBoxContact.ts
mcp/lib/blockbenchCubeObb.ts

TEXTURING
mcp/lib/facePixelMapping.ts
mcp/lib/textureRevision.ts
mcp/lib/textureFrameMapping.ts
mcp/lib/pbrMaterialMembership.ts

ANIMATION
mcp/lib/animationPreviewState.ts
mcp/lib/bedrockAnimationSemantics.ts
```

Each has targeted regression contracts in `mcp/tests/`.

All are **LOCAL PROOF REQUIRED** until Bun/local/live gates pass.

---

# Locked target surfaces

## Shared Core / project lifecycle

The final post-phase audit adds one normal Core tool:

```text
open_project
```

Required Core extensions:

```text
create_project
  → rectangular logical UV width/height; 128×128 remains default only

configure_project
  → model_identifier
  → logical UV resize policy: keep | rescale_uv
  → authored visible-bounds policy for animated/runtime envelope cases

get_project_info
  → scope=current|all for multi-project safety
```

Conditional Core/session:

```text
manage_project_session
  switch
  close
  reload
```

Normal `.bbmodel` save remains `export_model(codec=project)`; do not add a duplicate `save_project` owner.

## Geometry

Normal target: **about 27 tools** including shared Core.

Main consolidation:

```text
modify_cube              → modify_cubes_batch
list_locator_elements    → find_elements_by_criteria
manage_null_object       → manage_locator
bone_rigging             → canonical Geometry owners
select_all_of_type       → leave normal surface

add/complete:
open_project (shared Core)
configure_project
measure_geometry
manage_texture_mesh
```

Conditional:

```text
manage_bounding_box
manage_item_display_transform
manage_reference_image
```

## Texturing

Normal target: **about 10 Texturing-specific + shared Core** (~25 phase total after final Core addition).

```text
create_texture
configure_texture
remove_texture
get_texture
export_texture
paint_texture
create_pbr_material
configure_material
list_materials
get_material_info
```

Conditional:

```text
manage_texture_layers
manage_texture_group
manage_animated_texture
manage_texture_set
list_material_instances
set_material_instances
```

The existing Painter/UI-state wrappers leave the normal hot surface after replacement behavior is verified.

## Animation

Normal target: **about 9 Animation-specific + shared Core** (~24 phase total after final Core addition).

```text
create_animation
configure_animation
remove_animation
manage_keyframes
manage_animation_effects
manage_animation_controller
inspect_animation
capture_animation_views
export_animation_file
```

Retire from normal Animation after replacement contracts exist:

```text
animation_graph_editor
animation_timeline
batch_keyframe_operations
animation_copy_paste
```

Additional efficiency requirements inside existing owners:

```text
create_animation
  → source_animation clone

manage_animation_controller
  → duplicate_controller
  → duplicate_state

capture_animation_views
  → frames | contact_sheet
```

Conditional:

```text
animation_playback
manage_animation_curves
import_animation_file
validate_animation_motion
```

`bone_rigging` remains Geometry-owned and is dismantled there.

---

# Critical correctness contracts to preserve during local implementation

## Core / project

```text
open_project uses native project/Bedrock codecs
no handwritten .bbmodel parser
replace-current requires explicit unsaved handling
new-tab load returns exact selected project identity
rectangular logical UV allowed
logical UV change requires keep|rescale_uv policy
rescale_uv preflights Box-UV/per-face exactness before Undo
static visible bounds remain native auto-calculated
explicit/expand visible bounds only extend runtime/animation coverage safely
multi-project reads identify selected project explicitly
```

## Geometry

```text
faithful subtree duplication
export-safe identity
per-face UV correction through one Cube owner
world/local reparent semantics
TextureMesh coverage
world-space measurement/contact
one full preflight before Undo
```

## Texturing

```text
no implicit 16×16 blank create
rectangular native texture layouts remain valid
one exact bitmap mutation owner
face-local + animated-frame-local mapping
revision stale-write guard before Undo
one Undo + exact affected RGBA postcondition
exclusive PBR channel membership
normal XOR height
MER vs MERS semantics
PNG/TGA standalone delivery
```

## Animation

```text
full loop modes + native metadata:
  override_previous_animation
  anim_time_update
  blend_weight
  start_delay
  loop_delay

Animation identifiers:
  start with a letter
  letters/numbers/underscore/period only

keyframes:
  multi-bone/multi-channel explicit batch
  numeric + Molang
  pre/post
  linear/catmullrom direct Bedrock
  step via pre/post
  Bezier editor-only → bake before Bedrock delivery

controllers:
  delete lifecycle
  duplicate controller/state
  ordered transitions
  ordered animation links
  blend_transition_curve
  explicit Bedrock short animation/controller keys
  nested/external controller-animation references

verification:
  temporary pose capture restores editor state
  bounded contact-sheet temporal evidence
  optional Molang preview context restored

file delivery:
  native AnimationCodec compile/export
  unbaked Bezier blocks direct Bedrock export
```

Minecraft controller state `variables/remap_curve` is a **conditional Bedrock extension gap** because current native Blockbench state objects do not ordinarily persist it. Do not claim support until local implementation proves import → project save/reopen → Undo → inspect → compile/export round trip. Fail explicitly rather than silently dropping it.

---

# LOCAL_CODE implementation sequence

When the PC/local batch begins:

```text
1. git checkout Local
2. git pull --ff-only
3. cd mcp
4. bun install --frozen-lockfile

5. run smallest prepared pure regressions first:
   Core / Project:
     bedrock-project-semantics
   Geometry:
     oriented-box-contact
     blockbench-cube-obb
   Texturing:
     face-pixel-mapping
     texture-revision
     texture-frame-mapping
     pbr-material-membership
   Animation:
     animation-preview-state
     bedrock-animation-semantics

6. Core/project lifecycle consolidation:
   open_project using native codecs
   create_project rectangular logical UV contract
   configure_project model_identifier + logical UV policy + visible bounds
   get_project_info current/all scope
   conditional manage_project_session

7. Geometry public consolidation:
   modify_cubes_batch final owner + per-face UV
   universal finder/locator/null ownership
   reparent preserve local/world
   measure_geometry
   manage_texture_mesh
   conditional manage_reference_image / bounding box / item display transforms
   retire duplicate Geometry routes

8. Texturing public consolidation:
   create_texture dimension/clone contract
   configure_texture + remove_texture
   get_texture scoped/revision/frame reads
   unified paint_texture
   PBR exclusive membership + MER/MERS
   export_texture PNG/TGA
   conditional Texturing owners
   retire normal Painter/material-instance duplicates

9. Animation public consolidation:
   create_animation full native metadata/value coverage + source_animation clone
   configure_animation + remove_animation
   unified multi-target manage_keyframes
   remove Timeline-selection/global-clipboard dependency
   move persistent timeline properties to configure_animation
   controller delete/order/blend-curve/key-link + duplicate state/controller corrections
   expand inspect_animation list/focused coverage
   capture_animation_views + contact sheet
   export_animation_file
   conditional playback/Bezier/import/motion validation owners

10. update phase routing / specialist Skills / runtime prompt only after source behavior is ready

11. bun run prompts:build
12. bun run docs:build
13. bun run docs:check
14. bun run verify:mcp

15. review generated + source diff for stale/dead tool names
16. deploy/reload BlockIT

17. LIVE open/save/reopen project lifecycle fixture
18. LIVE Geometry E2E
19. LIVE Texturing E2E
20. LIVE Animation E2E
21. cross-phase handoff E2E
22. measure Cost to Accepted Result
```

Do not split this into a new roadmap. This file remains the single continuation owner.

---

# Cross-phase live proof additions

The local/live batch must now also prove:

```text
.bbmodel export → open_project → exact project state survives
Bedrock geometry open path
new-tab vs replace-current unsaved behavior
multi-project scope=current|all identity
64×32 and other rectangular logical UV fixtures
logical UV keep policy
logical UV rescale policy with exact Box-UV/per-face preflight
native static visible-bounds auto behavior
explicit/expanded visible bounds for animation envelope
whole Animation clone
controller/state duplicate
contact-sheet capture + full editor-state restoration
```

---

# Final completion gate

No phase may be called complete from static source alone.

```text
SOURCE/DESIGN READY
≠
LOCAL PASS
≠
LIVE PASS
```

Final completion requires:

```text
public surface matches curated ownership
all generated prompt/docs current
bun run verify:mcp PASS
project open/save/reopen fixture PASS
live authoring fixtures PASS
live evidence/restore fixtures PASS
cross-phase handoffs PASS
no known P0/P1 correctness hole
```

Route-1 historical live validation and old experiments remain inactive unless concrete evidence makes them relevant to the current implementation batch.
