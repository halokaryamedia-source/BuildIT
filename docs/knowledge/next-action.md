# Next Action

Updated: 2026-09-01 — Geometry, Texturing, and Animation full-coverage curation completed; remote-safe foundations prepared; public consolidation/build/live proof remains local

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; complete capability decisions belong in `docs/knowledge/mcp-capability-backlog.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

`CROSS_PHASE_FULL_COVERAGE_CURATED_LOCAL_IMPLEMENTATION_REQUIRED`

All three authored phases have now been re-audited against official Blockbench documentation/native source, current Minecraft Bedrock behavior/schema, and surveyed public Blockbench MCP implementations.

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

## Geometry

Normal target: **about 26 tools** including shared Core.

Main consolidation:

```text
modify_cube              → modify_cubes_batch
list_locator_elements    → find_elements_by_criteria
manage_null_object       → manage_locator
bone_rigging             → canonical Geometry owners
select_all_of_type       → leave normal surface

add:
configure_project
measure_geometry
manage_texture_mesh
```

Conditional:

```text
manage_bounding_box
manage_item_display_transform
```

## Texturing

Normal target: **about 10 Texturing-specific + shared Core** (~24 phase total after Core cleanup).

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

Normal target: **about 9 Animation-specific + shared Core** (~23 phase total after Core cleanup).

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
  ordered transitions
  ordered animation links
  blend_transition_curve
  explicit Bedrock short animation/controller keys
  nested/external controller-animation references

verification:
  temporary pose capture restores editor state
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

6. Geometry public consolidation:
   configure_project
   modify_cubes_batch final owner + per-face UV
   universal finder/locator/null ownership
   reparent preserve local/world
   measure_geometry
   manage_texture_mesh
   retire duplicate Geometry routes

7. Texturing public consolidation:
   create_texture dimension/clone contract
   configure_texture + remove_texture
   get_texture scoped/revision/frame reads
   unified paint_texture
   PBR exclusive membership + MER/MERS
   export_texture PNG/TGA
   conditional Texturing owners
   retire normal Painter/material-instance duplicates

8. Animation public consolidation:
   create_animation full native metadata/value coverage
   configure_animation + remove_animation
   unified multi-target manage_keyframes
   remove Timeline-selection/global-clipboard dependency
   move persistent timeline properties to configure_animation
   controller delete/order/blend-curve/key-link corrections
   expand inspect_animation list/focused coverage
   capture_animation_views
   export_animation_file
   conditional playback/Bezier/import/motion validation owners

9. update phase routing / specialist Skills / runtime prompt only after source behavior is ready

10. bun run prompts:build
11. bun run docs:build
12. bun run docs:check
13. bun run verify:mcp

14. review generated + source diff for stale/dead tool names
15. deploy/reload BlockIT

16. LIVE Geometry E2E
17. LIVE Texturing E2E
18. LIVE Animation E2E
19. cross-phase handoff E2E
20. measure Cost to Accepted Result
```

Do not split this into a new roadmap. This file remains the single continuation owner.

---

# Animation-specific live proof matrix

The Animation pass is not complete until live Blockbench proves at least:

```text
create/configure/delete Animation
once / loop / hold
start_delay / loop_delay / override / blend_weight / anim_time_update
entity-relative rotation
Molang transform value round trip
pre/post discontinuity round trip
catmullrom round trip
step export as pre/post
Bezier direct-export rejection
Bezier bake → export-safe output
multi-bone/multi-channel one-Undo mutation
copy/mirror/retime/reverse/bake
particle/sound/instruction effects
controller transition order
controller animation-link order
nested/external controller key
blend_transition_curve
Animation + Controller native codec export
temporary pose capture + full state restoration
```

If controller `variables/remap_curve` persistence cannot be proven, record it explicitly as a native Blockbench representation limitation rather than weakening the verifier.

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
live authoring fixtures PASS
live evidence/restore fixtures PASS
cross-phase handoffs PASS
no known P0/P1 correctness hole
```

Route-1 historical live validation and old experiments remain inactive unless concrete evidence makes them relevant to the current implementation batch.
