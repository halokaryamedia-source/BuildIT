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
→ ARTIFACT READY FOR USER REVIEW
→ PACKAGE ONLY IF EXPLICITLY REQUESTED OR UNAMBIGUOUSLY PART OF THE REQUEST
→ TARGETED REVISION OR APPROVAL
→ OPTIONAL CODEX / MCP HANDOFF
```

The workflow optimizes for the fewest decisions, reads, and authoring passes that still preserve quality.

## 1. Requirement gate

Use `authoring-spec.md` to resolve only decision-changing unknowns.

If no BLOCKING ambiguity exists, do not stop for ceremonial confirmation. Record reversible unknowns as provisional internal choices and proceed.

The target must be explicit internally:

```text
Bedrock runtime
Snowstorm preview
both
```

Do not load Snowstorm-specific knowledge when Snowstorm is irrelevant.

## 2. Automatic physical-pattern routing

`patterns.md` is the single owner for the complete physical starting-pattern map. Use it before deep knowledge loading.

Examples only:

```text
api / flame   → Flame
asap / smoke  → Rising smoke/plume
explosion     → composed candidate family; keep only roles actually required
```

User-specified motion, scale, attachment, material, or style overrides keyword routing. Do not copy numeric values from a pattern.

Pattern selection answers only:
- dominant spawn region;
- dominant motion/force;
- lifetime envelope;
- render role;
- whether another materially different role is required.

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
output identity   = one normalized slug drives identifier/resource names
Snowstorm rules   = only if Snowstorm is a target
QA                = document + texture + relevant motion/render checks
```

Do not create multiple emitters, event graphs, curves, atlas systems, or advanced Molang unless the requested visual behavior requires them.

## 4. Resolve output identity once

Before authoring filenames, establish:

```text
namespace
package_slug / working asset slug
effect_slug
root identifier
child role slugs, if any
texture basename/shared mapping
delivery intent: authored artifact only / standalone Resource Pack / downstream handoff
```

The first-pass authoring path does not assume a Resource Pack ZIP is requested.

Derive resource names from one identity. Do not rename files independently during packaging.

Example:

```text
mivubi:blue_flame
→ particles/blue_flame.particle.json
→ textures/particle/blue_flame.png
→ textures/particle/blue_flame
```

For composed effects, suffixes describe physical roles (`_debris`, `_plume`, `_flash`), never revisions.

## 5. Decompose once

Split only when layers differ materially in:
- physics;
- timing;
- spawn region;
- material/render behavior;
- texture class;
- event/attachment ownership.

Use pattern composition sparingly. After decomposition, do not repeatedly redesign architecture while authoring unless a contradiction is discovered.

## 6. Choose the knowledge bundle after pattern selection

Start from the causal owner implied by the selected physical problem.

```text
spawn/lifetime dominated → emitter.md
trajectory dominated     → motion.md
custom ring/cone/fan      → emitter-shape-math.md
texture-driven effect     → texture-authoring.md
age progression           → molang.md or curves.md only when needed
entity-attached effect    → entity-integration.md
event/contact reactive    → events.md / collision-advanced.md
```

Add secondary owners only when the execution packet shows a real cross-domain dependency. Do not browse knowledge speculatively.

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

Load only the texture owner needed by the actual problem:

```text
static sprite              → texture-authoring.md
resolution/downscale issue → + texture-resolution-sampling.md
halo/bleed issue           → + texture-filtering-bleeding.md
blend/additive/alpha       → + texture-color-science.md
```

Prefer one production texture over an atlas when one sprite is enough. Do not duplicate identical PNGs solely to mirror child particle filenames.

## 9. Molang execution

Do not add Molang unless behavior needs variation, progression, or reactivity.

```text
no changing behavior       → constants
stable variation           → particle_random_N
lifetime progression       → normalized particle age + simple expression/easing/curve
external/entity reactivity → query/context only in a verified host
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

After a bounded revision, rerun the causal gate plus package-integrity checks only when a package exists.

## 11. Delivery/package gate

A validated particle artifact and a delivered Resource Pack are separate states.

```text
particle JSON/texture authored + relevant QA complete
→ artifact ready for review

package explicitly requested or unambiguously part of the current request
→ load delivery.md
→ assemble deterministic package

package not requested
→ do not create manifest/README/ZIP/REFERENCE.json merely to complete a template
→ stop at the reviewed authored artifact
```

When packaging is requested, `delivery.md` exclusively owns exact manifest, naming, texture-path, ZIP-root, README, and optional `REFERENCE.json` rules.

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
trajectory              → motion
spawn density           → rate/lifetime/cap
silhouette              → decomposition/spawn/size
texture look            → texture asset
halo/bleed              → alpha/hidden RGB/gutter
flicker/class switching → state ownership
color/brightness        → tint/material/texture color
wrong timing            → event/lifetime owner
editor mismatch         → Snowstorm compatibility/version
```

Preserve approved layers, selected physical families, and output identity unless causally involved.

## 14. Stop rule

Stop expanding the design when:
- requested visual roles are represented;
- the selected physical pattern(s) explain the effect coherently;
- identifiers/paths/resource graph are coherent;
- relevant static QA is complete;
- any explicitly requested package satisfies `delivery.md`;
- remaining uncertainty is visual/runtime-only.

At that point hand off to user review instead of consuming more context or adding speculative complexity.
