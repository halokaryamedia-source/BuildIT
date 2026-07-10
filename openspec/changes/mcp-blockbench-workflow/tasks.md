# Tasks: MCP Blockbench Workflow Foundation

## Planning Tasks

- [x] Hydrate local workspace from `https://github.com/achmadawdi/mcp-blockbench`.
  - Acceptance criteria: Local repo has upstream source and `git status` works.

- [x] Audit existing repository structure.
  - Acceptance criteria: Entry point, server folder, tools, docs, package manager, and default endpoint are documented.

- [x] Create planning docs under `docs/`.
  - Acceptance criteria: Context Lock, PRD, SRS, system design, UI/UX flow, and task breakdown exist.

- [x] Create design context pack under `SourceDocument/modeling/`.
  - Acceptance criteria: Brief template, style, scale, texture/UV, visual QA, and export target docs exist.

- [x] Create OpenSpec project and change files.
  - Acceptance criteria: Project file, proposal, design, tasks, and four specs exist.

- [x] Verify every planning document has acceptance criteria.
  - Acceptance criteria: Each Markdown document has an Acceptance Criteria section.

- [x] Verify no code implementation was added.
  - Acceptance criteria: Source files under `server/`, `lib/`, `ui/`, `build/`, and root TypeScript files are unchanged.

- [x] Verify no dependency was added.
  - Acceptance criteria: `package.json` and `bun.lock` are unchanged.

## Future Implementation Tasks

- [ ] Configure Codex MCP connection after user approval.
  - Acceptance criteria: Direct HTTP is attempted first; `mcp-remote` fallback is documented if needed; tool listing succeeds.
  - Runtime evidence: store in execution log before marking this task complete.

- [x] Establish per-asset session plan before first MCP edit.
  - Acceptance criteria: `SavedData/sessions/[asset]/session.md` and `SavedData/sessions/[asset]/session-lock.md` exist and include phase, lock owner, target scale, reference package status, and OpenSpec/Ponytail gate outcome before any Blockbench edit.

- [ ] Configure Ollama workflow after user approval.
  - Acceptance criteria: `ollmcp` connects to the endpoint; tools can be listed; human-in-the-loop is enabled for risky actions.

- [ ] Run a Blockbench MCP smoke test.
  - Acceptance criteria: Blockbench is open, endpoint is verified, read-only tool listing succeeds, and no modelling state is changed without approval.
  - Runtime evidence: store in execution log before marking this task complete.

- [ ] Perform a sample Minecraft model brief dry run.
  - Acceptance criteria: Brief is complete, required tools are verified, and planned actions pass design context checks before modelling.

- [ ] Verify modelling workflow readiness checklist before each new model.
  - Acceptance criteria: Session checklist, reference pass/fail checklist, phase-risk simulation, MCP smoke test checklist, phase contract, quality rules, and Ponytail token-saving gate are reviewed before Blockbench edits.

- [x] Create a one-page operator checklist for model sessions.
  - Acceptance criteria: Checklist includes OpenSpec, required skills, MCP readiness, phase stop points, and Ponytail anti-overwork rules.

- [x] Create a generic filled example model session.
  - Acceptance criteria: Example includes project identity, reference status, required user answers, per-phase gates, and acceptance criteria without binding the workflow to one asset.

- [x] Create a New Chat real-flow test checklist.
  - Acceptance criteria: Checklist verifies ChatGPT reference generation and fresh Codex execution without relying on previous conversation memory.

- [x] Rebuild ChatGPT upload ZIP after ChatGPT-facing document changes.
  - Acceptance criteria: ZIP contains `SYSTEM_READ_FIRST.md`, ChatGPT prompt, sample reference images, phase contract, quality rules, session checklist, and reference guide.

- [x] Add Marketplace Reference Intelligence to Codex workflow.
  - Acceptance criteria: OpenSpec includes a requirement to map references to phase-safe execution actions before Main Geometry.

- [x] Run anti-overengineering review.
  - Acceptance criteria: Review confirms no new framework, no unnecessary dependency, no replacement architecture, no hallucinated tools, and no out-of-scope workflow.
  - Execution evidence: review notes stored in `SourceDocument/modeling/ops/full-workflow-audit.md`.

## Acceptance Criteria

- Completed planning tasks are marked.
- Future implementation tasks remain unchecked.
- Each active task has acceptance criteria.
- No source implementation is included in this change.

## Operational Note

Runtime checks (tool availability, endpoint status, environment status) are not embedded as permanent planning outcomes.
Keep those in execution-time notes such as `SourceDocument/modeling/ops/`.

