---
name: blockit-bedrock-entity-mcp
description: Mandatory router for every BlockIT Minecraft Bedrock Entity asset-authoring task.
---
# BlockIT Bedrock Entity MCP
Own AUTHORING/Animation tool routing, handoff.

`geometry/rig/UV judgement` → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation/motion → `blockit-bedrock-animation`.

## Mandatory Authoring Latch
Before an owner's first mutation load this router + matching specialist from the **current worktree**:
`router_loaded=YES | active_owner=GEOMETRY|TEXTURING|ANIMATION | specialist_loaded=YES | gate_satisfied=YES`.
Any `NO` → **DO NOT MUTATE**. Memory/older session/tool availability is not a substitute.

Geometry → approved image + Dimensions + user-selected strategy + Animation Required.
UV → user Geometry APPROVED.
Texture → Geometry APPROVED + UV Layout PASS.
Animation → Texturing APPROVED → HANDOFF_REQUIRED.

`HANDOFF_REQUIRED`: `target_phase`, `reason`, `readiness`, `resume_from`; `switch_authoring_phase` through Gateway → specialist → same task/chat.

approved image = visual authority. Geometry Strategy is user-selected: `DIRECT | 3D_ASSISTED`; never auto-switch.
`DIRECT` → Geometry. `3D_ASSISTED` → Shape Reconstruction → PrimitiveAnything → Cuboid Scaffold → cleanup. Unavailable → `BLOCKED`; never fallback. `manage_geometry_reference` is support evidence only.
**1 Minecraft block = 16 Blockbench units.** Reuse `front_direction`.

## Fast Routing Contract
Normal asset work **must not begin by searching repository files**.
`ACTIVE STAGE + intent + known state/UUIDs → exact known Runtime capability → Gateway execution → reuse returned state`.

## Authoring Stage Lock
`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.

## Tool Lane Discipline
```text
CORE / SHARED
project unknown                → get_project_info
identity/hierarchy/detail      → inspect_elements(mode=search|outline|detail)
visible/reference comparison  → capture_model_views
envelope/scale/ground          → inspect_model_bounds
structural validation gate    → validator://status; details only when nonzero
UV/atlas readiness             → list_textures
file deliverable               → export_model
Animation boundary             → switch_authoring_phase

GEOMETRY OWNER
3D-Assisted GLB                → manage_geometry_reference
create normal bone/Group       → add_group
create/update Cubes            → manage_cubes(operation=create|update|batch_update)
Group/bone parent move         → reparent_element
Group pivot/rotation/visible   → modify_group
delete/rename                  → remove_element / rename_element
Locator/Null                   → manage_locator / manage_null_object
rig IK/mirror                  → bone_rigging
```
`bone_rigging` only for IK/mirror.
Known coherent Cubes → `manage_cubes(operation=create, elements=[...])`; uncertainty → no batch.
Known Cubes sharing one deterministic TRANSLATE/RESIZE intent → derive absolute targets once from fresh state → `manage_cubes(operation=batch_update)`. Never loop inspect→modify per Cube; relative intent stays reasoning-layer arithmetic; writes stay absolute/fail-closed.
**Semantic cohort rule:** shared assembly motion belongs to its Group when one transform explains it; otherwise correct the full sibling cohort.

## First-Call Invariants
`add_group` → pass name OR groups, never both.
`manage_cubes update       → id + at least one authored field change`
`manage_cubes rotated create → origin required`
`manage_locator create       → name+parent; update → id+authored change`
`manage_null_object create   → name+parent; update → id+parent/position`
Validation failure repairs arguments for the **same capability**.

## Capability Discovery / Recovery
Capability discovery is deferred spec loading after routing.
known exact capability   → invoke directly.
unknown/stale capability → one precise search_capabilities query.
schema needed → `describe_capability` once before mutation.
One precise search miss → reformulate once; second miss → `BLOCKED`. A known foreign-phase capability is never a discovery miss: AUTHORING↔Animation uses handoff.

`INVALID_INPUT` → repair args; same capability.
`TARGET_AMBIGUOUS` → resolve UUID once.
`TARGET_NOT_FOUND` → focused identity lookup.
`STALE_STATE` → one focused refresh.
`NO_EFFECT` → change diagnosis/payload.
`CAPABILITY_MISMATCH` → handoff once or BLOCKED.
`OUTCOME_UNKNOWN` → inspect state before retry.
Same routed failure twice without new evidence → `BLOCKED`.

## State Reuse / Anti-Loop
Fresh mutation → reuse state/`geometry_effect`; no confirmation readback.
Do not automatically re-read fresh mutation targets with `inspect_elements(mode=detail)`.
Validator gate → read `validator://status` first; zero problems means no detail-resource read.
`inspect_model_bounds` only for envelope/scale/ground/displacement.
Skip `get_project_info` after create/export unless lifecycle state is unknown/stale.
`export_model`: `bedrock` JSON or `project` `.bbmodel`.
