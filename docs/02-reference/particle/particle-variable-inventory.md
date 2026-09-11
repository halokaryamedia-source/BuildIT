# Particle Molang Built-in Variable Inventory

This file inventories Bedrock particle-system variables that are documented for particle Molang. It is intentionally separate from generic Molang query documentation.

Evidence class: **OFFICIAL BEDROCK** unless otherwise marked.

## Emitter variables

```text
variable.emitter_age
variable.emitter_lifetime
variable.emitter_random_1
variable.emitter_random_2
variable.emitter_random_3
variable.emitter_random_4
```

### `variable.emitter_age`
Age since the current emitter loop began.

Use for:
- emitter phase timing;
- spawn-rate envelopes;
- emitter-level event timing.

Avoid using it to classify living particles when identity should remain stable after spawn.

### `variable.emitter_lifetime`
Duration of the current emitter loop.

Useful for normalized emitter progress:

```molang
variable.emitter_age / variable.emitter_lifetime
```

Guard zero/degenerate lifetime if the expression can resolve to it.

### `variable.emitter_random_1..4`
Stable random values from 0 to 1 for the current emitter loop.

Use when one whole emitter loop should share a random choice.

Examples:
- one loop chooses stronger/weaker wind;
- one loop chooses a burst family;
- one loop varies an offset or timeline.

## Particle variables

```text
variable.particle_age
variable.particle_lifetime
variable.particle_random_1
variable.particle_random_2
variable.particle_random_3
variable.particle_random_4
```

### `variable.particle_age`
Time the particle has been alive.

Use for:
- size progression;
- alpha fade;
- color cooling;
- parametric motion;
- age-driven UV behavior.

### `variable.particle_lifetime`
Total authored lifetime of the particle.

Together with particle age, this gives normalized lifetime progress.

### `variable.particle_random_1..4`
Stable random values from 0 to 1 for the particle lifetime.

These are preferred for persistent per-particle variation:
- sprite class;
- size class;
- launch family;
- color family;
- drag/lifetime variation;
- UV cell selection.

## Entity scale

```text
variable.entity_scale
```

When an effect is attached to an entity, this exposes entity scale.

Do not assume it exists or has useful semantics in a detached standalone emitter context.

## Ownership matrix

```text
Need                                    Preferred owner
──────────────────────────────────────  ───────────────────────
emitter loop phase                      emitter_age
emitter loop duration                   emitter_lifetime
one random choice per emitter loop      emitter_random_N
particle lifetime phase                 particle_age/lifetime
one random choice per particle          particle_random_N
attached entity scale                   entity_scale
```

## Stability rule

Persistent particle identity should normally be chosen from particle-owned stable state.

Risky:

```text
UV class depends on emitter_age
size class depends on emitter_age
motion family depends on emitter_age
```

Preferred:

```text
UV class → particle_random_1
size class → particle_random_2
motion family → particle_random_3
age evolution → particle_age / particle_lifetime
```

## Aliases and casing

Molang permits aliases such as `v.` for `variable.` depending on context/tooling. Existing valid source style should not be rewritten merely for cosmetic normalization.

Do not infer a semantic ownership difference from alias style.

## What is not in this inventory

This file does not attempt to list every `query.*` available in every Minecraft content context. Query availability is host/context dependent and belongs to `molang-queries-context.md`.

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/particlesreference/particlemolangintegration?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/particleeffects?view=minecraft-bedrock-stable
