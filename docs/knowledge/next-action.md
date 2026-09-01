# Next Action

Updated: 2026-09-01 — full Texturing coverage audit completed; remote-safe frame/PBR foundations prepared; local public-contract consolidation remains pending

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; capability design belongs in `docs/knowledge/mcp-capability-backlog.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

`TEXTURING_FULL_COVERAGE_CURATED_LOCAL_IMPLEMENTATION_REQUIRED`

Geometry full-coverage curation is recorded separately. The active implementation focus remains **Texturing** before live cross-phase E2E.

The new full Texturing audit supersedes the earlier narrow plan that added `paint_face_features` while retaining many Painter wrappers. The accepted direction is now:

```text
one normal texture creation owner
one normal texture configuration owner
one normal exact bitmap mutation owner
one normal exact bitmap readback owner
small PBR owner set
conditional/lazy owners for layers, animation, generic groups, texture_set, and material instances
```

Remote-safe preparation already completed on `Local`:

- `mcp/lib/facePixelMapping.ts` — exact face-local UV/rotation/flip mapping;
- `mcp/lib/textureRevision.ts` — decoded-RGBA SHA-256 revision identity + stale-write guard;
- `mcp/lib/textureFrameMapping.ts` — exact static/animated frame-stack mapping;
- `mcp/lib/pbrMaterialMembership.ts` — pure exclusive PBR channel membership planning, including normal-vs-height conflict;
- targeted Bun regression contracts for all four helpers;
- `inspect_element` compact authored-state/UV inspection already shares the face mapping owner.

All remote-safe source/test preparation remains **LOCAL PROOF REQUIRED** until Bun and live gates run.

## Why Texturing Still Comes Before Live E2E

Current public Texturing has both known correctness gaps and an unnecessarily wide surface:

```text
create_texture omitted dimensions → provisional 16×16
exact face-local bitmap editing    → no canonical public owner
texture revision guard             → foundation only
animated frame-local mapping       → foundation only
PBR channel replacement            → can leave duplicate/conflicting group membership
Texture lifecycle                  → no complete normal owner
Painter surface                    → many UI-state wrappers instead of one result owner
```

Running final Texturing E2E before correcting these would measure a workflow we already know will change.

Required sequence:

```text
REMOTE-SAFE FOUNDATION (prepared)
→ LOCAL TEXTURING PUBLIC-CONTRACT CONSOLIDATION
→ prompts:build
→ docs:build
→ docs:check
→ verify:mcp
→ deploy/reload BlockIT
→ LIVE Geometry → Texturing → Animation E2E
→ measure Cost to Accepted Result
```

---

# Locked Normal Texturing Surface Direction

After local consolidation, target roughly **10 Texturing-specific tools**, plus shared Core:

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

`list_textures` remains shared Core because Geometry uses its UV/atlas gate before handoff.

Retire from the **normal** Texturing surface after replacements are implemented:

```text
paint_fill_tool
draw_shape_tool
gradient_tool
color_picker_tool
copy_brush_tool
eraser_tool
paint_settings
paint_with_brush
create_brush_preset
load_brush_preset
texture_selection
texture_layer_management
add_texture_group
activate_texture
assign_texture_channel
get_face_material_instances
set_face_material_instance
bulk_set_material_instances
clear_material_instances
import_texture_set
save_material_config
```

Do not delete behavior before its replacement owner is implemented and verified.

Conditional/lazy coverage target:

```text
manage_texture_layers
manage_texture_group
manage_animated_texture
manage_texture_set
list_material_instances
set_material_instances
```

These remain native/relevant capability, but they do not belong in every normal ChatGPT Texturing session.

---

# P0 — `create_texture` Correctness + Lifecycle Entry

## Omitted dimensions

Remove the current public defaults:

```text
width default=16
height default=16
```

New pair invariant:

```text
width + height present → valid explicit pair
width only             → FAIL
height only            → FAIL
neither                → derive only for supported role/source
```

Runtime resolution:

```text
blank base atlas, no dims
→ Project.texture_width × Project.texture_height
→ dimension_source=project_logical_uv

