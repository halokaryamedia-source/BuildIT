# Next Action

Updated: 2026-08-31 — remote-safe Texturing preparation underway; local public-contract implementation/build remains pending; cross-phase live E2E stays after cleanup

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

`TEXTURING_REMOTE_PREPARATION_IN_PROGRESS_LOCAL_IMPLEMENTATION_REQUIRED`

The remote MCP efficiency audit is complete. Geometry, Animation, Camera/inspection, History, Export, validation routing, phase ownership, UUID-first targeting, one-Undo ownership, and fail-closed semantics do **not** require redesign before live E2E.

Remote-safe preparation already completed on `Local`:

- compacted `inspect_element` so full authored state is not duplicated in both text and `structuredContent`;
- moved face UV→physical-pixel mapping into the narrow shared owner `mcp/lib/facePixelMapping.ts`;
- added regression coverage for UV bounds, physical-density scaling, U/V direction, exact-grid rejection, and shared ownership;
- verified Blockbench native CubeFace rotation semantics from official source: each 90° maps normalized UV as `[x,y] → [1-y,x]`; the shared helper now prepares the discrete inverse mapping for caller-visible face-local pixels at 0/90/180/270 degrees;
- public ToolSpecs, runtime Texturing prompt, generated API docs, and live runtime are intentionally unchanged until `LOCAL_CODE` can regenerate/verify the complete contract in one batch.

The remaining pre-E2E cleanup with current evidence is Texturing:

1. fix `create_texture` blank-dimension semantics;
2. add one focused deterministic face-local texture-authoring primitive;
3. connect the new authoring primitive to the shared exact face-local rotation/pixel mapping;
4. update Texturing routing/prompt semantics;
5. regenerate canonical prompt/docs output and run the final MCP gate in `LOCAL_CODE`.

Do **not** broaden this pass into generic transform APIs, arbitrary execution, automatic phase switching, array/radial tool families, symmetry scoring, Animation schema splitting, TextureMesh, animated textures, controller blend curves, bone-binding expressions, or another framework/router/profile.

## Why This Cleanup Comes Before Live E2E

The live E2E harness is already source-prepared, but Texturing still has a known provisional public contract: omitted `create_texture` dimensions currently become 16×16 even though normal new BlockIT Bedrock projects use project logical UV resolution (128 by default, 256 opt-in).

Running final Texturing E2E before correcting a known public-contract defect would measure a workflow we already intend to change. Therefore:

