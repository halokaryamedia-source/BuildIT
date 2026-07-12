# Codex + Blockbench MCP Bootstrap

## Goal

Build only what the approved package requires using the fewest safe reads, tools, image payloads, model calls, and correction cycles while preserving visual accuracy.

## Authority

Use the current repository and selected asset session. Reject downloaded project-context ZIPs, stale prompt packs, four-sheet workflows, three approval moments, and numbered `01_*`–`04_*` reference images with `LEGACY_SKILL_CONFLICT`.

Read `engines/codex/MODEL_ROUTING.md` before delegating. The project defaults the parent to Luna Medium, but an explicit model selected by the user affects only the parent thread. Route work through the locked custom agents without asking the user to change models.

## Model routing

```text
routine read-only work     → routine_auditor / 5.4 Mini Low
standard implementation    → mcp_builder / Terra Medium
visual judgment            → visual_director / Sol Medium
critical decision          → critical_reviewer / Sol High, once
```

- High is the maximum effort and must remain rare.
- Never use xhigh, Extra High, Max, Ultra, Fast mode, recursive delegation, or parallel MCP writers.
- Keep at most two agent threads and one level of delegation.
- `mcp_builder` is the only role allowed to own the Blockbench write lease or mutate an active asset.
- Use deterministic validation instead of Sol whenever a gate can answer the question.
- Do not spawn a worker for a micro-task when direct execution is cheaper.

## One-time plugin build

After repository source changes, build once:

```powershell
cd mcp-blockbench
bun install --frozen-lockfile
bun run skills:check
bun run typecheck
bun test
bun run build
cd ..
```

Load `mcp-blockbench/dist/mcp.js`. Do not search for alternate outputs.

This reload is required only when the plugin binary changes. Normal Geometry revision does not require closing the model, switching profiles, or reconnecting.

## Workspace

```text
workspace/active/<asset>/
├─ blockbench/   # canonical model, textures, references, previews
└─ mcp/          # state, contracts, checkpoints, evidence, reports
```

`workspace/workspace.json` is an index. Runtime authority is `workspace/active/<asset>/mcp/state.json`.

## Asset startup

1. Resolve the selected asset and exact model/session paths.
2. Load `blockbench-production` plus the active-stage skill.
3. Open the canonical model in one Blockbench window.
4. Connect the canonical `blockbench` MCP entry.
5. Call `get_stage_context` and follow `next_safe_operation`.
6. Route visual interpretation to `visual_director` and all active-asset mutation to `mcp_builder`.
7. Do not ask the user to edit workspace JSON, choose checkpoint filenames, select a Geometry revision profile, or select a worker model.

## Geometry startup

All Geometry work uses:

```text
BEDROCK_CUBOID_GEOMETRY
```

Normal one-session flow:

```text
get_stage_context
→ rebind_active_project_identity when required
→ manage_project_write_lease acquire by mcp_builder
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ place_cubes_safe / modify_cubes
→ rotate_cube_about_attachment when rotation is required
→ final five-view evidence
→ record_geometry_visual_decision
→ validate_geometry_contract
→ submit_geometry_for_review
→ user review
```

Use `visual_director` once for initial Reference Visual direction, only when a correction is visually ambiguous, and once for final visual acceptance. Deterministic part/direction/magnitude repairs stay with `mcp_builder`.

`submit_geometry_for_review` runs the final readiness gate, saves the next unused non-approved Geometry checkpoint, updates state to `GEOMETRY_REVIEW`, and returns `AWAIT_GEOMETRY_REVIEW` in the same profile and session.

Identity synchronization occurs before lease acquisition and does not modify the model. It does not require BOOTSTRAP, profile switching, or reconnecting.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are diagnosis scopes, not profiles. A current major diagnosis may call `prepare_geometry_visual_rebuild` in the same Geometry profile and continue with `CONTINUE_GEOMETRY`.

`PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are internal progress markers, not user approval gates. Two non-improving checks set an attention flag rather than forcing a new profile.

Codex must inspect image payloads and modify only diagnosed parts. Free-rescaling and unrelated trial-and-error edits are forbidden.

Generic Geometry validation routes back to `BEDROCK_CUBOID_GEOMETRY`; Codex classifies the internal scope with `analyze_geometry_views`.

## Stage orchestration

| Stage | MCP tool profile | Loaded skills | Writer |
| --- | --- | --- | --- |
| Geometry | `BEDROCK_CUBOID_GEOMETRY` | production + Geometry | `mcp_builder` |
| Texture | `BEDROCK_CUBOID_TEXTURE` | production + Texture | `mcp_builder` |
| Animation | `BEDROCK_CUBOID_ANIMATION` | production + Animation | `mcp_builder` |
| Final Validation | `FINAL_VALIDATION_READONLY` | production + Validation | `mcp_builder` for required writes only |

Maximum loaded production skills: `2`. Do not load Animation when skipped.

Profile changes occur only when the user-approved workflow moves to another stage, never for local or major Geometry revision or Geometry review submission.

## Completion and reopen

After final approval, promote the completed workspace through the workspace command. To revise a completed asset later, reopen the earliest affected stage. The completed baseline remains immutable while a revision is active.

## Stop conditions

Stop only for a real legacy-authority conflict, reference conflict, unavailable MCP endpoint, unavailable required custom agent, unsafe mutation, stale evidence that cannot be regenerated, failed final review gate, lease ownership conflict, or required user approval.

Do not scan ports, create alternate MCP keys, mix workspace areas, load deprecated skills, create duplicate roots, create versioned outputs, or ask the user to manually optimize model selection.
