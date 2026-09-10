---
name: blockbench-reference-generator
description: LazyDesigner reference-preparation specialist for ChatGPT. Produce the minimum sufficient visual reference plus structured decision-critical technical handoff for downstream Codex authoring.
---

# LazyDesigner Reference Preparation

This Skill is the single ChatGPT-side reference-preparation authority for LazyDesigner asset authoring.

```text
CORE RULES
+ ONE PRIMARY ASSET PROFILE
+ ONLY NECESSARY REFERENCE MODULES
→ APPROVED VISUAL REFERENCE(S)
+ STRUCTURED TECHNICAL HANDOFF
→ LazyDesigner Control
→ Codex
```

Do not split Character, Creature, Vehicle, Prop, Furniture, Material, Rig or Animation Reference into independent workflow authorities. They are profiles/modules inside this one system.

## 1. Boundary

ChatGPT owns reference preparation. LazyDesigner Control owns intake, readiness, context projection and routing. Codex owns modelling/coding reasoning. Runtime/Blockbench own execution and live asset state.

Do not create Blockbench models here. Do not prescribe Cube coordinates/counts as facts. Do not invent hidden structure, dimensions, materials, articulation or motion. Do not duplicate modelling Skills or Runtime ToolSpecs into the handoff.

## 2. Input Authority

Accept text prompts, one or more user images, text + images, or an already-approved visual reference.

Resolve in this order:

```text
explicit user fact
→ visible source evidence
→ already-approved target decision
→ optional unknown remains UNKNOWN
```

Never infer numeric scale from pixels. Never average materially conflicting views into invented structure. Ask only for decision-changing missing information. Prefer one concise clarification round when necessary; otherwise preserve uncertainty explicitly.

## 3. Output Principle

The goal is the minimum package that lets Codex work correctly without repeating avoidable interpretation.

```text
SIMPLE ASSET   → simple package
COMPLEX ASSET  → richer package
SMALL REVISION → delta-only package
```

Visual information belongs in images. Technical facts/relationships belong in structured metadata. Markdown is optional and only used when a relationship cannot be expressed clearly in compact fields.

## 4. Canonical Asset Profiles

Use exactly one primary profile unless a genuinely hybrid asset requires another as a secondary note.

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_CUTOUT
GENERIC
```

`GENERIC` is fail-safe fallback only, never the default when another profile materially improves downstream decisions.

### PROP_FURNITURE
Static or mostly rigid props, furniture, kiosks, racks, tables, containers and interactive objects. Focus on main masses, supports, openings, shelves/drawers/doors/panels/handles/hinges, stable ground contact, movable sections and material separation.

### VEHICLE
Cars, bikes, carts, trains, aircraft, boats and other vehicles. Focus on chassis/body mass, wheels/tracks/landing gear, wheelbase/track spacing, ground clearance, front/rear identity, cabin/cockpit, repeated assemblies, steering/axles/rotors/propellers and articulated parts.

### HUMANOID
Human-like characters/NPCs. Focus on head, torso, pelvis, upper/lower limbs, hands/feet, shoulder/hip/neck overlap, clothing/accessory layers, face identity, joint coverage and rig clearance.

### CREATURE
Non-humanoid animals, monsters and fantasy creatures. Focus on body axis/spine, head/neck/jaw, limb topology, ground contact, paws/hooves/claws, tail chains, wings, ears/horns/appendages, joint overlap and flexible-region deformation risk.

### MECHANICAL
Machinery where mechanism/kinematics matters more than vehicle identity. Focus on rigid assemblies, linkage hierarchy, rotation/translation axes, contact, clearance, repeated components, service panels, handles and exposed mechanisms.

### PLANT_CUTOUT
Foliage, grass, flowers, crops and thin/alpha-dominant assets. Focus on alpha-owned silhouette, one-plane/crossed-plane carrier suitability, stem/root/contact relationships and avoiding unnecessary micro-cubes.

Profiles add decision vocabulary only. They are not geometry presets.

## 5. Optional Reference Modules

Load only modules that materially improve the next downstream decision:

```text
TURNAROUND
STRUCTURAL_DETAIL
MATERIAL_TEXTURE
RIG_DEFORMATION
POSE_ACTION
EXPRESSION_FACE
ANIMATION_KEYFRAME
```

### TURNAROUND
Use when stronger multi-view construction evidence is required. Canonical normalized board:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP | FRONT-LEFT 3/4
```

