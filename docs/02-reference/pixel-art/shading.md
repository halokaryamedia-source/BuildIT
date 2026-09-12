# Pixel Art Shading

## Purpose

Create readable form and material depth using deliberate stepped clusters rather than smooth painting.

## Value-first rule

Establish large shadow/base/light masses before micro-highlights.

## Cluster shading

Prefer grouped transitions:

```text
DEEP SHADOW
→ SHADOW
→ BASE
→ LIGHT
→ SPECULAR (conditional)
```

Not every asset needs every step.

## Light direction

Use a consistent light direction inside one asset and, for a set, inside the established Style Lock unless explicitly overridden.

## Form vs texture

Shading describes volume. Surface texture describes material variation. Do not substitute random texture pixels for missing form shading.

## Hardness

Adjust cluster edge hardness by material and style target:

- metal: sharper compact highlight transitions;
- cloth: broader, quieter transitions;
- plastic: clean broad highlight;
- stone: irregular but grouped value breaks;
- emissive: bright identity mass supported by surrounding contrast.

## Gradients

Smooth gradients are not the default. If a gradual transition is necessary, resolve it through intentional stepped bands or controlled dithering appropriate to the palette and target size.

## Avoid

```text
scene-lighting baked into neutral assets without request
random highlight speckles
outlines that change thickness accidentally because of shading
near-identical shades with no visible role
bright accents distributed uniformly across the asset
```