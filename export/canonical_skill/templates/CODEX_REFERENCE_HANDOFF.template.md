# Codex Reference Handoff

Status: `APPROVED`

## Asset

- Asset ID: `<asset_id>`
- Display Name: `<display_name>`
- Target Format: `bedrock_entity`
- Reference Visual: `<asset_id>_reference_visual.png`
- Manifest: `reference_manifest.json`
- Manifest Schema: `3.3`
- Sample Type: `<reference_candidate_or_golden_sample>`
- Promotion Status: `<candidate_not_promoted_or_promoted_golden_sample>`
- Canonical Model: `<asset_id>.bbmodel`

## Authority order

1. `PRODUCTION_CONTEXT.md`
2. approved `<asset_id>_reference_visual.png`
3. executable `reference_manifest.json`
4. concise stage Markdown files
5. this handoff

Stop with `REFERENCE_CONFLICT` when these cannot be reconciled. Reject legacy numbered-sheet or extra-approval packages with `LEGACY_SKILL_CONFLICT`.

## Project lock

- `1 Minecraft block = 16u`
- Envelope: `<width>u W × <depth>u D × <height>u H`
- Ground: `<ground_plane>`
- Front: `<front_direction>`
- UV: `<uv_mode>`
- Atlas: `<width>x<height>`
- Pixel Style: `<16x_or_32x>`
- Symmetry: `<BILATERAL_or_ASYMMETRIC>`
- Classic Bedrock required; PBR/Vibrant Visuals forbidden

## Startup call budget

- Call `get_runtime_status` once at startup, not once per stage.
- Call `get_stage_context` at stage entry and after approval/revision/reopen, not after every MCP call.
- Inspect the Reference Visual once per unchanged SHA-256.

## Geometry route

```text
get_stage_context
→ rebind identity when required
→ selected Terra writer acquires lease
→ inspect_reference_visual_preview
→ if zero-start: BUILD_PRIMARY_FORM_FROM_MANIFEST before first capture/analyze
   else: capture affected views and analyze
→ bounded targeted edits
→ final required-view diagnosis
→ conditional visual judgment only when needed
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ lease released
→ GEOMETRY_REVIEW
```

Final views: `front`, `left_side`, `back`, `top_footprint`, `front_left_3_4`; add `right_side` only for `ASYMMETRIC`.

`submit_geometry_for_review` owns fresh validation, readiness, checkpoint, and review transition. Every non-zero rotation uses `rotate_cube_about_attachment`.

## Later stages

```text
TEXTURE
work/evidence → record_stage_review_report → submit_stage_for_review → review

ANIMATION when required
work/evidence → record_stage_review_report → submit_stage_for_review → review

FINAL_VALIDATION
verify Geometry readiness
→ validate_reference_contract(require_evidence=false) once
→ final evidence + export
→ record_stage_review_report
→ submit_stage_for_review
→ final review
→ complete_stage(FINAL_VALIDATION)
→ workspace completion
```

Submission runs fresh evidence-aware validation. If Texture/Animation submission fails validation, call `validate_reference_contract` once for structured diagnostics, repair only named issues, refresh evidence/report, and resubmit.

## Stage mapping

```text
GEOMETRY         → production + geometry  → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → production + texture   → BEDROCK_CUBOID_TEXTURE
ANIMATION        → production + animation → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → production + validation → FINAL_VALIDATION_READONLY
```

Maximum loaded production skills: two. Animation is not loaded when skipped.

## Import

Technical files → `workspace/active/<asset_id>/mcp/references/`

Visual/source files → `workspace/active/<asset_id>/blockbench/references/`

## Non-negotiable boundaries

- Do not redesign or invent parts, materials, clips, or proportions.
- Do not use removed repair profiles.
- Do not continue through a user review automatically.
- Do not reconnect MCP, reload the plugin, or start a new Codex session.
- Do not run mandatory Sol review for deterministic work.
- Do not poll runtime/context or duplicate validation.
- Do not use PBR, Hytale, mesh, armature, vertex weight, UI automation, or risky evaluation in the normal cuboid workflow.

## Session invariant

All stage changes continue in the same Codex and MCP session: the same Codex session and MCP session remain active from Geometry through workspace completion.