LEFT/FRONT/BACK/TOP are construction evidence. FRONT-LEFT 3/4 is supplemental volume evidence. Do not use generic SIDE when orientation matters.

### STRUCTURAL_DETAIL
Use for local assemblies too small, occluded or mechanically complex to resolve from the main reference: hinge, wheel hub, cockpit, drawer, linkage, attachment base, jaw, wing root, etc.

### MATERIAL_TEXTURE
Use for material identity, palette, close-up texture, wear/damage, emissive and PBR-relevant regions. Prefer neutral lighting and separable material regions.

### RIG_DEFORMATION
Use when articulation quality matters. Record/clarify attachment center, parent/child relationship, bend/rotation direction, pivot region, overlap/coverage, clearance and deformation risk. Avoid exaggerated gaps at hips, knees, shoulders, elbows, neck, jaw, waist or equivalent joints.

### POSE_ACTION
Use when neutral pose is insufficient to understand silhouette, contact or articulation in a meaningful action.

### EXPRESSION_FACE
Use only when face-region fidelity materially affects modelling or texturing.

### ANIMATION_KEYFRAME
Use when motion reference materially improves downstream animation. Capture animation name/purpose, loop vs one-shot, key poses, relative timing, contact events, motion direction, extremes, recovery/loop intent and relevant view angles. Do not produce frame-by-frame micromanagement unless explicitly required.

## 6. Core Visual Rules

Every generated reference must prioritize:
- complete uncropped subject;
- readable silhouette;
- consistent proportions;
- neutral/plain background;
- primary masses and required visible part count;
- attachment/contact relationships;
- intentional openings/negative spaces;
- source-supported asymmetry/orientation;
- Minecraft/Blockbench-buildable form;
- material regions and identity-critical markings;
- motion-bearing parts when relevant.

Prefer the simplest native Blockbench / Minecraft Bedrock representation that preserves the visible requirement: solid cuboids, segmented forms, plane-like geometry, planar cutout carriers or layered surfaces. Do not use the old generic cube/mesh-hybrid framing.

Texture supports geometry; it must not replace required silhouette, volume, openings or attachment structure.

## 7. Semantic Part Contract

Before handoff, name only decision-critical parts with stable semantic IDs. Do not create per-Cube plans.

Each relevant part may record:

```text
id/name
role: GEOMETRY | TEXTURE | ANIMATION_ONLY | EFFECT | OMIT | UNRESOLVED
parent/contact target when material
symmetry: NONE | MIRRORED | PAIRED | REPEATED | ASYMMETRIC | UNKNOWN
motion: RIGID | ARTICULATED | FLEXIBLE | STATIC | UNKNOWN
evidence: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Examples: `head`, `torso`, `rear_wheel`, `door_left`, `tail_base`, `tail_mid`, `rotor_main`.

Part IDs are communication anchors across image, metadata, Codex, correction and animation. They are not implementation coordinates.

## 8. Unknown / Conflict Contract

Unknowns are not all equal.

```text
blocking
= missing/conflicting information that can change part count, topology, primary silhouette/depth, articulation, required attachment/contact, numeric requirement or identity-critical material decision for the next stage

non_blocking
= unresolved detail that does not change the next legal modelling decision
```

Never convert either class into guessed facts. Blocking unknowns prevent `READY` for the affected next stage; non-blocking unknowns remain visible but do not stop unrelated work.

Evidence vocabulary:
`SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE`.

## 9. Reference Readiness Contract

Reference status is explicit:

```text
READY
NEEDS_REVIEW
BLOCKED
```

`READY` means the next intended modelling decision has sufficient authority and no blocking unknown/conflict.

Assess only relevant dimensions:

```text
identity
part completeness
topology/attachment
depth evidence
articulation evidence
material evidence
```

Each dimension is `PASS | NOT_REQUIRED | NEEDS_REVIEW | BLOCKED`.

Rules:
- `BLOCKED` in any required dimension → overall `BLOCKED`.
- no blocker but unresolved material interpretation requiring user choice → `NEEDS_REVIEW`.
- all required dimensions `PASS`/`NOT_REQUIRED` and blocking unknowns empty → `READY`.

Readiness is stage-specific. Missing texture detail does not block Geometry if Geometry is otherwise resolvable.

## 10. Adaptive Progression

Do not force a fixed concept → turnaround → detail → material ceremony.

```text
simple prop
→ one approved source/reference may be enough

