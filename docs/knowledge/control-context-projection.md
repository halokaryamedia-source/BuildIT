# LazyDesigner Control Context Projection

Updated: 2026-09-11

This document defines the canonical stage-specific context contract projected by LazyDesigner Control to Codex for asset authoring.

Control owns projection. Skills consume projection. Reference Preparation owns source reference facts. Workspace/Runtime own current asset state. No stage Skill should rebuild this contract independently.

## Objective

Project only the information required for the current authoring decision while preserving source authority and avoiding repeated reasoning.

```text
REFERENCE PACKAGE
+ CURRENT ASSET / WORKSPACE STATE
+ USER DELTA
+ READINESS / FRESHNESS
        ↓
      CONTROL
        ↓
GEOMETRY_CONTEXT | TEXTURE_CONTEXT | ANIMATION_CONTEXT
        ↓
      CODEX
```

The objective is not smallest possible payload. The objective is the minimum sufficient payload that reduces wrong-route recovery, repeated discovery, and repeated interpretation.

## Shared Envelope

Every projection uses one compact shared envelope:

```text
schema
context_type
asset_id / asset_name
original_user_intent
current_user_delta
selected_profile
reference_package_id_or_hash
workspace_revision_or_hash
stage_readiness
blocking_unknowns
non_blocking_unknowns_relevant_to_stage
source_freshness
```

Rules:
- `original_user_intent` is preserved unchanged as authority context.
- `current_user_delta` contains only the current requested change when applicable.
- `selected_profile` is a label and routing signal; only Geometry normally receives the selected profile document.
- stage blockers are filtered to the current decision.
- unchanged large content should be referenced by stable identity/hash rather than resent verbatim when the client already has it.

## GEOMETRY_CONTEXT

Purpose: support Geometry, hierarchy, pivots/rig-readiness, representation and UV-readiness decisions.

Canonical payload includes only material fields:

```text
shared envelope
requirements.dimensions_blocks
requirements.animation_required
selected modelling profile
relevant approved reference views
semantic parts relevant to geometry
part count / topology / attachment / contact
negative spaces / openings
cross-view depth evidence
symmetry / asymmetry
representation hints
motion participation
articulation / pivot / clearance constraints when geometry-affecting
geometry-owned constraints
current geometry state / affected UUIDs for corrections
relevant acceptance / invalidation state
```

Normally exclude:
- complete material styling prose;
- unrelated PBR settings;
- complete animation clip/keyframe plans;
- unrelated texture atlas details;
- full secondary profiles.

Profile loading rule:

```text
Modelling Core
+ exactly one selected primary profile
+ narrowly scoped secondary guidance only when justified
```

## TEXTURE_CONTEXT

Purpose: support atlas, painting, material, alpha, emissive/PBR and mapped-surface fidelity decisions.

Canonical payload includes only material fields:

```text
shared envelope
Geometry APPROVED
UV Layout PASS
relevant semantic parts / surface cohorts
material entries
major color/material regions
identity-critical markings
surface/pattern direction and scale constraints
alpha/cutout ownership
emissive / PBR requirements
relevant approved reference views
atlas identity / texture UUID
UV / mapped-face state needed for current task
current texture state / affected surface IDs for corrections
texture-stage blockers
```

Normally exclude:
- wheelbase/chassis/body-plan reasoning;
- unrelated joint/pivot data;
- complete modelling profile prose;
- unrelated animation timing/pose data;
- geometry construction history that does not affect mapped surfaces.

`selected_profile` may remain as a compact label for semantic interpretation, but Texturing does not load the full profile by default.

## ANIMATION_CONTEXT

Purpose: support motion, pose, timeline, controllers/effects and playback verification decisions.

Canonical payload includes only material fields:

```text
shared envelope
Geometry / Texture approval state required by lifecycle
checkpoint / current asset revision
relevant semantic moving parts
parent-child hierarchy for participating parts
pivot / axis intent
joint overlap / coverage constraints
clearance / contact / attachment invariants
motion participation classification
RIG_DEFORMATION guidance when relevant
POSE_ACTION guidance when relevant
ANIMATION_KEYFRAME guidance when relevant
relevant approved pose / motion reference views
current animation UUID / clip properties / affected timeline cohort
animation-stage blockers
```

