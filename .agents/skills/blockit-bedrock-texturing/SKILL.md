---
name: blockit-bedrock-texturing
description: Minecraft Bedrock Entity specialist for Texture Atlas, Texture Styling, Painter, PBR, material instances, and Texture Verify.
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
  resume_from: <fresh project/UUID/UV state>
  action: set MCP Authoring Phase=geometry; reload BlockIT MCP
→ STOP
```

After Texture Verify `PASS`, requested animation continues via the same handoff with `target_phase: animation`.

## Canonical Vocabulary

```text
UV LAYOUT       = geometry → atlas coordinate mapping
TEXTURE ATLAS   = bitmap/PNG canvas that stores pixels
TEXTURE STYLING = color/material/shading/detail authored into the atlas
TEXTURE VERIFY  = fresh atlas + mapped-model visual validation
```

`create_texture` = Texture Atlas. Painter = Texture Styling. UV mutation is not Texturing ownership.

## Direct Routing

Reuse fresh state; load exact spec only when needed.

```text
UV read/audit
  global UV/atlas audit      → list_textures
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
  mapped model evidence      → capture_model_views
```

Never `tool_search` for `modify_cube`, `modify_cubes_batch`, `bone_rigging`, or another Geometry mutation while Texturing is active.

## Texture Atlas

Use one base-color atlas PNG for the whole model. `list_textures`: `none` → create; `single` → reuse; `fragmented` → stop/reconcile.

New AI production uses logical UV 128×128. Pass explicit 128-based `width`/`height` until the pending Texture Atlas sizing contract lands. Pin atlas UUID and pass `texture_id` when multiple textures are loaded.

PBR normal/height/MER are support atlases. Atlas creation/fill does not complete Texture Styling.

## Texture Styling

Define palette/value-hue ramp, material zones, face-aware shading, contact/occlusion, edge, alpha intent, seam/orientation, identity marks, detail budget, and pixels per UV unit.

Flat fill is a **BASE PASS only** when form/material/detail is visible. Prefer controlled Minecraft pixel clusters and stepped ramps; reject random high-contrast noise. Smooth gradients only when reference/style supports them.

```text
BASE PASS             → material regions
VALUE / FORM PASS     → form/contact/occlusion/edge + material ramp
IDENTITY PASS         → exact-pixel identity marks
SECONDARY DETAIL PASS → controlled detail; stop before noise
VERIFY                → Texture Verify
```

Repeated same-color disconnected detail may use one `paint_with_brush` coordinate batch with `connect_strokes=false`.

## Texture Verify

Use approved reference + fresh `get_texture` + affected `capture_model_views`. Review UV/region → palette/material → form/contact/edge → seam/orientation → identity → microdetail.

`FAIL / UNVERIFIED / PASS` is visual-only. `FAIL` → smallest causal correction → fresh affected evidence → `IMPROVED | UNCHANGED | REGRESSED`. Same causal direction failing twice without new evidence → `BLOCKED`.
