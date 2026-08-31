---
name: blockit-bedrock-entity-mcp
description: BlockIT Bedrock Entity asset router. Route active phase + intent + known state to the exact exposed tool.
---

# BlockIT Bedrock Entity MCP

Target `bedrock`. Own phase/tool routing, preflight, state reuse, handoff, recovery. Judgement:

```text
geometry/rig/UV → blockbench-bedrock-modelling
texture/PBR     → blockit-bedrock-texturing
animation/motion→ blockit-bedrock-animation
```

## Fast Routing Contract

Normal asset work **must not begin by searching repository files**.

`ACTIVE PHASE + intent + known state/UUIDs → exact exposed tool → execute → reuse fresh state`

MCP `ACTIVE PHASE` + `tools/list` are the **routing authority for the first tool decision**; phase absence is not discovery failure.

Bedrock: **1 Minecraft block = 16 Blockbench units**. Reuse `capture_model_views` `front_direction` when material.

## Active Phase Contract

`GEOMETRY` = Cube/Group/rig/Locator/Null + UV Layout; `TEXTURING` = Texture Atlas/Painter/PBR/material instances; `ANIMATION` = animation/keyframes/timeline/effects/controllers.

Foreign-phase need → `HANDOFF_REQUIRED` with target_phase, reason, readiness, resume_from, phase switch/reload action → STOP. Do **not** `tool_search` or substitute it.

## Authoring Stage Lock

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`

`DISCOVER` only for unknown/stale identity or exact spec; fresh state must not regress.

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
structural validation gate    → validator://status; details only when nonzero
Locator identity unknown      → list_locator_elements
global UV/atlas readiness     → list_textures
recover change                → undo / redo
file deliverable              → export_model

GEOMETRY
create normal bone/Group      → add_group
create Cube                   → place_cube
one known Cube fix            → modify_cube
several known Cube fixes      → modify_cubes_batch
Group/bone parent move        → reparent_element
Group pivot/rotation/visible  → modify_group
structural delete/rename      → remove_element / rename_element
Locator/Null create/edit      → manage_locator / manage_null_object
rig IK/mirror                 → bone_rigging
```

`bone_rigging` only for IK/mirror. Known coherent Cubes → one `place_cube(elements=[...])`; uncertainty → no batch. Known Cubes sharing one deterministic TRANSLATE/RESIZE intent → derive absolute targets once from fresh state → one `modify_cubes_batch`; never loop inspect→modify per Cube. Relative intent stays reasoning-layer arithmetic; writes stay absolute/fail-closed.

## First-Call Invariants

```text
place_cube rotation != 0  → origin required
add_group                 → pass name OR groups, never both
modify_cube               → id + at least one authored field change
manage_locator create     → name+parent; update → id+authored change
manage_null_object create → name+parent; update → id+parent/position
```

If conditional/action fields matter, load **that exact active-phase spec once** before mutation. Validation failure repairs arguments for the **same routed tool**.

## Search / Recovery

`tool_search` is **deferred spec loading after routing** only for a tool that **belongs to the active phase**.

**One precise search:** exact selected tool name. Miss → **reformulate once** with exact name + one domain noun; second miss → `BLOCKED`. Fallback is search-backend recovery, not re-routing. **A known foreign-phase tool must never enter this search path.**

```text
validation      → INVALID_INPUT       → repair args; same tool
ambiguous       → TARGET_AMBIGUOUS    → resolve UUID once
unknown missing → TARGET_NOT_FOUND    → focused identity lookup
known UUID gone → STALE_STATE         → one focused refresh
no effect       → NO_EFFECT           → change diagnosis/payload
unsupported     → CAPABILITY_MISMATCH → handoff once or BLOCKED
```

## State Reuse / Anti-Loop

- Known UUID → no discovery unless stale/ambiguous.
- Fresh mutation → reuse returned state/`geometry_effect`; no confirmation readback.
- **Do not automatically re-read fresh mutation targets with `inspect_element`.**
- Validator gate → read `validator://status` first; zero problems means no detail-resource read.
- `inspect_model_bounds` only for envelope/scale/ground/displacement.
- Skip `get_project_info` after create/export unless lifecycle state is unknown/stale.
- Same routed failure twice without new evidence → `BLOCKED`.

`export_model`: Bedrock JSON (`bedrock`) or editable `.bbmodel` (`project`). Never emulate missing capability.
