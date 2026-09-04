---
name: blockit-bedrock-entity-mcp
description: Route Bedrock Entity intents through Gateway to active-phase Runtime capabilities.
---

# BlockIT Bedrock Entity MCP

Own only **phase/tool routing, Gateway state reuse, handoff, recovery.** Intake and user-approval gates are orchestration state; specialist judgement stays with:

```text
geometry/rig/UV → blockbench-bedrock-modelling
texture/PBR     → blockit-bedrock-texturing
animation       → blockit-bedrock-animation
```

## Entry Gate

New model:

```text
Approved Reference → Active Workspace
→ require Asset + Dimensions + Geometry Strategy + Animation Required
→ missing values: ask together
→ complete/non-conflicting: create Blockbench project
```

`Geometry Strategy = DIRECT | 3D_ASSISTED` is user-selected only; never infer/default/auto-switch it. `3D_ASSISTED` is one package: Reference → Shape Reconstruction → PrimitiveAnything → Cuboid Scaffold → semantic Geometry cleanup. If current source cannot execute it, `BLOCKED`; never emulate it.

## Fast Routing

Normal asset work **must not begin by searching repository files** once the asset/workspace is known.

```text
ACTIVE PHASE + intent + fresh known state/UUIDs
→ exact known capability → invoke through Gateway
```

Unknown/stale → one `search_capabilities`; if schema is needed, use `describe_capability` once before mutation. **1 Minecraft block = 16 Blockbench units.** Reuse `front_direction`.

## Stage Approval

```text
AUTHOR → internal verify/correct → READY_FOR_USER_REVIEW
→ user inspects live Blockbench
   ├─ revise → same stage
   └─ explicit approve → checkpoint save → next required stage
```

Internal `capture_model_views` is Codex evidence, not the user approval surface. Same material causal correction failing twice without new evidence → `BLOCKED`. Reopened upstream stages invalidate only materially dependent downstream approvals.

## Phase Handoff

Foreign-phase need → `HANDOFF_REQUIRED` with `target_phase`, `reason`, `readiness`, `resume_from`.

```text
switch_authoring_phase through Gateway
→ refresh Runtime catalog → load target specialist → same task/chat
```

Normal forward handoff waits for explicit stage approval. `HANDOFF_REQUIRED` stops prior-phase mutation routing, not the whole task.

## Tool Lane Discipline

```text
CORE / SHARED
identity unknown       → inspect_elements(mode=search)
hierarchy              → inspect_elements(mode=outline)
known target detail    → inspect_elements(mode=detail)
visual comparison      → capture_model_views
envelope/scale/ground  → inspect_model_bounds
validation             → validator://status; details only when nonzero
Locator identity       → list_locator_elements
UV/atlas readiness     → list_textures
recovery               → undo / redo
file deliverable       → export_model
phase change           → switch_authoring_phase

GEOMETRY
live 3D-Assisted GLB   → manage_geometry_reference
Group                  → add_group
Cubes                  → manage_cubes(operation=create|update|batch_update)
parent                 → reparent_element
Group transform        → modify_group
delete/rename          → remove_element / rename_element
Locator/Null           → manage_locator / manage_null_object
IK/mirror              → bone_rigging
```

Future scaffold materialization is one Geometry capability behind the existing Gateway, not a fifth Gateway tool.

`bone_rigging` only for IK/mirror. Coherent known Cube creation → one create batch. Shared deterministic TRANSLATE/RESIZE → derive absolute targets from fresh state → one `batch_update`. Never inspect→modify per Cube; writes stay absolute/fail-closed.

## First-Call Invariants

```text
add_group                   → name OR groups, never both
manage_cubes update         → id + authored field change
manage_cubes rotated create → origin required
manage_locator create       → name+parent; update → id+authored change
manage_null_object create   → name+parent; update → id+parent/position
```

Validation failure repairs arguments for the **same capability**.

## Discovery / Recovery

Capability discovery is **deferred spec loading after routing**, not a second router. One precise search miss → reformulate once; second miss → `BLOCKED`. Known foreign-phase capability → handoff, not discovery miss.

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
- `inspect_model_bounds` only for envelope/scale/ground/displacement.
- Skip `get_project_info` after create/export unless lifecycle state is unknown/stale.
- Same routed failure twice without new evidence → `BLOCKED`.

`export_model`: `bedrock` JSON or editable `project` `.bbmodel`. Never emulate missing capability via generic UI actions.
