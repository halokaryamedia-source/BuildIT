# UI/UX Flow: User and Agent Workflows

This document describes user and agent workflow, not only visual UI.

## Flow 1: Initial Setup

1. User opens the desktop version of Blockbench.
2. User loads or enables the MCP Blockbench plugin.
3. User confirms MCP settings: default port `3000`, endpoint `bb-mcp`.
4. Codex or Ollama connects to `http://localhost:3000/bb-mcp`.
5. Agent verifies available tools before any action.
6. Agent confirms task scope against Context Lock and OpenSpec.

Acceptance Criteria:
- Blockbench is running with the plugin loaded.
- Endpoint is known or copied from the Blockbench MCP panel.
- Agent lists or verifies tools before use.
- Scope is confirmed before state-changing actions.

## Flow 2: Codex Planning Flow

1. Read `SourceDocument/planning/00-context-lock.md`.
2. Read repository structure and relevant source files.
3. Read `openspec/project.md` and active change files.
4. Generate or update planning docs.
5. Stop before coding.

Acceptance Criteria:
- Planning references verified repo facts.
- No source implementation files are changed.
- No dependencies are added.
- Assumptions and out-of-scope items are labelled.

## Flow 3: Codex Implementation Flow - Future Only

1. Read approved OpenSpec change.
2. Pick one task from `tasks.md`.
3. Inspect relevant source.
4. Implement the minimal change.
5. Run available tests or manual verification.
6. Run Ponytail anti-overengineering review if available, otherwise perform manual review.
7. Summarize diff, tests, assumptions, and remaining risk.

Acceptance Criteria:
- Implementation maps to one approved task.
- No unrelated refactor is included.
- Review checks scope, dependency changes, architecture changes, and source alignment.
- Summary identifies tests run and tests not run.

## Flow 4: Ollama Modelling Flow

1. User gives a model brief.
2. Agent loads the design context pack.
3. Agent verifies Blockbench MCP tools.
4. Agent creates a blockout using Minecraft-aware proportions.
5. Agent captures screenshots from required views.
6. Agent performs visual QA.
7. Agent refines geometry with approval for risky actions.
8. Agent applies texture and UV rules.
9. Agent exports the model for the selected target.

Acceptance Criteria:
- Minecraft model brief exists before modelling.
- Geometry uses readable blocky proportions.
- Screenshot QA includes front, side, back, top, and perspective checks.
- Texture, UV, pivot, bone, and export checks are completed.

## Flow 5: Review and Approval Flow

1. Risky action is detected.
2. Agent explains the action, risk, and expected result.
3. User approves or rejects.
4. Agent continues only after approval.
5. Agent records outcome.

Acceptance Criteria:
- Risky actions do not proceed silently.
- Approval is explicit.
- Rejected actions stop without workaround.
- Outcome is summarized.

## Acceptance Criteria

- All five required flows are documented.
- Codex planning stops before coding.
- Future implementation includes anti-overengineering review.
- Ollama modelling includes Minecraft / Blockbench context.
- Approval flow is clear and repeatable.
