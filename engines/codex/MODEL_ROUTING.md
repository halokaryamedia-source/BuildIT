# BuildIT Codex Model Routing

## Objective

Reduce usage without lowering production quality. Route deterministically, use the cheapest eligible execution path, validate with tools, and escalate only when evidence requires judgment.

The composer model affects the parent thread only. The user never selects worker models manually.

## Preflight without restart

Inspect whether these project roles are visible:

```text
routine_auditor
mcp_builder
visual_director
critical_reviewer
```

When roles are missing, record `CODEX_PROJECT_CONFIG_NOT_LOADED` as a routing warning. Do not stop normal production and do not ask the user to start another Codex session.

Current-session fallback:

- missing Mini → parent performs the audit;
- missing `mcp_builder` → Terra parent is the selected Terra writer;
- missing Sol Medium → parent performs bounded visual comparison from the same Reference Visual and current views;
- missing Sol High → stop only for a genuinely critical unresolved decision.

## Defaults and limits

```text
parent default          gpt-5.6-terra / medium
routine auditor         gpt-5.4-mini / low
fallback builder        gpt-5.6-terra / medium
visual director         gpt-5.6-sol / medium
critical reviewer       gpt-5.6-sol / high
maximum effort          high
max open agent threads  2
max agent depth         1
```

Forbidden automatic routes:

- Extra High, Max, Ultra, Fast, or priority-speed escalation;
- recursive agents or broad parallel fan-out;
- parallel active-asset writers;
- automatic GPT-5.5, GPT-5.4, or Spark;
- a model call whose only purpose is choosing another model.

Reasoning summaries are disabled for Terra and Mini. Sol uses concise summaries only. Output verbosity stays low except for visual/critical decisions.

## Why Terra is the parent

Most BuildIT work is implementation, tool use, and MCP production. Terra handles it directly. A separate controller plus Terra child duplicates context and usage.

## Active writer selection

Exactly one writer is selected per task:

```text
default Terra parent
→ parent performs standard implementation and active-asset writes directly

parent explicitly changed to another model
or isolated worker is materially safer
→ parent remains controller
→ mcp_builder becomes the only writer
```

Never let the Terra parent and `mcp_builder` mutate the same active asset concurrently. The Blockbench write lease is the final runtime authority.

Multiple read-only MCP sessions are allowed. A mutation requires explicit caller identity or ownership of the active write lease.

## One-session continuity

The plugin registers one stable protocol-level tool surface. The active logical profile still blocks stage-inappropriate calls.

```text
profile or stage changes
→ old lease released
→ same MCP session
→ same Codex session
→ get_stage_context
→ fresh stage lease
```

Never create a new Codex session, reconnect MCP, or reload the plugin for a normal profile change, approval, revision, or stage transition.

## Roles

### Parent/controller

Classify the request, load compact authority, and consolidate results. Handle micro work and normal implementation directly when the parent is Terra Medium.

### `routine_auditor`

Use only for sizeable mechanical read-only work: targeted repository mapping, file/hash/profile checks, existing test/build summaries, and evidence inventory. Blockbench MCP is disabled.

### `mcp_builder`

Fallback Terra writer for approved standard implementation and active-asset writes. It may hold the Blockbench lease only after writer ownership is delegated to it.

### `visual_director`

Read-only Sol Medium for Reference Visual interpretation, ambiguous cross-view trade-offs, subjective user feedback, and final visual acceptance. Its Blockbench MCP surface is inspection-only.

### `critical_reviewer`

Packet-only Sol High, at most once for one decision, with exactly one reason code:

```text
CRITICAL_VISUAL_ACCEPTANCE
CROSS_VIEW_CONFLICT
ATOMIC_RECOVERY_RISK
SECURITY_CRITICAL
CROSS_SYSTEM_ARCHITECTURE
SOL_MEDIUM_VALIDATION_FAILED
```

Blockbench MCP is disabled. Failure returns a blocker; effort never rises above High.

## Full-access caveat

Codex can reapply the parent turn's live permission mode to children. `sandbox_mode = "read-only"` is defense-in-depth, not the active-asset write boundary.

BuildIT enforces active-asset safety through:

1. custom-agent MCP allowlists/disablement;
2. one selected writer;
3. project UUID/state/profile-aware write lease;
4. current evidence and world-space freshness guards.

## Deterministic classification

| Class | Conditions | Route |
| --- | --- | --- |
| `MICRO` | Obvious low-risk change, no visual judgment or mutation | Parent directly |
| `ROUTINE` | Sizeable mechanical read-only work | `routine_auditor`, else parent |
| `STANDARD_BUILD` | Clear implementation or workspace write | Terra parent, or `mcp_builder` |
| `COMPLEX_VISUAL` | Species, silhouette, cross-view, subjective judgment | `visual_director`, else parent fallback |
| `CRITICAL` | Valid reason code and Medium route failed | `critical_reviewer` once |

## MCP production routing

### Startup and identity

The parent handles workspace initialization, project creation, `get_runtime_status`, `get_stage_context`, and metadata-only identity synchronization. Use the returned `canonical_session_root` for all later calls.

### Golden Sample zero-start

For final Black Rhinoceros acceptance, initialize a fresh workspace from:

```text
docs/reference/golden-samples/black_rhinoceros
```

Use `workspace:sample`. Confirm no `.bbmodel`, checkpoint, evidence, or previous state was copied. Create the project through MCP and build Geometry from zero.

### Reference direction

Use `visual_director` once per unchanged Reference Visual hash when available. Otherwise the parent performs the same compact comparison without asking for a new session.

### Implementation

The selected writer obtains the lease, performs bounded mutations, and validates deterministically. When analyzer output already names part, direction, and magnitude, do not call Sol.

### Visual escalation

Use visual judgment only when affected views conflict, root cause is unclear, deterministic metrics pass but the user requests change, or final artistic acceptance is required.

Provide only the Reference Visual, affected/current views, analyzer summary, signatures, constraints, and last-change summary.

### Deterministic validation

Do not call Sol for typecheck, tests, profile validation, hashes, state revision, fixed-scale metrics, review readiness, or export integrity. Generated-output writes run on the selected Terra writer.

## Compact Sol packet

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
  geometry_world_signature:
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

Exclude raw logs, unrelated history, and broad repository dumps.

## Escalation and de-escalation

```text
deterministic/direct Terra work
→ visual_director Medium only when required and available
→ critical_reviewer High once only when justified
→ blocker
```

After judgment, immediately de-escalate:

```text
Sol decision
→ selected Terra writer
→ deterministic validation
```

## Reporting

Return only route/active writer, justified escalation, implementation result, validation result, and blocker or next safe operation.

Do not ask the user to test internal components. Do not report readiness until automated checks pass and the only remaining action is the one zero-start Golden Sample acceptance test.
