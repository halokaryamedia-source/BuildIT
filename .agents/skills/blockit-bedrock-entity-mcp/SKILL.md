---
name: blockit-bedrock-entity-mcp
description: BlockIT Bedrock Entity asset router. Decide from intent + known state; call a loaded exact tool or one precise native tool_search. Never repo-search for normal tool selection.
---

# BlockIT Bedrock Entity MCP

Use for **asset authoring**, not plugin/repository development. Target `bedrock`.

## Fast Routing Contract

Normal asset work must not begin by searching repository files/source/docs, skill maps, or all MCP tools. This skill is the routing authority for the first tool decision.

```text
intent + known state/UUIDs + stage
→ select route
→ loaded tool: call it; else one precise native tool_search
→ execute → reuse state
```

Do not use Graphify, Obsidian, GitHub/code search, or broad file discovery to choose a normal asset tool. A reproduced MCP/plugin defect becomes repository work.

## Tool Lane Discipline

```text
no project                    → create_project
lifecycle unknown             → get_project_info
create bone/Group             → add_group
create Cube                   → place_cube
target identity unknown       → find_elements_by_criteria
hierarchy question            → list_outline
known target detail           → inspect_element
one known existing Cube fix   → modify_cube
several known Cube fixes      → modify_cubes_batch
visible/reference comparison  → capture_model_views
numeric envelope/scale/ground → inspect_model_bounds
Locator/Null identity unknown → list_locator_elements
known Locator/Null create/edit→ manage_locator / manage_null_object
recover change                → undo / redo
file deliverable              → export_model
```

Texture/Paint/PBR/material instance → texturing specialist. Animation/keyframe/rig → animation specialist. Do not search alternatives after intent + state selects a route.

## Search Intent Templates

```text
place_cube         → "create new Bedrock Cube geometry"
modify_cube        → "modify one existing Bedrock Cube transform"
modify_cubes_batch → "batch modify several known Bedrock Cubes"
find_elements...   → "find Bedrock Cube or Group by criteria"
inspect_element    → "inspect one known Bedrock element authored state"
list_outline       → "list Bedrock Cube Group hierarchy"
```

For texture/animation/Locator include exact action (`create/edit/inspect/list/update`), not only the domain. If the exact tool spec is already loaded, skip search. Do not issue multiple exploratory tool searches when one precise search returns the intended tool.

## State Shortcuts

- Known UUID/identity → skip discovery unless stale/ambiguous.
- Fresh create/mutation state → skip immediate readback; reuse returned state/`geometry_effect`.
- Locator/Null mutations return state. **Do not automatically re-read them with `inspect_element`** unless insufficient/stale/inconsistent.
- Create/path export returns lifecycle state. **Do not immediately call `get_project_info`** unless missing fields/external change matter.
- Known tool spec already loaded → call it; do not repeat `tool_search` on a new turn.

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
geometry/hierarchy/pivots → blockbench-bedrock-modelling
texture/Paint/PBR         → blockit-bedrock-texturing
animation/keyframes       → blockit-bedrock-animation
```

## Minimum Necessary Evidence

- **Do not inspect every newly placed Cube.** Inspect only diagnosed/ambiguous or numeric correction state.
- Do not capture after every mutation; use meaningful visual gates.
- **Use `inspect_model_bounds` only when** numeric envelope, scale, ground, displacement, or gross placement is the question.
- `UNVERIFIED` is not a retry command. Mutation count alone is not a checkpoint trigger.
- Batch only one coherent decision over known targets.

## Visual / Blocker Boundary

Reference fidelity: **`FAIL / UNVERIFIED / PASS`**. Tool success cannot upgrade it. Use **`BLOCKED`** for unsupported evidence/capability or repeated speculative correction. **Do not continue speculative mutation** merely to avoid a blocker.

## Downstream / Export

Production texture/animation waits for accepted dependencies. **Existing asset** texture/animation-only work may use current geometry as user baseline without certifying it.

`export_model` supports:
- Bedrock geometry JSON (`bedrock`);
- editable `.bbmodel` (`project`).

Prefer metadata-only path output unless content is required. Missing native capability stays explicit; do not emulate it with generic Mesh, `risky_eval`, UI automation, Hytale, or another format.
