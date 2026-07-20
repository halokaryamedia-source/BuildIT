# BuildIT Context Map

BuildIT contains five related but distinct bounded contexts. Each context owns its own vocabulary and decisions. Do not collapse them into one global workflow hierarchy.

| Context | Purpose | Glossary |
| --- | --- | --- |
| Reference Design | Turns a source subject into an approved Minecraft/Blockbench production contract. | `engines/chatgpt/CONTEXT.md` |
| Asset Production | Builds, reviews, validates, and finalizes one Blockbench asset. | `mcp-blockbench/CONTEXT.md` |
| Agent Orchestration | Selects safe capabilities, models, tools, and writers for Codex execution. | `engines/codex/CONTEXT.md` |
| Workflow Governance | Defines runtime state, profiles, workspace lifecycle, evidence, and cross-context invariants. | `engines/shared/CONTEXT.md` |
| Repository Development | Changes BuildIT source and proves those changes through engineering seams. | `docs/architecture/SYSTEM_FOUNDATION.md` |

## Context relationships

```text
Reference Design
    produces Reference Package
        ↓
Asset Production
    consumes Reference Package
    persists Runtime State and Evidence through Workflow Governance
        ↓
Agent Orchestration
    chooses an eligible execution route without changing production truth
        ↓
Repository Development
    changes the modules that implement the other contexts
```

## Cross-context rules

- A term has one canonical meaning inside its owning context.
- A context may consume another context's output, but it does not redefine that output.
- Current source, runtime state, and deterministic evidence may reveal that a document is stale; they do not silently rewrite product intent.
- OpenSpec records a change contract. Ponytail limits the active execution slice. Engineering Discipline governs implementation quality. Code Review Graph provides navigation and impact intelligence. Model routing selects an eligible model. These are different responsibilities, not a single rank order.
- The user-facing product path remains `ChatGPT Reference Studio → Codex + MCP Blockbench → final Blockbench package`.
