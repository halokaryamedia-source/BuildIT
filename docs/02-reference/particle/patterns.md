# Particle Reference Patterns

Patterns are reusable physical starting points, not presets. They guide first-pass decomposition and owner selection, but must be adapted to current scale, environment, style, target runtime, and explicit user intent.

## Pattern-selection rule

Pattern selection happens after intent normalization and before deep knowledge loading.

Choose the smallest physical pattern that explains the requested phenomenon:

```text
source behavior
→ dominant motion
→ lifetime envelope
→ render role
→ secondary roles only when materially distinct
```

A visual keyword is only a routing hint. Do not let the word `fire`, `magic`, `smoke`, or `explosion` force one fixed template.

If one pattern explains the effect, stay DIRECT. Combine patterns only when the request contains materially different physical roles.

## Pattern families

### Flame / buoyant combustion

Use when the visual mass originates near a source, rises, changes shape/size over age, and fades.

Typical ownership:

```text
compact source region
+ upward-biased launch
+ moderate drag
+ bounded lifetime
+ age-based size/alpha progression
```

Possible secondary role:
- sparks/embers only when ballistic fragments materially contribute to the look.

Avoid automatically adding smoke, sparks, or events to a simple flame request.

### Sparks / embers

Use for small bright fragments with short-to-medium life and directional or radial momentum.

```text
small spawn region
+ strong initial impulse
+ gravity or weak downward acceleration when physical
+ modest drag
+ small additive/blend sprite when appropriate
```

Do not use slow drifting smoke behavior for sparks.

### Ballistic debris / eruption

Use when particles leave a source with strong momentum and follow an arc.

```text
strong launch direction
+ scalar initial speed
+ gravity
+ moderate drag
+ bounded lifetime
```

Separate heavy, medium, and fragment classes only when their motion or visual class materially differs.

### Rising smoke / plume

Use for buoyant volume that rises and broadens.

```text
upward-biased launch
+ moderate scalar speed
+ drag
+ size growth
+ alpha fade
+ optional lateral drift
```

Split lower rise from mature crown/billow behavior only when the upper cloud needs materially different motion, spawn height, or lifetime.

### Ambient dust / suspended motes

Use for low-energy particles that drift rather than launch.

```text
low spawn rate
+ low speed
+ weak drift
+ longer lifetime
+ restrained size/random variation
```

Avoid high-frequency direction changes that make dust read as sparks.

### Ground dust / impact dust

Use for short low-altitude expansion after contact/impact.

```text
surface-biased spawn
+ horizontal/radial spread
+ weak upward lift
+ drag
+ size growth + fade
```

Do not keep it alive like ambient suspended dust unless lingering haze is explicitly requested.

### Waterfall mist / spray

Directional spray and suspended mist are separate roles when their physics differ.

```text
spray
→ directional impulse + shorter life

mist
→ slower drift + longer life + softer alpha
```

Add splash/impact ownership only when the source actually needs contact behavior.

### Rain / falling precipitation

Use for predominantly downward repeated particles across an area.

```text
area spawn
+ downward velocity
+ bounded lifetime by travel/scene need
+ restrained variation
```

Collision/splash is a separate reactive layer; do not add it unless requested or required.

### Snow / ash fall

Use for falling particles with slower descent and more lateral drift than rain.

```text
area spawn
+ mild downward velocity
+ lateral drift
+ longer lifetime
+ orientation/size variation
```

Ash may use darker/softer texture and different opacity progression, but the physical family can remain the same.

### Fire + sparks

Combine the Flame and Sparks families only when both contribute materially.

Typical decomposition:

```text
flame core/body
+ ballistic embers
```

Keep their render material, lifetime, gravity, and trajectory independent.

### Magic aura / energy field

Use when the effect is organized around a source or entity rather than one physical fluid/material.

Possible starting modes:

```text
orbit / swirl
rise / drift
pulse / expand
radial emission
surface halo
```

Choose one dominant motion model first. Add curves/tint only when they express the requested progression. Avoid per-frame random class switching.

### Beam / directional energy

Use when particles communicate a line, streak, or strong direction.

