# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** curate the Blockbench MCP **tools, resources, and prompts** before
  continuing G3, so the default surface has clear modelling goals and directly
  supports the whole-form-first Minecraft Bedrock Entity workflow.
- **Status:** `MCP_SURFACE_CURATION`.
- **Execution now:** ChatGPT → GitHub research/review only.
- **Runtime changes now:** none until the curation decision is complete.
- **Sources to compare:** current `Local`, historical `Rework`, external/reference
  `Sample`, and the upstream `jasonjgardner/blockbench-mcp-project` skill surface
  referenced by the user.

## Review Lenses

Use existing project owners rather than inventing another skill:

- `development-brief` → keep goal/scope/acceptance bounded;
- `blockbench-bedrock-modelling` → judge whether a capability materially helps
  produce a coherent, editable, visually-correct Bedrock model;
- `mcp-server-development` → judge whether tools/resources/prompts expose the
  right MCP contract once the modelling need is proven.

The architecture remains frozen. This review does **not** authorize a new skill,
framework, production director, state machine, or broad Rework/Sample merge.

## Curation Question

Do not ask "what tools can Blockbench expose?" Ask:

```text
What modelling decision/stage does this capability serve?
Does it reduce churn or improve evidence/recoverability?
Does it preserve modeller judgement instead of pretending to be vision?
Is the same goal already served by a smaller existing capability?
Should it be default, conditional, read-only evidence, or last-resort fallback?
```

## Target Workflow

Curate against this current Local sequence:

```text
orient / open project
→ understand current model state
→ whole-form primary Cuboid pass
→ primary visual gate
→ targeted geometry correction
→ secondary hierarchy / pivots
→ full geometry review
→ UV / texture
→ optional animation
→ final structural + visual proof
→ save .bbmodel
```

No per-Cube ceremony, section-first orchestration, numeric resemblance authority,
or generic mesh/Hytale/PBR expansion is required for the default Bedrock path.

## Classification

For every useful capability found in Local/Rework/Sample/upstream, classify:

```text
KEEP        current Local capability is already correctly scoped
IMPROVE     keep capability but clarify/strengthen its contract
ADD         genuinely missing capability with distinct modelling value
MERGE       useful behavior belongs in an existing capability
HIDE        keep available but remove from normal/default modelling path
DROP        no current value or actively misdirects the product
PROOF FIRST existing capability may already solve the need; test before adding
```

Evaluate **tools, resources, and prompts separately**. A workflow problem should
not automatically become a new mutation tool.

## Completed Corrections Before Curation

### G1 — Bedrock Entity default/recommended path

Source implemented; `LOCAL PROOF REQUIRED` later.

### G2 — Local bundled prompt authority

Source implemented; `LOCAL PROOF REQUIRED` later.

Current prompt precedence:

```text
user override
→ bundled Local prompt
→ optional remote/cache fallback for Local-missing names
→ empty
```

## Paused Corrections

### G3 — MCP annotation forwarding

Demonstrated source gap, but **paused by current user instruction** until surface
curation determines which tools should be part of the intended public/default
surface. Do not implement yet.

### G4 — screenshot project-state restoration

Demonstrated source gap; hold until curation completes.

### G5 — bone-rigging preflight before Undo

Demonstrated source gap; hold until curation completes.

## Known Local Surface Baseline

Current Local already includes, among others:

- project creation/orientation;
- Cuboid placement/modification;
- groups/outline/search/selection;
- hierarchy/pivot operations through current group/bone surfaces;
- undo/redo/history/checkpoints;
- screenshots and camera angle control;
- texture/paint/UV operations;
- optional animation;
- export;
- validator resources;
- broad mesh/Hytale/PBR/UI/eval capabilities inherited from upstream.

Do not assume broad availability means those capabilities belong in the default
Bedrock modelling path.

## Research Boundary

1. Inventory Local by **modelling goal**, not by source filename.
2. Inspect Rework for capabilities with unique evidence/recovery/inspection value;
   do not restore its heavy orchestration/state machinery.
3. Inspect Sample for focused capabilities such as preflight, recovery,
   transaction safety, targeted inspection, camera/evidence, or save/open behavior;
   do not import Sample multi-window/host policy without a new requirement.
4. Inspect the user-provided upstream skill/project surface and retain only ideas
   that improve the current Bedrock workflow.
5. Produce one bounded curation matrix and recommended minimal target surface
   **before changing runtime code**.

## Local-Proof Holds

- save/reopen `.bbmodel` remains `PROOF FIRST`;
- orthographic/3/4 camera semantics remain `PROOF FIRST`;
- G1/G2 runtime behavior remains `LOCAL PROOF REQUIRED`.

## Next Step

Complete the Local/Rework/Sample/upstream comparison and produce the curated
**KEEP / IMPROVE / ADD / MERGE / HIDE / DROP / PROOF FIRST** matrix for tools,
resources, and prompts. Then choose exactly one first implementation slice based
on modelling impact, not framework convenience.
