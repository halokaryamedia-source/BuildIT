# LazyDesigner — Reference Guide

**Status:** Active Policy  
**Version:** 4.0  
**Updated:** 2026-09-11

## Purpose

Own durable Source Image → Approved Reference → Reference Package semantics for LazyDesigner.

Operational reference preparation belongs in ChatGPT using `.agents/skills/blockbench-reference-generator/SKILL.md`. The detailed handoff contract belongs in `docs/knowledge/reference-handoff.md`.

The goal is a recognizable, Minecraft-appropriate, Blockbench-buildable interpretation plus enough structured technical evidence to prevent avoidable downstream guessing.

## Authority / Evidence

```text
user brief / approved target      → identity + requested function
original Source Image(s)          → source-visible evidence
Approved Reference Image(s)       → visual modelling authority
approved numeric dimensions       → numeric scale/envelope authority
user technical constraints        → nonvisual requirement authority
Reference Package metadata        → structured relationships/evidence/unknowns; never overrides stronger authority
```

The actual Approved Reference Image must be available as multimodal input when used for reference-driven visual reasoning. A path, filename, prose summary or metadata alone is not visual evidence.

When multiple source images are available, use each only for what it visibly proves. Do not average conflicting views into invented geometry.

## Execution Boundary

Reference generation/editing requires a fresh explicit user request. Repository work, audit, CI or downstream Codex authoring never implicitly authorizes image generation.

Normal handoff is now:

```text
Approved Reference Image(s)
+ compact Reference Package metadata
+ original user intent
→ LazyDesigner Control
→ Codex
```

The package is not a giant blueprint. It exists only to preserve decision-critical facts, relationships and unknowns that ChatGPT already resolved during reference preparation.

## Progressive Reference Intake

Accept the user's actual image first. Do not force reference-board generation as ceremony.

```text
actual image supplied
→ sufficient for next material decision
   → may become Approved Reference directly
→ material evidence missing/conflicting
   → request smallest decision-changing extra source/detail
   → if still unresolved and blocking
      → canonical board or BLOCKED
```

Preferred escalation:

```text
current supplied evidence
→ one decision-changing additional source/detail
→ canonical turnaround only when stronger normalized coverage is needed
```

Do not generate extra views that cannot change the next decision.

## Canonical Asset Profile Vocabulary

Reference Preparation and downstream Modelling use one vocabulary:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_CUTOUT
GENERIC
```

Profiles are knowledge overlays, not geometry presets. `GENERIC` is fallback only.

## Optional Reference Modules

```text
TURNAROUND
STRUCTURAL_DETAIL
MATERIAL_TEXTURE
RIG_DEFORMATION
POSE_ACTION
EXPRESSION_FACE
ANIMATION_KEYFRAME
```

Only include modules that materially improve the next modelling decision.

## Minecraft-First Fidelity

### Geometry
Preserve recognizable silhouette, major masses, defining part count, attachments/topology, important negative spaces and identity-critical features. Prefer the simplest native Blockbench representation preserving those requirements.

### Texture
Preserve base palette, material regions, part separation and identity-critical markings. Texture supports Geometry; it must not fake required silhouette or missing structure.

### Articulation
Use structurally readable poses. Preserve joint overlap, parent/child relationship, motion-bearing regions and plausible clearance without inventing hidden precision or creating exaggerated gaps.

## Canonical Turnaround

When normalized turnaround evidence is required:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

`LEFT`, `FRONT`, `BACK`, `TOP` are construction evidence. `FRONT-LEFT 3/4` is supplemental volume/readability evidence. Do not substitute generic `SIDE` when orientation matters.

Keep subjects uncropped, consistently scaled and on a neutral background. Do not overload the image with dimensions, pivots, JSON-like notes or implementation instructions; nonvisual technical information belongs in metadata.

## Semantic Parts

Reference Preparation may name decision-critical semantic parts to create stable communication anchors across image, metadata, Control and Codex.

Each relevant part may record:

```text
id/name
role: GEOMETRY | TEXTURE | ANIMATION_ONLY | EFFECT | OMIT | UNRESOLVED
parent/contact target when material
symmetry
motion participation
evidence state
```

This is not a per-Cube plan and must not prescribe implementation coordinates.

## Evidence State

For material modelling claims:

```text
SUPPORTED
PROVISIONAL
CONFLICTING
UNAVAILABLE
```

Claim text describes what evidence supports, not what the object usually has.

## Unknown Classification

```text
blocking unknown
= can change the next stage's part count, topology, primary silhouette/depth, articulation, required attachment/contact, numeric requirement or identity-critical material decision