```text
narrow spawn/source
+ strongly constrained direction
+ directional billboard when needed
+ short or controlled lifetime
```

Do not simulate a beam with broad random spray unless dispersion is intentional.

### Machinery exhaust

Anchor spawn to the exhaust source, use directional velocity plus drag, and grow/fade over particle age.

Separate hot core from cool smoke only when visually or physically necessary.

### Trail

Use when particles mark movement behind a source.

```text
source-relative spawn
+ low independent velocity or inherited motion as appropriate
+ age-based fade
+ lifetime tuned to trail length
```

Do not keep particles bound to the source after emission unless the intended visual requires it.

### Impact burst

Typical decomposition:

```text
flash
+ directional/radial fragments
+ dust/smoke
```

Each layer is optional:
- flash = short luminous read;
- fragments = momentum/direction;
- dust/smoke = lingering volume.

Do not create all three when a simpler impact read is sufficient.

### Explosion

Treat `explosion` as a composed phenomenon, not one fixed preset.

Candidate roles:

```text
flash/core
+ fast fragments/sparks
+ expanding dust/smoke
+ optional secondary fire
```

Start with only the roles implied by the requested style. A stylized magic explosion may share impact timing but use energy/tint patterns instead of physical debris.

### Shockwave / ring expansion

Use when the main read is radial expansion from an origin.

```text
radial spawn or ring geometry
+ outward progression
+ short lifetime
+ size/alpha envelope
```

Use custom emitter math only when built-in shapes cannot express the ring cleanly.

### Bubble / underwater rise

Use for upward buoyant particles with low-to-moderate speed and gentle variation.

```text
local spawn region
+ upward drift
+ mild lateral variation
+ soft acceleration/drag if needed
+ bounded lifetime
```

Surface-pop behavior is a separate event/reactive role.

## Automatic decomposition guide

Common prompt cues can suggest a first physical family:

```text
api / flame          → Flame
spark / ember        → Sparks
asap / smoke         → Rising smoke
plume                → Rising smoke, possibly multi-stage
ambient dust         → Ambient dust
debu ledakan         → Ground/impact dust
hujan                → Rain
salju / abu jatuh    → Snow/Ash fall
spray / mist         → Waterfall mist/spray
trail                → Trail
exhaust              → Machinery exhaust
magic aura           → Magic aura/energy field
beam / laser         → Beam/directional energy
impact               → Impact burst
explosion            → Explosion composed family
shockwave            → Shockwave/ring expansion
bubble               → Bubble/underwater rise
```

This table is a routing hint only. Explicit motion/style requirements override keyword mapping.

## Composition rule

Combine pattern families only if at least one of these differs materially:

```text
physics
spawn region
timing
material/render role
texture class
event/attachment ownership
```

Examples:

```text
blue flame
→ Flame only

campfire with embers
→ Flame + Sparks

volcanic eruption
→ Ballistic debris + Rising smoke/plume

explosive impact with lingering cloud
→ Impact burst + Rising/ground dust

magic explosion
→ Impact timing + Magic energy, optional shockwave
```

## Knowledge-owner hint

Pattern selection should reduce knowledge reads:

```text
spawn/lifetime dominated
→ emitter.md

trajectory dominated
→ motion.md

custom ring/cone/fan
→ emitter-shape-math.md

age progression
→ molang.md or curves.md only when needed

texture-dominant visual
→ texture-authoring.md

entity/locator anchored
→ entity-integration.md

event/contact reactive
→ events.md / collision-advanced.md
```

Do not load every possible owner for a pattern.

## Numeric-default rule

Patterns intentionally do not define universal numeric presets.

Choose numeric values from:
1. explicit user target;
2. visible/reference evidence;
3. previously accepted effect in the same context;
4. conservative reversible provisional values.

Never promote one accepted effect's speed, lifetime, size, or spawn rate into a global default.

## Pattern promotion rule

A pattern becomes stronger empirical reference only after a real effect using it is reviewed and accepted. Even then, promote the physical reasoning—not its exact numeric settings—unless repeated evidence supports a bounded default range.
