# Particle Reference Workflow

## Canonical execution flow

```text
USER REQUEST / REFERENCE
→ NORMALIZE INTENT
→ CLASSIFY EXECUTION: DIRECT / COMPOSED / REACTIVE / AUDIT-REVISION
→ SELECT MINIMAL PHYSICAL PATTERN
→ CHOOSE LOWEST VIABLE COMPLEXITY TIER
→ RESOLVE OUTPUT IDENTITY
→ LOAD MINIMUM KNOWLEDGE BUNDLE
→ DECOMPOSE ONLY IF PHYSICALLY NECESSARY
→ AUTHOR JSON + TEXTURE ASSETS
→ RUN ONLY RELEVANT STATIC QA GATES
→ ASSEMBLE DETERMINISTIC CLEAN PACKAGE
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

## 2. Automatic physical-pattern routing

Before deep knowledge loading, select the smallest starting family from `patterns.md`.

Examples:

```text
api / flame          → Flame
spark / ember        → Sparks
asap / smoke         → Rising smoke/plume
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

This mapping is a routing hint, not a hard template. User-specified motion, scale, attachment, material, or style overrides keyword routing.

Pattern selection should answer only the physical starting questions:
- dominant spawn region;
- dominant motion/force;
- lifetime envelope;
- render role;
- whether a second materially different role is needed.

Do not choose exact numeric values from the pattern itself.

## 3. Fast path for ordinary text requests

A short request such as:

```text
"buat particle api biru"
```

should normally resolve in one planning pass:

```text
intent            = blue flame
execution_class   = DIRECT
pattern           = Flame
complexity        = lowest viable tier
physics role      = buoyant/upward flame
texture strategy  = simple static or minimal flipbook only if needed
Molang            = only age/random progression required for natural variation
output identity   = one normalized slug drives identifier/files/README
Snowstorm rules   = only if Snowstorm is a target
QA                = document + texture + relevant motion/render checks
```

Do not create multiple emitters, event graphs, curves, atlas systems, or advanced Molang unless the requested visual behavior requires them.

## 4. Resolve output identity once

Before authoring filenames, establish:

```text
namespace
package_slug
effect_slug
root identifier
child role slugs, if any
texture basename/shared mapping
delivery mode: standalone Resource Pack or downstream handoff
```

Then derive all package names/paths from that identity. Do not rename files independently during packaging.

Example:

```text
mivubi:blue_flame
→ particles/blue_flame.particle.json
→ textures/particle/blue_flame.png
→ textures/particle/blue_flame
```

For composed effects, suffixes describe physical roles (`_debris`, `_plume`, `_flash`), never revisions.

## 5. Decompose once

Perform one physical/visual decomposition before authoring.

Split only when layers differ materially in:
- physics;
- timing;
- spawn region;
- material/render behavior;
- texture class;
- event/attachment ownership.

Use pattern composition sparingly:

```text
blue flame
→ Flame only

campfire with embers
→ Flame + Sparks

volcanic eruption
→ Ballistic debris + Rising smoke/plume

magic explosion
→ Impact timing + Magic energy, optional shockwave only if requested
```

After decomposition, do not repeatedly redesign architecture while authoring unless a contradiction is discovered.

## 6. Choose the knowledge bundle after pattern selection

Start from the owner implied by the selected physical problem.

Examples:

```text
spawn/lifetime dominated
→ emitter.md

trajectory dominated
→ motion.md

custom ring/cone/fan
→ emitter-shape-math.md

texture-driven effect
→ texture-authoring.md

age progression
→ molang.md or curves.md only when actually needed

entity-attached effect
→ entity-integration.md

event/contact reactive
→ events.md / collision-advanced.md
```

Add secondary owners only when the execution packet shows a real cross-domain dependency.

Do not browse knowledge speculatively.

## 7. Author the simplest valid representation

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

## 8. Texture execution

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

Do not duplicate identical PNGs solely to mirror child particle filenames.

## 9. Molang execution

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

## 10. Single-pass static QA

Near finalization, run `qa.md` once using only applicable gates.

Examples:
- no Snowstorm target → skip Snowstorm gates;
- no events → skip event graph checks;
- no collision → skip collision checks;
- no atlas/flipbook → skip those checks;
- no entity attachment → skip locator/transform checks.

Do not repeatedly rerun unrelated QA after a small revision. Re-run the causal gate plus package-integrity checks.

## 11. Deterministic package assembly

Use `delivery.md` only after resource identity and graph are stable.

Assembly order:

```text
1. confirm root/main identifier
2. confirm child identifiers/references
3. confirm texture references and PNG mappings
4. write/generate one Resource Pack manifest
5. add only required resource files
6. add concise README for standalone delivery
7. include REFERENCE.json only for explicit downstream handoff
8. verify package root shape and remove scratch/orphan files
```

Packaging must not invent new names, duplicate textures, or introduce version suffixes.

A standalone ZIP should open directly onto the Resource Pack root containing `manifest.json`; avoid accidental double-wrapper folders.

## 12. Snowstorm round-trip only when relevant

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

## 13. Revision policy

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

Preserve approved layers, selected physical families, output identity, and package structure unless they are causally involved.

## 14. Stop rule

Stop expanding the design when:
- requested visual roles are represented;
- the selected physical pattern(s) explain the effect coherently;
- identifiers/paths/resource graph are coherent;
- relevant static QA is complete;
- clean package contract is satisfied;
- remaining uncertainty is visual/runtime-only.

At that point hand off to user review instead of consuming more context or adding speculative complexity.