blank explicit variant, no dims
→ exactly one established base atlas
→ base bitmap dimensions
→ dimension_source=base_atlas

blank PBR support, no dims
→ material group + exactly one established base atlas
→ base bitmap dimensions
→ dimension_source=base_atlas

explicit width+height
→ exact requested bitmap
→ dimension_source=explicit

absolute image file, no dims
→ preserve native imported dimensions
→ dimension_source=imported_file

data URL
→ require explicit width+height until local proof supports safe inference
```

Important: BlockIT may default new projects to 128×128, but **square 128-based dimensions are not a universal Bedrock requirement**. Preserve valid rectangular project/imported layouts such as 64×32. Product defaults and native format validity are separate concerns.

## Clone/variant creation

Add:

```text
source_texture?: UUID
```

Native internal clone; no PNG round trip through ChatGPT. Source/data/fill modes must remain mutually unambiguous.

## Fill semantics

`fill_color` should fill the bitmap directly. Do not require or activate Texture layers merely to name a fill layer. Layers are an explicit conditional workflow.

## Result provenance

Return compact continuation state:

```text
creation:
  dimension_source
  requested_dimensions
  resolved_dimensions
```

---

# P0 — `configure_texture`

Add one normal owner for existing Texture properties/lifecycle correction.

Initial bounded scope:

```text
texture: explicit UUID/name
name?
render_mode?
render_sides?
resize_bitmap?
  width
  height
  sampling: nearest
```

Physical bitmap resize must not silently mutate project logical UV or Geometry UV layout. If caller wants logical UV resolution/layout changes, return `HANDOFF_REQUIRED(geometry)`.

Animated frame lifecycle remains conditional under `manage_animated_texture`.

---

# P0 — `remove_texture`

Add explicit destructive Texture deletion.

Before Undo:

- resolve exact Texture;
- identify base/PBR/group/material dependencies;
- reject ambiguous/destructive state unless caller intent satisfies the public contract;
- never leave a material with silently wrong channel ownership;
- one call = one Undo.

---

# P0 — Unified `get_texture`

Expand existing readback instead of adding `get_texture_region`, `get_face_grid`, `get_texture_revision`, color-picker, and palette-read tools.

Conceptual scopes:

```text
full
frame
face
rect
pixels
```

Return only requested evidence:

```text
texture metadata
frame metadata when animated
mapped atlas rect
image preview when useful
bounded exact RGBA when requested
revision
optional objective statistics
```

`revision` uses `mcp/lib/textureRevision.ts`.

Face scope uses `mcp/lib/facePixelMapping.ts`.
Animated frame scope uses `mcp/lib/textureFrameMapping.ts`.

---

# P0 — Unified `paint_texture`

This replaces the earlier public `paint_face_features` plan and the normal Painter-wrapper family.

## Target contract

Explicit discriminated target:

```text
target.kind = atlas
  rect?
  frame?

or

target.kind = face
  cube
  face
  frame?
