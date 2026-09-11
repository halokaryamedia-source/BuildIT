# Particle Delivery Contract

Deliver a normal Minecraft Bedrock Resource Pack folder or ZIP unless the user explicitly requests another form.

## Canonical package

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

## README minimum

State:
- main effect identifier;
- child effect identifiers when relevant;
- texture paths;
- intended runtime/preview target;
- concise import/use notes;
- known visual-review caveats when material.

Do not export the ChatGPT transcript, internal reasoning, or temporary authoring notes.

## Snowstorm compatibility

The delivered package must use ordinary Bedrock paths and JSON so the same authored assets can be inspected in Snowstorm and copied into a Bedrock resource/development resource pack.

## Handoff to Codex / MCP

The package itself is the handoff artifact. Downstream tooling may inspect, copy, patch, bind, or preview it according to its own authority.

Particle Reference Authoring does not require MCP to create the package and does not require the package to be registered into MCP before delivery.

## Delivery gate

Before final delivery:

```text
all referenced files exist
all identifiers/paths agree
no stale experimental artifacts
no unresolved blocking requirement
static warnings disclosed when material
package structure is clean
```
