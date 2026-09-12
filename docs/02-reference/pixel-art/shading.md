# Pixel Art Shading

## Purpose

Create readable form and material depth using deliberate stepped clusters rather than smooth painting.

## Value-first rule

Establish large shadow/base/light masses before micro-highlights.

```text
LIGHT SOURCE
→ FORM PLANES
→ SHADOW MASS
→ LIGHT MASS
→ MATERIAL RESPONSE
→ SECONDARY ACCENTS
```

Do not start from decorative highlights or contour bands.

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

Light direction must explain cluster placement. Do not place bright clusters merely to fill empty regions.

## Pillow-shading guard

Avoid generic shading that simply makes edges dark and the center bright regardless of volume.

Common failure:

```text
dark contour
→ medium ring
→ bright center
```

This is invalid when it does not correspond to actual plane orientation or a deliberate stylized lighting model.

Before accepting a shadow/highlight cluster, ask:
- what form plane or curvature causes it?
- what light direction supports it?
- what material response modifies it?

If none applies, remove or simplify it.

## Form vs texture

Shading describes volume. Surface texture describes material variation. Do not substitute random texture pixels for missing form shading.

## Hardness

Adjust cluster edge hardness by material and style target:

- metal: sharper compact highlight transitions;
- cloth: broader, quieter transitions;
- plastic: clean broad highlight;
- stone: irregular but grouped value breaks;
- emissive: bright identity mass supported by surrounding contrast.

## Selective highlight discipline

Specular pixels are scarce accents. Concentrate them where they explain orientation, material, or focal identity. Repeated equal-strength highlights across unrelated surfaces flatten hierarchy.

## Gradients

Smooth gradients are not the default. If a gradual transition is necessary, resolve it through intentional stepped bands or controlled dithering appropriate to the palette and target size.

## Avoid

```text
pillow shading without a deliberate style reason
scene-lighting baked into neutral assets without request
random highlight speckles
outlines that change thickness accidentally because of shading
near-identical shades with no visible role
bright accents distributed uniformly across the asset
shadow bands that only hug the outer contour
```