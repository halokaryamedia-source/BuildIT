# BuildIT Codex Model Routing

## Objective

Reduce Codex usage without lowering production quality. Routing is deterministic first: use the cheapest eligible role, validate the result, and escalate only when evidence shows that deeper judgment is required.

The user does not choose workers manually. An explicit model selected in the composer affects the parent thread only; the parent remains a thin controller and routes substantive work to the locked custom agents.

## Defaults and hard limits

```text
parent default          gpt-5.6-luna / medium
routine auditor         gpt-5.4-mini / low
standard builder        gpt-5.6-terra / medium
visual director         gpt-5.6-sol / medium
critical reviewer       gpt-5.6-sol / high
maximum effort          high
max open agent threads  2
max agent depth         1
```

Forbidden automatic routes:

- `xhigh`, Extra High, Max, or Ultra;
- Fast mode or priority-speed escalation;
- recursive agents;
- parallel Blockbench writers;
- automatic use of GPT-5.5, GPT-5.4, or Spark;
- a model call whose only purpose is choosing another model.

## Roles

### Parent/controller

The parent reads the user request, loads compact authority, classifies the work, delegates only when delegation is cheaper or safer, and consolidates the result. It does not keep doing expensive work merely because the user selected a large model.

### `routine_auditor`

Use for mechanical, read-only work:

- targeted repository search;
- file, hash, profile, adapter, evidence, and checkpoint checks;
- test/build execution and compact failure summaries;
- schema/list consistency checks;
- read-only comparison and reporting.

Do not use for visual judgment, architecture, implementation, or MCP mutation.

### `mcp_builder`

Use for normal implementation after the desired result is clear:

- ordinary BuildIT source changes;
- MCP tool implementation from an approved plan;
- Geometry, Texture, or Animation mutation;
- deterministic repair;
- evidence, checkpoint, and stage operations.

During asset production, this is the only role allowed to hold the project write lease or mutate Blockbench.

### `visual_director`

Use for read-only visual judgment:

- Reference Visual interpretation;
- initial form and silhouette direction;
- ambiguous cross-view trade-offs;
- subjective user feedback;
- final visual acceptance.

Return a compact direction packet. Do not implement or mutate.

### `critical_reviewer`

Use at most once for one unresolved critical decision and only with one reason code:

```text
CRITICAL_VISUAL_ACCEPTANCE
CROSS_VIEW_CONFLICT
ATOMIC_RECOVERY_RISK
SECURITY_CRITICAL
CROSS_SYSTEM_ARCHITECTURE
SOL_MEDIUM_VALIDATION_FAILED
```

High is the ceiling. If this role cannot clear the decision, report a blocker instead of increasing effort.

## Deterministic classification

| Class | Conditions | Route |
| --- | --- | --- |
| `MICRO` | One obvious low-risk change, no visual judgment, no active-asset mutation, little exploration | Parent directly, maximum medium |
| `ROUTINE` | Mechanical/read-only, result fully verifiable | `routine_auditor` |
| `STANDARD_BUILD` | Requirements clear, implementation or tool use needed | `mcp_builder` |
| `COMPLEX_VISUAL` | Species, style, silhouette, cross-view, or subjective judgment | `visual_director`, then `mcp_builder` |
| `CRITICAL` | Valid critical reason code and medium route is insufficient | `critical_reviewer`, then `mcp_builder` |

A micro-task should not spawn an agent when delegation overhead would exceed the work. Active-asset mutation is never a micro-task for the parent: route it to `mcp_builder`.

## Parent model mismatch

### Parent is more expensive than needed

Keep the parent to classification and consolidation. Delegate routine or implementation work to the cheaper eligible role. For a genuinely tiny task, finish directly rather than paying subagent overhead.

### Parent is less capable than needed

Do not perform risky mutation or guess. Build a compact packet and delegate to `mcp_builder`, `visual_director`, or `critical_reviewer` according to the table. Do not ask the user to change the composer model unless the required custom agent is unavailable.

### Parent has no visual capability

Never evaluate Reference Visuals. Route visual work to `visual_director`.

## MCP production routing

### Startup, identity, and orchestration

The parent normally handles compact status and routing. Metadata-only identity synchronization may be performed directly when `get_stage_context` requests it. No large model is needed.

### Reference interpretation

Use `visual_director` once per unchanged Reference Visual hash. Return primary masses, silhouette priorities, preserved areas, and build order.

### Geometry, Texture, and Animation implementation

Use `mcp_builder` as the single writer. It follows the active stage skill, obtains the lease, performs bounded mutation batches, validates deterministically, and returns the next safe operation.

### Geometry correction

When analyzer output already names the part, direction, and magnitude, use `mcp_builder` directly. Use `visual_director` only when views conflict, the root visual cause is unclear, the analyzer passes but the user still requests a visual change, or the result needs artistic judgment.

### Final visual acceptance

Use `visual_director` with only the Reference Visual, current final views, analyzer summary, fingerprint, and last-change summary. Do not send the whole repository or raw logs.

### Final deterministic checks

Use `routine_auditor` for hashes, files, profile size, adapter equality, tests, and build summaries. Deterministic checks must not trigger Sol review.

## One-writer rule

```text
parent/controller  orchestration only
routine_auditor    read-only
visual_director    read-only
critical_reviewer  read-only
mcp_builder        only MCP writer
```

Never run two asset mutations in parallel. The builder must stop and return a decision request before visual escalation; it must not hold an ambiguous mutation open while another role edits.

## Compact decision packet

Before using Sol, provide only:

```yaml
task:
  objective:
  reason_code:
  expected_output:
current_state:
  stage:
  profile:
  state_revision:
  geometry_fingerprint:
evidence:
  relevant_views:
  analyzer_summary:
  last_change:
constraints:
  preserve:
  forbidden:
question:
  one_specific_decision:
```

Prefer no more than eight relevant files, one compact test summary, and one compact visual summary. Exclude raw logs and unrelated conversation history.

## Escalation and de-escalation

```text
routine_auditor low
→ mcp_builder medium
→ visual_director medium
→ critical_reviewer high once
→ blocker
```

Escalate only when validation shows a reasoning or judgment failure. One mechanical correction may remain at the same tier.

After a heavy decision, immediately de-escalate:

```text
Sol decision packet
→ Terra implementation
→ Mini deterministic audit
```

Sol must not stay active for searches, formatting, command execution, evidence writing, checkpointing, or log summaries.

## Validation rule

When a deterministic gate can answer the question, do not call a larger model. Required examples include typecheck, tests, profile validation, hash comparison, state revision checks, fixed-scale analyzer results, review-readiness gates, and export integrity.

## Reporting

The parent reports only:

- route used;
- reason for any Sol or High invocation;
- implementation result;
- validation result;
- blocker or next safe operation.

Do not create persistent per-task routing telemetry until real benchmark data shows it is necessary.
