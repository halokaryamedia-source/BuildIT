# Next Action

Updated: 2026-09-01 — BASE / EXTENDED capability design curated; Route 1 image+GLB workflow selected and fully prepared for local test

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; complete capability coverage belongs in `docs/knowledge/mcp-capability-backlog.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

```text
CAPABILITY ROUTING DESIGN:
FULL_MCP_COVERAGE_CURATED_BASE_EXTENDED_LOCAL_IMPLEMENTATION_REQUIRED

ROUTE 1:
IMAGE_GLB_SELECTED
ALIGNMENT_SOURCE_PREPARED
LOCAL_TEST_ONLY_NEXT
```

Geometry, Texturing, Animation, and Core/project lifecycle have been re-audited against official Blockbench documentation/native source, current Minecraft Bedrock behavior/schema, and surveyed public Blockbench MCP implementations.

The design goal is locked:

```text
full relevant Bedrock/Blockbench capability coverage
+
one obvious owner per ordinary intent
+
load only what the current phase + current intent needs
+
no tool-count parity for its own sake
```

Do **not** remove rare capability merely to reduce tool count. Keep it supported as `EXTENDED` when it is not appropriate for the `BASE` active-phase surface.

Do **not** restart broad external feature hunting before local implementation unless a concrete missing production capability appears.

---

# Route 1 — selected workflow and immediate next action

The Route 1 product decision is final for this batch:

```text
APPROVED IMAGE
+
REQUESTED DIMENSIONS
+
APPROVED SHAPE-ONLY GLB
```

Image-only versus image+GLB is **not** a current A/B gate. The user has selected image+GLB. Local work tests the selected path; it does not choose the path again.

Authority is fixed:

```text
approved image        → visual authority
requested dimensions  → numeric envelope authority
approved GLB          → depth / volume / attachment / hidden-side evidence
raw GLB bounds        → observation only
```

GLB format remains `.glb` only for Route 1. It is a transient Blockbench Reference Model, not production geometry. Production authoring remains semantic Bedrock Groups/Cubes, then `.bbmodel` / Bedrock geometry delivery.

## Canonical Route 1 alignment

Pure planner already on `Local`:

```text
mcp/lib/route1ReferenceAlignment.ts
mcp/tests/route1-reference-alignment.test.ts
```

Required sequence:

```text
1. load approved GLB
   manage_geometry_reference(load)
   origin=[0,0,0]
   uniform_scale=1
   source_front_direction from fixture

2. read raw world bounds

3. plan uniform FIT_ENVELOPE
   target units = requested_dimensions_blocks × live Format.block_size
   scale multiplier = min(
     target_width  / observed_width,
     target_height / observed_height,
     target_length / observed_length
   )

4. update uniform_scale only

5. read FRESH post-scale world bounds

6. plan translation only
   center X → target center X
   min Y    → target ground Y
   center Z → target center Z

7. update origin only

8. read FRESH aligned evidence

9. capture FRONT / SIDE / TOP / ISOMETRIC

10. author semantic Groups/Cubes with approved image visible

11. remove transient GLB

12. export production .bbmodel

13. verify no reference_model remains
```

Default local-test anchor:

```text
center X = 0
ground Y = 0
center Z = 0
```

unless the approved fixture explicitly requires another anchor.

Route 1 invariants:

```text
uniform scale only
measure again after scale before translation
unused envelope space on one/two axes is valid
no X/Y/Z independent stretching
no pre-scaling or rewriting approved-shape.glb
no mesh repair/decimation for alignment
no triangle → Cube conversion
no semantic mesh parser / cuboid solver
no scalar quality score as authority
no new auto-align tool unless a reproducible local failure proves current ownership insufficient
```

## Route 1 local execution — test, not redesign

When local testing begins:

```text
1. git switch Local
2. git pull --ff-only
3. git status --short
4. cd mcp
5. bun install --frozen-lockfile
6. bun run verify:mcp
7. confirm route1-reference-alignment regression PASS
8. bun run build
9. prepare/package one approved representative Route 1 fixture
10. deploy/load exact current BlockIT artifact
11. run Geometry smoke / fresh client registry
12. run canonical Route 1 sequence above
13. inspect approved image + fresh captures
14. remove reference
15. export .bbmodel
16. confirm no reference_model state
17. record PASS or the first reproducible wrong owner
18. STOP
```

If the selected path passes, Route 1 is accepted for the tested claim. Do **not** append an image-only comparison run.

If it fails, diagnose the first wrong owner and fix only that owner. Do not broaden Route 1 or introduce a new format/tool/framework merely because the first live run exposes a local bug.

---

# Capability Loading Model

There are exactly **two capability categories**. These names are canonical in design and future implementation/guidance:

```text
BASE
→ automatically available when its owning phase is active
→ ordinary path for that phase
→ no discovery/load step before use when exact route is known

