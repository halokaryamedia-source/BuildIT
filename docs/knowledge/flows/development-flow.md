# Development Flow

This is the end-to-end path for **Developing** work in both supported execution
channels: ChatGPT → GitHub and Codex local.

```text
User request
→ development-brief
→ detect execution channel
→ development needed?
   ├─ no → explain/reuse + verify
   └─ yes
      → one specialist when needed
      → smallest complete implementation
      → minimum useful engineering proof
      → Acceptance POV check
      → review/evidence handling when needed
      → release + document state
```

## Development Brief

`development-brief` is mandatory before implementation. Its detailed procedure
lives in `mcp/.agents/skills/development-brief/SKILL.md`.

At this boundary the agent must have a grounded goal, authoritative input,
execution channel, expected output, Build POV, Acceptance POV, scope, acceptance
criteria, and proof budget. The skill also separates a proposed solution or
fixture from the actual generic requirement.

The user does not need to provide an expert prompt. For trivial, unambiguous,
low-risk work, use the skill's fast path and keep the visible brief to one short
line.

## Execution Channel

### ChatGPT → GitHub

Use repository inspection and GitHub writes directly. Do not assume local shell,
Blockbench runtime, or arbitrary local test execution.

Static repository work should not be blocked by invented local validation. If a
material runtime/visual claim cannot be proven through GitHub, finish the safe
repository work, state the exact remaining proof, and use `Perlu pemeriksaan`
for that claim instead of pretending it was tested.

### Codex local

Use local shell/build/test/runtime capabilities only when they are available and
relevant. Start with the smallest targeted check. Broader builds or suites are
not default requirements merely because Codex can run them.

The contract, scope, and acceptance criteria remain the same in both channels;
only the available proof changes.

## Development Necessity

Inspect existing behavior before inventing work. `No change required` is a valid
Developing result when the requirement is already satisfied.

## Specialist Boundary

Use one specialist only when its domain procedure materially helps the
implementation. A trivial text change may use `development-brief` alone.

Do not stack overlapping specialists. If investigation exposes a separate
boundary, finish or explicitly reframe the current boundary before selecting
another. If scope becomes a real cross-cutting contract/migration/multi-phase
change, apply the OpenSpec threshold instead of silently widening the task.

## Implementation

- inspect the owning source, callers, patterns, and proof path;
- make the smallest complete change;
- preserve valid behavior outside scope;
- never turn a fixture or named model into generic runtime policy without an
  explicit requirement.

## Dual Validation

### Engineering Pass

Use the minimum useful proof available in the current execution channel. The
proof should be able to catch the likely failure; it should not exist only to
add ceremony.

Do not create or run unrelated tests, CI, builds, fixtures, screenshots, or
checks after the acceptance criteria already have sufficient evidence.

### Acceptance Pass

Re-check the original `development-brief`:

- did the result solve the downstream Acceptance POV need?
- is the expected output usable as intended?
- did scope remain inside the brief?

Engineering PASS without Acceptance PASS is not completion. When the active
channel cannot prove a material live/visual claim, distinguish implemented from
verified instead of expanding validation artificially.

## Conditional Review

- `code-review`: use only when independent critique adds value beyond the final
  contract gate;
- `evidence-gate`: proof is missing/disputed/rejected or a direction repeatedly
  fails;
- `grilling`: plan/decision needs adversarial challenge before implementation.

These are conditional, not default stacked skills.

## Documentation

Do not create a planning note for each task. Update only the existing owner when
state changes:

- active goal/status/next step → `docs/knowledge/next-action.md`;
- durable decision/reason → `docs/knowledge/decision-log.md` or matching owner;
- stable product policy → `docs/foundation/` only when the policy changes.

Final user reporting stays simple:

```text
Status:
Hasil:
Bukti:
Batasan:
Next step:
```

## Stop Rules

Stop or reframe when a material authority conflict remains, a required decision
cannot be established, development is unnecessary, scope crosses its boundary,
the minimum relevant proof fails, Acceptance POV fails, or a material required
proof is unavailable in the active channel.

Do not stop merely because a broad optional validation suite cannot be run.

## Parent

- [Knowledge Dashboard](../index.md)
- [Flow](../flow.md)
- [Skill Activation Matrix](../skills/activation-matrix.md)
