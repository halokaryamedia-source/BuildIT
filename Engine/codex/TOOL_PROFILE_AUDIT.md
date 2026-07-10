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
| `BEDROCK_CUBOID_GEOMETRY` | 21 | cuboid groups, cubes, history, checkpoint, evidence |
| `BEDROCK_CUBOID_TEXTURE` | 26 | Classic Bedrock cube UV and pixel painting |
| `BEDROCK_CUBOID_ANIMATION` | 16 | group/bone animation without mesh deformation |
| `FINAL_VALIDATION_READONLY` | 14 | read-mostly inspection, evidence, checkpoint, export |
| `GEOMETRY_LOCAL_REPAIR` | 16 | named geometry correction only |
| `TEXTURE_LOCAL_REPAIR` | 21 | named UV/texture correction only |
| `ANIMATION_LOCAL_REPAIR` | 13 | named motion/pivot correction only |
| `DIAGNOSTIC_ESCALATION` | runtime total | recorded blocker only |

The runtime tool `get_tool_profile` must report the actual exposed count and deterministic profile hash after the plugin is loaded.

## Geometry Profile

Included categories:

- project identity/configuration;
- group hierarchy;
- bounded cube construction;
- explicit element lookup and local edits;
- undo/redo inspection;
- persistent checkpoint;
- standard evidence capture.

Excluded:

- painting;
- UV editing;
- animation;
- PBR;
- mesh/armature workflows;
- final export;
- UI automation and eval.

## Texture Profile

Included:

- texture creation/activation/application;
- cuboid per-face UV;
- UV layout inspection;
- pixel-oriented fill, shape, brush, erase, and color-pick operations;
- checkpoint and review capture.

Excluded:

- `gradient_tool` by default;
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
- checkpoint and evidence capture.

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

## Runtime Proof Still Required

After build/reload, verify for every normal profile:

1. `tools/list` contains only core plus exact allowlist;
2. reported exposed count matches this audit;
3. profile hash is stable across reconnects;
4. a forbidden tool is absent from the list;
5. a stale call outside the newly activated profile returns `TOOL_PROFILE_BLOCKED`;
6. one reconnect refreshes the reduced list;
7. no new port or MCP server key is created.

Do not mark this audit runtime-verified until those checks pass in actual Blockbench and Codex.
