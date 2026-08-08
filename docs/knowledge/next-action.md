# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** implement G3 so existing MCP tool annotations are actually forwarded
  to the client-visible SDK registration contract.
- **Status:** `MCP_G3_ANNOTATION_FORWARDING`.
- **Execution now:** ChatGPT → GitHub.
- **Final runtime proof later:** Codex local from root `BuildIT` with Blockbench +
  MCP.
- **Specialist owner:** `mcp-server-development`.

Skill architecture remains frozen. Do not mix G4/G5 or new framework work into
this correction.

## Completed Corrections

### G1 — Bedrock Entity default/recommended path

**Source implemented; `LOCAL PROOF REQUIRED`.**

- `create_project.format` defaults to `bedrock`.
- `model_creation_strategy` defaults to `bedrock` and separates `bedrock` from
  explicit `bedrock_block` guidance.
- `mcp/prompts/bedrock.md` owns focused Bedrock Entity format guidance.
- generated-doc source exposes the same enum/default contract.
- generated prompt/API artifacts remain build-generated, not hand-edited.

Local proof later:

```text
create_project(name="test")
→ get_project_info()
→ expected format.id = "bedrock"
```

### G2 — Local bundled prompt authority

**Source implemented; `LOCAL PROOF REQUIRED`.**

Current contract:

```text
user override
→ bundled Local prompt
→ optional remote/cache fallback for Local-missing prompt names
→ empty
```

Implemented in `mcp/lib/promptLoader.ts`:

- imports `mcp/prompts/manifest.json` into the runtime module graph;
- validates and keeps that bundled manifest as the Local authority;
- Local prompt names override same-named CDN/cache entries;
- user overrides remain highest priority;
- remote content is fallback-only;
- `refreshFromCDN()` cannot replace same-named Local prompt content.

Build/source evidence:

- canonical `dev`/`build` scripts run `prompts:build` before Bun bundling;
- `build/generate-manifest.ts` scans `mcp/prompts/*.md` into
  `mcp/prompts/manifest.json`;
- `tsconfig.json` enables JSON-module imports;
- Bun bundles the TypeScript/JSON module graph into `dist/mcp.js`.

Runtime/UI alignment:

- `mcp_prompt_cdn_enabled` now defaults to `false`;
- entrypoint treats CDN as strict opt-in (`=== true`);
- setting descriptions now explain CDN as optional fallback rather than default
  authority.

Local proof later:

1. run canonical local build so prompt manifest is regenerated;
2. load the plugin with CDN disabled/network unavailable;
3. call `model_creation_strategy()` and confirm it returns current Local Bedrock
   Entity guidance;
4. optionally enable CDN and confirm same-named Local prompt content still wins.

## Active Correction — G3 Annotation Forwarding

### Demonstrated problem

`ToolSpec` and stored tool definitions contain MCP annotations such as:

- `readOnlyHint`;
- `destructiveHint`;
- `openWorldHint`.

But `mcp/lib/factories.ts` currently drops those annotations when calling
`server.registerTool(...)` in both:

1. initial/current-server registration;
2. per-session `registerToolsOnServer(...)` reconstruction.

### Expected behavior

The annotation object already declared by each tool must be forwarded unchanged
to the official SDK registration definition in both paths.

### Constraints

- use the existing annotation object; do not create another metadata layer;
- keep tool schemas/descriptions/results unchanged;
- change both registration paths together so new sessions match the reference
  server;
- do not start G4 screenshot restoration or G5 Undo preflight in the same diff.

### Proof

**ChatGPT → GitHub:** inspect the exact factory diff and prove both
`registerTool(...)` paths forward the stored annotation object.

**Codex local:** inspect at least one read-only tool (for example
`get_project_info` or `capture_screenshot`) and one destructive tool (for example
`place_cube`) through MCP Inspector/client and confirm annotations are exposed.
This remains `LOCAL PROOF REQUIRED` until performed.

## Remaining Corrections

### G4 — screenshot project-state restoration

`capture_screenshot(project=...)` can select another project and leave it active.
Smallest correction: preserve prior selection, temporarily select target, restore
in `finally`.

### G5 — bone-rigging preflight before Undo

`bone_rigging` opens `Undo.initEdit` before action-specific target lookup. Invalid
input can throw before `Undo.finishEdit`. Smallest correction: preflight target/
input before opening Undo; no generic transaction framework.

## Local-Proof Questions — Hold

- **P1 save/reopen `.bbmodel`:** prove existing project codec/action surface first.
- **P2 camera/view semantics:** prove existing screenshot/set-camera surface first.

Do not add save/open or camera helper tools until those existing capabilities fail
focused local proof.

## Next Step

Implement **G3 only** in `mcp/lib/factories.ts`: forward the existing annotation
object through both official SDK `registerTool(...)` paths, inspect direct type/
registration contracts, then leave Inspector/client verification as
`LOCAL PROOF REQUIRED`.
