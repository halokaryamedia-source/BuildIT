---
name: blockbench-production
description: "Mandatory dispatcher for approved Blockbench asset production. Resolves one active workspace, rejects legacy context, acquires the write lease, loads exactly one stage skill, enforces the exact tool profile, and stops at each user review gate."
---

# Blockbench Production

Use only for production from an approved single-Reference-Visual package.

## Authority and legacy-context boundary

Runtime authority is the current repository plus the selected asset session:

```text
AGENTS.md
engines/shared/
workspace/workspace.json
workspace/active/<asset>/mcp/state.json
workspace/active/<asset>/mcp/references/
```

Do not load an external project-context ZIP, copied chat context, or stale instruction set as production authority. Stop with `LEGACY_SKILL_CONFLICT` if any active instruction requires:

- four mandatory technical sheets;
- three approval moments;
- `01_*`, `02_*`, `03_*`, or `04_*` reference images;
- a technical image beyond the single approved Reference Visual.

A valid package contains:

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

The Reference Visual is the sole visual authority. Markdown and JSON convert it into implementation constraints; they do not replace visual inspection.

## Dispatch

1. Resolve `selected_asset_id` from `workspace/workspace.json`.
2. Read exact paths from `mcp/project.json` and runtime authority from `mcp/state.json`.
3. Call `get_stage_context`; use its compact result for ordinary decisions.
4. Open full contracts only for a missing field, unresolved conflict, or explicit authority audit.
5. Resolve the stage profile from `engines/shared/profiles/stage-profiles.json`.
6. Verify the active tool profile exactly matches the stage or classified repair route.
7. Acquire `manage_project_write_lease` with exact asset, session root, project UUID, state revision, and active stage.
8. Load this dispatcher plus exactly one stage skill.
9. Execute the smallest complete stage batch.
10. Stop at the required user review gate.

## Geometry quality contract

Geometry is not allowed to guess broadly from text. It must use both:

1. actual image payload inspection by Codex;
2. fixed-scale machine diagnosis from transformed cuboids.

Required route:

```text
get_stage_context
→ inspect_reference_visual
→ build PRIMARY_FORM only
→ capture_visual_feedback: left + front + top
→ analyze_geometry_views: left + front + top
→ repair only ranked affected parts
→ build STRUCTURAL_DETAIL
→ capture affected views
→ analyze affected views
→ final five-view capture
→ final five-view analyze_geometry_views
→ record_geometry_visual_result
→ validate_geometry_contract
→ verify_geometry_review_ready
→ checkpoint
→ user review
```

`analyze_geometry_views` is the normal deterministic authority. It must report:

- failing view and semantic region;
- missing versus excess silhouette;
- direction and approximate magnitude in Blockbench units;
- affected part/group candidates;
- recommended repair scope and profile.

Codex must modify those named parts or stop with a conflict. It must not make unrelated trial-and-error changes.

The analyzer uses the approved coordinate envelope, center axis, and ground line. Free-rescaling the current model to fit the reference is forbidden.

## Geometry runtime phases

The MCP runtime enforces:

```text
PRIMARY_FORM
→ STRUCTURAL_DETAIL
→ FINAL_REVIEW_READY
```

During `PRIMARY_FORM`, horns, ears, final feet, tail, micro-detail, and unrelated segmentation are blocked. Detail unlocks only after Left, Front, and Top fixed-scale diagnosis plus multimodal inspection pass.

Two consecutive non-improving cycles produce:

```text
VISUAL_CONVERGENCE_FAILED
```

Stop instead of spending more calls on random alternatives.

## Rotation contract

Do not pass a non-zero `rotation` through generic cube placement or modification.

Use:

```text
rotate_cube_about_attachment
```

The tool must:

- resolve a machine-readable part contract;
- derive the intended attachment pivot;
- enforce allowed axis, sign, and range;
- verify expected world-space direction;
- verify declared segment connection;
- run affected-view diagnosis before and after;
- automatically roll back a visual regression.

Use stepped cuboids rather than rotating large torso masses to fake taper.

## Revision classification

- `LOCAL_REPAIR`: one part or tightly related pair; primary form remains acceptable.
- `MAJOR_FORM_REVISION`: multiple primary masses or multiple views fail, or local repair does not converge.
- `REFERENCE_REOPEN`: approved design itself must change.
- `REFERENCE_CONFLICT`: authorities disagree; stop.

Use `GEOMETRY_LOCAL_REPAIR` only for local scope. Use `GEOMETRY_VISUAL_REBUILD` for broad body/head/footprint reconstruction. Both receive identical Geometry, phase, validation, and rotation guards.

## Efficiency rules

- Do not rescan known workspace paths.
- Reuse fresh readiness and connection reports.
- Inspect the Reference Visual once unless its hash changes.
- Load no more than two production skills.
- Prefer one bounded `modify_cubes` transaction over many single-cube calls.
- Use three diagnostic views for primary form, then only affected views, then one final five-view pass.
- Return image payloads only when Codex must inspect them; archive full-resolution evidence to disk.
- Maximum automatic correction cycles per internal pass: `2`.
- Do not load mesh, PBR, Hytale, armature, UI automation, eval, or unrelated tools in normal Bedrock cuboid production.

## Workspace boundary

```text
workspace/active/<asset>/
├─ blockbench/   # canonical model, textures, references, approved previews
└─ mcp/          # state, contracts, checkpoints, evidence, reports
```

Never mix the two areas.

## Stage routing

```text
GEOMETRY         → blockbench-geometry
TEXTURE          → blockbench-texture
ANIMATION        → blockbench-animation only when required
FINAL_VALIDATION → blockbench-validation
```

## Stop conditions

Stop on `LEGACY_SKILL_CONFLICT`, `REFERENCE_CONFLICT`, missing reference profile, failed primary-form gate, failed fixed-scale diagnosis, stale visual evidence, unsafe rotation, visual convergence failure, lease/state/profile mismatch, or required user review.
