# MCP Capability Backlog

Updated: 2026-08-31

Authority: **`Local` only**.

This file records capability gaps discovered from the BlockIT audit against public Blockbench MCP implementations and native Blockbench behavior. It is backlog/design state, not runtime proof.

## Goal

Improve **Cost to Accepted Result** without inflating the MCP surface.

Preserve:

- Bedrock-specific ownership;
- UUID-first targeting;
- full preflight / fail-closed mutation;
- coherent Undo;
- Geometry → Texturing → Animation phase boundaries;
- generated-doc discipline;
- visual proof as final quality authority.

## Current Gate

The active pre-E2E implementation remains the Texturing contract in `docs/knowledge/next-action.md`.

Public ToolSpec/schema or runtime prompt changes require `LOCAL_CODE` because canonical prompt/API output must be generated with Bun. Never hand-edit generated prompt/API files remotely.

```text
REMOTE-SAFE FOUNDATION
→ LOCAL PUBLIC-CONTRACT IMPLEMENTATION
→ bun run prompts:build
→ bun run docs:build
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
mcp/lib/textureRevision.ts
mcp/tests/texture-revision.test.ts
mcp/lib/animationPreviewState.ts
mcp/tests/animation-preview-state.test.ts
```

All remain **LOCAL PROOF REQUIRED** until Bun/local/live gates pass.

---

# Geometry Surface Curation

Current normal Geometry phase exposes **28 tools**: 15 shared Core tools plus 13 Geometry-owned tools. The curation goal is not to minimize count mechanically; it is to remove duplicate intent owners while preserving one obvious route for each normal Geometry task.

## Target Geometry Surface

Target after local public-contract cleanup: **about 24 tools**, while adding exact spatial/contact measurement and per-face UV correction.

```text
CORE / SETUP / EVIDENCE
create_project
get_project_info
inspect_model_bounds
undo
redo
get_undo_stack
list_outline
find_elements_by_criteria
get_selection
inspect_element
capture_model_views
export_model
list_textures

GEOMETRY AUTHORING / CORRECTION
place_cube
modify_cubes_batch
add_group
duplicate_element
remove_element
rename_element
modify_group
reparent_element
manage_locator
manage_geometry_reference
measure_geometry
```

This target intentionally removes five active names and adds one focused read-only measurement owner:

```text
REMOVE FROM NORMAL GEOMETRY SURFACE
modify_cube
select_all_of_type
list_locator_elements
manage_null_object
bone_rigging

ADD
measure_geometry
```

## Ownership Decisions

### `modify_cubes_batch` becomes the single Cube correction owner

Current `modify_cube` and `modify_cubes_batch` overlap on transform/Box-UV/visibility correction. Keep the bounded batch owner and allow one-item batches instead of maintaining two public correction contracts.

Local implementation should absorb the useful single-only fields into `modify_cubes_batch`:

```text
name
inflate
```

It should also become the owner for Tier-A per-face UV correction:

```text
uv_mode
faces[].face
faces[].uv
faces[].rotation
```

Requirements stay unchanged: explicit identity, full preflight, one coherent Undo, no-op rejection, exact final readback. Do not add a separate `set_face_uv` tool.

### `find_elements_by_criteria` absorbs Locator/Null discovery

Current `list_locator_elements` exists because the general finder only covers Cube/Group, while `inspect_element` already supports Cube/Group/Locator/Null Object. Expand the finder type surface to:

```text
cube | group | locator | null_object | any
```

Then remove `list_locator_elements` from the normal surface. `list_outline` remains separate because hierarchy traversal and targeted search are distinct efficient intents.

### `manage_locator` absorbs Null Object creation/update

Current `manage_locator` and `manage_null_object` are parallel lifecycle tools with nearly identical create/update structure. Keep one owner with an explicit kind discriminator:

```text
kind: locator | null_object
```

Type-specific fields stay strict. Rename/delete remain owned by `rename_element` / `remove_element`.

Parent movement should be owned by the generic `reparent_element` rather than duplicated inside Locator/Null update contracts once that generic owner is proven for all supported outliner element types.

### `reparent_element` becomes the single parent-movement owner

Expand/clarify the existing owner for:

```text
Cube
Group
Locator
Null Object
```

Group cycle protection remains special to Group hierarchy. Other element types still require an explicit Group or intentional root when format-valid. Do not keep a second parent mutation path inside another Geometry tool.

### `modify_group` absorbs normal rig-state correction

Current broad `bone_rigging` duplicates existing owners:

```text
bone_rigging.create      → add_group
bone_rigging.parent      → reparent_element
bone_rigging.unparent    → reparent_element
bone_rigging.delete      → remove_element
bone_rigging.rename      → rename_element
bone_rigging.set_pivot   → modify_group(origin)
```

The genuinely unique normal rig state is IK. Add bounded Group IK fields to `modify_group` instead of preserving a multi-action `bone_rigging` router:

