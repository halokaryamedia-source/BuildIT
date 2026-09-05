---
name: blockit-bedrock-entity-mcp
description: Mandatory router for every BlockIT Minecraft Bedrock Entity asset-authoring task. Load before Geometry/UV, Texturing/PBR, or Animation mutation; owns Gateway routing, specialist selection, and handoff.
---

# BlockIT Bedrock Entity MCP

```text
geometry/rig/UV judgement → `blockbench-bedrock-modelling`
texture/PBR               → `blockit-bedrock-texturing`
animation/motion          → `blockit-bedrock-animation`
```

## Mandatory Authoring Latch

Before each owner's first mutation, load this router + matching specialist from the **current worktree**.

```text
router_loaded=YES
active_owner=GEOMETRY|TEXTURING|ANIMATION
specialist_loaded=YES
gate_satisfied=YES
```

Any `NO` → **DO NOT MUTATE**. Memory, an older session, or tool availability cannot substitute for the current specialist.

```text
Geometry → approved image + Dimensions + user-selected strategy + Animation Required
UV       → user Geometry APPROVED; Geometry specialist owns UV judgement
Texture  → Geometry APPROVED + UV Layout PASS; load Texturing specialist
Animation→ Texturing APPROVED → HANDOFF_REQUIRED → load Animation specialist
```

## Reference Grounding / Strategy Gate

approved image = visual authority. Geometry Strategy is user-selected: `DIRECT | 3D_ASSISTED`; never auto-switch.

`DIRECT` → Geometry. `3D_ASSISTED` → Shape Reconstruction → PrimitiveAnything → Cuboid Scaffold → cleanup. Unavailable → `BLOCKED`; never fallback. `manage_geometry_reference` is support evidence only.

**1 Minecraft block = 16 Blockbench units.** Reuse `front_direction`.

## Fast Routing Contract

Normal asset work **must not begin by searching repository files**.

```text
ACTIVE STAGE + intent + known state/UUIDs
→ exact known Runtime capability
→ Gateway execution → reuse returned state
```

## Authoring Surface / Handoff

Geometry↔Texturing is an owner change; no Runtime handoff. `HANDOFF_REQUIRED` + `switch_authoring_phase` is only AUTHORING↔Animation; same task/chat.

## Authoring Stage Lock

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`

Internal PASS never bypasses required user approval.

## Tool Lane Discipline

```text
CORE / SHARED
project unknown                → get_project_info
identity/hierarchy/detail      → inspect_elements(mode=search|outline|detail)
visible/reference comparison  → capture_model_views
envelope/scale/ground          → inspect_model_bounds
structural validation gate    → validator://status
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

Known coherent Cubes → one batch; uncertainty → no batch. Shared TRANSLATE/RESIZE → one absolute `batch_update`; never inspect→modify per Cube.

**Semantic cohort rule:** shared assembly motion belongs to its Group when one transform explains it; otherwise correct the full sibling cohort.

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

Capability discovery is deferred spec loading after routing, not a second router.

```text
known exact capability   → invoke directly
unknown/stale capability → one precise search_capabilities query
schema needed            → `describe_capability` once before mutation
```

One precise search miss → reformulate once; second miss → `BLOCKED`. A known foreign-phase capability is never a discovery miss: AUTHORING↔Animation uses handoff.

```text
INVALID_INPUT       → repair args; same capability
TARGET_AMBIGUOUS    → resolve UUID once
TARGET_NOT_FOUND    → focused identity lookup
STALE_STATE         → one focused refresh
NO_EFFECT           → change diagnosis/payload
CAPABILITY_MISMATCH → handoff once or BLOCKED
OUTCOME_UNKNOWN     → inspect state before retry
```

Same routed failure twice without new evidence → `BLOCKED`.

## State Reuse / Anti-Loop

- Fresh mutation → reuse state/`geometry_effect`; no confirmation readback.
- Do not automatically re-read fresh mutation targets with `inspect_elements(mode=detail)`.
- `inspect_model_bounds` only for envelope/scale/ground/displacement.
- Skip `get_project_info` after create/export unless lifecycle state is unknown/stale.

`export_model`: `bedrock` JSON or `project` `.bbmodel`.
