# MCP Capability Backlog

Updated: 2026-09-01

Authority: **`Local` only**.

This file records capability gaps discovered from BlockIT audits against official Blockbench documentation, native Bedrock Blockbench source, the current Minecraft Bedrock geometry schema, and public Blockbench MCP implementations. It is backlog/design state, not runtime proof.

## Goal

Improve **Cost to Accepted Result** while keeping one obvious owner for each normal workflow.

Preserve:

- Bedrock-specific ownership;
- UUID-first targeting;
- full preflight / fail-closed mutation;
- coherent Undo;
- Geometry → Texturing → Animation phase boundaries;
- generated-doc discipline;
- visual proof as final quality authority;
- conditional/lazy coverage for uncommon native features instead of bloating the hot tool surface.

## Current Gate

Public ToolSpec/schema or runtime prompt changes require `LOCAL_CODE` because canonical prompt/API output must be generated with Bun. Never hand-edit generated prompt/API files remotely.

```text
REMOTE-SAFE FOUNDATION
→ LOCAL PUBLIC-CONTRACT IMPLEMENTATION
→ bun run prompts:build
→ bun run docs:build
→ bun run docs:check
→ bun run verify:mcp
→ LIVE Geometry → Texturing → Animation E2E
→ measure Cost to Accepted Result
→ evidence-gated follow-up work
```

Remote-safe foundations currently prepared:

```text
mcp/lib/facePixelMapping.ts
mcp/tests/face-pixel-mapping.test.ts
mcp/lib/orientedBoxContact.ts
mcp/tests/oriented-box-contact.test.ts
mcp/lib/blockbenchCubeObb.ts
mcp/tests/blockbench-cube-obb.test.ts
mcp/lib/textureRevision.ts
mcp/tests/texture-revision.test.ts
mcp/lib/animationPreviewState.ts
mcp/tests/animation-preview-state.test.ts
```

All remain **LOCAL PROOF REQUIRED** until Bun/local/live gates pass.

---

# Geometry — Full Coverage Curation

The Geometry target was re-audited against:

- official Blockbench modeling documentation and reference docs;
- native `JannisX11/blockbench` Bedrock codec/outliner behavior;
- current Minecraft Bedrock `minecraft:geometry` capabilities;
- public MCP implementations including SwagRee, sosadly, Jason Gardner, XiaoNetwork-Astral, adhi-jp, FFriends, Golub4ik and ashfox.

The goal is **full relevant Bedrock Geometry coverage with minimum duplicate intent owners**, not raw parity with every Blockbench editor action.

## Current remote-safe correctness work already on `Local`

```text
inspect_element
  → reports Cube inflate
  → reports export state for Cube/Group/Locator/Null Object

duplicate_element
  → delegates property fidelity to native Blockbench duplicate()
  → supports Locator/Null descendants inside duplicated Group subtrees
  → keeps one Undo owner

export identity
  → Group create/rename rejects case-insensitive Bedrock bone-name collisions
  → Locator/Null identity follows per-parent exported locator-key rules
  → create and parent-change preflight locator-key collisions

structural preflight
  → Group batch parent/name planning occurs before Undo
  → duplication planning occurs before Undo
  → Group pivot correction fails closed when required preview state is unavailable

measurement foundation
  → authored Cube + actual matrixWorld + inflate → world-space OBB
  → exact SAT classification: separate / touching / intersecting
```

These source changes are still **LOCAL PROOF REQUIRED**.

## Final normal Geometry surface target

Target normal surface: **about 26 tools**.

```text
CORE / SETUP / EVIDENCE
1  create_project
2  configure_project
3  get_project_info
4  inspect_model_bounds
5  undo
6  redo
7  get_undo_stack
8  list_outline
9  find_elements_by_criteria
10 get_selection
11 inspect_element
12 capture_model_views
13 export_model
14 list_textures

GEOMETRY AUTHORING / CORRECTION
15 place_cube
16 modify_cubes_batch
17 add_group
18 duplicate_element
19 remove_element
20 rename_element
21 modify_group
22 reparent_element
23 manage_locator
24 manage_geometry_reference
25 measure_geometry
26 manage_texture_mesh
```

