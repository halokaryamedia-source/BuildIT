# Next Action

Updated: 2026-08-31 — Texturing cleanup design locked in-repo; local implementation/build remains pending; cross-phase live E2E stays after cleanup

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

`TEXTURING_CLEANUP_DESIGN_LOCKED_LOCAL_IMPLEMENTATION_REQUIRED`

The remote MCP efficiency audit is complete. Geometry, Animation, Camera/inspection, History, Export, validation routing, phase ownership, UUID-first targeting, one-Undo ownership, and fail-closed semantics do **not** require redesign before live E2E.

The only pre-E2E cleanup with current evidence is Texturing:

1. fix `create_texture` blank-dimension semantics;
2. add one focused deterministic face-local texture-authoring primitive;
3. make inspection and mutation share the same face UV→pixel math;
4. update Texturing routing/prompt semantics;
5. regenerate canonical prompt/docs output and run the final MCP gate in `LOCAL_CODE`.

Do **not** broaden this pass into generic transform APIs, arbitrary execution, automatic phase switching, array/radial tool families, symmetry scoring, Animation schema splitting, TextureMesh, animated textures, controller blend curves, bone-binding expressions, or another framework/router/profile.

## Why This Cleanup Comes Before Live E2E

The live E2E harness is already source-prepared, but Texturing still has a known provisional public contract: omitted `create_texture` dimensions currently become 16×16 even though normal new BlockIT Bedrock projects use project logical UV resolution (128 by default, 256 opt-in).

Running final Texturing E2E before correcting a known public-contract defect would measure a workflow we already intend to change. Therefore:

```text
TEXTURING CONTRACT CLEANUP
→ LOCAL GENERATION + verify:mcp
→ LIVE GEOMETRY → TEXTURING → ANIMATION E2E
→ measure Cost to Accepted Result
→ only then decide evidence-gated ergonomics work
```

## Locked Texturing Cleanup Contract

### Goal

Make BlockIT Texturing more deterministic and cheaper for ChatGPT to use without broadening the MCP surface unnecessarily.

Success means:

- `create_texture` no longer silently creates omitted-dimension blank production atlases at 16×16;
- face-specific crisp details can be authored with **face-local pixels** instead of ChatGPT manually calculating atlas-global coordinates;
- exact writes are full-preflighted, atomic, Undo-safe, and machine-verifiable;
- existing Bedrock/PBR, phase ownership, UUID-first targeting, fail-closed semantics, and visual-proof boundaries remain intact;
- generated prompt/docs output comes only from canonical local generators;
- final `bun run verify:mcp` passes before the implementation commit.

### Non-Goals

Do not add or redesign in this pass:

```text
generic transform_elements
relative Geometry transform intent
array/radial duplication
symmetry audit/scoring
Animation schema slimming/splitting
automatic authoring-phase switching
execute_script / arbitrary JS / risky_eval
TextureMesh direct authoring
animated texture authoring
controller blend-curve mutation
bone-binding expressions
persistent registries
new generic routers/profiles/frameworks
```

Relative Geometry transforms, texture revision guards, dense face-grid authoring, and Animation schema slimming remain **post-E2E evidence-gated candidates**, not current requirements.

## Exact Source Scope

### Production source

Modify:

```text
mcp/server/tools/texture.ts
mcp/server/tools/paint.ts
```

Prefer one narrow pure shared helper when implementation begins:

```text
mcp/lib/facePixelMapping.ts
```

The helper is justified only so inspection and mutation use identical UV→pixel mathematics. It must not become a generic texture framework.

Potential small refactor only when required:

```text
mcp/server/tools/element-inspection.ts
```

Preserve its public inspection semantics unless a small exact mapping field is genuinely needed by the new authoring primitive.

### Agent/routing contract

Modify:

```text
.agents/skills/blockit-bedrock-texturing/SKILL.md
mcp/prompts/bedrock_entity_workflow.md
```

