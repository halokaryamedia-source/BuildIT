# LazyDesigner Reference Package Schema

Updated: 2026-09-11

This document owns the canonical structure of `REFERENCE.json`, the machine-readable index handed from ChatGPT Reference Preparation to Codex.

It does not own visual-sheet design, stage prose, authoring procedure, or Control implementation.

Stage document owners:

```text
GEOMETRY.md  → geometry.md
TEXTURE.md   → texture.md
ANIMATION.md → animation.md
```

## Objective

`REFERENCE.json` answers only:

```text
what asset is being made
what stable requirements are confirmed
what scale authority exists
what visual authority exists
what stage documents exist
what decision-critical relationships are known
what remains unknown/blocking
which stages are ready
```

It is an index and structured fact contract, not a modelling blueprint.

## Authority Order

```text
1. explicit current user requirement
2. approved visual reference
3. confirmed numeric / player-relative scale requirement
4. REFERENCE.json structured facts
5. active stage Markdown projection
6. downstream interpretation
```

Material conflicts between stronger authorities must remain explicit and block only dependent decisions.

## Schema Identity

```text
file:   REFERENCE.json
schema: lazydesigner-reference-v1
```

## Canonical Shape

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

Omit empty optional arrays/objects when they add no downstream value.

## `asset` — required

```json
{
  "name": "farmer_npc",
  "profile": "HUMANOID",
  "task": "NEW_ASSET",
  "intent": "Farmer NPC harvesting cinnamon"
}
```

Required fields:

```text
name
profile
task
intent
```

`profile`:

```text
PROP_FURNITURE | VEHICLE | HUMANOID | CREATURE | MECHANICAL | PLANT_FOLIAGE | GENERIC
```

`task`:

```text
NEW_ASSET | CONTINUE_ASSET | CORRECTION
```

`intent` is one short normalized statement of the approved current goal. Never store conversation history or a generation prompt here.

## `requirements` — required

Contains only explicit or confirmed stable cross-stage requirements.

Recommended shape:

```json
{
  "dimensions_blocks": {
    "width": null,
    "height": null,
    "length": null
  },
  "player_relative_scale": "PLAYER_HEIGHT",
  "animation_required": true
}
```

### Numeric dimensions

`dimensions_blocks` stores confirmed numeric envelope values only.

Rules:
- `null` means unknown;
- never infer block values from image pixels;
- explicit user dimensions remain authoritative unless changed by the user;
- do not invent per-part dimensions.

### Player-relative scale

`player_relative_scale` is optional when exact dimensions or context already make scale unambiguous. When useful, use one of:

```text
HANDHELD
WEARABLE
BELOW_KNEE
KNEE_HEIGHT
WAIST_HEIGHT
CHEST_HEIGHT
PLAYER_HEIGHT
ABOVE_PLAYER_HEIGHT
RIDEABLE_1P
RIDEABLE_2P
STALL_SCALE
ROOM_SCALE
CUSTOM
```

This is a semantic world-scale anchor, not a numeric conversion table.

If both numeric dimensions and `player_relative_scale` exist:

```text
numeric dimensions = numeric authority
player_relative_scale = semantic interaction/world-scale anchor
```

They must not materially contradict. If they do, record the conflict as blocking instead of silently choosing one.

`animation_required` is `true` or `false` only when confirmed. If still unresolved and materially relevant, keep the uncertainty in `unknowns.blocking` rather than guessing.

Additional requirement fields are allowed only for stable cross-stage facts such as required occupancy, required identity-critical part count, or a user-supplied tool that must be preserved.

## `approval` — required for generated packages

```json
{
  "brief": "APPROVED",
  "visual_authority": "APPROVED",
  "package_generation": "APPROVED"
}
```

Allowed values:

```text
APPROVED | NOT_REQUIRED | PENDING
```

Never infer approval from silence.

## `documents` — optional

List only files that actually exist:

```json
{
  "geometry": "GEOMETRY.md",
  "texture": "TEXTURE.md",
  "animation": "ANIMATION.md"
}
```

Do not create entries for omitted/not-required documents. Stage Markdown is a projection of the same authority, not a competing source of truth.

## `images` — required when visual evidence is packaged

```json
{
  "id": "IMG_GEO_01",
  "file": "images/01-main-reference.png",
  "role": "PRIMARY_GEOMETRY",
  "used_by": ["GEOMETRY"],
  "status": "APPROVED"
}
```

