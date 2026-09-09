# Surface Pattern Standard

## Purpose

`surface_pattern` describes **how a surface is visually painted** in the base-color texture. It is not a Minecraft render material, not a PBR Texture Set, and not geometry material-instance metadata.

Use it as an optional reasoning/pattern vocabulary for material-specific pixel-art treatment.

## Hard boundary

```text
surface_pattern
= RGB/value/detail language

render_profile
= how Minecraft renders the pixels

pbr_texture_set
= physical/data-map support

geometry_material_instance
= geometry metadata
```

Never infer one domain from another.

A surface can combine any compatible choices, for example:

```text
surface_pattern=clean_glass
render_profile=translucent

surface_pattern=painted_metal
render_profile=opaque

surface_pattern=painted_metal
render_profile=emissive_mask
```

The pattern name alone does not decide transparency, glow, culling, alpha semantics, or PBR.

## Pattern recipes

Patterns are advisory recipes, not fixed generators and not quality scores. Reference evidence always wins.

### `wood_grain`

- directional grain aligned with construction;
- irregular short clusters instead of uniform stripes;
- sparse knots or darker interruptions when supported;
- hue/value movement should feel organic rather than metallic.

### `brushed_metal`

- controlled directional streaks or bands;
- hard value breaks and selective edge highlights;
- sparse wear; avoid stone-like random noise;
- panel seams remain deliberate.

### `painted_metal`

- paint color owns the broad surface;
- exposed-metal language is limited to supported chips/edges/seams;
- avoid making every edge bright.

### `stone_cluster`

- irregular medium/large value islands;
- non-directional breakup unless the reference has strata;
- controlled chips or pores; no wood-like repetition.

### `concrete_speckle`

- broad matte base with sparse low-contrast speckle;
- larger variation before micro-noise;
- avoid uniform high-frequency noise.

### `cloth_weave`

- lower contrast than hard metal;
- stepped folds/value transitions first;
- weave hints only where texel density can support them.

### `leather_wear`

- broad warm/cool value variation;
- sparse crease and edge wear;
- avoid repetitive grain across every face.

### `clean_glass`

- sparse reflection/value clusters;
- border/frame cues only when supported;
- do not encode transparency rules here; use `render_profile`.

### `plastic_clean`

- clean broad color masses;
- restrained highlights;
- low random variation.

### `rubber_matte`

- compressed value range;
- subdued highlights;
- sparse surface breakup.

### `organic_form`

- variation follows body/form rather than panel language;
- asymmetry may be desirable;
- avoid mechanical edge-striping unless reference-supported.

## Selection rules

- choose a pattern from the approved reference or explicit user intent;
- do not infer object category solely from name or geometry;
- custom/unknown visual treatment may use `surface_pattern=custom` in reasoning without inventing a preset;
- a pattern can be mixed or localized by material cohort;
- pattern application must respect physical pixels-per-UV-unit and face coverage.

## Execution order

```text
reference/material cohort
→ select/adapt surface_pattern
→ BASE
→ VALUE / FORM
→ IDENTITY
→ SECONDARY DETAIL
→ seam/coverage review
→ mapped-model verify
```

Pattern recipes never override the existing anti-noise, anti-mixel, alpha, UV, seam, or evidence rules.
