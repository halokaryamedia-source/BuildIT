---
name: blockbench-production
description: "Dispatcher for approved Blockbench asset production. Keeps Geometry in one MCP profile and session, handles project identity synchronization and review submission through Codex, and stops only at meaningful user review gates."
---

# Blockbench Production

Use for production from an approved single-Reference-Visual package.

## Authority

Runtime authority is:

```text
AGENTS.md
engines/shared/
workspace/workspace.json
workspace/active/<asset>/mcp/state.json
workspace/active/<asset>/mcp/references/
```

Reject legacy instructions that require four technical sheets, three approval moments, numbered `01_*`–`04_*` images, or any extra technical reference image. Stop with `LEGACY_SKILL_CONFLICT`.

The approved Reference Visual is the sole visual authority. Markdown and JSON are implementation constraints, not substitutes for image inspection.

## User experience rule

Codex owns normal setup and recovery. Do not ask the user to:

- edit `state.json` or `project.json`;
- switch Geometry profiles;
- choose checkpoint filenames;
- close and reopen the model;
- reconnect MCP between Geometry revision modes;
- run separate readiness prompts for operations Codex can perform directly.

A restart is justified only after loading a newly built plugin or when the MCP endpoint is actually unavailable.

## Dispatch

1. Resolve the selected asset and session root.
2. Load this skill plus exactly one stage skill.
3. Call `get_stage_context` and follow `next_safe_operation`.
4. During Geometry, remain on `BEDROCK_CUBOID_GEOMETRY`.
5. Let Codex synchronize a changed runtime UUID with `rebind_active_project_identity` when required.
6. Acquire the write lease only before model mutation.
7. Submit the completed stage through its MCP review transition and stop at the user review gate.

## Geometry flow

Normal Geometry uses one profile and one MCP session:

```text
get_stage_context
→ rebind_active_project_identity when required
→ manage_project_write_lease acquire
→ inspect_reference_visual_preview
→ capture/analyze current Geometry
→ edit only diagnosed parts
→ final five-view evidence
→ record_geometry_visual_decision
→ validate_geometry_contract
→ submit_geometry_for_review
→ user review
```

`submit_geometry_for_review` re-runs the Geometry readiness gate, creates the next unused non-approved review checkpoint, atomically changes state to `GEOMETRY_REVIEW`, and returns `AWAIT_GEOMETRY_REVIEW`. It does not switch profile or reconnect MCP.

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal diagnosis scopes. They are not tool profiles and do not require reconnecting.

When a fresh diagnosis recommends `MAJOR_FORM_REVISION`, Codex may call `prepare_geometry_visual_rebuild` in the same Geometry profile. The tool preserves checkpoints and primary masses, keeps existing detail by default, clears only classified structural detail when explicitly requested, and returns to normal Geometry work.

Generic Geometry validation must route revision work back to `BEDROCK_CUBOID_GEOMETRY`. Codex uses `analyze_geometry_views` to classify the internal scope rather than activating a removed repair profile.

## Visual grounding

Use `inspect_reference_visual_preview`, not the legacy original-image transport. It verifies the original SHA-256 and dimensions while returning a bounded ephemeral preview.

Geometry requires:

1. Codex inspection of actual image payloads;
2. fixed-scale diagnosis from `analyze_geometry_views`;
3. structural validation from `validate_geometry_contract`.

A structural pass alone is not a visual pass. Free-rescaling the current model before comparison is forbidden.

## Mutation rules

Use:

- `place_cubes_safe` for unrotated new cubes;
- `modify_cubes` for unrotated edits;
- `rotate_cube_about_attachment` for every non-zero cube rotation.

Prefer one bounded edit batch per diagnosed issue. Do not make unrelated trial-and-error changes.

Geometry runtime markers such as `PRIMARY_FORM` and `STRUCTURAL_DETAIL` are internal progress hints, not user-facing approval gates. Codex may continue working in the same profile. Editing after `FINAL_REVIEW_READY` automatically makes old evidence stale and returns Geometry to working state.

## Efficiency

- Inspect the Reference Visual preview once unless its source hash changes.
- Use only affected views during correction.
- Use one final five-view pass.
- Reuse compact context and current evidence.
- Do not reload long contracts without a concrete conflict.
- Do not request user intervention for operations exposed through the current MCP profile.

## Stage routing

```text
GEOMETRY         → blockbench-geometry
TEXTURE          → blockbench-texture
ANIMATION        → blockbench-animation when required
FINAL_VALIDATION → blockbench-validation
```

Stop only for a real authority conflict, unavailable MCP runtime, unsafe mutation, stale or invalid evidence, failed final review gate, or required user approval.
