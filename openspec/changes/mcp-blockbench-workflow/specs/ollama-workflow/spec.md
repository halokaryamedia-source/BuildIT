# Delta for Ollama Workflow

## ADDED Requirements

### Requirement: mcp-client-for-ollama Usage
The Ollama workflow SHALL use `mcp-client-for-ollama` / `ollmcp` for MCP access.

#### Scenario: User configures local Ollama MCP access
- GIVEN the user wants local Ollama access to Blockbench MCP
- WHEN the workflow is configured
- THEN `ollmcp` is used as the MCP client
- AND Streamable HTTP URL connection is documented
- AND no alternate agent framework is introduced

### Requirement: Local Model Boundary
The Ollama model SHALL operate behind tool management and approval controls.

#### Scenario: Local model requests a state-changing tool
- GIVEN the model requests a Blockbench MCP tool call
- WHEN the action may change Blockbench state
- THEN tool enable/disable controls are available
- AND human-in-the-loop approval is required
- AND local model limitations are documented as risks

### Requirement: Runtime Verification
The Ollama workflow SHALL verify server and tools before modelling.

#### Scenario: Ollama starts a modelling workflow
- GIVEN Blockbench is expected to expose MCP tools
- WHEN the workflow starts
- THEN Blockbench is running with the MCP plugin enabled
- AND the endpoint is confirmed
- AND tools are listed before use

### Requirement: Modelling Safety
The Ollama workflow SHALL NOT modify Blockbench state without approval for risky actions.

#### Scenario: User rejects a risky action
- GIVEN a risky Blockbench action is proposed
- WHEN the user rejects the action
- THEN the action does not run
- AND the agent stops or proposes a safer approved alternative
