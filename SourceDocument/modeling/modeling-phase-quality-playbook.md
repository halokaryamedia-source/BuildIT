# Phase Quality Playbook (General)

Use this for every new model session. This is the operational one-liner version of the phase contract.

Single mode only:

- This is the single workflow mode: **Efficiency-First**.
- No phase crossover, no speculative edits, no broad rework.
- Each phase starts with a short execution target and ends once gate evidence is recorded.

## Pre-Session (non-negotiable)

1. OpenSpec read + active change confirmed.  
2. `blockbench-use` loaded (then phase-specific skill only).  
3. MCP endpoint, runtime tool list, active session, and active project verified.  
4. Scope locked: one current phase only.  
5. Reference pack accepted and phase blockers marked.

## Per-Phase Execution Template

Before edit:

- State exact phase (Reference Collection / Main Geometry / Geometry Detailing / UV Texture / Base Texturing / Detail Texturing / Polish / Final Review).
- Set expected output for this phase.
- Set one minimal edit target.
- Confirm what is forbidden in this phase.

During edit:

- Use only required tools for this phase.
- Avoid extra MCP sessions.
- Do not add micro-cubes for color/material only.
- Verify with screenshots at gate points, not after every micro-edit.
- Hard stop: if an issue is cosmetic-only and does not affect scope-critical checks, defer it.

Before moving on:

- Fill: `phase-quality-scorecard-template.md`
- Fill: required screenshot/artifact checklist for the phase
- Confirm all phase failure conditions are addressed
- Resolve: `BLOCKER` before leaving phase
- For `NEEDS_MINOR_FIX`: max 2 critical fixes, then re-score
- Require user approval to continue

Token-saving execution caps (fixed mode):

- Max active issue claims carried forward per phase: 5
- Max open `NEEDS_MINOR_FIX` items per cycle: 2
- Max additional screenshot sets in one cycle: 2
- If unresolved after 2 cycles, request strategy reset from user.

## Exit Gate Rules

- `BLOCKER` -> remain in this phase.
- `NEEDS_MINOR_FIX` -> patch only listed critical fixes (max 2), re-check.
- `PASS` + user approval -> next phase.

## Review Hygiene

- Keep feedback as:
  - Phase:
  - Part:
  - Issue:
  - Expected:
  - Do not change:
  - Reference:
- If feedback is broad ("make better"), request phase + part before edit.
- If feedback is broad after 2 cycles, convert to: 3 numbered action items or user-led reset.

## Post-Phase Record

- What changed (short).
- What deferred (explicit, by phase).
- What must stay unchanged in next phase.
- Known risks for next phase.

## Acceptance Criteria

- One and only one phase is active per cycle.
- Each cycle has explicit scope target and forbidden items.
- Every gate cycle outputs a scorecard + screenshot evidence plan.
- No phase transition happens without `PASS` + user approval.

