# Bedrock Model Production Workflow

This is the short production flow for Minecraft Bedrock / Blockbench MCP work.

Use this as the phase overview. Execution details stay in:

- `workflow-quick-reference.md`
- `reference-package-pass-fail-checklist.md`
- `pre-modelling-gate.md`
- `mandatory-blockbench-mcp-procedure.md`
- `phase-detail-contract.md`
- `quality-implementation-rules.md`

## Core Flow

1. Brief Asset
2. Reference Package
3. Reference Gate
4. Main Geometry
5. Geometry Detailing
6. UV Texture
7. Base Texturing
8. Detail Texturing
9. Polish
10. Final Review

## 1. Brief Asset

Goal: understand the asset before generating references or editing Blockbench.

Required answers:

- What to make.
- In-game function.
- Target size/scale.
- Style/theme.
- Animation needed: yes/no/not sure.
- UV atlas target.
- Texture style target.

The brief can come directly from the user, Codex, ChatGPT, or another reference helper. The tool does not matter; the output must be clear enough for Codex to build the reference package.

## 2. Reference Package

Goal: create asset-specific references from the approved 8-sheet template.

Required structure:

```text
01 shape / orthographic views
02 scale
03 silhouette
04 part breakdown
05 color / texture
06 close-up detail
07 execution target
08 pivot optional
```

References must match the actual target asset from the brief. Do not reuse a sample asset identity unless the user asks to model that asset. Sample packages teach layout, quality, and interpretation only.

## 3. Reference Gate

Goal: prove the reference package is usable before Blockbench.

Required pass:

- All required sheets and `.notes.md` exist.
- `reference_manifest.json` is valid.
- `CODEX_REFERENCE_HANDOFF.md` is clear.
- Geometry-level and texture-only details do not conflict.
- Scale, front direction, atlas target, and texture style are locked.
- User approves the reference package.

Use `reference-package-pass-fail-checklist.md` and `pre-modelling-gate.md`.

## 4. Main Geometry

Goal: build only the large readable form.

Use reference sheets:

- Sheet 01 for shape and views.
- Sheet 02 for scale.
- Sheet 03 for silhouette.
- Sheet 04 for construction zones.
- Sheet 07 for execution locks.
- Sheet 08 only for pivot-readiness if relevant.

Allowed:

- scale envelope
- silhouette
- broad part groups
- parent/attachment structure
- placeholder colors

Forbidden:

- UV work
- texture painting
- tiny trim/detail cubes
- solving geometry failure with color

## 5. Geometry Detailing

Goal: add only structural details that improve the model.

Use Sheet 04, Sheet 06, Sheet 07, and Sheet 08 if relevant.

Allowed:

- secondary silhouette detail
- clear attachments
- readable structural accents

Forbidden:

- texture-only seams, scratches, color bands, glow pixels, or tiny trim as geometry
- UV or texture work

## 6. UV Texture

Goal: prepare the atlas and per-face UV logic.

Use Sheet 02 for atlas target and Sheet 05 for texture placement.

Allowed:

- atlas setup
- per-face UV layout
- symmetry/UV consistency checks

Forbidden:

- final painting
- changing geometry to fit texture unless a blocker is found

## 7. Base Texturing

Goal: place broad material zones and main colors.

Use Sheet 05 as the authority.

Allowed:

- main material colors
- large color zones
- stepped base shading

Forbidden:

- micro detail before base material zones read clearly
- changing UV or geometry without reopening the relevant phase

## 8. Detail Texturing

Goal: add pixel detail after the base read works.

Use Sheet 05 and Sheet 06.

Allowed:

- pixel detail
- trim
- stepped shading
- accent colors
- small texture-only features

Forbidden:

- adding geometry for texture details
- making accents overpower the main material read

## 9. Polish

Goal: small fixes only.

Use all approved sheets, especially Sheet 07.

Allowed:

- local visual fixes
- small UV/texture cleanup
- final view consistency

Forbidden:

- broad redesign
- changing scale or silhouette without reopening earlier phases

## 10. Final Review

Goal: compare the final model against the reference package per sheet.

Review checklist:

- Sheet 01: shape and view match.
- Sheet 02: scale and atlas target match.
- Sheet 03: silhouette readable.
- Sheet 04: part groups correct.
- Sheet 05: palette, material zones, texture style correct.
- Sheet 06: detail interpretation correct.
- Sheet 07: execution target passed.
- Sheet 08: pivot/hierarchy safe if relevant.

## Global Rules

- Do not edit Blockbench before the Reference Gate passes.
- Do not skip phases unless the user explicitly approves.
- Do not continue to the next phase until the user approves the current phase.
- Use the reference package in every phase, not only at the start.
- Use geometry for silhouette, structure, depth, attachment, pose, animation readiness, gameplay readability, and focal identity.
- Use texture for stripes, seams, scratches, small panels, shadows, gradients, trims, and 1-2 pixel details.