```text
ik_enabled?
ik_target?
```

IK target resolution remains explicit and fail-closed.

The current `bone_rigging.mirror` implementation must not justify retaining the broad tool by itself. Its current source duplicates a Group and reflects the Group origin on one axis; this is not sufficient evidence of a complete subtree/descendant-geometry mirror contract. A future mirror primitive is evidence-gated and should be designed as its own explicit Geometry semantic only if real workloads require it.

### `select_all_of_type` leaves the normal Geometry phase

Normal BlockIT Geometry mutation is explicit UUID/name targeted. No primary Geometry authoring route requires mass editor selection. Keep `get_selection` as the conditional bridge when the user explicitly refers to the current editor selection, but do not expose a selection-mutating convenience tool in the default Geometry surface without a proven workflow owner.

### `measure_geometry` is the only new Tier-A Geometry tool

Use `mcp/lib/orientedBoxContact.ts` as the Cube contact foundation. One read-only owner may support bounded:

```text
elements
pairs
distances
angles
```

The caller supplies semantic expectations (`connected`, `separate`, `intentionally_embedded`, or unspecified). The tool reports evidence; it never guesses intended topology or replaces visual acceptance.

## Tools That Stay Separate Deliberately

Do **not** merge these just to reduce tool count:

```text
undo / redo / get_undo_stack
  distinct mutation/read annotations and recovery intents

list_outline / find_elements_by_criteria
  hierarchy traversal vs targeted discovery

inspect_model_bounds / capture_model_views
  numeric rendered bounds vs visual evidence

get_project_info / inspect_element
  project lifecycle metadata vs one authored target

place_cube / add_group
  Cube geometry schema vs bone/Group hierarchy schema

manage_geometry_reference / ordinary geometry mutation
  transient Route-1 evidence lifecycle is intentionally isolated
```

Do not create a giant generic `modify_element` or `transform_elements` owner merely to reduce names; mixed Cube/Group/Locator schemas would increase ambiguity and payload size.

## Geometry Local Acceptance

When this curation is implemented in `LOCAL_CODE`, update exact phase/catalog counts only from measured source/runtime output. Required proof includes:

```text
one Cube correction owner only
one general element discovery owner only
one Locator/Null lifecycle owner only
one parent-movement owner only
no broad duplicate bone_rigging router
IK round-trip through modify_group
per-face UV correction round-trip through modify_cubes_batch
measure_geometry exact Cube contact fixtures
phase ownership remains Geometry-only
prompts:build PASS
docs:build + docs:check PASS
verify:mcp PASS
live Geometry E2E PASS before runtime quality claims
```

---

# Tier A

## Geometry A1 — Per-Face UV Correction

Gap: `place_cube` can author explicit per-face UV at creation, but existing/imported per-face UV rectangles and face rotation need deterministic correction.

Preferred direction after Geometry curation: extend the canonical `modify_cubes_batch` correction owner, not `modify_cube` and not a new generic UV family. One-Cube correction uses a one-item batch.

Conceptual update fields:

```text
modify_cubes_batch
  updates:
    - id
      uv_mode?
      faces?
        face
        uv
        rotation?
```

Requirements: explicit Cube identity, finite UVs, native rotations only, clear Box UV ↔ per-face switching, full preflight before Undo, final UV readback.

## Geometry A2 — Exact Spatial / Contact Measurement

Gap: canonical views/bounds do not numerically prove whether rotated Cube parts are separated, touching, or penetrating.

Foundation: `mcp/lib/orientedBoxContact.ts`.

Preferred public direction: one read-only `measure_geometry`-style owner.

Possible surfaces:

```text
elements
pairs
distances
angles
```

Caller owns semantic expectation:

```text
unspecified
connected
separate
intentionally_embedded
```

Never infer intended connection from names/appearance. For Cubes, prefer exact transformed OBB evidence.

---

## Texturing A1 — `create_texture` Dimension Semantics

Already locked in `docs/knowledge/next-action.md`.

Required:

- remove omitted-dimension 16×16 blank-production behavior;
- explicit width+height only as a pair;
- blank base derives project logical UV;
- blank variant/PBR derives established base bitmap size;
- absolute file import preserves native dimensions;
- data URL remains explicit-dimension until native inference is proven;
- return dimension provenance.

## Texturing A2 — Deterministic Face-Local Authoring

Already locked in `docs/knowledge/next-action.md`.

Preferred tool:

```text
paint_face_features
```

Exact operations:

```text
fill
rect
line
pixels
```

Use shared `facePixelMapping`; full preflight; one texture edit; one Undo; exact RGBA postcondition verification; no automatic artistic PASS.

## Texturing A3 — Texture Revision Guard

Gap: manual editor changes can make later exact MCP writes stale.

Foundation: `mcp/lib/textureRevision.ts`.

Revision identity:

```text
sha256:<width>x<height>:<decoded RGBA digest>
```