EXTENDED
→ not present in the BASE active-phase context
→ loaded only when explicit intent or observed authored state requires that capability
```

Do **not** use `PHASE_DEFAULT`, `ON_DEMAND`, `AUTO_LOADED`, `INTENT_LOADED`, `HOT`, `DEFERRED`, `LAZY`, `SPECIALIZED`, `NICHE`, `normal`, or `conditional` as alternative capability-category names.

`BASE` and `EXTENDED` classify capability exposure only. They are **not runtime modes**, do not create a second phase system, and do not change capability ownership.

## Routing invariant

```text
ACTIVE PHASE
+
BASE
+
only EXTENDED capability definitions relevant to the current intent/evidence
```

No category-wide activation exists. No `EXTENDED` pack activation exists.

## Same-phase transition contract

```text
BASE → BASE
→ call exact BASE capability directly

BASE → EXTENDED
→ if needed definition is unavailable, one narrow lookup for coherent current intent
→ choose exact owner
→ execute
→ keep BASE available
→ no phase switch/reload/reconnect/reset

EXTENDED → BASE
→ call BASE directly
→ no unload/reset ceremony

EXTENDED → EXTENDED
→ reuse available definitions first
→ lookup only when a newly required capability definition is unavailable
→ never load every EXTENDED capability in the phase
```

An `EXTENDED` capability does not become a mandatory dependency merely because it was used once. Reuse it while relevant; otherwise continue through BASE with no unload action.

## EXTENDED lookup / reuse

```text
exact route already available
→ call directly

route known but definition unavailable
→ one narrow lookup for coherent current intent
→ backend may return bounded closely related definitions
→ choose one exact owner per action
→ keep returned definitions reusable in current phase/session

same capability needed again
→ reuse; no second lookup

lookup miss
→ reformulate once with exact capability/domain wording
→ second miss = BLOCKED / capability gap
```

Several closely related definitions returned by one narrow lookup do not form a pack/category.

Never re-run lookup merely for confirmation after a successful mutation. Never send a known foreign-phase capability through same-phase EXTENDED lookup.

## Category assignment rule

BASE membership is evidence-driven. Evaluate:

```text
intent frequency
schema/context cost
workflow adjacency
lookup overhead
selection-collision risk
Cost to Accepted Result
```

No universal tool-count threshold is copied from another host/model/vendor.

## Cross-phase transition

```text
current intent belongs to ACTIVE PHASE
→ BASE or EXTENDED route

current intent belongs to FOREIGN PHASE
→ HANDOFF_REQUIRED
→ preserve resume-critical state only
→ switch owning phase
→ reload/reconnect because phase ownership changed
→ new phase begins from its active BASE surface once implemented
```

Known foreign-phase capability never enters same-phase EXTENDED search.

Current phase-switch transport remains authoritative until measured local/live evidence proves a better implementation. Do not combine capability-surface consolidation with transport/protocol redesign.

---

# Remote-safe foundations already on `Local`

```text
CORE / PROJECT
mcp/lib/bedrockProjectSemantics.ts

GEOMETRY
mcp/lib/orientedBoxContact.ts
mcp/lib/blockbenchCubeObb.ts
mcp/lib/route1ReferenceAlignment.ts

TEXTURING
mcp/lib/facePixelMapping.ts
mcp/lib/textureRevision.ts
mcp/lib/textureFrameMapping.ts
mcp/lib/pbrMaterialMembership.ts

ANIMATION
mcp/lib/animationPreviewState.ts
mcp/lib/bedrockAnimationSemantics.ts
```

Targeted regressions exist in `mcp/tests/`, including:

```text
route1-reference-alignment.test.ts
```

All remain **LOCAL PROOF REQUIRED** until Bun/local/live gates pass.

---

# Locked target surfaces

Exact runtime counts must be measured after public consolidation. These lists define design target, not a claim that BASE/EXTENDED exposure is already live.

## Shared Core / project lifecycle

### BASE

```text
create_project
open_project
configure_project
get_project_info
export_model
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

### EXTENDED

```text
undo
redo
get_undo_stack
get_selection
manage_project_session
  switch
  close
  reload
```

Normal `.bbmodel` save remains `export_model(codec=project)`; do not add duplicate `save_project`.

## Geometry

