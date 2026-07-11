---
name: blockbench-reference-studio
description: "Create a complete approved Minecraft Bedrock / Blockbench reference package in ChatGPT, then hand the final ZIP to Codex and MCP-Blockbench. Use for source-image analysis, production context, reference sheets, stage contracts, manifest, and Codex handoff. Do not use for direct Blockbench modelling."
---

# Blockbench Reference Studio

Create the complete reference package in ChatGPT. Codex and MCP-Blockbench are not involved until the approved ZIP exists.

## Language

- Speak with the user in Indonesian.
- Write production specifications, sheet labels, manifests, and Codex handoff documents in English.
- Preserve approved asset names, IDs, dimensions, and filenames exactly.

## Responsibility boundary

```text
ChatGPT
source image
→ Production Context
→ four approved sheets
→ Geometry/Texture/Animation/Validation contracts
→ reference manifest
→ Codex handoff
→ final ZIP

Codex + MCP-Blockbench
final ZIP
→ validate and import
→ build .bbmodel through staged production skills
```

Do not connect to MCP, edit `.bbmodel`, acquire a write lease, or simulate Codex execution from this skill.

## Final package

Produce exactly:

```text
<asset_id>_blockbench_reference/
├─ source/
├─ PRODUCTION_CONTEXT.md
├─ <asset_id>_reference_visual.png
├─ 01_<asset_id>_form_scale_reference.png
├─ 02_<asset_id>_construction_reference.png
├─ 03_<asset_id>_texture_material_reference.png
├─ 04_<asset_id>_motion_pivot_reference.png
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

`<asset_id>_reference_visual.png` must be a byte-identical handoff alias of Sheet 01. It is not a second visual authority.

## Efficiency target

- Normal image-generation calls: `1`
- Maximum targeted correction: `1`
- Subject regeneration for Sheets 02–04: `0`
- Mandatory user approval gates: `3`

Do not generate hidden orthographic images individually unless the user explicitly reopens the efficiency decision.

## Mandatory flow

### Phase 1 — Production Context

1. Review the source image and user notes.
2. Do not generate an image yet.
3. Prepare `PRODUCTION_CONTEXT.md` with:
   - Main Format
   - Asset Identity
   - Scale
   - Geometry
   - Texture
   - Animation
   - Validation
4. Explain the decisions in Indonesian.
5. Wait for explicit approval.

After approval, retain:

- Canonical Asset Lock
- Structural Fingerprint
- Camera Lock
- Render Lock
- Revision Baseline

The user must not be asked to repeat approved context.

### Phase 2 — One Turnaround Generation

Generate one clean board containing only:

- Front orthographic
- Left-side orthographic
- Back orthographic
- Front-left three-quarter preview

Do not ask the image model to create technical labels, dimensions, hierarchy, footprint, UV, palette, or pivots.

Use the exact approved source, asset lock, camera lock, render lock, and accepted result in every revision.

Run automatic QA. When required, perform at most one targeted correction of the same image.

### Phase 3 — Deterministic Sheet 01

Compose:

```text
01_<asset_id>_form_scale_reference.png
```

Add exact text and measurements programmatically:

- display name
- view labels
- asset envelope
- `16u = 1 block`
- front direction
- ground line
- fixed borders and footer

Create the byte-identical alias:

```text
<asset_id>_reference_visual.png
```

Request Approval Gate 1.

### Phase 4 — Deterministic Sheets 02–04

After Sheet 01 approval, derive without new subject generation:

```text
02_<asset_id>_construction_reference.png
03_<asset_id>_texture_material_reference.png
04_<asset_id>_motion_pivot_reference.png
```

- Sheet 02: hierarchy, part construction, attachments, geometry-vs-texture, schematic footprint.
- Sheet 03: palette, material zones, atlas, UV strategy, pixel-detail placement.
- Sheet 04: hierarchy motion chain, pivots, axes, neutral pose, clipping risks.

Request Approval Gate 2 for Sheets 02–04.

### Phase 5 — Stage contracts

Derive these documents from the approved Production Context and sheets:

- `GEOMETRY.md`
- `TEXTURING.md`
- `ANIMATION.md`
- `VALIDATION.md`

They must not introduce new design decisions.

Request Approval Gate 3 for the stage contracts and final package summary.

### Phase 6 — Audit and package

After Approval Gate 3:

1. Run the package consistency audit.
2. Create `reference_manifest.json`.
3. Create `CODEX_REFERENCE_HANDOFF.md`.
4. Verify all required files exist.
5. Create `<asset_id>_blockbench_reference.zip`.

Codex may validate and execute the package but must not redesign it.

## Source authority

- `PRODUCTION_CONTEXT.md`: global decisions.
- Sheet 01: form, scale, identity, color family, neutral pose.
- Sheet 02: construction, hierarchy, attachments, footprint.
- Sheet 03: UV, atlas, texture style, material zones.
- Sheet 04: motion, pivots, axes, clipping risks.
- `GEOMETRY.md`: Geometry-stage execution contract.
- `TEXTURING.md`: Texture-stage execution contract.
- `ANIMATION.md`: required clips or explicit skip decision.
- `VALIDATION.md`: final acceptance criteria.
- `reference_manifest.json`: machine-readable authority and file hashes.
- `CODEX_REFERENCE_HANDOFF.md`: Codex import and execution authority.

## Geometry rules

- Use smart cuboid construction.
- Before adding a cube: resize, stretch, flatten, rotate, offset, or reuse.
- Avoid dense voxel sculpture and micro-cube decoration.
- Keep silhouette-critical parts as geometry.
- Keep seams, markings, small straps, scratches, and patterns texture-first.
- Separate parts needed for future animation and pivots.

## Texture rules

- Geometry scale, atlas size, and pixel style are separate decisions.
- Default pixel style: `16x`.
- Use `32x` only when approved critical details do not fit at 16x.
- Use Classic Bedrock planning.
- Box UV is preferred unless selective per-face UV is justified.
- Do not use PBR or Vibrant Visuals.

## Animation rules

- State explicitly whether animation is required.
- When not required, `ANIMATION.md` must contain `ANIMATION_SKIPPED` and the reason.
- When required, define groups, pivots, allowed axes, required clips, neutral-pose recovery, ground-contact rules, and clipping risks.

## Revision classification

Classify feedback as:

- `LOCAL_REVISION`
- `SHEET_REOPEN`
- `FULL_DESIGN_REOPEN`

For local revisions, preserve unrelated approved decisions.

If Sheet 01 changes, revalidate Sheets 02–04 and all stage contracts.
If Sheet 02 changes, revalidate Sheet 04 and Geometry/Animation contracts.
If Sheet 03 changes, revalidate the Texture contract.
If Sheet 04 changes, revalidate the Animation and Validation contracts.

## Stop conditions

Stop and report when:

- Production Context is not approved.
- Turnaround identity or camera drift remains after one targeted correction.
- A later sheet introduces a new design.
- A stage contract conflicts with an approved sheet.
- Required output files are missing.
- The user asks for Codex/MCP execution before the final ZIP is approved.

## Required references

Read:

- `references/FLOW.md`
- `references/SHEET_SPECIFICATIONS.md`
- `references/CAMERA_AND_RENDER_LOCK.md`
- `references/QA_AND_REVISION_PROTOCOL.md`
- `references/CODEX_HANDOFF_CONTRACT.md`

Use templates in:

```text
templates/
```
