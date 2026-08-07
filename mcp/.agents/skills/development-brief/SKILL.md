---
name: development-brief
description: Mandatory front door for BlockIT Developing tasks. Use on any create/change request to ground the real goal in repository evidence, separate a suggested method or fixture from the generic requirement, decide whether development is actually needed, choose Build and Acceptance POVs after owner discovery, define input/output/scope/2-5 provable criteria and proof, surface material conflicts, ask only unresolved high-impact decisions, then hand off to one relevant specialist when needed. Re-check the same brief before completion. Use the fast path for trivial unambiguous changes. Do not use for Plan or Maintenance.
---

# Development Brief

Turn a simple or incomplete user request into a grounded Developing contract before implementation.

Do not make the user write an expert prompt. Inspect the repository and choose the appropriate expert perspective from the actual problem owner.

## Core Rules

- Treat the user's **goal** and **suggested solution** as different things. A proposed implementation is not automatically a requirement.
- Treat a sample, fixture, Golden Sample, bug case, or named object as evidence unless the user explicitly requests object-specific behavior.
- Inspect authoritative docs/source before deciding the Build POV or implementation path.
- A Developing request may validly end with **no change required** when existing behavior already satisfies the goal.
- Choose the **Build POV** from the actual problem owner after enough evidence exists; do not select it from prompt keywords alone.
- Choose the **Acceptance POV** from the downstream beneficiary. Keep intermediate API/agent/tool consumers as interface constraints rather than extra personas.
- Define only 2-5 acceptance criteria and make each criterion provable.
- If material authorities conflict, do not choose silently. Report `Needs Validation` and resolve the conflict before behavior changes.
- Ask the user only for unresolved high-impact decisions that repository inspection cannot establish.
- Use one relevant specialist when the implementation has a real specialist owner. Do not stack overlapping specialists. The fast path may use this skill alone when another skill adds no domain value.
- Re-check the original brief before `Selesai`; engineering success alone is insufficient when the downstream acceptance need still fails.

## Workflow

1. **Ground the request**
   - Read the current user request, `CONTEXT.md`, `docs/knowledge/next-action.md`, and only the relevant policy/source.
   - Establish what is fact, what is a prior decision, and what remains unknown.

2. **Normalize intent**
   - State the real goal in outcome language.
   - Separate any user-proposed method from the goal.
   - If a named example is present, distinguish the observed example from the generic requirement.

3. **Check development necessity**
   - Inspect existing capability/pattern first.
   - If the requirement is already satisfied, do not invent work. Explain/reuse and verify instead.

4. **Set Dual POV**
   - **Build POV:** expert responsibility owning the actual change, chosen after owner discovery.
   - **Acceptance POV:** downstream user/consumer whose need determines whether the output is good.
   - Record intermediate API/agent/tool consumers as interface constraints when relevant.

5. **Define the contract**

   Keep this internal and omit irrelevant fields:

   ```text
   Goal:
   Suggested solution (if any):
   Observed example / fixture (if any):
   Generic requirement:
   Input authority:
   Expected output:
   Build POV:
   Acceptance POV:
   Interface constraints:
   In scope:
   Out of scope:
   Acceptance criteria:
   Proof:
   Open high-impact decisions:
   ```

6. **Resolve ambiguity and conflicts**
   - Use repository evidence for discoverable facts.
   - Use lightweight requirement discovery only for unresolved high-impact decisions.
   - If docs, current request, and implementation materially disagree, stop at `Needs Validation` until the authority is resolved.

7. **Show a simple user brief**

   For non-trivial work:

   ```text
   Tujuan:
   Cara berpikir:
   Hasil yang dituju:
   Tidak diubah:
   Cara memastikan benar:
   ```

   Keep technical machinery internal unless it affects a user decision.

8. **Handoff and implement**
   - Select one specialist only when its domain knowledge/procedure is actually needed.
   - Implement the smallest complete change under the existing Local guardrails.

9. **Final contract gate**
   Before reporting `Selesai`, answer:
   - Did the implementation satisfy the engineering proof?
   - Did it satisfy the Acceptance POV outcome?
   - Did scope remain inside the original brief?
   - Is every material success claim backed by the required evidence?

   If any answer is no, do not call the task complete.

## Fast Path

For a trivial, unambiguous, low-risk change:

- perform the same internal checks quickly;
- do not invoke discovery or produce a long brief;
- do not load a specialist when it adds no domain value;
- show one short line describing the intended change and boundary;
- make the smallest change and inspect the diff/proof.

Examples: a clear typo, a known-file wording fix, or another change whose meaning and proof are obvious.

## Escalation

- **High-impact requirement still unclear:** use the repository's lightweight GSD-style discovery rule.
- **Plan/decision needs adversarial challenge:** use `grilling` before implementation.
- **Implemented change needs critique:** use `code-review`.
- **Evidence is missing/disputed or the same direction repeatedly fails:** use `evidence-gate` when available.
- **The task expands into a genuinely cross-cutting contract/migration/multi-phase change:** reframe scope and apply the documented OpenSpec threshold instead of silently widening the brief.