### Generated output — LOCAL_CODE only

```text
mcp/prompts/manifest.json
mcp/docs/api.json
mcp/docs/index.html
```

Never hand-edit generated entries.

### Tests

Use existing test owners where possible. Add a dedicated test only where no current owner cleanly protects the new invariant.

Required proof surfaces:

```text
create_texture schema/runtime semantics
face-pixel pure mapping
paint_face_features public contract
atomicity / full-preflight / one Undo
Texturing-only phase exposure
Skill/runtime-prompt routing
```

Do not create a parallel test system.

## P0 — `create_texture` Resolution Semantics

### Current defect

Current public schema supplies:

```text
width  default = 16
height default = 16
```

Omitting dimensions therefore reaches runtime as 16×16 even when the intended production canvas should follow the current project/base atlas.

### New public schema

Conceptually:

```text
name: string
width?: integer 16..4096
height?: integer 16..4096
data?: deterministic image source
group?: TextureGroup reference
fill_color?: color
layer_name?: string
pbr_channel?: color | normal | height | mer
render_mode?: ...
render_sides?: ...
```

Pair invariant:

```text
width + height present → valid pair
width only             → FAIL
height only            → FAIL
neither                → runtime derives only for supported cases
```

Never infer a square bitmap from one supplied dimension.

### Runtime dimension resolution

#### Blank base-color atlas

```text
data absent
role = base_color_candidate
width/height absent
→ use Project.texture_width × Project.texture_height
→ dimension_source = project_logical_uv
```

Normal new BlockIT projects therefore resolve to 128×128 or explicit 256×256 logical resolution.

Existing production/provisional canvas validation still applies when the caller supplies explicit dimensions.

#### Blank explicit color variant

```text
data absent
role = explicit_variant
width/height absent
→ require exactly one established base atlas
→ use baseAtlas.width × baseAtlas.height
→ dimension_source = base_atlas
```

#### Blank PBR support atlas

```text
data absent
role = pbr_support
width/height absent
→ require exactly one established base atlas
→ preserve current material TextureGroup requirement
→ use baseAtlas.width × baseAtlas.height
→ dimension_source = base_atlas
```

#### Explicit dimensions

```text
width + height supplied
→ use exactly those dimensions
→ run current role/preflight validation
→ dimension_source = explicit
```

#### Absolute imported image file

Preserve the native imported file dimensions.

Preferred safe contract:

```text
absolute image file + dimensions omitted → Texture.fromFile owns native dimensions
absolute image file + dimensions supplied → reject unless local runtime proves a clear intended resize semantic
```

Return:

```text
dimension_source = imported_file
```

Do not pretend schema width/height control a native import if Blockbench ultimately replaces them from the image file.

#### Data URL

Until local implementation proves reliable native dimension inference:

```text
data:image/... + explicit width+height → allowed
data:image/... + omitted dimensions    → FAIL
```

Do not guess.

### Project requirement

`create_texture` should fail clearly when no intended Bedrock project is open rather than operating through incidental Texture globals.

### Structured result provenance

Creation should return compact provenance in `structuredContent`, for example:

```text
texture: <existing compact texture metadata>
creation:
  dimension_source: project_logical_uv | base_atlas | explicit | imported_file
  requested_dimensions: [w,h] | null
  resolved_dimensions: [w,h]
```

This is continuation state; ChatGPT should not need an immediate confirmation read just to learn why the dimensions were chosen.

## P0 — Focused `paint_face_features` Tool

### Purpose

BlockIT already knows a Cube face's UV rectangle, texture-space rectangle, U/V direction, and related mapping state. ChatGPT should not manually convert a local intent such as:

```text
head / north / local pixel (4,5)
```

into atlas-global X/Y coordinates.

Add exactly one focused Texturing tool:

```text
paint_face_features
```

This tool owns **crisp deterministic Minecraft face-local detail**, not general artistic painting.

