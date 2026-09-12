# Pixel Art Context Efficiency

## Goal

Keep authoring quality high while minimizing unnecessary context and repeated analysis.

## Loading rule

Default:

```text
SKILL
+ one artifact/causal owner
+ QA only near finalization
```

Add one secondary owner only when the current decision crosses a real dependency.

Examples:

```text
simple icon
→ Skill + iconography

Minecraft icon
→ Skill + iconography + minecraft-compatibility

reference object conversion
→ Skill + reference-conversion + object-prop

palette correction
→ Skill + palette-material

series drift
→ Skill + style-lock
```

## Avoid

- loading the entire Pixel Art corpus for a small icon;
- rereading the same style profile after every edit;
- running full QA after each pixel change;
- loading Texturing implementation rules before an actual mapped-texture handoff;
- loading Particle semantics merely because the asset will later be used by a particle.

## State reuse

Reuse fresh:

```text
artifact classification
target mode
canvas/grid
Style Lock
palette roles
reference identity constraints
latest QA verdict
```

Refresh only state invalidated by a material revision.

## Correction economy

One visible cause → one coherent patch → affected QA gates.

Do not generate repeated speculative variants when a bounded correction can address the defect.