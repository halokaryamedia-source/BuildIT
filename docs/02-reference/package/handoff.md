# LazyDesigner Reference → Codex Handoff

Updated: 2026-09-11

This file owns the reference-preparation handoff relationship between ChatGPT and Codex. It does not duplicate detailed schemas or stage-document contracts.

Canonical owners:

```text
ChatGPT operational reference flow
→ docs/knowledge/chatgpt-reference-flow.md

REFERENCE.json schema
→ docs/knowledge/reference-package-schema.md

GEOMETRY.md
→ docs/knowledge/geometry-reference-contract.md

TEXTURE.md
→ docs/knowledge/texture-reference-contract.md

ANIMATION.md
→ docs/knowledge/animation-reference-contract.md

Codex/Astra package load order
→ docs/knowledge/reference-package-load-contract.md

Durable visual-reference policy
→ docs/foundation/04-reference-guide.md
```

## Purpose

ChatGPT prepares enough confirmed visual and technical reference information for Codex to work without repeating avoidable interpretation.

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
→ PACKAGE CONSISTENCY GATE
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

Do not add `README.md`, `CODEX_START.md`, transcripts, compiled prompts, or other duplicate briefing files by default.

## Authority Model

```text
1. explicit current user requirement
2. approved visual reference
3. REFERENCE.json structured facts
4. active stage Markdown projection
5. downstream Codex interpretation
```

`REFERENCE.json` is the canonical structured index. Stage Markdown files express only stage-specific consequences of the same authority. Images remain visual authority for visible design.

A lower authority never silently overrides a higher authority. Material conflicts block only the dependent decision until resolved.

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

Canonical file:

```text
REFERENCE.json
```

Schema identifier:

```text
lazydesigner-reference-v1
```

Exact field ownership and vocabulary live only in:

```text
docs/knowledge/reference-package-schema.md
```

Do not maintain another full JSON schema in this document or in the Reference Preparation Skill.

## Stage Documents

### `GEOMETRY.md`

Owned only by:

```text
docs/knowledge/geometry-reference-contract.md
```

Contains only asset-specific Geometry interpretation already supported by stronger authority. It must not become a Cube plan, UV plan, animation plan, or Tool-call plan.

### `TEXTURE.md`

Owned only by:

```text
docs/knowledge/texture-reference-contract.md
```

Create only when material/texturing guidance materially improves downstream correctness. It must not become a pixel-by-pixel painting recipe or UV packing plan.

### `ANIMATION.md`

Owned only by:

```text
docs/knowledge/animation-reference-contract.md
```

Create only when animation is required and motion guidance materially helps. It must not become a compulsory frame-by-frame implementation recipe unless the user explicitly requires that precision.

## Image Identity

Every packaged image receives a stable semantic ID in `REFERENCE.json`.

Example:

```text
IMG_GEO_01 → PRIMARY_GEOMETRY → images/turnaround.png
IMG_TEX_01 → MATERIAL_TEXTURE → images/material-reference.png
IMG_ANIM_01 → ANIMATION_KEYFRAME → images/keyframe-guide.png
```

Stage Markdown refers to image IDs and states what each image owns for that stage. Codex should not scan the whole image folder by default.

## Codex/Astra Load Rule

Package consumption is owned by:

```text
docs/knowledge/reference-package-load-contract.md
```

Default behavior:

```text
REFERENCE.json
→ determine active stage/readiness
→ load only active stage Markdown
→ inspect only image IDs referenced by that stage
→ work
```

Do not load every stage document and every image automatically.

## Unknown Classification

Unknowns remain:

```text
blocking
non_blocking
```

`REFERENCE.json` owns the canonical unknown inventory. Stage Markdown repeats only stage-relevant consequences.

A Texture-only unknown must not block Geometry. A rig blocker may block Animation while Texture remains ready.

## Stage Readiness

Canonical values:

```text
READY
NOT_REQUIRED
NEEDS_REVIEW
BLOCKED
```

Readiness is stage-specific. Missing Texture information does not automatically block Geometry. Animation may be `NOT_REQUIRED`.

## Package Consistency Gate

Before handoff, ChatGPT verifies:

```text
all listed documents actually exist
all referenced image IDs actually exist
stage files agree with REFERENCE.json
no stage file introduces unsupported facts
no stage file leaks another stage's implementation plan
readiness agrees with blockers
omitted optional files are not referenced
```

Failure means the package is not ready for Codex.

## Correction Behavior

For bounded user changes:

```text
USER DELTA
→ compile CHANGE + PRESERVE
→ ask only if the new target is materially ambiguous
→ concise confirmation before revised artifact generation
→ update affected REFERENCE.json facts
→ update only affected stage document(s)
→ update only affected image(s)
→ preserve unaffected accepted information
```

Do not rebuild the entire package for a local change.

## Existing Asset / Update

```text
USER CHANGE REQUEST
→ ChatGPT resolves only missing reference/technical facts
→ preserve accepted visual/technical authority
→ update affected package content
→ hand revised package to Codex
```

The package remains self-contained. Codex should not need the original ChatGPT transcript to understand current authority.

## System Development Boundary

System-development work does not require an asset reference package by default.

```text
USER MCP / PLUGIN / BUILD REQUEST
→ product-development workflow
```

Do not misuse this package as a general development-brief format.

## Non-Goals

The Reference Package must not become:

```text
conversation transcript
giant master prompt
copy of Skills or Tool schemas
hidden source of guessed requirements
mandatory full set of stage documents for trivial assets
second asset-state database
Cube-by-Cube modelling blueprint
duplicate authority system across JSON and Markdown
```

Its purpose is to make the next Codex authoring decision correct, explicit, and efficient.