# Next Action

Updated: 2026-09-01 — full MCP coverage curated; capability loading now tiered HOT / LAZY / SPECIALIZED / NICHE; public consolidation/build/live proof remains local

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; complete capability coverage belongs in `docs/knowledge/mcp-capability-backlog.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

`FULL_MCP_COVERAGE_CURATED_TIERED_LOADING_LOCAL_IMPLEMENTATION_REQUIRED`

Geometry, Texturing, Animation, and Core/project lifecycle have been re-audited against official Blockbench documentation/native source, current Minecraft Bedrock behavior/schema, and surveyed public Blockbench MCP implementations.

The design goal is locked:

```text
full relevant Bedrock/Blockbench capability coverage
+
one obvious owner per normal intent
+
load only the capability tier needed by the current workflow
+
no tool-count parity for its own sake
```

Do **not** remove rare capability merely to reduce tool count. Reduce default context by routing it into an intent-loaded tier instead.

Do **not** restart broad external feature hunting before local implementation unless a concrete missing production capability appears.

## Capability Loading Model

Use four loading tiers:

```text
HOT
→ ordinary BlockIT authoring path
→ loaded by default for the active phase

LAZY
→ valid normal Minecraft/Blockbench capability, but not needed by most assets
→ load when prompt/evidence requires it

SPECIALIZED
→ opt-in feature family with a distinct production workflow
→ load only when the user explicitly requests or the current asset already uses that feature

NICHE
→ uncommon editor/integration/format-specific support
→ never load by default; exact intent/evidence required
```

Full coverage remains in `docs/knowledge/mcp-capability-backlog.md`. This tiering changes **context exposure**, not capability ownership.

### Routing invariant

```text
ACTIVE PHASE HOT
+
only the smallest intent-matched LAZY/SPECIALIZED/NICHE pack
```

Never load all optional packs “just in case”.

If a HOT tool discovers an existing specialized artifact state, it may return an explicit continuation hint such as:

```text
CAPABILITY_PACK_REQUIRED
pack: pbr | animated_texture | texture_layers | animation_controller | ...
reason: <observed authored state>
```

The follow-up session/search loads only that pack.

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

# Locked target surfaces and loading tiers

Exact runtime counts must be measured after public consolidation. The lists below define routing intent, not a claim that those schemas are already implemented.

## Shared Core / project lifecycle

### HOT

```text
create_project
open_project
configure_project
get_project_info
export_model
```

Core read/inspection tools remain available to phases according to their existing ownership and routing needs rather than being duplicated into phase-specific owners.

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

### LAZY recovery/support

```text
undo
redo
get_undo_stack
get_selection
```

Normal successful bounded edits should not poll recovery/selection state repeatedly.

### NICHE session management

```text
manage_project_session
  switch
  close
  reload
```

Normal `.bbmodel` save remains `export_model(codec=project)`; do not add a duplicate `save_project` owner.

---

## Geometry

### HOT Geometry

```text
list_outline
find_elements_by_criteria
inspect_element
inspect_model_bounds
capture_model_views
place_cube
modify_cubes_batch
add_group
duplicate_element
remove_element
rename_element
modify_group
reparent_element
measure_geometry
```

Main consolidation:

```text
modify_cube              → modify_cubes_batch
list_locator_elements    → find_elements_by_criteria
manage_null_object       → manage_locator
bone_rigging             → canonical Geometry owners
select_all_of_type       → leave normal surface
```

### LAZY Geometry pack

```text
manage_locator
```

Load for locator/null/attachment/socket/effect-origin/IK-target workflows.

### SPECIALIZED Geometry pack

```text
manage_texture_mesh
```

Load only when native Bedrock TextureMesh is explicitly requested or already authored in the project.

### NICHE Geometry/evidence pack

```text
manage_geometry_reference
manage_bounding_box
manage_item_display_transform
manage_reference_image
```

These remain supported but never belong in ordinary Cube/bone modeling context.

---

## Texturing

### HOT Texturing

Default classic Minecraft/Bedrock texture authoring is intentionally small:

```text
create_texture
configure_texture
remove_texture
get_texture
paint_texture
export_texture
```

`list_textures` remains shared Core because Geometry uses its UV/atlas gate before Texturing handoff.

The existing Painter/UI-state wrappers leave the hot surface after replacement behavior is verified.

### SPECIALIZED PBR pack

PBR is **not** default classic entity texturing. It is an opt-in Texture Set / RTX / Vibrant Visuals style workflow and therefore must not occupy default Texturing context.

Load this pack only for explicit/existing intents such as:

```text
PBR
RTX
Vibrant Visuals
normal map
height map
MER / MERS
metalness
roughness
emissive surface
subsurface
texture_set
```

Pack:

```text
create_pbr_material
configure_material
list_materials
get_material_info
manage_texture_set
```

PBR correctness remains mandatory whenever this pack is loaded:

```text
exclusive channel membership
normal XOR height
MER vs MERS semantics
one PBR correction owner
```

### SPECIALIZED advanced-texture pack

```text
manage_texture_layers
manage_texture_group
manage_animated_texture
```

Load by explicit authored feature state/intent only.

Normal `get_texture` / `paint_texture` remain frame-aware so animated textures do not create a second bitmap authoring model.

### NICHE material-instance pack

```text
list_material_instances
set_material_instances
```

Per-face material-instance metadata is specialized render/resource-pack integration and must not appear in ordinary entity atlas painting context.

---

## Animation

### HOT Animation

```text
create_animation
configure_animation
remove_animation
manage_keyframes
inspect_animation
capture_animation_views
export_animation_file
```

Retire from HOT Animation after replacement contracts exist:

```text
animation_graph_editor
animation_timeline
batch_keyframe_operations
animation_copy_paste
```

Additional efficiency requirements inside existing HOT owners:

```text
create_animation
  → source_animation clone

