# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** audit the current `Local` MCP implementation against the cleaned
  BlockIT modelling workflow and identify only demonstrated implementation gaps.
- **Status:** `MCP_IMPLEMENTATION_AUDIT`.
- **Execution now:** ChatGPT → GitHub.
- **Final runtime proof later:** Codex local from root `BuildIT` with Blockbench +
  MCP when a finding actually requires live proof.

## Completed Boundary

Skill consolidation is **frozen**.

Canonical root skills:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
blockbench-bedrock-modelling
```

Non-skill owners:

- Reference Generator → `docs/foundation/04-reference-guide.md` on an
  image-capable surface.
- Evidence-status escalation → root `AGENTS.md`.

`mcp/.agents/skills/` and `mcp/.github/skills/` are retired legacy locations.
Do not reopen historical skill recovery or rename/merge/add skills unless the
current MCP audit proves a distinct ownership/capability gap.

## Audit Contract

Use `.agents/skills/development-brief/SKILL.md` for any implementation change.
During the audit itself, inspect before editing.

Compare current MCP source against only the relevant current authorities:

- `docs/foundation/02-product-requirements.md`;
- `docs/foundation/03-modelling-workflow.md`;
- `docs/foundation/05-geometry-standard.md`;
- `docs/foundation/06-texture-standard.md` when texture behavior is relevant;
- `docs/foundation/07-visual-validation.md` when camera/evidence behavior is
  relevant;
- `mcp/AGENTS.md`, `mcp/README.md`, and affected implementation source.

For each finding record:

```text
Observed behavior/source:
Expected current behavior:
Owner:
Why it matters:
Evidence status:
Smallest correction if required:
Required proof:
```

## Audit Priorities

1. Determine whether the current tool/runtime surface supports the cleaned
   **whole-form-first Bedrock Cuboid workflow** without requiring historical
   section/support/per-Cube ceremony.
2. Inspect only implementation areas that materially affect modelling:
   project/open-save flow, Cuboid/group mutation, hierarchy/pivots, history/undo,
   camera/screenshot/visual evidence, texture/UV, animation when relevant, and
   MCP result/error behavior around those operations.
3. Separate modelling-judgement gaps from MCP contract gaps and Blockbench
   runtime/API gaps. Do not solve a modeller-reasoning problem by adding a tool.
4. Treat broad mesh/Hytale/general-purpose capability as existing upstream
   surface unless it actively conflicts with the Local Bedrock workflow; do not
   delete breadth merely for aesthetic purity.
5. Do not add tests, transactions, rollback systems, tools, schemas, abstractions,
   or docs until a concrete finding proves they are needed.

## Evidence Rule

ChatGPT → GitHub can prove source structure/contracts only. Use root evidence
status when needed:

- `CURRENT-PROJECT VERIFIED`
- `OFFICIALLY VERIFIED`
- `LOCAL PROOF REQUIRED`
- `UNSUPPORTED`
- `UNKNOWN`

A live Blockbench/visual/session claim cannot become `CURRENT-PROJECT VERIFIED`
from static GitHub inspection alone.

## Out Of Scope During Audit

- model-specific Zebra/Rhino fixes;
- mass MCP rewrite or Sample/Rework merge;
- new skill architecture;
- speculative multi-window/host/auto-port behavior;
- broad test/CI framework creation;
- full GSD/OpenSpec frameworks;
- Claude-Mem or unrelated tooling.

## Exact Next Step

Start the MCP implementation audit from the **current modelling-critical surface**:
read `mcp/AGENTS.md`, `mcp/README.md`, `mcp/package.json`, tool registration, and
the project/Cuboid/group/history/camera/texture owners needed to trace one normal
Bedrock modelling path. Produce a bounded gap list before changing runtime code.
