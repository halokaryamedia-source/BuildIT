---
name: blockbench-reference-studio
description: "Create a complete Minecraft Bedrock / Blockbench reference candidate in ChatGPT using the Golden Sample design system, exactly two routine approvals, one generated Reference Visual, concise human contracts, and an executable schema-3.3 Codex handoff."
---

# Blockbench Reference Studio

Create the approved reference package in ChatGPT. Codex and MCP-Blockbench begin only after the package is complete.

## Language and boundary

- Speak with the user in Indonesian.
- Write production contracts, manifest values, labels, and Codex instructions in English.
- Preserve approved names, IDs, dimensions, filenames, and source identity.
- Do not connect to MCP, edit `.bbmodel`, acquire a lease, or simulate Blockbench production.

## Contract and package mode

Emit Reference Studio contract `3.3`, compatible with MCP-Blockbench `1.7.0+` and the one-session workflow.

- New work always starts as `reference_candidate` with `candidate_not_promoted`.
- `golden_sample` is a separately promoted repository baseline.
- Promotion preserves approved candidate files and exact Reference Visual hash.
- A Golden Sample is a reference package and quality benchmark, not a prebuilt model.

## Mandatory Golden Sample design system

Use the bundled or repository-tracked Black Rhinoceros Golden Sample as the prescriptive template for:

- landscape technical-board ratio;
- border, header, title, subtitle, panel-label, scale-marker, footer, spacing, and whitespace hierarchy;
- orthographic camera intent and consistent subject scale;
- concise Production Context and stage-document depth;
- executable manifest completeness;
- Codex/MCP handoff and validation quality.

Copy the design system, structure, and quality bar. Replace the rhinoceros subject completely. Never copy its anatomy, horns, proportions, palette, texture, or species-specific decisions into another asset.

A layout deviation is allowed only when a real format requirement makes the default grid impossible; record the reason in Production Context.

## Question and approval budget

Before Production Context approval:

1. inspect every supplied source;
2. extract visible facts and explicit instructions;
3. ask only `0–4` `LOW_CONFIDENCE_HIGH_IMPACT` questions;
4. batch questions into one turn when possible;
5. explain production impact and provide a recommended default;
6. never ask again for an approved or clearly visible fact.

Routine production has exactly two approval moments:

1. Production Context approval;
2. Reference Visual approval.

Technical documents, manifest, audit, and candidate ZIP are automatic after visual approval. Do not create a third routine approval. Golden Sample promotion is separate.

## Final package

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
- Maximum one targeted edit of that same image.
- The edit is used only for a blocking identity, camera, scale, crop, panel, label, or cross-view inconsistency—not optional polish.
- No image generation after Reference Visual approval.
- Hidden per-angle generation and additional technical sheets are forbidden.
- Source copies and runtime crops/diffs are evidence, not additional generated reference images.

## Phase 1 — Production Context

Prepare `PRODUCTION_CONTEXT.md` with four main categories:

1. Main Format;
2. Geometry;
3. Texture;
4. Animation.

Record identity, intended use, scale, front direction, ground plane, neutral pose, must-preserve features, interaction profile, symmetry policy, assumptions, constraints, unresolved blockers, and forbidden redesigns. Explain decisions in Indonesian and wait for explicit approval.

## Phase 2 — One Reference Visual

Generate one Golden-Sample-guided board containing:

- Left Side;
- Front;
- Back;
- Top / Footprint;
- Front-left 3/4;
- Right Side only when `symmetry_policy = ASYMMETRIC`;
- scale marker and compact footer.

Every panel must be rectangular, non-overlapping, measurable, fully framed, and consistent. Front, Left, Right, Back, and Top are orthographic in intent. Front-left 3/4 is controlled perspective.

Run one blocking QA pass. Use the single allowed targeted edit only when QA fails. Wait for explicit visual approval.

## Phase 3 — Automatic technical package

After visual approval, generate without further image creation:

- `GEOMETRY.md`;
- `TEXTURING.md`;
- `ANIMATION.md`;
- `VALIDATION.md`;
- `reference_manifest.json`;
- `CODEX_REFERENCE_HANDOFF.md`.

These files may add implementation precision but may not introduce a new visible design.

## Compact single-source writing rule

- Production Context owns decisions and assumptions.
- Reference Visual owns visible design.
- Manifest owns exact numeric arrays and executable contracts.
- Markdown stage files summarize build order, human rationale, and review expectations; do not repeat every crop, region, part, or rotation array.
- Handoff contains route and boundaries only.

## Executable manifest requirements

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

It must include:

- package identity, required files, image budget, promotion status, and exact visual hash/dimensions;
- Main Format envelope, `16u = 1 block`, ground plane, front direction, neutral pose, and interaction profile;
- `BILATERAL` pairs or explicit `ASYMMETRIC` contracts;
- all required panel crops with non-zero normalized coordinates, projection, scale basis, and threshold;
- weighted semantic regions with issue codes, parts, and targeted repair instructions;
- primary/critical part constraints with role, patterns, parent, reliable count/center/size ranges, views, and rotation IDs;
- one-axis rotation contracts with range, pivot/tip anchor, direction, connection, tolerance, and affected views;
- Texture atlas/UV/material/palette/alpha/color-budget/palette-drift limits;
- Animation required/skipped state, required clips, groups, pivots, duration, animator/keyframe, and root-motion limits;
- five base final views plus conditional `right_side` for asymmetric assets;
- required validation statuses and evidence.

Do not authorize compound rotation unless required. Prefer stepped cuboids over rotating major masses to fake taper.

## Automatic audit

Verify before ZIP delivery:

1. all required files exist;
2. exactly one generated Reference Visual exists;
3. numbered or additional technical PNGs are absent;
4. manifest and Markdown decisions agree;
5. hash and dimensions match the physical visual;
6. all required crops are valid and non-zero;
7. critical semantic regions and primary parts are covered;
8. every authorized rotation has a contract;
9. asymmetric assets contain measurable Right Side panel/crop;
10. `VALIDATION.md` begins `PENDING_BUILD`;
11. handoff uses current MCP tools and one-session semantics;
12. ZIP contains one canonical package root and no draft/backup/version duplicates.

## Authority order

1. `PRODUCTION_CONTEXT.md` — intent, scale, decisions, assumptions, constraints;
2. approved Reference Visual — visible identity, silhouette, proportions, pose, appearance;
3. `reference_manifest.json` — executable numeric contracts;
4. `GEOMETRY.md`, `TEXTURING.md`, `ANIMATION.md`, `VALIDATION.md` — concise human procedure;
5. `CODEX_REFERENCE_HANDOFF.md` — route and boundaries.

Use `REFERENCE_CONFLICT` when authorities cannot be reconciled without guessing.

## Codex handoff route

```text
get_stage_context
→ rebind_active_project_identity when required
→ one selected Terra writer acquires manage_project_write_lease
→ inspect_reference_visual_preview once per unchanged hash
→ zero-start: build primary form from manifest before first capture/analyze
   existing/revision: capture affected views and analyze first
→ bounded diagnosed edits
→ final manifest-required view diagnosis with write_diff_image=true
→ conditional visual_director judgment only when deterministic evidence cannot close the visual decision
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
→ user review
```

Every non-zero rotation uses `rotate_cube_about_attachment`. Submission owns fresh validation and review transition; do not add duplicate validation immediately before it. Texture cannot begin before Geometry approval.

## Stop conditions

Stop when Production Context is unapproved, the Reference Visual still has a blocking inconsistency after one targeted edit, required crops/contracts cannot be derived safely, technical files redesign the asset, package authorities conflict, files are missing, more than one generated visual exists, or MCP execution is requested before package completion.

## Compatibility invariants

- Include Right Side when `symmetry_policy` is `ASYMMETRIC`.
- The Geometry handoff ends with a final required-view diagnosis.
- All production stages continue in the same Codex and MCP session—the same Codex session and MCP session—without reconnect.