### BASE

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
select_all_of_type       → leave production surface
```

### EXTENDED

```text
manage_locator
manage_texture_mesh
manage_geometry_reference
manage_bounding_box
manage_item_display_transform
manage_reference_image
```

Route 1 `manage_geometry_reference` stays Geometry-owned. Alignment math remains inside `mcp/lib/route1ReferenceAlignment.ts`; do not create a separate alignment tool family.

## Texturing

### BASE

```text
create_texture
configure_texture
remove_texture
get_texture
paint_texture
export_texture
```

`list_textures` remains shared Core because Geometry uses its UV/atlas gate before Texturing handoff.

### EXTENDED

```text
create_pbr_material
configure_material
list_materials
get_material_info
manage_texture_set
manage_texture_layers
manage_texture_group
manage_animated_texture
list_material_instances
set_material_instances
```

PBR correctness remains mandatory whenever its capability is loaded:

```text
exclusive channel membership
normal XOR height
MER vs MERS semantics
one PBR correction owner
```

## Animation

### BASE

```text
create_animation
configure_animation
remove_animation
manage_keyframes
inspect_animation
capture_animation_views
export_animation_file
```

Retire after replacement contracts exist:

```text
animation_graph_editor
animation_timeline
batch_keyframe_operations
animation_copy_paste
```

### EXTENDED

```text
manage_animation_effects
manage_animation_controller
animation_playback
manage_animation_curves
import_animation_file
validate_animation_motion
```

`manage_animation_controller` still needs:

```text
delete_controller
duplicate_controller
duplicate_state
ordered transitions
ordered animation links
blend_transition_curve
explicit Bedrock short keys
```

`manage_animation_curves` retains bake-before-Bedrock-delivery. `validate_animation_motion` is objective sampled QA, not a subjective quality score.

---

# Critical correctness contracts

## Core / project

```text
open_project uses native project/Bedrock codecs
no handwritten .bbmodel parser
replace-current requires explicit unsaved handling
new-tab load returns exact selected project identity
rectangular logical UV allowed
logical UV change requires keep|rescale_uv
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
Route 1 image+GLB authority split
Route 1 uniform fit-envelope only
Route 1 fresh post-scale bounds before center/ground translation
Route 1 reference removed before .bbmodel export
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
```

When PBR capability is loaded:

```text
exclusive PBR channel membership
normal XOR height
MER vs MERS semantics
```

## Animation

```text
full loop modes + native metadata
Bedrock identifier grammar
multi-bone/multi-channel explicit keyframe batch
numeric + Molang
pre/post
linear/catmullrom direct Bedrock
step via pre/post
Bezier editor-only → bake before Bedrock delivery
controller ordered transitions/links + blend curve + explicit keys
capture restores editor state
native AnimationCodec export
unbaked Bezier blocks direct delivery
```

Minecraft controller `variables/remap_curve` remains an EXTENDED Bedrock extension gap until persistent round trip is proven locally.

---

# Broader LOCAL_CODE implementation sequence

This remains separate from the immediate Route 1 test. Public ToolSpec/schema/runtime prompt consolidation requires `LOCAL_CODE` + Bun and is not falsely claimed complete by the remote design work.

```text
1. git checkout Local
2. git pull --ff-only
3. cd mcp
4. bun install --frozen-lockfile
5. run prepared pure regressions
6. Core/project lifecycle consolidation
7. Geometry public consolidation
8. Texturing public consolidation
9. Animation public consolidation
10. implement BASE/EXTENDED exposure from final owner schemas
11. update specialist Skills/runtime prompt from measured catalog
12. bun run prompts:build
13. bun run docs:build
14. bun run docs:check
15. bun run verify:mcp
16. review generated/source diff
17. measure actual BASE/full available counts
18. deploy/reload BlockIT
19. live BASE/EXTENDED routing fixtures
20. cross-phase handoff fixture
21. measure Cost to Accepted Result
```

Do not split this into a new roadmap. This file remains the single continuation owner.

---

# Final completion gates

## Route 1 selected workflow

```text
pure alignment regression PASS
exact current BlockIT artifact loaded
approved GLB loads
raw evidence readable
uniform fit-envelope scale works
fresh scaled evidence observed
center X/Z + ground Y works
fresh aligned evidence observed
canonical views work
semantic Groups/Cubes share intended coordinate frame
approved image remains visual authority
reference removed
.bbmodel exports
no reference_model remains
no known P0/P1 Route 1 correctness hole
```

No image-only comparison run is required.

## Broader MCP capability routing

```text
public ownership matches curated coverage
only BASE and EXTENDED exist as capability-category vocabulary
BASE surface contains evidence-justified active-phase routes
EXTENDED remains reachable without bloating BASE context
already loaded EXTENDED definitions reused without repeated lookup
same-phase category transitions require no reload/reconnect/reset
all generated prompt/docs current
bun run verify:mcp PASS
representative live BASE and EXTENDED fixtures PASS
cross-phase handoffs PASS
BASE membership selected from measured Cost to Accepted Result
phase reload/reconnect cost measured before any separate switch redesign
no known P0/P1 correctness hole
```
