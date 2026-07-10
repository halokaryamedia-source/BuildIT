# Context Lock

This document is the first source to read before planning, modelling, or implementing future work in this repository.

## Allowed Scope

- MCP Blockbench existing source in this repository.
- Blockbench MCP Skills from the referenced sample project.
- Codex workflow using the existing MCP Blockbench server.
- Ollama workflow through `mcp-client-for-ollama` / `ollmcp`.
- OpenSpec planning and specification guardrails.
- GitHub tooling for repository, issue, pull request, and source inspection.
- Ponytail anti-overengineering review when available.
- Minecraft and Blockbench design context for modelling tasks.

## Not Allowed

- Creating a new unrelated MCP framework.
- Replacing the existing plugin architecture without source-backed need.
- Adding agent frameworks such as CrewAI, AutoGen, LangChain, or similar.
- Moving the workflow to Blender or generic 3D pipelines.
- Adding features not connected to MCP Blockbench.
- Adding dependencies before specification and review.
- Coding before PRD, SRS, system design, UI/UX flow, and tasks are approved.

## Source Lock

Primary sources:

- `https://github.com/achmadawdi/mcp-blockbench`
- `https://www.skills.sh/jasonjgardner/blockbench-mcp-project`
- `https://github.com/jonigl/mcp-client-for-ollama`
- OpenSpec files in `openspec/`
- Local repository files

Supporting sources, only when validation is needed:

- Official Blockbench documentation.
- Official Minecraft Creator / Bedrock documentation.
- Official MCP documentation.
- Official Codex documentation.

## Verified Repository Facts

- Package name: `blockbench-mcp`.
- Package version: `1.6.0`.
- Runtime shape: Blockbench plugin with a TypeScript/Bun source tree.
- Entry point: `index.ts`.
- MCP server glue: `server/`.
- Tools: `server/tools/`.
- Resources and prompts: `server/resources.ts` and `server/prompts.ts`.
- UI and settings: `ui/`.
- Default endpoint: `http://localhost:3000/bb-mcp`.
- Multiple Blockbench windows may use later ports such as `3001` or `3002`.
- Generated API docs currently report 109 tools, 7 prompts, and 12 resources.
- Existing automated tests are not set up; manual verification is expected for changes.

## Context Loss Prevention

- Always read this Context Lock before planning or implementation.
- Always read the relevant OpenSpec change before modifying source.
- Always load the Minecraft Model Brief before modelling.
- Always verify available MCP tools before using them.
- Always prefer existing repository patterns and files before proposing new structure.
- Always mark unverifiable requirements as `Needs verification`, `Assumption`, or `Out of scope`.
- Always stop before risky actions unless the user has approved them.
- Always run an anti-overengineering review before marking future implementation tasks done.

## Acceptance Criteria

- The allowed and disallowed scope is explicit.
- Source limits are documented.
- Existing MCP Blockbench architecture is preserved.
- Context loss prevention rules are clear enough for another agent to follow.
- Unverified claims have a required label path.
