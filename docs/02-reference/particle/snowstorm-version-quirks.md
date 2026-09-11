# Snowstorm / Wintersky Version and Preview Quirks

This file owns version-aware Snowstorm/Wintersky compatibility notes. Generic Snowstorm positioning belongs in `snowstorm.md`; Bedrock validity belongs to Bedrock knowledge files.

## Evidence classes

- **SNOWSTORM / WINTERSKY** — editor/preview-specific behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — bounded compatibility guidance.

## 1. Version awareness

Snowstorm is an editor/preview environment, not the Bedrock runtime specification. Its feature support and preview behavior can change by release.

Therefore every editor-specific diagnosis should conceptually record:

```text
Snowstorm version / release family
Wintersky version if known
Bedrock target version
specific component/expression involved
whether Minecraft runtime reproduces the issue
```

Do not universalize an editor quirk without reproduction.

## 2. Release-driven capability growth

Snowstorm releases have added or improved areas such as:
- Quick Setup;
- event authoring/preview;
- nested effects;
- texture editing;
- additive materials;
- Molang handling;
- preview fixes.

A missing or incorrect preview in an older version may be fixed in a newer release without any JSON change.

## 3. Compatibility triage

When Snowstorm disagrees with expectation, classify the problem in this order:

```text
A. invalid Bedrock document
B. valid Bedrock but unsupported/partial editor feature
C. editor regression/bug
D. authored logic valid but visually poor
E. Minecraft-runtime-specific behavior
```

Do not jump directly from "Snowstorm looks wrong" to "particle JSON is invalid".

## 4. Vector initial-speed compatibility finding

**EMPIRICALLY VERIFIED / SNOWSTORM-WINTERSKY-SPECIFIC**

Project testing found a target-specific compatibility risk where vector-form `minecraft:particle_initial_speed` did not preserve intended authored speed magnitude in the Snowstorm/Wintersky path.

For Snowstorm-facing authoring where launch magnitude matters, preferred pattern:

```text
emitter shape direction = launch vector
particle_initial_speed = scalar magnitude
```

This is not a generic Bedrock syntax prohibition. Bedrock validity and Snowstorm compatibility remain separate.

## 5. Emitter-age instability finding

**EMPIRICALLY VERIFIED**

Per-frame living-particle properties driven by emitter age can produce synchronized reclassification/popping because emitter age continues globally while each particle has its own local lifetime.

Affected classes commonly include:
- motion;
- billboard size/UV;
- tint/alpha.

This is fundamentally an ownership issue and can become especially visible in editor preview.

Prefer particle-owned random/age/lifetime for persistent living-particle identity.

## 6. Nested effect preview

Snowstorm support for nested/event-driven effects has evolved. If child effects do not preview correctly:
- confirm referenced identifiers and bundle files;
- reduce to one parent/one child;
- remove timing complexity;
- test relationship type;
- compare against Minecraft;
- inspect release notes before redesigning the effect.

## 7. Texture editor boundary

Snowstorm texture editing is convenient for iteration, but production texture authority still belongs to the actual exported PNG/atlas.

Check exported assets for:
- true RGBA transparency;
- exact dimensions;
- atlas gutters;
- no editor-only placeholder/background artifacts;
- correct path referenced by particle JSON.

## 8. Material preview differences

Blend/additive/alpha appearance may not be visually identical across editor preview, Minecraft runtime, GPU/driver, and scene background.

When a material looks wrong:
1. verify the material string;
2. verify source alpha/RGB;
3. test simple single-sprite content;
4. compare bright and dark backgrounds;
5. compare Minecraft before changing the core asset.

## 9. Molang support differences

Snowstorm can parse/preview many Molang expressions, but generic Molang language support does not guarantee every query/context is meaningful in every editor preview host.

For suspicious expressions:
- replace with constants first;
- restore one dependency at a time;
- distinguish parser acceptance from correct runtime context;
- avoid relying on editor-only variables unless explicitly documented.

## 10. Quick Setup caution

Quick Setup is useful for bootstrap values, not immutable authoring truth.

After Quick Setup:
- inspect emitted component JSON;
- verify ownership and units;
- remove unnecessary components;
- confirm direction/speed behavior;
- run the same QA as manually authored content.

## 11. Version-specific bug notebook rule

Do not put transient editor bugs into generic `fundamentals.md`.

Record them here with:

```text
symptom
release/version
minimal reproduction
workaround
Minecraft comparison
status: open / fixed / unknown
```

Only promote a behavior into durable general guidance if reproduced and still relevant across current versions.

## 12. Preview isolation strategy

For editor-only anomalies build a minimal reproduction:

```text
1 effect
1 emitter
1 particle class
1 texture
constant lifetime
constant size
constant direction/speed
no child effects
no curves
no complex Molang
```

Then reintroduce one feature at a time.

This is the fastest way to distinguish a rendering/editor issue from authored-system complexity.

## 13. QA checklist

```text
[ ] Snowstorm version recorded when diagnosing a preview quirk
[ ] Bedrock validity checked independently
[ ] minimal reproduction attempted for editor-only anomaly
[ ] scalar-speed compatibility rule used only as Snowstorm-targeted guidance
[ ] nested effects compared in Minecraft when preview is ambiguous
[ ] texture export inspected outside editor UI
[ ] Molang parser success not treated as proof of correct context semantics
[ ] resolved editor bug is not kept as a permanent generic restriction
```

## Sources

- https://github.com/JannisX11/snowstorm/releases
- https://github.com/JannisX11/snowstorm
- https://learn.microsoft.com/en-us/minecraft/creator/documents/particleeffects?view=minecraft-bedrock-stable
