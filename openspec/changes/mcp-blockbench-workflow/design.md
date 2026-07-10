# Design: MCP Blockbench Workflow Foundation

## Codex Workflow Design

Codex uses the existing MCP Blockbench endpoint. It first reads Context Lock and OpenSpec, then verifies source and available MCP tools. Direct Streamable HTTP is the preferred documented config, with `mcp-remote` as fallback if direct HTTP cannot list tools.

```txt
User -> Codex -> Context Lock + OpenSpec -> Repository Source -> MCP Blockbench Server -> Blockbench Desktop
```

## Ollama Workflow Design

Ollama uses `mcp-client-for-ollama` / `ollmcp` to connect to the MCP URL. The local model remains behind human-in-the-loop approval for state-changing tools.

```txt
User -> ollmcp -> Local Ollama Model -> Human Approval -> MCP Blockbench Server -> Blockbench Desktop
```

## Design Context Pack

The design context pack is a documentation layer that is loaded before modelling. It keeps work Minecraft-aware by defining brief, style, scale, UV, QA, and export expectations.

```txt
Model Request -> Brief -> Scale -> Geometry -> Texture / UV -> Visual QA -> Export
```

## Modelling Execution Contract

Every Blockbench MCP modelling session must follow `SourceDocument/modeling/mandatory-blockbench-mcp-procedure.md` before editing Blockbench. OpenSpec defines the approved phase and acceptance gate; Ponytail limits the work to the smallest useful phase output; Blockbench MCP executes only after the phase, endpoint, active project, required skill, and manual-edit preservation rules are confirmed.

For phase-level execution detail, `SourceDocument/modeling/phase-detail-contract.md` defines the required input, allowed work, forbidden work, verification, exit gate, and failure conditions for each phase.

For quality execution detail, `SourceDocument/modeling/quality-implementation-rules.md` defines geometry freedom, cube purpose, texture translation, gradient standards, UV audits, user-friendly review, MCP tool efficiency, and common failure prevention.

The current modelling workflow prioritizes geometry and texturing. Animation remains modular-ready but out of scope until the user explicitly opens an animation phase. Project naming, root group naming, complexity level, and atlas size are inferred from the user request and reference package unless the user specifies them directly.

```txt
Request
  -> OpenSpec scope + active phase
  -> Ponytail scope reduction
  -> Blockbench skill load
  -> MCP endpoint + active project verification
  -> Approved phase work only
  -> Screenshot / artifact review
  -> User approval before next phase
```

The phase order is fixed unless the user explicitly reopens or skips a phase:

```txt
Reference Collection
-> Main Geometry
-> Geometry Detailing
-> UV Texture
-> Base Texturing
-> Detail Texturing
-> Polish
-> Final Review
```

## Guardrail System

- Context Lock controls allowed scope.
- OpenSpec controls future implementation.
- Generated API docs and runtime tool listing control tool availability.
- Human approval controls risky actions.
- Ponytail or manual review controls overengineering.
- The mandatory modelling procedure controls MCP readiness, phase gates, session ownership, and user review.

## Tool Boundary

- GitHub Tool: inspect source, issues, PRs, and history when available.
- Ponytail: review simplicity and scope when available.
- MCP Blockbench tools: use only after verification.
- Ollama tools: enable/disable and human approval are required for risky actions.

## Acceptance Criteria

- Codex and Ollama workflow designs are included.
- Design Context Pack is represented as a required modelling layer.
- Guardrails are explicit.
- Tool boundaries do not introduce new architecture.
