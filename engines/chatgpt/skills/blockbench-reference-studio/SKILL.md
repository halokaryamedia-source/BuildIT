---
name: blockbench-reference-studio
description: "Create a complete Minecraft Bedrock / Blockbench reference candidate in ChatGPT using the Golden Sample's cuboid construction language, exactly two routine approvals, one generated Minecraft-only Reference Visual, concise human contracts, and an executable schema-3.3 Codex handoff."
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

- actual Minecraft / Blockbench cuboid construction language;
- intentional primary and secondary masses;
- varied rectangular-cuboid sizes and proportions;
- stepped form transitions and limited purposeful rotations;
- landscape technical-board ratio;
- border, header, title, subtitle, panel-label, scale-marker, footer, spacing, and whitespace hierarchy;
- orthographic camera intent, panel position, facing direction, and consistent subject scale;
- concise Production Context and stage-document depth;
- executable manifest completeness;
- Codex/MCP handoff and validation quality.

Copy the construction language, design system, structure, and quality bar. Replace the rhinoceros subject completely. Never copy its anatomy, horns, proportions, palette, texture, or species-specific decisions into another asset.

The rule is:

```text
COPY THE MINECRAFT CONSTRUCTION LANGUAGE AND QUALITY BAR.
REPLACE THE SUBJECT.
```

A layout deviation is allowed only when a real format requirement makes the default grid impossible; record the reason in Production Context.

## Minecraft-only subject construction lock

This skill is specialized. There is no realistic, semi-realistic-render, smooth-organic, cinematic, generic-voxel, or non-Minecraft style branch.

The source image controls identity, recognizable features, proportions, markings, and attachments. It does **not** control rendering style. Every generated subject must be reconstructed as an **actual Minecraft Bedrock / Blockbench cuboid model**.

Mandatory construction characteristics:

- clearly decomposable cuboid primary masses;
- deliberate variation in cuboid width, height, and depth;
- readable hierarchy and separable parts;
- stepped cuboids for controlled taper and silhouette transitions;
- limited purposeful one-axis rotations where an approved angled feature requires them;
- mostly stable major masses, with rotations concentrated on justified attachments or angled structural details;
- crisp Minecraft pixel-art texture rather than photographic material rendering;
- a form that Codex can reproduce using the existing Geometry contract.

`cuboid-first` does not mean uniform cube stacking. The result fails when it is a pile of repeated same-sized boxes without mass planning, silhouette logic, size variation, or justified angled forms.

Pixelated texture alone is never sufficient. A smooth realistic animal, object, or character with pixelated skin remains `PIXEL_TEXTURE_ONLY` and must be rejected.

Do not ask the user to choose a visual style. The style is permanently locked to Minecraft Bedrock / Blockbench cuboid pixel art. Ask only about subject-specific decisions that materially change Geometry, Texture, Animation, scale, symmetry, or interaction.

## Question and approval budget

Before Production Context approval:

1. inspect every supplied source;
2. extract visible facts and explicit instructions;
3. apply the mandatory Minecraft-only construction lock automatically;
4. ask only `0–4` `LOW_CONFIDENCE_HIGH_IMPACT` questions;
5. batch questions into one turn when possible;
6. explain production impact and provide a recommended default;
7. never ask again for an approved or clearly visible fact;
8. never ask for realistic-versus-Minecraft, stylization level, rendering style, or whether cuboid construction should be used.

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
- The edit is used only for a blocking Minecraft-style, identity, camera, scale, crop, panel, label, or cross-view inconsistency—not optional polish.
- A global style failure may use the one allowed edit to convert the same result into the mandatory Minecraft cuboid construction while preserving identity and approved decisions.
- No image generation after Reference Visual approval.
- Hidden per-angle generation and additional technical sheets are forbidden.
- Source copies and runtime crops/diffs are evidence, not additional generated reference images.
- Never show a failed draft to the user for approval.

## Phase 1 — Production Context

Prepare `PRODUCTION_CONTEXT.md` with four main categories:

1. Main Format;
2. Geometry;
3. Texture;
4. Animation.

Record identity, intended use, scale, front direction, ground plane, neutral pose, must-preserve features, interaction profile, symmetry policy, assumptions, constraints, unresolved blockers, forbidden redesigns, and the mandatory Minecraft construction interpretation.

The Geometry section must preserve the existing modelling discipline:

- primary masses first;
- varied cuboid dimensions;
- planned segmentation and hierarchy;
- stepped cuboids before unnecessary major-mass rotation;
- limited purposeful rotation for approved angled parts;
- no uniform cube piling, micro-cube clutter, smooth mesh anatomy, or arbitrary rotation noise.

Explain decisions in Indonesian and wait for explicit approval.

## Phase 2 — One Reference Visual

Generate one Golden-Sample-guided Minecraft cuboid board containing:

