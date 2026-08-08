# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** implement G2 so repository-owned Local prompts are the default runtime
  authority instead of the upstream CDN.
- **Status:** `MCP_G2_LOCAL_PROMPT_AUTHORITY`.
- **Execution now:** ChatGPT → GitHub.
- **Final runtime proof later:** Codex local from root `BuildIT` with Blockbench +
  MCP.
- **Specialist owner:** `mcp-server-development` because the affected behavior is
  the MCP prompt/runtime contract. Use `bun-tooling` only if investigation proves
  the build/package mechanism itself is the primary failure.

## Completed Boundary

Skill architecture is frozen.

The modelling-critical MCP audit identified five demonstrated correction
candidates plus two local-proof questions. G1 has now been implemented in source;
G2 is the active correction.

### G1 — Bedrock Entity default/recommended project path

**Source implementation complete.**

Changed:

- `mcp/server/tools/project.ts`
  - `create_project.format` now defaults to `bedrock`;
  - tool/schema description states Bedrock Entity is the default.
- `mcp/server/prompts.ts`
  - `model_creation_strategy.format` now supports
    `java_block | bedrock | bedrock_block`;
  - default is `bedrock`;
  - `bedrock` and `bedrock_block` resolve to separate prompt content.
- `mcp/prompts/bedrock.md`
  - new focused Bedrock Entity format guidance;
  - existing `bedrock_block.md` remains intact for explicit block-model requests.
- `mcp/build/docs-manifest.ts`
  - generated-doc source now exposes the same prompt enum/default contract.

Generated `mcp/prompts/manifest.json` and generated API docs were not edited by
hand. The existing build flow regenerates them.

**Static evidence:** default/schema/routing/docs source are aligned and explicit
alternate formats remain supported.

**Remaining evidence:** `LOCAL PROOF REQUIRED` — after local build/load, call
`create_project` without `format`, then `get_project_info`; expected
`format.id = "bedrock"`. Also verify `model_creation_strategy()` returns Entity
rather than block guidance once G2 makes Local prompts authoritative.

## Active Correction — G2 Local Bundled Prompt Authority

### Demonstrated problem

- `mcp/build/generate-manifest.ts` generates Local prompt content from
  `mcp/prompts/*.md` into `mcp/prompts/manifest.json`.
- `mcp/lib/promptLoader.ts` does **not** use that Local/bundled content as the
  primary runtime source.
- default behavior fetches
  `jasonjgardner/blockbench-mcp-plugin@v<VERSION>/prompts/manifest.json` from
  jsDelivr, then uses cache, then returns empty content when unavailable.
- `mcp_prompt_cdn_enabled` defaults to `true`.

This means editing Local prompt source does not guarantee the running Local
plugin serves those instructions.

### Expected behavior

Repository-owned prompt content is the default authority for the Local plugin.
An optional remote refresh may remain only when it cannot silently replace the
Local workflow contract.

### G2 constraints

- Do not create a new prompt framework.
- Do not delete user overrides unless a conflict is proven.
- Preserve synchronous `getPromptContent()` use by registered prompts unless
  changing it is necessary.
- Prefer build-time bundling or an existing build mechanism over runtime file
  reads that would require new permissions.
- Do not make network availability a prerequisite for normal Local prompts.
- Do not mix G3 annotations, G4 screenshots, or G5 Undo correction into G2.

### G2 proof

**ChatGPT → GitHub:** prove source/build resolution order and that Local prompt
content is included by the existing package/build path.

**Codex local:** with CDN/remote unavailable, load the built plugin and verify
`model_creation_strategy()` returns the current Local Bedrock Entity guidance.
This remains `LOCAL PROOF REQUIRED` until performed.

## Remaining Demonstrated Gaps

### G3 — MCP annotations are dropped during registration

`ToolSpec` annotations exist but both initial and per-session `registerTool`
paths omit them. Smallest correction: forward the existing annotations in both
registration paths. Local proof: inspect one read-only and one destructive tool
through MCP Inspector/client.

### G4 — `capture_screenshot(project=...)` leaves project-selection side effects

The helper may select another project and does not restore the prior selection.
Smallest correction: temporary selection + `finally` restoration. Local proof:
capture B while A is selected and verify A remains selected afterward.

### G5 — `bone_rigging` opens Undo before action-specific preflight

Invalid group/target lookup can throw after `Undo.initEdit` and before
`Undo.finishEdit`. Smallest correction: preflight action target/input before
opening Undo. Local proof: invalid target leaves history clean and subsequent
Undo still works.

## Local-Proof Questions — Do Not Add Code Yet

### P1 — Save/reopen `.bbmodel`

Existing `export_model`/project codec/action surfaces may already satisfy this.
Prove save + reopen first; add a first-class save/open tool only if current
surfaces cannot reliably do it.

### P2 — Camera/view semantics

`capture_screenshot`, `capture_app_screenshot`, and experimental
`set_camera_angle` already exist. Prove required orthographic/3/4 evidence before
adding another camera helper.

## Explicit Non-Gaps / Holds

- `place_cube` already supports bounded multi-Cuboid batches with Undo.
- `modify_cube` already covers Cuboid transforms and pivot/UV-adjacent fields.
- hierarchy/pivots already exist through `add_group` + `bone_rigging`.
- history/undo/checkpoint surface already exists; no transaction framework is
  justified yet.
- broad mesh/Hytale/PBR capabilities are not defects merely because Local's main
  product is Bedrock Entity Cuboid modelling.
- automatic texture-canvas calculation is not yet a proven MCP requirement.
- `risky_eval` result semantics remain lower priority; remove dependence on it
  from the normal modelling path before expanding scope.

## Correction Order

1. ~~G1 — Bedrock Entity default/recommended path~~ — source implemented,
   local proof pending.
2. **G2 — Local bundled prompt authority** — active.
3. G3 — MCP annotation forwarding.
4. G4 — screenshot project-state restoration.
5. G5 — bone-rigging preflight before Undo.
6. Codex-local targeted proof for all corrected boundaries plus save/reopen and
   camera semantics.

## Next Step

Audit the **existing build path for prompt assets** and implement G2 with the
smallest mechanism that makes Local/bundled prompt content primary at runtime.
Inspect `mcp/build/index.ts`, build plugins/assets, `mcp/lib/promptLoader.ts`, and
settings only as needed. Do not start G3 in the same change.
