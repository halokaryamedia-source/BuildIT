---
name: blockit-bedrock-entity-mcp
description: BlockIT Bedrock Entity asset router. Route from active phase + intent + known state to the exact exposed tool.
---

# BlockIT Bedrock Entity MCP

Use for **asset authoring**, not plugin development. Target `bedrock`.

## Fast Routing Contract

Normal asset work **must not begin by searching repository files**.

`ACTIVE PHASE + intent + known state/UUIDs → exact exposed tool → execute → reuse fresh state`

MCP initialize `ACTIVE PHASE` + current `tools/list` are the **routing authority for the first tool decision**. Tool absence caused by phase scoping is **not** a discovery failure.

## Bedrock Coordinate Contract

All geometry coordinates use **Blockbench units**:

```text
1 Minecraft block = 16 Blockbench units
x = width
y = height
z = length
+Y = up
```

Convert requested block dimensions once before authoring exact coordinates. `inspect_model_bounds` reports the same axes; it is for envelope/scale/ground/displacement, not visual fidelity.

For `capture_model_views`, establish one asset `front_direction` (`+z` or `-z`) from the approved/current orientation and reuse it across verification captures. Do not flip front direction between comparisons. Persist it in workspace Material handoff constraints when it is resume-critical.

## Active Phase Contract

Exactly one specialist lane is callable with MCP CORE:

```text
GEOMETRY  = Cube/Group/rig/Locator/Null mutation + UV Layout
TEXTURING = Texture Atlas + Painter + PBR + material instances
ANIMATION = animation/keyframes/timeline/effects/controllers
```

Foreign-phase need:

```text
HANDOFF_REQUIRED
target_phase: <geometry|texturing|animation>
reason: <why current phase cannot own the next mutation>
readiness: <latest verified gates relevant to the handoff>
resume_from: <current model/project + immediate target identifiers>
action: set MCP Authoring Phase=<target>; reload BlockIT MCP
STOP
```

Do **not** `tool_search`, emulate, rename, or substitute a foreign-phase tool. Geometry owns rig and UV mutation; Texturing/Animation return structural defects to Geometry. Preserve only resume-critical state; an exact UUID belongs in `resume_from` only when the immediate next mutation needs it.

## Authoring Stage Lock

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`

`DISCOVER` is only for unknown/stale state; fresh state must not regress there.

## Tool Lane Discipline

```text
CORE
no project                    → create_project
lifecycle unknown             → get_project_info
target identity unknown       → find_elements_by_criteria
hierarchy question            → list_outline
known target detail           → inspect_element
visible/reference comparison  → capture_model_views
numeric envelope/scale/ground → inspect_model_bounds
Locator identity unknown      → list_locator_elements
global UV/atlas readiness     → list_textures
recover change                → undo / redo
file deliverable              → export_model

GEOMETRY
create normal bone/Group      → add_group
create Cube                   → place_cube
one known Cube fix            → modify_cube
several known Cube fixes      → modify_cubes_batch
structural delete/rename      → remove_element / rename_element
Locator/Null create/edit      → manage_locator / manage_null_object
rig parent/pivot/IK/mirror    → bone_rigging
```

`add_group` is the normal creation route. Do not choose `bone_rigging(action=create/delete/rename)` merely because it also looks applicable; use `bone_rigging` for rig-specific parent/pivot/IK/mirror work and the dedicated structural tools for ordinary create/delete/rename.

Texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`; geometry/rig/UV judgement → `blockbench-bedrock-modelling`. Known coherent Cubes → one `place_cube(elements=[...])`; uncertainty → no batch.

## First-Call Input Invariants

Do not discover known cross-field rules by making a failing mutation first. When the routed tool uses action variants or conditional fields and its exact spec is not already loaded, load **that exact active-phase spec once** before mutation.

```text
place_cube rotation != [0,0,0] → origin required in the same Cube entry
add_group                       → pass name OR groups, never both
modify_cube                     → id + at least one authored field change
manage_locator create           → name + parent; omit id
manage_locator update           → id + at least one authored field change
manage_null_object create       → name + parent; omit id
manage_null_object update       → id + parent and/or position
```

A validation failure repairs arguments for the **same routed tool**; it is not permission to switch to a lookalike tool.

## Search / Recovery

`tool_search` is **deferred spec loading after routing** and only for a tool that belongs to the active phase and is expected in current `tools/list`. If exact spec is loaded, call it. One precise search; miss → reformulate once with the same name; second miss → `BLOCKED`.

A known foreign-phase tool must never enter this search path.

```text
validation      → INVALID_INPUT       → repair args; same tool
ambiguous       → TARGET_AMBIGUOUS    → resolve UUID once
unknown missing → TARGET_NOT_FOUND    → focused identity lookup
known UUID gone → STALE_STATE         → one focused refresh
no effect       → NO_EFFECT           → change diagnosis/payload
unsupported     → CAPABILITY_MISMATCH → handoff once or BLOCKED
```

## Minimum Necessary Evidence / Anti-Loop

- Known UUID → no discovery unless stale/ambiguous.
- Fresh mutation → reuse returned state/`geometry_effect`; no ritual readback.
- **Do not automatically re-read fresh mutation targets with `inspect_element`.**
- Do not inspect every new Cube or capture after every mutation.
- `inspect_model_bounds` only for envelope/scale/ground/displacement.
- Skip `get_project_info` after create/export unless required by unknown/stale lifecycle state.
- Same causal correction failing twice without new evidence → `BLOCKED`.

## Visual / Downstream

Reference fidelity: `FAIL / UNVERIFIED / PASS`. Tool success cannot create visual `PASS`. Production Texturing waits for dependent Geometry/rig/UV readiness; Animation waits for required upstream readiness.

When the active phase is complete and requested work continues in another phase, emit `HANDOFF_REQUIRED` and STOP. Existing geometry may be a task baseline without certifying reference accuracy.

`export_model`: Bedrock JSON (`bedrock`) or editable `.bbmodel` (`project`). Missing native capability stays explicit; never emulate with Mesh, `risky_eval`, UI automation, Hytale, or another format.
