---
name: blockit-bedrock-entity-mcp
description: Route Bedrock Entity intents through Gateway to active-phase Runtime capabilities.
---

# BlockIT Bedrock Entity MCP

Own **Gateway phase/tool routing**, state reuse, handoff, and recovery only:

```text
geometry/rig/UV judgement → `blockbench-bedrock-modelling`
texture/PBR               → `blockit-bedrock-texturing`
animation/motion          → `blockit-bedrock-animation`
```

## Reference Grounding

Normal authoring is **approved image + optional 3D Evidence → Geometry → Texturing → optional Animation**. Optional 3D Evidence supports Geometry; it is not a second route.

## Fast Routing

Normal asset work **must not begin by searching repository files**.

```text
ACTIVE PHASE + intent + known state/UUIDs
→ exact current Runtime capability
→ execute through Gateway
→ reuse fresh returned state
```

Known capability → invoke directly. Unknown/stale → `search_capabilities`; exact current schema → `describe_capability` once. **1 Minecraft block = 16 Blockbench units.** Reuse `front_direction` when relevant.

## Phase Handoff

Foreign-phase need → `HANDOFF_REQUIRED` with `target_phase`, `reason`, `readiness`, `resume_from`.

```text
switch_authoring_phase through Gateway
→ refresh Runtime catalog
→ load target specialist
→ continue same task/chat
```

`HANDOFF_REQUIRED` stops current-phase mutation routing, not the whole task.

## Tool Lanes

```text
CORE / SHARED
target identity unknown       → inspect_elements(mode=search)
hierarchy question            → inspect_elements(mode=outline)
known target detail           → inspect_elements(mode=detail)
visible/reference comparison  → capture_model_views
numeric envelope/scale/ground → inspect_model_bounds
structural validation         → validator://status; detail only when nonzero
Locator identity unknown      → list_locator_elements
global UV/atlas readiness     → list_textures
recovery                      → undo / redo
file deliverable              → export_model
phase change                  → switch_authoring_phase

GEOMETRY
optional 3D Evidence          → manage_geometry_reference
create bone/Group             → add_group
create/update Cubes           → manage_cubes(operation=create|update|batch_update)
parent move                   → reparent_element
Group pivot/rotation/visible  → modify_group
structural delete/rename      → remove_element / rename_element
Locator/Null create/edit      → manage_locator / manage_null_object
IK/mirror                     → bone_rigging
```

`bone_rigging` is only for IK/mirror. Known coherent Cubes → one `manage_cubes(operation=create, elements=[...])`; uncertainty → no batch. Known Cubes sharing one deterministic TRANSLATE/RESIZE intent → derive absolute targets once from fresh state → one `manage_cubes(operation=batch_update)`. **Never loop inspect→modify per Cube.** Writes stay absolute/fail-closed.

## First-Call Invariants

```text
add_group                   → pass name OR groups, never both
manage_cubes update         → id + at least one authored change
manage_cubes rotated create → origin required
manage_locator create       → name+parent; update → id+authored change
manage_null_object create   → name+parent; update → id+parent/position
```

Validation failure repairs arguments for the **same capability**.

## Discovery / Recovery

Capability discovery is deferred spec loading, not a second router.

```text
known exact capability   → invoke directly
unknown/stale capability → one precise search_capabilities query
schema needed            → describe_capability once
```

One precise search miss → reformulate once; second miss → `BLOCKED`. A known foreign-phase capability is a handoff, never a discovery miss.

```text
INVALID_INPUT       → repair args; same capability
TARGET_AMBIGUOUS    → resolve UUID once
TARGET_NOT_FOUND    → focused identity lookup
STALE_STATE         → one focused refresh
NO_EFFECT           → change diagnosis/payload
CAPABILITY_MISMATCH → handoff once or BLOCKED
OUTCOME_UNKNOWN     → inspect state before retry
```

## State Reuse / Anti-Loop

- Known UUID → no discovery unless stale/ambiguous.
- Fresh mutation → reuse returned state/`geometry_effect`; no confirmation readback.
- Do not automatically re-read fresh mutation targets with `inspect_elements(mode=detail)`.
- Validator: read `validator://status` first; zero problems means no detail read.
- `inspect_model_bounds` only for envelope/scale/ground/displacement.
- Skip `get_project_info` after create/export unless lifecycle state is unknown/stale.
- Same routed failure twice without new evidence → `BLOCKED`.

`export_model`: `bedrock` JSON or editable `project` `.bbmodel`. Never emulate missing capability through generic UI actions.
