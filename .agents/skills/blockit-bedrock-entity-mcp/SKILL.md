---
name: blockit-bedrock-entity-mcp
description: Lightweight orchestrator for BlockIT Minecraft Bedrock Entity asset authoring. Decide the current authoring intent from known task state, route directly to the smallest matching capability, and use native tool_search only to load the needed MCP spec. Do not search repository files for normal asset work.
---

# BlockIT Bedrock Entity MCP

Use for **asset authoring**, not plugin/repository development. Target Blockbench `bedrock`; normal geometry is Cubes organized by Groups/bones.

## Fast Routing Contract

Normal asset work must not begin by searching repository files, source, docs, skill maps, or all MCP tools. This skill is the routing authority for the first tool decision.

For every step:

```text
current user intent
+ known returned state / known UUIDs
+ current authoring stage
→ choose one semantic route below
→ if the exact tool spec is already loaded, call it directly
→ otherwise use one precise native tool_search query for that route
→ execute
→ reuse returned state for the next decision
```

Do not use Graphify, Obsidian, GitHub/code search, or broad file discovery to decide a normal Blockbench asset tool. A reproduced MCP/plugin/source defect leaves asset authoring and becomes repository work.

## Deterministic Capability Routes

Use the narrowest matching row. Do not search for alternatives once the current intent/state already selects a route.

| Current intent / state | Primary route | Avoid |
|---|---|---|
| create/open authoring lifecycle and no valid project exists | `create_project` | reading project/source docs |
| project lifecycle facts are actually unknown | `get_project_info` | ritual reread after create/export |
| create a new bone/Group | `add_group` | using Cube tools for hierarchy |
| create new Cube geometry | `place_cube` | `modify_cube` for nonexistent geometry |
| target identity unknown; attributes/name/scope are known | `find_elements_by_criteria` | broad outline/file search |
| hierarchy/parent structure itself is the question | `list_outline` | `inspect_element` for the whole tree |
| exact authored state of one known target is needed | `inspect_element` | broad discovery |
| correct one known existing Cube | `modify_cube` | `place_cube`, selection targeting |
| one coherent correction spans several known Cubes | `modify_cubes_batch` | batching unknown/speculative geometry |
| compare visible shape/reference | `capture_model_views` | bounds as visual approval |
| numeric envelope/scale/ground/displacement is the question | `inspect_model_bounds` | routine visual checking |
| texture lifecycle/identity/image evidence | texture tools; load texturing specialist only if judgement is needed | geometry discovery |
| Paint/PBR/material-instance work | texturing specialist → precise native tool search | generic raw per-face material helpers |
| animation/keyframe/rig work | animation specialist → precise native tool search | geometry or texture tools by keyword overlap |
| Locator/Null Object identity unknown | `list_locator_elements` | full element tree |
| create/update known Locator or Null Object | `manage_locator` / `manage_null_object` | confirmation reread by ritual |
| recover latest authored change | `undo` / `redo`; checkpoint only when rollback value is meaningful | rebuilding state manually |
| produce requested file deliverable | `export_model` | export as a routine checkpoint |

## Search Intent Templates

When native `tool_search` is needed, search for **the semantic action**, not the user's broad topic. Prefer one query that distinguishes competing tools.

```text
new Cube geometry                         → "create new Bedrock Cube geometry"
one existing Cube correction             → "modify one existing Bedrock Cube transform"
several known Cube corrections            → "batch modify several known Bedrock Cubes"
find target by name/type/parent/size      → "find Bedrock Cube or Group by criteria"
read one known element state              → "inspect one known Bedrock element authored state"
model hierarchy                           → "list Bedrock Cube Group hierarchy"
reference-visible comparison              → "capture canonical model views"
numeric model envelope                    → "inspect model bounds scale ground displacement"
texture/Paint/PBR/material instance       → state the exact texture operation, not merely "texture"
animation/keyframe/rig                     → state create/edit/inspect + exact animation operation
Locator/Null Object                        → state list/create/update + Locator or Null Object explicitly
export                                     → "export Bedrock geometry or editable bbmodel"
```

Do not issue multiple exploratory tool searches when one precise search already returns the intended tool. If a known exact tool is already loaded, skip search entirely.

## State Shortcuts

State is part of routing. Reuse it before asking for more evidence.

- Known UUID/identity → skip `list_outline`, `find_elements_by_criteria`, and selection-based discovery unless identity became stale/ambiguous.
- Fresh create/mutation result already contains the needed authored state → skip immediate `inspect_element`.
- `modify_cube` / `modify_cubes_batch` already return before/after plus `geometry_effect` → use that result for continuation.
- `manage_locator` / `manage_null_object` already return resulting authored state → do not reread unless insufficient/stale/inconsistent.
- `create_project` and path-writing `export_model` already return lifecycle state → do not immediately call `get_project_info`.
- Known tool spec already loaded → call it; do not invoke `tool_search` again merely because a new turn started.

## Negative Routing

These contrasts prevent high-cost or wrong-tool branches:

```text
existing geometry correction  ≠ place_cube
known target UUID             ≠ discovery
focused detail                ≠ list_outline
hierarchy question            ≠ inspect every element
geometry targeting            ≠ get_selection
visual fidelity               ≠ inspect_model_bounds alone
successful mutation           ≠ visual PASS
asset tool selection          ≠ repository/code search
```

## Specialist Loading

Load specialists lazily and only when their judgement changes the decision:

```text
geometry / silhouette / hierarchy / pivots → blockbench-bedrock-modelling
texture / Paint / PBR / material_instance  → blockit-bedrock-texturing
animation / keyframes / particles           → blockit-bedrock-animation
```

Do not load a specialist merely to discover a tool name already selected by the routing table.

## Minimum Necessary Evidence

- Do not inspect every newly placed Cube; inspect only a diagnosed/ambiguous target or numeric correction state.
- Do not capture after every mutation; capture at a meaningful visual gate and only affected reference-corresponding view(s) after local correction.
- `UNVERIFIED` is not a retry command; seek more evidence only when it can change the decision.
- Mutation count alone is not a checkpoint trigger.
- Batch only one coherent decision spanning known targets.

## Visual / Blocker Boundary

Reference fidelity belongs to `blockbench-bedrock-modelling` and uses difference-first **`FAIL / UNVERIFIED / PASS`**. Tool success, bounds, hierarchy, or validator success cannot upgrade the verdict.

Use **`BLOCKED`** when valid continuation requires unsupported evidence/capability or repeated speculative correction. Do not continue speculative mutation merely to avoid a blocker.

## Downstream / Export

For end-to-end reference work, production texture waits for the geometry it depends on to pass; production animation waits for accepted participating geometry/hierarchy/pivots. Existing-asset texture-only or animation-only tasks may treat current geometry as the user baseline without certifying it.

`export_model` supports Bedrock geometry JSON (`bedrock`) and editable `.bbmodel` (`project`). When writing a path, prefer metadata-only output unless returned file content is actually required.

Missing native capability must remain explicit rather than being emulated through generic Mesh, `risky_eval`, arbitrary UI automation, Hytale, or another format.
