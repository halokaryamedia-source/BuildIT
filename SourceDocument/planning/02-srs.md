# SRS: MCP Blockbench Workflow Foundation

## Functional Requirements

### FR-001: Codex MCP Connection
The system shall allow Codex to connect to the existing MCP Blockbench server.

Acceptance Criteria:
- Codex MCP config is documented.
- Blockbench MCP endpoint is documented as `http://localhost:3000/bb-mcp` by default.
- Tool availability can be verified before use.

### FR-002: Ollama MCP Connection
The system shall allow local Ollama workflows through `mcp-client-for-ollama` / `ollmcp`.

Acceptance Criteria:
- `ollmcp` URL connection is documented.
- Human-in-the-loop approval is documented.
- Tool enable/disable flow is documented.

### FR-003: MCP Tool Verification
The system shall require agents to verify available MCP tools before invoking them.

Acceptance Criteria:
- Generated API docs are identified as the source for known tools.
- Runtime MCP client tool listing is required before tool execution.
- Unavailable tools are marked as `Needs verification` or not used.

### FR-004: Blockbench Project Creation and Opening
The system shall document how future workflows create or open Blockbench projects through verified MCP tools.

Acceptance Criteria:
- Project tools are verified before use.
- Risky project actions require human approval.
- Existing project state is inspected before modification.

### FR-005: Minecraft Model Brief Loading
The system shall require a Minecraft model brief before modelling work.

Acceptance Criteria:
- Brief template exists in `SourceDocument/modeling/`.
- Brief includes asset type, scale, texture size, target platform, geometry rules, and acceptance criteria.
- Missing brief fields are treated as assumptions.

### FR-006: Geometry and Blockout Workflow
The system shall document a blocky, Minecraft-aware geometry workflow.

Acceptance Criteria:
- The workflow favors readable silhouettes and cube/block proportions.
- Element budget is considered.
- Generic smooth 3D assumptions are avoided.

### FR-007: Texture and UV Workflow
The system shall document texture and UV rules for Minecraft / Blockbench assets.

Acceptance Criteria:
- UV stretching checks are included.
- Pixel density consistency is included.
- Texture size and naming conventions are included.

### FR-008: Screenshot and Visual QA Workflow
The system shall document screenshot-based visual QA.

Acceptance Criteria:
- Front, side, back, top, and perspective views are included.
- Minecraft style consistency is checked.
- Pivot, bone, texture, and export checks are included.

### FR-009: Export Workflow
The system shall document export target rules.

Acceptance Criteria:
- Bedrock / Education target is covered.
- Java target is conditional and marked when relevant.
- Model, texture, and animation outputs are documented.

### FR-010: OpenSpec Workflow
The system shall require OpenSpec review before future source changes.

Acceptance Criteria:
- Project guardrails exist in `openspec/project.md`.
- Change proposal, design, tasks, and specs exist.
- Future implementation tasks refer to the approved change.

### FR-011: GitHub Tool Workflow
The system shall define GitHub tooling as an inspection and efficiency boundary.

Acceptance Criteria:
- GitHub Tool use is limited to source, issue, PR, and history inspection.
- GitHub writes are not required for this planning foundation.
- Missing GitHub Tool access does not block local planning.

### FR-012: Ponytail Review Workflow
The system shall define Ponytail as an anti-overengineering review step when available.

Acceptance Criteria:
- Ponytail is not assumed to modify code.
- If unavailable, a manual anti-overengineering review is required.
- Review must check scope, dependencies, architecture, and source alignment.

### FR-013: Human Approval for Risky Actions
The system shall require human approval for risky actions.

Acceptance Criteria:
- Destructive or state-changing modelling actions are explained before execution.
- Export overwrites require confirmation.
- Risky source changes require approved OpenSpec tasks.

### FR-014: Assumption Tracking
The system shall record assumptions explicitly.

Acceptance Criteria:
- Assumptions use the `Assumption` label.
- Assumptions are revisited before implementation.
- Assumptions do not silently become requirements.

### FR-015: Out-of-Scope Tracking
The system shall record out-of-scope work explicitly.

Acceptance Criteria:
- Out-of-scope items use the `Out of scope` label.
- Future requests that need out-of-scope work require a new spec.
- New dependencies and new architecture remain out of scope until approved.

## Non-Functional Requirements

- Minimal architecture: use the existing plugin and docs structure first.
- No unnecessary dependency: documentation changes must not edit dependency files.
- Source-based planning: cite local repo facts and verified primary sources.
- Stable tool preference: prefer verified tools and generated API docs.
- Minecraft design consistency: every modelling workflow uses the design context pack.
- Clear documentation: every planning document includes acceptance criteria.
- Repeatable smoke test: document Codex, Ollama, and Blockbench connection checks.
- Local Ollama compatibility: prefer Streamable HTTP URL connection through `ollmcp`.
- Codex compatibility: document direct HTTP and `mcp-remote` fallback.

## Acceptance Criteria

- All functional requirements include acceptance criteria.
- Non-functional requirements cover architecture, dependencies, source grounding, smoke tests, and compatibility.
- Requirements avoid inventing unavailable tools.
- Requirements keep future implementation inside existing source scope.
