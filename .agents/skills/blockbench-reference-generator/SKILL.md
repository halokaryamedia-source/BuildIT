---
name: blockbench-reference-generator
description: LazyDesigner ChatGPT-side reference-preparation authority. Resolve missing vital requirements, compile a clean brief, confirm before generation, generate minimum sufficient unified visual evidence, and package it for Codex.
---

# LazyDesigner Reference Preparation

This Skill is the single ChatGPT-side authority for preparing LazyDesigner asset references before Codex authoring.

It orchestrates existing canonical contracts rather than duplicating them.

```text
USER REQUEST
→ UNDERSTAND
→ REQUIREMENT GATE
→ SIMPLE QUESTIONS WHEN BLOCKING INFO IS MISSING
→ PROMPT COMPILER
→ CLEAN PRODUCTION BRIEF
→ FINAL CONFIRMATION
→ REFERENCE PLAN
→ GENERATE MINIMUM USEFUL VISUAL EVIDENCE
→ INTERNAL QA
→ USER VISUAL APPROVAL WHEN MATERIAL
→ PACKAGE GENERATION CONFIRMATION
→ PACKAGE BUILD + CONSISTENCY GATE
→ CODEX
```

## Canonical Owners

Use these documents as authority:

```text
ChatGPT-side operational flow
→ docs/knowledge/chatgpt-reference-flow.md

Prompt normalization
→ .agents/skills/lazydesigner-prompt-compiler/SKILL.md

Visual reference layout / panel economy / anti-drift
→ docs/knowledge/image-reference-standard.md

REFERENCE.json schema
→ docs/knowledge/reference-package-schema.md

GEOMETRY.md
→ docs/knowledge/geometry-reference-contract.md

TEXTURE.md
→ docs/knowledge/texture-reference-contract.md

ANIMATION.md
→ docs/knowledge/animation-reference-contract.md

Package load order / consistency
→ docs/knowledge/reference-package-load-contract.md

Durable reference policy
→ docs/foundation/04-reference-guide.md
```

Do not maintain parallel copies of those contracts in this Skill.

## Boundary

ChatGPT owns:
- requirement clarification;
- prompt normalization;
- reference planning;
- image generation/editing;
- visual consistency QA;
- technical extraction;
- reference package creation.

ChatGPT does **not** own:
- Blockbench modelling implementation;
- exact Cube coordinates/counts;
- exact pivots or UV placement;
- Runtime Tool call planning;
- final animation key authoring;
- MCP/Gateway implementation.

## Input Authority

Accept:
- text prompt;
- user image(s);
- text + image(s);
- previously approved reference(s);
- bounded correction to an existing approved reference.

Resolve facts in this order:

```text
explicit current user requirement
→ visible source evidence
→ approved prior target decision
→ unresolved remains UNKNOWN
```

Never infer numeric scale from pixels. Never silently average materially conflicting evidence.

## Requirement Gate

Before generating any user-facing artifact, classify missing information:

```text
BLOCKING
USEFUL
OPTIONAL
```

`BLOCKING` means the answer can materially change identity, primary structure, intended scale, required articulation/action, or another major output decision.

When blocking information is missing:
- do not generate;
- ask only the fewest decision-changing questions;
- use basic user-facing wording;
- never ask the user to understand topology, pivot ownership, UV, deformation strategy, or prompting terminology.

`USEFUL` is asked only when it materially improves expected correctness.

`OPTIONAL` remains unspecified and does not create a questionnaire.

## Prompt Compiler

After blocking information is resolved, compile one clean internal production brief using `lazydesigner-prompt-compiler`.

The compiler may:
- organize;
- normalize wording;
- remove superseded directions;
- deduplicate;
- translate casual language into clear technical intent.

It may not invent:
- dimensions;
- materials;
- part count;
- topology;
- animation requirements;
- hidden structure;
- visual design choices absent from authority.

The compiled brief is internal working state and is not exported by default.

## Final Confirmation — Hard Gate

