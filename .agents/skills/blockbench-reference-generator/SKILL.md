---
name: blockbench-reference-generator
description: LazyDesigner reference-preparation specialist for ChatGPT. Produce the minimum sufficient visual reference plus decision-critical technical handoff for downstream Codex authoring.
---

# LazyDesigner Reference Preparation

This Skill is the single ChatGPT-side reference-preparation authority for LazyDesigner asset authoring. It replaces the old image-only mental model with one modular system:

```text
CORE RULES
+ ASSET PROFILE
+ ONLY NECESSARY REFERENCE MODULES
→ APPROVED VISUAL REFERENCE(S)
+ COMPACT TECHNICAL HANDOFF
→ LazyDesigner Control
→ Codex
```

Do not split Character, Creature, Vehicle, Prop, or Material into independent reference workflows with duplicated rules. Select a profile and modules inside this one system.

## 1. Boundary

ChatGPT owns reference preparation. Codex owns modelling/coding. LazyDesigner Control owns intake, context projection, readiness and routing. Runtime/Blockbench own execution/live asset state.

Do not create Blockbench models here.
Do not prescribe Cube coordinates/counts as facts.
Do not invent hidden structure, dimensions, materials, articulation or motion.
Do not duplicate modelling Skills or Runtime ToolSpecs into the handoff.

## 2. Input Authority

Accept:
- text prompt;
- one or more user images;
- text + images;
- an already-approved visual reference.

Resolve in this order:

```text
explicit user fact
→ visible source evidence
→ already-approved target decision
→ optional unknown remains UNKNOWN
```

Never infer numeric scale from pixels. Never average materially conflicting views into invented structure. Ask only for decision-changing missing information. One concise clarification round is preferred when required; otherwise preserve uncertainty explicitly.

## 3. Output Principle

The objective is not maximum documentation. The objective is the minimum package that lets Codex work without repeating avoidable interpretation.

```text
SIMPLE ASSET  → simple package
COMPLEX ASSET → richer package
SMALL REVISION → delta-only package
```

Visual information belongs in images. Nonvisual technical facts belong in compact metadata. Markdown explanation is optional and only used when JSON-sized notes cannot express the relevant technical relationship clearly.

## 4. Core Visual Rules

Every generated reference must prioritize:
- complete uncropped subject;
- readable silhouette;
- consistent proportions;
- neutral/plain background;
- primary masses and required visible part count;
- attachment/contact relationships;
- intentional openings / negative spaces;
- source-supported asymmetry/orientation;
- Minecraft/Blockbench-buildable form;
- material regions and identity-critical markings;
- motion-bearing parts when relevant.

Prefer the simplest native Blockbench / Minecraft Bedrock representation that preserves the visible requirement. Useful representations include solid cuboids, segmented forms, plane-like geometry, planar cutout carriers and layered surfaces. Do not describe the target as a generic cube/mesh hybrid.

Texture supports geometry; it must not replace required silhouette, volume, openings or attachment structure.

## 5. Asset Profile Resolver

Choose exactly one primary profile unless the user explicitly requests a hybrid asset whose modelling decisions genuinely span profiles.

### PROP_FURNITURE
Use for static or mostly rigid props, furniture, kiosks, racks, tables, containers and interactive objects.
Focus on:
- main body/masses;
- supports/legs;
- shelves, drawers, doors, panels, handles and hinges;
- openings/negative space;
- stable contact with the ground;
- movable sections when present;
- material breakdown.

Optional subtype vocabulary:
`STATIC_PROP | FURNITURE | CONTAINER | INTERACTIVE_PROP | MECHANICAL_PROP`.

### VEHICLE
Use for cars, bikes, carts, trains, aircraft, boats and other vehicles.
Focus on:
- chassis/body mass;
- wheel/track/landing/ground-contact cohort;
- wheelbase/track spacing and ground clearance;
- front/rear identity;
- cockpit/cabin;
- doors, bumpers, lights and exposed mechanisms;
- repeated/symmetric assemblies;
- steering, axle, rotor, propeller and articulated parts;
- motion ownership and pivot-axis visibility.

### HUMANOID
Use for human-like characters and NPCs.
Focus on:
- head, torso, pelvis;
- upper/lower limbs;
- hands/feet;
- shoulder/hip/neck overlap;
- clothing and accessory layers;
- face/identity regions;
- natural joint neighborhoods and rig clearance;
- pose readability without exaggerated joint gaps.

### CREATURE
Use for non-humanoid animals, monsters and fantasy creatures.
Focus on:
- body axis/spine intent;
- head/neck/jaw;
- limb topology and ground contact;
- paws/hooves/claws where identity-critical;
- tail chain;
- wing structure;
- ears/horns/appendages;
- articulation and overlap at joints;
- deformation risk for flexible parts.

### MECHANICAL
Use for machinery where mechanism/kinematics matter more than vehicle identity.
Focus on:
- rigid assemblies;
- linkage hierarchy;
- hinge/rotation/translation axes;
- contact and clearance;
- repeated components;
- service panels, handles and exposed mechanisms.

### PLANT_CUTOUT
Use for foliage, grass, flowers, crops and other thin/alpha-dominant assets.
Focus on:
- alpha-owned silhouette;
- one-plane or crossed-plane carrier suitability;
- stem/root/contact relationships;
- material/texture readability;
- avoid unnecessary micro-cubes.

### GENERIC
Use only when no more specific profile materially improves downstream decisions.

