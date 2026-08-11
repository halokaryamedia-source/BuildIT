# Codex Native Deferred MCP Tool Loading — Official Source Audit

Updated: 2026-08-11
Status: `OFFICIALLY VERIFIED`; actual BlockIT/Codex behavior remains `LOCAL PROOF REQUIRED`

## Question

Can BlockIT keep the full retained Minecraft Bedrock Entity MCP capability surface while avoiding a requirement for every enabled MCP tool schema to be model-visible at once, without adding a BlockIT-specific router/profile framework?

## Result

Yes, in the current official Codex source there is a native client-owned deferred MCP path. When the active model supports tool search and the active provider supports namespace tools, Codex registers MCP tools with deferred exposure, provides `tool_search`, indexes MCP tool metadata, and can load the matching tool specifications returned by search.

This means **no BlockIT runtime/source change is justified merely to opt into deferred loading**. BlockIT should preserve its retained Bedrock Entity capabilities and let the client own deferred exposure when the actual local Codex environment supports it.

This source audit does **not** prove that the user's installed Codex build, active model/provider, or live Blockbench session is currently using that path. That remains local acceptance evidence.

## Official Codex Source Evidence

Pinned upstream snapshot inspected for this audit:

```text
openai/codex@63002bdb26c939925f3fa59b9575cc0a3564cb45
```

### 1. MCP exposure becomes deferred when search is available

Owner:

```text
codex-rs/core/src/mcp_tool_exposure.rs
```

`append_mcp_tools(...)` selects:

```text
search enabled   -> ToolExposure::Deferred
search disabled  -> ToolExposure::Direct
```

The same path is applied to ordinary MCP tools and eligible Apps MCP tools; it is not a BlockIT-specific behavior.

### 2. Tool search availability is client/model/provider owned

Owner:

```text
codex-rs/core/src/tools/spec_plan.rs
```

The effective search condition is the conjunction of:

```text
active model supports_search_tool
AND
active provider supports namespace_tools
```

When search is available and deferred searchable runtimes exist, Codex adds its native `tool_search` handler. Exposure policy then keeps those eligible tools on the deferred path rather than sending them as normal direct tools.

### 3. Official tests protect deferred MCP exposure

Owner:

```text
codex-rs/core/src/mcp_tool_exposure_test.rs
```

The current suite explicitly covers:

```text
defers_effective_tool_sets_when_search_is_available
defers_apps_and_non_app_mcp_tools
```

It separately verifies direct exposure when search is unavailable. This is stronger evidence than inferring behavior from a single implementation branch.

### 4. Standard MCP metadata is sufficient for native search

Owner:

```text
codex-rs/core/src/tools/handlers/mcp.rs
```

Codex builds MCP search text from existing MCP information including:

```text
canonical/callable/raw tool names
server name
title
description
connector / namespace metadata when present
input-schema property names
```

There is no requirement here for a BlockIT-owned `defer_loading` field or custom search manifest.

### 5. Search returns loadable matching specifications

Owner:

```text
codex-rs/core/src/tools/handlers/tool_search.rs
```

The native handler builds a BM25 search index from deferred tool search metadata. A search returns matching `LoadableToolSpec` values and coalesces matching namespaces. This is the client-side mechanism that avoids treating the entire MCP catalog as one undifferentiated direct tool surface.

### 6. Current official model/provider source supports the mechanism

Owners:

```text
codex-rs/models-manager/models.json
codex-rs/model-provider/src/provider.rs
```

The inspected current Codex model catalog includes models with `supports_search_tool: true`; the current `gpt-5.6-sol` entry is one such model. Standard provider capabilities default `namespace_tools` to true.

These are official-source facts only. The actual installed Codex version, active model, provider, and resolved remote model metadata must still be recorded in the local acceptance run instead of inferred from this snapshot.

## BlockIT Compatibility Audit

### Existing MCP registration already exposes indexed metadata

Owner:

```text
mcp/lib/factories.ts
```

BlockIT's existing `createTool(...)` / `registerToolsOnServer(...)` path registers the standard MCP fields Codex search consumes:

```text
name
title
description
inputSchema
annotations
```

The full Zod schema remains the runtime validation owner while the extracted object shape is used for MCP registration/listing. No additional BlockIT search registry is needed.

### Existing family/profile architecture should remain unchanged

Owner:

```text
mcp/server/tools.ts
```

BlockIT registration is intentionally family-level. The current profile selects existing families and does not introduce per-tool ACLs or a dynamic policy engine. Native Codex deferred exposure is therefore a client concern, not a reason to add a second BlockIT routing layer.

### Existing authoring routing already gives high-signal search intent

Owner:

```text
.agents/skills/blockit-bedrock-entity-mcp/SKILL.md
```

