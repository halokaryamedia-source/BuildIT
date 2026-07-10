# Codex + Blockbench MCP Bootstrap

Single operational entry point for local model production.

## Goal

Build only what the approved reference package requires, using the fewest safe reads, exposed tools, MCP calls, screenshots, and user interruptions.

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

Authority:

```text
Engine/codex/CONNECTION_CONTRACT.md
Engine/codex/connection-profile.json
```

Only connection:

```text
Codex server key: blockbench
URL: http://localhost:3000/bb-mcp
Plugin: mcp
Port: 3000
Endpoint: /bb-mcp
Auto port: disabled
```

First-time setup:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -InstallCodexConfig
```

Restart Codex once only when the config changed.

Normal startup:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

Continue only when:

```text
SavedData/sessions/<asset>/reports/connection.json
result: PASS
```

Do not scan ports, create another MCP key, or rediscover the endpoint.

## 3. Runtime Authorities

```text
SavedData/sessions/<asset>/state.json
Engine/codex/stage-profiles.json
Engine/codex/tool-profiles.json
```

Create missing state from:

```text
Engine/codex/state.template.json
```

Open only when relevant:

```text
Engine/codex/STATE_MACHINE.md
Engine/codex/EVIDENCE_CONTRACT.md
Engine/codex/CHECKPOINT_RECOVERY.md
Engine/codex/TOOL_PROFILE_CONTRACT.md
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

1. governance and active OpenSpec summary;
2. `reports/connection.json`;
3. `state.json`;
4. `reference_manifest.json`;
5. `PRODUCTION_CONTEXT.md`;
6. Reference Visual;
7. active-stage category document only.

Do not load every workflow document. Open detailed contracts or failure playbooks only when their trigger occurs.

## 6. Exact MCP Tool Profiles

Authority:

```text
Engine/codex/TOOL_PROFILE_CONTRACT.md
Engine/codex/tool-profiles.json
```

Stage mapping:

```text
GEOMETRY         → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → BEDROCK_CUBOID_TEXTURE
ANIMATION        → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → FINAL_VALIDATION_READONLY
```

Repair mapping:

```text
Geometry revision  → GEOMETRY_LOCAL_REPAIR
Texture revision   → TEXTURE_LOCAL_REPAIR
Animation revision → ANIMATION_LOCAL_REPAIR
```

At startup:

1. call `get_runtime_status` once;
2. confirm the runtime profile matches `state.json` and the active stage;
3. call `get_tool_profile` only when exact names are needed for diagnosis.

On a real profile transition:

```text
activate_tool_profile
→ update state profile fields
→ reconnect the existing canonical `blockbench` entry once
→ call get_runtime_status once
→ continue only when profile ID/hash/count match
```

Do not reconnect after normal edits. Do not create another server key or use another port.

A tool outside the active profile must fail with:

```text
TOOL_PROFILE_BLOCKED
```

Do not bypass it with `risky_eval`, UI automation, PBR, Hytale, mesh UV, or armature tools.

## 7. Ponytail Batch Gate

