# LazyDesigner Reference → Codex Handoff

Updated: 2026-09-11

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

Do not add `README.md`, `CODEX_START.md`, transcripts, compiled prompts, generic tutorials, or duplicate briefing files by default. A standalone user-facing Resource Pack delivery may still include its own README when required by the Particle delivery contract; that is distinct from the minimal Codex handoff package.

## Authority Boundary

```text
explicit current user requirement
→ approved visual/reference authority
→ confirmed scale/resource requirement
→ REFERENCE.json structured facts
→ active stage/resource projection
→ Codex interpretation
```

Images own visible model design. Particle JSON/PNG own authored particle resource content. `REFERENCE.json` owns stable structured facts, relationships, unknowns, paths, integration intent, and readiness. Stage Markdown explains only stage-specific consequences when relevant.

A lower layer never silently overrides a higher layer.

## Asset Kind Boundary

The canonical package uses one entry point for different reference kinds:

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

Do not create a second `PARTICLE_HANDOFF.json` format.

## Handoff Readiness

The handoff is valid only when:

```text
required confirmation/approval is explicit
blocking unknowns for the intended next stage/action are resolved
scale/resource authority is internally consistent
listed documents/images/resources exist
image IDs and stage relevance resolve when used
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
runtime-state database
```

Its only job is to carry the minimum confirmed authority needed for reliable downstream authoring.
