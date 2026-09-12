# Pixel Art Delivery

This file owns Pixel Art delivery, artifact identity, naming, and downstream handoff shape. It does not define Texturing, Particle, Control, or package-stage semantics.

## Default Delivery

Deliver only the asset(s) requested by the user plus minimum production-relevant metadata when needed. Do not create ZIPs, manifests, sprite sheets, atlases, or package metadata merely to satisfy a template.

## Artifact Identity and Naming

Resolve one stable identity before handoff:

```text
artifact_id / slug
artifact_class
target_mode
canvas_dimensions
alpha/background behavior
style_lock_id when part of a set
source/reference identity when fidelity matters
```

Use existing project naming conventions when available. Otherwise prefer concise lowercase `snake_case`. For series, keep one base identity with semantic suffixes. Avoid revision-history suffixes in final production names when a clean identity is available.

Examples:

```text
fishing_rod
parking_icon
fuel_bottle_blue
cyberpunk_kiosk
cat_walk_01
```

Naming does not define style or runtime ownership.

## Evidence Provenance

Compact handoff facts preserve authority class:

```text
USER_REQUIREMENT
REFERENCE_SUPPORTED
EXISTING_STYLE_SUPPORTED
PROVISIONAL
```

Do not promote provisional palette, dimensions, lighting, or style choices into approved downstream requirements.

## Downstream Texturing Handoff

Pass only fields that can change mapped appearance:

```text
artifact identity
canvas/grid dimensions
palette roles or exact palette when authoritative
material grouping
identity markings / landmark regions
orientation / projection
alpha intent
style_lock_id + only relevant style fields
reference-fidelity constraints
source/reference identity
known blockers
```

Do not include UV coordinates, atlas placement, Blockbench texture UUID, material-instance state, render-profile state, or mapped-surface PASS claims unless those facts came from the actual Texturing/Runtime owner.

## Downstream Particle Handoff

Pass only visual texture facts:

```text
texture identity
pixel dimensions
alpha behavior
frame count/order when animated
frame dimensions when known
visual loop intent
color/emissive intent
style_lock_id when relevant
source/reference identity
known blockers
```

Do not include spawn rate, lifetime, velocity, emitter shape, Molang, collision, or event behavior. Those remain Particle-owned.

## Sprite Animation Delivery

Create a sprite sheet only when requested or required by the target. Otherwise ordered frames are valid. When a sheet is required, preserve frame order, frame dimensions, frame count, loop intent, and authoritative anchor/alignment convention. Do not infer engine-specific packing metadata without evidence.

## Style Lock Handoff

Pass only fields that constrain future assets or downstream appearance, such as `style_lock_id`, visible pixel scale, outline treatment, palette behavior, light direction, contrast range, projection, occupancy/padding, detail density, and shadow/highlight language. Omit fields that are not decision-relevant downstream.

## Clean Output

Production output must not contain baked checkerboard previews, accidental matte halos, smooth-resize residue, unused generated backgrounds, duplicate revision layers presented as final assets, or hidden scratch assets bundled as production files.

## Handoff State

```text
PIXEL_ART_READY
→ standalone delivery may stop here

PIXEL_ART_READY + mapped model use
→ compact handoff
→ TEXTURING owns next state

PIXEL_ART_READY + particle visual use
→ compact handoff
→ PARTICLE owns next state
```

Pixel Art does not create a new Control phase. Downstream owners consume the compact artifact contract through existing reference/context mechanisms.