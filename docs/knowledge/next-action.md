# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** correct only the demonstrated MCP gaps that materially block or
  misdirect the cleaned whole-form-first Minecraft Bedrock Entity workflow.
- **Status:** `MCP_IMPLEMENTATION_GAPS_IDENTIFIED`.
- **Execution now:** ChatGPT → GitHub.
- **Final runtime proof later:** Codex local from root `BuildIT` with Blockbench +
  MCP for claims that require live/runtime/visual evidence.

## Completed Boundary

Skill consolidation is **frozen**. Do not reopen skill recovery or add another
specialist unless current implementation work proves a genuinely distinct owner.

The modelling-critical MCP path has been traced through current Local source:
project creation, MCP registration, prompts, Cuboid/group/hierarchy mutation,
history/undo, camera/screenshots, texture/UV, animation support, export/save
surface, and session reconstruction.

No MCP runtime source has been changed during this audit yet.

## Demonstrated Correction Candidates

### G1 — Bedrock Entity target is contradicted by project/prompt defaults

**Observed behavior/source**

- `mcp/server/tools/project.ts` defaults `create_project.format` to
  `bedrock_block`.
- `model_creation_strategy(format="bedrock")` loads `bedrock_block` prompt
  content.
- `mcp/prompts/bedrock_block.md` explicitly instructs creation of a Bedrock block
  model and applies block-specific size limits.

**Expected current behavior**

Local product scope targets an editable **Minecraft Bedrock Entity** `.bbmodel`.
General format support may remain, but the default/recommended Bedrock path must
not silently create a block-format project.

**Owner:** `mcp-server-development` — MCP input/prompt contract.

**Why it matters:** a simple user request can start in the wrong Blockbench
format before modelling begins.

**Evidence:** source mismatch is demonstrated. Actual Blockbench format created
without an explicit `format` remains `LOCAL PROOF REQUIRED`.

**Smallest correction:** change only the Local default/recommended Bedrock path
to the Entity format (`bedrock`) while preserving explicit alternate formats.
Do not remove `bedrock_block` capability globally.

**Required local proof:** call `create_project` without explicit format and verify
`get_project_info.format.id` is the expected Bedrock Entity format.

### G2 — Runtime prompt authority defaults to upstream CDN instead of Local

**Observed behavior/source**

- Local prompt Markdown is compiled into `mcp/prompts/manifest.json` by
  `build/generate-manifest.ts`.
- `mcp/lib/promptLoader.ts` does not use that Local manifest as its primary
  runtime source; by default it fetches
  `jasonjgardner/blockbench-mcp-plugin@v<VERSION>/prompts/manifest.json` from
  jsDelivr, then cache, then empty content.
- `mcp_prompt_cdn_enabled` defaults to `true`.

**Expected current behavior**

Local modelling guidance must remain the runtime default authority. An optional
remote refresh must not silently replace repository-owned workflow instructions.

**Owner:** MCP prompt/runtime contract; use `mcp-server-development` for the
public prompt behavior. Bun is only an implementation detail unless build
packaging itself proves to be the failure.

**Why it matters:** correcting Local prompt files currently does not guarantee
that the running Local plugin will actually serve those corrections.

**Evidence:** source resolution order is demonstrated. Actual packaged prompt
resolution is `LOCAL PROOF REQUIRED`.

**Smallest correction:** make bundled Local prompt content the primary runtime
source and keep remote refresh only as an explicit/secondary option if still
needed. Do not add a new prompt framework.

**Required local proof:** with CDN disabled and cache unavailable, the running
plugin still returns current Local prompt content; `model_creation_strategy`
returns the corrected Bedrock Entity/whole-form guidance.

### G3 — Declared MCP tool annotations are dropped during registration

**Observed behavior/source**

`ToolSpec`/stored definitions contain annotations such as `readOnlyHint`,
`destructiveHint`, and `openWorldHint`, but both initial `registerTool(...)` and
per-session `registerToolsOnServer(...)` pass only title, description, and input
schema.

**Expected current behavior**

Declared MCP annotations should reach the actual MCP registration contract.

**Owner:** `mcp-server-development`.

**Why it matters:** safety/read-only metadata exists in source but is not carried
through the client-visible registration path.

**Evidence:** omission is demonstrated statically. Client-visible result is
`LOCAL PROOF REQUIRED`.

**Smallest correction:** forward the existing annotation object in both
registration paths; do not create another metadata layer.

**Required local proof:** inspect one read-only and one destructive tool through
MCP Inspector/client and confirm their annotations are exposed.

### G4 — `capture_screenshot(project=...)` changes active project despite read-only contract