Existing Painter tools remain available for atlas-level/general work.

### Targeting

Each face target must identify:

```text
cube: explicit Cube UUID preferred; unique exact name only under current identity policy
face: north | south | east | west | up | down
```

No implicit selected Cube.

Texture identity must be explicit when multiple textures exist, consistent with current deterministic texture behavior.

### Recommended public shape

Conceptually:

```text
texture_id?: string
faces:
  - cube: string
    face: Face
    ops:
      - FillOp | RectOp | LineOp | PixelsOp
```

Keep the schema bounded and strict.

### Supported operations

#### Fill

```text
type: fill
color: exact authored RGBA/HEX
```

Fills exactly the physical pixels owned by the mapped face.

#### Rect

```text
type: rect
x, y: non-negative integer local face pixels
width, height: positive integers
color
```

#### Line

```text
type: line
x1, y1, x2, y2: non-negative integer local face pixels
color
```

Use deterministic crisp integer rasterization only. No antialiasing.

#### Pixels

```text
type: pixels
pixels:
  - x: non-negative integer
    y: non-negative integer
    color
```

This is intended for identity-critical marks, eyes, seams, symbols, etc.

### Explicit exclusions

Do **not** add to `paint_face_features`:

```text
soft brush
gradient
layer management
selection management
mirror-paint editor state
stylus configuration
arbitrary Painter settings
generic image processing
```

Those remain existing specialized Painter routes.

## Face-Local Coordinate Contract

For a mapped physical face of `W × H` pixels, caller-visible coordinates are:

```text
top-left     = (0,0)
top-right    = (W-1,0)
bottom-left  = (0,H-1)
bottom-right = (W-1,H-1)
```

The caller never supplies atlas-global coordinates to `paint_face_features`.

The shared mapping owner must:

- validate finite UV rectangles;
- validate logical and physical texture dimensions;
- derive physical face pixel bounds;
- preserve U/V direction instead of normalizing orientation away;
- map one face-local integer pixel to one physical atlas pixel;
- reject ambiguous/non-integral mappings;
- never silently clamp, round, wrap, or choose another face;
- expose enough deterministic metadata for inspection and mutation to agree.

### Face rotation

Do **not** guess Blockbench `face.rotation` semantics.

Before declaring 90/180/270 fully supported:

1. inspect actual native semantics in the local implementation context;
2. add deterministic mapping tests for supported rotations;
3. confirm known face corners in a local runtime fixture.

If a rotation is not proven, fail closed rather than painting the wrong pixel. ToolSpec support must match actual proof.

### Animated textures

Current inspection already treats animated texture mapping as unsupported when physical bitmap height differs from displayed frame height. Preserve that boundary for `paint_face_features` until a dedicated animated-texture contract exists.

## Full Preflight Before Mutation

Before `Undo.initEdit`:

```text
require intended project
resolve texture
resolve every Cube
resolve every requested face
verify face enabled/paintable
verify finite UV
verify logical/physical texture dimensions
resolve exact face-local mapping
validate every requested local coordinate/shape
expand fill/rect/line/pixel ops into exact final physical writes
verify all final writes remain inside their owning face and texture
validate bounded request size
```

Any failure means:

```text
NO bitmap mutation
NO partial write
NO Undo entry
```

No per-face recovery loop after mutation begins.

## One Coherent Call = One Undo Unit

A multi-face request remains:

```text
one tool call
→ one full preflight
→ one texture edit
→ one Undo entry
```

Do not create one Undo transaction per face/Cube.

## Exact Postcondition Verification

For this deterministic exact-pixel tool, execution should verify its own write before completion:

```text
expand expected final pixel writes
→ establish Undo snapshot
→ apply one texture edit
→ read touched pixels back
→ compare exact expected RGBA
→ mismatch: cancel/recover and throw
→ exact match: finish Undo
```

Return summary-first machine state such as:

