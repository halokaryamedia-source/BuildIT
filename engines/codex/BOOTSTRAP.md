# Codex + Blockbench MCP Bootstrap

## Goal

Build only what the approved package requires with the fewest safe reads, calls, image payloads, and correction cycles. Keep one Codex session and one MCP session through workspace completion.

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
3. Create the Bedrock project through MCP when absent and save to the canonical model path.
4. Call `get_runtime_status` once.
5. Call `get_stage_context` for the active stage.
6. Rebind identity before lease acquisition when required.
7. Select one Terra writer and acquire the current-stage lease.

Repeat runtime status only after a real runtime error, plugin reload, project replacement, or connection warning. Call stage context again only after approval, revision, upstream reopen, or stage transition.

## Stable session transition

```text
release old lease
→ continue same MCP session
→ continue same Codex session
→ get_stage_context
→ acquire fresh current-stage lease
```

No reconnect, reload, restart, user JSON edit, checkpoint naming, profile selection, or internal smoke test.

## Geometry

Inspect the Reference Visual once per unchanged hash. The preview returns the next operation.

```text
zero-start
inspect reference
→ BUILD_PRIMARY_FORM_FROM_MANIFEST
→ capture primary views
→ fixed-scale diagnosis

existing/revision
inspect reference only when hash changed
→ capture affected views
→ fixed-scale diagnosis
```

Then perform bounded targeted edits, one final manifest-required view pass, conditional visual judgment, record the visual decision, and call `submit_geometry_for_review`. Never analyze a blank model. Submission owns fresh validation and review transition.

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

Stop only for authority conflict, unavailable mandatory runtime, unsafe mutation, lease conflict, unrecoverable stale evidence, failed gate without a safe repair route, or user review. Do not scan ports, create alternate MCP keys, load deprecated skills, or create duplicate/versioned outputs.

## Compatibility rejection invariant

`LEGACY_SKILL_CONFLICT` rejects any four-sheet workflow and three approval routine. If optional project roles are not loaded, report `CODEX_PROJECT_CONFIG_NOT_LOADED` and continue with the safe current-session fallback; do not restart.
