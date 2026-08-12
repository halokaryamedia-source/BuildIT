---
name: blockit-bedrock-entity-mcp
description: Compact BlockIT Bedrock Entity asset orchestrator. Decide from intent + known state, route to the smallest capability, and use native tool_search only when the exact tool spec is not already loaded. Never search repository files for normal asset tool selection.
---

# BlockIT Bedrock Entity MCP

Use for **asset authoring**, not plugin/repository development. Target Blockbench `bedrock`.

## Fast Routing Contract

Normal asset work must not begin by searching repository files, source, docs, skill maps, or all MCP tools. This skill is the routing authority for the first tool decision.

```text
intent + known state/UUIDs + stage
→ select route
→ loaded exact tool: call it
→ otherwise one precise native tool_search
→ execute → reuse returned state
```

Do not use Graphify, Obsidian, GitHub/code search, or broad file discovery to choose a normal asset tool. A reproduced MCP/plugin defect becomes repository work.

## Tool Lane Discipline

```text
no valid project                         → create_project
lifecycle facts unknown                  → get_project_info
create bone/Group                        → add_group
create new Cube geometry                 → place_cube
target identity unknown; criteria known  → find_elements_by_criteria
hierarchy/parent structure is question   → list_outline
exact state of one known target needed   → inspect_element
correct one known existing Cube          → modify_cube
coherent correction over known Cubes     → modify_cubes_batch
visible shape/reference comparison       → capture_model_views
numeric envelope/scale/ground question   → inspect_model_bounds
Locator/Null Object identity unknown     → list_locator_elements
create/update known Locator/Null Object  → manage_locator / manage_null_object
recover authored change                  → undo / redo
requested file deliverable               → export_model
```

Texture/Paint/PBR/material-instance judgement → load texturing specialist. Animation/keyframe/rig judgement → load animation specialist. Do not search alternatives after intent + state already selects a route.

## Search Intent Templates

Search for the semantic action, not a broad domain word:

```text
place_cube             → "create new Bedrock Cube geometry"
modify_cube            → "modify one existing Bedrock Cube transform"
modify_cubes_batch     → "batch modify several known Bedrock Cubes"
find_elements...       → "find Bedrock Cube or Group by criteria"
inspect_element        → "inspect one known Bedrock element authored state"
list_outline           → "list Bedrock Cube Group hierarchy"
capture_model_views    → "capture canonical model views"
inspect_model_bounds   → "inspect model bounds scale ground displacement"
```

For texture/animation/Locator work include the exact action (`create/edit/inspect/list/update`), not only the domain. If the exact tool spec is already loaded, skip search. Do not issue multiple exploratory tool searches when one precise search returns the intended tool.

## State Shortcuts

- Known UUID/identity → skip discovery unless stale/ambiguous.
- Fresh create/mutation state → skip immediate readback.
- `modify_cube` / `modify_cubes_batch` return before/after + `geometry_effect`; continue from it.
- Locator/Null mutations return resulting state. **Do not automatically re-read them with `inspect_element`** unless insufficient/stale/inconsistent.
- Create/path export returns lifecycle state. **Do not immediately call `get_project_info`** unless missing fields/external change matter.
- Known tool spec already loaded → call it; do not repeat `tool_search` merely because a new turn started.

```text
existing geometry correction ≠ place_cube
known target UUID            ≠ discovery
focused detail               ≠ list_outline
geometry targeting           ≠ get_selection
visual fidelity              ≠ bounds alone
asset tool selection         ≠ repository/code search
```

## Specialist Loading

**Load specialists lazily** only when judgement changes the decision:

```text
geometry / silhouette / hierarchy / pivots → blockbench-bedrock-modelling
texture / Paint / PBR / material_instance  → blockit-bedrock-texturing
animation / keyframes / particles           → blockit-bedrock-animation
```

Do not load a specialist merely to discover a tool name already selected above.

## Minimum Necessary Evidence

- **Do not inspect every newly placed Cube.** Inspect a diagnosed/ambiguous target or numeric correction state.
- Do not capture after every mutation; use meaningful visual gates.
- **Use `inspect_model_bounds` only when** numeric envelope, scale, ground, displacement, or gross placement is the question.
- `UNVERIFIED` is not a retry command. Mutation count alone is not a checkpoint trigger.
- Batch only one coherent decision over known targets.

## Visual / Blocker Boundary

Reference fidelity belongs to `blockbench-bedrock-modelling` and uses **`FAIL / UNVERIFIED / PASS`**. Tool success cannot upgrade the verdict.

Use **`BLOCKED`** when continuation requires unsupported evidence/capability or repeated speculative correction. **Do not continue speculative mutation** merely to avoid a blocker.

## Downstream / Export

Production texture waits for dependent geometry to pass; production animation waits for accepted participating geometry/hierarchy/pivots. Existing-asset texture/animation-only work may treat current geometry as user baseline without certifying it.

`export_model` supports:
- Bedrock geometry JSON (`bedrock`);
- editable `.bbmodel` (`project`).

Prefer metadata-only path output unless file content is required. Missing native capability stays explicit; do not emulate it with generic Mesh, `risky_eval`, UI automation, Hytale, or another format.
