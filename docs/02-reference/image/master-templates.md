# LazyDesigner Image Generation Master Templates

Updated: 2026-09-11

This document owns the compact reusable master templates used after Reference Preparation has resolved requirements, compiled a clean brief, selected useful panels, and obtained explicit user confirmation.

It complements:
- `prompt-contract.md`
- `standard.md`
- `scale-and-escalation.md`

The templates are internal prompt-construction forms. They are not user-facing prompt requirements and must never be filled from uncontrolled raw chat when a compiled brief exists.

## Core Rule

```text
APPROVED STATE
+ MINIMUM RELEVANT VISUAL FACTS
+ PANEL PLAN
+ IDENTITY LOCK
+ SCALE LOCK
→ ONE CLEAN GENERATION INSTRUCTION
```

Do not repeat the whole conversation, whole asset profile, whole package schema, or downstream MCP/Blockbench instructions.

## Shared Input State

Before using any template, resolve this compact state:

```text
asset_name
profile
confirmed_target
scale_anchor
identity_lock
material_lock
construction_lock
sheet_purpose
panel_plan
high_risk_failures
source_visual_authority when relevant
```

### `scale_anchor`

Use the strongest available scale authority:

```text
explicit dimensions
or
Minecraft player-relative scale
```

Canonical relative vocabulary is owned by `scale-and-escalation.md`.

Never convert a relative scale category into invented exact block dimensions.

## Shared Visual Language Clause

Use this once per generated sheet, not repeatedly per panel:

```text
Minecraft Bedrock / Blockbench production reference only.
Clean voxel/block construction, neutral light background, studio-like neutral lighting,
clear silhouette and edge readability, consistent proportions and material identity across all panels,
minimal text and minimal decorative styling.
```

When the source is real-world/non-Minecraft, the final production sheet still shows the Minecraft/Blockbench target only unless the user explicitly requests otherwise.

---

# TEMPLATE A — SHEET 01 / MAIN_REFERENCE

Use for the canonical first sheet.

## Purpose

Sheet 01 establishes:

```text
visual identity
player/world scale
whole-model proportion
major construction
material identity
core attachment relationships
```

It is the anchor for every later sheet.

## Master Form

```text
CREATE MAIN REFERENCE SHEET

TARGET
<one concise sentence describing the confirmed Minecraft/Blockbench asset>

SCALE
<explicit confirmed dimensions if available>
OR
<Minecraft player-relative scale anchor>
Preserve this scale consistently across every view.

IDENTITY LOCK
- <major silhouette fact>
- <required major parts / part count>
- <required accessories / props>
- <required asymmetry / orientation>
- <identity-critical markings/material facts>

CONSTRUCTION LOCK
- <major attachment/opening/contact relationship>
- <major body/assembly hierarchy only when material>

VISUAL LANGUAGE
Minecraft Bedrock / Blockbench production reference only.
Clean voxel/block construction, neutral light background, studio-like neutral lighting,
clear silhouette and edges, consistent proportions and materials, minimal text and decoration.

SHEET PURPOSE
MAIN_REFERENCE — establish canonical identity, scale and core construction.

PANELS
<only selected P1/P2 panels, ordered by priority>

For each panel:
- <PANEL LABEL>: <view/subject> — <single downstream decision purpose>

CONSISTENCY
- same asset proportions in every panel
- same part count and attachments
- same left/right orientation
- same approved materials/colors
- same player-relative/world scale
- orthographic views must read as the exact same asset from different directions

DO NOT CHANGE / HIGH-RISK FAILURES
- <small targeted list only>

PRESENTATION
- one dominant hero when useful
- construction views aligned and consistently scaled
- no paragraph text
- no palette box unless decision-critical
- no decorative panels
- omit rows that carry no useful evidence
```

## Panel Ordering

Prefer:

```text
HERO P1
→ construction P1
→ construction P2
→ critical detail P1
→ critical detail P2
→ compact key pose only if still clearly readable
```

If required evidence becomes too small, stop and escalate overflow to Sheet 02 instead of compressing the main sheet.

## Scale Visibility

Do not automatically draw a player silhouette.

Add compact visual player-scale evidence only when it materially reduces ambiguity, for example:

```text
vehicle occupancy
stall/kiosk
large machinery
identity-critical creature scale
ambiguous large environment prop
```

Otherwise keep scale in the prompt/package state without spending image area on it.

---

# TEMPLATE B — SHEET 02+ / CONTINUATION

Use only after Sheet 01 exists as approved/current visual anchor.

## Purpose

A continuation sheet may explain one bounded overflow problem:

```text
DETAIL_REFERENCE
RIG_REFERENCE
MOTION_REFERENCE
MECHANICAL_DETAIL
VARIANT_REFERENCE when explicitly required
```

It must not redesign the asset.

## Master Form