Before generating **any** image or handoff file, show a concise confirmation and obtain explicit user approval.

Preferred user-facing shape:

```text
Konfirmasi sebelum dibuat:
- Objek: <asset>
- Arah: <main target>
- Tambahan: <only material extras>

Sudah sesuai?
```

Keep it short. Do not expose internal profile/module jargon unless useful.

Silence is not approval.

A materially revised target requires confirmation again before generation.

## Asset Profiles

Use one primary profile:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

Profiles classify the dominant asset problem. They are not geometry presets.

`GENERIC` is fallback only.

A hybrid asset keeps one primary profile; narrowly scoped secondary guidance may be used only when materially needed.

## Reference Modules

Choose only modules that materially reduce downstream uncertainty:

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

Do not generate every module by default.

## Unified Visual Reference Rule

All generated assets use the **LazyDesigner Unified Image Reference Standard**.

Default:

```text
1 PRIMARY REFERENCE SHEET
```

That sheet may carry useful Geometry, Texture and Animation evidence together.

Add Sheet 02+ only when useful information would otherwise become crowded or too small.

```text
Sheet 01 = canonical visual identity + core construction
Sheet 02+ = elaboration / overflow only
```

### Panel Budget

Default upper guidance:

```text
HERO                 1
CONSTRUCTION VIEWS   2–4
CRITICAL DETAILS     0–3
KEY POSES            0–5
```

These are not quotas.

Every panel must reduce at least one of:

```text
GEOMETRY_AMBIGUITY
TEXTURE_AMBIGUITY
ANIMATION_AMBIGUITY
```

If it does not, remove it.

### Panel Priority

```text
P1 REQUIRED
P2 USEFUL
P3 REDUNDANT / DECORATIVE
```

Include P1. Include P2 only while readability remains strong. Remove P3.

If density becomes excessive, remove the lowest-value P2 panel before shrinking critical evidence.

### Information Priority

When space is constrained:

```text
GEOMETRY > TEXTURE > ANIMATION
```

Do not sacrifice readable form/depth/topology to fit extra support content.

## Universal Layout Grammar

Preferred composition:

```text
┌──────────────────────────────────────────────────────┐
│ ASSET NAME                                           │
├──────────────────────────┬───────────────────────────┤
│                          │ FRONT                     │
│       HERO / 3/4         │ LEFT                      │
│                          │ BACK / TOP / RIGHT        │
│                          │ only when useful          │
├──────────────────────────┴───────────────────────────┤
│ CRITICAL DETAIL 1 │ DETAIL 2 │ DETAIL 3             │
├──────────────────────────────────────────────────────┤
│ KEY POSES / MOTION STRIP — only when useful         │
└──────────────────────────────────────────────────────┘
```

Adaptive rules:

```text
no animation       → no motion row
no critical detail → no detail row
no useful BACK/TOP → enlarge useful views
complex overflow   → create additional sheet
```

Core rule:

```text
CONTENT DECIDES LAYOUT
NOT LAYOUT FORCES CONTENT
```

## View Selection

Use minimum sufficient construction evidence.

Typical roles:

```text
FRONT → width / height / visible part count / primary silhouette
LEFT  → depth / profile / attachment / body axis
BACK  → rear topology or asymmetry only when material
TOP   → footprint / depth / layout only when material
RIGHT → only when left/right asymmetry matters
3/4   → whole-form volume and layering readability
```

Do not require all sides ceremonially.

## Critical Details

Create a detail panel only when a high-risk relationship is not already clear from main views.

Good examples:
- shelf angle;
- wheel mounting;
- cockpit opening;
- hand/tool attachment;
- backpack attachment;
- shoulder/hip overlap;
- wing root;
- jaw connection;
- tail base;
- linkage/slider/axis relationship;
- plant stem/branch or carrier relationship.

Do not create decorative close-ups.

## Texture Evidence

Do not reserve a mandatory separate texture panel.

