# ChatGPT Particle Authoring Specification

This document defines the minimum input contract for particle authoring through ChatGPT. It is an experimental workflow contract, not a production MCP schema.

## Purpose

Normalize particle requests before authoring so motion, scale, visual role, surrounding geometry, and acceptance targets are explicit enough to avoid repeated reinterpretation.

## Minimum authoring brief

A request should resolve the following fields before final authoring. Missing optional values may be inferred conservatively from context; missing values that materially change motion or package structure must remain explicit assumptions in the working brief.

```text
effect_name
purpose / visual role
target_runtime: bedrock | snowstorm
world scale / source scale
view_distance_blocks
active_duration_seconds / total_duration_seconds
overall direction
spawn region / origin
environment / nearby geometry
motion targets
texture style
performance target
packaging target
```

## Recommended structured form

```yaml
effect_name: volcano_eruption
purpose: support VFX around an existing block-built eruption plume
target_runtime: snowstorm

scale:
  source_diameter_blocks: 40
  view_distance_blocks: 100

timing:
  active_duration_seconds: 18
  total_duration_seconds: 30

direction:
  vertical: strong_up
  forward: medium
  lateral: slight_left

spatial:
  origin: crater_center
  keep_out:
    shape: cylinder
    radius_blocks: 6
    min_y: 0
    max_y: 24

motion_targets:
  - id: heavy_bomb
    apex_blocks: [15, 23]
    horizontal_distance_blocks: [28, 40]

texture:
  style: detailed_pixel_art
  atlas: 4x4
  transparency: true

performance:
  max_visible_particles: 115

package:
  minecraft_resource_pack_ready: true
  mcpack: false
```

## Authoring rules

1. Treat intent values as acceptance targets, not automatic rewrite commands.
2. Split one visual effect into multiple particle emitters only when physics or spatial roles are materially different.
3. Keep Snowstorm-specific compatibility separate from Bedrock validity.
4. Prefer stable particle-owned variables for lifetime class, UV, size, tint, and motion behavior.
5. Use emitter-owned variables for emitter timing and event scheduling.
6. Declare surrounding geometry when it creates a meaningful keep-out or visibility constraint.
7. Long-distance effects must declare intended viewing distance before final sprite sizing.
8. Performance targets are advisory budgets, not FPS guarantees.

## Assumption policy

ChatGPT may infer low-risk details such as naming, minor texture padding, or exact documentation wording. It should not silently infer critical motion range, environment occlusion, target runtime, or packaging requirements when those choices materially change the result.

When a critical value is absent but the user has already supplied enough visual or contextual evidence, use the smallest reasonable assumption and state it in the working design before final packaging.

## Output naming

Final assets use clear semantic names without revision suffixes such as `_v12`, `_final2`, or `_test`.

Preferred pattern:

```text
<effect_name>.particle.json
<effect_name>_<role>.particle.json
<effect_name>.png
<effect_name>_<role>.png
```

Version history belongs in source control, not production filenames.