```text
CREATE CONTINUATION REFERENCE SHEET

VISUAL ANCHOR
Use approved Sheet 01 as the canonical identity and scale authority.

PRESERVE IDENTITY LOCK
- same whole-model proportions
- same major silhouette
- same required part count
- same accessories/props
- same approved materials/colors
- same asymmetry/orientation
- same construction logic
- same identity-critical markings

PRESERVE SCALE LOCK
- same Minecraft player/world relationship
- same occupancy/interaction scale
- same relative size of major parts

SHEET PURPOSE
<one purpose only: DETAIL_REFERENCE | RIG_REFERENCE | MOTION_REFERENCE | MECHANICAL_DETAIL | VARIANT_REFERENCE>

NEW PANELS ONLY
<only overflow panels that could not remain readable on Sheet 01>

For each panel:
- <PANEL LABEL>: <view/subject> — <single downstream decision purpose>

REPEATED VIEW RULE
If a view from Sheet 01 is repeated, preserve the same orientation, proportions, part identity,
material identity and camera convention. Enlarging a detail for readability must not imply a changed underlying scale.

DO NOT REDESIGN
- do not change proportions
- do not add/remove major parts
- do not change accessories
- do not change material identity
- do not change player-relative scale
- do not reinterpret asymmetry
- do not alter unrelated construction

PRESENTATION
Use the same visual language, background, lighting, typography and label style as Sheet 01.
Keep the sheet bounded to its one declared purpose.
```

## Continuation Sheet Selection

Before creating Sheet 02+, verify that all lower-value alternatives were exhausted:

```text
remove P3
→ remove lowest-value P2
→ remove redundant view
→ restore useful size to P1
→ only then create continuation sheet
```

Sheet 03+ requires remaining P1/P2 evidence that still cannot fit clearly after Sheet 02.

---

# TEMPLATE C — CORRECTION / REVISION

Use bounded image editing whenever possible.

## Principle

```text
APPROVED CURRENT VISUAL
+ CHANGE
+ PRESERVE
→ MINIMUM AFFECTED EDIT
```

Do not regenerate unrelated evidence unless the correction changes a locked identity/scale relationship across multiple panels.

## Master Form

```text
EDIT CURRENT APPROVED REFERENCE

CHANGE
- <exact user-approved change>
- <second change only if directly related>

AFFECTED PANELS
- <panel(s) that materially require update>

PRESERVE
- whole-model proportions unless explicitly changed
- player/world scale unless explicitly changed
- all unrelated geometry
- all unrelated materials/colors
- all unrelated accessories/props
- established left/right orientation
- established construction relationships
- approved layout/visual language

CROSS-VIEW CONSISTENCY
If the changed feature appears in multiple views, update every materially affected view coherently.
Do not leave the old version in another panel.

SCALE REVISION RULE
If the user changes scale materially, treat it as a new Scale Lock and update every affected panel/sheet coherently.
Do not modify scale accidentally during an unrelated correction.

DO NOT CHANGE
- <targeted high-risk unrelated elements that must remain identical>
```

## Correction Scope Decision

```text
local visual defect
→ edit local panel/region

feature appears in multiple views
→ edit all affected views coherently

identity or scale revision
→ update Sheet 01 authority and every materially dependent sheet

whole-sheet coherence failure
→ regenerate that sheet using current locks, not old raw chat
```

---

# Template Compression Rules

The master templates are structures, not text that must be copied verbatim.

The final generation instruction should remove empty sections and collapse redundant facts.

Example:

```text
no animation
→ remove motion language entirely

no material ambiguity
→ do not add material-detail instructions

symmetric asset
→ no RIGHT panel and no asymmetry warning unless needed

standard humanoid scale
→ preserve PLAYER_HEIGHT internally; no visual scale marker required
```

Do not use token budget to explain why omitted panels are absent.

# Panel Payload Format

Internally, a compact panel item should be sufficient:

```text
<PANEL_ID> | <TYPE> | <VIEW_OR_SUBJECT> | <P1/P2> | <PURPOSE>
```

Example:

```text
HERO_01 | HERO | FRONT_LEFT_3Q | P1 | whole silhouette + depth
VIEW_FRONT | CONSTRUCTION | FRONT | P1 | width + part count
DETAIL_TOOL_HAND | DETAIL | hand/tool attachment | P1 | prevent floating attachment
POSE_CONTACT | KEY_POSE | harvest contact | P2 | clarify tool contact
```

Do not copy a prose description of the entire asset into every panel.

# Profile-Specific Injection Rule

Profiles may contribute only the smallest relevant clause needed for current panels.

Examples:

```text
HUMANOID
→ joint overlap only if rig/motion matters

VEHICLE
→ wheel/cockpit/occupancy relationship only if selected panels depend on it

PLANT_FOLIAGE
→ growth spread/stem attachment only when those are current ambiguity targets

MECHANICAL
→ linkage/axis/clearance only for current mechanism panel
```

Never inject the entire profile guide into a generation prompt.

# Pre-Call Gate

Do not invoke image generation unless all are true:

```text
blocking requirement gate passed
clean compiled brief exists
explicit user confirmation exists for current target
scale is resolved enough for intended asset
sheet purpose is justified
selected panels are P1/P2 only
sheet escalation decision already made
identity lock exists
scale lock exists when material
no superseded direction remains
```

# Post-Call Gate

Before presenting the generated image, verify:

```text
asset identity matches confirmed target
scale relationship is correct
cross-view proportions agree
part count agrees
attachments/openings agree
materials/colors do not drift
later sheets match Sheet 01
motion poses use the same asset, not a redesigned version
labels are minimal and correct
no decorative panel displaced useful evidence
```

If this fails, fix the owning issue before asking the user to approve it.

# Economy Target

The intended result is:

```text
poor or casual user prompt
→ Requirement Gate
→ Prompt Compiler
→ compact approved state
→ one reusable master template
→ consistent production reference
```

Generation quality should depend on confirmed visual/technical authority, not on the user's ability to write a sophisticated image prompt.