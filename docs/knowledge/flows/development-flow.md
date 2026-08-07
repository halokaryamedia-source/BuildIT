# Development Flow

This is the end-to-end path for **Developing** work.

```text
User request
→ development-brief
→ goal/method/authority grounded
→ development needed?
   ├─ no → explain/reuse + minimum proof
   └─ yes
      → at most one specialist when useful
      → smallest complete implementation
      → minimum useful engineering proof
      → Acceptance POV check
      → conditional critique/evidence escalation
      → update repository state
```

## Development Brief

`development-brief` is mandatory before implementation. Its canonical procedure
lives in `.agents/skills/development-brief/SKILL.md`.

At this boundary the agent must have a grounded goal, authoritative input,
expected output, Build POV, Acceptance POV, minimal scope, acceptance criteria,
and a proof budget appropriate to the execution channel.

The user does not need to provide an expert prompt. A proposed technical method
is not automatically a requirement: reject or redirect it when evidence shows
it would produce a worse, invalid, disproven, or needlessly complex result.

For trivial unambiguous work, use the fast path and keep the visible brief to one
short line.

## Development Necessity

Inspect existing behavior before inventing work. `No change required` is a valid
Developing result when the requirement is already satisfied.

## Specialist Boundary

Use one specialist only when its domain procedure materially helps the active
implementation boundary. A trivial text change may use `development-brief`
alone.

Do not stack overlapping specialists. If investigation exposes another real
boundary, finish or explicitly reframe the current one before selecting a new
specialist. If scope becomes a genuine multi-subsystem contract, migration, or
multi-phase change, apply the OpenSpec threshold instead of silently widening
the task.

## Execution Channel

### ChatGPT → GitHub

Prepare the repository as far as static evidence allows. Do not invent local
shell, MCP, Blockbench, or visual proof. When a material live claim remains,
leave one exact local proof step for Codex.

### Codex local

Use the same brief and acceptance criteria. Run the smallest targeted local
check that can prove or disprove the remaining claim. Do not restart planning or
run broad suites merely because the local environment makes them available.

## Implementation

- inspect the owning source, directly affected callers/patterns, and proof path;
- make the smallest complete change;
- preserve valid behavior outside scope;
- never turn a fixture/named model into generic runtime policy without an
  explicit requirement.

## Dual Validation

### Engineering Pass

Use only proof that is informative for the changed boundary and available in the
active channel.

### Acceptance Pass

Re-check the original `development-brief`:

- did the result solve the downstream Acceptance POV need?
- is the expected output usable as intended?
- did scope remain inside the brief?

Engineering PASS without Acceptance PASS is not completion.

## Conditional Escalation

- `grilling` → plan/decision requires adversarial challenge before commitment;
- `code-review` → independent critique materially adds value after an
  implementation;
- `evidence-gate` → proof is missing/disputed or a direction repeatedly fails;
- GSD-style discovery → unresolved high-impact requirement decision;
- OpenSpec → genuine cross-cutting complexity boundary.

None are mandatory ceremony.

## Repository Continuity

Do not create a planning note per task. Update only the canonical owner:

- active goal/status/blocker/proof/next step → `docs/knowledge/next-action.md`;
- durable decision/reason → `docs/knowledge/decision-log.md` or matching
  decision owner;
- stable policy → `docs/foundation/` only when the policy itself changes.

A new session resumes from these owners rather than reconstructed chat history.

## User Reporting

```text
Status:
Hasil:
Bukti:
Batasan:
Next step:
```

Keep it plain-language and concise. Distinguish `implemented` from `verified`
when local proof is still pending.

## Parent

- [Knowledge Dashboard](../index.md)
- [Flow](../flow.md)
- [Skill Activation Matrix](../skills/activation-matrix.md)
