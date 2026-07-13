---
name: blockbench-production
description: "Minimum-sufficient one-session dispatcher for approved Reference Visual packages, one selected Terra writer, bounded judgment, guarded reviews, and final workspace completion."
---

# Blockbench Production

## User contract

The user provides the approved package and reviews stage results. Codex owns workspace/project setup, identity, lease, routing, evidence, reports, checkpoints, transitions, recovery, export, and completion.

Never ask the user to run internal checks, edit JSON, choose workers/profiles/checkpoints, reconnect MCP, reload the plugin, or restart Codex.

## Routing

Terra parent performs normal implementation directly. Mini is for sizeable read-only audit. `mcp_builder` is fallback sole writer. Sol Medium is conditional visual judgment. Sol High is one rare coded critical decision. Exactly one Terra writer mutates the asset.

## Startup and context budget

1. Resolve/init asset and session root.
2. Load this skill plus exactly one active-stage skill.
3. Create the project through MCP when absent.
4. Call `get_runtime_status` once at startup.
5. Call `get_stage_context` at stage entry.
6. Rebind identity when requested.
7. Acquire the current-stage lease.

Do not repeat runtime status unless a real runtime event invalidates it. Do not poll stage context after every MCP call; call it after stage transition, approval, revision, or upstream reopen.

## Geometry

```text
inspect Reference Visual once per hash
→ zero-start: PRIMARY_MASS + PROVISIONAL_SUPPORT only
→ apply required primary rotations
→ left/front/top fixed-scale diagnosis
→ verify_primary_form_ready
→ save_canonical_project
→ structural detail only after primary PASS
→ affected-view diagnosis and bounded edits
→ final manifest-required view pass
→ conditional visual judgment
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ user review
```

Submission owns fresh validation, checkpoint, state transition, and lease release. Every non-zero rotation uses `rotate_cube_about_attachment`. Canonical `.bbmodel` persistence is refreshed with `save_canonical_project` at primary-form and review boundaries.

## Texture and Animation

```text
work/evidence
→ record_stage_review_report
→ submit_stage_for_review
→ user review
```

Do not call duplicate happy-path validation. If submission fails contract validation, call `validate_reference_contract` once for diagnostics, repair only named issues, refresh evidence/report, and resubmit. Do not load Animation when skipped.

## Final Validation

```text
verify Geometry readiness
→ validate_reference_contract(require_evidence=false) once
→ final evidence + completed VALIDATION.md + canonical export
→ record_stage_review_report
→ submit_stage_for_review
→ final review
→ complete_stage(FINAL_VALIDATION)
→ workspace completion
```

## Transition

A transition releases the prior lease, stays in the same MCP/Codex session, calls stage context, and acquires a fresh lease. Upstream reopen preserves approved checkpoints and accepted areas.

Stop only for a real authority conflict, mandatory runtime failure, unsafe mutation, unrecoverable evidence, failed gate, lease conflict, or user review.

## Audited routing invariants

The selected Terra writer handles normal mutations. `visual_director` is conditional and inspection-only; High is reserved for one coded critical decision. Geometry uses `BEDROCK_CUBOID_GEOMETRY`, `analyze_geometry_views`, `rotate_cube_about_attachment`, and `submit_geometry_for_review`. Final Geometry and Final Validation must include all manifest-required views.

## Geometry recovery compatibility invariants

- zero-start: build primary form before first capture/analyze;
- `verify_primary_form_ready` passes before structural detail;
- final required-view capture/analyze remains mandatory;
- no duplicate happy-path validation is added;
- visual judgment stays conditional rather than mandatory.