Before a meaningful batch, answer internally:

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
Estimated MCP/evidence cost: Low / Medium / High
```

If `Required now: No`, do not execute it.

## 8. One-Time Asset Preflight

Connection readiness is already handled by `sync-local-stack.ps1` and must not be rediscovered manually.

Before the first write:

1. validate the approved reference package;
2. confirm one active asset and one Codex write session;
3. confirm `BEDROCK_CUBOID_GEOMETRY` profile;
4. verify project UUID, format, UV mode, and texture size;
5. record manual edits to preserve;
6. save `checkpoints/00_session_start.bbmodel`;
7. update state only after checkpoint success.

Re-run only stale or failed checks.

## 9. State Sequence

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

# Stage 1 — Geometry

Profile:

```text
BEDROCK_CUBOID_GEOMETRY
```

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

- `10_geometry_review.bbmodel`;
- cube/group, scale, and hierarchy summary;
- Front, Left, Back, Top, and Front-left 3/4;
- `geometry_report.json`;
- concise comparison to `GEOMETRY.md` and the Reference Visual.

Stop at `GEOMETRY_REVIEW`.

User decision:

- `APPROVED` → save `20_geometry_approved.bbmodel`, protect accepted areas, activate `BEDROCK_CUBOID_TEXTURE`, reconnect once, enter Texture;
- `REVISION: ...` → activate `GEOMETRY_LOCAL_REPAIR`, reconnect once if changed, patch only the named issue, capture focused evidence, return to review.

# Stage 2 — Texture

Profile:

```text
BEDROCK_CUBOID_TEXTURE
```

Internal:

```text
UV
→ Base Texture
→ Detail Texture
```

No approval between internal passes.

Forbidden:

- broad Geometry redesign;
- geometry used to imitate pixels, seams, bands, or scratches;
- PBR or Vibrant Visuals;
- mesh UV for normal cuboid assets;
- Animation work.

Review output:

- `30_texture_review.bbmodel`;
- atlas preview and UV summary;
- required model views;
- `texture_report.json`;
- concise comparison to `TEXTURING.md` and the Reference Visual.

Stop at `TEXTURE_REVIEW`.

User decision:

- `APPROVED` → save `40_texture_approved.bbmodel`, protect accepted areas, then:
  - required Animation → activate `BEDROCK_CUBOID_ANIMATION`, reconnect once;
  - no Animation → set `ANIMATION_SKIPPED`, activate `FINAL_VALIDATION_READONLY`, reconnect once;
- `REVISION: ...` → activate `TEXTURE_LOCAL_REPAIR`, reconnect once if changed, patch only the named UV/texture issue, recapture atlas and affected views.

# Stage 3 — Animation (Optional)

Run only when the manifest or `ANIMATION.md` defines required motion.

Profile:

```text
BEDROCK_CUBOID_ANIMATION
```

The normal profile uses Blockbench group/bone animation. It excludes mesh armatures and vertex weights.

When not required:

```text
state: ANIMATION_SKIPPED
reason: not required by approved package
recovery: approved Texture checkpoint
```

Do not add optional animation for completeness.

When required, build only approved hierarchy, pivots, and clips without altering accepted Geometry or Texture.

Review output:

- `50_animation_review.bbmodel`;
- hierarchy/pivot summary;
- required clips or sampled poses;
- neutral-pose recovery;
- clipping and ground-contact result.

Stop at `ANIMATION_REVIEW`.

User decision:

- `APPROVED` → save `60_animation_approved.bbmodel`, protect accepted areas, activate `FINAL_VALIDATION_READONLY`, reconnect once;
- `REVISION: ...` → activate `ANIMATION_LOCAL_REPAIR`, reconnect once if changed, patch only the named motion/pivot/clipping/timing issue.

# Stage 4 — Final Validation

Profile:

```text
FINAL_VALIDATION_READONLY
```

Execute `VALIDATION.md` against the final candidate, textures, five views, hierarchy/pivots, required animations, Blockbench validator, and export readiness.

The profile is read-mostly. It does not silently expose Geometry, Texture, or Animation write tools.

Codex may repair at most two clearly local failures, but must first activate the matching local-repair profile and route back to the correct stage. Broad changes always return to the relevant approved stage. No new features or unrelated polish.

Output:

- `70_final_candidate.bbmodel`;
- candidate `.bbmodel` and textures in `final/`;
- completed `VALIDATION.md`;
- five final views and atlas;
- revision summary;
- `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

After PASS, save `80_validation_pass.bbmodel`. Stop at `FINAL_REVIEW` and wait for approval or corrections.

## 10. Revision Rule

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
Tool repair profile:
Verification:
Rollback checkpoint:
```

Do not rebuild accepted areas.

## 11. Diagnostic Escalation

`DIAGNOSTIC_ESCALATION` may expose the full library only after recording:

```text
Blocker:
Why normal stage/repair tools cannot solve it:
Allowed high-risk tool:
Rollback checkpoint:
Verification:
Stop condition:
```

Return to the correct normal or repair profile immediately after the blocker is resolved.

## 12. Stop Conditions

Stop and report only when:

- `REFERENCE_CONFLICT`;
- connection readiness is not `PASS`;
- tool profile validation fails;
- required capability is unavailable from the correct profile;
- project/session ownership is ambiguous;
- checkpoint/evidence creation fails;
- the same blocker fails twice;
- a requested change requires reopening an approved stage.

## 13. Compact Stage Report

```text
Stage:
Status: PASS / REVISION_REQUIRED / BLOCKER
Active profile:
Exposed tool count:
Completed:
Preserved:
Checkpoint:
Evidence:
Issues:
Next user action: APPROVED or REVISION: ...
```

## 14. Local Verification and CI

Use `Engine/codex/LOCAL_DRY_RUN.md` after the local stack is ready.

CI, deployment preview, release preparation, PR reopening, and merge into `V1` remain deferred until the user explicitly opens final integration.
