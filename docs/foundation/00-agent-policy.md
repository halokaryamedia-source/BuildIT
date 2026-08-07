# BlockIT — Agent Policy

**Status:** Active  
**Version:** 1.0

## Purpose

Define how Codex must behave while developing BlockIT.

This file defines product-facing agent policy. The workspace boot path starts
with the root `AGENTS.md`, then `CONTEXT.md`, then the active task snapshot;
this policy is opened only when the task needs foundation rules.

## Document Roles

- `00-agent-policy.md`: Codex behavior rules and work guardrails.
- `01-project-overview.md`: shortest possible answer to what BlockIT is and who it is for.
- `02-product-requirements.md`: product requirements, scope, MVP, and definition of done.
- `03-modelling-workflow.md`: execution order.
- `04-reference-guide.md`: reference input rules.
- `05-geometry-standard.md`: geometry rules.
- `06-texture-standard.md`: texture rules.
- `07-visual-validation.md`: visual checkpoint rules.
- `08-source-selection.md`: source selection rules.
- `09-merge-map.md`: merge boundary and source decisions.
- `validation-report.md`: verified / unverified boundary.

## Read Order

1. `00-agent-policy.md`
2. `01-project-overview.md`
3. `02-product-requirements.md`
4. `03-modelling-workflow.md`
5. `04-reference-guide.md`
6. `05-geometry-standard.md`
7. `06-texture-standard.md`
8. `07-visual-validation.md`
9. `08-source-selection.md`
10. `09-merge-map.md`
11. `validation-report.md`

## Mandatory Rules

Codex must:

- read the relevant docs before changing code;
- inspect the repository before implementing;
- not assume Blockbench, Minecraft Bedrock, or MCP capabilities;
- prefer the simplest solution that satisfies the requirement;
- avoid unnecessary abstractions, dependencies, and new files;
- keep work within approved scope;
- report limitations honestly;
- mark unverified capabilities as `Needs Validation`;
- not claim visual correctness without visual review;
- stop when the requested scope is complete.

## Priority Rules

If rules conflict, follow this order:

1. safety, data integrity, and recovery;
2. verified source and verification rules;
3. documented scope and product intent;
4. efficiency and minimal-diff rules;
5. wording, style, and presentation.

If a lower-priority rule conflicts with a higher-priority rule, the higher-priority rule wins.

## Work Order

```text
Understand request
↓
Read relevant documentation
↓
Inspect existing implementation
↓
Create short plan
↓
Implement the smallest complete change
↓
Verify
↓
Update documentation when needed
↓
Report result and limitations
```

## Planning Rules

- Identify the exact requirement.
- Identify affected modules.
- Identify dependencies.
- Identify what is confirmed and what needs validation.
- Create a short plan with the smallest useful path.

Do not create long speculative plans or future-proofing.

Ask for clarification only when missing information materially affects implementation.
If the task can be completed with a small safe assumption, use it and report it.
If the assumption changes scope, behavior, safety, or verification, stop and ask first.
If the request is ambiguous but a safe default exists, take the default and state it explicitly.

## Scope Rules

- Do not add unrelated features.
- Do not redesign unrelated systems.
- Do not create new architecture without a proven need.
- Do not expand MVP into target-product scope without approval.
- Do not silently change documented behavior.

If a request expands scope, stop and call it out.
If the request can be solved by deletion or reuse, prefer that over addition.
If two options are equally valid, choose the one with the smaller diff.
If a request is outside the documented scope, do not “partially” implement it through side effects.

## Source Rules

Any claim about Blockbench, Minecraft Bedrock, or MCP must come from:

- official documentation;
- verified source code;
- verified existing implementation;
- a reproducible proof of concept;
- clearly identified user workflow knowledge.

If not verified, label it:

> Needs Validation

Do not convert assumptions into permanent rules.

## Visual Rules

Codex must not equate structural success with visual success.

If visual preview or the visual critic is unavailable, use `BLOCKED`.

If a fresh SIDE capture and the section-declared FRONT or BACK capture are
reviewed and concrete visual checks are recorded, the visual gate may become
`PASS`. A score is never evidence.

Use `Completed` only when the documented completion criteria are satisfied.

If the same issue fails twice after local fixes, stop and report.
Visual work must follow a short loop:

1. Build one checkpoint.
2. Capture preview.
3. Review only the current checkpoint.
4. Apply one local fix.
5. Capture preview again.
6. Stop if the same issue does not improve after two fixes.

## Coding Rules

- Follow existing project conventions.
- Keep functions focused.
- Avoid duplicated logic.
- Use clear names.
- Avoid unnecessary dependencies.
- Remove debug output before completion.
- Do not overwrite unrelated files.
- Do not silently change public contracts.
- Freeze parts that already passed review.
- Fix locally, not by rebuilding the whole model.

## Repository Inspection Rules

- Inspect the relevant files before editing.
- Locate existing patterns.
- Verify imports and dependencies.
- Identify tests and build commands.
- Understand current behavior.

Do not replace an existing implementation blindly.

## Verification Rules

Run available checks when applicable:

- type checking;
- linting;
- unit tests;
- integration tests;
- build;
- manual proof of concept.

If a check cannot be run, report that clearly.

Do not claim success without evidence.

## MCP Rules

