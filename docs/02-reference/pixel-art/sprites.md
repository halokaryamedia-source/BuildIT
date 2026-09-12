# Pixel Art Sprites

## Purpose

Define standalone sprite and sprite-animation reference authoring before any downstream engine/runtime integration.

## Static sprite

Resolve:

```text
canvas
anchor
orientation
silhouette
palette
identity landmarks
material cues
```

Keep the anchor stable for any sprite expected to animate later.

## Animation route

```text
motion intent
→ key poses
→ silhouette check
→ breakdown poses only as needed
→ cluster cleanup
→ timing check
→ loop seam check when applicable
```

## Frame consistency

Preserve unless motion explicitly changes them:

```text
anchor point
apparent volume
pixel scale
palette roles
identity landmarks
material logic
```

Avoid accidental breathing/flicker caused by changing outline thickness, highlight placement, or body width between adjacent frames.

## Key-pose priority

Strong readable key poses are more important than a high frame count. Add frames only when they improve timing, arc, impact, or loop continuity.

## Looping

For loops, verify both:

- pose continuity;
- cluster/value continuity.

A loop can be geometrically continuous but still flicker because highlight or outline clusters jump between first and last frame.

## Delivery boundary

Do not create sprite-sheet packing metadata unless requested. Standalone ordered frames are valid reference output when that is all the downstream task needs.