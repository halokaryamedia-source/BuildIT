---
name: blockit-bedrock-entity-mcp
description: Lightweight BlockIT Bedrock Entity asset orchestrator. Decide from current intent + known state, route to the smallest capability, and use native tool_search only when its tool spec is not already loaded. Do not search repository files for normal asset work.
---

# BlockIT Bedrock Entity MCP

Use for **asset authoring**, not plugin/repository development. Target Blockbench `bedrock`; normal geometry is Cubes in Groups/bones.

## Fast Routing Contract

Normal asset work must not begin by searching repository files, source, docs, skill maps, or all MCP tools. This skill is the routing authority for the first tool decision.

```text
intent + known returned state/UUIDs + authoring stage
→ choose one semantic route
→ call an already-loaded exact tool, otherwise one precise native tool_search
→ execute → reuse returned state
```

Do not use Graphify, Obsidian, GitHub/code search, or broad file discovery to choose a normal Blockbench asset tool. A reproduced MCP/plugin/source defect becomes repository work.

## Tool Lane Discipline

Use the narrowest matching row; do not search alternatives after intent/state already selects a route.

| Intent / state | Primary route | Avoid |
|---|---|---|
| no valid authoring project | `create_project` | project/source docs |
| lifecycle facts actually unknown | `get_project_info` | ritual reread |
| create bone/Group | `add_group` | Cube hierarchy hacks |
| create new Cube geometry | `place_cube` | modify nonexistent geometry |
| target identity unknown; attributes/name/scope known | `find_elements_by_criteria` | broad outline/file search |
| hierarchy/parent structure is the question | `list_outline` | inspect whole tree |
| exact state of one known target needed | `inspect_element` | broad discovery |
| correct one known existing Cube | `modify_cube` | `place_cube`, selection targeting |
| coherent correction over several known Cubes | `modify_cubes_batch` | speculative batching |
| visible shape/reference comparison | `capture_model_views` | bounds as visual approval |
| numeric envelope/scale/ground/displacement | `inspect_model_bounds` | routine visual checks |
| texture lifecycle/identity/image evidence | texture tools; texturing specialist only for judgement | geometry discovery |
| Paint/PBR/material instance | texturing specialist → precise tool search | generic raw face helpers |
| animation/keyframe/rig | animation specialist → precise tool search | geometry/texture keyword overlap |
| Locator/Null Object identity unknown | `list_locator_elements` | full element tree |
| create/update known Locator/Null Object | `manage_locator` / `manage_null_object` | ritual reread |
| recover authored change | `undo` / `redo`; checkpoint only when rollback matters | manual rebuild |
| requested file deliverable | `export_model` | routine export checkpoint |

## Search Intent Templates

Search for the **semantic action**, not a broad topic. If the exact tool spec is already loaded, skip search.

```text
create Cube               → "create new Bedrock Cube geometry"
modify one Cube           → "modify one existing Bedrock Cube transform"
modify several Cubes      → "batch modify several known Bedrock Cubes"
find target               → "find Bedrock Cube or Group by criteria"
read one target           → "inspect one known Bedrock element authored state"
hierarchy                 → "list Bedrock Cube Group hierarchy"
visual comparison         → "capture canonical model views"
numeric envelope          → "inspect model bounds scale ground displacement"
texture/animation/locator → include exact operation (create/edit/inspect/list/update), not only the domain word
export                    → "export Bedrock geometry or editable bbmodel"
```

Do not issue multiple exploratory tool searches when one precise search already returns the intended tool.

## State Shortcuts

- Known UUID/identity → skip outline/search/selection discovery unless stale or ambiguous.
- Fresh create/mutation state → skip immediate `inspect_element`.
- `modify_cube` / `modify_cubes_batch` already return before/after + `geometry_effect`; continue from that state.
- `manage_locator` / `manage_null_object` return resulting state. **Do not automatically re-read them with `inspect_element`** unless insufficient/stale/inconsistent.
- `create_project` and path-writing `export_model` return lifecycle state. **Do not immediately call `get_project_info`** unless missing fields/external change matter.
- Known tool spec already loaded → call it; do not repeat `tool_search` merely because a new turn started.

## Negative Routing

```text
existing geometry correction ≠ place_cube
known target UUID            ≠ discovery
focused detail               ≠ list_outline
hierarchy question           ≠ inspect every element
geometry targeting           ≠ get_selection
visual fidelity              ≠ bounds alone
successful mutation          ≠ visual PASS
asset tool selection         ≠ repository/code search
```

## Specialist Loading

**Load specialists lazily** and only when judgement changes the decision:

```text
geometry / silhouette / hierarchy / pivots → blockbench-bedrock-modelling
texture / Paint / PBR / material_instance  → blockit-bedrock-texturing
animation / keyframes / particles           → blockit-bedrock-animation
```

Do not load a specialist merely to discover a tool name already selected above.

## Minimum Necessary Evidence

- Do not inspect every new Cube; inspect a diagnosed/ambiguous target or numeric correction state.
- Do not capture after every mutation; capture at meaningful visual gates and only affected view(s) after local correction.
- **Use `inspect_model_bounds` only when** numeric envelope, scale, ground, displacement, or gross placement is the current question.
- `UNVERIFIED` is not a retry command; seek evidence only when it can change the decision.
- Mutation count alone is not a checkpoint trigger.
- Batch only one coherent decision over known targets.

## Visual / Blocker Boundary

Reference fidelity belongs to `blockbench-bedrock-modelling` and uses difference-first **`FAIL / UNVERIFIED / PASS`**. Tool success, bounds, hierarchy, or validator success cannot upgrade the verdict.

Use **`BLOCKED`** when continuation requires unsupported evidence/capability or repeated speculative correction. Do not mutate speculatively merely to avoid a blocker.

## Downstream / Export

Production texture waits for geometry it depends on to pass; production animation waits for accepted participating geometry/hierarchy/pivots. Existing-asset texture-only or animation-only work may treat current geometry as the user baseline without certifying it.

`export_model` supports:
- Bedrock geometry JSON (`bedrock`);
- editable `.bbmodel` (`project`).

For path writes, prefer metadata-only output unless returned file content is required. Missing native capability must remain explicit rather than being emulated through generic Mesh, `risky_eval`, arbitrary UI automation, Hytale, or another format.
