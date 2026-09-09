---
name: blockit-bedrock-entity-mcp
description: Mandatory router for BlockIT Bedrock Entity asset authoring.
---
# BlockIT Bedrock Entity MCP
Own AUTHORING/Animation tool routing.
`geometry/rig/UV judgement` → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation/motion → `blockit-bedrock-animation`.
## Product Scope Firewall
Asset-only: BP/gameplay/pack OUT; RP visual/export; Animation Controller composition/preview; `resource_operations` **not a normal model-authoring route**.
## Mandatory Authoring Latch
Load router + matching current worktree specialist before mutation:
`router_loaded=YES | active_owner=GEOMETRY|TEXTURING|ANIMATION | specialist_loaded=YES | gate_satisfied=YES`.
Any `NO` → **DO NOT MUTATE**.
Geometry → approved image + Dimensions + user-selected strategy + Animation Required
UV → user Geometry APPROVED
Texture → Geometry APPROVED + UV Layout PASS
Animation → Texturing APPROVED + checkpoint + Animation Readiness Preflight → HANDOFF_REQUIRED
`HANDOFF_REQUIRED`: `target_phase`, `reason`, `readiness`, `resume_from`; Gateway `switch_authoring_phase` → same task/chat.
`approved image`=visual authority; Strategy: user-selected `DIRECT | 3D_ASSISTED`. `3D_ASSISTED` → Shape Reconstruction → PrimitiveAnything → cleanup. 1 Minecraft block = 16 Blockbench units; reuse `front_direction`.
## Fast Routing Contract
Normal asset work **must not begin by searching repository files**.
**Authoring Context Firewall:** Authoring Codex uses `workspace/active/<asset>/` as cwd, not `mcp/`; deeper MCP development rules are not authoring plan. Do **not** inspect tests/CI/source or run Bun/build/verifiers/deploy.
Existing → inspect only affected target/dependencies; broaden if unclear.
`ACTIVE STAGE + intent + known state/UUIDs → exact known Runtime capability → Gateway execution → reuse result`
## Authoring Stage Lock
`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.
## Tool Lane Discipline
```text
CORE / SHARED
project unknown → get_project_info
identity/hierarchy/detail → inspect_elements(mode=search|outline|detail)
visible/reference comparison  → capture_model_views
envelope/scale/ground OR bounded surface/contact review → inspect_model_bounds
UV/atlas readiness → list_textures
file deliverable → export_model
Animation boundary → switch_authoring_phase

GEOMETRY OWNER
3D-Assisted GLB → manage_geometry_reference
create normal bone/Group       → add_group
create/update Cubes            → manage_cubes(operation=create|update|batch_update)
Group/bone parent move         → reparent_element
Group pivot/rotation/visible   → modify_group
delete/rename                  → remove_element / rename_element
Locator/Null                   → manage_locator / manage_null_object
rig IK/mirror                  → bone_rigging
```
`bone_rigging` only for IK/mirror.
`validator://*` resources are Direct Runtime/Inspector only; a Gateway client must not search for or emulate them.
Known coherent Cubes → one `manage_cubes(operation=create, elements=[...])`; uncertainty → no batch.
Known Cubes sharing one deterministic TRANSLATE/RESIZE intent → derive absolute targets once from fresh state → `manage_cubes(operation=batch_update)`; never loop inspect→modify per Cube; reasoning-layer arithmetic; writes absolute/fail-closed. **Semantic cohort rule:** shared motion → Group; else siblings.
## First-Call Invariants
`add_group` → pass name OR groups, never both.
`manage_cubes update       → id + at least one authored field change`
`manage_cubes rotated create → origin required`
`manage_locator create → name+parent; update → id+authored change`
`manage_null_object create → name+parent; update → id+parent/position`
Validation failure repairs arguments for the **same capability**.
## Capability Discovery / Recovery
Capability discovery is deferred spec loading after routing.
known exact capability   → invoke directly
unknown/stale → one precise `search_capabilities` query, `limit=4`; `describe_capability` once before mutation.
One precise search miss → reformulate once; second miss → `BLOCKED`. A known foreign-phase capability is never a discovery miss: AUTHORING↔Animation uses handoff.
`INVALID_INPUT` → repair args; same capability. `TARGET_AMBIGUOUS` → resolve UUID once; `TARGET_NOT_FOUND` → focused identity lookup; `STALE_STATE` → one focused refresh; `NO_EFFECT` → diagnose payload; `CAPABILITY_MISMATCH` → handoff/BLOCKED; `OUTCOME_UNKNOWN` → inspect before retry.
Same routed failure twice without new evidence → `BLOCKED`.
## State Reuse / Anti-Loop
Fresh mutation → reuse state/`geometry_effect`; no confirmation readback. Do not automatically re-read fresh mutation targets with `inspect_elements(mode=detail)`; no status/discovery/bounds/capture progress checks.
`inspect_model_bounds` only for envelope/scale/ground/displacement or a diagnosed bounded surface/contact integrity question.
Skip `get_project_info` after create/export unless lifecycle state is unknown/stale.
`export_model`: `bedrock` JSON or `project` `.bbmodel`.
