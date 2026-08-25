---
name: blockit-bedrock-texturing
description: Bedrock Entity specialist for Texture Atlas, Texture Styling, Painter, PBR, material instances, and Texture Verify.
---

# BlockIT Bedrock Texturing

Use only when `ACTIVE PHASE: TEXTURING`. Geometry owns geometry/rig/UV mutation.

## Phase Boundary

Texturing may inspect/audit UV state but must not borrow Cube mutation.

```text
UV/geometry/rig correction required
→ HANDOFF_REQUIRED
  target_phase: geometry
  reason: <observed structural/UV defect>
  readiness: <which Geometry/UV gate is not ready>
  resume_from: <current model/project + immediate target identifiers>
  action: set MCP Authoring Phase=geometry; reload BlockIT MCP
→ STOP
```

Entry requires final Box UV locked with `autouv=0` where applicable and `list_textures` with no unresolved invalid/out-of-bounds/partial-overlap blocker. Reuse `box_uv_region` as read context only.

After Texture Verify `PASS`, animation handoff uses `target_phase: animation` and `readiness: texture_verify=PASS`.

## Canonical Vocabulary

```text
UV Layout       = geometry → atlas coordinate mapping
Texture Atlas   = bitmap/PNG canvas storing pixels
Texture Styling = authored color/material/shading/detail
Texture Verify  = fresh atlas + mapped-model visual validation
```

`create_texture` = Texture Atlas. Painter = Texture Styling. UV mutation is not Texturing ownership. Per-face `material_instance` semantics belong here.

## Direct Routing

Reuse fresh state; load exact spec only when needed.

```text
UV read/audit
  global UV/atlas readiness  → list_textures (`uv_audit.production_gate`)
  face-specific mapping      → inspect_element only when needed
  unlocked/invalid UV        → HANDOFF_REQUIRED(geometry)

Texture Atlas
  create atlas bitmap        → create_texture
  inventory/select           → list_textures / activate_texture

Texture Styling
  base/material regions      → draw_shape_tool
  contiguous base fill       → paint_fill_tool
  stepped value/form/edge    → draw_shape_tool / paint_with_brush
  supported smooth ramp      → gradient_tool
  identity/detail pixels     → paint_with_brush
  PBR/material semantics     → create_pbr_material / configure_material / assign_texture_channel

Texture Verify
  fresh atlas image          → get_texture
  mapped model-view evidence → capture_model_views
```

`list_textures` is not merely a texture list. Its `uv_audit.production_gate` is the global UV readiness signal; unresolved invalid/out-of-bounds/fractional/unlocked/partial-overlap state blocks production handoff.

Never `tool_search` for `modify_cube`, `modify_cubes_batch`, `bone_rigging`, or another Geometry mutation while Texturing is active.

## First-Call Input Invariants

Do not learn these rules through failed calls:

```text
blank production create_texture → pass width + height explicitly from project logical UV (128 default / 256 opt-in)
data + fill_color                → invalid; choose imported image or generated fill
fill_color                       → layer_name required
pbr_channel                      → material TextureGroup `group` required
Painter coordinates              → texture pixel coordinates; keep them in bounds
```

The current `create_texture` public schema still supplies a provisional **16×16** blank default when width/height are omitted. Production Codex authoring must therefore **not omit blank Atlas size**: reuse fresh project resolution from `create_project`/`get_project_info` and pass both dimensions explicitly. Do not treat the 16×16 fallback as a modelling recommendation.

For imported image data, preserve the source's intended bitmap dimensions rather than treating the blank-Atlas default as image sizing guidance. Pin returned Atlas UUID; when more than one texture exists, pass `texture_id` explicitly to Painter tools.

## Deferred Spec Loading

Load the routed active-phase tool only. When action variants or conditional fields matter and the exact spec is not loaded, load that one spec before the first mutation. Known identity skips broad discovery; do not re-list/re-read it only for confirmation.

## Texture Atlas

Use one base-color atlas PNG for the whole model, not one color atlas per body part/Cube/material zone. `list_textures`: `none` → create; `single` → reuse; `fragmented` → stop/reconcile.

New AI production uses the project's logical UV canvas: **128×128 default, 256×256 opt-in**. Until the pending context-aware sizing contract lands in the tool schema/runtime, pass explicit matching `width`/`height` for a blank production Atlas.

PBR normal/height/MER are support atlases. Atlas creation/fill does not complete Texture Styling.

## Texture Styling

Define **palette roles**, value/hue ramp, material zones, face-aware shading, contact/occlusion, edge, alpha intent, seam/orientation, identity marks, detail budget, and pixels per UV unit.

Flat color is provisional when form/material/detail is visible; a flat fill is a **BASE PASS only**. Prefer controlled Minecraft pixel clusters and stepped ramps; reject random high-contrast noise. Smooth gradients only when reference/style supports them.

```text
BASE PASS             → draw_shape_tool / intentional contiguous paint_fill_tool
VALUE / FORM PASS     → draw_shape_tool / paint_with_brush
IDENTITY PASS         → paint_with_brush exact-pixel marks
SECONDARY DETAIL PASS → controlled detail; stop before noise
VERIFY                → Texture Verify
```

`gradient_tool` is for a reference-supported continuous transition, not default Minecraft shading. Repeated same-color disconnected detail may use one `paint_with_brush` coordinate batch with `connect_strokes=false`.

## Texture Verify / Visual Convergence

Use approved reference + fresh `get_texture` + affected `capture_model_views`. Review UV/region → palette/material → form/contact/edge → seam/orientation → identity → microdetail.

`FAIL / UNVERIFIED / PASS` is visual-only. `FAIL` → smallest bounded causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`. Same causal direction failing twice without new evidence → `BLOCKED`.