```text
operation: paint_face_features
texture: {uuid,name,...}
faces_modified: N
pixels_written: N
pixels_verified: N
postcondition: verified
affected_faces: bounded compact metadata
```

Exact pixel postcondition proves execution correctness only. It does **not** create Texture Styling visual `PASS`; fresh atlas + mapped model view still own visual acceptance.

## Existing Painter Tools Remain

Do not delete or collapse current Painter capability.

Final intended routing:

```text
contiguous atlas/base fill        → paint_fill_tool / draw_shape_tool
general atlas shapes/strokes      → draw_shape_tool / paint_with_brush
supported smooth transition       → gradient_tool
crisp face-local identity/detail  → paint_face_features
special editor workflows          → existing conditional Painter tools
```

The new tool removes manual atlas arithmetic; it is not a replacement for Painter.

## Texturing Skill Cleanup

Update `.agents/skills/blockit-bedrock-texturing/SKILL.md` only when implementation is ready.

Remove stale workaround language equivalent to:

```text
blank atlas resolution unknown → get_project_info once
create_texture has provisional 16×16 default
production must always repeat width+height explicitly
```

New direct routing should express:

```text
global UV/atlas readiness       → list_textures
face-specific mapping inspect   → inspect_element only when genuinely needed
blank base atlas                → create_texture; omit size to use current project logical UV
explicit higher-density bitmap  → create_texture with width+height
crisp face-local detail         → paint_face_features
general atlas styling           → draw_shape_tool / paint_with_brush
PBR/material semantics          → existing material tools
fresh atlas evidence            → get_texture
mapped-model visual evidence    → capture_model_views
```

First-call semantics:

```text
blank base no dims      → project logical UV
blank variant/PBR       → established base atlas bitmap
explicit dimensions     → width+height pair
absolute file import    → native imported dimensions
data URL                 → explicit dimensions until native inference is proven
```

Do not duplicate the entire public schema in the Skill.

## Runtime Workflow Prompt Cleanup

Update `mcp/prompts/bedrock_entity_workflow.md` after source behavior is implemented.

Remove stale instruction that production callers must explicitly repeat 128-based `create_texture` width/height because of the provisional 16×16 default.

Replace with semantic routing:

```text
new blank base atlas
→ create_texture uses current project logical UV when dimensions are omitted

explicit higher-density bitmap
→ pass width + height explicitly

crisp local face details
→ paint_face_features with face-local pixels
```

Keep existing durable boundaries:

- one base-color atlas;
- UV Layout is separate from Texture Styling;
- PBR atlases are support channels;
- flat fill is not visual completion;
- Texture Verify still needs fresh atlas + mapped model evidence.

Prompt change requires canonical `prompts:build` output in the same local delivery.

## Required Test Matrix

### `create_texture` schema

Must prove:

```text
name only                     → schema PASS
width + height                → PASS
width only                    → FAIL
height only                   → FAIL
empty name                    → FAIL
fractional dimensions         → FAIL
out-of-range dimensions       → FAIL
data + fill_color             → FAIL
fill_color without layer_name → FAIL
pbr_channel without group     → FAIL
```

Update stale tests that currently assume omission materializes 16×16.

### Dimension resolution

Required cases:

```text
blank base + project 128 → 128×128 / project_logical_uv
blank base + project 256 → 256×256 / project_logical_uv
blank explicit variant   → base bitmap / base_atlas
blank PBR support         → base bitmap / base_atlas
explicit 256×256          → 256×256 / explicit
one-sided size            → rejected
absolute file no dims     → native / imported_file
data URL no dims          → rejected until supported
```

### Face mapping

For every actually supported rotation/orientation, test:

```text
four corners
one interior point
U reversed
V reversed
both reversed
non-square face
higher physical pixel density than logical UV
out-of-range local coordinate rejection
fractional/ambiguous physical mapping rejection
animated texture rejection
```

### `paint_face_features` public schema

Reject:

