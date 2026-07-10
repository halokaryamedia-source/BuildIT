# Delta for Guardrails

## ADDED Requirements

### Requirement: Scope Control
Future work SHALL stay inside the allowed scope.

#### Scenario: Future task proposes out-of-scope work
- GIVEN a requested change mentions unrelated frameworks or workflows
- WHEN the agent evaluates scope
- THEN Context Lock is read
- AND out-of-scope frameworks and workflows are rejected
- AND new architecture requires a new approved spec

### Requirement: Dependency Control
Future work SHALL NOT add dependencies without explicit approval.

#### Scenario: A future task needs a package
- GIVEN a task appears to require a dependency
- WHEN the dependency would change package files
- THEN dependency file changes are reviewed
- AND new dependency rationale is documented
- AND anti-overengineering review approves the dependency

### Requirement: Tool Truth
Future work SHALL NOT assume unavailable MCP tools.

#### Scenario: Agent needs a Blockbench MCP capability
- GIVEN the capability may or may not exist
- WHEN the agent prepares tool usage
- THEN static API docs are checked
- AND runtime tool list is checked
- AND missing tools are marked `Needs verification`

### Requirement: Blockbench MCP Preflight
Blockbench MCP edits SHALL be blocked until required context, tools, skills, and session ownership are confirmed.

#### Scenario: Agent prepares a Blockbench MCP edit
- GIVEN a modelling phase requires Blockbench changes
- WHEN the agent prepares to edit
- THEN OpenSpec context is read
- AND Ponytail or a manual Ponytail-equivalent review is applied
- AND `blockbench-use` and the phase-relevant Blockbench skill are loaded
- AND the MCP endpoint and active project are verified
- AND manual user edits are listed or marked as none
- AND exactly one intended working session is identified

### Requirement: Required Tool Activation
Every modelling phase SHALL activate the required planning, review, skill, and MCP tools before work starts.

#### Scenario: Agent receives a Codex-ready model request
- GIVEN the user uploads a model brief and reference package from ChatGPT
- WHEN the agent prepares the first Codex response
- THEN OpenSpec context is read before any Blockbench action
- AND Ponytail or a manual Ponytail-equivalent review is applied
- AND `blockbench-use` is loaded before any Blockbench MCP edit
- AND the phase-relevant Blockbench skill is loaded
- AND the runtime MCP tool list is verified for the current phase
- AND missing skills, tools, endpoint, or session ownership block execution

#### Scenario: Agent enters a geometry phase
- GIVEN the current phase is Main Geometry or Geometry Detailing
- WHEN the agent prepares to edit Blockbench
- THEN `blockbench-modeling` is loaded
- AND geometry-related MCP tools are verified
- AND UV, texture, animation, and export tools are not used unless explicitly in scope

#### Scenario: Agent enters a texture phase
- GIVEN the current phase is UV Texture, Base Texturing, Detail Texturing, or texture Polish
- WHEN the agent prepares to edit Blockbench
- THEN `blockbench-texturing` is loaded
- AND texture/UV-related MCP tools are verified
- AND broad geometry redesign is marked `Out of scope for this phase`

### Requirement: Per-Asset Session Lock
No Blockbench edits SHALL run without a valid `session.md` and `session-lock.md` for the active asset.

#### Scenario: Multi-chat or machine handoff
- GIVEN the asset session resumes from a new chat or different PC
- WHEN the request reaches a new phase
- THEN Codex loads `SavedData/sessions/[asset]/session.md` and `session-lock.md`
- AND validates `asset`, `phase`, `session_id`, and `lock status`
- AND blocks work if required fields are missing or stale.

### Requirement: No Phase Drift
Future modelling work SHALL stay inside the approved phase.

#### Scenario: Agent is in a modelling phase
- GIVEN the current phase has an approved goal
- WHEN the agent performs work
- THEN only the phase-scoped edits are allowed
- AND out-of-phase requests are marked `Out of scope for this phase`
- AND the agent waits for user approval before moving to the next phase

### Requirement: Geometry Failure Stop
Repeated geometry failure SHALL trigger root-cause recovery instead of more edits.

#### Scenario: Geometry blocker repeats
- GIVEN Main Geometry or Geometry Detailing has a blocker
- WHEN the same blocker remains after two focused cycles
- THEN the agent stops the edit loop
- AND checks scale envelope, reference priority, parent chain, pivot logic, attachment continuity, floating parts, collision, and z-fighting
- AND does not continue with UV, texture, polish, or broad redesign until the blocker is resolved or the user resets scope

### Requirement: Geometry Decision Path
Geometry edits SHALL declare the smallest valid fix path before changing Blockbench state.

#### Scenario: Agent prepares a geometry edit
- GIVEN the current phase is Main Geometry or Geometry Detailing
- WHEN the agent prepares an MCP edit batch
- THEN the agent classifies the issue as scale envelope, front/side silhouette, parent/pivot/attachment, collision/z-fighting, cube noise reduction, or defer to texture
- AND only the selected path may be edited in that batch
- AND if the selected path is defer to texture, no geometry edit is executed

### Requirement: Phase Tracking
Every phase SHALL declare its input, allowed work, forbidden work, required output, and exit gate.

#### Scenario: Agent starts a modelling phase
- GIVEN a current phase is selected
- WHEN the agent begins phase work
- THEN required input is confirmed
- AND allowed work is stated
- AND forbidden work is stated
- AND required output is stated
- AND the exit gate is stated

#### Scenario: Agent completes a modelling phase
- GIVEN phase work is complete
- WHEN the agent reports the result
- THEN required screenshots or artifacts are provided
- AND skipped work is listed
- AND remaining issues or assumptions are listed
- AND the next phase remains blocked until user approval

### Requirement: Ponytail Token Efficiency
MCP Blockbench work SHALL avoid unnecessary tool calls, inspections, screenshots, and broad edits.

#### Scenario: Agent prepares an MCP work batch
- GIVEN a current approved phase
- WHEN the agent prepares MCP work
- THEN the affected part is identified
- AND the smallest safe edit is selected
- AND only phase-required tools are used
- AND broad model or texture inspection is avoided when a focused check or screenshot is enough
- AND screenshots are taken at phase gates or meaningful correction batches
- AND the agent stops when phase acceptance criteria are met

### Requirement: Review Before Done
Every future implementation task SHALL pass anti-overengineering review before done.

#### Scenario: Agent finishes an implementation task
- GIVEN implementation work is complete
- WHEN the agent prepares the final summary
- THEN Ponytail is used when available
- AND manual review is used when Ponytail is unavailable
- AND review checks scope, source alignment, dependency changes, architecture changes, and hallucinated tools

### Requirement: Assumption and Out-of-Scope Labels
Unverified or excluded work SHALL be labelled.

#### Scenario: Agent encounters uncertain or excluded work
- GIVEN a fact is unverified or a request is excluded
- WHEN the agent documents the work
- THEN `Needs verification` labels unknown facts
- AND `Assumption` labels chosen defaults
- AND `Out of scope` labels excluded work

