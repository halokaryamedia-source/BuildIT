# Particle Reference Workflow

## Canonical flow

```text
USER REQUEST / REFERENCE
→ REQUIREMENT GATE
→ NORMALIZED PARTICLE BRIEF
→ PHYSICAL / VISUAL DECOMPOSITION
→ AUTHOR PARTICLE JSON + TEXTURES
→ BEDROCK STATIC QA
→ TARGET-SPECIFIC QA ONLY WHEN RELEVANT
   └─ Snowstorm/Wintersky compatibility + release check when Snowstorm is a target
→ MOTION / BUNDLE / ATLAS / SPATIAL / READABILITY / BUDGET PREFLIGHT AS NEEDED
→ CLEAN PACKAGE
→ USER REVIEW IN TARGET ENVIRONMENT
→ TARGETED REVISION OR APPROVAL
→ OPTIONAL CODEX / MCP HANDOFF
```

## 1. Requirement gate

Resolve only decision-changing unknowns. Do not turn a particle request into a questionnaire.

The normalized brief should identify the target explicitly:

```text
Bedrock runtime
Snowstorm preview
both
```

Do not load or run Snowstorm-specific knowledge when Snowstorm is irrelevant to the request.

## 2. Decompose by physical function

Prefer one emitter per materially distinct physics role. Avoid monolithic emitters when layers have different launch direction, drag, gravity, lifetime, spatial role, render behavior, or texture class.

## 3. Author motion from the intended physical cause

For eruptive or ballistic motion, establish launch impulse before using acceleration/drag to shape the path.

Conceptually:

```text
launch direction + launch magnitude
→ initial velocity
→ gravity / drag / bounded acceleration shape the trajectory
```

When Snowstorm/Wintersky preview fidelity is a target and authored launch magnitude matters, prefer the compatibility pattern:

```text
emitter shape direction = launch vector
minecraft:particle_initial_speed = scalar magnitude
```

This is a Snowstorm-targeted compatibility pattern, not a generic prohibition on Bedrock vector forms.

Do not use positive acceleration as a substitute for missing launch impulse unless sustained acceleration is the actual intended behavior.

## 4. Keep particle class stable

Use particle-owned values for persistent living-particle decisions:

```text
variable.particle_random_1..4
variable.particle_age
variable.particle_lifetime
```

Use emitter age for emitter-level timing, not for switching a living particle between motion/UV/size/tint classes mid-life unless synchronized switching is explicitly intended.

## 5. Author textures as production assets

Use real RGBA transparency. Do not crop production sprites from presentation sheets. Normalize visible bounds, keep safe gutters, and make atlas/flipbook mapping intentional.

Load only the texture knowledge needed by the task:

```text
basic PNG / atlas / UV / flipbook
→ texture-authoring.md

resolution / resampling / frame stability
→ texture-resolution-sampling.md

halo / bleed / hidden RGB
→ texture-filtering-bleeding.md

alpha / value / blend / additive color behavior
→ texture-color-science.md
```

## 6. Design around the environment only when relevant

Existing blocks/models may supply part of the effect silhouette. When environment geometry is known, use spawn regions, keep-out zones, and lateral/upward motion to avoid wasting particles inside known occluding geometry.

Do not invent hidden geometry when none is provided.

## 7. Validate before packaging

Run `qa.md` in order, but skip conditional gates that do not apply to the target or effect.

Examples:
- no Snowstorm target → skip Snowstorm compatibility/release checks;
- no atlas/flipbook → skip atlas-specific checks;
- no collision → skip collision-specific checks;
- no entity attachment → skip locator/transform checks.

Static checks are advisory where the rule is heuristic; never convert them into false visual/runtime proof.

## 8. Snowstorm round-trip only when Snowstorm edits are involved

For externally authored advanced JSON or high-value assets edited through Snowstorm:

```text
preserve original JSON
→ import
→ edit
→ export
→ structural diff
→ target Bedrock schema review
```

Do not require this round trip for a package that was never imported/exported through Snowstorm.

## 9. Deliver cleanly

Follow `delivery.md`. Final user-facing packages contain only required production files and concise usage notes.

## 10. Revise causally

When user review finds a problem, change only the causal layer:

```text
wrong trajectory        → motion parameters
wrong density           → spawn / lifetime / budget
wrong silhouette        → decomposition / spawn region / size
wrong sprite            → texture / atlas
halo / bleed            → source alpha / hidden RGB / gutter
flicker/class switching → ownership expressions
wrong event timing      → event owner / timeline
editor-only mismatch    → Snowstorm compatibility/version diagnosis
```

Do not regenerate unrelated layers by default.