```text
empty faces
empty ops
negative local coordinates
zero rect dimensions
invalid face enum
malformed colors
unbounded oversized requests
```

Accept representative bounded multi-face batches.

### Atomicity / result contract

Protect:

```text
full preflight before Undo.initEdit
one Undo unit per coherent call
no nested per-face Undo loop
exact postcondition comparison
failure cancels edit
summary-first structured result
```

### Phase exposure

After addition:

```text
Texturing → paint_face_features present
Geometry  → absent
Animation → absent
```

Update exact surface-count tests only because the intended active Texturing surface actually changed; never alter a count merely to get green.

### Routing

Texturing Skill and runtime workflow must directly route crisp face-local identity/detail to `paint_face_features` and preserve foreign-phase `HANDOFF_REQUIRED` rules.

## Decisions for Other MCP Areas

### Geometry — NO CHANGE BEFORE E2E

Keep current direct owners:

```text
place_cube
modify_cube
modify_cubes_batch
add_group
duplicate_element
reparent_element
inspect_element
```

Bounded relative translate/resize inside current Cube tools remains a post-E2E candidate **only if live Cost to Accepted Result justifies it**. Do not add a generic `transform_elements` family for parity with another MCP.

### Animation — NO CHANGE BEFORE E2E

Current surface already owns:

```text
create_animation
manage_keyframes
batch_keyframe_operations
animation_timeline
animation_graph_editor
animation_copy_paste
manage_animation_effects
manage_animation_controller
inspect_animation
```

Do not split schemas or tool families merely to reduce serialized size. Measure first.

### Camera / inspection / validator — NO CHANGE

Retain deterministic `capture_model_views`, focused inspection, and summary-first validator resources. Only refactor face mapping if needed so inspection and face-local mutation share one pure owner.

### History / Export — NO CHANGE

Retain bounded multi-step Undo/Redo, compact recovery state, Bedrock geometry + `.bbmodel` export boundary, and Route 1 protection.

## Local Implementation Sequence

The cleanup changes public ToolSpecs and runtime prompt source, so implementation must occur in `LOCAL_CODE` or `LIVE_BLOCKBENCH`, not as partial remote GitHub source edits.

Start from current `Local`:

```bash
git checkout Local
git pull --ff-only
cd mcp
bun install --frozen-lockfile
```

Use the repository-pinned Bun version.

Implementation order:

1. implement the narrow pure face-pixel mapping owner;
2. refactor inspection to use it only if necessary;
3. fix `create_texture` schema + runtime dimension resolver + result provenance;
4. add `paint_face_features` with full preflight, one Undo, exact postcondition;
5. add/update targeted tests;
6. run the smallest relevant tests during iteration;
7. update Texturing Skill;
8. update runtime workflow prompt;
9. run canonical prompt generation;
10. run canonical API docs generation;
11. run final canonical MCP gate;
12. review the complete diff;
13. update `implementation-map.md` only if source ownership actually changed;
14. replace this continuation plan with the resulting implementation/proof state;
15. create one logical commit.

Canonical commands:

```bash
cd mcp
bun run prompts:build
bun run docs:build
bun run docs:check
bun run verify:mcp
```

Do not use GitHub Actions as a generator/authoring path. Do not hand-edit generated output.

Preferred implementation commit after local PASS:

```text
feat(texturing): make atlas authoring deterministic
```

Source, tests, prompt manifest, generated docs, and necessary continuation updates are one logical public-contract delivery; do not split them merely by file/layer.

## Final Review Checklist Before Implementation Commit

