# LazyDesigner Reference → Codex Handoff

Updated: 2026-09-12

This file owns only the **handoff boundary** between ChatGPT Reference Preparation and Codex. It deliberately does not repeat the operational flow, JSON schema, stage contracts, or package load contract.

Canonical owners:

```text
Reference Preparation flow → ../flow.md
Durable policy            → ../policy.md
REFERENCE.json base       → schema.md
Particle specialization   → particle-handoff.md
GEOMETRY.md                → geometry.md
TEXTURE.md                 → texture.md
ANIMATION.md               → animation.md
Codex package load         → load-contract.md
Image system               → ../image/README.md
Pixel Art system           → ../pixel-art/README.md
```

## Purpose

ChatGPT should resolve avoidable ambiguity before Codex spends context and reasoning on it.

```text
CONFIRMED USER INTENT
+ APPROVED VISUAL AUTHORITY
+ COMPACT STRUCTURED FACTS
+ ONLY USEFUL STAGE GUIDANCE
→ SELF-CONTAINED CODEX HANDOFF
```

The package must be enough for the next correct authoring decision without requiring the original ChatGPT transcript.

## Default Package

Model reference package:

```text
asset_reference/
├── REFERENCE.json
├── GEOMETRY.md
├── TEXTURE.md      ← only when useful
├── ANIMATION.md    ← only when useful / required
└── images/
    └── approved/supporting references
```

A Pixel Art artifact used for model texturing remains an approved/supporting visual reference. It does **not** create a new package-stage document or asset kind.

Example:

```text
asset_reference/
├── REFERENCE.json
├── TEXTURE.md              ← optional when semantic guidance adds value
└── images/
    └── fuel_bottle_blue.png  ← approved pixel-art authority
```

Particle downstream handoff remains the same package system but may carry actual Bedrock resources instead of model-stage Markdown:

```text
asset_reference/
├── REFERENCE.json
├── particles/
│   └── <name>.particle.json
└── textures/
    └── particle/
        └── <name>.png
```

When a particle texture originated from Pixel Art, the PNG remains the texture resource; do not add a second Pixel Art manifest or duplicate texture copy merely to preserve provenance.

Do not add `PIXEL_ART.md`, `PIXEL_ART.json`, `README.md`, `CODEX_START.md`, transcripts, compiled prompts, generic tutorials, or duplicate briefing files by default. A standalone user-facing Resource Pack delivery may still include its own README when required by the Particle delivery contract; that is distinct from the minimal Codex handoff package.

## Authority Boundary

```text
explicit current user requirement
→ approved visual/reference authority
→ confirmed scale/resource requirement
→ REFERENCE.json structured facts
→ active stage/resource projection
→ Codex interpretation
```

Images—including approved Pixel Art artifacts—own visible design evidence. Particle JSON/PNG own authored particle resource content. `REFERENCE.json` owns stable structured facts, relationships, unknowns, paths, integration intent, and readiness. Stage Markdown explains only stage-specific consequences when relevant.

A lower layer never silently overrides a higher layer.

## Pixel Art Handoff Rule

Pixel Art is a **Reference Preparation capability**, not a canonical package asset kind and not a Control authoring stage.

For mapped model use:

```text
approved Pixel Art artifact
→ image entry / visual authority
→ optional TEXTURE.md interpretation
→ Texturing consumes compact appearance facts
→ actual UV/atlas/mapped state remains Texturing-owned
```

For particle use:

```text
approved Pixel Art texture/frame asset
→ packaged texture resource
→ Particle consumes texture-facing facts
→ particle JSON/runtime semantics remain Particle-owned
```

Only transport decision-relevant Pixel Art facts such as:

```text
artifact/texture identity
canvas or pixel dimensions
palette/material relationships when authoritative
identity landmarks / markings
orientation / projection when relevant
alpha behavior
frame contract when animated
style_lock_id + relevant style fields
source/reference identity
provenance
known blockers
```

Do not transport the full Pixel Art Skill/docs, prompt history, QA scratch, UV claims, runtime state, or particle behavior claims.

## Asset Kind Boundary

The canonical package uses one entry point for different implementation kinds:

```text
MODEL
→ asset.profile selects modelling profile
→ stage documents/images as needed

PARTICLE
→ asset.kind = PARTICLE
→ no fake modelling profile
→ particle block carries resource paths + integration recommendations
→ see particle-handoff.md
```

Pixel Art does **not** add `asset.kind = PIXEL_ART`. A standalone Pixel Art user artifact may exist without a Codex Reference Package; when it is consumed downstream, it travels as visual/resource evidence inside the existing MODEL or PARTICLE path.

Do not create a second `PARTICLE_HANDOFF.json` or Pixel Art handoff format.

## Handoff Readiness

The handoff is valid only when:

```text
required confirmation/approval is explicit
blocking unknowns for the intended next stage/action are resolved
scale/resource authority is internally consistent
listed documents/images/resources exist
image IDs and stage relevance resolve when used
pixel-art provenance/style constraints resolve when used
particle resource paths agree when used
stage documents introduce no unsupported facts
readiness agrees with blockers
```

If a conflict is material only to one stage/dependency, block that dependent work rather than resetting unrelated readiness.

## Codex Consumption

Codex follows `load-contract.md`:

```text
REFERENCE.json
→ identify asset kind / task / readiness
→ MODEL: load active stage document/images only when needed
→ PARTICLE: load referenced particle JSON/PNG only when needed
→ load matching authoring Skill/context
→ work
```

For Pixel Art-backed work, load the artifact/reference itself only when it can change the active Texturing or Particle decision. Do not load the Pixel Art knowledge corpus downstream.

Do not scan all Markdown files, images, or resource files by default.

## Correction / Continuation

For a bounded change:

```text
USER DELTA
→ preserve unaffected approved authority
→ update affected REFERENCE.json facts
→ update only affected stage/resource file(s)
→ update only affected image(s)
→ hand revised package to Codex
```

A Pixel Art revision invalidates only the downstream appearance/resource facts it actually changes. It does not automatically invalidate Geometry or unrelated Particle behavior.

Do not rebuild the complete package for a local correction.

For existing assets, the package may be partial when only one stage or dependency needs new reference clarification. It is not a second persistent asset-state database.

## Non-Goals

The handoff must not become:

```text
giant master prompt
conversation archive
copy of Skills or Tool schemas
Cube-by-Cube modelling plan
hidden source of guessed requirements
mandatory full set of stage documents
parallel workflow/state system
second Particle handoff format
Pixel Art package/stage system
runtime-state database
```

Its only job is to carry the minimum confirmed authority needed for reliable downstream authoring.
