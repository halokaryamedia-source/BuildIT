# LazyDesigner Reference → Codex Handoff

Updated: 2026-09-11

This file owns the reference-preparation handoff contract between ChatGPT and Codex. Operational reference behavior is owned by `.agents/skills/blockbench-reference-generator/SKILL.md`. Durable reference policy is owned by `docs/foundation/04-reference-guide.md`. Product flow remains in `docs/knowledge/flow.md`.

## Purpose

ChatGPT prepares enough visual and structured technical reference information for Codex to work without repeating avoidable interpretation.

```text
MAKE AMBIGUITY EXPLICIT BEFORE CODEX PAYS TO RESOLVE IT
```

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

Every Codex asset-authoring request enters through LazyDesigner Control. Control preserves original user intent and projects only the context required for the current decision.

## Canonical Asset Profiles

Profile names describe asset classes, not modelling techniques:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

`PLANT_FOLIAGE` covers vegetation and foliage assets. Plane/cutout terminology belongs to representation choices inside that profile and is not exposed as the profile name.

`GENERIC` is fallback only. Profiles provide decision vocabulary, not geometry presets.

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

Do not force all modules on every asset.

## Visual vs Technical Authority

```text
IMAGE
= visual authority

METADATA
= technical facts, relationships, evidence, constraints and unknowns
```

Metadata must never override explicit user requirements or stronger visual/source authority.

## Semantic Part Identity

Decision-critical parts receive stable semantic IDs when useful. These IDs allow ChatGPT, Control, Codex, correction logic and animation guidance to refer to the same part without defining Cube coordinates.

Recommended part fields:

```text
id
role: GEOMETRY | TEXTURE | ANIMATION_ONLY | EFFECT | OMIT | UNRESOLVED
parent
contact
symmetry
motion
evidence
```

Only material parts need entries. Do not build a per-Cube inventory.

## Unknown Classification

Unknowns are split into:

```text
blocking
non_blocking
```

A blocking unknown can change the next stage's part count, topology, primary silhouette/depth, articulation, required attachment/contact, numeric requirement or identity-critical material decision.

A non-blocking unknown does not change the next legal decision.

Neither class may be silently guessed.

## Reference Readiness

Overall status:

```text
READY
NEEDS_REVIEW
BLOCKED
```

Stage-relevant readiness dimensions:

```text
identity
part_completeness
topology_attachment
depth
articulation
material
```

Each dimension is:

```text
PASS
NOT_REQUIRED
NEEDS_REVIEW
BLOCKED
```

Rules:
- required `BLOCKED` dimension → overall `BLOCKED`;
- unresolved material user choice without a hard blocker → `NEEDS_REVIEW`;
- all required dimensions `PASS`/`NOT_REQUIRED` and blocking unknowns empty → `READY`.

Readiness is stage-specific. Missing material detail should not block Geometry if Geometry is otherwise fully resolvable.

## Canonical Reference Package v1

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
    "readiness": {
      "identity": "PASS",
      "part_completeness": "PASS",
      "topology_attachment": "PASS",
      "depth": "NOT_REQUIRED",
      "articulation": "NOT_REQUIRED",
      "material": "NOT_REQUIRED"
    },
    "images": [],
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

`asset.profile` uses one of `PROP_FURNITURE | VEHICLE | HUMANOID | CREATURE | MECHANICAL | PLANT_FOLIAGE | GENERIC`.

`null` means unknown and is never permission to infer.

## Structured Articulation

When articulation materially affects modelling/animation, entries may use:

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

This describes intent/relationship, not final Blockbench coordinates.

## Structured Materials

When material identity matters, entries may use:

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

Only include fields supported by user intent or visible evidence.

## Animation Guidance

When `ANIMATION_KEYFRAME` is selected, guidance should cover only decision-critical motion information:

```text
animation_name
purpose
loop | one_shot
key poses
relative timing
contact events
motion direction
extremes
recovery / loop intent
relevant reference angles
```

Do not convert reference preparation into a frame-by-frame animation implementation plan unless explicitly required.

## Adaptive Review

Do not force concept → turnaround → detail → material approval for every asset.

Pause for approval when an output materially changes visual authority or identity. Auxiliary sheets that only elaborate an already-approved target do not automatically require separate approval unless strict stage review is requested.

## Minimum-Context Delivery

Control does not resend the entire package on every turn.

Examples:

```text
whole-model initial geometry
→ primary views + dimensions + profile + relevant semantic parts + geometry/rig constraints

wheel correction
→ user delta + affected view(s) + relevant VEHICLE part relationships

texture correction
→ affected material entries + UV/material constraints

animation correction
→ relevant articulation + keyframe guidance + affected clip
```

The objective is Cost to Accepted Result, not minimum packet size at the expense of correctness.

## Existing Asset / Update

```text
USER CHANGE REQUEST
→ ChatGPT adds reference/technical clarification only when needed
→ Control recovers current asset/workspace state
→ preserve accepted information
→ classify affected owner/dependencies
→ deliver minimum changed intent/reference context to Codex
→ Codex edits
→ Control invalidates only affected evidence/gates
```

Do not regenerate a complete package for every correction.

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
- a replacement for actual images;
- a copy of Skills or Tool schemas;
- a hidden source of guessed requirements;
- a mandatory turnaround/detail/material set for trivial assets;
- a second asset-state database;
- a Cube-by-Cube modelling blueprint.

Its only purpose is to make the next Codex decision more correct, efficient and explicit.
