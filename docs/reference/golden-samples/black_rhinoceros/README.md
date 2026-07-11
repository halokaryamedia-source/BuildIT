# Black Rhinoceros Golden Sample

This directory documents the approved BuildIT Black Rhinoceros Golden Sample under the current **single Reference Visual** workflow.

## Canonical Flow

```text
source image
→ approved PRODUCTION_CONTEXT.md
→ one approved black_rhinoceros_reference_visual.png
→ GEOMETRY.md
→ TEXTURING.md
→ ANIMATION.md
→ VALIDATION.md
→ reference_manifest.json
→ CODEX_REFERENCE_HANDOFF.md
→ Codex + MCP-Blockbench build and validation
```

There are only two approval moments:

1. Production Context approval
2. Reference Visual approval

After the Reference Visual is approved, the technical Markdown files, manifest, and Codex handoff are generated automatically. No routine technical-document approval is required.

## Canonical Runtime Package

```text
black_rhinoceros_blockbench_reference/
├─ source/
│  └─ original_reference.png
├─ PRODUCTION_CONTEXT.md
├─ black_rhinoceros_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

## Image Rule

- Generated Reference Visuals: exactly `1`
- Canonical generated image: `black_rhinoceros_reference_visual.png`
- Source copy: `source/original_reference.png`; this is input evidence, not generated output
- Maximum targeted visual correction before approval: `1`
- Images generated after Reference Visual approval: `0`
- Hidden per-angle generation: forbidden
- Additional geometry, texture, animation, construction, motion, pose, or viewpoint images: forbidden

Legacy numbered visual files such as `01_*`, `02_*`, `03_*`, and `04_*` are not part of the current package contract.

## Authority

1. `PRODUCTION_CONTEXT.md` controls intent, scale, constraints, assumptions, and resolved decisions.
2. `black_rhinoceros_reference_visual.png` is the sole visual authority for identity, silhouette, proportions, pose, material appearance, and cross-view consistency.
3. The category documents translate the approved context and image into implementation requirements.
4. `VALIDATION.md` remains `PENDING_BUILD` until Codex/MCP-Blockbench produces and tests the model.
5. Conflicts must be reported as `REFERENCE_CONFLICT`; they must not be silently redesigned.

## Model Scope

- Geometry: required
- Texture and UV: required
- Animation clips: skipped
- Animation-ready hierarchy and pivots: required
- Final validation: required
- Final model target: `black_rhinoceros.bbmodel`
- Bedrock pipeline: Classic Bedrock only
- PBR / Vibrant Visuals: forbidden

The repository Markdown and JSON files are the machine-readable and maintainer-readable contract. Binary source and visual authority files must be present when assembling or extracting the complete runtime package.
