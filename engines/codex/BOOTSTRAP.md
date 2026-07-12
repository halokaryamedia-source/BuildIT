# Codex + Blockbench MCP Bootstrap

## Goal

Build only what the approved package requires with the fewest safe reads, image payloads, model calls, and correction cycles while preserving visual accuracy. Production remains in one Codex session and one MCP session from project creation through final validation.

## Authority

Use the current repository and selected asset session. Reject downloaded context ZIPs, stale prompt packs, four-sheet workflows, three approval moments, and numbered `01_*`–`04_*` reference images with `LEGACY_SKILL_CONFLICT`.

Read `engines/codex/MODEL_ROUTING.md` before delegation.

## Routing preflight without user interruption

Inspect whether these optional custom roles are available:

```text
routine_auditor
mcp_builder
visual_director
critical_reviewer
```

When one is missing, record `CODEX_PROJECT_CONFIG_NOT_LOADED` as a routing warning and continue in the current session whenever safe:

- Terra parent performs mechanical audit directly;
- Terra parent remains the sole writer;
- parent performs bounded Reference Visual comparison;
- only a truly critical unresolved decision may stop for a missing critical capability.

Do not ask the user to create another Codex session during active production.

## Model routing

```text
normal implementation      → Terra Medium parent directly
large read-only audit      → routine_auditor / 5.4 Mini Low when available
fallback isolated writer   → mcp_builder / Terra Medium when available
visual judgment            → visual_director / Sol Medium when available
critical decision          → critical_reviewer / Sol High once when mandatory
```

- High is the maximum and remains rare.
- Never use Extra High, Max, Ultra, Fast, recursion, or parallel writers.
- Keep at most two open agent threads and depth one.
- Do not spawn a child for micro work.
- Exactly one active writer exists: Terra parent or `mcp_builder`, never both.
- Agent MCP allowlists plus the Blockbench write lease are the active-asset boundary.
- Deterministic gates replace model review whenever they can answer the question.

## Release preparation versus user testing

Repository maintainers run install, skills check, typecheck, all tests, build, bundle verification, session continuity tests, and Golden Sample initialization tests before declaring readiness.

The user MUST NOT be asked to run those internal checks. The user loads only the final built `mcp-blockbench/dist/mcp.js` once for the final acceptance test.

## Stable MCP session

The loaded plugin registers one stable full tool surface. Logical profiles remain execution guards, so stage-inappropriate calls still fail. Profile changes do not alter the connected client's tool list.

```text
stage/profile transition
→ release old lease
→ continue same MCP session
→ continue same Codex session
→ get_stage_context
→ acquire fresh current-stage lease
```

No stage transition, review, revision, or approval may require plugin reload, MCP reconnect, or Codex restart.

## Workspace

```text
workspace/active/<asset>/
├─ blockbench/   # canonical user-facing files
└─ mcp/          # canonical session root: state, contracts, checkpoints, evidence, reports
```

`workspace/workspace.json` is an index. Runtime authority is `workspace/active/<asset>/mcp/state.json`.

The tracked Golden Sample authority for acceptance is:

```text
docs/reference/golden-samples/black_rhinoceros
```

A clean acceptance workspace is initialized internally with:

```text
bun run workspace:sample -- black_rhinoceros --asset-id <fresh_asset_id> --display-name "Black Rhinoceros"
```

This copies only approved references and contracts. It MUST NOT copy any `.bbmodel`, checkpoint, evidence, previous runtime identity, or prior state.

## Zero-start asset startup

1. Initialize a fresh workspace from the Golden Sample when requested.
2. Confirm the canonical model path does not yet exist.
3. Use `workspace/active/<asset>/mcp` as the canonical session root.
4. Load `blockbench-production` plus the Geometry skill.
5. Use only MCP key `blockbench` at `http://localhost:3000/bb-mcp`.
6. When no project is open, create the Bedrock project through `create_project` and save it to the canonical model path.
7. Call `get_runtime_status` and `get_stage_context`.
8. Rebind identity automatically when required.
9. Select one writer and acquire the Geometry lease.
10. Do not ask the user to edit JSON, choose checkpoints, select profiles, select workers, reconnect, reload, or restart.

## Geometry flow

All Geometry work uses `BEDROCK_CUBOID_GEOMETRY`:

```text
create project from zero when absent
→ get_stage_context
→ rebind_active_project_identity when required
→ selected writer acquires manage_project_write_lease
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ bounded Geometry construction/correction
→ final five-view capture/analyze
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ lease released
→ user reviews one Geometry result
```

`analyze_geometry_views` persists canonical metrics/diff and requires the Geometry write lease. Ephemeral visual inspection does not persist evidence.

Use `visual_director` only when available and useful. Parent fallback performs the same compact comparison when it is unavailable; this does not require a new session.

Geometry evidence is bound to project UUID, compatibility fingerprint, transformed world-space signature, Reference Visual SHA-256, current five-view metrics, and visual decision. Hierarchy/group-transform changes require a new capture/analyze pass.

`submit_geometry_for_review` revalidates, creates the next unused review checkpoint, enters `GEOMETRY_REVIEW`, releases the writer lease, and remains in the same session.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes, not profiles. `PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are internal progress markers.

## Stage routing

| Stage | MCP profile | Skills | Writer |
| --- | --- | --- | --- |
| Geometry | `BEDROCK_CUBOID_GEOMETRY` | production + Geometry | selected Terra writer |
| Texture | `BEDROCK_CUBOID_TEXTURE` | production + Texture | selected Terra writer |
| Animation | `BEDROCK_CUBOID_ANIMATION` | production + Animation | selected Terra writer |
| Final Validation | `FINAL_VALIDATION_READONLY` | production + Validation | selected Terra writer for required writes |

Do not load Animation when skipped. Every transition stays in the same connected session.

## Completion and stop conditions

After final approval, promote the validated workspace through the workspace command. Completed baselines remain immutable while revisions are active.

Stop only for a real authority conflict, unavailable mandatory runtime, unsafe mutation, stale evidence that cannot be regenerated, failed review gate, lease conflict, or required user approval.

Do not scan ports, create alternate MCP keys, mix workspace areas, load deprecated skills, create duplicate/versioned outputs, or ask the user to test internal components.