```

No implicit selected Cube/face. Texture identity must be explicit when multiple candidate textures are loaded.

## Bounded result operations

Support exact/artifact semantics rather than UI buttons:

```text
fill / flood
rect
ellipse
line
stroke
pixels
gradient
erase
replace_color
copy_region / copy_face
flip_x / flip_y
rotate_90 / rotate_180 / rotate_270
```

Per-op options only when they affect bitmap output:

```text
color / opacity
blend mode
brush size / softness / shape
lock alpha
```

Do not expose normal global Painter state, stylus settings, editor selections, brush presets, or mirror-paint UI mode.

## Exactness / concurrency

Before `Undo.initEdit`:

```text
resolve intended project + texture
resolve optional expected_revision
resolve target frame/face/rect
validate exact frame mapping
validate exact face mapping/rotation/flips
validate every op and bounded expansion
prove writes remain inside target/bitmap
```

Then:

```text
one Undo snapshot
→ apply writes
→ read affected RGBA
→ exact compare
→ mismatch: cancel/recover + throw
→ match: finish Undo
```

No partial write or Undo entry on preflight failure.

Exact postcondition is execution proof, not artistic `PASS`.

---

# P0 — PBR Correctness

## Sole correction owner

`configure_material` absorbs `assign_texture_channel`.

Use `mcp/lib/pbrMaterialMembership.ts` to plan membership before Undo.

Invariant after every operation:

```text
0..1 color image
0..1 normal image
0..1 height image
0..1 MER/MERS image
normal XOR height
```

Replacing a channel detaches the old member rather than relabeling it as another channel. Moving an incoming texture from another material refreshes both material previews/state.

## MER / MERS

Do not conflate uniform subsurface config with image alpha.

```text
MER image  = RGB: metalness/emissive/roughness
MERS image = RGBA: metalness/emissive/roughness/subsurface
```

Local public schema must make these states unambiguous and re-check current Minecraft version restrictions before claiming uniform-MERS support.

`create_pbr_material`, `list_materials`, and `get_material_info` remain separate normal owners.

---

# P0/P1 — `export_texture`

Add deterministic standalone texture delivery.

Explicit:

```text
texture UUID/path
format
overwrite
```

Support at least:

```text
png
tga
```

because Bedrock entity/material workflows may use or prioritize TGA. Do not claim JPEG export without local/native proof.

Return path, dimensions, format, and write confirmation.

---

# Conditional / Extended Texturing

## `manage_texture_layers`

Full explicit native layer lifecycle:

```text
create/delete/duplicate
rename
opacity/blend/visibility
offset/scale
move/reorder
merge_down
flip/rotate/center
flatten
```

Normal `paint_texture` must require explicit layer identity when layer-enabled state would otherwise be ambiguous.

## `manage_texture_group`

For explicit non-material variant/group lifecycle only:

```text
create
rename
resolve/remove
add/remove texture membership
```

PBR material groups continue through PBR owners.

## `manage_animated_texture`

Bedrock Entity format supports animated textures, but this is conditional workflow.

Cover native result semantics:

```text
fps
frame order mode
custom order
frame duplicate/delete/reorder
safe frame-stack structure
```

Normal `get_texture` / `paint_texture` remain frame-aware, so exact editing of an animated atlas does not require switching to a second mutation model.

Bedrock entity runtime animation requires render-controller `uv_anim` plus compatible material/resource-pack setup. Return/reference that integration explicitly; do not silently mutate a resource pack.

## `manage_texture_set`

Replace separate import/save names with:

```text
import
export
```

Native parsing/compile behavior, explicit safe paths, explicit overwrite.

## Material instances

Conditional only:

```text
list_material_instances
set_material_instances
```

Consolidate single/bulk/clear mutation into bounded assignments with `material_name: string | null`, full preflight and one Undo.

---

# Texturing Local Implementation Order

When the PC/local batch begins:

```text
1. git checkout Local && git pull --ff-only
2. cd mcp
3. bun install --frozen-lockfile
4. run smallest regressions first, including:
   - face-pixel-mapping
   - texture-revision
   - texture-frame-mapping
   - pbr-material-membership
5. correct create_texture semantics
6. add configure_texture + remove_texture
7. expand get_texture scoped/revision/frame readback
8. implement unified paint_texture
9. wire PBR membership planner and fix MER/MERS contract
10. add export_texture PNG/TGA
11. implement normal surface retirement/routing
12. add conditional owners required for coverage
13. update Texturing Skill + runtime prompt
14. bun run prompts:build
15. bun run docs:build
16. bun run docs:check
17. bun run verify:mcp
18. deploy/reload BlockIT
19. run live Texturing E2E, including static + animated + PBR fixtures
20. only then call Texturing complete or choose evidence-gated follow-up ergonomics
```

## Required acceptance

```text
create/lifecycle correctness
rectangular native texture fixtures
frame-aware exact mapping
revision stale-write failure before Undo
one canonical bitmap mutation owner
one Undo per mutation request
exact RGBA postcondition
PBR exclusive membership + normal XOR height
MER/MERS correct semantics
PNG/TGA delivery
conditional layer/animation/texture-set/material-instance coverage
phase surface/count from measured runtime
prompts/docs freshness
verify:mcp PASS
LIVE Texturing E2E PASS
```

Do **not** call Texturing complete before these gates.
