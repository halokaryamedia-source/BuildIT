# Snowstorm / Wintersky Version and Preview Quirks

This file owns version-specific Snowstorm/Wintersky anomalies and regression history. Generic editor behavior belongs in `snowstorm.md`; release capability history belongs in `snowstorm-compatibility-matrix.md`; Bedrock validity belongs to Bedrock knowledge owners.

## Evidence classes

- **SNOWSTORM / WINTERSKY** — release/source-documented editor or renderer behavior.
- **EMPIRICALLY VERIFIED** — reproduced project behavior.
- **HEURISTIC** — bounded compatibility guidance.

## Diagnosis record

For every editor-specific anomaly capture:

```text
Snowstorm version
Wintersky version if known
Bedrock target version
web app or VS Code
component / expression / material involved
minimal reproduction
Minecraft parity: yes / no / unknown
status: open / fixed / unknown
```

Do not universalize an editor quirk without reproduction.

## Current release boundary

Latest reviewed published release:

```text
Snowstorm 3.2.1
Wintersky 1.3.3
```

Snowstorm source `master` currently reports package version `3.2.2`, but source-head metadata is not a published-release guarantee.

## Known fixed event/timing regressions

### Snowstorm 3.2.0 / Wintersky 1.3.2

Fixed:
- only the first of multiple events at the same timeline point firing;
- VS Code tick throttling causing very slow particle preview in some tabs;
- event-timeline description issues.

### Snowstorm 3.2.1 / Wintersky 1.3.3

Fixed:
- `On Expiration` events firing when playback restarted from the beginning;
- timeline events with certain time codes firing inconsistently;
- collision-event `min_speed` not correctly affecting behavior.

Authoring rule:

```text
timing/event bug on old editor
→ check compatibility matrix first
→ upgrade/reproduce
→ only then alter authored event graph
```

## Known fixed export/import regressions

Release history proves editor round-trip bugs have existed:

```text
3.0.0
→ fixed unspecified max_lifetime resetting on import

3.1.0
→ fixed num_particles = 0 being deleted on export

3.2.0
→ fixed size fields = 0 being omitted on export
→ fixed multiline expiration-block input not exporting as list
→ fixed default particle texture being saved to pack without internal edits
```

Therefore never assume:

```text
Snowstorm import + save
= semantic no-op
```

For advanced authored JSON, structural diff before/after export is the safe rule.

## Molang regressions/fixes

Known release-level changes:

```text
3.0.0
→ fixed Molang expressions combined with curves returning 0

3.1.0
→ fixed nested-scope execution
→ added variable placeholders for undefined/game-only variables

3.2.0
→ fixed operations with negative numbers

3.2.1
→ added math.min_angle support
→ event-related undefined-variable detection
→ fixed camera_distance_range_lerp preview behavior
```

A variable placeholder is editor preview input, not runtime query proof.

## Texture / gradient / material regressions

Known fixed areas:

```text
3.2.0
→ gradient point/state editing fixes
→ color selector fixes

3.2.1
→ gradient hue/alpha edits correctly register
→ black pixels with additive materials fixed
```

If an old editor shows additive black pixels or gradient edits do not persist, do not alter a correct source texture as the first response.

## Preview loop behavior

Snowstorm 3.2.0 changed preview loop mode default from Loop to Auto.

Therefore a timing comparison must record preview loop mode when the effect appears to restart, sleep, or expire differently from expectation.

## Vector initial-speed compatibility finding

**EMPIRICALLY VERIFIED / TARGET-SPECIFIC**

Project authoring reproduced a compatibility risk where vector-form `minecraft:particle_initial_speed` did not preserve intended launch magnitude in Snowstorm/Wintersky preview.

Preferred Snowstorm-facing pattern when magnitude matters:

```text
emitter shape direction = launch vector
particle_initial_speed  = scalar magnitude
```

This is not a generic Bedrock syntax restriction.

## Emitter-age instability finding

**EMPIRICALLY VERIFIED**

Using emitter age inside living-particle motion/UV/size/tint class decisions can cause synchronized reclassification because the emitter clock is shared while particles have independent birth times.

Prefer particle-owned state for persistent identity:

```text
particle_random_1..4
particle_age
particle_lifetime
```

This is an ownership defect, not a Snowstorm-only parser bug, though preview makes it easy to observe.

## Unsupported / partial editor field rule

Current Snowstorm source explicitly tracks some event-related imported structures in `unsupported_fields`. This means successful import does not prove every advanced field has a complete editor representation.

When using externally authored or future-version JSON:

```text
preserve original
→ import
→ inspect code preview
→ edit minimally
→ export
→ structural diff
```

Never use Snowstorm as an implicit schema migrator.

## Nested effect preview

Nested/event preview support has evolved since 3.0.0. If a child effect is missing or mistimed:

```text
child effect valid alone?
→ identifier/path resolves?
→ parent event exists?
→ relationship type correct?
→ timing owner correct?
→ editor release affected by known event bug?
→ one-parent/one-child reproduction
→ Minecraft comparison if still ambiguous
```

## Material preview differences

Blend/additive/alpha appearance may differ between:
- Snowstorm/Wintersky;
- Minecraft runtime;
- scene background;
- GPU/driver.

Diagnosis order:

```text
material string
→ source PNG RGB/alpha
→ simple one-sprite preview
→ editor version known bug
→ Minecraft comparison
```

## Minimal reproduction

For editor anomalies reduce to:

```text
1 effect
1 emitter
1 particle class
1 texture
constant lifetime
constant size
constant direction/speed
no child effects unless testing events
no curves unless testing curves
no unrelated Molang
```

Reintroduce one feature at a time.

## Compatibility triage

Classify Snowstorm disagreement as one of:

```text
A. invalid Bedrock document
B. valid Bedrock but editor field/support gap
C. Snowstorm UI/import/export bug
D. Wintersky renderer/preview bug
E. MolangJS/parser/evaluator issue
F. authored logic is valid but visually poor
G. Minecraft-runtime-specific behavior
```

Do not collapse these into one category.

## QA checklist

```text
[ ] exact Snowstorm release recorded
[ ] Wintersky version recorded when renderer/events matter
[ ] web vs VS Code workflow recorded when path/tick behavior matters
[ ] Bedrock validity checked independently
[ ] known release fixes checked before adding workaround
[ ] imported/exported advanced JSON diffed when preservation matters
[ ] meaningful zeros/false/omissions preserved
[ ] Molang parser success not treated as context proof
[ ] minimal reproduction used for editor-only anomaly
[ ] resolved old bug not kept as permanent generic restriction
```

## Sources

- https://github.com/JannisX11/snowstorm/releases/tag/v3.0.0
- https://github.com/JannisX11/snowstorm/releases/tag/v3.1.0
- https://github.com/JannisX11/snowstorm/releases/tag/v3.2.0
- https://github.com/JannisX11/snowstorm/releases/tag/v3.2.1
- https://github.com/JannisX11/wintersky/releases/tag/v1.3.0
- https://github.com/JannisX11/wintersky/releases/tag/v1.3.2
- https://github.com/JannisX11/wintersky/releases/tag/v1.3.3
- https://github.com/JannisX11/snowstorm/blob/master/src/import.js
- https://github.com/JannisX11/snowstorm/blob/master/src/export.js