Prefer returning `revision` from existing texture observations. Exact destructive paths may accept:

```text
expected_revision?: string
```

Stale token must fail before bitmap mutation/Undo.

## Texturing A4 — Focused Face / Region Readback

Extend existing texture observation rather than adding multiple tools.

Conceptually:

```text
get_texture
  scope: full | face | rect
```

Face read returns face-local image, local size, mapped atlas rect, and revision. Orientation must match `paint_face_features`.

## Texturing A5 — Native Texture Clone

Avoid round-tripping a full PNG just to create a color variant.

Preferred owner: extend `create_texture` with explicit:

```text
source_texture: <UUID>
```

Native copy; dimensions derive from source; role/group remains caller-owned; source/data/fill semantics remain unambiguous.

## Texturing A6 — PNG Export

Add Texturing-owned deterministic standalone texture delivery.

Conceptually:

```text
export_texture
```

Explicit texture UUID, safe path policy, explicit overwrite, no file picker, return path/bytes/identity/dimensions. Must work for base, variants, and PBR support textures.

---

## Animation A1 — Complete Bedrock Metadata

Add ownership for native:

```text
override_previous_animation
start_delay
loop_delay
```

Prefer extending existing Animation metadata/timeline owner. Delay values preserve authored Molang and are never evaluated by BlockIT. Inspection must round-trip final values.

## Animation A2 — Animation / Controller JSON Delivery

Gap: animations/controllers can be authored but do not have their own deterministic standalone codec-owned export route.

Preferred direction:

```text
export_animation_file
  type: animation | controller
```

Use native Blockbench `AnimationCodec`. Support compiled content and/or explicit safe-path write. Keep separate from geometry export.

## Animation A3 — Temporary Pose Canonical Views

Add read-only animation timestamp observation without persistent timeline state changes.

Foundation: `mcp/lib/animationPreviewState.ts` owns the generic preview-state transaction and guaranteed restoration. Concrete Blockbench effect muting, codec time semantics, and canonical capture remain runtime-owned.

Conceptually:

```text
capture_animation_views
  animation
  time
  views
  front_direction
```

Snapshot selected/playing/timeline state, mute effects when needed, pose temporarily, capture canonical views, restore on every path. Return requested and rendered time.

## Animation A4 — Multi-Bone / Multi-Channel Keyframe Batch

Current single bone/channel unit can make one complete pose expensive.

Prefer extending existing keyframe owner:

```text
targets:
  - bone
    channel
    keyframes
```

Full preflight before Undo; duplicate times fail; one request = one Undo; preserve authored Molang. Prioritize if E2E confirms pose-call cost is material.

---

# Tier B — After Core / E2E Evidence

## Geometry

- relative translate/scale/rotate/pivot intent, preferably inside the canonical Cube/Group correction owners;
- UV island translate/scale/90° rotation after exact per-face UV correction is stable;
- explicit-pair symmetry audit;
- a properly specified mirror primitive only if repeated workloads prove it materially useful;
- coplanar/Z-fighting diagnostic as lazy validation/resource evidence.

## Texturing

- copy face pixels with optional flip/rotation;
- bounded exact `replace_color`, region flip/rotate, flood fill;
- objective statistics: exact color count, transparency counts, histogram, texel density.

Do not turn statistics into artistic quality scores.

## Animation

- native entity-relative/global rotation round-trip;
- animation validation sweep after exact Geometry contact + temporary pose capture exist;
- native animation/controller import for existing Bedrock projects.

---

# Tier C — Evidence-Gated

```text
linear cube arrays
radial cube arrays
dense face-grid authoring
advanced texture region transforms
advanced pre/post keyframe data points
specialized symmetry automation
```

Add only when repeated workloads prove material benefit.

---

# Explicit Non-Goals

Do not add to the normal BlockIT Bedrock surface:

```text
execute_script
risky_eval
arbitrary Blockbench JavaScript
automatic phase switching
semantic compiler / Intent Program authority
generic mesh/vertex/weight-paint expansion
procedural biped/limb generators
noise-first automatic texture detailing
automatic artistic quality scores
large generic router/profile/framework layers
tool-count growth for parity alone
```

BlockIT remains explicit, fail-closed, Bedrock-specific, Undo-aware, and evidence-driven.

## External References

Capability ideas were compared against:

- `SwagRee/BlockBenchMCP`
- `sosadly/blockbench-mcp`
- `jasonjgardner/blockbench-mcp-plugin`
- `XiaoNetwork-Astral/blockbench-mcp`
- `adhi-jp/minecraft-blockbench-mcp`
- `FFriends/Blockbench-MCP`
- `Golub4ik-Official/blockbench-mcp`
- `sigee-min/ashfox`

Native semantics/format ownership were checked against official `JannisX11/blockbench` source when material.

External repositories are references only. BlockIT implementation must follow this repository's rules, Bedrock constraints, source ownership, and proof boundaries.
