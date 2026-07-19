# Codex + Blockbench MCP Bootstrap

## Goal

Build the approved Blockbench asset from a fresh workspace with the fewest safe reads, MCP calls, image payloads, and correction cycles. Keep one Codex session and one MCP session through workspace completion. Internal project identity, profile, and write ownership are automatic.

## Authority

Use repository OpenSpec/Ponytail, the selected workspace/state, the approved Reference Visual package, and `MODEL_ROUTING.md`. Reject stale prompt packs, numbered-sheet flows, extra routine approvals, and copied session history with `LEGACY_SKILL_CONFLICT`.

## Routing

- Terra Medium parent: normal implementation and default writer.
- Mini Low: sizeable mechanical read-only audit only.
- `mcp_builder`: fallback sole writer only when needed.
- Sol Medium: conditional visual judgment only.
- Sol High: one mandatory coded critical decision only.

No child for micro work, no parallel writers, no effort above High, no user worker selection.

## One-time startup

1. Resolve or initialize the selected asset and canonical `workspace/active/<asset>/mcp` root.
2. Load `blockbench-production` plus the active-stage skill.
3. Call `get_runtime_status` once.
4. Call `get_stage_context` once for the active stage.
5. When no project exists, call `create_project(session_root, asset_id)`; MCP derives the canonical path, persists the file, synchronizes identity/profile, and prepares current-session ownership.
6. Begin stage work directly.

Do not calculate `save_path`, call `rebind_active_project_identity`, activate a profile, or call `manage_project_write_lease` on the normal single-user path.

Repeat runtime status only after a real runtime error, plugin reload, project replacement, or connection warning. Call stage context again only after approval, revision, upstream reopen, or stage transition.

## Stable session transition

```text
complete or reopen stage
→ continue same MCP session
→ continue same Codex session
→ get_stage_context once
→ next mutating call prepares current-stage ownership automatically
```

No reconnect, reload, restart, user JSON edit, checkpoint naming, profile selection, or manual lease operation.

## Geometry

Inspect the Reference Visual once per unchanged hash. Never analyze a blank project.

```text
zero-start
→ inspect reference
→ build primary/support cuboids
→ apply required angled forms
→ capture/analyze left + front + top once
→ verify_primary_form_ready
→ structural detail

existing/revision
→ inspect reference only when hash changed
→ capture affected views
→ targeted correction
```

### Rotation and pivot routing

Use `rotate_cube_about_attachment` when the manifest contract accurately describes the visible part, axis, direction, and connection.

Use `apply_cube_transforms` when the contract is absent, ambiguous, or visibly inaccurate, or when one related-part batch is more efficient. Supply explicit `from/to/origin/rotation` or a local pivot anchor. The tool:

- uses Blockbench rendered `matrixWorld` corners and pivot when available;
- snaps to a rendered target anchor or explicit world point;
- converts world translation through the rendered parent transform;
- validates connection gap;
- optionally runs one affected-view analysis after the complete batch;
- does not require a manifest rotation contract.

Do not repeatedly retry a contract that disagrees with the approved Reference Visual. Use one direct transform batch instead. Do not substitute axis-aligned stacking for a visibly angled form.

Then perform bounded targeted edits, one final required-view pass, conditional visual judgment, record the visual decision, and call `submit_geometry_for_review`. Submission owns fresh validation and review transition.

## Texture and Animation

Normal flow is work/evidence → bound report → submission. Submission runs fresh validation. Call standalone validation only after a failed submission to retrieve detailed diagnostics. Do not load Animation when skipped.

## Final Validation

```text
verify current Geometry readiness
→ validate_reference_contract(require_evidence=false) once
→ final atlas/views/document/export
→ record bound report
→ submit for final review
→ final approval
→ workspace completion
```

## Stop

Stop only for authority conflict, unavailable mandatory runtime, unsafe mutation, a real concurrent-writer conflict, unrecoverable stale evidence, failed gate without a safe repair route, or user review. Do not scan ports, create alternate MCP keys, load deprecated skills, or create duplicate/versioned outputs.

## Compatibility rejection invariant

`LEGACY_SKILL_CONFLICT` rejects any four-sheet workflow and three approval routine. If optional project roles are not loaded, report `CODEX_PROJECT_CONFIG_NOT_LOADED` and continue with the safe current-session fallback; do not restart.