Remove from the normal Geometry surface after local consolidation:

```text
modify_cube
select_all_of_type
list_locator_elements
manage_null_object
bone_rigging
```

This is intentionally **more complete than the current surface while reducing duplicate ownership**.

## Conditional / extended Geometry coverage

Do not put these in the normal hot surface. Expose only when the workflow needs them:

```text
manage_bounding_box
manage_item_display_transform
```

`BoundingBox` is useful for Bedrock collision/custom-hit-test workflows but is not normal visual entity geometry. Item display transforms are valid native geometry metadata but uncommon for ordinary mob/entity authoring.

## Explicitly not part of normal BlockIT Geometry

```text
generic Mesh vertex/edge/face editing
poly_mesh authoring
arbitrary JavaScript / execute_script
procedural biped/limb generators
generic UI action bridges
semantic compiler / Intent Program authority
automatic phase switching
```

Bedrock `poly_mesh` is deprecated for new content; generic mesh breadth does not justify a large hot MCP surface.

---

## Geometry ownership decisions

### `configure_project` — project/export identity owner

`create_project` must initialize an explicit Bedrock model identifier instead of allowing export to fall back to `geometry.unknown`.

Normal configuration fields:

```text
name?
model_identifier?
logical_uv_width?
logical_uv_height?
```

Creation should accept/set `model_identifier`; later project metadata changes use `configure_project` rather than overloading geometry element tools.

Visible bounds do not need a separate manual owner in the normal path because native Bedrock export calculates them from project geometry; inspection should report the effective exported state when useful.

### `modify_cubes_batch` — single Cube correction owner

Retire `modify_cube`; one-Cube correction is a one-item batch.

Final bounded correction coverage:

```text
identity / transform
  name?
  from?
  to?
  origin?
  rotation?
  inflate?
  visibility?
  export?

Box UV
  uv_offset?
  autouv?
  mirror_uv?
  uv_layout: preserve | auto ?

per-face UV
  uv_mode?
  faces[]:
    face
    uv?
    rotation?
    render/export-face semantic?   # only after native export behavior is proven locally
```

Use the existing deterministic Box-UV packer to repair existing/resized Box-UV layouts rather than adding a separate `pack_uv` tool.

Per-face material-instance ownership is cross-phase. Geometry must preserve it; Texturing/material tooling owns intentional material assignment unless a focused Bedrock requirement proves otherwise.

### `add_group` — Group/bone creation owner

Keep coherent one/batch Group creation and add optional bounded child adoption:

```text
children?: [UUID ...]
```

All children and parents are preflighted before one Undo. This replaces the useful create/adopt behavior currently hidden inside `bone_rigging` without keeping that broad router.

### `duplicate_element` — faithful duplication + mirror owner

Keep native faithful subtree duplication.

Extend supported direct targets to all relevant normal outliner types when locally proven:

```text
Cube
Group
Locator
Null Object
TextureMesh
```

Add optional proper mirror semantics instead of a separate mirror tool:

```text
mirror?:
  axis: x | y | z
  plane: number
```

Mirror must reflect the full intended subtree/geometry and preserve/repair names deterministically. Do not keep the current shallow `bone_rigging.mirror` behavior.

### `remove_element` — delete and resolve/ungroup owner

Normal delete remains recursive for Group.

Add an explicit Group-only resolve mode for hierarchy cleanup:

```text
mode: delete | resolve_group
```

`resolve_group` removes the Group while preserving children and the intended rendered/world result. No separate `ungroup` tool.

### `rename_element` — identity rename owner

Keep one rename owner for all supported outliner element families. Preserve Bedrock export identity invariants:

- Group/bone names remain case-insensitively unique where Bedrock animation/export matching requires it;
- Locator/Null exported keys remain unique inside the parent bone;
- TextureMesh/general element names remain explicit but need not inherit bone-only uniqueness rules.

