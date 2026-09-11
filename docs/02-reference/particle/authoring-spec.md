# Particle Authoring Specification

Use this contract to normalize a particle request before authoring. Ask only for missing facts that materially change the result.

## 1. Intent extraction

Resolve from the user's prompt/reference when present:

```text
effect / phenomenon
primary visual role
target runtime: Bedrock, Snowstorm preview, or both
approximate scale / viewing distance when material
duration or loop behavior when material
main motion direction / travel goal
environment or existing geometry when relevant
visual style / texture direction
```

Optional constraints:

```text
explicit motion envelope
spawn region
keep-out region
particle-count budget
atlas/grid requirements
reference images or approved prior assets
entity/locator attachment
```

## 2. Requirement classification

```text
BLOCKING
→ cannot author the requested semantic result responsibly without it

USEFUL
→ improves quality but can use a reversible provisional choice

OPTIONAL
→ does not need resolution before first authoring pass
```

Ask only BLOCKING questions before authoring. Do not turn a short request into a questionnaire.

For USEFUL/OPTIONAL unknowns, choose a conservative reversible authoring default when possible, but classify it internally as `PROVISIONAL`; never present it as a user requirement or measured runtime truth.

## 3. Execution class

Classify the request once before loading deep knowledge:

```text
DIRECT
→ one dominant physics/render role
→ usually one emitter/effect
→ examples: blue flame, ambient dust, sparks, simple smoke

COMPOSED
→ multiple materially different visual/physics roles
→ examples: impact flash + debris + dust; eruption core + bombs + plume

REACTIVE
→ behavior depends on collision, events, entity state, locators, child effects, or external Molang context

AUDIT / REVISION
→ existing JSON/package is the source of truth; change only the causal layer
```

Do not promote a DIRECT request into COMPOSED merely to make the structure look sophisticated.

## 4. Complexity tier

Choose the smallest implementation tier that satisfies the effect:

```text
TIER 0 — constants only
TIER 1 — simple particle-age/random Molang
TIER 2 — curves, richer formulas, atlas/flipbook, or multiple layers
TIER 3 — events, collision chains, entity context, advanced attachment or nested effects
```

Start at the lowest viable tier. Escalate only when a required behavior cannot be represented cleanly at the current tier.

## 5. Internal execution packet

Before authoring, reduce the request to a compact packet:

```text
intent
execution_class
complexity_tier
target
layers
physics_role_per_layer
spawn_owner
motion_model
render/material role
texture_strategy
Molang role: none / identity / progression / external-reactive
Snowstorm-specific requirements
QA gates required
provisional assumptions
final delivery shape
```

This packet is internal control state, not a new persisted system.

## 6. Decomposition rule

Split layers only when they materially differ in one or more of:

```text
physics
spawn region
timing
render/material behavior
texture class
attachment/event ownership
```

Good:

```text
volcano → core + ballistic debris + rising plume + crown
impact  → flash + debris + dust
```

Bad:

```text
simple flame → several emitters with identical motion/render roles
```

## 7. Texture decision

Choose texture work only to the level required:

```text
existing suitable texture
→ reuse/validate

simple static sprite
→ one RGBA texture

multiple stable visual classes
→ atlas only when simpler than separate effects/textures

animated visual frames
→ flipbook
```

Do not create an atlas, flipbook, or generated texture pipeline by default.

## 8. Molang decision

Use Molang only when a constant cannot express the intended behavior cleanly.

```text
constant property
→ constant

stable per-particle variation
→ particle_random_N

lifetime progression
→ particle_age / particle_lifetime, simple formula, easing, or curve

emitter phase
→ emitter-owned state

external/entity reactivity
→ query/context only when the actual host provides it
```

Do not add formulas merely because Molang is available.

## 9. Snowstorm compatibility baseline

When Snowstorm/Wintersky preview is a target and authored launch magnitude matters, prefer:

```text
emitter shape direction = launch vector
minecraft:particle_initial_speed = scalar speed
```

This is Snowstorm-targeted compatibility guidance, not a generic Bedrock prohibition on vector initial-speed forms.

## 10. Authority order

```text
explicit current user requirement
→ visible reference evidence
→ approved prior particle decision
→ target-version official Bedrock semantics
→ documented Snowstorm/Wintersky behavior when editor-specific
→ conservative reversible authoring choice
→ unresolved remains UNKNOWN
```

Never invent hidden geometry, exact performance, runtime behavior, or user constraints. Reversible visual defaults are acceptable only when recorded as provisional and when asking would not materially improve the first pass.
