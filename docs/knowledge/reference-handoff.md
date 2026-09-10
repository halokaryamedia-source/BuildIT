# LazyDesigner Reference → Codex Handoff

Updated: 2026-09-11

This file owns the **reference-preparation handoff contract** between ChatGPT and Codex. It does not replace the canonical authoring flow in `docs/knowledge/flow.md`, the semantic Skills, Runtime ToolSpecs, or asset continuity in `workspace/active/<asset>/README.md`.

## Purpose

ChatGPT prepares references so Codex can author efficiently without reconstructing missing technical intent from images alone.

The handoff principle is:

```text
MAKE AMBIGUITY EXPLICIT BEFORE CODEX PAYS TO RESOLVE IT
```

ChatGPT may generate or refine the visual reference, but its responsibility is broader than image creation. It should package the minimum decision-critical technical information needed for the specific asset/task.

## Canonical Front-Door Flow

```text
USER REQUEST
→ CHATGPT REFERENCE PREPARATION
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

Every Codex modelling request enters through LazyDesigner Control. Control is a routing/context projection layer; it must not replace the original user intent or creative authoring reasoning.

## ChatGPT Responsibilities

ChatGPT should preserve the user's original request and prepare only information that materially reduces ambiguity.

For a new asset, the package should normally establish:

```text
asset identity
original user intent
approved visual reference(s)
requested dimensions / scale authority
animation required: yes/no/unknown
important silhouettes / primary masses
important negative spaces / openings
attachment and contact relationships
expected symmetry / asymmetry
material identity where visually relevant
moving parts / articulation expectations when relevant
known constraints / exclusions
uncertainties that must not be guessed
```

Additional technical guidance is conditional. Include it only when useful:

```text
recommended representation: cubes / thin planes / crossed cutout / mixed
hierarchy suggestions
pivot / rigging guidance
joint-clearance or deformation guidance
UV / texture identity requirements
PBR/material notes
animation keyframe or motion-reference guidance
particle/effect relationship
critical viewing angles
reference conflicts or missing evidence
```

ChatGPT must not invent unavailable dimensions, hidden geometry, articulation, materials, or motion as facts. Unknown decision-critical information stays explicit.

## Reference Package Shape

The handoff should contain two complementary surfaces:

```text
1. human/visual evidence
2. compact machine-readable task metadata
```

### Visual evidence

May include one or more actual images:

```text
original source image
approved generated concept
turnaround / orthographic views
structural detail views
material reference
rigging/deformation guide
keyframe animation guide
```

Only include views that change a modelling decision. Do not generate ceremonial image sets for simple assets that are already adequately defined.

### Machine-readable metadata

Preferred format is a small JSON document when a structured handoff is useful. Markdown remains appropriate for explanation-heavy guidance. The image files remain the visual authority; metadata must not paraphrase away visual identity.

Recommended minimal JSON shape:

```json
{
  "schema": "lazydesigner-reference-package-v1",
  "asset": {
    "name": "example_asset",
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
    "known_conflicts": []
  },
  "technical": {
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

`null` means unknown; it must never be silently converted into an inferred requirement.

## What Control Receives

Control receives the package and projects only what Codex needs for the current decision.

It resolves:

```text
task class
asset identity
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

Control does **not** resend the entire package on every turn. It should use content identity/hash and task continuity so unchanged reference/context is referenced rather than retransmitted.

## What Codex Receives

Codex should receive:

```text
original user intent
current modelling target
relevant approved image(s)
only the technical constraints relevant to that target
current stage/gates
required semantic Skill context
recommended/known capability when available
explicit unknowns/blockers
```

Codex remains responsible for:

```text
3D interpretation
modelling strategy
cube/group decomposition
visual comparison
correction reasoning
texture design
rig/animation construction
source implementation for system-development tasks
```

Control must not precompute creative geometry or replace Codex reasoning.

## Minimum-Context Rule

Do not forward every available reference and guide by default.

Examples:

```text
whole-model initial geometry
→ primary visual references + dimensions + geometry/rig constraints

small wheel correction
→ user correction intent + affected reference view(s) + current target state

texture correction
→ relevant material/color/reference evidence + current UV/texture constraints

animation correction
→ relevant rig state + keyframe/motion guide + affected clip information
```

The objective is **Cost to Accepted Result**, not merely smallest packet size.

## Existing Asset / Update Flow

For an existing model:

```text
USER CHANGE REQUEST
→ ChatGPT adds reference/technical clarification only when needed
→ Control recovers current asset/workspace state
→ preserve existing accepted information
→ classify affected owner/dependencies
→ deliver minimum changed intent/reference context to Codex
→ Codex edits
→ Control invalidates only affected evidence/gates
```

Do not regenerate a complete reference package for every small correction.

## System Development Flow

The same front door also supports LazyDesigner development:

```text
USER MCP / PLUGIN / BUILD REQUEST
→ optional ChatGPT technical research/reference preparation
→ Control: SYSTEM_DEVELOPMENT
→ resolve exact source owner + affected layers + minimum context
→ Codex implementation
→ build/generate/deploy path
→ Control development delta
```

This does not route system-development work through the asset reference requirement gate.

## Boundary Summary

```text
ChatGPT
= reference preparation + ambiguity reduction

LazyDesigner Control
= intake + state + readiness + context projection + routing + invalidation

Codex
= reasoning + modelling/coding

Gateway
= stable MCP client boundary

Runtime
= capability execution

Blockbench
= live asset truth

Workspace
= persistent asset continuity
```

## Non-Goals

The Reference Package must not become:

- a giant duplicate design document;
- a replacement for the actual images;
- a copy of every Skill or Tool schema;
- a hidden source of guessed dimensions/requirements;
- a requirement to generate turnaround sheets for every trivial object;
- a second asset-state database;
- a prompt that tells Codex exactly how every cube must be placed before Codex evaluates the actual reference.

The package exists only to make the next Codex decision better, faster, and less ambiguous.
