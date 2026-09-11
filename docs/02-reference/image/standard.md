# LazyDesigner Unified Image Reference Standard

Updated: 2026-09-11

This document owns the canonical visual-sheet standard for ChatGPT-generated LazyDesigner reference images.

The goal is not to make presentation boards. The goal is to provide the **minimum visual evidence that materially reduces downstream Astra/Codex uncertainty** across Geometry, Texture and Animation.

## Core Principle

```text
EVERY VISIBLE PANEL MUST REDUCE DOWNSTREAM UNCERTAINTY
```

A panel is included only when it materially helps one or more of:

```text
GEOMETRY_AMBIGUITY
TEXTURE_AMBIGUITY
ANIMATION_AMBIGUITY
```

If a panel is decorative, redundant, already obvious from another panel, or does not change a downstream decision, remove it.

## One Unified Visual System

All asset profiles use the same layout language:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

Do not maintain separate visual design systems for each asset class.

The content adapts to the asset; the visual grammar remains consistent.

## Default Rule

```text
1 PRIMARY REFERENCE SHEET PER ASSET BY DEFAULT
```

The primary sheet should carry as much useful Geometry, Texture and Animation information as can remain clearly readable.

Additional sheets are allowed only when useful information would otherwise become too dense or too small.

```text
Sheet 01 = canonical visual identity + core construction
Sheet 02+ = elaboration / overflow only
```

Additional sheets must never redesign the asset.

## Information Priority

When space is constrained:

```text
GEOMETRY > TEXTURE > ANIMATION
```

This does not mean Animation is unimportant. It means the primary reference must never sacrifice readable form, proportion, topology or depth merely to fit more support information.

Drop lower-value support information before shrinking critical Geometry views below useful readability.

## Information Budget

Default maximum target for one standard sheet:

```text
HERO                 1
CONSTRUCTION VIEWS   2–4
CRITICAL DETAILS     0–3
KEY POSES            0–5
```

These are upper guidance bounds, not quotas.

A simple asset may use substantially less.

Never add a panel just to fill the layout.

## Panel Priority

Internally classify each candidate panel:

```text
P1 — REQUIRED
Without this panel Astra/Codex may materially misread the asset.

P2 — USEFUL
This materially improves accuracy but is not required to understand the asset.

P3 — REDUNDANT / DECORATIVE
This does not materially change a downstream decision.
```

Rules:

```text
include P1
include P2 only while readability remains strong
remove P3
```

If a sheet becomes crowded, remove the lowest-value P2 panel first.

## Universal Layout Grammar

The preferred standard composition is:

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

The layout is adaptive:

```text
no animation      → remove motion row
no critical detail→ remove detail row
no useful BACK/TOP→ enlarge remaining useful views
simple asset      → fewer panels, larger visual evidence
complex asset     → extend to additional sheet instead of overpacking
```

Core rule:

```text
CONTENT DECIDES LAYOUT
NOT
LAYOUT FORCES CONTENT
```

## Header

Keep the header minimal.

Required:

```text
ASSET NAME
```

Optional small subtitle only when it materially helps orientation, for example:

```text
Minecraft Bedrock / Blockbench Reference
```

Do not add decorative quotes, slogans, long model-info blocks, or explanatory paragraphs to the image.

Technical prose belongs in `REFERENCE.json` and stage Markdown files.

## Hero View

Use one dominant hero view whenever it materially improves whole-form understanding.

Preferred default:

```text
FRONT-LEFT 3/4
```

The hero should communicate:

```text
identity
whole silhouette
volume/depth
major layering
primary attachment relationships
major material separation
```

The hero is not a cinematic beauty render. Use neutral, readable presentation.

## Construction Views

Use the minimum sufficient views.

Typical decision value:

```text
FRONT → width, height, part count, major silhouette
LEFT  → depth, profile, attachment, body axis
BACK  → rear topology/asymmetry only when materially different
TOP   → footprint/depth/layout only when materially useful
RIGHT → only when left/right asymmetry matters
```

Do not require FRONT + LEFT + BACK + TOP + RIGHT on every asset.

A view must earn its space by constraining a material downstream decision.

Orthographic/construction views must use consistent scale, orientation and subject proportions.

## Critical Detail Panels

A detail panel exists only to resolve a high-risk interpretation not already clear in the hero/construction views.

Examples of useful details:

```text
PROP_FURNITURE
- shelf angle
- drawer/door relationship
- support joint

VEHICLE
- wheel mounting
- cockpit opening
- hinge/axle relationship

HUMANOID
- hand/tool attachment
- backpack attachment
- shoulder/hip overlap

CREATURE
- wing root
- jaw connection
- tail base

MECHANICAL
- linkage
- slider/guide
- pivot/axis connection

PLANT_FOLIAGE
- branch/stem attachment
- layered/crossed carrier relationship when visually ambiguous
```

