# ChatGPT Particle Authoring Experiment

Experimental proof that ChatGPT can design, iterate, validate, and package Minecraft Bedrock particle effects for Snowstorm and direct Resource Pack use without relying on the BuildIT MCP runtime.

## Status

- Experimental only.
- Not production authority for BuildIT particle authoring.
- The approved reference asset is `MIVUBI_Volcano_Eruption/`.
- The example is intentionally preserved as a working research artifact and workflow reference.

## What this experiment proves

ChatGPT can assist with:

1. Particle concept decomposition and visual layering.
2. Bedrock `.particle.json` authoring.
3. Snowstorm/Wintersky-specific motion debugging.
4. Pixel-art particle texture atlas authoring and cleanup.
5. Texture/UV QA.
6. Physics-oriented tuning for ballistic debris and rising plume behavior.
7. Resource Pack packaging for Minecraft Bedrock without producing an `.mcpack`.

## Approved example

`MIVUBI_Volcano_Eruption/`

Main effect:

```text
mivubi:volcano_eruption
```

Internal effects:

```text
mivubi:volcano_eruption_core
mivubi:volcano_eruption_bombs
mivubi:volcano_eruption_plume_rise
mivubi:volcano_eruption_plume_crown
```

The example uses three texture atlases:

```text
volcano_eruption_core.png
volcano_eruption_bombs.png
volcano_eruption_plume.png
```

## Important boundary

Do not wire this experiment into the active MCP routing or duplicate the canonical particle tools. Production particle ownership remains under the existing BuildIT particle tool/resource system. This directory documents a separate ChatGPT-assisted authoring workflow and a known-good reference asset.

See `WORKFLOW.md` for the important Snowstorm, motion, texture, and QA lessons learned.