The normal stage-gated lane names the intended operations directly (`create_project`, `place_cube`, `capture_model_views`, `inspect_element`, `modify_cube`, `export_model`, etc.) and loads texture/animation specialists only when their stage is active. This already supplies much better intent for native tool search than catalog exploration.

## Default Tool Footprint Audit — 2026-08-11

A bounded GitHub CI audit originally ranked the **default 65 enabled tools** by compact Zod-derived schema and description footprint. That ranking is historical diagnostic evidence from before the later `apply_texture` containment; its category table is not rewritten as if it were a new measurement.

Historical actual stateless `tools/list` baseline before `apply_texture` containment:

```text
65 enabled tools
72,817 response characters
48,119 input-schema characters
11,786 tool-description characters
```

Historical post-`apply_texture` stateless `tools/list` snapshot:

```text
64 enabled tools
74,267 response characters
49,240 input-schema characters
12,298 tool-description characters
```

`activate_texture` remains exposed; `apply_texture` is absent from the callable tools list. This is a Bedrock semantics correction, not a geometry benchmark profile or arbitrary context cut.

A later Bedrock semantics audit also default-disabled `filter_by_material`, because it searched raw per-face `face.texture` identities that do not own effective texture selection in native `single_texture`. Historical snapshot after both containments: **63 tools / 73,149 response characters / 48,614 input-schema characters / 12,020 description characters**. Historical byte totals are retained as evidence, not compared as a controlled performance benchmark across different source states.

After narrowing `place_cube` to native Bedrock UV ownership, the callable surface remains **63 tools**. That historical wire snapshot was **73,174 response characters / 48,551 input-schema characters / 12,108 description characters**, with `place_cube` at **2,531 schema characters** and no per-Cube `texture` selector. This is semantic cleanup, not a new profile or tool-count optimization target.

Final pinned-SDK measurement after the complete non-local pre-local cleanup: **62 tools / 72,775 response characters / 48,674 input-schema characters / 11,800 description characters**. `create_project` remains **212** schema characters, `add_group` is **758**, and `duplicate_element` is **539**; `list_export_formats`, `apply_texture`, and `filter_by_material` are absent while `export_model` remains exposed. This final line is the current-source measurement; earlier figures above are intentionally retained as historical source-state evidence.

The ranking audit produced this compact approximation:

```text
65 tools
51,357 schema characters
13,146 description characters
65,583 combined name/schema/description characters
```

### Category concentration

| Category | Tools | Approx schema chars | Approx description chars |
| --- | ---: | ---: | ---: |
| Animation | 8 | 13,039 | 2,118 |
| Paint Tools | 12 | 11,995 | 601 |
| Elements | 13 | 7,443 | 3,464 |
| Textures | 13 | 7,181 | 2,911 |
| Cubes | 3 | 5,444 | 893 |
| Material Instances | 5 | 2,387 | 654 |
| Camera & Screenshots | 2 | 1,300 | 571 |
| History | 4 | 996 | 854 |
| Export | 2 | 947 | 563 |
| Project | 3 | 625 | 517 |

Animation + Paint account for **25,034 / 51,357 (~48.7%)** of the approximate schema footprint. Those are legitimate downstream Bedrock authoring capabilities, so their size is not evidence that they should be removed from the retained product surface.

### Largest individual schema/description hotspots

| Tool | Approx schema chars | Description chars before cleanup |
| --- | ---: | ---: |
| `create_animation` | 2,621 | 107 |
| `place_cube` | 2,279 | 242 |
| `bone_rigging` | 1,613 | 705 |
| `modify_cube` | 1,780 | 300 |
| `manage_keyframes` | 1,836 | 221 |
| `batch_keyframe_operations` | 1,782 | 226 |
| `animation_copy_paste` | 1,575 | 418 |
| `animation_graph_editor` | 1,818 | 73 |
| `modify_cubes_batch` | 1,385 | 351 |
| `paint_settings` | 1,659 | 47 |

The first footprint ranking did not enumerate every description-length outlier, so the earlier inference that only two descriptions exceeded 400 characters was incorrect. A follow-up full-catalog description audit found `inspect_element` at 614 characters and `bone_rigging` at 410 after its first compaction; the next longest descriptions were below 400. `inspect_element` is a high-frequency geometry-lane read, so its description is now compacted while preserving target types, UUID/unique-name identity, correction-state purpose, read-only behavior, and the visual-verdict boundary. This correction changes the measurement conclusion, not the tool payload or capability.

The repeated-description scan found only one exact parameter description repeated at least three times: the selected-texture fallback sentence appears in ten Paint/Texture tools, representing at most about **531 repeated characters** beyond the first copy. Removing that field guidance would save little while making explicit-vs-selected texture routing less clear, so **no change is justified**.

### Current official client controls

The current official Codex configuration reference documents client-side MCP allow/deny controls:

```text
mcp_servers.<id>.enabled_tools
mcp_servers.<id>.disabled_tools
tool_output_token_limit
```

