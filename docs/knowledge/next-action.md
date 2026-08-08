# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve the main product issue: Blockbench MCP models can diverge
  grossly from the approved reference image/Modelling Brief even when MCP tools
  execute successfully.
- **Status:** `MCP_REFERENCE_FIDELITY_ROOT_CAUSE`.
- **Execution now:** architecture/root-cause discussion through ChatGPT → GitHub.
- **Local testing:** not the current focus; do not make Slice A local proof the
  next task unless the user explicitly changes priority.
- **G3:** paused.
- **Primary review:** `docs/knowledge/reviews/mcp-reference-fidelity-root-cause.md`.

## Current Diagnosis

The dominant failure is not lack of Cube mutation APIs. It is a missing visual
control loop between reference understanding and exact numeric Cuboid edits.

```text
Reference / Modelling Brief
↓
qualitative visual understanding
↓
MISSING: stable Primary Form Hypothesis
↓
agent invents exact from/to/origin/rotation
↓
MCP faithfully executes those numbers
↓
weak/non-standardized visual observation
↓
agent may rationalize or micro-patch the wrong whole form
```

Historical Zebra evidence already showed that structurally valid/connected
Cuboids and fluent review text could still produce a visibly incorrect model.

## Important Distinction

- **MCP** should remain actuator + state/evidence provider.
- **Vision-capable agent** owns visual/model judgement.
- Do not try to make MCP infer semantic 3D form directly from pixels.
- Do not use similarity/IoU/projection scoring as modelling authority.
- Do not return to locked per-Cube plans, section-first construction, or
  all-in-one model builders.

## Proposed Visual Control Loop

```text
approved reference
→ reference readiness check
→ Primary Form Hypothesis
→ bounded primary Cuboid build
→ canonical requested model views
→ direct vision comparison
→ concrete mismatch(s)
→ targeted authored-state inspection
→ coherent batch correction
→ fresh affected views
↺ until primary form passes or hypothesis is replaced
→ secondary geometry / hierarchy / texture / optional animation
```

## Primary Form Hypothesis Boundary

This is a **temporary modeller hypothesis**, not a geometry blueprint or validator.

It may contain:

- overall envelope/requested dimensions;
- primary masses only;
- approximate relative size and placement;
- important orientation/slopes;
- major contacts/attachments;
- relevant view constraints.

It must not become:

- locked Cube transforms/counts;
- image-pixel calibration;
- similarity targets;
- universal anatomy/build order;
- per-Cube approval ceremony.

## Root Causes Ranked

1. **No stable whole-form spatial hypothesis before exact numeric mutations.**
2. **No deterministic canonical multi-view observation surface.** Current
   screenshot behavior depends too much on current camera/framing/state.
3. **No focused authored-element inspection** for exact Cube/group state after a
   visual mismatch is identified.
4. **No simple heterogeneous batch correction** for several responsible primary
   masses in one recoverable edit.
5. **Reference quality can still fail** when generated views are inconsistent or
   not intentionally Cuboid-buildable.
6. **Normal public MCP surface is broader than the Bedrock modelling problem,**
   increasing tool/context noise.

## Slice A Status

Goal-oriented prompt routing is implemented in source and remains useful, but it
is **not sufficient** to solve fidelity by itself. It improves reasoning order but
does not close the visual→numeric→feedback gap.

Do not make its local proof the current project blocker.

## Revised Capability Priority

Because the main issue is gross visual mismatch, revise the previous order:

```text
P0  simplified canonical capture_model_views
P1  targeted inspect_element / authored element resource
P2  simple modify_cubes_batch
P3  focused mutation safety improvements
P4  static/default Bedrock public-surface curation
```

### P0 — `capture_model_views`

Recover only the useful core from Sample:

- named front/back/left/right/top/bottom/3/4 views;
- orthographic principal views + perspective 3/4;
- auto-frame current geometry or selected scope;
- capture only requested views;
- restore project/camera/selection/state in `finally`;
- return visual evidence + simple metadata;
- no automatic resemblance score.

This now ranks before the element inspector because stable visual observation is
required before a correction can be diagnosed correctly.

## Holds

- **G1/G2:** source corrections remain implemented; local proof deferred.
- **G3 annotations:** paused until the intended modelling surface is settled.
- **G4 screenshot restoration:** should fold into canonical multi-view capture
  rather than be patched separately if that design is approved.
- **G5 bone-rigging Undo preflight:** hold until hierarchy path is reached.
- save/open direct tools remain proof-first, not the active issue.

## Next Step

Discuss and approve/refine the **Visual Control Loop**, especially the Primary
Form Hypothesis and canonical multi-view evidence design. Do not implement the
next runtime capability until that architecture is clear enough to avoid another
wrong-direction tool patch.
