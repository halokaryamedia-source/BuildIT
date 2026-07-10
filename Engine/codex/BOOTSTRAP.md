# Codex + Blockbench MCP Bootstrap

Single operational entry point for local model production.

## Goal

Build only what the approved reference package requires, using the fewest safe reads, MCP calls, screenshots, and user interruptions.

## 1. Governance

Read once at session start or after context loss:

```text
Engine/codex/GOVERNANCE.md
active OpenSpec summary
```

```text
OpenSpec = approved goal, boundaries, decisions, stages, non-goals, acceptance criteria
Ponytail = smallest safe action required now to satisfy that agreement
```

Do not repeat the full governance/spec before every small edit.

## 2. Canonical Local Connection

Read:

```text
Engine/codex/CONNECTION_CONTRACT.md
Engine/codex/connection-profile.json
```

Only connection:

```text
Codex server key: blockbench
URL: http://localhost:3000/bb-mcp
Blockbench plugin: mcp
Port: 3000
Endpoint: /bb-mcp
Auto port: disabled
```

First-time Codex setup:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -InstallCodexConfig
```

Restart Codex once after the configuration changes.

Normal asset startup:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

Continue only when:

```text
SavedData/sessions/<asset>/reports/connection.json
result: PASS
```

Do not scan ports, create alternate MCP keys, or rediscover the endpoint. After Codex connects, use `get_runtime_status` once for live confirmation.

## 3. Runtime Authority

```text
SavedData/sessions/<asset>/state.json
```

Create missing state from:

```text
Engine/codex/state.template.json
```

Supporting contracts, opened only when relevant:

```text
Engine/codex/STATE_MACHINE.md
Engine/codex/EVIDENCE_CONTRACT.md
Engine/codex/CHECKPOINT_RECOVERY.md
Engine/codex/stage-profiles.json
Engine/codex/LEGACY_WORKFLOW_AUDIT.md
```

`state.json` overrides Markdown summaries and lock mirrors.

## 4. Required Reference Input

```text
SavedData/sessions/<asset>/references/
├─ PRODUCTION_CONTEXT.md
├─ <asset>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

## 5. Minimum Read Order

Read once when starting or recovering:

1. `Engine/codex/GOVERNANCE.md`
2. active OpenSpec summary
3. `reports/connection.json`
4. `state.json`
5. `references/reference_manifest.json`
6. `references/PRODUCTION_CONTEXT.md`
7. `references/<asset>_reference_visual.png`
8. active-stage category document only

Do not load every workflow document. Open failure playbooks only when their trigger occurs.

## 6. Ponytail Batch Gate

Before a meaningful work batch, answer internally:

```text
Stage:
Approved goal:
Required now: Yes / No
Smallest complete batch:
Reuse available:
Forbidden changes:
Required tool profile:
Verification:
Stop condition:
Estimated MCP/evidence cost: Low / Medium / High
```

If `Required now: No`, do not execute it.

## 7. One-Time Asset Preflight

Connection readiness is already handled by `sync-local-stack.ps1` and must not be repeated manually.

Before the first MCP write:

1. validate the approved reference package;
2. confirm one active asset and one Codex write session;
3. call `get_runtime_status` once;
4. confirm project UUID, format, UV mode, texture size, and active-stage capabilities;
5. record manual edits that must be preserved;
6. call `save_project_checkpoint` for `00_session_start.bbmodel`;
7. update `state.json` only after checkpoint success.

Re-run only a stale or failed check. Do not repeat the full preflight for each edit or stage.

## 8. State Sequence

```text
REFERENCE_READY
→ GEOMETRY_IN_PROGRESS
→ GEOMETRY_REVIEW
→ GEOMETRY_APPROVED
→ TEXTURE_IN_PROGRESS
→ TEXTURE_REVIEW
→ TEXTURE_APPROVED
→ ANIMATION_IN_PROGRESS or ANIMATION_SKIPPED
→ ANIMATION_REVIEW when used
→ ANIMATION_APPROVED when used
→ FINAL_VALIDATION
→ FINAL_REVIEW
→ DONE
```

Revision/reopen behavior is defined in `STATE_MACHINE.md`. Internal passes never create extra approval gates.

# Stage 1 — Geometry

Internal:

```text
Primary Form
→ Structural Detail
```