Official OpenAI Tool Search documentation also documents deferred MCP/tool loading and recommends clear high-level searchable surfaces; namespace guidance targets fewer than ten functions where namespaces are used. These are client/API mechanisms, not permission to add another BlockIT runtime profile or router without local evidence.

References:

```text
https://developers.openai.com/codex/config-reference
https://developers.openai.com/api/docs/guides/tools-tool-search
```

### Local A/B exposure diagnostic

When local Codex proof becomes available, compare the normal full BlockIT surface against a **temporary client-side geometry allowlist** using Codex `enabled_tools`; do not commit the allowlist as the BlockIT default.

Bounded geometry diagnostic lane:

```text
get_project_info
create_project
list_outline
find_elements_by_criteria
place_cube
add_group
capture_model_views
inspect_model_bounds
inspect_element
modify_cube
modify_cubes_batch
remove_element
undo
save_checkpoint
export_model
```

Use the same representative geometry task for both runs. Compare final reference-fidelity outcome first, then initial model-visible tool/schema footprint, wrong-tool selections, total tool calls, total tokens, latency, and retries. A smaller surface is an improvement only if the result remains equally valid. Then return to the full retained surface for representative texture/animation/Locator reachability so a geometry-only benchmark cannot accidentally become product policy.

`tool_output_token_limit` may be evaluated as a history safety bound only after observing real tool outputs; do not set it pre-emptively because truncating inspection/correction evidence can reduce correctness.

### Decision

```text
DO NOT mass-trim schemas that encode real Bedrock authoring inputs.
DO NOT disable Animation/Paint/Texture/Locator merely because they dominate the catalog.
DO NOT convert the geometry benchmark allowlist into a default MCP profile.
DO trim clearly overlong tool descriptions when routing/safety meaning is preserved.
DO use native/client-side exposure controls in local A/B proof before considering BlockIT-side routing architecture.
```

## Local Decision

For the current `Local` branch:

```text
DO NOT add a BlockIT custom tool router.
DO NOT add another capability/profile framework for context reduction.
DO NOT disable retained native Bedrock capabilities merely to shrink model context.
DO NOT claim usage reduction from this source audit alone.
```

Use Codex's native deferred/search path when the actual local environment proves it is active. If the local proof fails, diagnose the installed client version, model, provider, and resolved tool exposure first. Only then reconsider a BlockIT-side mechanism if a real remaining blocker is demonstrated.

## Required Local Proof

Use the actual Codex + Blockbench + BlockIT environment. The proof is intentionally diagnostic and bounded; it is not another product framework.

1. Record the installed `codex --version`, active model, and provider used for the run.
2. Start Blockbench with the current `Local` BlockIT build and verify the normal stateless endpoint is reachable.
3. Set a temporary `CODEX_ROLLOUT_TRACE_ROOT` outside the repository before starting the bounded Codex run. Rollout traces can contain prompts, responses, tool inputs/outputs, terminal output, and paths, so **never commit the trace bundle**.
4. Run one small BlockIT authoring task from the `BuildIT` root that requires a known geometry operation.
5. Reduce the produced bundle with:

```text
codex debug trace-reduce <trace-bundle>
```

6. Inspect the first model-facing request and prove that the full current 64-tool BlockIT schema surface is not all sent as direct model-visible tool specifications when native search is active.
7. Inspect the subsequent request/runtime evidence and prove that a relevant BlockIT tool is discovered/loaded and then called successfully.
8. Repeat only enough bounded discovery to prove retained reachability across the product path: geometry plus texture and either animation or Locator/Null Object. Do not run every tool.
9. When practical, record the initial model-visible BlockIT tool-spec count/serialized size and compare it with the current full `tools/list` measurement of 64 enabled tools / 74,267 response characters. Keep this as diagnostic evidence, not a permanent runtime metric.

### PASS

```text
Initial model-visible BlockIT schema surface is materially smaller than the full catalog
AND
native search discovers/loads the relevant retained BlockIT tools
AND
representative retained domains remain callable
```

### FAIL

```text
All 65 full BlockIT tool specifications remain model-visible at the initial request
OR
native search cannot discover/load a retained capability required by the bounded test
```

On failure, inspect client/model/provider support before changing BlockIT architecture.

### BLOCKED

Use `BLOCKED` when the installed Codex environment cannot expose the evidence needed to determine direct vs deferred model-visible tool exposure. Report the exact version/model/provider or trace limitation; do not substitute a guess or add a router to create apparent progress.

## Evidence Boundary

This audit upgrades the existence and compatibility of the native Codex mechanism to `OFFICIALLY VERIFIED`. It does **not** upgrade BlockIT's real local client behavior, token usage, model quality, Blockbench behavior, or end-to-end acceptance. Those remain `LOCAL PROOF REQUIRED` until the bounded run above is completed.