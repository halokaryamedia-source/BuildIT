# Codex + Blockbench MCP Bootstrap

## Goal

Build the asset defined by the approved ChatGPT Reference Studio package with the fewest safe reads, MCP calls, image payloads, and correction cycles. Keep one Codex session and one MCP session through workspace completion. Workspace setup, project identity, profile activation, write ownership, and final workspace promotion are automatic.

## Fixed architecture

```text
ChatGPT Reference Studio
→ approved reference package
→ Codex + MCP Blockbench
→ Geometry
→ Texture
→ optional Animation
→ Final Validation
→ completed Blockbench package
```

This architecture is authoritative. Do not replace the ChatGPT Reference Studio package with a separate reference-generation workflow inside Codex.

## Authority

Use repository OpenSpec/Ponytail, the approved ChatGPT Reference Studio package, active workspace/state, and `MODEL_ROUTING.md`. Reject stale prompt packs, numbered-sheet legacy flows, extra routine approvals, and copied session history with `LEGACY_SKILL_CONFLICT`.

## Routing

- Terra Medium parent: normal implementation and default writer.
- Mini Low: sizeable mechanical read-only audit only.
- `mcp_builder`: fallback sole writer only when needed.
- Sol Medium: conditional visual judgment only.
- Sol High: one mandatory coded critical decision only.

No child for micro work, no parallel writers, no effort above High, no user worker selection.

## One-time startup

1. Receive the extracted approved ChatGPT Reference Studio package directory.
2. Load `blockbench-production` plus the Geometry skill.
3. Call `get_runtime_status` once.
4. Call `create_project(reference_package_root)`.
5. MCP reads the package manifest, creates `workspace/active/<asset>/`, copies references, writes state/project metadata, creates and saves the Blockbench project, synchronizes identity/profile, and prepares current-session ownership.
6. Call `inspect_reference_visual_preview` once, then begin Geometry.

Optional `workspace_root`, `asset_id`, or display name may be supplied only when deliberately overriding package defaults. Do not calculate `save_path`, create workspace folders, edit JSON, call `rebind_active_project_identity`, activate a profile, or call `manage_project_write_lease` during normal production.

## Stable session and tool surface

The registered MCP schema is the stable union of normal production tools, not the entire internal library. Manual identity, profile, and lease tools are diagnostic-only.

```text
complete or reopen stage
→ continue same MCP session
→ continue same Codex session
→ get_stage_context once
→ perform returned stage work
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

Project identity and write ownership remain automatic.

Texture:

```text
get_stage_context once
→ UV
→ base and detail texture
→ evidence/report
→ submit_stage_for_review
```

Animation is loaded only when required by the approved package:

```text
get_stage_context once
→ verify hierarchy/pivots
→ create required clips only
→ evidence/report
→ submit_stage_for_review
```

Submission runs fresh validation. Call standalone validation only after a failed submission to retrieve structured diagnostics.

## Final Validation and completion

```text
verify current Geometry readiness
→ validate_reference_contract(require_evidence=false) once
→ final atlas/views/document/export
→ record bound report
→ submit for final review
→ complete_stage(FINAL_VALIDATION)
→ automatic promotion to workspace/completed/<asset>/
→ WORKSPACE_COMPLETE
```

Final approval automatically promotes the validated model, textures, references, and previews into the user-facing `blockbench/` folder, freezes MCP metadata, updates integrity data, cleans temporary final staging, and updates the workspace index. Do not call the workspace CLI during normal production.

## Stop

Stop only for authority conflict, unavailable mandatory runtime, unsafe mutation, a real concurrent-writer conflict, unrecoverable package corruption, unrecoverable stale evidence, failed gate without a safe repair route, or user review. Do not scan ports, create alternate MCP keys, load deprecated skills, or create duplicate/versioned outputs.

## Compatibility rejection invariant

`LEGACY_SKILL_CONFLICT` rejects any four-sheet legacy workflow and three-approval routine. If optional project roles are not loaded, report `CODEX_PROJECT_CONFIG_NOT_LOADED` and continue with the safe current-session fallback; do not restart.