```text
REMOTE-SAFE PREPARATION
→ LOCAL TEXTURING CONTRACT IMPLEMENTATION
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
- inspection and mutation share the same UV→pixel and rotation math;
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

Modify in `LOCAL_CODE`:

```text
mcp/server/tools/texture.ts
mcp/server/tools/paint.ts
```

Already prepared remotely:

```text
mcp/lib/facePixelMapping.ts
mcp/server/tools/element-inspection.ts
mcp/tests/face-pixel-mapping.test.ts
```

The helper exists only so inspection and mutation use identical UV→pixel mathematics. It must not become a generic texture framework.

### Agent/routing contract

Modify only when source behavior is ready:

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
face-local 0/90/180/270 mapping
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

BlockIT already knows a Cube face's UV rectangle, texture-space rectangle, U/V direction, face rotation, and related mapping state. ChatGPT should not manually convert a local intent such as:

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

The shared mapping owner now prepares:

- finite UV validation;
- logical→physical texture scaling;
- normalized physical face bounds;
- U/V direction preservation;
- exact-grid rejection for fractional/ambiguous physical boundaries;
- supported face rotation validation at 0/90/180/270;
- discrete inverse local→UV pixel mapping based on Blockbench native CubeFace rotation semantics;
- caller-visible local face dimensions that swap on 90/270 for non-square faces;
- out-of-range and non-integer local coordinate rejection.

The helper must never silently clamp, round an ambiguous exact grid, wrap, or choose another face.

### Face rotation proof boundary

Remote source evidence now establishes Blockbench's native transform used by `CubeFace.UVToLocal()`:

```text
for each 90°:
[x,y] → [1-y,x]
```

The pure helper/tests may encode the discrete inverse, but **live Blockbench runtime corner mapping remains LOCAL PROOF REQUIRED** before `paint_face_features` can claim supported runtime mutation at all four rotations.

If local proof disagrees, fix the helper before exposing the public tool; do not weaken the verifier.

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
resolve exact face-local mapping + rotation
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

Pure remote-safe tests now cover the owner contract; local final proof must include:

```text
four corners for 0/90/180/270
one interior point
U reversed
V reversed
both reversed
non-square face
higher physical pixel density than logical UV
out-of-range local coordinate rejection
fractional/ambiguous physical mapping rejection
live Blockbench corner readback for each supported rotation
```

### `paint_face_features` schema

Must reject:

```text
empty faces
empty ops
negative local coordinates
zero rect dimensions
invalid face enum
malformed colors
oversized bounded request
```

Must accept a representative multi-face batch.

### Atomicity

Prove:

```text
all targets/writes are resolved before Undo.initEdit
one coherent call creates one Undo unit
no per-face nested Undo loop
exact postcondition readback exists
failure cancels/reverts edit
structured result stays summary-first
```

### Phase exposure

Texturing:

```text
paint_face_features → present
```

Geometry and Animation:

```text
paint_face_features → absent
```

Update exact surface counts only because the intended tool was actually added, never to make a stale assertion green.

### Routing

Texturing Skill and runtime prompt must direct crisp face-local identity/detail to `paint_face_features` without tool-searching Geometry mutations.

## Geometry / Animation Before E2E

No new source defect has been found that justifies another pre-E2E public API change.

Geometry remains:

```text
CURRENT-PROJECT SOURCE: adequate for pre-E2E
POST-E2E CANDIDATES ONLY:
- bounded relative translate/resize inside existing modify owners
- batch inflate only if a representative workflow proves repeated single-Cube cost
```

Animation remains:

```text
CURRENT-PROJECT SOURCE: adequate for pre-E2E
POST-E2E CANDIDATES ONLY:
- coordinated multi-bone authored edit if real pose correction causes call explosion
- schema slimming only if measured serialized cost drops without capability loss
```

Do not add these merely for parity with another MCP.

## Prepared Live E2E Source

The live harness remains **source-prepared only**; this is not a live PASS claim.

```text
GEOMETRY
bun run verify:geometry-live -- --confirm-disposable
→ exact geometry readback + before/after render + Undo/Redo
→ observable request/tool-call cost

switch Authoring Phase → texturing; reload/reconnect
bun run verify:texturing-live -- --confirm-disposable
→ reuse same project
→ deterministic texture mutation + exact readback + Undo/Redo
→ observable request/tool-call cost

switch Authoring Phase → animation; reload/reconnect
bun run verify:animation-live -- --confirm-disposable
→ reuse same e2e_root bone
→ authored keyframe edit + exact inspect_animation readback + Undo/Redo
→ observable request/tool-call cost
```

The Texturing E2E fixture must be updated in LOCAL_CODE after `paint_face_features` becomes the intended production route; do not retain a stale disconnected-global-coordinate fixture merely because it already exists.

## Local Implementation / Validation Sequence

When moving to the user's PC:

```text
1. git checkout Local && git pull --ff-only
2. cd mcp
3. bun install --frozen-lockfile
4. run the smallest existing regression set first to catch any remote-preparation compile/test issue
5. fix create_texture schema/runtime dimension semantics
6. implement paint_face_features using facePixelMapping.ts
7. prove native rotation mapping in a disposable live/local fixture
8. add/update targeted tests
9. update Texturing Skill + runtime workflow prompt
10. bun run prompts:build
11. bun run docs:build
12. bun run docs:check
13. bun run verify:mcp
14. deploy/reload BlockIT
15. Geometry → Texturing → Animation live E2E
16. only after accepted-quality E2E, decide evidence-gated Geometry/Texture/Animation ergonomics candidates
```

Do not use GitHub Actions to author generated files.

## Verification Boundary

All remote-safe commits made after the last known full MCP baseline remain:

```text
LOCAL PROOF REQUIRED
```

until the user's PC runs the matching canonical verifier. Static source review does not upgrade them to local/live PASS.

Static or CI proof must not be promoted to live Blockbench quality/runtime proof.

## Other Deferred Work

Route 1 live validation remains user-deferred. Historical TODOs, interrupted candidates, and old experiments are not active work by themselves.
