# Repository Guidelines

## Mandatory Development Guardrails

- Read `openspec/config.yaml` and the active OpenSpec change before source or workflow development.
- Read `Engine/codex/GOVERNANCE.md` before local Codex production or after context loss.
- OpenSpec is the durable agreement: goal, scope, non-goals, stages, decisions, blockers, deferred items, and acceptance criteria.
- Ponytail is the execution filter: perform the smallest safe work required now, reuse accepted work, limit tools/evidence, and stop when the active requirement is met.
- Do not duplicate full OpenSpec or workflow analysis before every small edit.
- For local Blockbench production, start with `Engine/codex/BOOTSTRAP.md`.
- Use `SavedData/sessions/<asset>/state.json` as runtime authority.
- Use Blockbench skills before MCP work: load `blockbench-use` first, then only the active-stage modelling or texturing skill.
- Run full preflight once before the first write. Re-run only stale or failed checks.
- Follow `SourceDocument/modeling/mandatory-blockbench-mcp-procedure.md` as the hard baseline.
- User-visible stages are Geometry, Texture, optional Animation, and Final Validation.
- Internal passes do not require separate routine approval.
- Stop after each user-visible stage preview and wait for user approval or targeted revision feedback.
- Initial construction may use bounded multi-part batches. One-issue-per-cycle applies to revision work.
- Preserve accepted work and manual user edits unless an earlier stage is explicitly reopened.
- Reject work unrelated to the active stage as `DEFERRED_NOT_REQUIRED` when appropriate.
- For Bedrock Entity and Bedrock Block, use Per-face UV by default unless the approved package explicitly requires otherwise.
- Do not add another Blockbench MCP server entry when the existing `blockbench` endpoint already points to `http://localhost:3000/bb-mcp`.
- Do not require legacy numbered reference sheets for new sessions. Use the approved package format documented in `Engine/codex/BOOTSTRAP.md`.
- Keep active workflow development isolated on branch `Rework` until explicit user approval for final integration.
- Continuous integration, PR preview deployment, and release preparation are deferred until the workflow implementation is stable and the user opens final verification.

## Project Structure & Module Organization

- `Engine/codex/`: governance, bootstrap, state template, and stage profiles.
- `SavedData/sessions/<asset>/`: runtime state, references, checkpoints, evidence, reports, and final output.
- `SourceDocument/`: human-facing planning, modelling, engine, and project guidance.
- `src/index.ts`: Blockbench plugin entry.
- `src/server/`: MCP server glue, tools, resources, and prompts.
- `src/ui/`: panel UI and settings.
- `src/lib/`: shared utilities, factories, constants, and schemas.
- `prompts/` and `src/macros/`: prompt templates and build-time helpers.
- `dist/`: build output.
- `docs/`: generated API documentation.
- `build/`: build and docs scripts.

Do not move paths required by build/runtime tooling:

- `.agents/`, `.codex/`, `openspec/`, `src/`, `build/`, `docs/`, `prompts/`, `dist/`, `node_modules/`;
- `package.json`, `bun.lock`, `tsconfig.json`, `.gitignore`, `skills-lock.json`, and repository metadata.

Operational workflow artifacts may be consolidated under `Engine/`. Runtime state belongs under `SavedData/`.

## Build, Test, and Development Commands

- `bun install`: install dependencies.
- `bun run dev`: build once with sourcemaps.
- `bun run dev:watch`: rebuild source changes in watch mode.
- `bun run build`: minified production build to `dist/mcp.js`.
- `bun run ./build.ts --clean`: remove `dist/` before a fresh build.
- `bun run docs:build`: generate API documentation.
- `bun run docs:serve`: serve generated docs.
- `bunx @modelcontextprotocol/inspector`: launch MCP Inspector.

Use focused local commands only when they verify the current change. Do not run the full suite continuously during active rework.

## Adding New Tools

Before implementing a new tool, Ponytail must confirm:

```text
Current blocker or repeated need:
Existing tool cannot safely solve it:
Expected token/MCP reduction:
Smallest useful interface:
Verification:
Maintenance cost:
```

If an existing tool or orchestration rule is sufficient, do not add a new tool.

Every accepted tool file in `src/server/tools/` follows this pattern:

1. Export parameter schemas and a `toolDocs` array at module level without Blockbench globals.
2. Register with `createTool()` inside a `registerXxxTools()` function.
3. Update `build/docs-manifest.ts`.
4. Register in `src/server/tools.ts`.
5. Regenerate docs during final verification or when documentation is specifically required.

Example:

```ts
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";

export const myToolParameters = z.object({
  name: z.string().describe("Name of the thing."),
});

export const myToolDocs: ToolSpec[] = [
  {
    name: "my_tool",
    description: "Does something useful.",
    annotations: { title: "My Tool", destructiveHint: true },
    parameters: myToolParameters,
    status: "stable",
  },
];

export function registerMyTools() {
  createTool(myToolDocs[0].name, {
    ...myToolDocs[0],
    async execute({ name }) {
      return `Hello, ${name}!`;
    },
  }, myToolDocs[0].status);
}
```

### No Blockbench Globals in Schemas

Schemas are imported by the docs generator outside Blockbench. Never use runtime globals during schema construction. Validate dynamic values inside `execute()`.

## Documentation System

- `build/docs-manifest.ts`: API documentation manifest.
- `build/docs.ts`: JSON Schema and HTML generation.
- `src/lib/factories.ts`: shared tool, prompt, and resource specifications.

Prompt and resource specs may remain inline in the docs manifest when their runtime modules access Blockbench globals.

Do not create a new workflow document when an existing authority can be simplified or updated.

## Coding Style & Naming

- TypeScript strict, ESNext modules, CJS plugin output.
- Use `@/*` aliases.
- Two-space indentation.
- Prefer explicit return types and narrow types.
- Keep UI text concise.
- Schema names: `{camelCaseToolName}Parameters`.
- Docs arrays: `{domainName}ToolDocs`.
- New workflow tools should return structured content when practical.
- Mutating tools should prefer explicit project, element, and parent identifiers.

## Testing During Rework

- Prefer focused Bun tests for changed logic.
- Co-locate focused tests or use `tests/`.
- Use Blockbench runtime verification for changed MCP tools.
- Verify only the affected stage flow after each batch.
- Do not keep continuous CI enabled during active workflow rework.
- Comprehensive typecheck, tests, build, docs generation, CI, and deploy preview happen in the final verification stage.

## Commits and Pull Requests

- Use conventional prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Avoid vague commit messages.
- Keep work on `Rework` while the workflow is incomplete.
- Do not keep a review PR open merely to trigger CI or preview deployment.
- Open a new review PR against V1 only after explicit user approval for final verification/integration.
- Final PR should include scope, OpenSpec change, runtime verification, screenshots/GIFs when relevant, and final CI results.

## Security and Configuration

- MCP settings live in Blockbench Settings; default endpoint is `:3000/bb-mcp`.
- Do not commit secrets.
- Keep network and filesystem actions behind explicit tools and permissions.
- Validate all external inputs with Zod.
- Preserve one active project write owner per asset session.
