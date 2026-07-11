# Codex + Blockbench MCP Bootstrap

Single operational entry point for local model production.

## Goal

Build only what the approved reference package requires, using the fewest safe reads, exposed tools, MCP calls, payload, screenshots, reconnects, and user interruptions.

## 1. Authorities

Read once at start or after context loss:

```text
Engine/codex/GOVERNANCE.md
active OpenSpec summary
SavedData/sessions/<asset>/reports/connection.json
SavedData/sessions/<asset>/state.json
```

Open only when triggered:

```text
Engine/codex/STATE_MACHINE.md
Engine/codex/EVIDENCE_CONTRACT.md
Engine/codex/CHECKPOINT_RECOVERY.md
Engine/codex/TOOL_PROFILE_CONTRACT.md
Engine/codex/tool-profiles.json
Engine/codex/stage-profiles.json
```

```text
OpenSpec = approved destination and boundaries
Ponytail = smallest safe action required now
state.json = runtime authority
```

Do not reconstruct state from legacy Markdown.

## 2. Canonical Connection

```text
Codex key: blockbench
URL: http://localhost:3000/bb-mcp
Plugin: mcp
Port: 3000
Endpoint: /bb-mcp
Auto-port: disabled
```

First-time setup only:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -InstallCodexConfig
```

Normal startup:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

Continue only when `reports/connection.json` is `PASS`.

Do not scan ports, create another MCP key, or rediscover the endpoint.

## 3. Reference Input

```text
references/
├─ PRODUCTION_CONTEXT.md
├─ <asset>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

Normal read order:

1. connection report;
2. `state.json`;
3. manifest;
4. Production Context;
5. Reference Visual;
6. active-stage category document only.

## 4. Exact Tool Profiles

```text
GEOMETRY         → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → BEDROCK_CUBOID_TEXTURE
ANIMATION        → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → FINAL_VALIDATION_READONLY
```

```text
Geometry revision  → GEOMETRY_LOCAL_REPAIR
Texture revision   → TEXTURE_LOCAL_REPAIR
Animation revision → ANIMATION_LOCAL_REPAIR
```

At startup call `get_runtime_status` once. Confirm profile ID/hash/count match state.

On a real profile change:

```text
activate profile
→ reconnect existing `blockbench` entry once
→ get_runtime_status once
→ continue
```

Do not reconnect after normal edits.

Blocked results:

```text
TOOL_PROFILE_BLOCKED
TOOL_PROFILE_ARGUMENT_BLOCKED
```

Never bypass them with eval, UI automation, PBR, Hytale, mesh UV, or armature tools.

## 5. One-Time Preflight

Before the first write:

1. call `validate_reference_contract` with `require_evidence=false`;
2. confirm project UUID, Bedrock format, Per-face UV, atlas size, and package;
3. record manual edits to preserve;
4. call `save_project_checkpoint` for `00_session_start.bbmodel`;
5. update state only after success.

Re-run only a stale or failed check.

## 6. Ponytail Batch Gate

Before meaningful work, decide internally:

```text
Stage:
Approved goal:
Required now: Yes / No
Smallest complete batch:
Reuse available:
Protected areas:
Active tool profile:
Verification:
Stop condition:
```

If `Required now: No`, do not execute it.

## 7. State Flow

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

Internal passes never create extra approval gates.

## 8. Geometry

Internal:

```text
Primary Form → Structural Detail
```

Initial work may use bounded multi-part batches.

One-issue-per-cycle applies only to revisions.

Forbidden: UV, texture painting, animation, decorative micro-cubes, final export.

Review output:

- `10_geometry_review.bbmodel`;
- cube/group/scale/hierarchy summary;
- five views via `capture_standard_views`;
- `geometry_report.json`;
- compact `validate_reference_contract` result.

Stop at `GEOMETRY_REVIEW`.

After explicit `APPROVED`, call `complete_stage` once. It creates `20_geometry_approved.bbmodel`, protects accepted areas, updates state, and activates Texture.

For `REVISION: ...`, activate `GEOMETRY_LOCAL_REPAIR`, patch only the named issue, capture focused evidence, and return to review.

## 9. Texture

Internal:

```text
UV → Base Texture → Detail Texture
```

Forbidden: broad Geometry redesign, PBR/Vibrant Visuals, Animation, geometry used as pixel detail.

Review output:

- `30_texture_review.bbmodel`;
- `texture_atlas.png` written by `save_texture_evidence`;
- UV summary;
- required standard views;
- `texture_report.json`.

Do not return the full atlas as base64 merely to save evidence.

Stop at `TEXTURE_REVIEW`.

After explicit `APPROVED`, call `complete_stage` once. It creates `40_texture_approved.bbmodel` and enters Animation or records `ANIMATION_SKIPPED` before Final Validation.

For revision, use `TEXTURE_LOCAL_REPAIR` and recapture only atlas/affected views.

## 10. Animation — Optional

Run only when manifest or `ANIMATION.md` requires motion. Never add optional clips for completeness.

Review output when used:

- `50_animation_review.bbmodel`;
- hierarchy and pivots;
- required clips/samples;
- neutral recovery, clipping, and ground-contact result.

Stop at `ANIMATION_REVIEW`.

After explicit `APPROVED`, call `complete_stage` once. For revision, use `ANIMATION_LOCAL_REPAIR`.

## 11. Final Validation

Under `FINAL_VALIDATION_READONLY`:

1. export candidate and textures;
2. write `final_texture_atlas.png` with `save_texture_evidence`;
3. capture final five views;
4. complete `VALIDATION.md` and reports;
5. call `validate_reference_contract` once;
6. route failures to the smallest repair profile;
7. allow at most two clearly local automatic fixes.

No new features or broad polish.

Stop at `FINAL_REVIEW`.

After explicit final `APPROVED`, call `complete_stage` once to create `80_validation_pass.bbmodel` and enter `DONE`.

## 12. Revision Input

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

Do not rebuild accepted areas.

## 13. Compact Report

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

## 14. Stop Conditions

Stop only for:

- `REFERENCE_CONFLICT`;
- connection/profile mismatch;
- wrong project UUID or stale state revision;
- required capability unavailable;
- checkpoint/evidence failure;
- same blocker twice;
- requested change that reopens an approved stage.

## 15. Verification and Integration

Use `Engine/codex/LOCAL_DRY_RUN.md` for local proof.

CI, deployment preview, review PR, and merge into `V1` remain deferred until explicit final-integration approval.
