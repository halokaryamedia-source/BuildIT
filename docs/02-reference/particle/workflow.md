# Particle Reference Workflow

## Canonical flow

```text
USER REQUEST / REFERENCE
→ REQUIREMENT GATE
→ NORMALIZED PARTICLE BRIEF
→ PHYSICAL / VISUAL DECOMPOSITION
→ AUTHOR PARTICLE JSON + TEXTURES
→ STATIC QA
→ SNOWSTORM COMPATIBILITY QA
→ MOTION / BUNDLE / ATLAS / SPATIAL / READABILITY / BUDGET PREFLIGHT
→ CLEAN PACKAGE
→ USER REVIEW IN SNOWSTORM / MINECRAFT
→ TARGETED REVISION OR APPROVAL
→ OPTIONAL CODEX / MCP HANDOFF
```

## 1. Requirement gate

Resolve only decision-changing unknowns. Do not turn a particle request into a questionnaire.

## 2. Decompose by physical function

Prefer one emitter per materially distinct physics role. Avoid monolithic emitters when layers have different launch direction, drag, gravity, lifetime, spatial role, or texture class.

## 3. Author motion from impulse first

For eruptive or ballistic motion:

```text
launch direction + scalar initial speed
→ momentum
→ gravity / drag / small acceleration shape the path
```

Do not use positive acceleration as a substitute for missing launch impulse.

## 4. Keep particle class stable

Use particle-owned values for persistent class decisions:

```text
variable.particle_random_1..4
variable.particle_age
variable.particle_lifetime
```

Use emitter age for emitter-level timing, not for switching a living particle between motion/UV/size/tint classes mid-life.

## 5. Author textures as production assets

Use real RGBA transparency. Do not crop production sprites from presentation sheets. Normalize visible bounds, keep safe gutters, and make atlas class mapping intentional.

## 6. Design around the environment

Existing blocks/models may supply part of the effect silhouette. Use spawn regions, keep-out zones, and lateral/upward motion to avoid wasting particles inside known occluding geometry.

## 7. Validate before packaging

Run `qa.md` in order. Static checks are advisory where the rule is heuristic; never convert them into false visual/runtime proof.

## 8. Deliver cleanly

Follow `delivery.md`. Final user-facing packages contain only required production files and concise usage notes.

## 9. Revise causally

When user review finds a problem, change only the causal layer:

```text
wrong trajectory → motion parameters
wrong density → spawn/lifetime/budget
wrong silhouette → decomposition/spawn region/size
wrong sprite → texture/atlas
flicker/class switching → ownership expressions
```

Do not regenerate unrelated layers by default.
