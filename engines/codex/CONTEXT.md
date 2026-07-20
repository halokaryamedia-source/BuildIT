# Agent Orchestration Context

This glossary defines the language used when selecting a safe Codex execution route. It contains no production requirement or implementation procedure.

## Terms

**Task** — One bounded request to inspect, decide, build, revise, validate, or review something.

**Task Kind** — A deterministic classification describing what capability a Task requires, such as mechanical inspection, repository implementation, asset mutation, visual judgment, or critical review.

**Capability Gate** — The policy decision that determines which permissions, tools, models, and writer roles are eligible for a Task.

**Candidate Pool** — The eligible model routes remaining after the Capability Gate. An ineligible model can never be restored by later routing.

**Model Selector** — A replaceable mechanism that chooses one route from a Candidate Pool. It may be deterministic or learned.

**Route Decision** — The chosen model, effort, role, tool permission set, and justification for one Task.

**Writer Route** — A Route Decision authorized to mutate the active Asset or repository.

**Read-Only Route** — A Route Decision that may inspect and advise but may not mutate protected state.

**Escalation** — A justified move to a more capable eligible route after lower-cost evidence cannot safely resolve the Task.

**De-escalation** — The return from an advisory or critical route to the active Writer Route and deterministic verification.

**Routing Baseline** — The currently accepted Model Selector used to compare candidate routing systems.

**Routing Evaluation** — Offline or shadow comparison of Route Decisions against representative BuildIT Tasks and measurable outcomes.

**Routing Adapter** — The implementation that connects a Model Selector to Codex execution without granting additional capability.

**RouteLLM Adapter** — A candidate Routing Adapter using RouteLLM for strong-versus-weak model selection inside a pre-approved Candidate Pool.

**Routing Conflict** — A condition where the selected route cannot satisfy the Capability Gate or current execution environment.
