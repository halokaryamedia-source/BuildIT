# LazyDesigner Reference → Codex Handoff

Updated: 2026-09-11

This file owns only the **handoff boundary** between ChatGPT Reference Preparation and Codex. It deliberately does not repeat the operational flow, JSON schema, stage contracts, or package load contract.

Canonical owners:

```text
Reference Preparation flow → ../flow.md
Durable policy            → ../policy.md
REFERENCE.json             → schema.md
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

```text
asset_reference/
├── REFERENCE.json
├── GEOMETRY.md
├── TEXTURE.md      ← only when useful
├── ANIMATION.md    ← only when useful / required
└── images/
    └── approved/supporting references
```

Do not add `README.md`, `CODEX_START.md`, transcripts, compiled prompts, generic tutorials, or duplicate briefing files by default.

## Authority Boundary

```text
explicit current user requirement
→ approved visual reference
→ confirmed scale requirement
→ REFERENCE.json structured facts
→ active stage Markdown projection
→ Codex interpretation
```

Images own visible design. `REFERENCE.json` owns stable structured facts, relationships, unknowns, scale, and readiness. Stage Markdown explains only stage-specific consequences.

A lower layer never silently overrides a higher layer.

## Handoff Readiness

The handoff is valid only when:

```text
required confirmation/approval is explicit
blocking unknowns for the intended next stage are resolved
scale authority is internally consistent
listed documents/images exist
image IDs and stage relevance resolve
stage documents introduce no unsupported facts
readiness agrees with blockers
```

If a conflict is material only to one stage, block that dependent stage rather than resetting unrelated readiness.

## Codex Consumption

Codex follows `load-contract.md`:

```text
REFERENCE.json
→ identify task/stage/readiness
→ load active stage document when present
→ inspect only images relevant to that stage
→ load the matching authoring Skill/profile context
→ work
```

Do not scan all Markdown files or all images by default.

## Correction / Continuation

For a bounded change:

```text
USER DELTA
→ preserve unaffected approved authority
→ update affected REFERENCE.json facts
→ update only affected stage document(s)
→ update only affected image(s)
→ hand revised package to Codex
```

Do not rebuild the complete package for a local correction.

For existing assets, the package may be partial when only one stage needs new reference clarification. It is not a second persistent asset-state database.

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
```

Its only job is to carry the minimum confirmed authority needed for reliable downstream authoring.