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
  reason: <defect>
  readiness: <failed gate>
  resume_from: <current target>
  action: set MCP Authoring Phase=geometry; reload BlockIT MCP
→ STOP
```

Entry: final Box UV locked with `autouv=0` where applicable; `list_textures` has no unresolved invalid/out-of-bounds/partial-overlap blocker. Reuse `box_uv_region` read-only.

## Canonical Vocabulary

```text
UV Layout       = geometry → atlas mapping
Texture Atlas   = bitmap/PNG canvas
Texture Styling = color/material/shading/detail
Texture Verify  = fresh atlas + mapped-model visual validation
```

`create_texture` = Texture Atlas; Painter = Texture Styling; per-face `material_instance` stays here.

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

Global UV gate = `list_textures` → `uv_audit.production_gate`. Never `tool_search` for `modify_cube`, `modify_cubes_batch`, `bone_rigging`, or another Geometry mutation while Texturing is active.

## First-Call Invariants

```text
blank create_texture → explicit width+height from project UV (128 default / 256 opt-in)
data + fill_color    → invalid
fill_color           → layer_name required
pbr_channel          → material TextureGroup `group` required
Painter coordinates  → texture pixels; keep in bounds
```

Current `create_texture` has a provisional **16×16** blank default. Production Codex must therefore **not omit blank Atlas size**; reuse fresh project resolution.

## Deferred Spec Loading

Load the routed active-phase spec only when needed. Known identity skips broad discovery; do not re-list/re-read it only for confirmation.

## Texture Atlas

Use one base-color atlas PNG for the whole model, not one color atlas per body part/Cube/material zone. `list_textures`: `none` → create; `single` → reuse; `fragmented` → stop/reconcile.

Production logical UV is **128×128 default, 256×256 opt-in**; pass explicit blank Atlas size. Pin atlas UUID and pass `texture_id` when multiple textures are loaded.

PBR normal/height/MER are support atlases. Atlas creation/fill does not complete Texture Styling.

## Texture Styling

Define palette roles, value/hue ramp, material zones, face-aware shading, contact/occlusion, edge, alpha, seam, identity marks, detail budget, and pixels per UV unit. Flat color is a **BASE PASS only**; reject random high-contrast noise.

```text
BASE PASS             → draw_shape_tool / intentional contiguous paint_fill_tool
VALUE / FORM PASS     → draw_shape_tool / paint_with_brush
IDENTITY PASS         → paint_with_brush exact-pixel marks
SECONDARY DETAIL PASS → controlled detail; stop before noise
VERIFY                → Texture Verify
```

`gradient_tool` is only for reference-supported continuous transition. Repeated same-color detail may use one `paint_with_brush` batch with `connect_strokes=false`.

## Texture Verify / Visual Convergence

Use approved reference + fresh `get_texture` + `capture_model_views`. Review UV → material → form → identity → microdetail. Verdict: `FAIL | UNVERIFIED | PASS`. `FAIL` → smallest causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`; same causal direction twice → `BLOCKED`.
