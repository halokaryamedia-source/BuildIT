# Pixel Art Animation

## Purpose

Author sprite-animation references with stable pixel grammar and readable motion.

## Motion hierarchy

```text
motion intent
→ key poses
→ silhouette readability
→ breakdown poses
→ timing
→ cluster cleanup
→ loop / impact validation
```

## Key poses first

Do not increase frame count before key poses communicate the motion. Strong pose contrast and readable arcs are more important than smoothness alone.

## Stable properties

Unless motion intentionally changes them, preserve:

- anchor point;
- apparent volume;
- palette roles;
- visible pixel scale;
- identity landmarks;
- material grammar.

## Secondary motion

Add secondary motion only after primary action is clear. Do not let straps, cloth, ears, particles, or accessories obscure the main pose.

## Cluster flicker

Check that outlines, highlights, and small accents do not jump randomly between frames. Motion should move clusters intentionally rather than re-noise the asset each frame.

## Timing

Use the fewest frames that preserve the requested feel. Holds, anticipation, impact, and recovery may need unequal timing.

## Looping

For loops, check first/last transition for:

```text
pose continuity
volume continuity
outline continuity
highlight continuity
palette continuity
```

## Boundary

This file owns pixel-sprite animation references only. Blockbench bone animation, Bedrock animation controllers, and runtime particle timing remain with their existing owners.