- Left Side;
- Front;
- Back;
- Top / Footprint;
- Front-left 3/4;
- Right Side only when `symmetry_policy = ASYMMETRIC`;
- scale marker and compact footer.

Mandatory Golden Sample position lock for bilateral assets:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

- Left Side is a strict profile facing left, with the head/front at the left and rear/tail at the right.
- Front and Back are upright, centered, and use the same displayed height and ground line.
- Top / Footprint is true top-down, with the head/front pointing left and rear/tail pointing right.
- Front-left 3/4 shows both the front and left planes, keeps the subject facing left, and remains clearly distinct from Left Side.
- Asymmetric assets add the Right Side using the controlled six-panel layout without changing the construction language.

Every panel must be rectangular, non-overlapping, measurable, fully framed, and consistent. Front, Left, Right, Back, and Top are orthographic in intent. Front-left 3/4 is controlled perspective.

The board must render the same actual cuboid model in every panel. Camera changes; subject geometry does not.

## Blocking Reference Visual QA

Run QA before the image is shown to the user. Evaluate in this order:

1. Minecraft cuboid construction and Blockbench buildability;
2. Golden Sample layout, panel position, facing direction, and camera lock;
3. identity and must-preserve features;
4. proportions, segment counts, scale, pose, and ground contact;
5. cross-view geometry, texture, material, and attachment consistency;
6. label readability and panel completeness.

Automatic blocking failure codes include:

```text
NON_MINECRAFT_GEOMETRY
REALISTIC_ORGANIC_RENDER
PIXEL_TEXTURE_ONLY
GENERIC_VOXEL_FILTER
UNPLANNED_CUBE_STACKING
INSUFFICIENT_CUBOID_VARIATION
MISSING_REQUIRED_ANGLED_FORM
EXCESSIVE_ROTATION_NOISE
NON_BLOCKBENCH_BUILDABLE_FORM
GOLDEN_SAMPLE_CONSTRUCTION_DRIFT
GOLDEN_SAMPLE_LAYOUT_DRIFT
CAMERA_POSITION_DRIFT
TOP_VIEW_NOT_FOOTPRINT
CROSS_VIEW_MODEL_DRIFT
```

A result with realistic anatomy, smooth organic surfaces, rounded mesh-like masses, photographic fur/skin, or only a pixelated surface treatment fails even when its labels and panel layout are correct.

A result also fails when cuboids are merely stacked uniformly without meaningful size variation, planned massing, stepped transitions, or purposeful angled details required by the approved subject.

Use the single allowed targeted edit only when QA fails. If any blocking issue remains after that edit, stop and report the exact failure codes. Do not show the image as approval-ready and do not generate a second board.

Only a QA-passing Reference Visual may enter Reference Visual review.

## Phase 3 — Automatic technical package

After visual approval, generate without further image creation:

- `GEOMETRY.md`;
- `TEXTURING.md`;
- `ANIMATION.md`;
- `VALIDATION.md`;
- `reference_manifest.json`;
- `CODEX_REFERENCE_HANDOFF.md`.

These files may add implementation precision but may not introduce a new visible design or change the approved construction language.

## Compact single-source writing rule

- Production Context owns decisions and assumptions.
- Reference Visual owns visible design and approved Minecraft construction appearance.
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

Do not authorize compound rotation unless required. Prefer stepped cuboids over rotating major masses to fake taper. Do not remove approved purposeful rotations merely to make the model easier to stack.

## Automatic audit

Verify before ZIP delivery:

1. all required files exist;
2. exactly one generated Reference Visual exists;
3. the approved visual passed every Minecraft-style and Golden Sample blocking gate;
4. numbered or additional technical PNGs are absent;
5. manifest and Markdown decisions agree;
6. hash and dimensions match the physical visual;
7. all required crops are valid and non-zero;
8. critical semantic regions and primary parts are covered;
9. every authorized rotation has a contract;
10. asymmetric assets contain measurable Right Side panel/crop;
11. `VALIDATION.md` begins `PENDING_BUILD`;
12. handoff uses current MCP tools and one-session semantics;
13. ZIP contains one canonical package root and no draft/backup/version duplicates.

## Authority order

1. `PRODUCTION_CONTEXT.md` — intent, scale, decisions, assumptions, constraints;
2. approved Reference Visual — visible identity, Minecraft cuboid construction, silhouette, proportions, pose, appearance;
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

Stop when Production Context is unapproved, the generated visual is not an actual Minecraft cuboid model, the Reference Visual still has a blocking style/camera/identity inconsistency after one targeted edit, required crops/contracts cannot be derived safely, technical files redesign the asset, package authorities conflict, files are missing, more than one generated visual exists, or MCP execution is requested before package completion.

## Compatibility invariants

- Include Right Side when `symmetry_policy` is `ASYMMETRIC`.
- The Geometry handoff ends with a final required-view diagnosis.
- All production stages continue in the same Codex and MCP session—the same Codex session and MCP session—without reconnect.
