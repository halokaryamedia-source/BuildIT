# ADR 0002: Introduce RouteLLM only through an evaluation adapter behind the Capability Gate

- Status: Accepted
- Date: 2026-07-20

## Context

BuildIT currently uses deterministic task classes and Codex roles to choose between lower-cost inspection, normal implementation, visual judgment, and rare critical review.

RouteLLM provides a proven framework for strong-versus-weak model routing, threshold calibration, evaluation, and OpenAI-compatible serving. Its published routers were trained and evaluated on model pairs and prompt distributions that differ from BuildIT's agentic coding and Blockbench workloads.

BuildIT also has permissions that prompt complexity alone cannot decide:

- one active writer;
- Blockbench MCP mutation eligibility;
- stage/tool restrictions;
- visual inspection capability;
- critical escalation reason codes;
- deterministic validation requirements.

A direct RouteLLM replacement would therefore mix two different concerns: capability authorization and model selection.

## Decision

BuildIT will separate routing into:

```text
Capability Gate
→ Candidate Pool
→ Model Selector
→ fixed permission set
```

The Capability Gate remains deterministic and owns permissions. RouteLLM may only implement the Model Selector interface.

RouteLLM starts in evaluation mode. It may not choose live production routes until all of the following are true:

1. a supported Codex/provider integration seam is proven;
2. representative BuildIT task fixtures exist;
3. the strong/weak model pair is explicitly selected;
4. thresholds are calibrated on BuildIT data;
5. offline and shadow evaluation meet acceptance criteria;
6. quality, correction cycles, latency, and cost are measured together;
7. deterministic fallback is tested;
8. protected task classes remain excluded or single-candidate.

## Protected task classes

The following remain deterministic unless a later ADR changes them:

- active Blockbench mutation with only one eligible writer;
- permission or lease decisions;
- final approval transitions;
- security-sensitive changes;
- irreversible workspace migration;
- unresolved authority conflicts;
- critical escalation eligibility.

## Consequences

### Positive

- BuildIT can reuse RouteLLM's evaluation and routing research without giving it unsafe authority.
- The current deterministic router becomes a measurable baseline rather than an untested assumption.
- A failed RouteLLM experiment does not break production permissions or workflow state.
- Model selection can evolve behind one stable interface.

### Negative

- Initial implementation does not immediately reduce cost.
- A representative dataset and evaluation harness must be built.
- Codex-native integration may prove infeasible for the current authentication/provider mode.

## Rejected alternatives

### Replace all routing with RouteLLM immediately

Rejected because provider compatibility, candidate models, calibration, and tool-permission behavior are unproven.

### Keep only hand-written deterministic routing forever

Rejected because the project has no evidence that its heuristics are cost-optimal, and RouteLLM provides a stronger evaluation framework.

### Let RouteLLM choose permissions and writers

Rejected because RouteLLM is a prompt/model selector, not a production safety policy engine.
