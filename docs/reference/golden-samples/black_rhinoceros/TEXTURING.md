# Texturing Contract

Status: `APPROVED`

## Authority

- `PRODUCTION_CONTEXT.md`
- `01_black_rhinoceros_form_scale_reference.png`
- `03_black_rhinoceros_texture_material_reference.png`
- approved Geometry checkpoint

## Texture lock

- Atlas: `128 × 128`
- Pixel Style: `16x`
- UV Mode: Box UV baseline
- Classic Bedrock: required
- PBR: forbidden
- Vibrant Visuals: forbidden
- Alpha: not required
- Emissive: forbidden

## Palette roles

- Base hide: medium warm gray-brown
- Light planes: desaturated beige-gray
- Shadow planes: dark umber-gray
- Deep creases: charcoal brown
- Horns and hooves: dark olive-brown to charcoal
- Eyes, nostrils, mouth, ear interiors: near-black

Exact palette swatches are shown in Sheet 03.

## Material zones

1. Torso and shoulder:
   - broad, low-contrast mottling;
   - large pixel clusters;
   - minimal directional shading.

2. Head and muzzle:
   - slightly darker than torso;
   - dark nostrils and mouth line;
   - one small dark eye per side.

3. Horns and hooves:
   - darker than hide;
   - subtle value steps from base to tip;
   - no glossy or metallic appearance.

4. Ears and tail:
   - same hide family;
   - darker interior or tip accent.

## UV strategy

- Box UV for torso, shoulder, rear mass, neck, legs, and feet.
- Selective per-face UV for muzzle, horns, ears, eye zones, and hoof accents.
- Mirroring permitted for left/right legs and ears.
- Keep texel density consistent.
- Prevent accidental overlap except intentional mirrored areas.
- Use at least one-pixel atlas padding around manually placed islands.

## Required texture-first details

- eyes;
- nostrils;
- mouth line;
- hoof separation;
- subtle shoulder and belly shading;
- sparse hide mottling;
- optional restrained scars or folds only when they do not create visual noise.

## Forbidden

- Geometry redesign;
- new parts;
- high-frequency random noise;
- smooth airbrush gradients;
- photorealistic skin;
- bright saturation;
- PBR maps;
- normal, metallic, or roughness maps;
- silhouette changes caused by painted fake depth.

## Texture review acceptance

- palette matches Sheet 03;
- model remains readable from normal gameplay distance;
- horns and hooves are clearly separated from hide;
- eyes and muzzle details remain simple and pixel-sharp;
- approved Geometry is unchanged;
- atlas and UV rules pass validation.