Do not create close-ups merely because an element looks interesting.

## Texture Information

Do not reserve a mandatory separate texture area.

Texture information should primarily be readable directly from:

```text
hero
construction views
critical details
```

Add a dedicated material/detail panel only when it materially resolves:

```text
identity-critical marking
special emissive region
alpha/cutout silhouette
important asymmetric material
specific pattern/surface direction
source-specific material distinction
```

Do not add palette boxes by default. Numeric or descriptive material facts belong in the package documents unless they require visual evidence.

## Motion Strip

Include only when animation is required **and** visible pose evidence materially improves downstream motion interpretation.

Preferred default:

```text
3–5 key poses maximum
```

Common action structure:

```text
READY
ANTICIPATION
ACTION / CONTACT
FOLLOW_THROUGH
RECOVERY
```

Simpler motion may use only:

```text
START
EXTREME
RETURN
```

The image communicates pose silhouette, direction and contact. Detailed timing belongs in `ANIMATION.md`.

Do not shrink key poses until they are visually useless just to keep everything on one sheet.

## Multi-Sheet Escalation

Use additional sheets only when one sheet can no longer preserve useful readability.

Recommended semantic order:

```text
01-main-reference.png
02-detail-motion.png
03-extra-reference.png
```

Names may adapt, but Sheet 01 remains the identity anchor.

Additional sheets may contain:

```text
high-value structural overflow
rig/deformation detail
key-pose expansion
complex mechanical linkage
necessary variants
```

Do not create an extra sheet for low-value decoration.

## Identity Lock / Anti-Drift

Once Sheet 01 establishes the approved target, every later generated sheet must preserve:

```text
same asset identity
same whole-model proportions
same required part count
same major silhouette
same materials/colors where already approved
same accessories/props
same asymmetry/orientation
same construction logic
```

A later sheet may reveal more detail but may not silently redesign existing authority.

If a requested change modifies any locked identity element, treat it as a revision and update all materially affected sheet evidence coherently.

## Repeated View Consistency

If the same view appears across multiple sheets:

```text
same orientation
same subject proportions
same visible part identity
same material identity
same camera convention
```

A repeated FRONT view that changes proportions or accessories is a drift defect.

## Visual Language

Use a consistent production-reference look:

```text
clean light or neutral background
neutral studio-like lighting
clear Minecraft/Blockbench target form
readable voxel/block construction
high edge/silhouette clarity
low visual noise
consistent scale within related views
minimal decorative styling
```

Do not use cinematic environments for orthographic evidence.

A small contextual hero presentation is acceptable only when context materially helps understand attachment/function; construction views must remain clean.

## Minecraft Target Only

When the user supplies a real-world or non-Minecraft source, the final generated reference sheet should normally show the **approved Minecraft/Blockbench interpretation only**.

Do not include the original real image inside the final production sheet merely for comparison.

The source may remain separately available as `SOURCE_REFERENCE` when needed for authority.

## Text Policy

Image text is limited to:

```text
asset title
view labels
short panel labels
short pose labels
```

Avoid paragraphs, long technical notes, JSON-like annotations, numeric implementation detail, or decorative prose.

Technical explanation belongs in:

```text
REFERENCE.json
GEOMETRY.md
TEXTURE.md
ANIMATION.md
```

## Default Removals

Do not include by default:

```text
color palette box
generic model-info block
decorative quote/tagline
scale illustration when numeric scale is already documented
RIGHT when identical to LEFT
TOP when it constrains nothing
repeated props already clear in main views
close-up detail already clear in construction views
long explanatory text
real-image comparison panel
```

Any of these may appear only when it materially changes a downstream decision.

## Internal Visual QA

Before presenting a generated sheet, verify:

```text
identity matches confirmed brief
required parts are present
hero and construction views agree
proportions do not drift across views
attachments/openings agree across views
approved materials/colors remain consistent
support panels describe the same asset
motion poses preserve the same geometry identity
labels are correct and minimal
no panel is obviously redundant
no important panel is too small to interpret
```

For multi-sheet packages, also compare every new sheet against Sheet 01 identity lock.

## Failure Rules

A sheet fails when any material condition is true:

```text
cross-view structural contradiction
same part changes shape without approved reason
part count changes across views
material identity drifts across panels
additional sheet redesigns the asset
critical view is too small to interpret
panel density reduces overall usefulness
motion pose compensates for incorrect geometry
visual decoration displaces decision-critical evidence
```

Fix the owning issue before approval.

## Completion Condition

A visual reference set is efficient when:

```text
every panel has a decision purpose
one primary sheet carries the maximum useful non-crowded evidence
additional sheets exist only for real overflow
all sheets remain identity-locked
Geometry/Texture/Animation information is visually available where useful
Astra/Codex can interpret the asset without decorative or redundant panels
```
