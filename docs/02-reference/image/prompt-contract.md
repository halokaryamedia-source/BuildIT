# LazyDesigner Image Generation Prompt Contract

Updated: 2026-09-11

This document owns the internal prompting contract used by ChatGPT Reference Preparation when generating LazyDesigner reference images.

It does not replace the user brief, approved visual authority, `lazydesigner-prompt-compiler`, or the Unified Image Reference Standard. Its only purpose is to turn already-confirmed reference decisions into a clean, consistent image-generation instruction without leaking the uncontrolled conversation into generation.

## Core Principle

```text
CONFIRMED USER INTENT
+ CLEAN COMPILED BRIEF
+ SHEET PURPOSE
+ PANEL PLAN
+ IDENTITY LOCK
→ GENERATION PROMPT
```

Never generate directly from the raw conversation when a compiled brief exists.

The generation prompt may organize and emphasize known facts. It may not invent missing design facts.

## Inputs

Every generated sheet uses only the minimum relevant subset of:

```text
confirmed asset identity
selected asset profile
approved Minecraft/Blockbench visual target
explicit dimensions when visually relevant
required semantic parts
required materials/colors/markings
required asymmetry/orientation
required attachments/openings
required articulation/action
current sheet purpose
selected panel plan
approved prior sheet identity lock
source image evidence when needed
```

Do not copy unrelated discussion, rejected alternatives, system-development context, or downstream MCP instructions into the prompt.

## Prompt Layers

Build the internal prompt in this fixed order:

```text
1. TARGET IDENTITY
2. VISUAL STYLE / RENDER LANGUAGE
3. IDENTITY LOCK
4. SHEET PURPOSE
5. PANEL PLAN
6. PANEL-SPECIFIC EVIDENCE
7. CONSISTENCY RULES
8. NEGATIVE / DO-NOT-CHANGE RULES
9. PRESENTATION RULES
```

The order is intentional: identity and lock constraints must be established before local panel instructions.

## 1. Target Identity

State the asset in one concise sentence.

Example:

```text
Create a Minecraft Bedrock / Blockbench reference sheet for a stylized fisherman NPC with a small bench, bucket and fishing rod.
```

Do not add unconfirmed lore, environment, accessories or realism.

## 2. Visual Style / Render Language

Use one consistent production-reference language:

```text
Minecraft/Blockbench target only
clean voxel/block construction
neutral studio-like lighting
light neutral background
high silhouette and edge clarity
readable material separation
consistent proportions across all panels
minimal decorative styling
```

Do not include the original real-world image inside the final sheet unless explicitly requested.

## 3. Identity Lock

For Sheet 01, the lock is built from the confirmed brief and any already-approved source/reference target.

For Sheet 02+, the lock must explicitly preserve Sheet 01:

```text
same whole-model proportions
same required part count
same major silhouette
same materials/colors
same accessories/props
same asymmetry/orientation
same construction logic
same identity-critical markings
```

Do not silently redesign any locked element.

If a user-approved revision changes a locked element, rebuild the affected lock from the revised authority before generating dependent sheets.

## 4. Sheet Purpose

Every sheet has one primary reason to exist.

Recommended values:

```text
MAIN_REFERENCE
DETAIL_REFERENCE
MOTION_REFERENCE
VARIANT_REFERENCE
```

`MAIN_REFERENCE` is the default and should carry useful Geometry, Texture and Animation evidence together when readable.

Additional sheets exist only for real information overflow.

## 5. Panel Plan

The panel plan comes from the Unified Image Reference Standard.

Default information budget:

```text
HERO                 1
CONSTRUCTION VIEWS   2–4
CRITICAL DETAILS     0–3
KEY POSES            0–5
```

Do not convert these maxima into quotas.

Each panel must have:

```text
panel id
panel type
view / subject
purpose
priority: P1 | P2
```

Example:

```text
HERO_01
- type: HERO
- view: FRONT_LEFT_3Q
- purpose: whole-form silhouette, depth, material separation
- priority: P1

VIEW_FRONT
- type: CONSTRUCTION
- view: FRONT
- purpose: width, visible part count, front identity
- priority: P1

DETAIL_TOOL_HAND
- type: DETAIL
- subject: hand/tool attachment
- purpose: prevent floating/incorrect attachment
- priority: P1

POSE_CONTACT
- type: KEY_POSE
- subject: tool contact pose
- purpose: clarify action/contact
- priority: P2
```

If a candidate panel has no downstream purpose, remove it before generation.

## 6. Panel-Specific Evidence

Give each panel only the facts it needs.

### HERO
Prioritize:

```text
whole identity
silhouette
volume/depth
major layering
primary attachment relationships
material separation
```

### CONSTRUCTION VIEW
Prioritize only what that view constrains.

```text
FRONT → width/height/part count/front identity
LEFT  → depth/profile/attachment/body axis
BACK  → rear topology/asymmetry when needed
TOP   → footprint/depth/layout when needed
RIGHT → asymmetry only when needed
```

### DETAIL
Show only a high-risk relationship not already clear from the main views.

### KEY POSE
Show pose silhouette, action direction, contact and articulation. Do not attempt to encode final exact keyframe values in pixels.

