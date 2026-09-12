# Pixel Art Delivery

## Default delivery

Deliver only the asset(s) requested by the user plus minimal production-relevant metadata when needed.

Do not create extra packaging merely to satisfy a template.

## Standalone asset

For a normal icon/object/sprite frame, relevant metadata may include:

```text
artifact identity
artifact class
target mode
canvas dimensions
alpha/background behavior
style-lock identity when part of a series
```

## Downstream Texturing handoff

Pass only:

```text
artifact identity
canvas/grid dimensions
palette roles or exact palette when authoritative
material grouping
identity markings
orientation
alpha intent
style-lock fields that affect mapped appearance
reference-fidelity constraints
```

Do not include UV or atlas claims unless supplied by the actual Texturing stage.

## Downstream Particle handoff

Pass only:

```text
texture identity
pixel dimensions
alpha behavior
frame/atlas order if animated
visual loop intent
color/emissive intent
```

Emitter physics, lifetime, Molang, collision, and event behavior remain Particle-owned.

## Sprite animation delivery

Create a sprite sheet only when requested or required by the target. Otherwise ordered frames are valid.

If a sheet is required, document frame order and dimensions. Do not infer engine-specific packing metadata without evidence.

## Clean output

Production output must not contain:

- baked checkerboard transparency previews;
- accidental white/black matte halos;
- smooth-resize residue;
- unused generated backgrounds;
- duplicate revision layers presented as final assets.

## Handoff principle

A validated pixel-art asset and a production-mapped texture are separate states.

Pixel Art may finish before Texturing begins.