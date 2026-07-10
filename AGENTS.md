# Repository Guidelines

## Mandatory Development Guardrails

- Use OpenSpec before development: read `openspec/config.yaml` and the active change under `openspec/changes/` before editing source.
- Use Ponytail review before done: prefer the smallest source-aligned change, reject unnecessary dependencies, new frameworks, and speculative architecture.
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
- For Bedrock Entity and Bedrock Block, use Per-face UV by default unless the approved package explicitly requires otherwise.
- Do not add another Blockbench MCP server entry when the existing `blockbench` endpoint already points to `http://localhost:3000/bb-mcp`.
- Do not require legacy numbered reference sheets for new sessions. Use the approved package format documented in `Engine/codex/BOOTSTRAP.md`.

## Project Structure & Module Organization

- `Engine/codex/`: compact local Codex bootstrap, state template, and stage profiles.
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

## Adding New Tools

Every tool file in `src/server/tools/` follows a two-part pattern:

1. Export parameter schemas and a `toolDocs` array at module level without Blockbench globals.
2. Register with `createTool()` inside a `registerXxxTools()` function.
3. Update `build/docs-manifest.ts`.
4. Register in `src/server/tools.ts`.
5. Regenerate docs.

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

## Testing

- Prefer Bun tests.
- Co-locate focused tests or use `tests/`.
- Validate production builds by loading `dist/mcp.js` in Blockbench.
- Manual verification must include the changed tool/resource and affected stage flow.
- Workflow changes must test reference intake, state transitions, stage review gates, and revision scope.

## Commits and Pull Requests

- Use conventional prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Avoid vague commit messages.
- PRs should include scope, linked OpenSpec change, screenshots/GIFs when visual behavior changes, and verification steps.
- Note new tools, resources, settings, state fields, or breaking workflow changes.

## Security and Configuration

- MCP settings live in Blockbench Settings; default endpoint is `:3000/bb-mcp`.
- Do not commit secrets.
- Keep network and filesystem actions behind explicit tools and permissions.
- Validate all external inputs with Zod.
- Preserve one active project write owner per asset session.
