# LazyDesigner Reference Package Schema

Updated: 2026-09-11

This document owns the canonical structure of `REFERENCE.json`, the machine-readable reference index handed from ChatGPT Reference Preparation to Codex.

It does not own visual-reference design, stage-document prose, Geometry/Texturing/Animation authoring rules, or Control implementation.

Canonical stage-document content is owned separately by:

```text
docs/knowledge/geometry-reference-contract.md
docs/knowledge/texture-reference-contract.md
```

## Objective

`REFERENCE.json` must answer, with minimal duplication:

```text
what asset is being made
what the user explicitly requires
what visual authority exists
what stage documents exist
what information is confirmed vs unknown
what remains blocking
```

It is a compact index and structured fact contract, not a giant modelling blueprint.

## Authority Order

```text
1. explicit current user requirement
2. approved visual reference
3. REFERENCE.json structured facts
4. stage-specific Markdown projection
5. downstream Codex interpretation
```

If two higher-order authorities materially conflict, record the conflict and stop the affected dependent decision. Do not silently normalize the conflict.

## Canonical File Name

```text
REFERENCE.json
```

Schema identifier:

```text
lazydesigner-reference-v1
```

## Top-Level Shape

```json
{
  "schema": "lazydesigner-reference-v1",
  "asset": {},
  "requirements": {},
  "approval": {},
  "documents": {},
  "images": [],
  "parts": [],
  "articulation": [],
  "materials": [],
  "animation_guidance": [],
  "constraints": [],
  "unknowns": {},
  "readiness": {}
}
```

Only include fields that materially help downstream work. Empty optional arrays may be omitted when they add no value.

## 1. `schema`

Required string.

```json
"schema": "lazydesigner-reference-v1"
```

Purpose: allow downstream consumers to distinguish package versions without guessing field meaning.

## 2. `asset`

Required object.

```json
{
  "name": "farmer_npc",
  "profile": "HUMANOID",
  "task": "NEW_ASSET",
  "intent": "Farmer NPC harvesting cinnamon"
}
```

### Required fields

```text
name
profile
task
intent
```

### `profile`

One of:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

Profile is classification, not visual authority and not a preset.

### `task`

One of:

```text
NEW_ASSET
CONTINUE_ASSET
CORRECTION
```

### `intent`

Short normalized statement of the current approved user goal.

Do not paste conversation history or a giant compiled prompt here.

## 3. `requirements`

Required object containing only explicit or confirmed requirements.

Recommended shape:

```json
{
  "dimensions_blocks": {
    "width": null,
    "height": 2,
    "length": null
  },
  "animation_required": true
}
```

Rules:
- `null` means unknown, never permission to infer;
- do not derive numeric dimensions from image pixels;
- omit dimensions that are genuinely irrelevant only when downstream scale is already owned elsewhere;
- preserve explicit user dimensions exactly unless the user changes them.

Additional requirement fields may be added only when they are stable cross-stage facts, such as a required held tool or required count of identity-critical parts.

Do not put stage implementation instructions here.

## 4. `approval`

Required object describing whether the target used for package generation was explicitly confirmed.

Recommended shape:

```json
{
  "brief": "APPROVED",
  "visual_authority": "APPROVED",
  "package_generation": "APPROVED"
}
```

Allowed values:

```text
APPROVED
NOT_REQUIRED
PENDING
```

Rules:
- never infer approval from silence;
- `brief` refers to the concise pre-generation confirmation;
- `visual_authority` refers to required reference visuals being accepted when visual approval is material;
- `package_generation` records the final permission to create the handoff files.

## 5. `documents`

Optional object mapping stage documents that actually exist.

```json
{
  "geometry": "GEOMETRY.md",
  "texture": "TEXTURE.md",
  "animation": "ANIMATION.md"
}
```

