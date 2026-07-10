# MCP Tool Profile Audit

## Scope

This audit covers source-level stage exposure for the current Minecraft Bedrock cuboid workflow.

Runtime total tool count remains authoritative only after rebuilding and loading the Rework plugin, because generated API documentation may lag current source.

## Profile Counts

Counts include the four always-exposed core tools:

```text
get_runtime_status
get_project_info
get_tool_profile
activate_tool_profile
```

| Profile | Exposed Tool Target | Purpose |
| --- | ---: | --- |
| `BOOTSTRAP` | 8 | readiness, project setup, profile selection |
| `BEDROCK_CUBOID_GEOMETRY` | 17 | cuboid groups, cubes, history, checkpoint, evidence |
| `BEDROCK_CUBOID_TEXTURE` | 24 | Classic Bedrock cube UV and pixel painting |
| `BEDROCK_CUBOID_ANIMATION` | 16 | group/bone animation without mesh deformation |
| `FINAL_VALIDATION_READONLY` | 13 | read-mostly inspection, evidence, checkpoint, export |
| `GEOMETRY_LOCAL_REPAIR` | 15 | named geometry correction only |
| `TEXTURE_LOCAL_REPAIR` | 19 | named UV/texture correction only |
| `ANIMATION_LOCAL_REPAIR` | 13 | named motion/pivot correction only |
| `DIAGNOSTIC_ESCALATION` | runtime total | recorded blocker only |

The runtime tool `get_tool_profile` must report the actual exposed count and deterministic profile hash after the plugin is loaded.

## Geometry Profile

Included:

- group hierarchy;
- bounded cube construction;
- explicit element lookup and local edits;
- undo/redo inspection;
- persistent checkpoint;
- standard evidence capture.

Excluded:

- project creation/configuration after preflight;
- selection-dependent editing;
- ad-hoc current-view screenshots;
- painting;
- UV editing;
- animation;
- PBR;
- mesh/armature workflows;
- final export;
- UI automation and eval.

Project creation and configuration remain available only in `BOOTSTRAP`.

## Texture Profile

Included:

- texture creation/activation/application;
- cuboid per-face UV;
- UV layout inspection;
- pixel-oriented fill, shape, brush, erase, and color-pick operations;
- checkpoint and standard review capture.

Excluded:

- `gradient_tool` by default;
- selection-dependent broad operations;
- ad-hoc current-view screenshots;
- mesh UV;
- PBR materials and texture sets;
- Geometry reconstruction;
- Animation;
- UI automation and eval.

## Animation Profile

Included:

- outline inspection;
- Blockbench group/bone rigging;
- required animation creation;
- keyframe management;
- timeline control;
- checkpoint and evidence capture;
- current-view screenshots only for sampled animation poses.

Excluded:

- armature objects;
- vertex weights;
- broad Geometry changes;
- texture repainting;
- graph/batch/copy-paste tools until a real requirement justifies them;
- UI automation and eval.

## Final Validation Profile

Included:

- project, outline, texture, and UV inspection;
- final standard views;
- checkpointing;
- export format inspection and final export.

Excluded:

- ad-hoc screenshot capture;
- normal Geometry writes;
- normal Texture writes;
- normal Animation writes;
- unscoped repair;
- new features.

A failure activates the matching repair profile and returns to the relevant review stage.

## High-Risk Library Capabilities Hidden from Normal Work

- `risky_eval`;
- `trigger_action`;
- `emulate_clicks`;
- `fill_dialog`;
- PBR material creation/configuration/import/export;
- Hytale integrations;
- mesh UV tools;
- armature and vertex-weight tools.

These remain in the complete plugin library but are not advertised to normal stage sessions and are rejected by call-time guards.

## Argument-Level Guardrails

Even when a reusable tool is present in a profile, unsafe cross-stage arguments are blocked:

- Geometry `place_cube` cannot assign an explicit texture or custom face UV;
- Geometry `modify_cube` cannot change auto-UV, UV offsets, mirroring, or face UV;
- Classic Texture `create_texture` cannot set `pbr_channel`.

The runtime returns:

```text
TOOL_PROFILE_ARGUMENT_BLOCKED
```

instead of silently performing out-of-stage work.

## Runtime Proof Still Required

After build/reload, verify for every normal profile:

1. `tools/list` contains only core plus exact allowlist;
2. reported exposed count matches this audit;
3. profile hash is stable across reconnects;
4. a forbidden tool is absent from the list;
5. a stale call outside the newly activated profile returns `TOOL_PROFILE_BLOCKED`;
6. a cross-stage argument returns `TOOL_PROFILE_ARGUMENT_BLOCKED`;
7. one reconnect refreshes the reduced list;
8. no new port or MCP server key is created.

Do not mark this audit runtime-verified until those checks pass in actual Blockbench and Codex.
