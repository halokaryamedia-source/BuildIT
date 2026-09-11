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

## Canonical recipe library

`mcp/lib/textureSurfacePattern.ts` owns the compact typed recipe library. Recipes describe qualitative pixel language, not pre-generated bitmaps and not numeric quality targets.

Current vocabulary:

```text
wood_grain            painted_wood
brushed_metal         bare_metal          painted_metal
stone_cluster         concrete_speckle
cloth_weave           leather_wear
clean_glass           dirty_glass
plastic_clean         rubber_matte
organic_skin          fur_cluster
emissive_panel        energy_surface
```

Each recipe records:

```text
directionality
cluster_language
value_behavior
edge_behavior
secondary_detail
avoid[]
render_profile_inference = forbidden
```

The final field is a hard invariant: surface appearance never silently selects Minecraft render behavior.

## Representative treatments

### `wood_grain` / `painted_wood`

- directional cues follow construction grain;
- use irregular clustered runs instead of uniform stripes;
- painted wood remains paint-dominant, with underlying grain/wear only where supported;
- sparse knots/chips are secondary evidence, never a noise blanket.

### `brushed_metal` / `bare_metal` / `painted_metal`

- use clean hard clusters and deliberate value breaks;
- selective edge highlights communicate hard surfaces better than universal outlines;
- brushed metal may carry restrained directional streaks;
- painted metal exposes bare-metal language only at justified chips/edges/seams.

### `stone_cluster` / `concrete_speckle`

- stone uses irregular medium/large value islands;
- concrete keeps larger quiet fields with sparse grouped aggregate marks;
- avoid dense salt-and-pepper noise and wood-like directionality.

### `cloth_weave` / `leather_wear`

- cloth prioritizes fold/form readability with restrained contrast;
- weave hints appear only when physical texel density supports them;
- leather uses broad organic variation plus sparse crease/edge wear.

### `clean_glass` / `dirty_glass`

- keep the field visually quiet enough to read as glass-like surface treatment;
- use sparse reflection, smudge, dust, or structural-edge cues;
- transparency is never encoded by this pattern name—`render_profile` owns that decision.

### `plastic_clean` / `rubber_matte`

- plastic favors broad clean color masses and small selective highlights;
- rubber keeps a compressed darker range with subdued highlights and sparse molded detail.

### `organic_skin` / `fur_cluster`

- organic skin follows body/form and identity markings rather than mechanical panel language;
- fur clusters follow growth direction in grouped tufts, not single-pixel hair noise.

### `emissive_panel` / `energy_surface`

- `emissive_panel` describes visual RGB organization of a luminous-looking panel, not actual runtime glow;
- `energy_surface` uses purposeful flow/arc clusters rather than random electric noise;
- actual emissive behavior still requires an explicit `render_profile` such as `emissive_mask`.

## Reference-grounded selection

Before painting, build a compact region treatment plan:

```text
region
→ reference evidence state
→ surface_pattern
→ render_profile / minecraft_material_code
→ optional pbr_intent
→ identity colors / notes
```

`planTextureTreatment` owns this separation. Missing evidence remains `review_required`; it must not be filled by guessing from object/category names.

## Vanilla knowledge boundary

`textureVanillaKnowledge.ts` provides durable Minecraft/Blockbench texture principles and source categories without copying texture assets or requiring runtime network access. Use it to improve texture grammar, not to clone a Vanilla entity texture.

## Execution order

```text
reference/material cohort
→ treatment plan
→ BASE PASS
→ VALUE / FORM PASS
→ SURFACE PATTERN PASS
→ IDENTITY PASS
→ SECONDARY DETAIL PASS
→ RENDER / ALPHA VERIFY
→ seam/coverage review
→ mapped-model verify
```

Pattern recipes never override the existing anti-noise, anti-mixel, alpha, UV, seam, or evidence rules.
