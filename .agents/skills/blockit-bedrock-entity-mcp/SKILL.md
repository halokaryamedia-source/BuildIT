---
name: blockit-bedrock-entity-mcp
description: BlockIT Bedrock Entity asset router. Route active phase + intent + known state to the exact exposed tool.
---

# BlockIT Bedrock Entity MCP

Target `bedrock`. Own only **phase/tool routing**, preflight, state reuse, handoff, and bounded recovery. Domain judgement stays with:

```text
geometry/rig/UV judgement → `blockbench-bedrock-modelling`
texture/PBR               → `blockit-bedrock-texturing`
animation/motion          → `blockit-bedrock-animation`
```

## Fast Routing Contract

Normal asset work **must not begin by searching repository files**.

`ACTIVE PHASE + intent + known state/UUIDs → exact exposed tool → execute → reuse fresh state`

MCP `ACTIVE PHASE` + `tools/list` are the routing authority for the first tool decision. Tool absence caused by phase scoping is **not** a discovery failure.

Bedrock: **1 Minecraft block = 16 Blockbench units**. Reuse `capture_model_views` `front_direction` when material.

## Active Phase Contract

`GEOMETRY` = Cube/Group/rig/Locator/Null + UV Layout; `TEXTURING` = Texture Atlas/Painter/PBR/material instances; `ANIMATION` = animation/keyframes/timeline/effects/controllers.

Foreign-phase need → `HANDOFF_REQUIRED` with target_phase, reason, readiness, resume_from, phase switch/reload action → STOP. Do **not** `tool_search` or substitute it.

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`; discovery is only for unknown/stale identity or exact spec.

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
Route 1 GLB lifecycle         → manage_geometry_reference when exposed
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

`bone_rigging` only for IK/mirror. Known coherent Cubes → one placement batch; known deterministic multi-Cube correction → one `modify_cubes_batch`. Writes stay absolute/fail-closed.

## Route 1

Selected reference path is **approved image + requested dimensions + approved shape-only `.glb`**. Route to `manage_geometry_reference` when exposed, then modelling judgement owns fit-envelope/center-ground use. Image = visual authority; requested dimensions = numeric authority; GLB = supporting 3D evidence. Uniform scale only; fresh post-scale bounds are required before translation; remove the reference before `.bbmodel` export. Detailed contract: `Experimental/route1-hunyuan-poc/README.md`.

Do not reopen image-only A/B, add mesh→Cube conversion, or create a new alignment tool without reproduced need.

## First-Call Invariants

```text
place_cube rotation != 0  → origin required
add_group                 → pass name OR groups, never both
modify_cube               → id + authored change
manage_locator create     → name+parent; update → id+authored change
manage_null_object create → name+parent; update → id+parent/position
```

If conditional/action fields matter, load that exact active-phase spec once before mutation.

## Search / Recovery

`tool_search` is **deferred spec loading after routing** for an active-phase tool. Search **the exact selected tool name only**.

**One precise search:** exact selected tool name. Miss → reformulate once with exact name + one domain noun; second miss → `BLOCKED`. Fallback is search-backend recovery, **not re-routing**. **A known foreign-phase tool must never enter this search path**.

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
- Route 1 re-measure after transform is intentional evidence, not confirmation ceremony.
- Validator → summary first; details only when nonzero.
- `inspect_model_bounds` only for envelope/scale/ground/displacement.
- Same routed failure twice without new evidence → `BLOCKED`.

`export_model`: Bedrock JSON (`bedrock`) or editable `.bbmodel` (`project`). Never emulate missing capability.
