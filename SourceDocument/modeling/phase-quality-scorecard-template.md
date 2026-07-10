# Phase Quality Scorecard (General)

Use this for every phase gate before moving forward, for any model family.

## Phase

```text
Phase: ...
Date/Session: ...
Model/Asset: ...
```

## Score Rules

Status values:

- PASS
- NEEDS_MINOR_FIX
- BLOCKER

Rules:

- `BLOCKER` means this phase must stop.
- `NEEDS_MINOR_FIX` means apply up to 2 critical fixes before advancing.
- `PASS` means request user approval to continue to the next phase.

Critical fixes limit:

- Max 2 critical fixes per transition.
- More than 2 critical issues requires one more local patch cycle, then re-score.
- If a phase is `BLOCKER` for the same reason 2 consecutive cycles, stop and request explicit user direction before continuing.

Token-saving gate:

- Do not open new phase docs during a fix cycle if `phase-quality-scorecard-template.md` and `phase-detail-contract.md` already define scope.
- Fixes must be described in 1–3 bullets and one screenshot batch.

## Score Row

### 1. Silhouette / Form Readability
- Status:
- Note:
- Front:
- Side:
- Back:
- 3/4:

### 2. Attachment Logic
- Status:
- Note:
- Parent chain:
- Pivot logic:

### 3. Collision / Floating Control
- Status:
- Note:

### 4. Cube Budget Discipline
- Status:
- Note:
- Cube purpose failures:

### 4a. Geometry Precision Gate
- Scale envelope recorded: Yes / No / N/A
- Scale drift: PASS / PARTIAL / BLOCKER / N/A
- Part bounding boxes recorded: Yes / No / N/A
- Build order followed: Yes / No / N/A
- Orthographic front/side match: PASS / PARTIAL / BLOCKER / N/A
- Reference match: PASS / PARTIAL / BLOCKER / N/A
- Repeated blocker: Yes / No
- Recovery required: Yes / No

### 5. Texture Readiness
- Status:
- Note:

### 6. UV / Material Coherence
- Status:
- Note:

### 7. Feedback Mapping
- Status:
- Note:

### 8. Marketplace Baseline
- Status:
- Note:
- Silhouette readable from gameplay distance:
- Clean hierarchy / attachment:
- Texture-only micro detail preserved:
- Material depth planned or present:
- Execution target risks addressed:

## Phase Decision

- `Advance`: Yes / No
- `Blocker` (if No):
- `Critical Fixes (max 2)`:
- `Optional Fixes`:
- `User Approved Next Phase`: Yes / No

- If `Critical Fixes` is filled, set `Advance: No` and keep phase lock.

Reopen condition:

- `Needs user clarification` only if required references are missing or conflicting and no deterministic fix can be made.

## Quick Summary

- What changed:
- What was deferred to next phase:
- What must not be changed in next phase:

## Gate Traceability

- Screenshot check:
- Tool check:
- Reference check:

Evidence summary (max 5 lines):
- what improved:
- what deferred:
- what stayed unchanged:

## Acceptance Criteria

- Score status is explicit: PASS / NEEDS_MINOR_FIX / BLOCKER.
- At most 2 critical fixes are recorded before re-score.
- Tool check, reference check, and screenshot check are filled for the gate.
- Phase decision is tied to user approval state and next phase is blocked if not approved.