Profiles provide decision vocabulary, not a preset model recipe. Reference evidence remains authoritative.

## 6. Reference Modules

Load only modules that change a downstream modelling decision.

### TURNAROUND
Use when stronger multi-view construction evidence is needed.
Canonical normalized board:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP | FRONT-LEFT 3/4
```

LEFT/FRONT/BACK/TOP are construction evidence. FRONT-LEFT 3/4 is supplemental volume/readability evidence. Do not use generic SIDE when a canonical orientation is needed.

### STRUCTURAL_DETAIL
Use for local assemblies too small/occluded/complex to resolve from the main board: hinge, wheel hub, cockpit, drawer, linkage, handle, attachment base, jaw, wing root, etc.

### MATERIAL_TEXTURE
Use for material identity, surface breakdown, palette, close-up texture, wear/damage, emissive or PBR-relevant regions.
Prefer neutral lighting and clearly separated material regions.

### RIG_DEFORMATION
Use when the asset will animate or articulation quality is material.
Clarify visually:
- attachment center;
- neighboring-volume overlap;
- bend/rotation direction;
- expected clearance;
- joint area that must remain covered during motion;
- likely rigid vs flexible regions.

Avoid exaggerated gaps at hips, knees, shoulders, elbows, neck, jaw, waist or equivalent creature/mechanical joints merely to show separation.

### POSE_ACTION
Use when static neutral turnaround is insufficient to understand silhouette or articulation in a meaningful pose/action.

### EXPRESSION_FACE
Use only when facial expression/face-region fidelity materially affects modelling or texture work.

### ANIMATION_KEYFRAME
Use when a motion reference will materially improve downstream animation.
Show or record only decision-critical poses/timing relationships: key poses, contact points, motion direction, extremes, recovery/loop intent and relevant viewing angles.

## 7. Adaptive Progression

Do not force a fixed concept → turnaround → detail → material ceremony.

Choose the smallest sufficient sequence:

```text
simple prop
→ one approved reference / compact turnaround

complex vehicle
→ concept if identity unresolved
→ turnaround
→ structural detail when needed
→ material module when needed

animated creature
→ concept if needed
→ turnaround
→ rig/deformation
→ pose/keyframe only when motion requires it
→ material only when it changes downstream work
```

Pause for user approval at a material authority-changing milestone. Do not require approval after every auxiliary sheet unless the user explicitly requests strict per-stage review.

## 8. Evidence Completeness

Before handoff, account for material construction evidence:

```text
required visible part count
primary mass relationships
attachment/contact direction
negative spaces/openings
depth-bearing views
asymmetry/orientation
identity-critical geometry landmarks
motion-bearing parts
material identity when relevant
```

A part hidden in one view may be visible in another; it may not silently disappear from the whole reference set. Duplicated, merged, floating, relocated or topology-changing substitutions are material failures.

FRONT alone never closes a form whose depth changes silhouette, attachment, negative space or articulation.

Evidence state vocabulary:
`SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE`.

Material `CONFLICTING` or `UNAVAILABLE` information must stay explicit; do not manufacture certainty.

## 9. Visual Gate

Review generated visual references in this order:
1. source/brief identity;
2. required part-count completeness;
3. topology / attachment / negative-space correctness;
4. cross-view proportion and depth consistency;
5. Blockbench buildability;
6. articulation / joint readability when relevant;
7. texture/material usability;
8. crop-safe presentation.

Fix the largest structural difference first.

## 10. Correction Budget

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

## 11. Technical Handoff

After visual approval, preserve only decision-critical nonvisual facts instead of discarding them and forcing Codex to infer them again.

Preferred compact metadata shape:

```json
{
  "schema": "lazydesigner-reference-package-v1",
  "asset": {
    "name": "...",
    "profile": "PROP_FURNITURE|VEHICLE|HUMANOID|CREATURE|MECHANICAL|PLANT_CUTOUT|GENERIC",
    "original_user_intent": "..."
  },
  "requirements": {
    "dimensions_blocks": {"width": null, "height": null, "length": null},
    "animation_required": null
  },
  "reference": {
    "status": "READY|NEEDS_REVIEW",
    "critical_views": [],
    "modules": [],
    "known_conflicts": []
  },
  "technical": {
    "primary_parts": [],
    "representation_notes": [],
    "hierarchy_notes": [],
    "pivot_rig_notes": [],
    "material_notes": [],
    "animation_notes": []
  },
  "constraints": [],
  "unknowns": []
}
```

`null` means unknown and must not be converted into a guessed requirement.

Images remain visual authority. Metadata records technical decisions/unknowns; it must not paraphrase away visual identity.

## 12. Control Handoff

Reference Preparation hands the package to LazyDesigner Control. Control forwards only the subset needed for the current Codex decision.

Example:

```text
whole-model geometry
→ primary reference views + dimensions + profile + geometry/rig constraints

wheel correction
→ user delta + affected view(s) + relevant vehicle relationship

texture correction
→ affected material reference + UV/material constraints

animation correction
→ affected rig state + keyframe/motion guidance
```

Do not resend the complete package every turn when unchanged content can be identified by task/context hash.

## 13. Completion

Reference Preparation is complete when:
- visual authority is approved or explicitly accepted as source-only evidence;
- material ambiguities are resolved or explicitly preserved as unknown/conflicting;
- selected profile/modules cover the next modelling decision;
- technical handoff contains no guessed facts;
- no unnecessary sheet/module remains in the path.

Then stop. Downstream authoring belongs to LazyDesigner Control → Codex.
