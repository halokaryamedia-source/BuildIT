# BuildIT Codex Model Routing

## Objective

Use the cheapest eligible route without lowering quality. Deterministic tools answer mechanical questions; model escalation is evidence-driven.

## Defaults

```text
parent default          gpt-5.6-terra / medium
routine auditor         gpt-5.4-mini / low
fallback builder        gpt-5.6-terra / medium
visual director         gpt-5.6-sol / medium
critical reviewer       gpt-5.6-sol / high
maximum effort          high
max agent threads       2
max depth               1
```

The user controls only the parent model. Missing optional roles produce `CODEX_PROJECT_CONFIG_NOT_LOADED` and use safe current-session fallbacks; they do not force restart.

## One writer

The Terra parent is the default writer. `mcp_builder` becomes the sole writer only when the parent differs or isolation is materially safer. Never let both mutate the same asset. The MCP write lease is final authority.

## Classification

| Class | Route |
| --- | --- |
| `MICRO` obvious read-only or trivial change | parent directly |
| `ROUTINE` sizeable mechanical read-only work | Mini, else parent |
| `STANDARD_BUILD` clear implementation/mutation | selected Terra writer |
| `COMPLEX_VISUAL` unresolved cross-view or subjective decision | Sol Medium, else bounded parent fallback |
| `CRITICAL` valid reason code after Medium failed | Sol High once |

No model call may exist only to choose another model. No recursion, broad fan-out, parallel writers, Extra High, Max, Ultra, Fast, automatic legacy models, or priority-speed escalation.

## Visual routing

Reference inspection is not an automatic Sol call. Terra may use the bounded Reference Visual preview and deterministic analyzer directly.

Use Sol Medium only when:

- affected views conflict;
- deterministic metrics cannot identify the visual root cause;
- the user requests a subjective change after deterministic PASS;
- final artistic acceptance remains genuinely unresolved.

Do not call Sol for hashes, state, typecheck, tests, profiles, dimensions, fixed-scale metrics, evidence freshness, review readiness, or export integrity.

## Compact Sol packet

Provide only objective, reason code, stage/profile/revision, relevant views, analyzer summary, last change, preserve/forbidden constraints, and one specific decision. Exclude raw logs, broad repository dumps, and unrelated history.

After judgment, immediately return to the selected Terra writer and deterministic validation.

## Session and call budget

- one runtime status startup call;
- stage context at entry/transition/revision only;
- one Reference Visual preview per unchanged hash;
- affected views during correction;
- one final required-view pass;
- no mandatory advisor call.

## Reporting

Return route/writer, justified escalation, implementation result, validation result, and next safe operation or blocker. Do not ask the user to test internal components.

## Routing and ownership invariants

- The default Terra parent performs standard implementation directly.
- When isolation is needed, mcp_builder becomes the only writer.
- Never let the Terra parent and `mcp_builder` mutate the same active asset concurrently.
- Multiple read-only MCP sessions are allowed. A mutation still requires explicit caller identity and the active write lease.
- Missing optional roles produce `CODEX_PROJECT_CONFIG_NOT_LOADED`; they do not force restart.
- Reject a model call whose only purpose is choosing another model.
- Every Sol decision returns immediately to the selected Terra writer and deterministic validation.
- Reasoning effort never rises above High.
- Full-access caveat: sandbox labels do not replace MCP allowlists; MCP allowlists and the write lease remain authoritative.