### `modify_group` — Group/bone authored-state owner

Normal fields:

```text
origin?
rotation?
visibility?
export?
mirror_uv?
reset?
```

Advanced/conditional native fields may remain available without being emphasized in the normal prompt:

```text
bedrock_binding?
material?
```

Do **not** move current ad-hoc Group IK fields into this owner. Current Blockbench native IK workflow is centered on Null Objects.

### `reparent_element` — one parent-movement owner

Support:

```text
Cube
Group
Locator
Null Object
TextureMesh
```

Rules:

- Group cycle protection remains strict;
- Locator/Null/TextureMesh parent validity follows native format behavior;
- Locator/Null remain under an explicit Group for Bedrock locator export;
- no second parent mutation path remains inside `manage_locator` / `manage_texture_mesh` after consolidation.

Explicit transform policy:

```text
preserve: local | world
```

`world` must follow proven Blockbench reparent-adjustment semantics and receive live fixtures before being claimed supported.

A bounded multi-move form may be added inside this same owner if E2E shows repeated parent calls are expensive.

### `find_elements_by_criteria` — universal targeted discovery owner

Expand type coverage to:

```text
cube | group | locator | null_object | texture_mesh | any
```

Remove `list_locator_elements` from the hot surface.

### `list_outline` — hierarchy traversal owner

Keep separate from targeted search. Extend hierarchy output sufficiently to expose relevant non-Cube descendants (Locator / Null / TextureMesh) without turning it into a full-state dump.

### `inspect_element` — exact one-target readback owner

Support exact authored state for:

```text
Cube
Group
Locator
Null Object
TextureMesh
```

Cube readback includes `inflate`, export state and UV detail. TextureMesh readback should include its native authored fields:

```text
texture_name
origin
local_pivot
rotation
scale
visibility
export
parent
```

### `get_selection` — conditional user-selection bridge

Keep because the user may explicitly refer to the currently selected object. Report all normal supported outliner families, not Cube/Group only.

### `inspect_model_bounds` — rendered model bounds owner

Current Cube bounds are useful but final normal coverage must account for visual TextureMesh geometry too. Report what element classes contribute to the result so consumers do not mistake Cube-only bounds for complete rendered-model bounds.

### `manage_locator` — Locator + Null Object lifecycle owner

Merge `manage_null_object` into one owner with explicit kind:

```text
kind: locator | null_object
```

Locator fields include position/rotation/ignore-inherited-scale/export.

Null Object fields include:

```text
position
export
ik_target?
ik_source?
lock_ik_target_rotation?
```

This follows native Blockbench Null Object IK ownership. Rename/delete remain `rename_element` / `remove_element`; parent movement becomes `reparent_element` after consolidation.

### `manage_texture_mesh` — native Bedrock TextureMesh owner

TextureMesh is valid visual Bedrock geometry and therefore must be covered.

Keep one focused lifecycle/correction owner instead of generic Mesh editing.

Native authored fields:

```text
create/update
name
parent
texture_name
origin
local_pivot
rotation
scale
visibility
export
```

Rename/delete/parent movement should reuse generic owners where practical; the tool owns TextureMesh-specific creation and authored-property changes.

### `measure_geometry` — one numerical Geometry evidence owner

Absorb useful measurement ideas from external MCPs without creating many separate tools.

Bounded query modes may include:

```text
bounds
distance
angle
contact
alignment
symmetry
```

Exact Cube contact uses the prepared world-space OBB + SAT foundations. Caller owns semantic expectations; the tool reports evidence and never invents topology intent.

TextureMesh can initially support bounds/center/distance evidence where exact Cube-style OBB contact is not mathematically appropriate.

### `manage_geometry_reference`

Keep isolated for approved transient Route-1 GLB evidence. It remains reference-only and export=false; it never becomes production Mesh geometry.

---

## Geometry validator / diagnostics strategy

Do **not** add a duplicate generic `check_model` tool. BlockIT already exposes native Blockbench Validator resources:

