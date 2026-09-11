# Particle Reference Patterns

Patterns are reusable physical starting points, not presets. They must be adapted to the current scale, environment, style, and target runtime.

## Ballistic debris / eruption

Use when particles leave a source with strong momentum and follow an arc.

```text
strong launch direction
+ scalar initial speed
+ gravity
+ moderate drag
+ bounded lifetime
```

Separate heavy, medium, and fragment classes only when their motion or visual class materially differs.

## Rising smoke / plume

Use positive-Y launch with moderate scalar speed and drag. Split lower rise from mature crown/billow behavior when the upper cloud needs materially different lateral motion or spawn height.

## Ambient dust

Prefer low spawn rate, slow drift, long lifetime, and restrained size variation. Avoid high-frequency randomness that makes dust read as sparks.

## Waterfall mist / spray

Combine directional spray with slower mist only when the two layers need different lifetime/drag/opacity behavior. Keep splash/impact ownership separate from suspended mist when useful.

## Fire / sparks

Separate glow/fire from physical sparks if their render material, lifetime, gravity, or trajectory differs. Use additive rendering only where it improves the intended glow.

## Magic / energy

Use curves, tint, and controlled motion intentionally. Avoid per-frame random class switching unless instability is part of the desired look.

## Machinery exhaust

Anchor spawn to the exhaust source, use directional velocity plus drag, and grow/fade the plume over particle age. Separate hot core from cool smoke only when visually or physically necessary.

## Impact burst

Typical decomposition:

```text
flash
+ directional fragments
+ dust/smoke
```

Keep the flash short. Let fragments carry impact direction. Let dust handle lingering volume.

## Pattern promotion rule

A pattern becomes stronger reference evidence only after a real particle effect using it is reviewed and accepted. Do not generalize one accepted effect into universal numeric defaults.