**Observed behavior/source**

`capture_screenshot` is declared read-only, but `captureScreenshot(project)` may
select another `ModelProject` and does not restore the previously selected
project.

**Expected current behavior**

Capturing another project's visual evidence should not leave persistent editor
selection/tab state behind.

**Owner:** `blockbench-runtime-development`.

**Why it matters:** a visual-review operation can silently move the modeller to a
different project and affect subsequent operations.

**Evidence:** source side effect is demonstrated. Actual tab/selection behavior is
`LOCAL PROOF REQUIRED`.

**Smallest correction:** preserve the prior selected project, temporarily select
the target only when required, and restore the prior project in `finally`.

**Required local proof:** with project A selected, capture project B and verify A
is selected again afterward.

### G5 — `bone_rigging` can open an Undo edit before failing preflight

**Observed behavior/source**

`bone_rigging` calls `Undo.initEdit(...)` before action-specific target lookup.
Actions such as `set_pivot`, `parent`, or `delete` can then throw from
`findGroupOrThrow(...)` before `Undo.finishEdit(...)` is reached.

**Expected current behavior**

Invalid target/input should fail before mutation/Undo state is opened whenever
possible.

**Owner:** `blockbench-runtime-development`.

**Why it matters:** a normal input error may leave Blockbench edit/history state
in an uncertain condition.

**Evidence:** failure control flow is demonstrated. Actual Undo-stack aftermath is
`LOCAL PROOF REQUIRED`.

**Smallest correction:** perform action-specific lookup/input preflight before
`Undo.initEdit`; do not introduce a generic transaction/rollback framework.

**Required local proof:** intentionally call an invalid target action and verify
history remains clean and subsequent edits/undo still work.

## Local-Proof Questions — Do Not Add Code Yet

### P1 — Save/reopen `.bbmodel`

Existing `export_model` can use registered codecs and documents a `project`
codec example; Blockbench actions are also reachable through `trigger_action`.
There is no proof yet that a first-class `save_project`/`open_project` tool is
needed.

**Status:** `LOCAL PROOF REQUIRED`.

**Proof first:** save the active `.bbmodel` through the existing project
codec/action, reopen it, and inspect the project. Add a focused save/open tool
only if the existing surface cannot reliably complete that requirement.

### P2 — Camera/view semantics

`capture_screenshot`, `capture_app_screenshot`, and experimental
`set_camera_angle` already exist.

**Status:** `LOCAL PROOF REQUIRED`.

**Proof first:** verify the current camera tool can produce the orthographic and
3/4 evidence required by the modelling gates before adding another camera helper.

## Explicit Non-Gaps / Hold Decisions

- `place_cube` already accepts an array and has one Undo transaction per call;
  primary whole-form geometry does **not** need a new orchestration tool.
- `modify_cube` already covers Cuboid transform/pivot/UV-adjacent properties.
- hierarchy/pivot capability exists through `add_group` plus `bone_rigging`; do
  not add another hierarchy tool without a concrete missing operation.
- undo/redo/history/checkpoint capability exists; do not add a transaction
  framework because historical Sample/Rework had one.
- screenshot/camera capability exists; prove its semantics before expanding it.
- texture creation/application and Cuboid UV controls already exist. The current
  foundation statement that MCP automatically calculates a 256/512/1024 canvas
  is **not yet a runtime gap**; simplify policy rather than adding a tool if local
  modelling does not require automatic calculation.
- broad mesh/Hytale/PBR capability is not itself a defect and should not be
  removed merely for aesthetic purity.
- `risky_eval` returning textual errors as successful tool content is a lower-
  priority result-semantics concern; first remove it from the recommended default
  modelling path, then revisit only if current workflow still depends on it.

## Correction Order

Use one bounded owner/change at a time:

1. **G1 — Bedrock Entity project default/recommended path**.
2. **G2 — Local bundled prompt authority + corrected modelling prompt content**.
3. **G3 — MCP annotations forwarding**.
4. **G4 — screenshot project-state restoration**.
5. **G5 — bone-rigging preflight before Undo**.
6. Codex-local targeted proof for project creation, prompt source, annotations,
   screenshot restoration, Undo failure path, save/reopen, and camera views.

Do not bundle unrelated owners into one refactor.

## Next Step

Implement **G1 only** using `development-brief` +
`mcp-server-development`: change the Bedrock Entity default/recommended project
contract at its current owner, inspect all directly affected prompt/caller/docs
contracts, and leave the exact Blockbench format verification as
`LOCAL PROOF REQUIRED`. Do not start G2 in the same change.
