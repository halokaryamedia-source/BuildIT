# Codex Local Workflow Specification

## Governance

OpenSpec SHALL preserve approved scope and decisions. Ponytail SHALL select the smallest safe action required by the active stage.

Normal context recovery SHALL read only:

1. `engines/shared/workflow/GOVERNANCE.md`;
2. the active OpenSpec summary and `PONYTAIL_EXECUTION.md`;
3. `workspace/workspace.json` to resolve the selected asset;
4. `workspace/active/<asset>/mcp/project.json` for canonical project paths and identity;
5. `workspace/active/<asset>/mcp/state.json` for runtime state;
6. the required reference core and active-stage contract.

The agent SHALL NOT scan unrelated active/completed assets or restore authority from copied chat context, legacy prompt packs, or old session folders.

## Reference Intake

The approved package SHALL contain Production Context, one Reference Visual, Geometry, Texturing, Animation, Validation, manifest, and Codex handoff. Legacy numbered sheets SHALL NOT be required.

## Runtime State

`workspace/active/<asset>/mcp/state.json` SHALL be the runtime authority. `workspace/workspace.json` SHALL only select the active asset. Markdown summaries SHALL NOT override either file.

User-facing `.bbmodel`, textures, reference images, and approved previews SHALL remain under `workspace/active/<asset>/blockbench/`. Checkpoints, evidence, reports, contracts, project metadata, and state SHALL remain under `workspace/active/<asset>/mcp/`.

## Model Routing

Normal implementation SHALL use the Terra Medium parent directly. When the parent is explicitly changed or isolated mutation is materially safer, `mcp_builder` SHALL become the only Terra writer. `routine_auditor` SHALL be read-only Mini Low, `visual_director` SHALL be read-only Sol Medium, and `critical_reviewer` SHALL be read-only Sol High for one coded critical decision.

Routing SHALL be deterministic, SHALL NOT spend a model call only to select another model, SHALL NOT exceed High effort, and SHALL NOT allow parallel active-asset writers.

## State Sequence

```text
REFERENCE_READY
→ GEOMETRY_IN_PROGRESS
→ GEOMETRY_REVIEW
→ GEOMETRY_APPROVED
→ TEXTURE_IN_PROGRESS
→ TEXTURE_REVIEW
→ TEXTURE_APPROVED
→ ANIMATION_IN_PROGRESS or ANIMATION_SKIPPED
→ ANIMATION_REVIEW when required
→ ANIMATION_APPROVED when required
→ FINAL_VALIDATION
→ FINAL_REVIEW
→ DONE
```

Broad feedback SHALL reopen the earliest affected stage. Accepted areas SHALL remain protected by default.

## One-Time Preflight

Before the first persistent write, Codex SHALL verify the canonical connection, selected project identity, format, UV mode, texture dimensions, active logical profile, reference package, manual edits, and checkpoint readiness. A project UUID mismatch SHALL be synchronized through the metadata-only identity tool before lease acquisition. Fresh checks SHALL NOT be repeated.

## One-Session Execution

Geometry, Texture, optional Animation, Final Validation, approval, and revision SHALL remain in the same Codex session and MCP session. A stage/profile transition SHALL release the old lease, return `current_session_continues = true`, call `get_stage_context`, and require a fresh current-stage lease. It SHALL NOT request a reconnect, plugin reload, or user-managed profile switch.

## Stage Reviews

- Geometry SHALL end with a guarded checkpoint, five current standard views, fixed-scale analysis, structural validation, current visual acceptance, and user review.
- Texture SHALL end with a guarded checkpoint, atlas, model views, compact validation, and user review.
- Animation SHALL run only when required and end with hierarchy/pivot/clip evidence and user review.
- Final Validation SHALL execute `VALIDATION.md`, re-check current Geometry readiness, export final outputs, and wait for final approval.

Internal passes SHALL NOT add approval gates. Initial work MAY use bounded batches; revision work SHALL target one named issue or tightly related pair.

## Efficiency

Codex SHALL use the active exact tool profile, structured outputs, direct evidence writes, atomic checkpoints, bounded image transport, deterministic validation, and the stage-specific guarded completion tool. Unrelated work SHALL be rejected as `DEFERRED_NOT_REQUIRED`.