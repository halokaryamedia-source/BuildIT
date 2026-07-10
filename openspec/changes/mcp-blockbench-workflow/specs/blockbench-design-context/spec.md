# Delta for Blockbench Design Context

## ADDED Requirements

### Requirement: Minecraft Model Brief
Every modelling workflow SHALL start with a Minecraft model brief.

#### Scenario: User requests a model
- GIVEN a user asks for modelling work
- WHEN the agent prepares the workflow
- THEN asset name, Bedrock Entity target, function, theme, scale, texture size, geometry rules, required parts, and acceptance criteria are documented
- AND missing fields are labelled `Assumption` or `Needs verification`

### Requirement: Bedrock Entity Only
The active modelling workflow SHALL target Bedrock Entity unless the user explicitly opens a different workflow.

#### Scenario: User requests a static prop or placed object
- GIVEN the user asks for a static prop, decoration, furniture-like object, or placed object
- WHEN the agent prepares modelling context
- THEN the target is treated as a static Bedrock Entity display prop
- AND Bedrock Block output is marked `Out of scope` unless the user explicitly overrides the active workflow

### Requirement: Mandatory Phase Gates
Every Blockbench MCP modelling workflow SHALL follow the approved production phases.

#### Scenario: Agent prepares to edit Blockbench
- GIVEN a user asks for Minecraft Bedrock modelling through MCP
- WHEN the agent prepares the work
- THEN `SourceDocument/modeling/mandatory-blockbench-mcp-procedure.md` is read
- AND the current phase is identified as Reference Collection, Main Geometry, Geometry Detailing, UV Texture, Base Texturing, Detail Texturing, Polish, or Final Review
- AND the phase goal and expected output are stated before editing
- AND the agent does not continue to the next phase without user approval

### Requirement: Phase Definitions
The production phases SHALL have stable meanings and SHALL NOT be reinterpreted per model.

#### Scenario: Agent maps a request to a phase
- GIVEN a user asks for modelling work
- WHEN the agent maps the request to a production phase
- THEN Reference Collection means reference review only, no Blockbench editing
- AND Main Geometry means large readable form only, no UV or texture detail
- AND Geometry Detailing means structural physical detail only
- AND UV Texture means atlas and UV preparation only
- AND Base Texturing means broad material placement only
- AND Detail Texturing means shading, gradients, trims, and material depth
- AND Polish means local screenshot-driven fixes only
- AND Final Review means scoring and decision, not new edits

### Requirement: Detailed Phase Contract
Every production phase SHALL follow the detailed phase contract.

#### Scenario: Agent begins any modelling phase
- GIVEN a current production phase is selected
- WHEN the agent prepares phase work
- THEN `SourceDocument/modeling/phase-detail-contract.md` is used
- AND the phase required input is checked
- AND the phase allowed work is checked
- AND the phase forbidden work is checked
- AND the phase verification output is checked
- AND the phase exit gate and failure conditions are checked

#### Scenario: Agent receives a request that mixes phases
- GIVEN the user request includes work from multiple phases
- WHEN the agent prepares the work
- THEN the earliest required phase is selected first
- AND later-phase work is marked `Out of scope for this phase`
- AND the agent asks for approval before moving to the next phase

### Requirement: Reference Before Geometry
Geometry work SHALL NOT start until reference intake and geometry planning are complete.

#### Scenario: User provides references for a new model
- GIVEN reference images or sheets are available
- WHEN the agent is asked to generate a new model
- THEN the agent summarizes silhouette, scale, focal areas, cube-vs-texture decisions, risks, and assumptions
- AND Blockbench editing is blocked until that summary is accepted or missing items are marked as accepted assumptions

### Requirement: Geometry Reliability
Geometry work SHALL prove scale, silhouette, and structure before detail work continues.

#### Scenario: Agent starts Main Geometry
- GIVEN an approved Reference Collection summary
- WHEN the agent prepares Main Geometry
- THEN the agent records a scale envelope with height, width, depth, front direction, and ground/contact point
- AND the agent records a Geometry Blueprint with part build order, major part bounding boxes, and attachment points
- AND the agent builds only large readable forms before small detail
- AND the agent compares front and side screenshots against the approved blueprint
- AND front and side silhouettes must pass before Geometry Detailing is allowed

#### Scenario: Geometry fails repeatedly
- GIVEN the same geometry blocker appears in two consecutive edit cycles
- WHEN the agent prepares another edit
- THEN the agent stops broad editing
- AND audits scale envelope, parent chain, pivot logic, and attachment continuity
- AND resumes only from a valid checkpoint or user-approved reset

### Requirement: Minecraft Style
Models SHALL prioritize Minecraft-readable silhouettes and blocky proportions.

#### Scenario: Agent plans model geometry
- GIVEN a Minecraft / Blockbench model brief
- WHEN the agent plans geometry
- THEN smooth generic 3D forms are avoided unless explicitly approved
- AND micro-detail is handled with texture where practical
- AND gameplay distance readability is checked

### Requirement: Marketplace-Grade Baseline
Every active Bedrock Entity workflow SHALL target generalized marketplace-grade quality.

#### Scenario: Agent prepares references or modelling work
- GIVEN a new Bedrock Entity asset request
- WHEN the agent prepares the reference package or modelling plan
- THEN marketplace-grade quality is treated as the default target
- AND the plan includes readable silhouette, clean hierarchy, scale envelope, texture-only micro detail, material depth, do/don't risk checks, atlas size, cube budget, and bone budget
- AND marketplace samples are used only for quality patterns, not copied mesh, texture, UV layout, or asset identity

### Requirement: Scale and UV
Models SHALL follow scale, texture, and UV rules.

#### Scenario: Agent prepares texture and scale decisions
- GIVEN an asset target platform and style
- WHEN the agent selects scale and texture details
- THEN scale is compared to Minecraft block or player references
- AND texture size is selected
- AND UV stretching and pixel density are checked

### Requirement: Visual QA and Export
Models SHALL pass visual QA before export.

#### Scenario: Agent prepares to export a model
- GIVEN a model is ready for review
- WHEN export is considered
- THEN front, side, back, top, and perspective views are checked
- AND pivot, bone, texture, and export correctness are checked
- AND Bedrock / Education target is primary unless the brief specifies otherwise