For each MCP operation:

- verify the tool exists;
- verify its input and output;
- verify failure behavior;
- verify whether changes persist;
- verify save behavior;
- verify whether undo or recovery exists.

Do not build product behavior on an unverified MCP assumption.

## Error Handling Rules

- Do not swallow errors.
- Preserve the project when possible.
- Report the failed operation.
- Explain whether the failure is product logic, MCP capability, Blockbench behavior, or unknown.
- Do not repeat the same failing operation indefinitely.
- Stop and report when further retries are unlikely to help.
- If the same visual issue remains after two local fixes, stop.
If a new hypothesis is needed, change the approach before retrying.
If the same failure repeats twice with no new evidence, stop and re-plan before any further edit.
Do not mask a failure by adding a fallback that has not been verified.

## Efficiency Rules

- Plan before using many tool calls.
- Avoid rereading unchanged data.
- Avoid rebuilding correct parts.
- Use local targeted corrections.
- Use batch operations only when verified and safer.
- Do not reduce required validation merely to save tokens.
- Do not enter unlimited refinement loops.
- Do not add tools, docs, or abstractions unless they remove more work than they create.
- Do not touch parts that already passed review unless a new bug proves they are related.
- Do not ship repeated patch churn that only renames, reshuffles, or restyles without changing the actual outcome.
- Do not leave behind legacy variants, dead code, or temporary files unless the migration is explicitly required and verified.
- Do not spend time polishing a broken path when the root cause is still unconfirmed.

## Anti-Slop Rules

Codex must not work in a way that creates AI slop:

- do not fix one root problem with many tiny cosmetic patches;
- do not create repeated version churn without functional progress;
- do not leave behind legacy duplicates, dead branches, or temporary files unless the migration is explicitly required;
- do not generate implementation work from guessed behavior or hallucinated requirements;
- do not keep adding compatibility layers when one verified change can replace them.

If a fix starts producing repeated patch churn, stop and re-evaluate the root cause before continuing.

## Hard No-Guess Rule

This rule is mandatory for every modelling, reference, MCP, and reporting task:

- An assumption, inference, or plausible interpretation MUST NOT be presented
  as a fact, requirement, measurement, successful result, or approval.
- Every material claim MUST name its source and the evidence that supports that
  exact claim. Documentation, memory, prompts, and previous agent reports are
  not runtime or visual proof.
- A cube `from`, `to`, `origin`, `rotation`, parent, pivot, or semantic part
  MUST NOT be invented from an image when the source does not specify it or a
  live visual check cannot establish it.
- A valid schema, successful MCP call, coordinate check, overlap check,
  hierarchy check, screenshot, projection score, or mesh fit MUST NOT be
  reported as proof of resemblance, anatomy, proportion, or visual quality.
- If the required evidence is missing, the only allowed result is
  `Needs Validation` or `BLOCKED`. No confidence score, fallback value,
  compensating cube, or automatic interpretation may be used to hide the gap.
- When a method has failed twice without new evidence, stop it. Do not rename,
  restyle, wrap, or repeat the same unproven method.
- A task is not complete until the relevant evidence has actually been
  inspected. If visual evidence is unavailable, report structural validation
  only.

## Reporting Rules

At the end of a task, report:

- what was completed;
- which files changed;
- what was verified;
- known limitations;
- what still needs validation;
- final status.

Reporting must be short, factual, and action-oriented.
Do not narrate the process unless the user asks.
Do not claim completion if any required verification or visual review is still pending.
If something remains unverified, say so plainly.

### User-Facing Reporting

Use plain language by default. Explain technical terms when they are necessary;
prefer the user's goal, visible result, risk, and next action over internal
skill names or architecture jargon.

Use these user-facing statuses:

- `Selesai`: the change and required proof are complete.
- `Perlu pemeriksaan`: the change may be correct, but visual, runtime, or
  external proof is still missing.
- `Terhenti`: safe progress is blocked by an unknown cause, conflict, missing
  capability, or unavailable proof.

Every final report must contain:

```text
Status:
Hasil:
Bukti:
Batasan:
Next step:
```

Do not call a task complete merely because a file changed or a build passed.

Valid internal visual statuses:

- `ISSUES_FOUND`
- `BLOCKED`
- `PASS`

## Stop Conditions

Stop when:

- the requested scope is complete;
- required verification is complete;
- unresolved limitations are documented;
- further refinement would not materially improve the result;
- the user needs visual review or clarification;
- an unverified capability blocks safe progress.

## Prohibited Behavior

Codex must not:

- invent APIs;
- invent Blockbench behavior;
- invent Minecraft Bedrock limits;
- claim a visual result without seeing it;
- continue retrying without a new hypothesis;
- expand the project because a feature sounds useful;
- create unnecessary documentation or architecture;
- hide failed verification;
- present assumptions as facts.

## Foundation Boundary

These eight documents form the initial BlockIT foundation.

Do not add more foundation documents unless a real project need is proven.

Use `docs/knowledge/` for working notes, active decisions, ownership maps, and Obsidian navigation.

After this foundation, the next phase is:

1. validate official sources;
2. inspect existing MCP implementations;
3. build a proof of concept;
4. design architecture based on verified findings;
5. implement incrementally.

No additional foundation document should be added unless a real project need is identified.
