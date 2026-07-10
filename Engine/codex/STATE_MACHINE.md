# Codex Runtime State Machine

`SavedData/sessions/<asset>/state.json` is the only runtime authority.

Markdown summaries and lock files are views of this state and must never override it.

## 1. States

```text
REFERENCE_READY

GEOMETRY_IN_PROGRESS
GEOMETRY_REVIEW
GEOMETRY_REVISION
GEOMETRY_APPROVED

TEXTURE_IN_PROGRESS
TEXTURE_REVIEW
TEXTURE_REVISION
TEXTURE_APPROVED

ANIMATION_IN_PROGRESS
ANIMATION_REVIEW
ANIMATION_REVISION
ANIMATION_APPROVED
ANIMATION_SKIPPED

FINAL_VALIDATION
FINAL_REVIEW
FINAL_REVISION
DONE

PAUSED
BLOCKED
REFERENCE_CONFLICT
```

## 2. Normal Transitions

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

Internal passes never create extra user-visible states.

## 3. Review Responses

### APPROVED

When the user approves a review:

1. write `decision: APPROVED`;
2. record `approved_at`;
3. record `approved_checkpoint`;
4. freeze accepted areas;
5. clear resolved review issues;
6. transition to the next stage.

### REVISION

When the user provides `REVISION: ...`:

1. stay inside the same stage;
2. set state to the matching `*_REVISION` value;
3. create one revision scope;
4. preserve all non-affected accepted areas;
5. patch only the named issue or tightly related pair;
6. capture only the affected evidence plus any mandatory comparison view;
7. return to the same review state.

## 4. Stage Review Record

Each stage stores:

```json
{
  "status": "IN_PROGRESS | REVIEW | REVISION | APPROVED | SKIPPED",
  "decision": "PENDING | APPROVED | REVISION_REQUESTED",
  "approved_at": null,
  "approved_checkpoint": null,
  "accepted_areas": [],
  "open_issues": [],
  "revision": null,
  "reopen_reason": null
}
```

## 5. Revision Scope

```json
{
  "stage": "GEOMETRY",
  "parts": ["tail"],
  "issue": "Tail is too short in Left Side view.",
  "expected": "Match the approved Reference Visual length and angle.",
  "preserve": ["head", "torso", "legs", "overall height"],
  "reference": "references/<asset>_reference_visual.png#LEFT_SIDE",
  "verification": ["geometry_left.png", "geometry_front_left_3_4.png"],
  "rollback_checkpoint": "checkpoints/10_geometry_review.bbmodel",
  "attempt": 1,
  "max_attempts": 2
}
```

The one-issue rule applies to revision cycles only.

## 6. Accepted-Area Protection

After approval, accepted areas are immutable by default.

A later stage may change an accepted area only when:

- the user explicitly reopens it;
- a `REFERENCE_CONFLICT` proves the current implementation cannot satisfy the approved package;
- validation finds a blocker that cannot be fixed locally.

Before changing an accepted area, Codex must record:

```text
Reopen requested:
Earlier stage:
Affected accepted areas:
Reason:
Smallest safe change:
Risk:
Rollback checkpoint:
User approval required: Yes
```

## 7. Local Fix vs Stage Reopen

A local fix stays in the current stage when all are true:

- it affects a named part or tightly related pair;
- it does not change total scale;
- it does not change the approved silhouette outside the affected area;
- it does not change approved palette/material identity;
- it does not require a hierarchy redesign;
- it can be verified with focused evidence.

Reopen an earlier stage when any are true:

- total scale changes;
- primary silhouette changes broadly;
- accepted geometry must be rebuilt;
- texture correction requires UV or geometry redesign;
- animation requires a different hierarchy or part separation;
- final validation exposes a broad contract mismatch.

## 8. Blocked States

### BLOCKED

Use when a required runtime capability, project, session, permission, or file is unavailable.

### REFERENCE_CONFLICT

Use when approved authorities materially disagree and no deterministic priority rule resolves the conflict.

### PAUSED

Use only when the user intentionally pauses valid work.

Blocked states require a precise `blocker_code`, evidence, and one safe recovery action.

## 9. Completion

`DONE` is allowed only when:

- Geometry is approved;
- Texture is approved;
- Animation is approved or skipped;
- Final Validation result is `PASS`;
- the user approves Final Review;
- final `.bbmodel`, texture files, validation report, and final evidence exist.
