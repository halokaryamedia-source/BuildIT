# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** prove the newly implemented goal-oriented Blockbench MCP prompt
  routing before adding another modelling capability.
- **Status:** `SLICE_A_IMPLEMENTED_LOCAL_PROOF_REQUIRED`.
- **Implementation channel:** ChatGPT → GitHub complete for Slice A source.
- **Required proof channel:** Codex local from root `BuildIT` with the existing
  Bun/MCP environment.
- **G3:** still paused.

## Accepted Surface Direction

Normal Bedrock Entity modelling is organized by modelling goals, not by
implementation method:

```text
orient project
→ targeted state inspection
→ whole-form primary Cuboid pass
→ meaningful primary visual gate
→ targeted correction
→ secondary hierarchy / pivots
→ full geometry review
→ Cuboid UV / texture
→ optional animation
→ final structural + visual proof
→ save .bbmodel
```

UI automation, code evaluation, and `.geo.json` import remain available only as
explicit specialized fallbacks. They are not peer default creation paths.

Full curation review:
`docs/knowledge/reviews/mcp-surface-curation.md`.

## Slice A — Implemented

### Public prompt contract

`mcp/server/prompts.ts`

- `model_creation_strategy` is now described as goal-oriented;
- default `format` remains `bedrock`;
- existing `approach: ui | programmatic | import` is retained for compatibility,
  but is documented as **explicit fallback only**;
- normal callers omit `approach`;
- prompt sections are separated cleanly when an explicit fallback is appended.

`mcp/build/docs-manifest.ts` mirrors the same public prompt description/schema.

### Bedrock Entity guidance

`mcp/prompts/bedrock.md` now routes normal modelling through:

- `get_project_info` + targeted outline/search before mutation;
- whole-form interpretation before local Cube polish;
- bounded `place_cube` work and targeted `modify_cube` correction;
- meaningful `capture_screenshot` visual gates rather than per-Cube screenshots;
- primary-form correction before compensating detail;
- secondary hierarchy/pivots only when useful;
- texture after coherent geometry;
- animation only when requested;
- structural diagnostics + fresh visual evidence before final completion.

It explicitly keeps these out of the normal Bedrock Entity path unless a
specialized need/blocker exists:

```text
risky_eval
trigger_action
fill_dialog
emulate_clicks
capture_app_screenshot
from_geo_json
generic mesh / armature / PBR tools
Hytale tools
```

### Explicit fallback prompts

- `mcp/prompts/model_creation_ui.md` — UI automation is last-resort only.
- `mcp/prompts/model_creation_programmatic.md` — `risky_eval` is
  developer/diagnostic fallback only and requires the code-eval safety guidance.
- `mcp/prompts/model_creation_import.md` — import is for authoritative/provided
  `.geo.json` or an explicit import request, not the normal modelling method.

No mutation tool, resource, transport/session behavior, Blockbench runtime
operation, or G3 annotation behavior was changed in Slice A.

## Why `approach` Was Not Deleted

Deleting the argument would create a breaking MCP prompt-contract change without
proof that removal is necessary. The smaller solution is to keep the existing
values but change their semantics/documentation from peer strategies to explicit
fallbacks.

If later evidence shows the argument itself causes harmful routing despite the
new description, removal can be considered as a separate contract change.

## Generated Prompt Manifest

`mcp/prompts/manifest.json` is generated from `mcp/prompts/*.md` by:

```text
bun run prompts:build
```

ChatGPT → GitHub did **not** hand-edit this generated file. `bun run build`
already runs `prompts:build` first, so the local proof must regenerate it through
the canonical build flow.

## Acceptance Criteria

1. Calling `model_creation_strategy` with no `approach` and default `format`
   returns the goal-oriented Bedrock Entity workflow.
2. The default response does not instruct the agent to use `risky_eval`, UI
   automation, or `.geo.json` import as normal creation steps.
3. Passing an explicit fallback `approach` still works and appends only the
   corresponding bounded fallback guidance.
4. The docs manifest and runtime prompt schema describe `approach` as an explicit
   fallback rather than a peer default.
5. Slice A introduces no new mutation tool and does not change existing tool
   execution behavior.

## Exact Local Proof Required

From root `BuildIT`, use the existing `mcp/` project:

```text
cd mcp
bun run prompts:build
bun run build
```

Then use the existing MCP Inspector/local Blockbench connection to check:

```text
model_creation_strategy {}
model_creation_strategy { format: "bedrock" }
model_creation_strategy { format: "bedrock", approach: "ui" }
model_creation_strategy { format: "bedrock", approach: "programmatic" }
model_creation_strategy { format: "bedrock", approach: "import" }
```

Proof should establish the returned prompt content/contract only. Do not turn
this into a broad Blockbench modelling test yet.

## Holds

- **G1:** source implemented; runtime proof can be covered by the same local
  prompt check.
- **G2:** source implemented; bundled Local prompt authority can be observed
  during the same local check.
- **G3 annotation forwarding:** paused.
- **G4 screenshot restoration:** hold for the later named multi-view capture
  slice.
- **G5 bone-rigging Undo preflight:** hold until hierarchy-path curation reaches
  that boundary.

## Later Order

After Slice A prompt behavior is locally proven:

```text
B targeted authored-element inspector
→ C simplified named multi-view capture
→ D safer Cuboid mutations + modify_cubes_batch
→ E Cuboid UV tools
→ F save/open proof and direct tools only if needed
→ resume G3 / remaining proven gaps
```

## Next Step

Run the **Slice A local prompt proof** above. Do not start Slice B until the
normal/default prompt output and explicit fallback behavior are confirmed.