Normally exclude:
- full UV atlas layout;
- unrelated material palette/PBR entries;
- complete modelling profile prose;
- geometry details outside participating motion chains;
- unrelated nonparticipating joints.

`selected_profile` remains a compact label only. Animation consumes explicit articulation/motion semantics rather than reopening the whole profile.

## Projection Selection

Control selects context from the active authoring domain:

```text
Geometry / hierarchy / pivots / UV readiness
→ GEOMETRY_CONTEXT

Texture / atlas / material / PBR / paint
→ TEXTURE_CONTEXT

Animation / timeline / controller / animation effect
→ ANIMATION_CONTEXT
```

If ownership is ambiguous, resolve the owner first. Do not send all three contexts as a hedge.

## Correction Projection

For bounded corrections, project a delta rather than reconstructing the initial package.

Examples:

```text
wheel placement correction
→ GEOMETRY_CONTEXT
  + current user delta
  + wheel semantic part/cohort
  + affected reference view(s)
  + current geometry identity

logo / material correction
→ TEXTURE_CONTEXT
  + affected material/surface cohort
  + relevant reference crop/view
  + current atlas/texture identity

knee gap during walk
→ ANIMATION_CONTEXT
  + hip/knee participating chain
  + coverage/clearance constraint
  + affected clip/time/pose evidence
  + geometry handoff marker only if ownership proves upstream
```

Do not resend unrelated approved information.

## Authority Rules

Projection does not create new truth.

```text
explicit user requirement
→ highest task authority

approved reference image(s)
→ visual authority

Reference Package metadata
→ structured technical authority where evidence-backed

workspace / Runtime state
→ current authored-state authority

Skill/profile docs
→ decision rules and reusable knowledge

Control projection
→ selection/transport only
```

Control may normalize names and select subsets, but it must not silently rewrite user intent, invent missing facts, or promote provisional evidence to supported fact.

## Freshness

Each projection records freshness only for evidence classes that can affect the current decision.

Recommended conceptual states:

```text
FRESH
STALE
UNKNOWN
NOT_REQUIRED
```

A mutation stales only affected evidence. Do not globally invalidate all captures, atlas information, animation state, or acceptance gates after a bounded change.

Examples:
- Geometry resize affecting mapped surfaces → affected UV/Texture evidence stale.
- Texture paint mutation → Geometry evidence remains fresh.
- Pivot/hierarchy change on participating bone → relevant animation evidence stale.
- Animation keyframe mutation → Geometry/UV evidence remains fresh unless a structural blocker is discovered.

## Readiness

Projection should contain stage-specific readiness, not one global vague status.

```text
READY
NEEDS_REVIEW
BLOCKED
```

`BLOCKED` requires a decision-changing blocker for the active stage. A missing future-stage detail must not block an earlier legal stage.

Examples:
- missing underside color does not block Geometry;
- unresolved wheel count can block Geometry;
- missing material authority can block affected Texturing while Geometry remains approved;
- unsuitable knee pivot can block Animation and require bounded Geometry handoff.

## Context Identity / Reuse

Control should prefer content-addressed continuation when large unchanged context is already known.

Conceptual identity:

```text
context_hash = hash(
  original intent identity
  + reference package identity
  + workspace revision
  + active stage
  + selected profile
  + current delta
  + relevant freshness/readiness state
)
```

Use the hash to avoid resending unchanged profile/reference/workspace content. A hash is an identity aid, not proof that underlying live state is still valid; freshness rules still apply.

## Non-Goals

Control projections must not become:
- a second Reference Package;
- a second persistent asset database;
- copies of entire Skills;
- copies of Runtime Tool schemas;
- per-Cube/per-keyframe plans;
- permanent stage-specific workflow engines;
- an excuse to load all available context.

## Completion Contract

The projection system is correct when:

```text
Geometry receives only geometry-relevant profile/reference/current-state context
Texture receives only material/UV/mapped-surface context
Animation receives only participating motion/rig/clip context
user intent remains unchanged
stage blockers remain explicit
bounded mutations invalidate only affected evidence
unchanged context can be reused by identity/hash
```

Control remains the selector/router. Codex remains the reasoning/authoring agent. Skills remain semantic authorities for their domains.
