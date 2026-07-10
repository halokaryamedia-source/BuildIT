# MCP Blockbench Workflow Hub

Local Codex starts from:

```text
Engine/codex/BOOTSTRAP.md
```

## 1. Canonical Connection

```text
Engine/codex/CONNECTION_CONTRACT.md
Engine/codex/connection-profile.json
```

```text
Codex MCP key: blockbench
URL: http://localhost:3000/bb-mcp
Blockbench instances: one
Codex write sessions: one
Auto-port fallback: disabled
```

Run before asset preflight:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

Continue only when:

```text
SavedData/sessions/<asset>/reports/connection.json
result: PASS
```

Do not search ports, add alternate MCP keys, or rediscover the active project.

## 2. Runtime Authority

```text
SavedData/sessions/<asset>/state.json
```

Do not reconstruct state from several Markdown files when `state.json` exists.

## 3. Approved Reference Package

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

Legacy numbered reference sheets are not required for new sessions.

## 4. User-Visible Stages

```text
1. GEOMETRY
2. TEXTURE
3. ANIMATION — optional
4. FINAL_VALIDATION
```

Each completed stage produces preview evidence and waits for user approval or targeted revision instructions. Internal passes do not create extra approval gates.

### Geometry

Internal: Primary Form → Structural Detail.

Review: Front, Left Side, Back, Top/Footprint, Front-left 3/4, scale/hierarchy/cube report, persistent checkpoint.

### Texture

Internal: UV → Base Texture → Detail Texture.

Review: texture atlas, UV summary, Front, Left Side, Back, Front-left 3/4, persistent checkpoint.

### Animation

Run only when required. Review hierarchy/pivots, required clips or samples, neutral-pose recovery, clipping, ground contact, and checkpoint.

### Final Validation

Run `VALIDATION.md`, collect final evidence, repair at most two local failures, and wait for final user approval or corrections.

## 5. Minimum Normal Read Set

1. `Engine/codex/GOVERNANCE.md`
2. active OpenSpec summary
3. `reports/connection.json`
4. `state.json`
5. reference manifest
6. Production Context
7. Reference Visual
8. active-stage document only

Open detailed playbooks only after a relevant failure trigger.

## 6. Session Rules

- One asset = one Blockbench window + one Codex write session.
- Connection readiness runs once before asset preflight.
- Asset preflight runs once before the first write.
- Re-run only stale or failed checks.
- Save persistent stage checkpoints.
- Preserve user/manual and approved work unless a stage is explicitly reopened.
- Initial construction may use bounded batches.
- One-issue-per-cycle applies to revision work.

## 7. Stage Transition

Advance only when required evidence exists, result is `PASS`, no blocker remains, and the user approves the stage preview.

Revision feedback names stage, part, issue, expected result, and anything that must not change.

## 8. Stop Conditions

Stop for:

- connection readiness not `PASS`;
- `REFERENCE_CONFLICT`;
- missing required MCP capability;
- ambiguous project/session ownership;
- checkpoint/evidence failure;
- same blocker repeated twice;
- change that requires reopening an approved stage.

## 9. Repository Responsibilities

- `Engine/codex/`: connection, governance, bootstrap, state/evidence/checkpoint contracts, and schemas.
- `SavedData/sessions/<asset>/`: runtime state, references, checkpoints, evidence, reports, and final output.
- `SourceDocument/modeling/`: detailed guidance and conditional failure playbooks.
- `src/`: MCP plugin implementation.
- `openspec/changes/codex-local-workflow-rework/`: current rework specification.
