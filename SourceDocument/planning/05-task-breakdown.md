# Task Breakdown

Each task includes purpose, inputs, output file, acceptance criteria, and status.

## Phase 1: Source Audit

- [x] Inspect repo structure
  - Purpose: Establish existing architecture.
  - Inputs: Local repository files.
  - Output file: `SourceDocument/planning/00-context-lock.md`.
  - Acceptance criteria: Entry point, server, tools, docs, package manager, and endpoint are identified.

- [x] Identify MCP server entrypoint
  - Purpose: Avoid creating a new server.
  - Inputs: `index.ts`, `server/`, `AGENTS.md`.
  - Output file: `SourceDocument/planning/03-system-design.md`.
  - Acceptance criteria: Existing plugin/server boundary is documented.

- [x] Identify available MCP tools
  - Purpose: Prevent hallucinated tool use.
  - Inputs: `docs/api.json`.
  - Output file: `SourceDocument/planning/00-context-lock.md`.
  - Acceptance criteria: API version and tool/prompt/resource counts are documented.

- [x] Identify Codex config example
  - Purpose: Document Codex connection.
  - Inputs: `README.md`, `.vscode/mcp.json`.
  - Output file: `SourceDocument/planning/02-srs.md`.
  - Acceptance criteria: Direct HTTP and fallback guidance are captured.

- [x] Identify Ollama config example
  - Purpose: Document local model workflow.
  - Inputs: `README.md`, `mcp-client-for-ollama` docs.
  - Output file: `SourceDocument/planning/04-uiux-flow.md`.
  - Acceptance criteria: URL connection and human-in-the-loop are captured.

- [x] Identify existing skills
  - Purpose: Reuse existing skill guidance.
  - Inputs: `.agents/skills/`, Blockbench MCP sample project.
  - Output file: `SourceDocument/planning/01-prd.md`.
  - Acceptance criteria: Skills are referenced as source guidance, not new architecture.

- [x] Identify missing documentation
  - Purpose: Define planning outputs.
  - Inputs: Existing `docs/` and missing `openspec/`.
  - Output file: `SourceDocument/planning/05-task-breakdown.md`.
  - Acceptance criteria: Required docs and OpenSpec files are listed.

## Phase 2: OpenSpec Setup

- [x] Create Context Lock
  - Purpose: Prevent context loss.
  - Inputs: Source audit.
  - Output file: `SourceDocument/planning/00-context-lock.md`.
  - Acceptance criteria: Scope, non-scope, sources, and context rules are included.

- [x] Create OpenSpec project overview
  - Purpose: Store project-level guardrails.
  - Inputs: Context Lock.
  - Output file: `openspec/project.md`.
  - Acceptance criteria: Purpose, constraints, allowed sources, rules, guardrails, and review process are included.

- [x] Create workflow proposal
  - Purpose: Explain why the planning change exists.
  - Inputs: PRD and SRS.
  - Output file: `openspec/changes/mcp-blockbench-workflow/proposal.md`.
  - Acceptance criteria: Need, changes, non-changes, risks, and success criteria are included.

- [x] Create specs
  - Purpose: Define verifiable requirements.
  - Inputs: SRS.
  - Output file: `openspec/changes/mcp-blockbench-workflow/specs/`.
  - Acceptance criteria: Codex, Ollama, design context, and guardrail specs exist.

- [x] Create design document
  - Purpose: Document architecture without changing it.
  - Inputs: System design.
  - Output file: `openspec/changes/mcp-blockbench-workflow/design.md`.
  - Acceptance criteria: Workflow design and boundaries are included.

- [x] Create task list
  - Purpose: Make future work actionable.
  - Inputs: This task breakdown.
  - Output file: `openspec/changes/mcp-blockbench-workflow/tasks.md`.
  - Acceptance criteria: Phases, checkboxes, and acceptance criteria are included.

## Phase 3: Codex Scenario

