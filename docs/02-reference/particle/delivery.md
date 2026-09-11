# Particle Delivery Contract

Deliver a normal Minecraft Bedrock Resource Pack folder or ZIP unless the user explicitly requests another form.

This file owns **user-facing Particle delivery**. When the same authored particle is intentionally handed to Codex / BuildIT MCP, add the canonical LazyDesigner `REFERENCE.json` described by `../package/particle-handoff.md`; do not invent a separate Particle handoff manifest.

## Canonical user delivery

```text
<ParticleName>/
├── manifest.json
├── particles/
│   └── *.particle.json
├── textures/
│   └── particle/
│       └── *.png
├── texts/
│   ├── languages.json
│   └── en_US.lang
└── README.md
```

Only include folders actually required by the effect.

## LazyDesigner downstream handoff

When the package is meant for Codex / MCP implementation or integration, the same resource files may be wrapped by the canonical Reference Package entry point:

```text
asset_reference/
├── REFERENCE.json
├── particles/
│   └── <name>.particle.json
└── textures/
    └── particle/
        └── <name>.png
```

`REFERENCE.json` carries only compact handoff metadata such as:

```text
asset.kind = PARTICLE
particle identifier
particle JSON relative path
texture reference + PNG relative path
texture readiness
recommended locator / animation / trigger intent
review state
blocking unknowns / readiness
```

The actual `.particle.json` and `.png` remain authoritative for authored resource content. `REFERENCE.json` must not duplicate their full contents.

## Naming

Prefer clean durable names:

```text
volcano_eruption.particle.json
volcano_eruption_bombs.particle.json
volcano_eruption_plume.png
```

Avoid:
- `final_v2`, `v12`, `new_new`, or timestamp suffixes in delivered files;
- scratch QA reports;
- contact sheets used as production textures;
- duplicate source exports;
- `.mcpack` conversion unless explicitly requested.

## README minimum for user delivery

State:
- main effect identifier;
- child effect identifiers when relevant;
- texture paths;
- intended runtime/preview target;
- concise import/use notes;
- known visual-review caveats when material.

Do not export the ChatGPT transcript, internal reasoning, or temporary authoring notes.

A README is not required merely for Codex handoff when `REFERENCE.json` plus resource files are sufficient.

## Snowstorm compatibility

The delivered package must use ordinary Bedrock paths and JSON so the same authored assets can be inspected in Snowstorm and copied into a Bedrock resource/development resource pack.

## Handoff to Codex / MCP

Particle Reference Authoring and BuildIT MCP remain separate authorities:

```text
ChatGPT Particle Reference Authoring
→ creates/reviews reference resource package

Codex / BuildIT MCP
→ consumes package when requested
→ inspects current runtime state
→ copies/patches/previews/binds through existing MCP capabilities
```

Do not run both authoring systems in parallel on the same revision without an explicit correction/handoff boundary.

Particle Reference Authoring does not require MCP to create the package and does not require the package to be registered into MCP before user delivery.

## Delivery gate

Before final delivery or downstream handoff:

```text
all referenced files exist
all identifiers/paths agree
custom texture reference matches textures/particle/<name>.png
no stale experimental artifacts
no unresolved blocking requirement
static warnings disclosed when material
package structure is clean
REFERENCE.json included only when LazyDesigner downstream handoff is intended
```
