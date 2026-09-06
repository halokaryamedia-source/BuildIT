---
name: blockit-bedrock-entity-mcp
description: Mandatory router for every BlockIT Minecraft Bedrock Entity asset-authoring task.
---
# BlockIT Bedrock Entity MCP
`geometry/rig/UV judgement` → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation/motion → `blockit-bedrock-animation`.

## Mandatory Authoring Latch
Before an owner's first mutation load this router + matching specialist from the **current worktree**:
`router_loaded=YES | active_owner=GEOMETRY|TEXTURING|ANIMATION | specialist_loaded=YES | gate_satisfied=YES`.
Any `NO` → **DO NOT MUTATE**. Old memory is not a substitute.

Geometry → approved image + Dimensions + user-selected strategy + Animation Required.
UV → user Geometry APPROVED.
Texture → Geometry APPROVED + UV Layout PASS.
Animation → Texturing APPROVED → `HANDOFF_REQUIRED`.

`HANDOFF_REQUIRED`: `target_phase`, `reason`, `readiness`, `resume_from`; invoke `switch_authoring_phase` through Gateway → load specialist → same task/chat.

Approved image = visual authority. Strategy is user-selected `DIRECT | 3D_ASSISTED`; never infer/default/auto-switch.
`3D_ASSISTED` = Shape Reconstruction → PrimitiveAnything → Cuboid Scaffold → cleanup; unavailable → `BLOCKED`, never fallback.
**1 Minecraft block = 16 Blockbench units.** Reuse `front_direction`.

## Authoring Context Firewall
Normal asset authoring is not repository development. Do **not** inspect `mcp/tests/**`, CI/workflows, implementation source, or development docs; do not run Bun/tests/build/verifiers/deploy commands merely to author or verify an asset. Reproduced source/runtime defect → stop and report; repository work starts only when explicitly requested.

## Fast Routing / Stage
`ACTIVE STAGE + intent + known state/UUIDs → exact known capability → Gateway invoke → reuse returned state`.
`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.

## Tool Lane
```text
CORE / SHARED
project unknown                → get_project_info
identity/hierarchy/detail      → inspect_elements(mode=search|outline|detail)
visible/reference comparison  → capture_model_views
envelope/scale/ground          → inspect_model_bounds
UV/atlas readiness             → list_textures
file deliverable               → export_model
Animation boundary             → switch_authoring_phase

GEOMETRY
3D-Assisted GLB                → manage_geometry_reference
create normal bone/Group       → add_group
create/update Cubes            → manage_cubes(operation=create|update|batch_update)
parent/pivot/rotation/visible  → reparent_element / modify_group
delete/rename                  → remove_element / rename_element
Locator/Null                   → manage_locator / manage_null_object
IK/mirror                      → bone_rigging
```
`validator://*` resources are direct-Runtime/Inspector observability, not Gateway authoring routes. A Gateway client must not search for or emulate them.

Known coherent Cubes → one `manage_cubes(operation=create, elements=[...])`; uncertainty → no batch.
Known Cubes sharing one deterministic TRANSLATE/RESIZE intent → derive absolute targets once from fresh state → one `batch_update`. Never loop inspect→modify per Cube. Shared assembly motion belongs to its Group when one transform explains it.

## First-Call Invariants
`add_group` → name OR groups, never both.
`manage_cubes update` → id + authored change.
rotated Cube create → explicit origin.
`manage_locator create` → name+parent; update → id+change.
`manage_null_object create` → name+parent; update → id+parent/position.
Validation failure repairs arguments for the **same capability**.

## Discovery / Recovery
Known hot-path capability + Skill-documented arguments → invoke directly; do not describe for reassurance.
Unknown/stale capability → one precise `search_capabilities` query, `limit=4`.
Describe once only when the needed argument branch is undocumented or `INVALID_INPUT` shows schema uncertainty.
One search miss → reformulate once; second miss → `BLOCKED`. Never use status/search/describe as progress confirmation.

`INVALID_INPUT` → repair args, same capability.
`TARGET_AMBIGUOUS` → resolve UUID once.
`TARGET_NOT_FOUND` → focused identity lookup.
`STALE_STATE` → one focused refresh.
`NO_EFFECT` → change diagnosis/payload.
`CAPABILITY_MISMATCH` → handoff once or `BLOCKED`.
`OUTCOME_UNKNOWN` → inspect state before retry.
Same routed failure twice without new evidence → `BLOCKED`.

## State Reuse / Anti-Loop
Fresh mutation → reuse returned state/effect; no confirmation readback.
Do not automatically re-read fresh targets with `inspect_elements(mode=detail)`.
Do not call status/discovery/project/bounds/capture merely to confirm success.
`inspect_model_bounds` only for envelope/scale/ground/displacement.
Skip `get_project_info` after known create/export state.
`export_model`: `bedrock` JSON or `project` `.bbmodel`.
