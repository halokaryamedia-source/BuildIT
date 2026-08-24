# Next Action

Updated: 2026-08-25 — cross-agent execution contract

## Current State

```text
LOCAL_REPOSITORY_CLEANUP_COMPLETE
CROSS_AGENT_EXECUTION_CONTRACT_COMPLETE
AUTHORING_EFFECTIVENESS_TERMINOLOGY_ALIGNED
STATIC_FOOTPRINT_GUARDRAIL_SEPARATED
STALE_CONTINUATION_VERIFIERS_REPAIRED
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE EXPERIMENT
NO ACTIVE DEVELOPMENT
```

Working branch: **`Local` only**. `Experimental/**` remains inactive unless the user explicitly resumes it. GitHub execution/history discipline is owned by `GITHUB_RULES.md`.

## Cross-Agent Contract — Do Not Reinterpret

ChatGPT, Codex, and Opencode use the same repository authority for Developing. Before a non-trivial mutation, the Developing Execution Gate requires:

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
Failure Classification / first wrong owner
In Scope / Out of Scope
Proof Required
STOP Condition
```

For MCP quality/usage work:

- **Authoring Quality** is the accepted-result gate.
- **Authoring Efficiency** is **Cost to Accepted Result**: the shortest justified decision path with unnecessary work minimized.
- **Static Footprint** is only an instruction/schema/surface-size guardrail.

Skill line count, prompt character count, schema size, tool count, or raw MCP-call count alone are **forbidden proxies** for Authoring Efficiency or model quality.

## What Is Already Done — Do Not Repeat

The following current-source work is not an automatic next step:

- coherent `place_cube(elements=[...])` batching;
- coherent `add_group(groups=[...])` batching;
- project logical UV resolution `128` default / `256` opt-in;
- retained texture/Painter hardening and `flatten_layers` source repair;
- mutation-result reuse / reduced ritual readback discipline;
- current 64-tool default Bedrock Entity surface;
- repository cleanup that removed fixture-derived recipes, transient test workspaces, hidden watch deployment, and competing continuation owners;
- cross-agent execution/benchmark semantics established by `AGENTS.md`, `development-brief`, and the local acceptance runbook.

Do not reopen those areas merely because historical commits or old tests mention them.

## Current Continuation

There is **no automatic implementation step**.

If the user explicitly resumes MCP model-quality / efficiency work, use one exact-current-artifact benchmark:

```text
approved reference visible
→ state Success Metric + Forbidden Proxy
→ build/load exact current Local artifact
→ one bounded authoring attempt
→ quality gate
→ call/correction trace
→ classify first wrong owner
→ smallest complete patch only if evidence requires it
→ repeat matching proof
→ compare Cost to Accepted Result
→ STOP
```

If quality fails, a lower raw call count is not an efficiency success.

## Proof Boundary

Repository rules/tests can prove routing and terminology. They cannot prove live model quality or runtime Authoring Efficiency. Those remain **LOCAL PROOF REQUIRED** until the exact current artifact is deliberately run and inspected.

Historical live/static proof belongs in `docs/foundation/validation-report.md`; rationale and discarded approaches belong in Git history.

## STOP

No repository, CI, local-runtime, workspace, or experimental action is implied without a new user instruction.
