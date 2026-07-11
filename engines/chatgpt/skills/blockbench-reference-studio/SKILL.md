---
name: blockbench-reference-studio
description: "Create a complete approved Minecraft Bedrock / Blockbench reference package in ChatGPT using one generated Reference Visual, then hand the Markdown/JSON package to Codex and MCP-Blockbench. Do not use for direct Blockbench modelling."
---

# Blockbench Reference Studio

Create the complete reference package in ChatGPT. Codex and MCP-Blockbench are not involved until the package is approved and complete.

## Language

- Speak with the user in Indonesian.
- Write production contracts, manifest data, labels, and Codex handoff instructions in English.
- Preserve approved asset names, IDs, dimensions, and filenames exactly.

## Responsibility boundary

```text
ChatGPT
source image
→ Production Context
→ one approved Reference Visual
→ Geometry/Texture/Animation/Validation contracts
→ reference manifest
→ Codex handoff
→ final package

Codex + MCP-Blockbench
approved package
→ validate/import
→ visually grounded staged production
→ .bbmodel
```

Do not connect to MCP, edit `.bbmodel`, acquire a write lease, or simulate Codex execution from this skill.

## Final package

Produce exactly:

```text
<asset_id>_blockbench_reference/
├─ source/
│  └─ original_reference.<ext>
├─ PRODUCTION_CONTEXT.md
├─ <asset_id>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

Then create:

```text
<asset_id>_blockbench_reference.zip
```

## Image-generation lock

- Normal generated images: exactly `1`.
- Canonical generated image: `<asset_id>_reference_visual.png`.
- Maximum targeted correction before approval: `1` edit of the same visual.
- Generated images after Reference Visual approval: `0`.
- Hidden per-angle generation: forbidden.
- Geometry, construction, texture, material, UV, motion, pivot, animation, pose, or extra-view sheets: forbidden.
- The original source copy is input evidence and is not counted as generated output.

## Mandatory flow

### Phase 1 — Production Context

1. Review the source image and user notes.
2. Do not generate an image yet.
3. Prepare `PRODUCTION_CONTEXT.md` with exactly four main categories:
   - Main Format;
   - Geometry;
   - Texture;
   - Animation.
4. Include asset identity, intended use, scale, front direction, neutral pose, must-preserve features, interaction profile, assumptions, constraints, and forbidden redesigns inside those categories.
5. Explain the decisions in Indonesian.
6. Wait for explicit Production Context approval.

Retain approved context; never ask the user to repeat it.

### Phase 2 — One Reference Visual

Generate one clean board containing all required views inside one canvas:

- Left Side;
- Front;
- Back;
- Top / Footprint;
- Front-left 3/4;
- scale marker;
- compact technical footer.

The views must show the same design, scale, proportions, pose, features, and material family. Do not generate each view separately.

Run automatic QA. When necessary, perform at most one targeted edit of the same image. Then wait for explicit Reference Visual approval.

### Phase 3 — Automatic technical package

After Reference Visual approval, generate without further image creation or routine approval:

- `GEOMETRY.md`;
- `TEXTURING.md`;
- `ANIMATION.md`;
- `VALIDATION.md`;
- `reference_manifest.json`;
- `CODEX_REFERENCE_HANDOFF.md`.

These files translate approved decisions and the single Reference Visual into implementation requirements. They must not introduce a new design decision.

### Phase 4 — Audit and package

1. Verify all required files exist.
2. Verify there is exactly one generated Reference Visual.
3. Verify forbidden numbered or technical PNG files are absent.
4. Verify manifest values match all Markdown contracts.
5. Verify the Reference Visual hash and dimensions.
6. Verify `VALIDATION.md` starts as `PENDING_BUILD`.
7. Create the final ZIP.

## Authority order

1. `PRODUCTION_CONTEXT.md`: intent, scale, constraints, assumptions, resolved decisions.
2. `<asset_id>_reference_visual.png`: sole visual authority for identity, silhouette, proportions, pose, cross-view consistency, and visible material appearance.
3. `GEOMETRY.md`: buildable cuboid form, hierarchy, pivots, segmentation, ground contacts, and rotation policy.
4. `TEXTURING.md`: atlas, UV, palette, material zones, and pixel-detail rules.
5. `ANIMATION.md`: required clips or explicit `ANIMATION_SKIPPED`, plus pivot readiness.
6. `VALIDATION.md`: post-build acceptance tests.
7. `reference_manifest.json`: machine-readable lock and file inventory.
8. `CODEX_REFERENCE_HANDOFF.md`: import, stage, visual-grounding, and stop rules.

Conflicts must stop as `REFERENCE_CONFLICT`; never silently redesign.

## Geometry contract requirements

`GEOMETRY.md` must include:

- approved envelope and coordinate convention;
- primary form ratios per standard view;
- hierarchy and build order;
- approximate part sizes/positions;
- geometry-only versus texture-only features;
- allowed segment counts;
- ground contacts;
- cube-density range;
- rotation and pivot guidance.

Rotation guidance must state:

- explicit pivot required for rotated cubes;
- one local axis preferred;
- avoid compound rotation unless essential;
- use stepped cuboids instead of rotating large masses to fake taper;
- inspect affected Side/3/4 view after rotation;
- world bounds must include transforms.

## Codex visual-grounding contract

`CODEX_REFERENCE_HANDOFF.md` must require:

```text
inspect_reference_visual
→ coarse primary form
→ capture_visual_feedback
→ targeted repair
→ structural detail
→ final five-view visual gate
→ structural validation
→ user review
```

A structural PASS must not be treated as a visual PASS. Codex must use safe batch Geometry mutation tools and must not enter Texture until Geometry is explicitly approved.

## Manifest requirements

The manifest must record at minimum:

```json
{
  "workflow": {
    "approval_moments": 2,
    "normal_image_generations": 1,
    "targeted_edit_max": 1,
    "post_visual_image_generations": 0,
    "hidden_per_angle_generation_allowed": false,
    "additional_technical_images_allowed": false
  }
}
```

It must also record package paths, Reference Visual hash/dimensions, scale, geometry strategy, hierarchy, segment counts, texture configuration, animation readiness, validation requirements, and unresolved blockers.

## Stop conditions

Stop and report when:

- Production Context is not approved;
- Reference Visual identity or cross-view consistency remains invalid after one targeted edit;
- a technical contract introduces a new design;
- files conflict or are missing;
- more than one generated Reference Visual exists;
- the user requests MCP execution before the package is complete.