Recommended fields:

```text
id
file
role
used_by
status
```

`role`:

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

`used_by` uses semantic stages rather than filenames:

```text
GEOMETRY | TEXTURE | ANIMATION
```

This keeps image relevance stable even when an optional stage Markdown file is omitted.

`status`:

```text
APPROVED | SOURCE_ONLY | SUPPORTING
```

Do not duplicate visible image description inside the image object.

## `parts` — optional

Include only decision-critical semantic parts.

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

Vocabulary:

```text
role:     GEOMETRY | TEXTURE | ANIMATION_ONLY | EFFECT | OMIT | UNRESOLVED
symmetry: NONE | MIRRORED | PAIRED | REPEATED | ASYMMETRIC | UNKNOWN
motion:   STATIC | RIGID | ARTICULATED | FLEXIBLE | UNKNOWN
evidence: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

No Cube inventory, exact coordinates, or invented hidden anatomy/mechanisms.

## `articulation` — optional

Use only when Geometry/Animation decisions depend on it.

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

This records relationship and intent, never final pivot coordinates.

## `materials` — optional

Use only for decision-critical supported material facts.

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

Do not guess hidden surfaces or encode pixel-paint instructions.

## `animation_guidance` — optional

Include only when motion guidance materially improves authoring.

```json
{
  "name": "harvest_cinnamon",
  "type": "ONE_SHOT",
  "purpose": "harvest cinnamon with the held tool",
  "participants": ["torso", "right_upper_arm", "right_lower_arm", "tool"],
  "key_poses": ["ready", "anticipation", "contact", "follow_through", "recovery"],
  "contact_events": ["tool_to_target"],
  "reference_images": ["IMG_ANIM_01"]
}
```

Do not turn this into frame-by-frame implementation unless explicitly required.

## `constraints` — optional

Short list of stable correctness constraints that do not fit more cleanly elsewhere.

Examples:

```text
supplied tool replaces a generic pickaxe
preserve backpack silhouette
do not expose large hip/knee gaps during intended motion
```

Do not store generic tutorial advice or repeat whole stage sections.

## `unknowns` — required

```json
{
  "blocking": [],
  "non_blocking": ["exact underside color of basket"]
}
```

`blocking` means the missing/conflicting fact can materially change the next required decision.

`non_blocking` remains visible but does not stop unrelated work.

Do not guess unknowns away to make the package appear complete.

## `readiness` — required

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
READY | NOT_REQUIRED | NEEDS_REVIEW | BLOCKED
```

Rules:
- readiness is stage-specific;
- a relevant blocking unknown makes that stage `BLOCKED`;
- missing Texture detail does not block Geometry unless it changes Geometry;
- static assets use `animation: NOT_REQUIRED`.

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
      "height": null,
      "length": null
    },
    "player_relative_scale": "PLAYER_HEIGHT",
    "animation_required": true
  },
  "approval": {
    "brief": "APPROVED",
    "visual_authority": "APPROVED",
    "package_generation": "APPROVED"
  },
  "documents": {
    "geometry": "GEOMETRY.md",
    "animation": "ANIMATION.md"
  },
  "images": [
    {
      "id": "IMG_GEO_01",
      "file": "images/01-main-reference.png",
      "role": "PRIMARY_GEOMETRY",
      "used_by": ["GEOMETRY"],
      "status": "APPROVED"
    },
    {
      "id": "IMG_ANIM_01",
      "file": "images/02-motion-reference.png",
      "role": "ANIMATION_KEYFRAME",
      "used_by": ["ANIMATION"],
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
  "constraints": ["supplied tool replaces a generic pickaxe"],
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

## Package Economy

Never include:

```text
conversation transcript
compiled-prompt history
full Skills
Tool schemas
Cube-by-Cube plans
exact implementation coordinates
generic tutorials
repeated prose already owned by stage documents
```

## Correction Rule

A bounded user correction updates only affected facts, image references, readiness, and stage documents.

```text
hat: straw_hat → beanie
```

may affect Geometry silhouette and Texture material, but should not rebuild unrelated Animation guidance.

Preserve unaffected accepted authority.

## Completion

`REFERENCE.json` is ready when:

```text
blocking requirements for the intended next stage are resolved
required approvals are explicit
numeric and player-relative scale facts do not conflict
all listed documents/images exist
image stage relevance is unambiguous
unknowns remain explicit
no field contains unsupported invented facts
stage readiness is accurate
```
