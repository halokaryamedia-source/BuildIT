# Development Flow

This is the end-to-end path for **Developing** work in the repo.

```text
User request
→ development-brief
→ development needed?
   ├─ no → explain/reuse + verify
   └─ yes
      → one specialist
      → smallest complete implementation
      → engineering proof
      → downstream acceptance check
      → review / evidence gate when needed
      → release and document state
```

## 1. Development Brief

`development-brief` is mandatory before specialist implementation.

It normalizes a simple or incomplete prompt into a bounded contract:

- real goal, separated from any suggested solution;
- observed example/fixture separated from the generic requirement;
- authoritative input/source;
- expected output;
- Build POV chosen from the actual problem owner;
- Acceptance POV chosen from the downstream beneficiary;
- minimal in-scope and out-of-scope boundary;
- 2-5 provable acceptance criteria;
- proof path and unresolved high-impact decisions.

Do not make the user write an expert prompt. Inspect discoverable facts first.

### Fast path

For a trivial, unambiguous, low-risk change, keep the same internal checks but
compress the user-facing brief to one short line and continue immediately.

## 2. Development Necessity Gate

Before creating work, inspect whether the requested capability already exists.

```text
Requirement already satisfied?
→ reuse/explain and verify.

Real change required?
→ continue to the owning specialist.
```

`No change required` is a valid Developing result. Do not add code merely
because the user entered Developing mode.

## 3. Scope And Specialist

Choose exactly one specialist skill for the implementation boundary.

- Choose the specialist from the semantic owner of the change, not from every
  technology visible nearby.
- If another independent boundary appears later, finish or explicitly reframe
  the current boundary before selecting another specialist.
- If the work becomes a genuinely cross-cutting contract/migration/multi-phase
  change, stop silent scope growth and apply the OpenSpec threshold.

The minimal/YAGNI and surgical-change baseline is already in `AGENTS.md`; do not
load Ponytail as a third default Developing skill.

## 4. Implementation

- Inspect the owning source, callers, patterns, and proof path.
- Make the smallest complete change that satisfies the brief.
- Preserve already-valid behavior outside the declared boundary.
- Do not convert a fixture or one model example into product-specific runtime
  logic unless the user explicitly asked for that behavior.

## 5. Dual Validation

A Developing task has two different completion questions.

### Engineering Pass

Check the proof appropriate to the implementation:

- source/diff for text-only work;
- targeted tests for behavior/schema/transform changes;
- build/typecheck and contract checks for public MCP changes;
- live runtime or visual proof when the product behavior requires it.

### Acceptance Pass

Check the original Acceptance POV:

- Does the result solve the downstream user's actual need?
- Is the expected output usable in the way the brief required?
- Did the implementation remain inside scope?

A technically correct implementation is not complete if the downstream outcome
still fails.

## 6. Review And Evidence

- Use `code-review` for an implemented change that needs critique.
- Use `evidence-gate` when proof is missing, disputed, rejected, or the same
  direction repeatedly fails.
- Use `grilling` before implementation when a plan/decision needs adversarial
  challenge; do not use it as code review.

These are conditional stages, not mandatory extra skill layers.

## 7. Documentation And Release

Do not create a new planning note for each task.

Update existing owners only when state changes:

- active goal/status/next step → `docs/knowledge/next-action.md`;
- durable decision and reason → `docs/knowledge/decision-log.md` or the matching
  decision owner;
- stable product policy → `docs/foundation/` only when the policy itself changes.

Final user reporting stays simple:

```text
Status:
Hasil:
Bukti:
Batasan:
Next step:
```

## Stop Rules

Stop or reframe when:

- a material source conflict remains unresolved;
- a required high-impact decision cannot be established from the repo;
- investigation shows development is unnecessary;
- the task crosses its declared boundary;
- engineering proof fails;
- the Acceptance POV outcome fails;
- required evidence is unavailable.

## Parent

- [Knowledge Dashboard](../index.md)
- [Flow](../flow.md)
- [Skill Activation Matrix](../skills/activation-matrix.md)
