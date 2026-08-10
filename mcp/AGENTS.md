# Repository Guidelines

## Project Structure & Module Organization
- `index.ts`: Blockbench plugin entry (registers MCP server and UI).
- `server/`: MCP server glue (`server.ts`), `tools/`, `resources.ts`, `prompts.ts`.
- `ui/`: Panel UI and settings (`index.ts`, `settings.ts`).
- `lib/`: Shared utilities and factories (`constants.ts`, `factories.ts`, `util.ts`, `zodObjects.ts`).
- `prompts/` and `macros/`: Prompt templates and helpers.
- `dist/`: Build output (`mcp.js`, maps, copied assets like `icon.svg`, `about.md`).
- `docs/`: Auto-generated documentation (`api.json`, `index.html`, `style.css`).
- `build/`: Build scripts (`index.ts`, `utils.ts`, `plugins.ts`, `docs.ts`, `docs-manifest.ts`).
- `tests/`: Focused Bun contract tests for MCP registration/security behavior.

## Build, Test, and Development Commands
- `bun install --frozen-lockfile`: Install exactly from the committed lockfile for verification.
- `bun run dev`: Build once with sourcemaps.
- `bun run dev:watch`: Rebuild on change (watch mode).
- `bun run typecheck`: Run the full strict TypeScript gate (`tsc --noEmit`).
- `bun run test`: Run the focused Bun contract tests.
- `bun run build`: Minified production build to `dist/mcp.js`.
- `bun run docs:build`: Generate API documentation from Zod schemas to `docs/`.
- `bun run docs:check`: Regenerate in a temporary comparison flow and fail if committed generated docs are stale.
- `bun run docs:serve`: Serve the generated docs locally with Tailwind processing.
- `bunx @modelcontextprotocol/inspector`: Launch MCP Inspector for local testing.

## Adding New Tools

Every tool file in `server/tools/` follows a two-part pattern:

1. **Export parameter schemas and a `toolDocs` array** at module level (no Blockbench globals):
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
```

2. **Register with `createTool()`** inside a `registerXxxTools()` function, spreading from the spec. When a broad `ToolSpec` spread would erase concrete Zod inference for `execute()`, restate the exact same `parameters` schema in the registration rather than weakening types:
```ts
export function registerMyTools() {
  createTool(myToolDocs[0].name, {
    ...myToolDocs[0],
    parameters: myToolParameters,
    async execute({ name }) {
      // Blockbench globals (Undo, Canvas, etc.) are safe here
      return `Hello, ${name}!`;
    },
  }, myToolDocs[0].status);
}
```

3. **Update the docs manifest** in `build/docs-manifest.ts`:
   - Import the `toolDocs` array from your tool file.
   - Add it to `toolManifest` with the appropriate category.

4. **Register in `server/tools.ts`**: Import and call your `registerXxxTools()` function.

5. **Regenerate docs**: Run `bun run docs:build` to update `docs/api.json` and `docs/index.html`, then verify with `bun run docs:check`.

### Critical Rule: No Blockbench Globals in Schemas

Parameter schemas are imported at build time by the doc generator, which runs outside Blockbench. **Never use Blockbench runtime globals** (e.g., `BarItems`, `Formats`, `Plugins`) in schema construction. Use `z.string().describe("...")` instead of dynamic enums, and do runtime validation inside `execute()`.

Blockbench runtime adapters must likewise be created inside registration/execution scope when merely importing the module is expected to work in Node/Bun documentation or test environments.

## Documentation System

Documentation is auto-generated from Zod schemas at build time:

- **`build/docs-manifest.ts`**: Imports all `toolDocs` arrays from tool files plus inline prompt/resource specs. This is the single source of truth for what appears in the docs.
- **`build/docs.ts`**: Reads the manifest, converts Zod schemas to JSON Schema via `zod-to-json-schema`, and outputs `docs/api.json` (machine-readable) and `docs/index.html` (Tailwind-styled page). Generated HTML is normalized to avoid trailing-whitespace drift.
- **`lib/factories.ts`**: Defines `ToolSpec`, `PromptSpec`, and `ResourceSpec` interfaces used by both tool files and the manifest.

Prompt and resource specs are defined **inline in the manifest** (not imported from their source files) where source modules depend on runtime-only behavior.

Generated `docs/api.json` and `docs/index.html` are authoritative only when `bun run docs:check` passes. Do not hand-edit generated tool entries to make freshness checks pass.

## Coding Style & Naming Conventions
- Language: TypeScript (strict), ESNext modules, CJS output for the plugin.
- Paths: Use alias `@/*` (see `tsconfig.json`).
- Indentation: 2 spaces; prefer explicit return types and narrow types.
- Keep UI text concise; avoid blocking calls in plugin lifecycle hooks.
- Schema naming: `{camelCaseToolName}Parameters` (e.g., `placeCubeParameters`).
- Docs array naming: `{domainName}ToolDocs` (e.g., `cubeToolDocs`).
- Do not use `any`, `@ts-ignore`, or broad compatibility shims merely to silence retained Bedrock Entity type debt. Prefer official Blockbench/MCP contracts or a narrow evidence-backed runtime adapter.

## Testing Guidelines
- The root `.github/workflows/mcp-verify.yml` is the repository gate for `mcp/**` changes.
- Before marking MCP source work complete, the expected GitHub/package gates are: frozen-lockfile install, full typecheck, focused Bun tests, production build, and generated-doc freshness.
- Focus automated tests on high-risk public contracts rather than broad low-value coverage. Current P0 fixtures cover schema refinement preservation, annotations, dangerous-default containment, and Origin rejection ordering.
- GitHub tests do **not** replace local Blockbench proof. Validate runtime-sensitive changes by loading `dist/mcp.js` and exercising the affected tools/resources in Blockbench/MCP Inspector.
- Keep static/source proof separate from listener binding, live Inspector behavior, Undo/Redo semantics, playback, save/reopen, export, and visual fidelity proof.

## Commit & Pull Request Guidelines
- Commits: Use conventional prefixes (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`). Avoid vague "update"; be specific.
- PRs: Include scope/summary, linked issues, screenshots/GIFs for UI changes, and steps to reproduce/test. Note any new tools, resources, settings, or breaking changes.

## Security & Configuration Tips
- Server config lives in Blockbench Settings: MCP port and endpoint (defaults `:3000/bb-mcp`).
- Default transport containment is loopback-only with present Origin validation; do not broaden network exposure without a separately reviewed authentication design.
- `risky_eval` and `from_geo_json` are not default capabilities. Do not re-enable them indirectly through convenience registration.
- Do not commit secrets. Keep network calls behind explicit tools; validate all inputs through the retained full Zod schema.
- Keep bundle lean: add only necessary deps; prefer tree-shakeable utilities.
