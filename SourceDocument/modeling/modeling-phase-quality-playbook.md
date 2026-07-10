# Stage Quality Playbook

Use this compact playbook for every local Codex model session.

## Operating Mode

- Efficiency-first.
- One user-visible stage active at a time.
- Internal passes are completed without routine user interruption.
- Stage review happens only when required evidence is ready.
- No speculative tools, sessions, cubes, screenshots, or documents.

## One-Time Pre-Session

1. Read active OpenSpec change.
2. Read `Engine/codex/BOOTSTRAP.md` and active `state.json`.
3. Validate the approved reference package.
4. Load `blockbench-use` and the active-stage skill only.
5. Verify endpoint, tools, project, UUID, format, UV mode, and session ownership.
6. Record manual edits to preserve.
7. Save persistent start checkpoint.

Do not repeat the full preflight for every edit.

## Active Stages

```text
GEOMETRY
TEXTURE
ANIMATION — optional
FINAL_VALIDATION
```

## Stage Start Template

```text
Stage:
Goal:
Internal passes:
Required output:
Forbidden work:
Reference authority:
Checkpoint:
```

## During Initial Stage Work

- Use bounded batches that complete one coherent structural or surface unit.
- Use only stage-relevant tools.
- Keep one active MCP write session.
- Capture evidence at meaningful checkpoints, not after every micro-edit.
- Do not create geometry for color/material-only detail.
- Do not open failure playbooks unless their trigger occurs.

## Stage Review Gate

Before requesting review:

- required stage artifacts exist;
- required previews exist;
- stage checks are complete;
- no blocker remains;
- `state.json` is updated;
- persistent checkpoint is saved;
- result is `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

Review report:

```text
Stage:
Status:
Completed:
Preserved:
Evidence:
Issues:
Next user action: APPROVED or REVISION: ...
```

## Revision Cycle

One issue or tightly related pair per cycle:

```text
Stage:
Part:
Issue:
Expected:
Do not change:
Reference:
Verification:
```

Rules:

- patch locally;
- preserve accepted areas;
- one focused edit batch;
- one focused verification set;
- return to the same stage review;
- stop after two repeated failures and request strategy reset.

## Evidence by Stage

### Geometry

- Front
- Left Side
- Back
- Top / Footprint
- Front-left 3/4
- scale/hierarchy/cube summary

### Texture

- atlas
- UV summary
- Front
- Left Side
- Back
- Front-left 3/4

### Animation — when required

- hierarchy/pivots
- required clips or sampled poses
- neutral-pose recovery
- clipping/ground-contact result

### Final Validation

- final candidate `.bbmodel`
- textures
- completed validation
- five standard views
- animation evidence when relevant
- revision summary

## Token-Saving Caps

- Maximum open critical revision items per cycle: 2.
- Maximum extra evidence sets for one revision cycle: 1, unless the issue affects multiple required views.
- Maximum repeated attempts for the same blocker: 2.
- Do not restate unchanged reference context.
- Do not reload all category documents; load the active one.

## Acceptance Criteria

- One user-visible stage is active.
- Internal passes do not ask for separate approval.
- Every review is evidence-based.
- Revision scope is local and explicit.
- Accepted work is preserved.
- Final Validation waits for user approval or correction request.
