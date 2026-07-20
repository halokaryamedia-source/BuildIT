# BuildIT Foundation Decision Map

## Destination

Reach an approved, coherent foundation for BuildIT that identifies domain ownership, public module interfaces, proof seams, model-routing boundaries, and the next safe implementation frontier.

## Notes

- OpenSpec records the bounded change contract.
- Ponytail limits each implementation slice.
- Engineering Discipline governs design, TDD, debugging, and review.
- Code Review Graph may narrow context but never replaces source inspection.
- The Reference Studio → Codex + MCP Blockbench product architecture remains fixed.
- This map resolves decisions. Runtime work proceeds only after the relevant decision is closed.

## Decisions so far

- **Use bounded contexts** — Reference Design, Asset Production, Agent Orchestration, Workflow Governance, and Repository Development have separate vocabularies and ownership.
- **Reject one linear authority hierarchy** — conflicts are resolved by question type through domain ownership.
- **Use a domain-owned control plane** — selected over a linear stack and an event-driven orchestration platform.
- **Design deep public modules** — callers should use a small production façade while low-level tools remain implementation details.
- **Separate capability from model selection** — Capability Gate determines eligibility; Model Selector chooses only inside the Candidate Pool.
- **Evaluate RouteLLM before runtime use** — RouteLLM is a candidate adapter, not current production authority.
- **Treat current CI as internal proof only** — real Blockbench and multi-archetype acceptance remain required.
- **Stop extending the monolithic rework change** — new foundation work lives in this bounded change.

## Open decisions

### Public Asset Production interface

**Question:** Are `start_asset`, `continue_asset`, `submit_current_stage`, `apply_review_decision`, and `finalize_asset` the correct long-term external interface, or should stage work be exposed through a smaller single-command interface?

**Decision type:** design/prototype.

### Production snapshot contract

**Question:** What exact fields must every user/agent progress read return without exposing internal mechanics?

**Decision type:** domain modeling.

### Review mode

**Question:** Should the first production release keep every current downstream review gate mandatory, or should any be combined after benchmark evidence?

**Decision type:** later product decision; blocked by production telemetry.

### Golden Sample strategy

**Question:** Should one Golden Sample remain a presentation reference while archetype-specific samples provide construction guidance?

**Decision type:** research/prototype; blocked by multi-archetype corpus.

### RouteLLM integration seam

**Question:** Can the current Codex authentication/provider mode route eligible model calls through a RouteLLM-compatible adapter without losing tool use, model roles, or supportability?

**Decision type:** prototype; P0 before RouteLLM implementation.

### RouteLLM candidate pair and benchmark

**Question:** Which strong/weak models and BuildIT task distribution should be used for calibration and evaluation?

**Decision type:** research; blocked by integration seam and routing fixture dataset.

### Workspace transaction mechanism

**Question:** Is the current backup/rename approach sufficient after Windows fault injection, or is a recovery journal required?

**Decision type:** prototype/testing.

### End-to-end harness

**Question:** Which Blockbench automation boundary can provide a deterministic Windows-first acceptance verdict while minimizing manual clicks?

**Decision type:** research/prototype.

### User status surface

**Question:** Should progress be delivered only through Codex conversation, through a Blockbench panel, or through a generated local status page?

**Decision type:** product prototype; not required for the first behavioral seam.

## Not yet specified

- release and update channel after workstation acceptance;
- support policy for other developers or teams;
- telemetry retention and privacy defaults;
- combined review mode;
- additional modelling categories;
- provider-independent routing deployment.

## Out of scope

- changing the Reference Studio → Codex + MCP Blockbench architecture;
- adding Taste Skill, LLMLingua, or TOON;
- making RouteLLM a permission engine;
- adding another production stage or approval gate;
- central event bus or remote orchestration service;
- merging into `V1` or public release during this foundation decision effort.