- [x] Document Codex MCP setup
  - Purpose: Enable Codex workflow.
  - Inputs: MCP Blockbench README.
  - Output file: `SourceDocument/planning/02-srs.md`.
  - Acceptance criteria: Config path and endpoint are documented.

- [x] Document Blockbench MCP endpoint
  - Purpose: Keep connection source-grounded.
  - Inputs: README and settings guidance.
  - Output file: `SourceDocument/planning/00-context-lock.md`.
  - Acceptance criteria: Default endpoint and multi-window caveat are included.

- [x] Document smoke test
  - Purpose: Verify connection before action.
  - Inputs: MCP tool listing and API docs.
  - Output file: `openspec/changes/mcp-blockbench-workflow/tasks.md`.
  - Acceptance criteria: Tool listing is required.

- [x] Document safe coding flow
  - Purpose: Prevent unapproved source edits.
  - Inputs: Context Lock and OpenSpec.
  - Output file: `SourceDocument/planning/04-uiux-flow.md`.
  - Acceptance criteria: Future-only implementation flow is included.

- [x] Document GitHub Tool boundaries
  - Purpose: Keep GitHub use scoped.
  - Inputs: Planning requirements.
  - Output file: `SourceDocument/planning/03-system-design.md`.
  - Acceptance criteria: Inspection-only boundary is stated.

- [x] Document Ponytail review boundaries
  - Purpose: Add anti-overengineering gate.
  - Inputs: Planning requirements.
  - Output file: `SourceDocument/planning/03-system-design.md`.
  - Acceptance criteria: Availability is marked `Needs verification`.

## Phase 4: Ollama Scenario

- [x] Document `mcp-client-for-ollama` setup
  - Purpose: Enable local LLM workflow.
  - Inputs: `mcp-client-for-ollama` README.
  - Output file: `SourceDocument/planning/02-srs.md`.
  - Acceptance criteria: `ollmcp` usage is documented.

- [x] Document MCP server connection
  - Purpose: Connect Ollama to Blockbench.
  - Inputs: MCP Blockbench endpoint.
  - Output file: `SourceDocument/planning/04-uiux-flow.md`.
  - Acceptance criteria: URL connection is included.

- [x] Document tool enable/disable flow
  - Purpose: Keep tool use controlled.
  - Inputs: `ollmcp` feature docs.
  - Output file: `openspec/changes/mcp-blockbench-workflow/specs/ollama-workflow/spec.md`.
  - Acceptance criteria: Tool management is required.

- [x] Document human-in-the-loop approval
  - Purpose: Prevent unsafe model-driven actions.
  - Inputs: `ollmcp` feature docs.
  - Output file: `SourceDocument/planning/04-uiux-flow.md`.
  - Acceptance criteria: Approval flow is included.

- [x] Document local model limitations
  - Purpose: Avoid overpromising.
  - Inputs: `ollmcp` docs and planning constraints.
  - Output file: `SourceDocument/planning/03-system-design.md`.
  - Acceptance criteria: Model quality and tool-calling variability is listed.

- [x] Document smoke test
  - Purpose: Verify runtime connection.
  - Inputs: Endpoint and tool list.
  - Output file: `openspec/changes/mcp-blockbench-workflow/tasks.md`.
  - Acceptance criteria: Runtime tool verification is required.

## Phase 5: Design Context Pack

- [x] Create Minecraft model brief template
  - Purpose: Capture modelling intent.
  - Inputs: Minecraft / Blockbench requirements.
  - Output file: `SourceDocument/modeling/minecraft-model-brief-template.md`.
  - Acceptance criteria: Required brief fields and acceptance criteria are included.

- [x] Create Minecraft style rules
  - Purpose: Avoid generic smooth 3D output.
  - Inputs: Minecraft modelling context.
  - Output file: `SourceDocument/modeling/minecraft-style-rules.md`.
  - Acceptance criteria: Blocky silhouette and gameplay readability rules are included.

- [x] Create Blockbench scale rules
  - Purpose: Keep assets correctly proportioned.
  - Inputs: Blockbench and Minecraft scale context.
  - Output file: `SourceDocument/modeling/blockbench-scale-rules.md`.
  - Acceptance criteria: Block, player, item/entity/block, and texture size rules are included.

