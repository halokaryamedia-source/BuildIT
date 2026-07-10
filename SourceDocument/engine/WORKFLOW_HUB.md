# MCP Blockbench Workflow Hub

This is the operational index. Local Codex starts from:

```text
Engine/codex/BOOTSTRAP.md
```

Runtime state comes from:

```text
SavedData/sessions/<asset>/state.json
```

Do not reconstruct state from several Markdown files when `state.json` exists.

## 1. Approved Reference Package

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

## 2. User-Visible Stages

```text
1. GEOMETRY
2. TEXTURE
3. ANIMATION — optional
4. FINAL_VALIDATION
```

Each completed stage produces preview evidence and waits for user approval or targeted revision instructions.

Internal passes do not create extra routine approval gates.

### Geometry

Internal passes:

- Primary Form
- Structural Detail

Review evidence:

- Front
- Left Side
- Back
- Top / Footprint
- Front-left 3/4

### Texture

Internal passes:

- UV
- Base Texture
- Detail Texture

Review evidence:

- texture atlas
- UV summary
- Front
- Left Side
- Back
- Front-left 3/4

### Animation

Run only when required by the approved package.

Review evidence:

- hierarchy/pivots
- required clips or sampled poses
- neutral pose recovery
- clipping and ground contact

### Final Validation

Run `VALIDATION.md`, collect final evidence, repair at most two local failures, and wait for final user approval or corrections.

## 3. Minimum Normal Read Set

1. `Engine/codex/BOOTSTRAP.md`
2. `SavedData/sessions/<asset>/state.json`
3. `references/reference_manifest.json`
4. `references/PRODUCTION_CONTEXT.md`
5. `references/<asset>_reference_visual.png`
6. the active-stage document only

Open detailed playbooks only after a relevant failure trigger.

## 4. Session Rules

- One asset = one active write session.
- Run full preflight once before the first write.
- Re-run only stale or failed checks.
- Save persistent stage checkpoints.
- Preserve user manual edits unless an earlier stage is explicitly reopened.
- Initial construction may use bounded multi-part batches.
- One-issue-per-cycle applies to revision work.

## 5. Stage Transition Rule

A stage may advance only when:

- required evidence exists;
- stage result is `PASS`;
- no unresolved blocker exists;
- user explicitly approves the stage preview.

User revision feedback must name the stage, part, issue, expected result, and anything that must not change.

## 6. Stop Conditions

Stop only for:

- `REFERENCE_CONFLICT`;
- missing required MCP capability;
- ambiguous project/session ownership;
- same blocker repeated twice;
- requested change that reopens an approved earlier stage.

## 7. Repository Responsibilities

- `Engine/codex/`: compact execution control and schemas.
- `SavedData/sessions/<asset>/`: runtime state, references, checkpoints, evidence, reports, and final output.
- `SourceDocument/modeling/`: human-facing detailed guidance and failure playbooks.
- `src/`: MCP plugin implementation.
- `openspec/changes/codex-local-workflow-rework/`: current rework specification.
