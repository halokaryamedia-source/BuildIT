# BuildIT Codex Model Routing

## Objective

Reduce usage without lowering production quality. Route deterministically, use the cheapest eligible execution path, validate with tools, and escalate only when evidence requires judgment.

The composer model affects the parent thread only. The user never selects worker models manually.

## One-time preflight

Project-local routing works only when Codex loads the trusted project `.codex/` layer. At the start of a new local project session, confirm that these agents are visible:

```text
routine_auditor
mcp_builder
visual_director
critical_reviewer
```

If they are missing, stop once with:

```text
CODEX_PROJECT_CONFIG_NOT_LOADED
```

Ask the user to trust the current BuildIT project once. Do not continue with an invented routing configuration and do not repeat this request after the agents are visible.

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

Reasoning summaries are disabled for Terra and Mini. Sol uses only concise reasoning summaries. Output verbosity stays low except for visual/critical decisions.

## Why Terra is the parent

Most BuildIT work is implementation, tool use, and MCP production. Terra handles this work directly. A Luna parent that delegates normal work to a Terra child reads and transfers context twice; use Luna only when selected explicitly by the user, not as the project default.

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

Never let the Terra parent and `mcp_builder` mutate the same active asset concurrently. The Blockbench write lease remains the final runtime authority.

## Roles

### Parent/controller

Classify the request using this file, load compact authority, and consolidate results. Directly handle micro work and normal implementation when the parent is Terra Medium. Do not spawn agents when delegation costs more than the task.

### `routine_auditor`

Use only for sizeable mechanical read-only work:

- targeted repository mapping;
- file/hash/profile/adapter checks;
- existing test/build result summaries;
- evidence and checkpoint inventory.

Blockbench MCP is disabled. It cannot write generated output or make visual decisions.

### `mcp_builder`

Fallback Terra writer for:

- standard implementation when the parent is not the approved Terra writer;
- source changes from an approved plan;
- commands that create generated output;
- Geometry, Texture, Animation, evidence, checkpoint, and stage writes.

It may hold the Blockbench lease only after writer ownership is delegated to it.

### `visual_director`

Read-only Sol Medium for:

- Reference Visual interpretation;
- ambiguous cross-view trade-offs;
- subjective user feedback;
- final visual acceptance.

Its Blockbench MCP surface is allowlisted to inspection tools. It never calls persistent diagnosis, evidence-write, lease, mutation, checkpoint, profile, or completion tools.

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

Codex can reapply the parent turn's live permission mode to children. Therefore `sandbox_mode = "read-only"` is defense-in-depth, not the active-asset write boundary.

BuildIT enforces active-asset safety through:

1. custom-agent MCP allowlists/disablement;
2. one selected writer;
3. the project UUID/state/profile-aware Blockbench write lease;
4. current evidence and world-space freshness guards.

## Deterministic classification

| Class | Conditions | Route |
| --- | --- | --- |
| `MICRO` | Obvious low-risk change, little exploration, no visual judgment or active-asset mutation | Parent directly |
| `ROUTINE` | Sizeable mechanical read-only work | `routine_auditor` |
| `STANDARD_BUILD` | Requirements clear; implementation or workspace write required | Terra parent, or `mcp_builder` fallback |
| `COMPLEX_VISUAL` | Species, style, silhouette, cross-view, or subjective judgment | `visual_director` → selected writer |
| `CRITICAL` | Valid reason code and Medium route did not resolve it | `critical_reviewer` once → selected writer |

## MCP production routing

### Startup and identity

The parent handles `get_runtime_status`, `get_stage_context`, and metadata-only identity synchronization. No Sol call is needed.

### Reference direction

Use `visual_director` once per unchanged Reference Visual hash. Return only primary masses, silhouette priorities, preserved areas, and build order.

### Implementation

The selected writer obtains the lease, performs bounded mutations, and validates deterministically. When analyzer output already names part, direction, and magnitude, do not call Sol.

### Visual escalation

Use `visual_director` only when:

- affected views conflict;
- the visual root cause is unclear;
- deterministic metrics pass but the user requests a visual change;
- final artistic acceptance is required.

Provide only the Reference Visual, affected/current views, analyzer summary, fingerprint/signature, constraints, and last-change summary.

### Deterministic validation

Do not call Sol for typecheck, tests, profile validation, hashes, state revision, fixed-scale metrics, review readiness, or export integrity. Commands that write generated output run on the Terra parent or `mcp_builder`; Mini may inspect the result afterward only when useful.

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
→ visual_director Medium only when required
→ critical_reviewer High once only when justified
→ blocker
```

After judgment, immediately de-escalate:

```text
Sol decision
→ selected Terra writer
→ deterministic validation
```

## Missing-role fallback

- Mini unavailable: parent performs the read-only audit directly.
- `mcp_builder` unavailable: default Terra parent may write; a non-Terra parent delegates only if another approved Terra writer exists.
- Sol Medium unavailable: continue deterministic repairs only; stop with `MODEL_ROUTE_UNAVAILABLE` when visual judgment is mandatory.
- Sol High unavailable: report the critical blocker; never substitute a weaker model silently.

Ask the user to change a model only for a mandatory unavailable visual/critical capability.

## Reporting

Return only:

- route and active writer;
- reason for Sol or High, if used;
- implementation result;
- validation result;
- blocker or next safe operation.

Do not add persistent routing telemetry before local benchmark data shows that it is useful.
