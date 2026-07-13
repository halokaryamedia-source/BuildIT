# Codex Reference Handoff

Status: `APPROVED`

## Asset

- Asset ID: `<asset_id>`
- Display Name: `<display_name>`
- Target Format: `bedrock_entity`
- Reference Visual: `<asset_id>_reference_visual.png`
- Reference Manifest: `reference_manifest.json`
- Canonical Model: `<asset_id>.bbmodel`

- Manifest Schema: `3.3`
- Sample Type: `<reference_candidate_or_golden_sample>`
- Promotion Status: `<candidate_not_promoted_or_promoted_golden_sample>`

## Source authority order

1. `PRODUCTION_CONTEXT.md`
2. `<asset_id>_reference_visual.png` as the sole visual authority
3. `reference_manifest.json` executable panel, region, part, symmetry, rotation, Texture, and Animation contracts
4. `GEOMETRY.md`
5. `TEXTURING.md`
6. `ANIMATION.md`
7. `VALIDATION.md`
8. `CODEX_REFERENCE_HANDOFF.md`

When files conflict, stop with `REFERENCE_CONFLICT`. Reject numbered-sheet, four-sheet, or three-approval packages with `LEGACY_SKILL_CONFLICT`.

## Project lock

- `1 Minecraft block = 16u`
- Asset envelope: `<width>u W × <depth>u D × <height>u H`
- Ground plane: `<ground_plane>`
- UV Mode: `<uv_mode>`
- Texture Atlas: `<width>x<height>`
- Pixel Style: `<16x_or_32x>`
- Front Direction: `<front_direction>`
- Symmetry Policy: `<BILATERAL_or_ASYMMETRIC>`
- Classic Bedrock: required
- PBR and Vibrant Visuals: forbidden

## Canonical Geometry route

```text
get_stage_context
→ rebind_active_project_identity when required
→ selected Terra writer acquires manage_project_write_lease
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ bounded diagnosed edits
→ final required-view diagnosis with write_diff_image=true
→ visual_director final acceptance only when needed
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ lease released
→ GEOMETRY_REVIEW
```

`submit_geometry_for_review` performs fresh `validate_geometry_contract`, verifies embedded review readiness, creates the next unused review checkpoint, and enters `GEOMETRY_REVIEW`. Do not run duplicate validation steps immediately before submission.

Final required views are `front`, `left_side`, `back`, `top_footprint`, and `front_left_3_4`. Add `right_side` only when `symmetry_policy = ASYMMETRIC`.

Normal implementation uses the selected Terra Medium writer. Sol Medium is inspection-only and is used only for unresolved cross-view judgment, subjective feedback after deterministic PASS, or final visual acceptance. No separate model-routing call is required.

## Stage routing

```text
GEOMETRY         → blockbench-production + blockbench-geometry → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → blockbench-production + blockbench-texture → BEDROCK_CUBOID_TEXTURE
ANIMATION        → blockbench-production + blockbench-animation → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → blockbench-production + blockbench-validation → FINAL_VALIDATION_READONLY
```

Maximum loaded production skills: `2`. All stage changes continue in the same Codex session and MCP session.

Upstream reopen also continues in the same Codex and MCP session; it releases the prior lease and requires a fresh target-stage lease, not a reconnect.

## Import

Technical files:

```text
workspace/active/<asset_id>/mcp/references/
```

Visual files:

```text
workspace/active/<asset_id>/blockbench/references/
```

## Non-negotiable rules

- Do not redesign the approved Reference Visual.
- Do not invent parts, materials, clips, or proportions.
- Do not use removed repair profiles; Geometry revision uses internal `LOCAL_REPAIR` or `MAJOR_FORM_REVISION` scope.
- Do not continue through a user review gate automatically.
- Do not reconnect MCP, reload the plugin, or start another Codex session for a normal stage transition.
- Do not load all production skills together.
- Do not use PBR, Hytale, mesh, armature, vertex-weight, UI automation, or risky evaluation in the normal cuboid workflow.
- Every non-zero cube rotation must use `rotate_cube_about_attachment`.
