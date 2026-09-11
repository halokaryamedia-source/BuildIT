# Particle Reference Workflow

## Canonical execution flow

```text
USER REQUEST / REFERENCE
→ NORMALIZE INTENT
→ CLASSIFY EXECUTION: DIRECT / COMPOSED / REACTIVE / AUDIT-REVISION
→ CHOOSE LOWEST VIABLE COMPLEXITY TIER
→ LOAD MINIMUM KNOWLEDGE BUNDLE
→ DECOMPOSE ONLY IF PHYSICALLY NECESSARY
→ AUTHOR JSON + TEXTURE ASSETS
→ RUN ONLY RELEVANT STATIC QA GATES
→ CLEAN PACKAGE
→ USER REVIEW IN TARGET ENVIRONMENT
→ TARGETED REVISION OR APPROVAL
→ OPTIONAL CODEX / MCP HANDOFF
```

The workflow optimizes for the fewest decisions, reads, and authoring passes that still preserve quality.

## 1. Requirement gate

Use `authoring-spec.md` to resolve only decision-changing unknowns.

If no BLOCKING ambiguity exists, do not stop for confirmation. Record reversible unknowns as provisional internal choices and proceed.

The target must be explicit internally:

```text
Bedrock runtime
Snowstorm preview
both
```

Do not load Snowstorm-specific knowledge when Snowstorm is irrelevant.

## 2. Fast path for ordinary text requests

A short request such as:

```text
"buat particle api biru"
```

should normally resolve in one planning pass:

```text
intent            = blue flame
execution_class   = DIRECT
complexity        = lowest viable tier
physics role      = buoyant/upward flame
texture strategy  = simple static or minimal flipbook only if needed
Molang            = only age/random progression required for natural variation
Snowstorm rules   = only if Snowstorm is a target
QA                = document + texture + relevant motion/render checks
```

Do not create multiple emitters, event graphs, curves, atlas systems, or advanced Molang unless the requested visual behavior requires them.

## 3. Decompose once

Perform one physical/visual decomposition before authoring.

Split only when layers differ materially in:
- physics;
- timing;
- spawn region;
- material/render behavior;
- texture class;
- event/attachment ownership.

After decomposition, do not repeatedly redesign architecture while authoring unless a contradiction is discovered.

## 4. Choose the knowledge bundle before deep reading

Start from one primary owner.

Examples:

```text
spawn/lifetime effect
→ emitter.md

trajectory
→ motion.md

texture-driven effect
→ texture-authoring.md

Molang-driven behavior
→ molang.md OR molang-language-math.md

entity-attached effect
→ entity-integration.md

event-driven effect
→ events.md
```

Add secondary owners only when the execution packet shows a real cross-domain dependency.

Do not browse knowledge speculatively.

## 5. Author the simplest valid representation

Preference order:

```text
constant
→ simple stable Molang
→ curve / atlas / flipbook
→ multiple effect layers
→ events / reactive architecture
```

Use the first level that satisfies the requested behavior cleanly.

### Motion

Author from intended physical cause:

```text
spawn position
→ launch direction
→ launch magnitude
→ acceleration / gravity / drag
→ lifetime
```

Do not use sustained acceleration to fake missing initial impulse unless sustained acceleration is the intended behavior.

### Particle identity

Persistent living-particle decisions belong to particle-owned state:

```text
particle_random_N
particle_age
particle_lifetime
```

Emitter age belongs to emitter timing unless synchronized living-particle changes are explicitly desired.

### Snowstorm launch compatibility

When Snowstorm/Wintersky preview is a target and launch magnitude must remain predictable:

```text
shape.direction = launch vector
particle_initial_speed = scalar magnitude
```

Treat this as editor-targeted compatibility guidance, not generic Bedrock syntax law.

## 6. Texture execution

Do not invoke the whole texture stack automatically.

```text
static sprite
→ texture-authoring.md

resolution/downscale issue
→ + texture-resolution-sampling.md

halo/bleed issue
→ + texture-filtering-bleeding.md

blend/additive/alpha design issue
→ + texture-color-science.md
```

Prefer one production texture over an atlas when only one sprite is needed. Prefer an atlas/flipbook only when it reduces complexity or is visually required.

## 7. Molang execution

Do not add Molang unless behavior needs variation/progression/reactivity.

```text
no changing behavior
→ constants

stable variation
→ particle_random_N

lifetime progression
→ normalized particle age + simple expression/easing/curve

external/entity reactivity
→ query/context only in a verified host
```

If a formula becomes hard to audit, prefer a curve or smaller staged expression rather than expanding nested math indefinitely.

## 8. Single-pass static QA

Near finalization, run `qa.md` once using only applicable gates.

Examples:
- no Snowstorm target → skip Snowstorm gates;
- no events → skip event graph checks;
- no collision → skip collision checks;
- no atlas/flipbook → skip those checks;
- no entity attachment → skip locator/transform checks.

Do not repeatedly rerun unrelated QA after a small revision. Re-run the causal gate plus package-integrity checks.

## 9. Snowstorm round-trip only when relevant

For advanced/external JSON actually edited through Snowstorm:

```text
preserve original
→ import
→ edit
→ export
→ structural diff
→ target-schema review
```

Do not require this for assets never round-tripped through Snowstorm.

## 10. Revision policy

User feedback changes only the causal layer by default:

```text
trajectory             → motion
spawn density          → rate/lifetime/cap
silhouette             → decomposition/spawn/size
texture look           → texture asset
halo/bleed             → alpha/hidden RGB/gutter
flicker/class switching→ state ownership
color/brightness       → tint/material/texture color
wrong timing           → event/lifetime owner
editor mismatch        → Snowstorm compatibility/version
```

Preserve approved layers and package structure unless they are causally involved.

## 11. Stop rule

Stop expanding the design when:
- requested visual roles are represented;
- the JSON/texture package is structurally coherent;
- relevant static QA is complete;
- remaining uncertainty is visual/runtime-only.

At that point hand off to user review instead of consuming more context or adding speculative complexity.
