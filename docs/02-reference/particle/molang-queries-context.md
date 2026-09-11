# Particle Molang Queries and Context

This file owns particle-relevant Molang query/context knowledge. Generic Molang syntax belongs in `molang-language-math.md`; particle ownership rules belong in `molang.md`.

## Evidence classes

- **OFFICIAL BEDROCK** — Microsoft Molang/reference behavior.
- **SNOWSTORM / WINTERSKY** — editor-preview-specific availability or behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — authoring guidance.

## 1. Query model

**OFFICIAL BEDROCK**

`query.*` / `q.*` reads engine-provided state. Query functions are not the same thing as particle-owned variables.

Important distinction:

```text
query.*
→ asks Minecraft for current engine/entity/context state

variable.*
→ authored persistent state for the current owner

temp.*
→ temporary expression-local working state

context.*
→ engine-provided read-only context for the current expression
```

Do not replace stable particle identity with a query whose value can change every evaluation.

## 2. Context availability is host-dependent

A Molang expression only has access to queries/context exposed by the system evaluating it.

Therefore:
- a query valid in entity animation is not automatically valid in a particle expression;
- a query shown in generic Molang documentation is not automatically guaranteed in every particle field;
- editor acceptance does not prove Minecraft exposes the same host context.

When a query is essential, verify it against the particle/entity host that actually owns the expression.

## 3. Particle built-in variables are usually preferable for particle-local behavior

For particle-local lifetime behavior prefer:

```text
variable.particle_age
variable.particle_lifetime
variable.particle_random_1..4
```

For emitter-local behavior prefer:

```text
variable.emitter_age
variable.emitter_lifetime
variable.emitter_random_1..4
```

Use entity queries only when the effect intentionally depends on external entity/game state.

## 4. Query stability classes

Classify every external query by how its value behaves:

```text
STATIC / near-static
→ identity-like state; safe for decisions intended to remain constant if sampled/stored appropriately

SLOWLY CHANGING
→ health/state/time-like values

FRAME-CHANGING
→ movement/animation/view-dependent values

EVENT-CONTEXTUAL
→ only meaningful while a specific host/event evaluates the expression
```

A frame-changing query used directly for UV class, size class, or random-looking class selection can cause visual popping.

## 5. Null-coalescing

**OFFICIAL BEDROCK**

Molang supports `??` for missing/stale references in supported contexts.

Use it defensively only where absence is legitimate. Do not use null-coalescing to hide a required query/context bug.

Conceptual pattern:

```text
(query.some_optional_value ?? fallback)
```

## 6. Query aliases

**OFFICIAL BEDROCK**

```text
query.foo   == q.foo
context.foo == c.foo
variable.x  == v.x
temp.x      == t.x
```

Alias choice is stylistic and does not change ownership.

## 7. Entity-dependent particle behavior

When a particle is spawned from an entity context, some authored behavior may intentionally depend on entity state before or during emission.

Good uses:
- choose an effect variant before spawning;
- bind emission to an animation state;
- choose color/intensity from a stable entity property;
- activate/deactivate an emitter from an entity-side condition.

Risky uses:
- drive every living particle's class directly from changing entity state;
- assume an entity query remains valid after a fire-and-forget child effect is detached;
- use external state where particle-owned lifetime state is sufficient.

## 8. Sampling vs continuously reading

If a value should remain fixed for a particle, conceptually sample it into particle-owned state at initialization when the format/context supports that approach instead of repeatedly reading a changing source.

```text
external value at birth
→ stable authored variable / particle-owned random-class decision
→ living particle remains coherent
```

If the effect is intentionally reactive, continuous reads may be appropriate.

## 9. Query cost

**HEURISTIC**

Prefer the smallest number of external queries needed for the visual result. Repeating complex queries across size, tint, motion, UV, and event expressions increases authoring complexity and may increase runtime evaluation work.

Where possible:
- compute once conceptually;
- reuse a curve or authored variable;
- separate emitter-side state selection from particle-side evolution.

## 10. Validation checklist

```text
[ ] query is available in the expression host that uses it
[ ] changing query is not accidentally used as stable particle identity
[ ] entity-dependent logic is intentionally coupled to entity lifetime
[ ] optional values use fallback only when absence is valid
[ ] particle-local behavior uses particle-owned state where possible
[ ] query complexity is not duplicated across many per-frame fields
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/syntax-guide?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/molangreference/examples/molangconcepts/queryfunctions?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/practical-molang?view=minecraft-bedrock-stable
