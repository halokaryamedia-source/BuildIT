# Delta for Codex Workflow

## ADDED Requirements

### Requirement: Marketplace Reference Intelligence
Codex SHALL run a reference-to-action mapping pass before Main Geometry, using accepted sample patterns.

#### Scenario: Codex receives a new reference package
- GIVEN a new model request with references
- WHEN Codex starts Geometry planning
- THEN Codex identifies asset class, silhouette intent, geometry budget, atlas target, and attachment plan
- AND Codex derives one phase-safe execution plan from that intelligence layer
- AND Codex does not proceed if required references for silhouette, proportions, materials, and animation scope are missing

#### Scenario: Codex starts with the Marketplace Reference Intelligence Intake
- GIVEN a completed `marketplace-reference-intelligence-template.md`
- WHEN Codex begins Main Geometry
- THEN Codex uses only the declared geometry budget, atlas baseline, and attachment plan
- AND Codex flags and blocks micro-cube decorative requests as geometry-first errors

### Requirement: ChatGPT Reference Pack Sync
ChatGPT-facing reference generator documents SHALL stay synchronized with Codex modelling logic.

#### Scenario: Geometry workflow logic changes
- GIVEN Codex geometry, phase, reference, or quality rules are changed
- WHEN ChatGPT will be used to generate new reference images or prompts
- THEN the ChatGPT-ready prompt and upload ZIP rebuild instructions are updated
- AND the ChatGPT upload ZIP is rebuilt before the next reference generation run
- AND the ChatGPT prompt includes the current Geometry Blueprint and decision-path rules
- AND the ChatGPT prompt requires valid `reference_manifest.json`, a Geometry Blueprint table, Negative Geometry Constraints, View Consistency status, and a Codex first action
- AND the ChatGPT prompt requires reading all uploaded package documents before using a compact working-memory card to prevent context drift

### Requirement: Phase Risk Preflight
Codex SHALL run a phase-risk simulation before Main Geometry for every new model asset.

#### Scenario: Codex starts a new model session
- GIVEN a new per-asset `session.md` and reference package are present
- WHEN Main Geometry is requested
- THEN Codex runs `SourceDocument/modeling/ops/phase-risk-simulation.md`
- AND records expected P0 blockers (and blockers owner / location) before any geometry edit
- AND edits are blocked until assigned blockers are explicitly acknowledged.

### Requirement: Session Manifest Load
Codex SHALL load the per-asset session manifest before writing or approving any MCP action.

#### Scenario: Codex receives a new asset request
- GIVEN a `SavedData/sessions/[asset]/` folder is created
- WHEN the request is approved to continue to execution
- THEN Codex reads `session.md` and `session-lock.md`
- AND validates current phase, target scale, reference status, and approved tool profile
- AND blocks action if manifest is missing or stale.

#### Scenario: Codex resumes from a new chat or another PC
- GIVEN the user starts a model session in a new chat
- WHEN Codex is asked to continue
- THEN the active session manifest in `SavedData/sessions/[asset]/` is treated as source-of-truth
- AND execution order resumes only from the declared approved phase.

### Requirement: Context + Active Change Readiness
Codex SHALL read Context Lock and the active OpenSpec change before future source edits.

#### Scenario: Codex starts a future implementation task
- GIVEN a task in this repository
- WHEN Codex prepares to modify source
- THEN Codex reads `SourceDocument/planning/00-context-lock.md`
- AND Codex reads `openspec/project.md`
- AND Codex reads the active change proposal, design, tasks, and specs

### Requirement: Existing MCP Blockbench Connection
Codex SHALL connect to the existing MCP Blockbench server instead of creating a new server.

#### Scenario: Codex configures MCP Blockbench
- GIVEN Blockbench MCP is expected at `http://localhost:3000/bb-mcp`
- WHEN Codex configures the MCP server
- THEN Codex uses the existing endpoint
- AND treats multiple-window port changes as `Needs verification`
- AND prefers direct HTTP with `mcp-remote` fallback only when needed

### Requirement: Tool Verification
Codex SHALL verify available MCP tools before use.

#### Scenario: Codex prepares to call a Blockbench MCP tool
- GIVEN generated API docs and a runtime MCP server
- WHEN Codex needs to use a tool
- THEN Codex checks static API docs as reference
- AND checks the runtime tool list before invocation
- AND does not invent missing tools

### Requirement: Safe Future Implementation
Codex SHALL implement only approved OpenSpec tasks.

#### Scenario: Codex changes source in a future task
- GIVEN an approved OpenSpec task
- WHEN Codex edits source
- THEN Codex selects one task before editing
- AND makes the minimal source change
- AND reports tests or manual verification
- AND completes anti-overengineering review

