# Particle Molang Queries and Context

This file owns particle-relevant Molang query/context knowledge. Generic Molang syntax belongs in `molang-language-math.md`; particle ownership rules belong in `molang.md`.

## Evidence classes

- **OFFICIAL BEDROCK** — Microsoft Molang/reference behavior.
- **SNOWSTORM / WINTERSKY** — editor-preview-specific availability or behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — authoring guidance.

## 1. Query model

`query.*` / `q.*` reads engine-provided state. Query functions are not the same thing as particle-owned variables.

```text
query.*
→ current engine/entity/context state

variable.*
→ state owned by the current Molang host

temp.*
→ temporary expression-local working state

context.*
→ engine-provided read-only context
```

Do not replace stable particle identity with a query whose value can change every evaluation.

## 2. Host availability is the primary rule

A query being documented globally does **not** prove it exists in every particle expression.

Before using a query ask:

```text
what system evaluates this expression?
→ standalone particle?
→ entity-attached particle?
→ client entity pre_effect script?
→ animation/controller?
→ event pre-effect expression?
```

A query valid in entity animation can be meaningless or unavailable inside an independent particle effect.

## 3. Query page version requirements

Individual Molang query pages may declare minimum content/format versions.

Therefore:
- check the specific query page when target-version compatibility matters;
- do not assume the current stable query catalog is backward-compatible with an older pack target;
- parser acceptance in Snowstorm is not proof that the target Minecraft version exposes the query.

Example class of rule:

```text
query exists in current docs
+ query page says minimum format version X
→ require target >= X
```

## 4. Particle built-ins are preferable for particle-local behavior

Particle-local:

```text
variable.particle_age
variable.particle_lifetime
variable.particle_random_1..4
```

Emitter-local:

```text
variable.emitter_age
variable.emitter_lifetime
variable.emitter_random_1..4
```

Use entity/game queries only when the visual intentionally depends on external state.

## 5. Query stability classes

Classify external reads before authoring:

```text
STATIC / near-static
→ identity-like state

SLOWLY CHANGING
→ health/state/daytime-like values

FRAME-CHANGING
→ movement/view/animation-dependent values

EVENT-CONTEXTUAL
→ meaningful only while a specific event/host evaluates

REFERENCE-BOUND
→ only valid while referenced actor/entity/context remains valid
```

A frame-changing query used directly for UV class, size class, or sprite identity can create popping.

## 6. Sampling versus continuous reading

If a value should remain fixed for a particle, sample/copy it into stable particle-owned state when the host supports that pattern.

```text
external value at birth
→ stable particle variable/class
→ particle remains coherent
```

Continuous query reads are correct only when the effect is intentionally reactive.

Examples:

```text
color chosen once from entity state
→ sample once

emitter enabled while entity state is active
→ continuous read can be correct

living spark UV changes whenever entity health changes
→ usually wrong ownership
```

## 7. `context.*` is not a generic scratch namespace

`context.*` / `c.*` values are supplied by the host. Treat them as read-only contextual data, not as authored persistent storage.

Do not invent `context.foo` fields unless the owning system documents them.

## 8. Null-coalescing

Molang supports `??` for null/missing references in supported contexts.

Conceptual form:

```text
optional_reference_or_value ?? fallback
```

Use it when absence is legitimate. Do not use it to hide a required host/query mismatch.

## 9. Actor references and `->`

The `->` operator dereferences an actor/reference before reading state.

Particle-specific caution:
- standalone particle effects may not have the actor reference you expect;
- fire-and-forget effects can outlive the entity context that created them;
- child effects may change ownership/binding depending on event relationship type.

If the effect only needs one entity value at spawn time, pre-effect sampling is usually safer than continuous actor dereference.

## 10. Entity-dependent particle behavior

Good uses:
- choose effect variant before spawn;
- activate/deactivate an attached emitter;
- pass a color or scale scalar through `pre_effect_script` / `pre_effect_expression`;
- read stable entity configuration while the effect remains bound.

Risky uses:
- continuously drive every living particle class from changing entity state;
- assume entity queries remain valid after detachment;
- duplicate animation-controller state logic inside particle JSON;
- use generic entity queries where particle age/random already owns the requirement.

## 11. Client-side versus behavior-side context

Some query documentation distinguishes where the query is meaningful (for example client-only behavior or behavior-pack fallback behavior).

Particle Reference Authoring is resource-pack/client-side oriented, but still must respect the query's documented host restrictions.

Do not conclude:

```text
query works somewhere in client content
→ query works in every particle expression
```

## 12. Query cost and duplication

**HEURISTIC**

Keep external reads minimal. Repeating the same query through size, tint, motion, UV, and events increases both cognitive and possible runtime cost.

Prefer:

```text
one clear external-state decision
→ reused variable / curve / child effect class
```

rather than duplicating the same host query everywhere.

## 13. Snowstorm / Wintersky boundary

Snowstorm can parse/preview many Molang expressions, but editor support is not authoritative for host query availability.

If Snowstorm and Minecraft differ:
1. confirm query syntax;
2. confirm query minimum version;
3. confirm host context;
4. reduce to one constant-output expression;
5. compare target runtime;
6. classify editor mismatch separately.

## 14. Validation checklist

```text
[ ] specific query is documented for the intended host/context
[ ] minimum format/content version is satisfied when documented
[ ] changing query is not accidentally used as stable particle identity
[ ] actor/reference lifetime is sufficient for continuous reads
[ ] optional values use fallback only when absence is valid
[ ] context.* field is actually supplied by the host
[ ] particle-local behavior uses particle-owned state where possible
[ ] query logic is not duplicated across many per-frame fields
[ ] Snowstorm parser/preview support is not being mistaken for runtime support
```

## Sources

- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/syntax-guide?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/reference/content/molangreference/examples/molangconcepts/queryfunctions?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/molang/practical-molang?view=minecraft-bedrock-stable