## 7. Consistency Rules

Every prompt must explicitly require:

```text
same proportions across panels
same part count across panels
same accessories across panels
same approved colors/materials across panels
same left/right orientation
same structural attachment logic
same voxel/detail language
```

Orthographic panels must read as the same asset viewed from different directions, not independently redesigned illustrations.

## 8. Negative / Do-Not-Change Rules

Use a compact negative section containing only likely failure modes for the current asset.

Common global failures:

```text
no cropped subject
no extra or missing major parts
no inconsistent proportions between views
no mirrored asymmetry unless explicitly required
no floating attachments
no invented accessories
no real-image comparison panel
no decorative scene that obscures construction
no long explanatory text
no palette box unless decision-critical
no redundant view
```

Add asset-specific negatives only when they prevent a known high-risk error.

Example HUMANOID:

```text
no large hip/crotch gap
no detached shoulder
no tool floating away from hand
```

Example VEHICLE:

```text
no wheel-count drift
no front/rear reversal
no detached running gear
```

Do not create a giant negative prompt containing every possible failure.

## 9. Presentation Rules

Use the canonical adaptive layout:

```text
HEADER
HERO + CONSTRUCTION VIEWS
CRITICAL DETAILS when needed
MOTION STRIP when needed
```

Image text is limited to:

```text
asset title
view labels
short detail labels
short pose labels
```

No paragraphs or technical documentation inside the image.

If a row is not needed, remove it and enlarge the remaining evidence.

If useful evidence becomes too small or crowded, move the overflow to Sheet 02+ rather than shrinking everything.

## Prompt Construction Modes

### Sheet 01 — Main Reference

Prompt composition:

```text
TARGET IDENTITY
+ VISUAL LANGUAGE
+ CONFIRMED IDENTITY LOCK
+ MAIN_REFERENCE purpose
+ minimum useful panel plan
+ global consistency
+ current high-risk negatives
+ adaptive layout
```

### Sheet 02+ — Continuation

Prompt composition:

```text
APPROVED SHEET 01 AS IDENTITY ANCHOR
+ exact same identity lock
+ one overflow purpose
+ only new required panels
+ explicit DO NOT REDESIGN instruction
+ repeated-view consistency when applicable
```

Do not regenerate the whole identity from prose alone when an approved prior sheet is available as visual authority.

## Correction Prompt

For user corrections, generate from:

```text
APPROVED CURRENT SHEET
+ CHANGE
+ PRESERVE
+ affected panel(s)
```

Example:

```text
CHANGE
- replace straw hat with dark beanie

PRESERVE
- body proportions
- face
- clothing
- basket
- tool
- pose
- all unrelated materials
```

Use bounded image editing when possible. Do not regenerate unrelated panels simply because one local element changed.

## Source-Image Translation

When the user supplies a real-world/non-Minecraft source:

```text
source image = evidence
compiled target = Minecraft interpretation decision
final sheet = Minecraft/Blockbench target only
```

Preserve source-supported identity features while simplifying them into a buildable Minecraft/Blockbench visual language.

Do not embed the source image into the final production sheet by default.

## Profile Influence

Profiles guide what information is likely high value, but they do not change the universal prompt structure.

Examples:

```text
PROP_FURNITURE
→ supports, openings, shelves, hinges, contact

VEHICLE
→ stance, wheel/track relationships, cabin, orientation

HUMANOID
→ proportion, clothing/accessories, joint overlap

CREATURE
→ body axis, limb topology, tail/wing/jaw attachment

MECHANICAL
→ linkage, axis, slider/guide, clearance

PLANT_FOLIAGE
→ growth silhouette, carrier orientation, stem/branch attachment
```

Do not dump the whole profile into the image-generation prompt. Include only conclusions that matter to the planned panels.

## Internal Pre-Generation Check

Before calling image generation, verify:

```text
blocking requirements resolved
compiled brief current
final user confirmation approved
sheet purpose justified
panel plan within information budget or justified overflow
all panels are P1/P2
identity lock explicit
no superseded instruction remains
no invented design fact added
```

If any check fails, do not generate.

## Internal Post-Generation Check

Before user review, verify against the confirmed brief and identity lock:

```text
identity correct
part count correct
cross-view proportions consistent
attachments/openings consistent
materials/colors consistent
asymmetry preserved
critical details useful
motion poses use the same model identity
labels correct and minimal
no redundant/decorative panel displaced useful evidence
```

For Sheet 02+, compare directly against Sheet 01.

## Economy Rule

The goal is not the shortest prompt. The goal is the shortest prompt that reliably preserves all decision-critical authority.

Prefer:

```text
stable structured clauses
panel-specific facts
explicit identity lock
small targeted negative list
```

Avoid:

```text
conversation transcript
repeated profile documentation
long generic art-direction prose
MCP/Blockbench implementation instructions
duplicate descriptions of the same fact
```

## Completion

The prompting layer is correct when:

```text
user prompting quality no longer determines generation quality
raw conversation does not contaminate generation
one universal sheet language works across asset classes
panel selection remains decision-driven
Sheet 02+ cannot silently drift from Sheet 01
real-source translation produces Minecraft-only production references
image generation receives enough structure without unnecessary context
```