Rules:
- do not create entries for missing/not-required documents;
- file path is relative to the package root;
- these documents are projections derived from the same authority, not independent truth sources;
- `GEOMETRY.md` content must conform to `docs/knowledge/geometry-reference-contract.md`;
- `TEXTURE.md` content must conform to `docs/knowledge/texture-reference-contract.md`;
- `ANIMATION.md` content must conform to its own canonical contract once defined.

## 6. `images`

Required when visual reference exists.

Each image gets a stable semantic ID.

```json
{
  "id": "IMG_GEO_01",
  "file": "images/turnaround.png",
  "role": "PRIMARY_GEOMETRY",
  "used_by": ["GEOMETRY.md"],
  "status": "APPROVED"
}
```

### Recommended fields

```text
id
file
role
used_by
status
```

### Image role vocabulary

Use only when applicable:

```text
CONCEPT
PRIMARY_GEOMETRY
STRUCTURAL_DETAIL
MATERIAL_TEXTURE
RIG_DEFORMATION
POSE_ACTION
EXPRESSION_FACE
ANIMATION_KEYFRAME
SOURCE_REFERENCE
```

### Image status

```text
APPROVED
SOURCE_ONLY
SUPPORTING
```

Do not use the image object to duplicate visual description already visible in the image. Record only the image's purpose and authority relationship.

## 7. `parts`

Optional structured list of decision-critical semantic parts.

Example:

```json
{
  "id": "right_hand",
  "role": "GEOMETRY",
  "parent": "right_lower_arm",
  "contact": null,
  "symmetry": "PAIRED",
  "motion": "ARTICULATED",
  "evidence": "SUPPORTED"
}
```

Recommended vocabulary:

```text
role:
GEOMETRY | TEXTURE | ANIMATION_ONLY | EFFECT | OMIT | UNRESOLVED

symmetry:
NONE | MIRRORED | PAIRED | REPEATED | ASYMMETRIC | UNKNOWN

motion:
STATIC | RIGID | ARTICULATED | FLEXIBLE | UNKNOWN

evidence:
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Rules:
- only decision-critical semantic parts belong here;
- no per-Cube inventory;
- no exact Blockbench coordinates;
- do not invent hidden anatomy/mechanisms.

## 8. `articulation`

Optional. Include only when Geometry or Animation decisions materially depend on articulation.

Example:

```json
{
  "joint": "knee",
  "parent_part": "right_upper_leg",
  "child_part": "right_lower_leg",
  "motion": "HINGE_LIKE",
  "axis_intent": null,
  "pivot_region": "knee_center",
  "coverage": "maintain_overlap",
  "clearance": "avoid_visible_gap",
  "risk": "deep_bend_gap"
}
```

This records relationship and intent, not final rig coordinates.

## 9. `materials`

Optional. Include only decision-critical material facts.

Example:

```json
{
  "id": "straw_hat",
  "applies_to": ["hat"],
  "base_color": "warm straw",
  "surface": "woven/matte",
  "emissive": false,
  "pbr_relevant": false,
  "evidence": "SUPPORTED"
}
```

Rules:
- use descriptive color/material facts only when explicit or visually supported;
- do not guess hidden-surface material;
- do not encode pixel-paint implementation here.

## 10. `animation_guidance`

Optional and only present when motion reference is materially useful.

Recommended entry:

```json
{
  "name": "harvest_cinnamon",
  "type": "ONE_SHOT",
  "purpose": "harvest cinnamon with the held tool",
  "participants": ["torso", "right_upper_arm", "right_lower_arm", "tool"],
  "key_poses": ["ready", "anticipation", "swing", "contact", "follow_through", "recovery"],
  "contact_events": ["tool_to_target"],
  "reference_images": ["IMG_ANIM_01"]
}
```

Do not turn this into frame-by-frame implementation unless the user specifically requires that precision.

## 11. `constraints`

Optional array for stable constraints that do not belong cleanly elsewhere.

Examples:

```json
[
  "supplied tool replaces a generic pickaxe",
  "preserve backpack silhouette",
  "do not expose large hip or knee gaps during intended motion"
]
```

Rules:
- only include constraints that affect accepted-result correctness;
- avoid generic tutorial advice;
- avoid duplicating entire sections from stage Markdown files.

## 12. `unknowns`

Required object.

```json
{
  "blocking": [],
  "non_blocking": [
    "exact underside color of basket"
  ]
}
```

### `blocking`

A missing/conflicting fact that can change the next required decision materially.

Examples:

```text
unknown vehicle type
unknown limb count
conflicting front/back attachment
unknown animation requirement when rig design depends on it
```

### `non_blocking`

An unresolved fact that does not stop the current legal stage.

Do not convert unknowns into guessed values merely to make the package look complete.

## 13. `readiness`

Required object.

Recommended shape:

```json
{
  "overall": "READY",
  "geometry": "READY",
  "texture": "READY",
  "animation": "READY"
}
```

Allowed values:

```text
READY
NOT_REQUIRED
NEEDS_REVIEW
BLOCKED
```

Rules:
- readiness is stage-specific;
- missing texture detail does not block Geometry when Geometry is otherwise resolvable;
- Animation may be `NOT_REQUIRED`;
- any stage with a relevant blocking unknown is `BLOCKED`.

## Compact Example

```json
{
  "schema": "lazydesigner-reference-v1",
  "asset": {
    "name": "farmer_npc",
    "profile": "HUMANOID",
    "task": "NEW_ASSET",
    "intent": "Farmer NPC harvesting cinnamon"
  },
  "requirements": {
    "dimensions_blocks": {
      "width": null,
      "height": 2,
      "length": null
    },
    "animation_required": true
  },
  "approval": {
    "brief": "APPROVED",
    "visual_authority": "APPROVED",
    "package_generation": "APPROVED"
  },
  "documents": {
    "geometry": "GEOMETRY.md",
    "texture": "TEXTURE.md",
    "animation": "ANIMATION.md"
  },
  "images": [
    {
      "id": "IMG_GEO_01",
      "file": "images/turnaround.png",
      "role": "PRIMARY_GEOMETRY",
      "used_by": ["GEOMETRY.md"],
      "status": "APPROVED"
    },
    {
      "id": "IMG_ANIM_01",
      "file": "images/keyframe-guide.png",
      "role": "ANIMATION_KEYFRAME",
      "used_by": ["ANIMATION.md"],
      "status": "APPROVED"
    }
  ],
  "parts": [
    {
      "id": "tool",
      "role": "GEOMETRY",
      "parent": "right_hand",
      "contact": "right_hand",
      "symmetry": "NONE",
      "motion": "RIGID",
      "evidence": "SUPPORTED"
    }
  ],
  "constraints": [
    "supplied tool replaces a generic pickaxe"
  ],
  "unknowns": {
    "blocking": [],
    "non_blocking": []
  },
  "readiness": {
    "overall": "READY",
    "geometry": "READY",
    "texture": "READY",
    "animation": "READY"
  }
}
```

## Package Economy Rules

`REFERENCE.json` must stay compact.

Do not include:

```text
conversation transcript
compiled-prompt history
full Skill instructions
Tool schemas
Cube-by-Cube plan
exact implementation coordinates
generic Minecraft/Blockbench tutorials
repeated prose already owned by stage documents
```

## Change / Correction Rule

For a user correction, update only affected facts and relationships.

Example:

```text
hat: straw_hat → beanie
```

Expected effect:

```text
REFERENCE.json affected part/material/image refs update
GEOMETRY.md only if silhouette/attachment changes
TEXTURE.md if material/color changes
ANIMATION.md only if motion/clearance changes
unaffected accepted information remains valid
```

Do not regenerate a full package merely because one bounded fact changed.

## Completion Condition

`REFERENCE.json` is ready for handoff when:
- all blocking requirements for the intended next stage are resolved;
- required user approvals are explicit;
- every listed document/image actually exists;
- image roles and stage use are unambiguous;
- unknowns remain explicit;
- no field contains unsupported invented facts;
- stage readiness is accurate.
