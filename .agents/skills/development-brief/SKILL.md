---
name: development-brief
description: Mandatory front door for BlockIT Developing tasks in both ChatGPT-to-GitHub and local Codex workflows. Use on any create/change request to ground the real goal in repository evidence, separate a suggested method or fixture from the generic requirement, detect the execution channel, decide whether development is actually needed, choose Build and Acceptance POVs after owner discovery, define input/output/scope/2-5 provable criteria and the minimum useful proof, surface material conflicts, ask only unresolved high-impact decisions, then hand off to one relevant specialist when needed. Re-check the same brief before completion. Use the fast path for trivial unambiguous changes. Do not use for Plan or Maintenance.
---

# Development Brief

Turn a simple or incomplete user request into a grounded Developing contract before implementation.

Do not make the user write an expert prompt. Inspect the repository and choose the appropriate expert perspective from the actual problem owner.

## Core Rules

- Treat the user's **goal** and **suggested solution** as different things. A proposed implementation is not automatically a requirement.
- Do not optimize for agreement. Reject a proposed method when repository evidence shows it is invalid, unnecessary, disproportionately complex, harmful to product quality, or contrary to an authoritative decision; explain why and recommend the smallest better path.
- Treat a sample, fixture, Golden Sample, bug case, or named object as evidence unless the user explicitly requests object-specific behavior.
- Inspect authoritative docs/source before deciding the Build POV or implementation path.
- Detect the **execution channel** before defining proof: `ChatGPT → GitHub` or `Codex local`.
- A Developing request may validly end with **no change required** when existing behavior already satisfies the goal.
- Choose the **Build POV** from the actual problem owner after enough evidence exists; do not select it from prompt keywords alone.
- Choose the **Acceptance POV** from the downstream beneficiary. Keep intermediate API/agent/tool consumers as interface constraints rather than extra personas.
- Define only 2-5 acceptance criteria and make each criterion provable.
- Use the **minimum useful proof** for the current risk and execution channel. Validation is evidence, not ceremony.
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

3. **Detect execution channel**
   - **ChatGPT → GitHub:** repository reads/writes are available, but local shell, Blockbench runtime, and arbitrary local test execution are not assumed.
   - **Codex local:** local source, shell/build/test commands, and runtime tools may be available; verify availability before relying on them.
   - Never invent proof that the active channel cannot produce.

4. **Check development necessity**
   - Inspect existing capability/pattern first.
   - If the requirement is already satisfied, do not invent work. Explain/reuse and verify instead.

5. **Set Dual POV**
   - **Build POV:** expert responsibility owning the actual change, chosen after owner discovery.
   - **Acceptance POV:** downstream user/consumer whose need determines whether the output is good.
   - Record intermediate API/agent/tool consumers as interface constraints when relevant.

6. **Define the contract**

   Keep this internal and omit irrelevant fields:

   ```text
   Goal:
   Suggested solution (if any):
   Observed example / fixture (if any):
   Generic requirement:
   Execution channel:
   Input authority:
   Expected output:
   Build POV:
   Acceptance POV:
   Interface constraints:
   In scope:
   Out of scope:
   Acceptance criteria:
   Proof budget:
   Open high-impact decisions:
   ```

7. **Set the proof budget**
   - Select the cheapest proof that can actually disprove the likely failure.
   - Do not run a test merely because it exists.
   - Do not create tests, CI, fixtures, screenshots, builds, or extra validation artifacts solely to make the task look rigorous.
   - Reuse existing checks when they directly cover the changed behavior.
   - Stop validating once the acceptance criteria have sufficient evidence.

   **ChatGPT → GitHub defaults:**
   - text/docs/routing: inspect changed content, links, paths, and repository consistency;
   - bounded source change: inspect the exact diff, callers/contracts that can be read through GitHub, and existing CI status only when it is directly relevant and already available;
   - runtime/Blockbench behavior that cannot be exercised through GitHub: do not block useful repository work with fake validation. Record the exact remaining local proof and report `Perlu pemeriksaan` only when that proof is material to the claim.

   **Codex local defaults:**
   - start with the smallest targeted check;
   - run build/typecheck/test only when the changed boundary makes that check informative;
   - prefer one targeted runtime reproduction over a broad test suite for a local bug;
   - do not repeatedly re-run unchanged checks after they have already established the required proof.

8. **Resolve ambiguity and conflicts**
   - Use repository evidence for discoverable facts.
   - Use lightweight requirement discovery only for unresolved high-impact decisions.
   - If docs, current request, and implementation materially disagree, stop at `Needs Validation` until the authority is resolved.

9. **Show a simple user brief**

   For non-trivial work:

   ```text
   Tujuan:
   Cara berpikir:
   Hasil yang dituju:
   Tidak diubah:
   Cara memastikan benar:
   ```

   Keep technical machinery internal unless it affects a user decision.

10. **Handoff and implement**
   - Select one specialist only when its domain knowledge/procedure is actually needed.
   - Implement the smallest complete change under the existing Local guardrails.

11. **Final contract gate**
   Before reporting `Selesai`, answer:
   - Did the implementation satisfy the proof budget available in this channel?
   - Did it satisfy the Acceptance POV outcome that can actually be verified here?
   - Did scope remain inside the original brief?
   - Is every material success claim backed by evidence from the active channel?

   If a material claim requires unavailable local/runtime proof, distinguish **implemented** from **verified** instead of fabricating validation.

## Fast Path

For a trivial, unambiguous, low-risk change:

- perform the same internal checks quickly;
- do not invoke discovery or produce a long brief;
- do not load a specialist when it adds no domain value;
- show one short line describing the intended change and boundary;
- make the smallest change and inspect only the proof needed for that change.

Examples: a clear typo, a known-file wording fix, or another change whose meaning and proof are obvious.

## Escalation

- **High-impact requirement still unclear:** use the repository's lightweight GSD-style discovery rule.
- **Plan/decision needs adversarial challenge:** use `grilling` before implementation.
- **Implemented change needs critique:** use `code-review` only when critique adds value beyond the final contract gate.
- **Evidence is missing/disputed or the same direction repeatedly fails:** use `evidence-gate` when available.
- **The task expands into a genuinely cross-cutting contract/migration/multi-phase change:** reframe scope and apply the documented OpenSpec threshold instead of silently widening the brief.
