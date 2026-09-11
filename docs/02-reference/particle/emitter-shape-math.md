# Emitter Shape and Direction Math

This file owns advanced math reasoning for Bedrock emitter shapes and launch directions.

Evidence classes:
- **OFFICIAL BEDROCK** for documented component fields/shape capabilities.
- **HEURISTIC** for authoring math patterns built from those primitives.

## 1. Prefer built-in shapes first

Use built-in point/sphere/box/disc/entity-AABB when they already express the required spawn region.

Use `minecraft:emitter_shape_custom` only when spawn positions materially require custom Molang math.

## 2. Direction as vector

A direction vector expresses orientation, not automatically speed.

Conceptually:

```text
velocity = normalized(direction) × speed
```

For Snowstorm/Wintersky target compatibility, keep launch orientation in shape direction and authored magnitude in scalar `particle_initial_speed` when magnitude matters.

## 3. Vector normalization

For vector `(x,y,z)`:

```text
length = sqrt(x² + y² + z²)
normalized = (x/length, y/length, z/length)
```

Guard zero length.

When authoring directional ratios manually, normalize only when the target field/editor semantics actually require direction-only behavior.

## 4. Point emitter

Use a point emitter when all particles originate from effectively one source position.

Variation belongs in:
- direction;
- scalar speed;
- particle-owned random state;
- downstream motion.

Do not widen the spawn region merely to create trajectory spread.

## 5. Disc math

Official disc shape supports:
- radius;
- plane normal;
- offset;
- `surface_only`;
- custom/inward/outward direction.

Use a disc for:
- crater mouths;
- aura circles;
- shockwave rings;
- flat spray sources.

### Disc plane

A disc with normal `[0,1,0]` lies in the XZ plane.

For an authored custom disc/ring concept:

```text
x = cos(angle) × radius
z = sin(angle) × radius
y = 0
```

Prefer built-in disc unless custom distribution is actually required.

## 6. Ring vs filled disc

```text
filled disc → surface_only false
edge/ring   → surface_only true
```

Do not use a filled disc when the visual source is physically a rim.

## 7. Sphere math

Sphere direction concepts:

```text
outwards → from center toward spawn position
inwards  → from spawn position toward center
custom   → explicit Molang vector
```

For custom procedural positions, uniform sphere sampling is mathematically different from choosing latitude/longitude uniformly; naive angular sampling clusters near poles.

Unless distribution precision matters, prefer the built-in sphere component rather than recreating uniform sphere sampling in Molang.

## 8. Box math

Box half-dimensions describe center-to-face distances.

If:

```text
half_dimensions = [hx, hy, hz]
```

then conceptual local bounds are:

```text
x ∈ [-hx, hx]
y ∈ [-hy, hy]
z ∈ [-hz, hz]
```

Use box for volumetric rain regions, dust volumes, barriers, and rectangular sources.

## 9. Entity AABB

Entity-AABB shape uses the attached entity's bounding box.

Use for body-covering effects where the emission region should follow entity size.

Do not treat entity AABB as a substitute for bone/locator placement when the source is a specific body part.

## 10. Custom shape

`minecraft:emitter_shape_custom` exposes custom `offset` and `direction` Molang vectors.

Useful procedural families:
- ring;
- spiral;
- wave;
- patterned line;
- rotating source;
- asymmetric authored field.

## 11. Random angle

A stable random angle in degrees:

```molang
variable.particle_random_1 * 360.0
```

Then:

```molang
x = math.cos(angle) * radius
z = math.sin(angle) * radius
```

## 12. Random radius

Naively:

```text
radius = random × R
```

places equal probability per radial interval, not equal area density.

For mathematically uniform area over a disc, radial distance should conceptually scale with square root of random:

```text
radius = sqrt(random) × R
```

Use only when custom shape sampling is actually necessary; built-in disc is simpler.

## 13. Cone launch

A practical cone around +Y:

```text
x = centered_random_x × lateral_spread
y = positive dominant component
z = centered_random_z × lateral_spread
```

Then scalar speed owns magnitude.

Narrower cone:
- reduce X/Z spread;
- increase Y dominance.

Wider cone:
- increase lateral spread relative to Y.

## 14. Directional fan

For a forward axis such as +Z:

```text
x = centered_random × side_spread
y = lift + centered_random × vertical_spread
z = forward_bias
```

Useful for exhaust, muzzle-like bursts, spray, or debris thrown in one direction.

## 15. Hemisphere bias

When particles must never launch downward, enforce a positive vertical component rather than generating a full sphere and trying to fix it later with acceleration.

Example concept:

```text
y = base_up + random × up_variation
```

## 16. Tangential direction for orbit/ring

For position on a ring:

```text
radial = [cos(a), 0, sin(a)]
tangent = [-sin(a), 0, cos(a)]
```

Use tangent when particles should travel around the ring instead of away from its center.

## 17. Inward/outward plus lift

For a crater/ring with outward spread and upward bias:

```text
horizontal radial direction
+ positive Y bias
```

Conceptually:

```text
dir = [radial_x × h, up, radial_z × h]
```

Then normalize if required by the target semantics.

## 18. Rotated local source

When emitter local rotation is active, authored local directions rotate with the emitter.

Do not apply an additional world-space correction unless the effect intentionally needs world alignment.

## 19. Distribution vs motion

Keep these separate:

```text
shape / offset → where particle is born
direction       → initial launch orientation
initial speed   → launch magnitude
motion          → what happens after birth
```

Mixing them makes tuning difficult.

## 20. Shape debugging order

If particle position/direction looks wrong:

```text
emitter local/world space
→ shape offset
→ shape dimensions/radius
→ surface_only
→ direction vector
→ scalar initial speed
→ dynamic/parametric motion
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_document?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/emitter_shape_custom?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/examples/particlecomponents/particle_effect_component?view=minecraft-bedrock-stable
