# LazyDesigner Reference → Codex Handoff

Updated: 2026-09-11

This file owns the **reference-preparation handoff contract** between ChatGPT and Codex. The operational reference Skill is `.agents/skills/blockbench-reference-generator/SKILL.md`. The canonical product flow remains in `docs/knowledge/flow.md`.

## Purpose

ChatGPT prepares enough visual and technical reference information for Codex to work without repeating avoidable interpretation.

```text
MAKE AMBIGUITY EXPLICIT BEFORE CODEX PAYS TO RESOLVE IT
```

Reference Preparation is one modular system, not separate Character/Creature/Vehicle/Material directors.

## Canonical Front-Door Flow

```text
USER REQUEST
→ CHATGPT REFERENCE PREPARATION
   ├─ CORE RULES
   ├─ ONE PRIMARY ASSET PROFILE
   └─ ONLY NECESSARY REFERENCE MODULES
→ REFERENCE PACKAGE
→ LAZYDESIGNER CONTROL
→ CODEX
→ GATEWAY
→ RUNTIME
→ BLOCKBENCH
→ RESULT
→ CONTROL DELTA
→ VERIFY / REVIEW / CONTINUE
```

Every Codex asset-authoring request enters through LazyDesigner Control. Control must preserve the original user intent and must not replace Codex creative/technical reasoning.

## Asset Profiles

Reference Preparation chooses one primary profile:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_CUTOUT
GENERIC
```

A profile adds only domain-specific decision vocabulary. It is not a preset model recipe and does not dictate Cube counts, coordinates or topology unsupported by evidence.

## Optional Reference Modules

Load only modules that materially improve the next modelling decision:

```text
TURNAROUND
STRUCTURAL_DETAIL
MATERIAL_TEXTURE
RIG_DEFORMATION
POSE_ACTION
EXPRESSION_FACE
ANIMATION_KEYFRAME
```

Do not force every asset through every module.

Examples:

```text
simple static prop
→ PROP_FURNITURE + TURNAROUND (only if needed)

complex vehicle
→ VEHICLE + TURNAROUND + STRUCTURAL_DETAIL + MATERIAL_TEXTURE when useful

animated creature
→ CREATURE + TURNAROUND + RIG_DEFORMATION + ANIMATION_KEYFRAME when useful
```

## ChatGPT Responsibilities

ChatGPT should preserve and package only decision-critical information:

```text
asset identity
original user intent
approved visual reference(s)
requested dimensions / scale authority
animation required: yes/no/unknown
important silhouette / primary masses
required visible part count
negative spaces / openings
attachment and contact relationships
symmetry / asymmetry
material identity when relevant
moving parts / articulation expectations when relevant
known constraints / exclusions
unknowns/conflicts that must not be guessed
```

Conditional guidance may include:

```text
representation notes
hierarchy suggestions
pivot / rigging guidance
joint-clearance / deformation guidance
material / PBR notes
animation/keyframe guidance
critical viewing angles
```

ChatGPT must not invent unavailable dimensions, hidden geometry, articulation, materials or motion as facts.

## Visual vs Technical Information

Keep the two surfaces distinct:

```text
IMAGE
= visual authority

METADATA
= technical facts, constraints, relationships and unknowns
```

Do not overload the image with labels, dimensions, pivots, JSON-like notes or implementation instructions when those belong in metadata.

## Reference Package Shape

Preferred package:

```text
1. approved visual evidence
2. compact JSON metadata
3. optional Markdown only when a relationship cannot be expressed clearly in compact fields
```

Recommended JSON:

```json
{
  "schema": "lazydesigner-reference-package-v1",
  "asset": {
    "name": "example_asset",
    "profile": "PROP_FURNITURE",
    "task": "NEW_ASSET",
    "original_user_intent": "..."
  },
  "requirements": {
    "dimensions_blocks": {
      "width": null,
      "height": null,
      "length": null
    },
    "animation_required": null
  },
  "reference": {
    "status": "READY",
    "images": [],
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

`null` means unknown and must never be silently converted into an inferred requirement.

## Canonical View Naming

When normalized turnaround coverage is needed, use:

```text
LEFT
FRONT
BACK
TOP
FRONT-LEFT 3/4
```

Do not use generic `SIDE` when orientation matters.

A direct source image can still be the Approved Reference if it already resolves the next material decision; turnaround generation is not mandatory.

## Adaptive Review

Do not force concept → turnaround → detail → material approval for every asset.

Pause for approval when an output materially changes visual authority or identity. Auxiliary sheets that only elaborate an already-approved target do not automatically require a separate approval unless the user explicitly requests strict stage-by-stage review.

## What Control Receives

Control receives the package and resolves only:

```text
task class
asset identity/profile
current project/workspace
current stage/domain
requirement readiness
reference readiness
canonical context handles
semantic owner
legal capability route
dependency blockers
```

Control must preserve `original_user_intent` unchanged.

Control does not resend the entire package on every turn. Unchanged reference/context should be referenced by stable content/task identity where possible.

## What Codex Receives

Codex receives only what is relevant to the current decision:

```text
original user intent
current modelling target
relevant approved image(s)
selected asset profile
relevant reference modules/technical constraints
current stage/gates
required semantic Skill context
known capability route when available
explicit unknowns/blockers
```

Codex remains responsible for 3D interpretation, modelling strategy, Group/Cube decomposition, visual comparison, correction reasoning, texture design, rig/animation construction and source implementation for system-development tasks.

## Minimum-Context Examples

```text
whole-model initial geometry
→ primary views + dimensions + profile + geometry/rig constraints

wheel correction
→ user delta + affected view(s) + relevant VEHICLE relationships

texture correction
→ affected material reference + current UV/material constraints

animation correction
→ relevant rig state + ANIMATION_KEYFRAME guidance + affected clip
```

The objective is **Cost to Accepted Result**, not merely the smallest packet.

## Existing Asset / Update

For an existing model:

```text
USER CHANGE REQUEST
→ ChatGPT adds new reference/technical clarification only when needed
→ Control recovers current asset/workspace state
→ preserve existing accepted information
→ classify affected owner/dependencies
→ deliver minimum changed intent/reference context to Codex
→ Codex edits
→ Control invalidates only affected evidence/gates
```

Do not regenerate a complete reference package for every correction.

## System Development Boundary

System-development work does not require an asset reference package by default.

```text
USER MCP / PLUGIN / BUILD REQUEST
→ optional ChatGPT research/reference preparation
→ Control: SYSTEM_DEVELOPMENT
→ source owner + affected layers + minimum context
→ Codex implementation
```

## Non-Goals

The Reference Package must not become:
- a giant duplicate design document;
- a replacement for the actual images;
- a copy of every Skill or Tool schema;
- a hidden source of guessed requirements;
- a mandatory turnaround/detail/material set for trivial assets;
- a second asset-state database;
- a Cube-by-Cube modelling blueprint.

The package exists only to make the next Codex decision better, faster and less ambiguous.
