# Pixel Art Texture Reference

## Purpose

Define pixel-art output intended to guide later production texturing without claiming ownership of UV or atlas implementation.

## Reference contract

A texture-reference asset may define:

```text
palette roles
material grouping
surface motif
marking placement
cluster scale
edge / cutout language
alpha intent
orientation
repeat intent
```

It does not define production UV coordinates unless those coordinates are explicitly part of the requested reference.

## Mapped-surface boundary

Once the work becomes application onto actual model UV islands, mapped surfaces, Blockbench texture state, or render-profile behavior, ownership transfers to LazyDesigner Texturing.

## Scale discipline

A reference should communicate intended cluster/detail scale clearly enough that downstream Texturing does not need to reinterpret the visual language from scratch.

Avoid references whose enlarged presentation introduces details that cannot survive the actual target texture density.

## Material grouping

Keep major material regions visually separable. Identity markings should be unambiguous in location, orientation, relative scale, and palette role.

## Transparency

When cutout or transparent areas are part of the design, show clean alpha intent. Do not bake checkerboards or scene backgrounds into the asset.

## Handoff

Pass the smallest useful state from `delivery.md`. Production validation still occurs in the Texturing stage.