# ChatGPT Particle Reference Patterns

This document defines reusable authoring patterns learned from particle work. These are not fixed presets. They are starting heuristics that still require an effect-specific authoring brief and QA.

## Pattern 1 — Ballistic eruption / debris

Use for:

- volcanic bombs;
- thrown debris;
- explosive rock fragments;
- heavy impact ejecta.

Core logic:

```text
custom launch direction
+ scalar initial speed
+ gravity
+ modest drag
+ stable per-particle class
```

Use multiple debris classes only when they need materially different size, speed, lifetime, or visual heat state.

Key QA:

- apex/range envelope;
- spawn ring or source clearance;
- readable hero fragments at intended distance;
- budgeted visible count.

## Pattern 2 — Rising smoke / plume

Use for:

- eruption columns;
- chimney smoke;
- heavy steam;
- dense atmospheric lift.

Core logic:

```text
positive-Y launch direction
+ scalar initial speed
+ low/moderate drag
+ gradual billboard growth
+ particle-age opacity shaping
```

If lower rise and upper crown have different physics, split them into separate emitters rather than switching living particles mid-life.

Key QA:

- upward momentum exists at spawn;
- emitter age does not switch living-particle physics;
- alpha-card overlap remains controlled;
- central geometry keep-out is respected.

## Pattern 3 — Ambient dust / suspended particles

Use for:

- interior dust;
- ruins;
- dry environmental haze;
- subtle ambient motes.

Core logic:

```text
low spawn rate
+ slow drift
+ long lifetime
+ small stable random variation
+ conservative opacity
```

Avoid high particle counts simply to make the effect noticeable. Readability should come from scale, contrast, and sparse motion.

## Pattern 4 — Waterfall mist / spray

Use for:

- waterfall bases;
- spray around fast water;
- impact mist;
- wet environmental haze.

Typical decomposition:

```text
impact spray = short, faster outward burst
mist        = slower rising/drifting translucent layer
```

Do not force both behaviors into one class if their lifetime and velocity differ materially.

## Pattern 5 — Fire / sparks

Use for:

- embers;
- forge sparks;
- campfire particles;
- combustion effects.

Typical decomposition:

```text
hot glow/spark = small, fast, additive or bright alpha-oriented layer
smoke          = slower translucent layer
```

Keep bright sprites rare enough that the effect does not become a wall of repeated icons.

## Pattern 6 — Magic / energy

Use for:

- portals;
- spell effects;
- powered machinery;
- stylized energy fields.

Core logic depends on visual intent, but stable lifetime randomness remains preferred over frame-random class switching.

Parametric or curve-heavy motion should remain bounded and justified because static preflight does not reproduce a full Molang runtime.

## Pattern 7 — Machinery exhaust

Use for:

- vehicle smoke;
- vents;
- engines;
- industrial emitters.

Typical decomposition:

```text
initial exhaust puff = directional launch
mature smoke         = slower expanding drift
```

Align spawn direction with the actual exhaust geometry rather than world-up by default.

## Pattern 8 — Impact burst

Use for:

- hit effects;
- ground/object impacts;
- small explosions;
- break effects.

Core logic:

```text
instant or short burst
+ outward directional spread
+ short lifetime
+ strong size/readability control
```

Only use collision if the effect truly needs it; collision is not a default realism requirement.

## Pattern selection rule

Choose the closest pattern by physical role, not by texture appearance.

For complex effects, combine the minimum number of patterns needed to represent distinct physics. Do not decompose an effect merely to increase layer count.

## Reference hierarchy

The approved volcano package is the first known-good example for:

```text
ballistic eruption / debris
+ rising plume
+ upper crown support
+ long-distance readability
+ central geometry keep-out
```

Future patterns should only be promoted to "proven" after a real authored effect has been reviewed and accepted by the user.