non-blocking unknown
= unresolved detail that does not change the next legal decision
```

Do not guess either class. Blocking unknowns prevent readiness for the affected stage; non-blocking unknowns remain visible without stopping unrelated work.

## Reference Readiness

Overall status:

```text
READY
NEEDS_REVIEW
BLOCKED
```

Relevant readiness dimensions:

```text
identity
part completeness
topology/attachment
depth
articulation
material
```

Each is `PASS | NOT_REQUIRED | NEEDS_REVIEW | BLOCKED`.

Rules:
- required `BLOCKED` dimension → overall `BLOCKED`;
- material user choice still unresolved but no hard blocker → `NEEDS_REVIEW`;
- all required dimensions `PASS`/`NOT_REQUIRED` and no blocking unknown → `READY`.

Readiness is stage-specific. Missing texture detail does not block Geometry if Geometry evidence is otherwise sufficient.

## Material Consistency

A discrepancy is material only when it changes identity, primary mass/required part count, topology/attachment, important negative space, buildability, articulation or identity-critical material information.

Minor cross-view drift does not invalidate an otherwise useful reference. Material conflict must not be averaged into invented geometry.

## View Pair Map

Use only when canonical corresponding views exist:

```text
REFERENCE FRONT      ↔ MODEL front
REFERENCE BACK       ↔ MODEL back
REFERENCE LEFT       ↔ MODEL left
REFERENCE TOP        ↔ MODEL top
REFERENCE FRONT-LEFT ↔ MODEL front-left 3/4
```

For direct source images, compare only supported views. Ambiguous/mirrored pairing remains unverified.

## Visual Gate

A generated reference is acceptable only when it is recognizable, structurally buildable, free of material cross-view contradiction, sufficiently complete for the next stage, and approved when it changes visual authority.

Check in this order:
1. identity;
2. required part completeness;
3. topology/attachment/negative space;
4. proportion/depth consistency;
5. buildability;
6. articulation readability when relevant;
7. material usability when relevant;
8. crop/readability.

## Correction Strategy

Use delta-first correction and fix the largest structural difference first.

```text
local defect
→ edit affected area

cross-view structural defect
→ edit all affected views coherently

global identity/layout/coherence failure
→ regenerate full board
```

For one unchanged automatic cycle:

```text
first draft            = maximum 1
targeted correction    = maximum 1
automatic alternatives = 0
```

A fresh user-directed correction starts a new user-led review cycle.

## Reference Package

Compact metadata may contain:

```text
asset/profile/original intent
requirements
reference readiness
critical views/modules
semantic parts
articulation relationships
materials
animation guidance
constraints
blocking + non-blocking unknowns
```

Use JSON for structured facts and Markdown only for explanation-heavy relationships. `null` means unknown and is never permission to infer.

Images remain visual authority. Metadata does not replace or paraphrase away visual identity.

## Completion

Reference Preparation is complete when:
- visual authority is approved or explicitly accepted from source-only evidence;
- one canonical profile is selected;
- only necessary modules are included;
- semantic parts cover material downstream relationships without becoming a Cube plan;
- blocking/non-blocking unknowns are separated;
- stage-specific readiness is explicit;
- no guessed technical facts enter the handoff.

## Related

- [Reference → Codex Handoff](../knowledge/reference-handoff.md)
- [Skill Taxonomy](../knowledge/skill-taxonomy.md)
- [Product Requirements](02-product-requirements.md)
- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Current Flow](../knowledge/flow.md)
