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
| `BOOTSTRAP` | 9 | readiness, project setup, compact contract validation |
| `BEDROCK_CUBOID_GEOMETRY` | 19 | cuboid geometry, checkpoint, evidence, validation, approval transition |
| `BEDROCK_CUBOID_TEXTURE` | 27 | Classic Bedrock UV/painting, compact validation, atlas evidence, approval transition |
| `BEDROCK_CUBOID_ANIMATION` | 18 | group/bone animation, compact validation, approval transition |
| `FINAL_VALIDATION_READONLY` | 16 | compact validation, evidence, checkpoint, export, final approval |
| `GEOMETRY_LOCAL_REPAIR` | 15 | named geometry correction only |
| `TEXTURE_LOCAL_REPAIR` | 20 | named UV/texture correction plus focused atlas evidence |
| `ANIMATION_LOCAL_REPAIR` | 13 | named motion/pivot correction only |
| `DIAGNOSTIC_ESCALATION` | runtime total | recorded blocker only |

`get_tool_profile` must report the actual exposed count and deterministic profile hash after the plugin is loaded.

## Geometry Profile

Included:

- group hierarchy;
- bounded cube construction;
- explicit element lookup and local edits;
- undo/redo inspection;
- one-call reference contract validation;
- persistent checkpoint;
- standard evidence capture;
- atomic approved-stage completion.

Excluded:

- project creation/configuration after preflight;
- selection-dependent editing;
- ad-hoc current-view screenshots;
- painting and UV editing;
- animation;
- PBR;
- mesh/armature workflows;
- final export;
- UI automation and eval.

Project creation/configuration remain available only in `BOOTSTRAP`.

## Texture Profile

Included:

- texture creation/activation/application;
- cuboid per-face UV;
- UV layout inspection;
- pixel-oriented fill, shape, brush, erase, and color-pick operations;
- one-call stage-aware reference contract validation;
- direct atomic PNG evidence writing through `save_texture_evidence`;
- checkpoint, standard review capture, and approved-stage completion.

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
- one-call stage-aware contract validation;
- checkpoint and evidence capture;
- current-view screenshots only for sampled animation poses;
- approved-stage completion.

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
- one-call reference contract validation;
- direct final texture-atlas evidence writing;
- final standard views;
- checkpointing;
- export format inspection and final export;
- final approval transition to `DONE`.

Excluded:

- ad-hoc screenshot capture;
- normal Geometry writes;
- normal Texture writes;
- normal Animation writes;
- unscoped repair;
- new features.

A failure activates the matching repair profile and returns to the relevant review stage.

## Token-Saving Composite Operations

### `validate_reference_contract`

Replaces repeated manual calls for project identity, format, dimensions, atlas, required files, evidence, animation presence, PBR conflicts, and Blockbench validator counts. It is available in every normal review stage.

### `save_texture_evidence`

Writes PNG evidence directly inside the session workspace and returns only compact metadata. Codex no longer needs to receive and retransmit a full base64 atlas merely to save it.

### `complete_stage`

After explicit user approval, verifies evidence and a `PASS` report, creates the approved checkpoint, updates `state.json`, protects accepted areas, activates the next profile, and returns one reconnect instruction.

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

- Geometry `place_cube` cannot assign an explicit texture or custom face UV.
- Geometry `modify_cube` cannot change auto-UV, UV offsets, mirroring, or face UV.
- Classic Texture `create_texture` cannot set `pbr_channel`.
- `set_cube_face_uv` requires an explicit cube ID.

## Runtime Proof Still Required

After build/reload, verify for every normal profile:

1. `tools/list` contains only core plus exact allowlist;
2. reported exposed count matches this audit;
3. profile hash is stable across reconnects;
4. a forbidden tool is absent from the list;
5. a stale call outside the newly activated profile returns `TOOL_PROFILE_BLOCKED`;
6. a cross-stage argument returns `TOOL_PROFILE_ARGUMENT_BLOCKED`;
7. `validate_reference_contract` returns one compact result in each review stage;
8. `save_texture_evidence` writes PNG without a base64 round-trip;
9. `complete_stage` refuses non-PASS reports and keeps checkpoint/state/profile consistent;
10. one reconnect refreshes the reduced list;
11. no new port or MCP server key is created.

Do not mark this audit runtime-verified until those checks pass in actual Blockbench and Codex.
