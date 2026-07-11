---
name: blockbench-production
description: "Mandatory dispatcher for approved Blockbench asset production. Resolves the active workspace, acquires the write lease, loads exactly one stage skill, enforces the matching tool profile, and stops at the stage review gate."
---

# Blockbench Production

Use this skill only for production from an approved single-Reference-Visual package.

## Approved package boundary

A valid imported package contains:

```text
source/original_reference.*
PRODUCTION_CONTEXT.md
<asset_id>_reference_visual.png
GEOMETRY.md
TEXTURING.md
ANIMATION.md
VALIDATION.md
reference_manifest.json
CODEX_REFERENCE_HANDOFF.md
```

The Reference Visual is the sole visual authority. Technical Markdown and JSON translate it into executable constraints. Do not create replacement or additional technical reference images.

## Dispatch

1. Read `workspace/workspace.json` and resolve `selected_asset_id`.
2. Read `workspace/active/<asset>/mcp/project.json` and `mcp/state.json`.
3. Call `get_stage_context` for the active stage and use its compact result as the normal decision context.
4. Open full Markdown contracts only for a missing field, explicit conflict, or unresolved decision.
5. Resolve the stage and skill profile.
6. Verify the expected MCP tool profile from `engines/shared/profiles/stage-profiles.json`.
7. Acquire the single project write lease using the exact asset, project UUID, session root, state revision, and active stage.
8. Load exactly this dispatcher plus one stage skill.
9. Execute the smallest complete stage batch.
10. Stop at the required review gate.

## Geometry visual-grounding rule

A structural validator result is never sufficient proof of visual correctness. Geometry uses two complementary visual checks:

- Codex multimodal inspection of actual image payloads;
- deterministic silhouette/profile comparison.

Required flow:

```text
get_stage_context
→ inspect_reference_visual
→ build primary form
→ capture_visual_feedback
→ compare_reference_views
→ targeted correction
→ add structural detail
→ capture affected visual feedback
→ compare affected views
→ final five-view capture
→ final compare_reference_views
→ record_geometry_visual_result
→ validate_reference_contract
→ verify_geometry_visual_gate
→ checkpoint and user review
```

`return_images: false` is reserved for archival evidence after visual inspection, not for the feedback loop.

A deterministic score is a guardrail, not a replacement for Codex or user review. Both deterministic metrics and multimodal judgment must be current and PASS before Geometry approval.

## Geometry rotation rule

- Use `place_cubes_safe` and `modify_cubes` for Geometry mutations.
- Rotated cubes require an explicit origin/pivot.
- Prefer one local rotation axis per cube.
- Reject compound rotation unless the active contract explicitly requires it.
- Default absolute rotation limit is `45°`.
- After a rotated batch, inspect the affected view before continuing.
- World bounds and review framing must include cube and parent transforms.
- Any Geometry mutation invalidates prior visual metrics and reports.

## Revision classification

Before activating a repair profile, classify feedback:

- `LOCAL_REPAIR`: one part or tightly related pair; no broad primary-form change.
- `MAJOR_FORM_REVISION`: multiple primary masses or multiple views fail.
- `REFERENCE_REOPEN`: the approved reference itself must change.
- `REFERENCE_CONFLICT`: authorities disagree; stop.

Use `GEOMETRY_LOCAL_REPAIR` only for local scope. Use `GEOMETRY_VISUAL_REBUILD` for broad body/head/footprint failures while preserving prior checkpoints.

## Workspace boundary

```text
workspace/active/<asset>/
├─ blockbench/   # canonical model, textures, references, approved previews
└─ mcp/          # state, contracts, checkpoints, evidence, reports
```

Never put MCP state/checkpoints inside `blockbench/`, and never put the canonical model inside permanent MCP metadata folders.

## Efficiency rules

- Reuse fresh PASS readiness reports.
- Use paths from `mcp/project.json`; do not rescan the tree.
- Use `get_stage_context`; do not reload 300–500 line contracts for routine iterations.
- Load no more than two production skills.
- Use exact stage profiles only.
- Use bounded cube batches and one atomic `modify_cubes` call instead of many single-cube calls.
- Inspect the Reference Visual once per stage unless its hash changes.
- During internal Geometry passes, request only the views needed to diagnose the current issue.
- Maximum automatic correction cycles per internal pass: `2`.
- If the visual result does not improve twice, stop with `VISUAL_CONVERGENCE_FAILED`.
- Write full-resolution evidence to disk, but return only the image payloads needed for the current comparison.
- Do not use mesh, PBR, Hytale, armature, UI automation, or eval capabilities in the normal Bedrock cuboid workflow.

## Stage routing

```text
GEOMETRY         → blockbench-geometry
TEXTURE          → blockbench-texture
ANIMATION        → blockbench-animation only when required
FINAL_VALIDATION → blockbench-validation
```

## Stop conditions

Stop immediately on `REFERENCE_CONFLICT`, blocker, failed deterministic comparison, stale visual evidence, unsafe rotation, visual convergence failure, lease/state mismatch, required user review, or completion of active-stage acceptance criteria.
