# Particle Authoring Specification

Use this contract to normalize a particle request before authoring. Ask only for missing facts that can materially change the result.

## Required intent

```text
effect / phenomenon
primary visual role
target runtime: Bedrock, Snowstorm preview, or both
approximate scale / viewing distance when material
duration or loop behavior when material
main motion direction / travel goal
environment or existing geometry that can occlude the effect
visual style / texture direction
```

## Optional intent

```text
explicit motion envelope
spawn region
keep-out region
particle-count budget
atlas/grid requirements
reference images or approved prior assets
```

## Requirement classification

```text
BLOCKING
USEFUL
OPTIONAL
```

Ask only BLOCKING questions before authoring. USEFUL questions are asked only when the expected quality gain is material. OPTIONAL facts remain unspecified.

## Internal normalized brief

A compact internal brief should resolve, when known:

```text
name / identifier direction
visual layers
physics classes
spawn ownership
particle-owned vs emitter-owned timing
texture classes
view distance
motion targets
occlusion constraints
performance target
final delivery shape
```

Do not expose implementation jargon unless useful to the user.

## Decomposition rule

Split effects only when layers require materially different physics, timing, spawn regions, render behavior, or texture classes.

Good examples:

```text
volcano
→ core + ballistic debris + rising plume + crown

impact
→ flash + debris + dust
```

Do not create extra emitters merely for organization.

## Snowstorm compatibility baseline

When authored launch magnitude matters in Snowstorm/Wintersky preview:

```text
emitter shape direction = launch vector
minecraft:particle_initial_speed = scalar speed
```

Keep emitter timing on emitter-owned values. Keep stable living-particle classes on particle-owned random/age/lifetime values.

## Authority order

```text
explicit current user requirement
→ visible reference evidence
→ approved prior particle decision
→ canonical particle authoring rules
→ unresolved remains UNKNOWN
```

Never silently invent scale, duration, motion range, materials, or hidden geometry when those choices materially change the effect.
