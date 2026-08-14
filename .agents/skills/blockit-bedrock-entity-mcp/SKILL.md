---
name: blockit-bedrock-entity-mcp
description: BlockIT Bedrock Entity asset router. Route from intent + known state + stage, then load/call the exact tool.
---

# BlockIT Bedrock Entity MCP

Use for **asset authoring**, not plugin/repository development. Target `bedrock`.

## Fast Routing Contract

Normal asset work **must not begin by searching repository files**/source/docs. This skill is the **routing authority for the first tool decision**.

```text
intent + known state/UUIDs + stage → route
→ loaded exact tool or one precise native tool_search
→ execute → reuse state
```

Do not use Graphify, Obsidian, GitHub/code search for tool choice.

## Persistent Workspace Continuity

When the user names or resumes a persistent repo-backed asset and `workspace/active/<project>/README.md` exists, read **that project README only**, then open only the current `.bbmodel`/reference/assets needed for the next decision. This is continuity, not broad repository discovery.

```text
known project
→ workspace/active/<project>/README.md
→ current model + needed evidence only
→ intent + known state + stage
→ route
```

Do not scan every folder under `workspace/active/`. Stored paths/prose are not visual evidence; reference judgement still requires the actual approved image visible in active context.

If persistent work has no package yet, create one only when persistence is actually wanted. No manifest JSON, geometry blueprint, checkpoint log, or duplicate versioned `.bbmodel` copies are required. `workspace/README.md` owns storage rules.

## Authoring Stage Lock

`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`

`DISCOVER` only for unknown/stale state; **known fresh state must not regress** there. Reuse mutation output.

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

Texture/Paint/PBR → `blockit-bedrock-texturing`. Animation/keyframe/rig → `blockit-bedrock-animation`.

## Search Intent Templates

`tool_search` is **deferred spec loading after routing**, not a second router. If the **exact tool spec is already loaded, skip search**. Otherwise use the **exact selected tool name** + action; **never send raw user wording alone**.

`place_cube` → `"place_cube create new Bedrock Cube geometry"`.

Use **one precise native `tool_search`**. If it misses, **reformulate once** with the same name; **a second miss is `BLOCKED`**. Do not issue multiple exploratory tool searches.

## Deterministic Recovery

Failure does not reopen tool selection by default.

```text
schema/validation failure → INVALID_INPUT    → repair args; same tool; no search
"ambiguous" target        → TARGET_AMBIGUOUS → resolve UUID once; same tool
"not found" unknown ref   → TARGET_NOT_FOUND → focused identity lookup; same tool
known UUID now not found  → STALE_STATE      → one focused refresh; same tool
[NO_EFFECT]/no authored effect → NO_EFFECT   → change diagnosis/payload; never resend
unsupported capability/format → CAPABILITY_MISMATCH → reroute once or BLOCKED
```

Recovery reads only missing decision state. Same failed causal direction twice without new evidence → `BLOCKED`.

## State Shortcuts / Anti-Loop

- Known UUID/identity → skip discovery unless stale/ambiguous.
- Fresh mutation → skip readback; reuse returned state/`geometry_effect`.
- Locator/Null mutations return state. **Do not automatically re-read them with `inspect_element`** unless insufficient/stale/inconsistent.
- **Do not immediately call `get_project_info`** after create/export unless missing fields/external change matter.
- Known tool spec already loaded → call it; do not repeat `tool_search` on a new turn.
- Failed/no-effect correction → never repeat the same payload; diagnose first.
- Known workspace package → do not rediscover project identity from the whole repository.

```text
known target UUID            ≠ discovery
known workspace project      ≠ workspace scan
geometry targeting           ≠ get_selection
asset tool selection         ≠ repository/code search
```

**Load specialists lazily**: geometry → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`.

## Minimum Necessary Evidence

- **Do not inspect every newly placed Cube.** Inspect only diagnosed/ambiguous or numeric correction state.
- Do not capture after every mutation; use meaningful visual gates.
- **Use `inspect_model_bounds` only when** numeric envelope, scale, ground, displacement, or gross placement is the question.
- `UNVERIFIED` is not a retry command. **Mutation count alone is not a checkpoint trigger.**

## Visual / Blocker Boundary

Reference fidelity: **`FAIL / UNVERIFIED / PASS`**; tool success cannot upgrade it. Use **`BLOCKED`** for unsupported/exhausted/repeated speculative work. **Do not continue speculative mutation** merely to avoid a blocker.

## Downstream / Export

production texture/animation waits for accepted dependencies. Existing-asset work may use geometry as baseline without certifying it.

`export_model` supports:
- Bedrock geometry JSON (`bedrock`);
- editable `.bbmodel` (`project`).

For persistent work, keep the current editable `.bbmodel` and deliberate exports inside the same `workspace/active/<project>/` package. Prefer one current model file; Git history owns older revisions. Update the compact project README only when the current next step or real blocker changes.

Missing native capability stays explicit; do not emulate it with generic Mesh, `risky_eval`, UI automation, Hytale, or another format.