capture_animation_views
  → frames | contact_sheet
```

### LAZY Animation effects pack

```text
manage_animation_effects
```

Load only for particle/sound/timeline-instruction keyframes.

### LAZY Animation Controller pack

```text
manage_animation_controller
```

Animation Controllers are first-class Bedrock behavior, but simple clips/models do not require them. Load for state-driven/entity-runtime animation composition.

The owner still needs:

```text
delete_controller
duplicate_controller
duplicate_state
ordered transitions
ordered animation links
blend_transition_curve
explicit Bedrock short keys
```

### SPECIALIZED / NICHE Animation pack

```text
animation_playback
manage_animation_curves
import_animation_file
validate_animation_motion
```

`manage_animation_curves` is editor-Bezier workflow and must retain the bake-before-Bedrock-delivery boundary.

`validate_animation_motion` is objective sampled QA, not a subjective quality score.

`bone_rigging` remains Geometry-owned and is dismantled there.

---

# Usage-frequency interpretation

The tiering above is a design heuristic for BlockIT's intended Bedrock Entity workflow, not product telemetry.

Approximate interpretation:

```text
HOT
→ expected in ordinary asset authoring

LAZY
→ normal feature, but only some assets need it

SPECIALIZED
→ separate opt-in production path

NICHE
→ uncommon support/integration/editor workflow
```

Do not promote a rare tool to HOT solely because Blockbench exposes a UI button for it.

Do not demote a capability below full support solely because it is rare.

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
PNG/TGA standalone delivery

when PBR pack is loaded:
  exclusive PBR channel membership
  normal XOR height
  MER vs MERS semantics
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

controllers when controller pack is loaded:
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
   HOT owner consolidation
   modify_cubes_batch final owner + per-face UV
   universal finder/locator/null ownership
   reparent preserve local/world
   measure_geometry
   specialized manage_texture_mesh
   niche reference/bounding/item-display owners
   retire duplicate Geometry routes

8. Texturing public consolidation:
   HOT classic texture surface only
   create_texture dimension/clone contract
   configure_texture + remove_texture
   get_texture scoped/revision/frame reads
   unified paint_texture
   export_texture PNG/TGA
   PBR as SPECIALIZED intent-loaded pack
   advanced texture + material-instance optional packs
   retire normal Painter/material-instance duplicates

9. Animation public consolidation:
   HOT clip/keyframe/inspect/capture/export surface
   create_animation full native metadata/value coverage + source_animation clone
   configure_animation + remove_animation
   unified multi-target manage_keyframes
   remove Timeline-selection/global-clipboard dependency
   effects + controllers as LAZY packs
   controller delete/order/blend-curve/key-link + duplicate state/controller corrections
   expand inspect_animation list/focused coverage
   capture_animation_views + contact sheet
   export_animation_file
   specialized playback/Bezier/import/motion validation pack

10. implement capability-tier routing only after owner schemas/behavior are ready
    HOT = default active-phase load
    LAZY/SPECIALIZED/NICHE = intent/evidence loaded
    do not infer runtime counts from this document

11. update specialist Skills / runtime prompt / phase routing from the measured tiered catalog

12. bun run prompts:build
13. bun run docs:build
14. bun run docs:check
15. bun run verify:mcp

16. review generated + source diff for stale/dead tool names
17. measure actual HOT and full available counts per phase
18. deploy/reload BlockIT

19. LIVE open/save/reopen project lifecycle fixture
20. LIVE Geometry HOT E2E
21. LIVE Geometry optional-pack fixture(s)
22. LIVE Texturing classic HOT E2E
23. LIVE Texturing PBR specialized fixture
24. LIVE Animation HOT E2E
25. LIVE Animation effects/controller lazy fixture(s)
26. cross-phase handoff E2E
27. measure Cost to Accepted Result and context/tool-search cost
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

TIER ROUTING
classic Texture session does not load PBR pack
PBR intent loads only PBR pack + required HOT tools
basic Animation clip does not load controller/effects packs
controller intent loads controller pack without unrelated specialized packs
basic Geometry does not load TextureMesh/reference/item-display packs
full capability remains discoverable when exact intent requires it
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
public ownership matches curated coverage
HOT surface contains only ordinary authoring routes
LAZY/SPECIALIZED/NICHE packs remain discoverable but absent by default
PBR absent from classic Texturing context unless requested/evidenced
all generated prompt/docs current
bun run verify:mcp PASS
project open/save/reopen fixture PASS
live HOT authoring fixtures PASS
representative optional-pack fixtures PASS
live evidence/restore fixtures PASS
cross-phase handoffs PASS
measured context/tool-search cost is lower than untiered surface
no known P0/P1 correctness hole
```

Route-1 historical live validation and old experiments remain inactive unless concrete evidence makes them relevant to the current implementation batch.
