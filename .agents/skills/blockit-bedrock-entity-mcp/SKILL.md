---
name: blockit-bedrock-entity-mcp
description: Route Bedrock Entity intents to exact active-phase tools.
---

# BlockIT Bedrock Entity MCP

Target `bedrock`. Own only **phase/tool routing**, state reuse, handoff, recovery:

```text
geometry/rig/UV judgement → `blockbench-bedrock-modelling`
texture/PBR               → `blockit-bedrock-texturing`
animation/motion          → `blockit-bedrock-animation`
```

## Fast Routing Contract

Normal asset work **must not begin by searching repository files**.

`ACTIVE PHASE + intent + known state/UUIDs → exact exposed tool → execute → reuse fresh state`

`ACTIVE PHASE` + `tools/list` are the **routing authority for the first tool decision**; phase absence is not discovery failure. **1 Minecraft block = 16 Blockbench units**.

## Active Phase Contract

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

`bone_rigging` only for IK/mirror. Known coherent Cubes → one `place_cube(elements=[...])`; uncertainty → no batch. Known Cubes sharing one deterministic TRANSLATE/RESIZE intent → derive absolute targets once from fresh state → one `modify_cubes_batch`; never loop inspect→modify per Cube. Relative intent stays reasoning-layer arithmetic.

## Route 1

Selected path = **approved image + dimensions + shape-only `.glb`**. Route transient GLB via `manage_geometry_reference`; modelling owns uniform fit-envelope, fresh post-scale bounds, center/ground judgement, and cleanup before `.bbmodel`. Details: `Experimental/route1-hunyuan-poc/README.md`.

## First-Call Invariants

```text
place_cube rotation != 0  → origin required
add_group                 → pass name OR groups, never both
modify_cube               → id + at least one authored field change
manage_locator create     → name+parent; update → id+authored change
manage_null_object create → name+parent; update → id+parent/position
```

Load conditional spec only when needed. Validation failure repairs the **same routed tool**.

## Search / Recovery

`tool_search` is **deferred spec loading after routing** only for a tool that **belongs to the active phase**. Search **the exact selected tool name only**.

**One precise search:** exact selected tool name. Miss → **reformulate once** with exact name + one domain noun; second miss → `BLOCKED`. Fallback is search-backend recovery, **not re-routing**. **A known foreign-phase tool must never enter this search path.**

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

`export_model`: `bedrock` JSON or `project` `.bbmodel`. Never emulate missing capability.
