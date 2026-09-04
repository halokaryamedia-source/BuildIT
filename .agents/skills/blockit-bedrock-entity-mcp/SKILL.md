---
name: blockit-bedrock-entity-mcp
description: Route Bedrock Entity intents through Gateway to active-phase Runtime capabilities.
---

# BlockIT Bedrock Entity MCP

Own only **phase/tool routing**, Gateway state reuse, handoff, and recovery:

```text
geometry/rig/UV judgement → `blockbench-bedrock-modelling`
texture/PBR               → `blockit-bedrock-texturing`
animation/motion          → `blockit-bedrock-animation`
```

## Reference Grounding

Normal authoring: **approved image + optional 3D Evidence → Geometry → Texturing → optional Animation**. 3D Evidence supports Geometry; it is not a second route.

## Fast Routing Contract

Normal asset work **must not begin by searching repository files**.

```text
ACTIVE PHASE + intent + known state/UUIDs
→ exact known Runtime capability
→ execute through Gateway
→ reuse fresh returned state
```

Known capability → invoke. Unknown/stale → `search_capabilities`; if schema is needed, use `describe_capability` once before mutation. **1 Minecraft block = 16 Blockbench units.** Reuse `front_direction`.

## Phase Handoff

Foreign-phase need → `HANDOFF_REQUIRED` with `target_phase`, `reason`, `readiness`, `resume_from`.

```text
switch_authoring_phase through Gateway
→ refresh Runtime catalog
→ load target specialist
→ continue same task/chat
```

`HANDOFF_REQUIRED` stops current-phase mutation routing, not the whole task.

## Authoring Stage Lock

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`

## Tool Lane Discipline

```text
CORE / SHARED
target identity unknown       → inspect_elements(mode=search)
hierarchy question            → inspect_elements(mode=outline)
known target detail           → inspect_elements(mode=detail)
visible/reference comparison  → capture_model_views
numeric envelope/scale/ground → inspect_model_bounds
structural validation gate    → validator://status; details only when nonzero
Locator identity unknown      → list_locator_elements
global UV/atlas readiness     → list_textures
recovery                      → undo / redo
file deliverable              → export_model
phase change                  → switch_authoring_phase

GEOMETRY
optional 3D Evidence          → manage_geometry_reference
create normal bone/Group       → add_group
create/update Cubes           → manage_cubes(operation=create|update|batch_update)
Group/bone parent move         → reparent_element
Group pivot/rotation/visible   → modify_group
structural delete/rename       → remove_element / rename_element
Locator/Null create/edit       → manage_locator / manage_null_object
rig IK/mirror                  → bone_rigging
```

`bone_rigging` only for IK/mirror. Known coherent Cubes → one `manage_cubes(operation=create, elements=[...])`; uncertainty → no batch. Known Cubes sharing one deterministic TRANSLATE/RESIZE intent → derive absolute targets once from fresh state → one `manage_cubes(operation=batch_update)`. Never loop inspect→modify per Cube. Relative intent stays reasoning-layer arithmetic; writes stay absolute/fail-closed.

## First-Call Invariants

```text
add_group                   → pass name OR groups, never both
manage_cubes update       → id + at least one authored field change
manage_cubes rotated create → origin required
manage_locator create       → name+parent; update → id+authored change
manage_null_object create   → name+parent; update → id+parent/position
```

Validation failure repairs arguments for the **same capability**.

## Capability Discovery / Recovery

Capability discovery is **deferred spec loading after routing**, not a second router.

```text
known exact capability   → invoke directly
unknown/stale capability → one precise search_capabilities query
schema needed            → describe_capability once
```

One precise search miss → reformulate once; second miss → `BLOCKED`. A known foreign-phase capability is never a discovery miss; hand off instead.

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
- Validator gate → read `validator://status` first; zero problems means no detail-resource read.
- `inspect_model_bounds` only for envelope/scale/ground/displacement.
- Skip `get_project_info` after create/export unless lifecycle state is unknown/stale.
- Same routed failure twice without new evidence → `BLOCKED`.

`export_model`: `bedrock` JSON or editable `project` `.bbmodel`. Never emulate missing capability via generic UI actions.