Prefer material/color/marking evidence to remain readable in hero, construction and critical-detail panels.

Add dedicated visual material evidence only when it resolves a material ambiguity such as:
- identity-critical marking;
- emissive region;
- alpha/cutout silhouette;
- asymmetric material treatment;
- directional pattern;
- source-specific material distinction.

Do not add palette boxes by default.

## Motion Evidence

When animation is required and pose evidence helps, use the minimum useful key poses.

Preferred action pattern when applicable:

```text
READY
ANTICIPATION
ACTION / CONTACT
FOLLOW_THROUGH
RECOVERY
```

Simpler motion may use:

```text
START
EXTREME
RETURN
```

The image owns pose silhouette/direction/contact. Timing detail belongs in `ANIMATION.md`.

## Minecraft Target Rule

When starting from a real-world or non-Minecraft source, final production sheets normally show the **Minecraft/Blockbench target interpretation only**.

Do not place the original real image into the final production sheet for comparison.

The source may remain separately available as source authority when needed.

## Visual Language

Use:
- clean light/neutral background;
- neutral studio-like lighting;
- clear Minecraft/Blockbench target construction;
- readable silhouette and edges;
- consistent subject scale across related views;
- minimal visual noise;
- minimal text.

Image text is limited to:
- asset title;
- view labels;
- short panel labels;
- short pose labels.

Do not place paragraphs, long technical notes, JSON-like annotations, or implementation instructions inside the image.

## Anti-Drift / Identity Lock

After Sheet 01 becomes approved visual authority, every later sheet must preserve:

```text
same asset identity
same whole-model proportions
same required part count
same major silhouette
same approved materials/colors
same accessories/props
same asymmetry/orientation
same construction logic
```

Additional sheets elaborate; they do not redesign.

If the user changes a locked identity element, treat it as a revision and update all materially affected visual evidence coherently.

If the same view appears again, preserve orientation, proportion, material identity and camera convention.

## Internal Visual QA

Before user review, check:

```text
identity matches confirmed brief
required parts are present
hero and construction views agree
proportions do not drift
attachments/openings agree
approved material identity remains stable
support panels describe the same asset
motion poses preserve the same geometry identity
labels are minimal and correct
no panel is redundant
critical evidence remains large enough to interpret
```

For Sheet 02+, compare against the Sheet 01 identity lock.

Fix the largest structural inconsistency first.

## Approval

A generated visual becomes approved visual authority only after explicit user acceptance when visual approval is material.

For corrections:

```text
USER DELTA
→ compile CHANGE + PRESERVE
→ ask only if materially ambiguous
→ concise confirmation
→ bounded visual correction
→ QA against existing identity lock
→ user review
```

Never claim approval that did not occur.

## Reference Package

After required visual authority is accepted, obtain package-generation approval when not already explicit, then produce only the required package files:

```text
REFERENCE.json
GEOMETRY.md
TEXTURE.md      only when useful
ANIMATION.md    only when useful/required
approved/supporting image(s)
```

Use the canonical contracts listed at the top of this Skill.

Do not export:
- conversation transcript;
- compiled prompt history;
- duplicate README/bootstrap files by default;
- Cube-by-Cube plans;
- MCP/Tool schemas;
- generic tutorials.

## Unknown / Readiness Rule

Unknowns remain explicit:

```text
blocking
non_blocking
```

Do not guess either class.

Readiness is stage-specific:

```text
READY
NOT_REQUIRED
NEEDS_REVIEW
BLOCKED
```

Missing Texture information must not block Geometry unless it actually changes a Geometry decision.

## Completion

Reference Preparation is complete only when:
- blocking information for the intended next stage is resolved;
- required confirmations/approvals are explicit;
- the visual set uses the minimum useful panels;
- additional sheets exist only for real overflow;
- all sheets remain identity-locked;
- package consistency passes;
- no unsupported fact was invented.

Then stop. Downstream implementation belongs to Codex/LazyDesigner authoring Skills.