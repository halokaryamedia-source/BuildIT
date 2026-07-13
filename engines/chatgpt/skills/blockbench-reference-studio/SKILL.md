---
name: blockbench-reference-studio
description: "Create a complete approved Minecraft Bedrock / Blockbench reference candidate or Golden Sample package in ChatGPT using one generated Reference Visual, then produce synchronized machine-readable Geometry, Texture, Animation, Validation, and Codex handoff contracts."
---

# Blockbench Reference Studio

Create the complete reference package in ChatGPT. Codex and MCP-Blockbench begin only after the package is approved and complete.

## Language

- Speak with the user in Indonesian.
- Write production contracts, manifest data, labels, and handoff instructions in English.
- Preserve approved names, IDs, dimensions, and filenames exactly.

## Responsibility boundary

```text
ChatGPT
source image
→ Production Context
→ one approved Reference Visual
→ Geometry/Texture/Animation/Validation contracts
→ machine-readable panel, region, part, and rotation data
→ Codex handoff
→ final package

Codex + MCP-Blockbench
approved package
→ visually grounded fixed-scale production
→ .bbmodel
```

Do not connect to MCP, edit `.bbmodel`, acquire a lease, or simulate production from this skill.

## Contract version and sample modes

This skill emits Reference Studio contract `3.3`, compatible with MCP-Blockbench `1.7.0+` and the one-session Codex workflow.

Choose exactly one package mode before writing files:

- `reference_candidate`: a fresh sample package awaiting promotion. Use this for every newly created sample reference.
- `golden_sample`: a repository-tracked baseline that has already passed package audit, automated repository verification, and explicit promotion approval.

When the user asks to create a new sample reference:

1. use a fresh `asset_id` and set `sample_type` to `reference_candidate`;
2. never copy an existing `.bbmodel`, checkpoint, evidence, runtime identity, or Golden Sample manifest;
3. complete the normal Production Context and Reference Visual approvals;
4. generate the full package and ZIP with `promotion_status = candidate_not_promoted`;
5. stop after package audit and user approval—the candidate must not silently replace a tracked Golden Sample;
6. promote only through a repository update that changes `sample_type` to `golden_sample`, records the exact visual hash, preserves the candidate files byte-for-byte, and leaves local MCP production acceptance explicitly pending until tested.

A Golden Sample is a promoted reference package, not a prebuilt Blockbench model.

## Final package

Produce exactly:

```text
<asset_id>_blockbench_reference/
├─ source/original_reference.<ext>
├─ PRODUCTION_CONTEXT.md
├─ <asset_id>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

Then create `<asset_id>_blockbench_reference.zip`.

## Image-generation lock

- Exactly one normal generated image: `<asset_id>_reference_visual.png`.
- Maximum one targeted edit of that same visual before approval.
- No generated images after Reference Visual approval.
- Hidden per-angle generation is forbidden.
- Geometry, construction, texture, UV, material, motion, pivot, animation, pose, or extra-view sheets are forbidden.
- The original source copy is input evidence, not generated output.
- Runtime crops, masks, projections, and diff images are derived evidence, not additional reference images.

## Mandatory flow

### Phase 1 — Production Context

Prepare `PRODUCTION_CONTEXT.md` before image generation with exactly four main categories:

1. Main Format
2. Geometry
3. Texture
4. Animation

Inside them record identity, intended use, approved scale, front direction, ground plane, neutral pose, must-preserve features, interaction profile, assumptions, constraints, and forbidden redesigns. Explain in Indonesian and wait for explicit approval.

### Phase 2 — One Reference Visual

Generate one board containing:

- Left Side;
- Right Side when `symmetry_policy` is `ASYMMETRIC`;
- Front;
- Back;
- Top / Footprint;
- Front-left 3/4;
- scale marker;
- compact footer.

Every panel must be rectangular, non-overlapping, measurable, and contain the complete subject with stable margin. Front, Left, Back, and Top are orthographic in intent. Front-left 3/4 may use perspective. Do not let decorative elements cross subject panels.

Run QA and at most one targeted edit. Wait for explicit approval.

### Phase 3 — Automatic technical package

After visual approval, generate without further image creation:

- `GEOMETRY.md`;
- `TEXTURING.md`;
- `ANIMATION.md`;
- `VALIDATION.md`;
- `reference_manifest.json`;
- `CODEX_REFERENCE_HANDOFF.md`.

These files may add technical precision but may not introduce a new visible design.

### Phase 4 — Machine-readable Geometry data

The manifest must include data that allows MCP to diagnose errors rather than guess.

#### Package identity and compatibility

`reference_manifest.json` must declare:

```json
{
  "schema_version": "3.3",
  "sample_type": "reference_candidate",
  "contract": {
    "reference_studio": "3.3",
    "mcp_blockbench_minimum": "1.7.0",
    "workflow": "single_reference_visual_one_session"
  }
}
```

For a promoted repository baseline, use `sample_type = golden_sample` and `promotion_status = promoted_golden_sample`. Do not change the approved Reference Visual or its SHA-256 during promotion.

Every package must also declare:

- `geometry.symmetry_policy` as `BILATERAL` or `ASYMMETRIC`;
- bilateral pairs or explicit asymmetry contracts;
- executable part-count, parent, size, center, and rotation contracts where reliable;
- Texture quality limits for alpha, visible coverage, color budget, and palette drift;
- Animation quality limits for required clips, duration, animator/keyframe presence, group references, and root-motion policy;
- five base final views, plus conditional `right_side` when `ASYMMETRIC`.

#### Panel crops

For the five base views—and `right_side` whenever `symmetry_policy` is `ASYMMETRIC`—record normalized `[x, y, width, height]` values in full-image `0..1` space. Every required crop must:

- have positive width and height;
- stay inside the image;
- isolate the intended complete subject;
- declare projection and minimum score;
- use no zero placeholder in the final package.

#### Semantic view regions

For each panel define weighted normalized regions for silhouette-critical areas. Use asset-specific regions such as:

- head/muzzle;
- shoulder/front mass;
- central torso;
- rear taper;
- legs/ground support;
- horns/ears/tail;
- top footprint;
- 3/4 identity.

Each region records:

```json
{
  "id": "<region_id>",
  "rect": [0.0, 0.0, 1.0, 1.0],
  "weight": 1.0,
  "minimum_score": 0.6,
  "critical": true,
  "issue_code": "<UPPERCASE_CODE>",
  "parts": ["<group_or_part>"],
  "recommendation": "Specific repair instruction"
}
```

Critical identity regions may fail the view even when whole-body overlap is moderate.

#### Part constraints

For every primary mass and silhouette-critical detail record:

- canonical ID and name patterns;
- phase role: `PRIMARY_MASS`, `PROVISIONAL_SUPPORT`, or `STRUCTURAL_DETAIL`;
- parent group;
- approximate center and size ranges when reliable;
- required standard views;
- rotation contract ID when applicable.

#### Rotation contracts

For each intentionally rotated part record:

- matching cube names;
- one allowed axis;
- minimum and maximum angle;
- pivot anchor;
- tip anchor;
- expected world-space direction vector;
- minimum direction alignment;
- optional connection target/anchor/tolerance;
- affected review views.

Do not authorize compound rotation unless the design truly requires it. Use stepped cuboids instead of rotating large masses to fake taper.

### Phase 5 — Audit and package

Verify:

1. every required file exists;
2. exactly one generated Reference Visual exists;
3. numbered/technical PNGs are absent;
4. manifest and Markdown decisions agree;
5. Reference Visual hash and dimensions match;
6. all five base crops are non-zero and valid, plus a non-zero `right_side` crop when `symmetry_policy` is `ASYMMETRIC`;
7. semantic regions cover identity-critical silhouette areas;
8. part constraints cover primary masses and critical details;
9. all authorized rotations have contracts;
10. asymmetric assets include a measurable Right Side panel and crop;
11. `VALIDATION.md` starts `PENDING_BUILD`;
12. handoff names the final MCP tools;
13. final ZIP contains only approved package files.

## Authority order

1. `PRODUCTION_CONTEXT.md`: intent, scale, constraints, assumptions.
2. Reference Visual: sole visual authority for identity, silhouette, proportions, pose, and appearance.
3. `GEOMETRY.md`: build order, dimensions, hierarchy, pivots, segmentation, ground contacts, and rotation intent.
4. Manifest Geometry data: executable panel/region/part/rotation contracts.
5. `TEXTURING.md`.
6. `ANIMATION.md`.
7. `VALIDATION.md`.
8. `CODEX_REFERENCE_HANDOFF.md`.

Stop `REFERENCE_CONFLICT` when authorities cannot be reconciled without guessing.

## Codex handoff contract

Require this Geometry route:

```text
get_stage_context
→ rebind_active_project_identity when required
→ selected Terra writer acquires manage_project_write_lease
→ inspect_reference_visual_preview
→ PRIMARY_FORM
→ capture_visual_feedback
→ analyze_geometry_views
→ targeted repair from ranked diagnostics
→ STRUCTURAL_DETAIL
→ affected-view diagnosis
→ final required-view diagnosis with write_diff_image=true (five base views plus `right_side` when `ASYMMETRIC`)
→ visual_director final acceptance only when needed
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
→ user review
```

Require `rotate_cube_about_attachment` for every non-zero cube rotation. `submit_geometry_for_review` performs fresh Geometry validation and its embedded readiness gate, so the handoff must not add duplicate validation calls. Require `complete_geometry_stage` only after explicit approval. Forbid free-rescaling, unrelated trial-and-error changes, removed repair profiles, and Texture before Geometry approval.

## Stop conditions

Stop and report when Production Context is unapproved, Reference Visual remains inconsistent after one edit, panel crops cannot be isolated, semantic/part/rotation contracts cannot be derived safely, technical documents redesign the asset, files conflict or are missing, more than one generated visual exists, or MCP execution is requested before package completion.
