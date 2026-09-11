# ChatGPT Particle Delivery Contract

This document defines the final package shape for particle effects authored through ChatGPT.

## Default delivery

Unless the user requests another format, deliver a normal folder and ZIP that can be inspected in Snowstorm and placed into a Minecraft Bedrock resource-pack or development-resource-pack location.

Do not create `.mcpack` by default.

## Canonical structure

```text
<ParticleName>/
├── manifest.json
├── particles/
│   ├── <effect>.particle.json
│   └── <effect>_<role>.particle.json
├── textures/
│   └── particle/
│       ├── <effect>.png
│       └── <effect>_<role>.png
├── texts/
│   ├── languages.json
│   └── en_US.lang
└── README.md
```

Only include files required by the effect.

## Naming rules

Use semantic production names only.

Allowed examples:

```text
volcano_eruption.particle.json
volcano_eruption_bombs.particle.json
volcano_eruption_plume.png
```

Do not ship names such as:

```text
volcano_v15.png
volcano_final_final.png
bombs_test.png
particle_fixed2.json
```

Source-control history owns revision history.

## Package cleanliness

Final package must exclude:

- QA scratch files;
- temporary source images;
- obsolete atlas revisions;
- contact sheets used only during texture development;
- duplicate textures;
- backup files;
- experimental JSON variants not referenced by the final effect;
- hidden dependency on repo-local paths.

## README requirements

Final `README.md` should contain only information useful to the recipient:

```text
main particle identifier
internal particle identifiers when relevant
texture paths
Snowstorm opening notes
Minecraft Bedrock manual import notes
example /particle command when appropriate
known intentional limits
```

Do not include development chronology or version history unless explicitly requested.

## Minecraft-ready definition

`Minecraft-ready` means:

- normal Bedrock Resource Pack structure;
- valid manifest ownership;
- particle and texture references resolve within the package;
- package can be copied manually into the appropriate resource-pack location;
- no `.mcpack` conversion is required.

It does not mean the package was live-tested in Minecraft unless the user actually tested it and reported acceptance.

## Snowstorm-ready definition

`Snowstorm-ready` means the `.particle.json` and texture assets are organized so the effect can be opened/inspected in Snowstorm, with Snowstorm-specific semantic pitfalls handled by the static workflow where applicable.

It does not claim visual parity without user review.

## Final report

When delivering a package, ChatGPT should report compactly:

```text
main identifier
major internal layers
QA gates completed
known unsupported/static-only checks
package filename
```

Do not overstate visual or runtime proof.