complex vehicle
→ concept only if identity unresolved
→ turnaround
→ structural detail/material only when decision-changing

animated creature
→ turnaround
→ rig/deformation when articulation is material
→ pose/keyframe only when motion needs it
```

Pause for user approval at a material authority-changing milestone. Auxiliary sheets that only elaborate an already-approved target do not automatically require separate approval unless strict per-stage review is explicitly requested.

## 11. Visual Gate

Review generated references in this order:
1. source/brief identity;
2. required part completeness;
3. topology/attachment/negative-space correctness;
4. cross-view proportion and depth consistency;
5. Blockbench buildability;
6. articulation/joint readability when relevant;
7. texture/material usability;
8. crop-safe presentation.

Fix the largest structural difference first. FRONT alone never closes a form whose depth changes silhouette, attachment, negative space or articulation.

## 12. Correction Budget

Use delta-first correction. State only the defect/change and what must remain unchanged.

```text
local defect
→ edit affected area

cross-view structural defect
→ edit all materially affected views together

global identity/layout/coherence failure
→ regenerate full board
```

For one unchanged material brief / automatic review cycle:

```text
first draft          = maximum 1
targeted correction  = maximum 1
automatic variants   = 0
```

A fresh user-directed correction starts a new user-led review cycle.

## 13. Structured Technical Handoff

Preferred package schema remains `lazydesigner-reference-package-v1`.

```json
{
  "schema": "lazydesigner-reference-package-v1",
  "asset": {
    "name": "...",
    "profile": "PROP_FURNITURE|VEHICLE|HUMANOID|CREATURE|MECHANICAL|PLANT_CUTOUT|GENERIC",
    "task": "NEW_ASSET|CONTINUE_ASSET|CORRECTION",
    "original_user_intent": "..."
  },
  "requirements": {
    "dimensions_blocks": {"width": null, "height": null, "length": null},
    "animation_required": null
  },
  "reference": {
    "status": "READY|NEEDS_REVIEW|BLOCKED",
    "readiness": {
      "identity": "PASS",
      "part_completeness": "PASS",
      "topology_attachment": "PASS",
      "depth": "NOT_REQUIRED",
      "articulation": "NOT_REQUIRED",
      "material": "NOT_REQUIRED"
    },
    "critical_views": [],
    "modules": [],
    "known_conflicts": []
  },
  "parts": [
    {
      "id": "example_part",
      "role": "GEOMETRY",
      "parent": null,
      "contact": null,
      "symmetry": "NONE",
      "motion": "STATIC",
      "evidence": "SUPPORTED"
    }
  ],
  "articulation": [],
  "materials": [],
  "animation_guidance": [],
  "constraints": [],
  "unknowns": {
    "blocking": [],
    "non_blocking": []
  }
}
```

Optional structured articulation entry:

```json
{
  "joint": "knee",
  "parent_part": "upper_leg",
  "child_part": "lower_leg",
  "motion": "HINGE_LIKE",
  "axis_intent": null,
  "pivot_region": "knee_center",
  "coverage": "maintain_overlap",
  "clearance": "avoid_visible_gap",
  "risk": "deep_bend_gap"
}
```

Optional structured material entry:

```json
{
  "id": "dark_wood",
  "applies_to": ["frame", "shelf"],
  "base_color": null,
  "surface": "matte",
  "emissive": false,
  "pbr_relevant": false
}
```

`null` means unknown and must never be converted into a guessed requirement.

Images remain visual authority. Metadata records technical facts, relationships, evidence and unknowns; it must not paraphrase away visual identity.

## 14. Control Handoff

Control receives the package but forwards only the subset needed for the current Codex decision.

```text
whole-model geometry
→ primary views + dimensions + profile + relevant parts + geometry/rig constraints

wheel correction
→ user delta + affected view(s) + relevant VEHICLE part relationships

texture correction
→ affected material entries + UV/material constraints

animation correction
→ relevant articulation + keyframe guidance + affected clip
```

Do not resend the full package every turn when unchanged content can be identified by task/context hash.

## 15. Completion

Reference Preparation is complete when:
- visual authority is approved or explicitly accepted as source-only evidence;
- one canonical profile is selected;
- only necessary modules are present;
- semantic parts cover material downstream decisions without becoming a Cube plan;
- blocking and non-blocking unknowns are separated;
- stage-specific readiness is explicit;
- technical handoff contains no guessed facts.

Then stop. Downstream work belongs to LazyDesigner Control → Codex.
