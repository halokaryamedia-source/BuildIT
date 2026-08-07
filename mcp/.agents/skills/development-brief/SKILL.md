---
name: development-brief
description: Mandatory front-door for BlockIT Developing tasks. Use whenever the user asks to create or change code, documentation, workflow, MCP behavior, Blockbench behavior, or another repository artifact. Normalize the request before implementation: separate the real goal from a suggested solution, inspect authoritative context and source, determine whether development is actually needed, isolate examples/fixtures from generic requirements, choose the Build POV and Acceptance POV after the problem owner is understood, define input authority, expected output, minimal scope, 2-5 provable acceptance criteria, and proof, surface material conflicts, ask only unresolved high-impact decisions, then hand off to exactly one specialist skill. Re-check the same brief before reporting completion. Use the fast path for trivial unambiguous changes. Do not use for Plan or Maintenance mode.
---

# Development Brief

Turn a simple or incomplete user request into a grounded Developing contract before implementation.

Do not make the user write an expert prompt. Inspect the repository and choose the appropriate expert perspective from the actual problem owner.

## Core Rules

- Treat the user's **goal** and the user's **suggested solution** as different things. A suggested implementation is not automatically a requirement.
- Treat a sample, fixture, Golden Sample, bug case, or named object as evidence unless the user explicitly requests object-specific behavior.
- Inspect authoritative docs/source before deciding the Build POV or implementation path.
- A Developing request may validly end with **no code change** when existing behavior already satisfies the goal.
- Choose the **Build POV** from the owner of the problem after enough evidence exists; do not select it from prompt keywords alone.
- Choose the **Acceptance POV** from the person or system that ultimately needs the result. Keep intermediate consumers as interface constraints rather than extra personas.
- Define only 2-5 acceptance criteria, and make each criterion provable.
- If material authorities conflict, do not choose silently. Report `Needs Validation` and resolve the conflict before behavior changes.
- Ask the user only for unresolved high-impact decisions that repository inspection cannot establish.
- Use exactly one specialist skill for the implementation owner. If a separate boundary is discovered later, finish/reframe the current boundary before selecting another specialist.
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
   - **Build POV:** the expert responsibility that owns the actual change, chosen after owner discovery.
   - **Acceptance POV:** the downstream user/consumer whose need determines whether the output is good.
   - Record intermediate API/agent/tool consumers as interface constraints when relevant.

5. **Define the contract**

   Use this internal shape; keep it concise and omit irrelevant fields:

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

7. **Show the user a simple brief**

   For non-trivial work, summarize only:

   ```text
   Tujuan:
   Cara berpikir:
   Hasil yang dituju:
   Tidak diubah:
   Cara memastikan benar:
   ```

   Keep technical machinery internal unless it affects a user decision.

8. **Handoff**
   - Select exactly one specialist skill that owns the implementation boundary.
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
- show one short line describing the intended change and boundary;
- make the smallest change and inspect the diff/proof.

Examples: a clear typo, a known-file wording fix, or another change whose meaning and proof are obvious.

## Escalation

- **High-impact requirement still unclear:** use the repository's lightweight GSD-style discovery rule.
- **Plan/decision needs adversarial challenge:** use `grilling` before implementation.
- **Implemented change needs critique:** use `code-review`.
- **Evidence is missing/disputed or the same direction repeatedly fails:** use `evidence-gate` when available.
- **The task expands into a genuinely cross-cutting contract/migration/multi-phase change:** reframe scope and apply the documented OpenSpec threshold instead of silently widening the brief.
