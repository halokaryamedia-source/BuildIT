# Pixel Art Ownership Boundaries

## Pixel Art Authoring owns

- standalone pixel-art icons;
- object/prop pixel representations;
- sprites and sprite-animation references;
- repeating tiles/pattern references;
- Minecraft-native and MIVUBI HD pixel visual references;
- deliberate conversion of external references into pixel-art language;
- style-lock consistency for pixel-art sets;
- pixel-art QA.

## LazyDesigner Texturing owns

- actual UV/mapped texture application;
- atlas creation/mutation in Blockbench;
- Painter/tool execution;
- material/render-profile state;
- mapped-surface verification;
- production texture variants.

## Particle Authoring owns

- emitter behavior;
- particle lifecycle;
- particle motion;
- Molang;
- collision/events;
- Bedrock/Snowstorm particle JSON semantics.

Pixel Art may provide a particle texture or texture reference, but does not take over those responsibilities.

## Modelling owns

- model geometry;
- proportions in 3D;
- cube/mesh construction;
- pivots/rig-oriented geometry decisions.

## Animation owns

- Blockbench/Bedrock bone animation;
- controller/runtime animation semantics.

Pixel Art Animation owns only frame-based sprite references.

## Principle

A helper relationship is a handoff, not duplicated ownership. Each state has one canonical owner.