- [x] Create texture/UV rules
  - Purpose: Keep textures consistent.
  - Inputs: Texture workflow requirements.
  - Output file: `SourceDocument/modeling/texture-uv-rules.md`.
  - Acceptance criteria: UV stretching, mixels, pixel density, names, and export considerations are included.

- [x] Create visual QA checklist
  - Purpose: Verify model quality visually.
  - Inputs: Modelling workflow requirements.
  - Output file: `SourceDocument/modeling/visual-qa-checklist.md`.
  - Acceptance criteria: Required views and checks are included.

- [x] Create export target rules
  - Purpose: Keep exports target-aware.
  - Inputs: Minecraft target requirements.
  - Output file: `SourceDocument/modeling/export-targets.md`.
  - Acceptance criteria: Bedrock / Education, conditional Java, model, texture, and animation outputs are included.

## Phase 6: Guardrail Review

- [x] Check for overengineering
  - Purpose: Keep scope minimal.
  - Inputs: All planning docs.
  - Output file: `openspec/changes/mcp-blockbench-workflow/specs/guardrails/spec.md`.
  - Acceptance criteria: No new framework or architecture is introduced.

- [x] Check for unnecessary dependencies
  - Purpose: Protect package scope.
  - Inputs: Git status and dependency files.
  - Output file: `SourceDocument/planning/00-context-lock.md`.
  - Acceptance criteria: Dependency changes are prohibited.

- [x] Check for hallucinated tools
  - Purpose: Keep tool use source-grounded.
  - Inputs: `docs/api.json`.
  - Output file: `SourceDocument/planning/02-srs.md`.
  - Acceptance criteria: Runtime verification is required.

- [x] Check for out-of-scope architecture
  - Purpose: Prevent unrelated systems.
  - Inputs: Context Lock.
  - Output file: `SourceDocument/planning/01-prd.md`.
  - Acceptance criteria: Non-goals are explicit.

- [x] Check source alignment
  - Purpose: Match existing repo.
  - Inputs: `AGENTS.md`, `README.md`, `package.json`.
  - Output file: `SourceDocument/planning/03-system-design.md`.
  - Acceptance criteria: Existing architecture is documented.

- [x] Mark assumptions
  - Purpose: Avoid hidden requirements.
  - Inputs: All docs.
  - Output file: All planning docs.
  - Acceptance criteria: Assumptions use the `Assumption` label.

## Phase 7: Final Planning Validation

- [x] Verify all planning docs exist
  - Purpose: Complete required output.
  - Inputs: Filesystem.
  - Output file: Final response.
  - Acceptance criteria: Required file list is present.

- [x] Verify every doc has acceptance criteria
  - Purpose: Make docs testable.
  - Inputs: Planning docs.
  - Output file: Final response.
  - Acceptance criteria: Each document includes an Acceptance Criteria section.

- [x] Verify all future tasks are actionable
  - Purpose: Enable next implementation phase.
  - Inputs: Task breakdown and OpenSpec tasks.
  - Output file: `openspec/changes/mcp-blockbench-workflow/tasks.md`.
  - Acceptance criteria: Tasks include purpose, inputs, output, and acceptance criteria.

- [x] Verify no code was changed
  - Purpose: Respect planning-only requirement.
  - Inputs: Git status.
  - Output file: Final response.
  - Acceptance criteria: Only docs and OpenSpec files are changed.

- [x] Verify no dependency was added
  - Purpose: Preserve source scope.
  - Inputs: Git status and dependency files.
  - Output file: Final response.
  - Acceptance criteria: Dependency files are unchanged.

- [x] Provide summary and next recommended execution prompt
  - Purpose: Hand off future work cleanly.
  - Inputs: Completed planning docs.
  - Output file: Final response.
  - Acceptance criteria: Summary includes files, decisions, assumptions, out-of-scope items, risks, and next prompt.
