---
name: development-brief
description: Mandatory front door for BlockIT Developing tasks. Ground the real goal in repository evidence, separate suggested method/fixture from the requirement, detect ChatGPT-to-GitHub vs Codex-local execution, decide whether development is needed, choose Build and Acceptance POVs, define minimal scope with 2-5 provable criteria and a proof budget, then hand off to at most one specialist. Re-check the same contract before completion. Use the fast path for trivial unambiguous changes. Do not use for Plan or Maintenance.
---

# Development Brief

Turn a create/change request into the smallest grounded development contract.
Root `AGENTS.md` already owns independent judgment, source precedence,
root-cause gating, proof economy, evidence status, and anti-slop rules; apply
those rules instead of duplicating them here.

## Required Decisions

Before implementation establish only what materially affects the task:

```text
Goal:
Suggested method (if any):
Observed fixture/example (if any):
Generic requirement:
Execution channel:
Input authority:
Expected output:
Build POV:
Acceptance POV:
Interface constraints:
In scope / Out of scope:
Acceptance criteria: 2-5
Proof budget:
Open high-impact decisions:
```

Omit fields that do not apply.

## Procedure

1. **Ground the goal**
   - Read the current request, `CONTEXT.md`, `next-action.md`, and only the
     relevant policy/source.
   - Separate fact, durable decision, assumption, and unknown.
   - Treat a proposed solution as a method, not automatically as the requirement.
   - Treat samples/fixtures/Golden Samples as evidence unless object-specific
     behavior is explicitly requested.

2. **Detect the execution channel**
   - `ChatGPT → GitHub`: repository preparation/static proof only.
   - `Codex local`: targeted local build/runtime/Blockbench proof may be
     available; verify availability before relying on it.
   - Goal, scope, POVs, and acceptance criteria do not change between channels.

3. **Check whether development is necessary**
   - Inspect the existing owner/pattern first.
   - `No change required` is valid when current behavior already satisfies the
     goal.

4. **Choose the two POVs**
   - **Build POV**: the expert/domain that owns the actual change.
   - **Acceptance POV**: the downstream beneficiary that determines usefulness.
   - Keep intermediate tools/APIs/agents as interface constraints rather than
     extra personas.

5. **Set minimal scope and proof**
   - Define 2-5 acceptance criteria that can actually be disproved/proved.
   - Use the root `AGENTS.md` minimum-useful-proof and evidence-status rules.
   - Ask the user only for unresolved high-impact decisions that repository
     inspection cannot answer.

6. **Select implementation owner**
   - Use this skill alone for trivial work.
   - Otherwise add **at most one** specialist when its domain procedure adds
     material value.
   - Do not stack specialists to cover implementation languages/frameworks that
     are only incidental to the real owner.

7. **Implement and final-gate**
   - Make the smallest complete change.
   - Before `Selesai`, re-check the same goal, scope, acceptance criteria, and
     available proof.
   - Distinguish `implemented` from `verified` when a material local/runtime
     claim still needs proof.

## User-Facing Brief

For non-trivial Developing work, keep the visible brief simple:

```text
Tujuan:
Cara berpikir:
Hasil yang dituju:
Tidak diubah:
Cara memastikan benar:
```

For a trivial unambiguous change, one short line is enough.

## Escalation

Use only when the concrete task needs it:

- unresolved high-impact requirement → lightweight GSD-style discovery;
- plan/decision needs adversarial challenge → `grilling`;
- implemented change benefits from independent critique → `code-review`;
- uncertain/disputed material evidence → root `AGENTS.md` evidence-status rules;
- genuine cross-cutting contract/migration/multi-phase scope → documented
  OpenSpec threshold.

None are default ceremony.
