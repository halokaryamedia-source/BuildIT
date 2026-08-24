---
name: blockit-bedrock-entity-mcp
description: BlockIT Bedrock Entity asset router. Route from intent + known state + stage, then load/call the exact tool.
---

# BlockIT Bedrock Entity MCP

Use for **asset authoring**, not plugin development. Target `bedrock`.

## Fast Routing Contract

Normal asset work **must not begin by searching repository files**. This skill is the **routing authority for the first tool decision**.

`intent + known state/UUIDs + stage → route → exact tool / one precise native tool_search → execute → reuse fresh state`

Do not use Graphify, Obsidian, GitHub/code search for tool choice. Known project → only `workspace/active/<project>/README.md` + files needed now.

## Authoring Stage Lock

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`

`DISCOVER` is only for unknown/stale state; **known fresh state must not regress** there.

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

Texture/PBR → `blockit-bedrock-texturing`; animation/rig → `blockit-bedrock-animation`; geometry judgement → `blockbench-bedrock-modelling`. **Known coherent Cubes** → `place_cube(elements=[...])`; uncertainty → no batch.

## Search Intent Templates

`tool_search` is **deferred spec loading after routing**. If the **exact tool spec is already loaded, skip search**. Otherwise use the **exact selected tool name** + action; **never send raw user wording alone**. Example: `"place_cube create new Bedrock Cube geometry"`.

Use **one precise native `tool_search`**. Miss → **reformulate once** with the same name; **a second miss is `BLOCKED`**. Do not issue multiple exploratory tool searches.

## Deterministic Recovery

Failure does not reopen tool selection by default.

```text
validation      → INVALID_INPUT       → repair args; same tool; no search
ambiguous       → TARGET_AMBIGUOUS    → resolve UUID once; same tool
unknown missing → TARGET_NOT_FOUND    → focused identity lookup; same tool
known UUID gone → STALE_STATE         → one focused refresh; same tool
no effect       → NO_EFFECT           → change diagnosis/payload; never resend
unsupported     → CAPABILITY_MISMATCH → reroute once or BLOCKED
```

Read only missing decision state. Same causal direction failing twice without new evidence → `BLOCKED`.

## State Shortcuts / Anti-Loop

- Known UUID/identity → skip discovery unless stale/ambiguous.
- Known tool spec already loaded → call it; do not repeat `tool_search`.
- Fresh mutation → reuse returned state/`geometry_effect`; no ritual readback.
- Locator/Null mutations return state. **Do not automatically re-read them with `inspect_element`** unless insufficient/stale.
- Skip `get_project_info` after create/export unless required.

```text
known target UUID            ≠ discovery
known workspace project      ≠ workspace scan
geometry targeting           ≠ get_selection
asset tool selection         ≠ repository/code search
```

## Minimum Necessary Evidence

**Do not inspect every newly placed Cube. Do not capture after every mutation.** Reuse fresh state from `place_cube`/`modify_cube` for correction. Use `inspect_model_bounds` only when envelope/scale/ground/displacement matters. `UNVERIFIED` is not a retry command — for non-reference tasks treat it as `PROVISIONAL` hypothesis and continue; mutation count is not a checkpoint trigger.

## Visual / Blocker Boundary

Reference fidelity: **`FAIL / UNVERIFIED / PASS`** (reference-driven). For non-reference direct tasks, `UNVERIFIED` is `PROVISIONAL` and work continues with a marked hypothesis. Tool success cannot upgrade visual `PASS`. Unsupported/exhausted work → `BLOCKED`; do not mutate speculatively to avoid a blocker.

## Downstream / Export

Production texture/animation waits for dependent geometry `PASS`; required `UNVERIFIED` → `BLOCKED`. Existing geometry may be a task baseline without certifying accuracy.

`export_model`: Bedrock JSON (`bedrock`) or editable `.bbmodel` (`project`). Persistent work keeps one current `.bbmodel` + deliberate exports; Git history owns old revisions.

Missing native capability stays explicit; do not emulate with generic Mesh, `risky_eval`, UI automation, Hytale, or another format.