```text
validator://status
validator://warnings
validator://errors
validator://checks/{id}
```

Specialized objective diagnostics such as coplanar/Z-fighting checks should be lazy validator/resource evidence when added, not permanent hot tools.

---

## Geometry local acceptance gate

Do not call Geometry complete until all of the following are proven:

```text
project model_identifier round-trip + export identifier
one Cube correction owner only
one general discovery owner only
one Locator/Null lifecycle owner only
one parent-movement owner only
no broad bone_rigging router
faithful duplication for all supported descendants
proper subtree mirror fixtures
export-safe Group and locator-key identity fixtures
preserve=local + preserve=world reparent fixtures
per-face UV correction + existing Box-UV repack
Group reset/mirror/export native round-trip
Null Object IK target/source/rotation-lock round-trip
TextureMesh create/update/inspect/export round-trip
measure_geometry exact Cube contact fixtures
rendered bounds correctly identify Cube/TextureMesh contribution
conditional BoundingBox and item-display coverage remain outside hot surface
phase ownership remains Geometry-only
prompts:build PASS
docs:build + docs:check PASS
verify:mcp PASS
LIVE Geometry E2E PASS
```

---

# Texturing Tier A

The existing Texturing plan remains valid.

```text
A1 create_texture dimension semantics
A2 paint_face_features deterministic face-local authoring
A3 texture revision / stale-write guard
A4 focused face/region get_texture readback
A5 native source_texture clone for variants
A6 deterministic PNG export
```

Key rules remain:

- omitted blank base dimensions derive project logical UV;
- width+height are explicit as a pair only;
- face-local exact writes use shared facePixelMapping;
- one call = full preflight + one texture edit + one Undo + exact postcondition;
- no automatic artistic quality PASS;
- PBR/material ownership remains Texturing.

Tier B after E2E evidence:

```text
copy-face pixels
bounded replace-color / flood-fill / region transforms
objective palette/transparency/texel-density statistics
```

---

# Animation Tier A

```text
A1 native Bedrock animation metadata
   override_previous_animation
   start_delay
   loop_delay

A2 animation/controller JSON delivery through native AnimationCodec
A3 temporary-pose canonical view capture
A4 multi-bone / multi-channel authored keyframe batch if E2E confirms call cost
```

Native entity-relative/global rotation, validation sweep, and import remain later evidence-gated extensions.

---

# Cross-phase Tier B / C

Only add when normal E2E proves material benefit:

```text
relative translate/scale/rotate intent
UV island transforms
copy-face texture operations
linear/radial arrays
advanced symmetry automation
animation pose sweep
advanced pre/post keyframe data points
```

Prefer extending an existing canonical owner over adding a new tool whenever the intent and schema remain clear.

---

# Explicit Non-Goals

Do not add to the normal BlockIT Bedrock surface:

```text
execute_script
risky_eval
arbitrary Blockbench JavaScript
automatic phase switching
semantic compiler / Intent Program authority
generic Mesh/vertex/weight-paint expansion
new poly_mesh authoring
procedural biped/limb generators
noise-first automatic texture detailing
automatic artistic quality scores
large generic router/profile/framework layers
tool-count growth for parity alone
```

BlockIT remains explicit, fail-closed, Bedrock-specific, Undo-aware, and evidence-driven.

## External reference set

Geometry capability decisions were compared against official Blockbench documentation/source, current Bedrock geometry schema behavior, and public MCP implementations including:

- `SwagRee/BlockBenchMCP`
- `sosadly/blockbench-mcp`
- `jasonjgardner/blockbench-mcp-plugin`
- `XiaoNetwork-Astral/blockbench-mcp`
- `adhi-jp/minecraft-blockbench-mcp`
- `FFriends/Blockbench-MCP`
- `Golub4ik-Official/blockbench-mcp`
- `sigee-min/ashfox`

External repositories are references only. BlockIT implementation follows this repository's rules, Bedrock constraints, source ownership and proof boundaries.
