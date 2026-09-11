# Reference Preparation Policy

**Status:** Active Policy  
**Updated:** 2026-09-11

This file owns durable Reference Preparation principles only. It must stay compact and must not duplicate child contracts.

## Purpose

Reference Preparation turns user intent and source evidence into an approved Minecraft/Blockbench visual target plus a compact reference package that lets Codex author without avoidable guessing.

```text
USER INTENT / SOURCE EVIDENCE
→ REQUIREMENT RESOLUTION
→ APPROVED VISUAL AUTHORITY
→ REFERENCE PACKAGE
→ CODEX AUTHORING
```

Operational flow: `flow.md`  
Image rules: `image/README.md`  
Package rules: `package/README.md`

## Authority Order

```text
1. explicit current user requirement
2. approved visual reference
3. confirmed numeric / player-relative scale requirement
4. REFERENCE.json structured facts
5. stage-specific package Markdown
6. downstream interpretation
```

A weaker layer may clarify but may not override a stronger authority.

## Evidence Rule

Use only evidence that actually exists.

```text
visible source evidence → may support a visual claim
missing / conflicting evidence → UNKNOWN or ask when blocking
```

Do not infer exact dimensions from pixels. Do not average conflicting views into invented geometry. Do not invent hidden structure, materials, articulation, animation, or identity-critical design facts.

## Minimum-Sufficient Reference Rule

Reference Preparation is not a presentation-board workflow.

```text
minimum evidence that materially reduces downstream uncertainty
```

A user-supplied image may already be sufficient. Generate additional visual reference only when it resolves a material ambiguity or creates a clearer approved Minecraft target.

For generated sheets, use `image/standard.md`.

## Minecraft Target Rule

When starting from real-world or non-Minecraft evidence, final production reference sheets normally show the approved **Minecraft/Blockbench interpretation only**. The original source remains separate evidence when needed.

## Scale Rule

All sizing is anchored to Minecraft player/world scale unless stronger explicit dimensions exist.

Canonical rules: `image/scale-and-escalation.md`.

Exact confirmed dimensions remain authoritative. Player-relative categories are semantic anchors, not permission to invent exact block values.

## Identity / Anti-Drift Rule

Sheet 01 establishes the visual identity and scale lock. Later sheets may elaborate but may not silently redesign or rescale the asset.

A change to locked identity, scale, major silhouette, part count, material identity, asymmetry, accessory set, or construction logic is a revision and must update affected evidence coherently.

## Profile Rule

Reference Preparation and Authoring share one profile vocabulary:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

Profiles are knowledge overlays, not templates or geometry presets. `GENERIC` is fallback only.

Authoring profile details live under `../03-authoring/modelling/profiles/`.

## Unknown / Readiness Rule

Unknowns are classified as:

```text
blocking
non_blocking
```

A blocking unknown can materially change the next legal decision. Non-blocking unknowns remain visible without stopping unrelated work.

Readiness is stage-specific:

```text
READY
NOT_REQUIRED
NEEDS_REVIEW
BLOCKED
```

Missing Texture evidence must not block Geometry unless it actually changes a Geometry decision.

## Image / Metadata Boundary

```text
image     → visual authority
JSON      → structured facts / relations / readiness / unknowns
Markdown  → stage-specific explanation only where useful
```

Do not turn images into technical manuals. Do not turn metadata into a prose duplicate of the image.

## Package Boundary

The normal package is intentionally small:

```text
REFERENCE.json
GEOMETRY.md
TEXTURE.md      only when useful
ANIMATION.md    only when useful / required
approved/supporting image(s)
```

Canonical package owners: `package/README.md`.

Do not export conversation transcripts, compiled prompt history, generic tutorials, Tool schemas, or Cube-by-Cube implementation plans.

## Approval Rule

A generated visual becomes approved visual authority only after explicit user acceptance when visual approval is material.

A fresh material change requires a new bounded confirmation/review cycle. Never infer approval from silence.

## Completion

Reference Preparation is complete when:

```text
blocking information for the intended next stage is resolved
approved visual authority exists when required
scale is sufficiently anchored
only useful reference evidence is present
unknowns/readiness are explicit
package consistency passes
no unsupported fact was invented
```

Then stop. Downstream implementation belongs to LazyDesigner authoring.