```text
[ ] no implicit 16×16 blank production default
[ ] width/height pair semantics are exact
[ ] native imported image dimensions are preserved
[ ] existing base-atlas reuse/fragmentation guard remains intact
[ ] PBR material/channel preflight remains intact
[ ] paint_face_features is Texturing-only
[ ] explicit/UUID-first target policy is preserved
[ ] all face writes preflight before Undo
[ ] one coherent call = one Undo
[ ] no silent clipping/rounding/wrapping
[ ] supported face rotation semantics are proven, not guessed
[ ] exact pixel writes have postcondition verification
[ ] tool success is not promoted to visual-quality PASS
[ ] no arbitrary eval/script route
[ ] no Geometry redesign
[ ] no Animation redesign
[ ] generated prompt manifest is current
[ ] generated API docs are current
[ ] verify:mcp PASS
```

## Prepared Live E2E Source

The live harness remains **source-prepared only**; this is not a live PASS claim.

```text
GEOMETRY
bun run verify:geometry-live -- --confirm-disposable
→ creates/leaves blockit_geometry_e2e_disposable open
→ exact geometry readback + before/after render + Undo/Redo
→ prints observable request/tool-call cost

switch BlockIT MCP Authoring Phase → texturing; reload/reconnect
bun run verify:texturing-live -- --confirm-disposable
→ reuses the same project
→ one disconnected-coordinate paint batch
→ exact full-atlas PNG hashes before/after/Undo/Redo
→ prints observable request/tool-call cost

switch BlockIT MCP Authoring Phase → animation; reload/reconnect
bun run verify:animation-live -- --confirm-disposable
→ reuses the same `e2e_root` bone
→ one two-keyframe authored edit
→ exact `inspect_animation` readback + Undo/Redo
→ prints observable request/tool-call cost
```

After Texturing cleanup lands, update the Texturing live verifier if needed so it exercises the accepted current public route rather than preserving an obsolete atlas-coordinate workflow merely for historical continuity.

Each verifier checks exact installed build identity, profile, active phase, and required live tools before mutation. Cost output records tool/mutation/inspection/evidence/history call counts plus serialized request/response body bytes and elapsed time. These are runtime observables, **not model-token measurements and not visual-quality scores**.

No automatic cross-phase orchestrator is added because changing MCP Authoring Phase still requires an explicit Blockbench setting change plus reload/reconnect.

## Post-E2E Evidence-Gated Candidates

Only after equivalent accepted-quality live work is measured, reconsider:

1. bounded relative translate/resize intent inside existing Geometry tools;
2. texture revision/stale-state guard if manual/editor concurrency proves a real failure mode;
3. dense face-grid authoring only if `paint_face_features` still incurs measurable avoidable request cost;
4. Animation schema slimming only where total measured serialized cost falls without capability loss;
5. protected advanced gaps only when a real Bedrock workflow requires them.

Do not optimize toward raw tool count, call count, schema length, or character count as a proxy for Authoring Efficiency. The repository definition remains **Cost to Accepted Result**.

## Verification Boundary

Current state is:

```text
TEXTURING CLEANUP DESIGN: LOCKED
TEXTURING SOURCE IMPLEMENTATION: LOCAL PROOF REQUIRED
CANONICAL GENERATED DOCS/PROMPT: LOCAL PROOF REQUIRED
verify:mcp ON CLEANUP: LOCAL PROOF REQUIRED
LIVE CROSS-PHASE E2E: NOT YET RUN ON CLEANUP
VISUAL / AUTHORING QUALITY PASS: NOT CLAIMED
```

Static/source/CI evidence must not be promoted to installed Blockbench, live Undo/playback/persistence, visual-quality, or live Authoring Efficiency proof.

## Other Deferred Work

Route 1 live validation remains user-deferred. Do not reactivate it automatically. Historical TODOs, interrupted candidates, and old experiments are not active work by themselves.

## STOP Condition

This cleanup is ready for repository implementation delivery only when:

```text
source implementation complete
+ targeted regressions pass
+ prompt manifest generated canonically
+ API docs generated canonically
+ verify:mcp PASS
```

Until then, this file is the **single in-repository continuation owner** for the cleanup. Do not create another handoff document, roadmap, duplicate plan, or parallel state file.
