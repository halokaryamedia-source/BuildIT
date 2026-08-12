---
name: blockit-bedrock-entity-mcp
description: BlockIT Bedrock Entity asset router. Decide from intent + known state + stage; call a loaded tool or one precise native tool_search.
---

# BlockIT Bedrock Entity MCP

Use for **asset authoring**, not plugin/repository development. Target `bedrock`.

## Fast Routing Contract

Normal asset work must not begin by searching repository files/source/docs or skill maps. This skill is the routing authority for the first tool decision.

```text
intent + known state/UUIDs + stage → route
→ loaded tool or one precise native tool_search
→ execute → reuse state
```

Do not use Graphify, Obsidian, GitHub/code search, or broad file discovery to choose a normal asset tool.

## Authoring Stage Lock

Decision state only:

```text
DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE
```

`DISCOVER` only for required unknown/stale state; known fresh state must not regress there. `AUTHOR` reuses mutation output. `VERIFY` gets only decision-changing evidence. `CORRECT` requires a diagnosed cause/invariant and returns to `VERIFY`. `DONE` stops until scope/evidence changes.

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

Texture/Paint/PBR → `blockit-bedrock-texturing`. Animation/keyframe/rig → `blockit-bedrock-animation`. Do not search alternatives after intent + state selects a route.

## Search Intent Templates

`tool_search` is **deferred spec loading after routing**, not a second semantic router. If the exact tool spec is already loaded, skip search. Otherwise the query must begin with the **exact selected tool name**, followed by a short semantic action; never send raw user wording alone.

```text
place_cube         → "place_cube create new Bedrock Cube geometry"
modify_cube        → "modify_cube modify one existing Bedrock Cube transform"
modify_cubes_batch → "modify_cubes_batch batch modify known Bedrock Cubes"
list_outline       → "list_outline list Bedrock Cube Group hierarchy"
manage_locator     → "manage_locator create update Bedrock Locator"
export_model       → "export_model export Bedrock geometry bbmodel"
```

Use **one precise native `tool_search`**. If it misses, reformulate once while retaining the exact selected tool name; a second miss is `BLOCKED`. Do not issue multiple exploratory tool searches. Validation failure keeps the selected tool unless identity/state became unknown/stale.

## State Shortcuts / Anti-Loop

- Known UUID/identity → skip discovery unless stale/ambiguous.
- Fresh mutation → skip readback; reuse returned state/`geometry_effect`.
- Locator/Null mutations return state. **Do not automatically re-read them with `inspect_element`** unless insufficient/stale/inconsistent.
- Create/path export returns lifecycle state. **Do not immediately call `get_project_info`** unless missing fields/external change matter.
- Known tool spec already loaded → call it; do not repeat `tool_search` on a new turn.
- Failed/no-effect correction → never repeat the same payload; diagnose first. Same causal direction failing twice without new evidence → `BLOCKED`.

```text
known target UUID            ≠ discovery
geometry targeting           ≠ get_selection
asset tool selection         ≠ repository/code search
```

**Load specialists lazily** only when needed: geometry → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`.

## Minimum Necessary Evidence

- **Do not inspect every newly placed Cube.** Inspect only diagnosed/ambiguous or numeric correction state.
- Do not capture after every mutation; use meaningful visual gates.
- **Use `inspect_model_bounds` only when** numeric envelope, scale, ground, displacement, or gross placement is the question.
- `UNVERIFIED` is not a retry command. Mutation count alone is not a checkpoint trigger.
- Batch only one coherent decision over known targets.

## Visual / Blocker Boundary

Reference fidelity: **`FAIL / UNVERIFIED / PASS`**. Tool success cannot upgrade it. Use **`BLOCKED`** for unsupported capability/evidence, exhausted search, or repeated speculative correction. **Do not continue speculative mutation** merely to avoid a blocker.

## Downstream / Export

production texture/animation waits for accepted dependencies. **Existing asset** texture/animation-only work may use current geometry as user baseline without certifying it.

`export_model` supports:
- Bedrock geometry JSON (`bedrock`);
- editable `.bbmodel` (`project`).

Missing native capability stays explicit; do not emulate it with generic Mesh, `risky_eval`, UI automation, Hytale, or another format.