Initial work may use bounded multi-part batches. One-issue-per-cycle applies only to revisions.

Forbidden:

- UV and texture work;
- decorative micro-cubes;
- animation clips;
- final export.

Review output:

- `checkpoints/10_geometry_review.bbmodel` via `save_project_checkpoint`;
- cube/group, scale, and hierarchy summary;
- five views via `capture_standard_views` with stage `GEOMETRY`;
- `evidence/geometry/geometry_report.json`;
- concise comparison to `GEOMETRY.md` and the Reference Visual.

Stop at `GEOMETRY_REVIEW`.

- `APPROVED` → save `20_geometry_approved.bbmodel`, protect accepted areas, enter Texture.
- `REVISION: ...` → patch only the named issue, capture focused evidence, return to Geometry Review.

# Stage 2 — Texture

Internal:

```text
UV
→ Base Texture
→ Detail Texture
```

No approval between internal passes.

Forbidden:

- broad Geometry redesign;
- geometry used to imitate pixels/seams/bands/scratches;
- PBR or Vibrant Visuals;
- Animation work.

Review output:

- `checkpoints/30_texture_review.bbmodel`;
- atlas preview and UV summary;
- required model views via `capture_standard_views` with stage `TEXTURE`;
- `evidence/texture/texture_report.json`;
- concise comparison to `TEXTURING.md` and the Reference Visual.

Stop at `TEXTURE_REVIEW`.

- `APPROVED` → save `40_texture_approved.bbmodel`, protect accepted areas, run/skip Animation.
- `REVISION: ...` → patch only the named Texture/UV issue and recapture affected evidence.

# Stage 3 — Animation (Optional)

Run only when the manifest or `ANIMATION.md` defines required motion.

When not required:

```text
state: ANIMATION_SKIPPED
reason: not required by approved package
recovery: approved Texture checkpoint
```

Do not add optional animation for completeness.

When required, build only approved hierarchy, pivots, and clips without altering accepted Geometry or Texture.

Review output:

- `checkpoints/50_animation_review.bbmodel`;
- hierarchy/pivot summary;
- required clips or samples;
- neutral-pose recovery;
- clipping and ground-contact result.

Stop at `ANIMATION_REVIEW`.

- `APPROVED` → save `60_animation_approved.bbmodel`, protect accepted areas, enter Final Validation.
- `REVISION: ...` → patch only the named motion/pivot/clipping/timing issue.

# Stage 4 — Final Validation

Execute `VALIDATION.md` against the final candidate, textures, five views, hierarchy/pivots, required animations, Blockbench validator, and export readiness.

Codex may repair at most two clearly local failures automatically. Broad changes return to the relevant approved stage. No new features or unrelated polish.

Output:

- `checkpoints/70_final_candidate.bbmodel`;
- candidate `.bbmodel` and textures in `final/`;
- completed `VALIDATION.md`;
- five views via `capture_standard_views` with stage `FINAL`;
- final atlas and revision summary;
- `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

After PASS, save `80_validation_pass.bbmodel`. Stop at `FINAL_REVIEW` and wait for approval/corrections.

## 9. Revision Rule

For revisions only:

```text
one cycle = one named issue or one tightly related pair
```

```text
Stage:
Part:
Issue:
Expected:
Do not change:
Reference:
Verification:
Rollback checkpoint:
```

Do not rebuild accepted areas. Follow `STATE_MACHINE.md` for local fix versus stage reopen.

## 10. Stop Conditions

Stop and report only when:

- `REFERENCE_CONFLICT`;
- connection readiness is not `PASS`;
- required MCP capability is unavailable;
- project/session ownership is ambiguous;
- checkpoint/evidence creation fails;
- the same blocker fails twice;
- a requested change requires reopening an approved stage.

## 11. Compact Stage Report

```text
Stage:
Status: PASS / REVISION_REQUIRED / BLOCKER
Completed:
Preserved:
Checkpoint:
Evidence:
Issues:
Next user action: APPROVED or REVISION: ...
```

## 12. Local Verification and CI

Use `Engine/codex/LOCAL_DRY_RUN.md` after the local stack is ready.

CI, deployment preview, release preparation, PR reopening, and merge into `V1` remain deferred until the user explicitly opens final integration.
