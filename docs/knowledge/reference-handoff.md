# LazyDesigner Reference → Codex Handoff

Updated: 2026-09-11

This file owns the reference-preparation handoff contract between ChatGPT and Codex. Operational reference behavior is owned by `.agents/skills/blockbench-reference-generator/SKILL.md`. Durable reference policy is owned by `docs/foundation/04-reference-guide.md`. The canonical machine-readable package schema is owned by `docs/knowledge/reference-package-schema.md`. `GEOMETRY.md` content is owned by `docs/knowledge/geometry-reference-contract.md`. Product flow remains in `docs/knowledge/flow.md`.

## Purpose

ChatGPT prepares enough visual and structured technical reference information for Codex to work without repeating avoidable interpretation.

```text
MAKE AMBIGUITY EXPLICIT BEFORE CODEX PAYS TO RESOLVE IT
```

## Canonical ChatGPT-Side Flow

```text
USER REQUEST
→ UNDERSTAND
→ REQUIREMENT GATE
→ ASK SIMPLE QUESTIONS IF BLOCKING INFO IS MISSING
→ PROMPT COMPILER
→ CLEAN PRODUCTION BRIEF
→ FINAL CONFIRMATION
→ REFERENCE PLAN
→ GENERATE REQUIRED IMAGE(S)
→ INTERNAL QA
→ USER VISUAL REVIEW WHEN MATERIAL
→ PACKAGE GENERATION CONFIRMATION WHEN REQUIRED
→ REFERENCE PACKAGE
→ CODEX
```

No user-facing image or handoff file is generated before the relevant explicit confirmation gate.

## Handoff Package

Default package is intentionally small:

```text
asset_reference/
├── REFERENCE.json
├── GEOMETRY.md
├── TEXTURE.md      ← only when required
├── ANIMATION.md    ← only when required
└── images/
    └── approved/supporting reference images
```

Do not add `README.md`, `CODEX_START.md`, transcripts, or giant prompt files by default when they only duplicate the same information.

## Authority Model

```text
explicit current user requirement
→ approved visual reference
→ REFERENCE.json structured facts
→ stage-specific Markdown projection
→ downstream Codex interpretation
```

`REFERENCE.json` is the canonical structured index. Stage Markdown files are projections for the relevant authoring stage, not independent truth sources.

Images remain visual authority for visible design.

## Canonical Asset Profiles

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

Profiles provide decision vocabulary, not geometry presets.

## Optional Reference Modules

```text
CONCEPT
TURNAROUND
STRUCTURAL_DETAIL
MATERIAL_TEXTURE
RIG_DEFORMATION
POSE_ACTION
EXPRESSION_FACE
ANIMATION_KEYFRAME
```

Do not force every module on every asset.

## Machine-Readable Contract

The canonical file is:

```text
REFERENCE.json
```

Schema identifier:

```text
lazydesigner-reference-v1
```

Exact field ownership and vocabulary are defined only in:

```text
docs/knowledge/reference-package-schema.md
```

Do not maintain another full JSON schema in this document or in the Reference Preparation Skill.

## Stage Documents

### `GEOMETRY.md`

Canonical content/order is owned only by:

```text
docs/knowledge/geometry-reference-contract.md
```

This handoff document does not repeat that full contract.

At minimum, `GEOMETRY.md` explains only the asset-specific Geometry conclusions already supported by stronger authority, including applicable target/scale, primary structure, proportion/silhouette, attachment/contact/openings, representation guidance, rig-readiness constraints, relevant image IDs, and Geometry-stage unknowns.

It must not become a Cube plan, UV plan, animation plan, or tool-call plan.

### `TEXTURE.md`

Create only when material/texturing guidance is materially useful.

Typical content:

```text
material regions
palette/value relationships
surface character
identity markings
alpha/cutout requirement
emissive/PBR requirement
relevant image IDs
```

A dedicated canonical content contract should own this file rather than duplicating Texturing Skill prose here.

### `ANIMATION.md`

Create only when animation is required and motion guidance is useful.

Typical content:

```text
animation goal
participating semantic parts
motion relationships
contacts/attachments
key poses
relative timing
joint/deformation risks
secondary motion
relevant image IDs
```

Do not convert it into compulsory frame-by-frame implementation unless explicitly requested. A dedicated canonical content contract should own this file.

## Image Identity

Every packaged image receives a stable semantic ID in `REFERENCE.json`.

Example:

```text
IMG_GEO_01 → PRIMARY_GEOMETRY → images/turnaround.png
IMG_ANIM_01 → ANIMATION_KEYFRAME → images/keyframe-guide.png
```

Stage Markdown should refer to image IDs rather than forcing Codex to infer which image owns which decision.

## Unknown Classification

Unknowns remain:

```text
blocking
non_blocking
```

Neither class may be silently guessed.

Blocking unknowns prevent the affected stage from becoming `READY`. Non-blocking unknowns remain visible without stopping unrelated work.

## Stage Readiness

Canonical values:

```text
READY
NOT_REQUIRED
NEEDS_REVIEW
BLOCKED
```

Readiness is stage-specific. Missing texture information does not automatically block Geometry. Animation may be `NOT_REQUIRED`.

## Correction Behavior

For bounded user changes:

```text
USER DELTA
→ compile CHANGE + PRESERVE
→ ask only if the new target is materially ambiguous
→ concise confirmation before revised artifact generation
→ update affected image/document/REFERENCE.json entries
→ preserve unaffected accepted information
```

Do not regenerate an entire package for a local change.

## Existing Asset / Update

```text
USER CHANGE REQUEST
→ ChatGPT resolves only missing reference/technical facts
→ preserve accepted visual/technical authority
→ update affected package content
→ hand revised package to Codex
```

The package should remain self-contained so Codex does not need the original ChatGPT transcript to understand current authority.

## System Development Boundary

System-development work does not require an asset reference package by default.

```text
USER MCP / PLUGIN / BUILD REQUEST
→ product-development workflow
```

Do not misuse the reference package as a general development brief format.

## Non-Goals

The Reference Package must not become:
- a conversation transcript;
- a giant master prompt;
- a copy of Skills or Tool schemas;
- a hidden source of guessed requirements;
- a mandatory full set of stage documents for trivial assets;
- a second asset-state database;
- a Cube-by-Cube modelling blueprint;
- a duplicate authority system across JSON and Markdown.

Its purpose is to make the next Codex authoring decision correct, explicit and efficient.
