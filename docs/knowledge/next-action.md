# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling decisions evidence-backed instead of
  assumption-driven.
- **Status:** `REFERENCE_FIDELITY_OBSERVATION_SOURCE_IMPLEMENTED`.
- **Execution now:** ChatGPT → GitHub architecture/source work.
- **Local testing:** explicitly deferred by current user priority.
- **G3:** paused.

## Confirmed Failure Evidence

Prior modelling tests showed:

1. Cubes can be placed mainly because they fit/attach, then falsely treated as
   approval even when the whole object is visibly wrong;
2. rotations can become arbitrary/overcomplicated without a reference-visible
   slope/orientation reason;
3. pivots/origins can become abstract or distant because numeric fields are
   filled without a real joint/attachment/transform purpose.

Foundation, modelling skill, and Bedrock prompt rules are already hardened
against those behaviors.

## Reference Fidelity Loop v1

```text
APPROVED REFERENCE
↓
CROSS-VIEW CONSISTENCY
↓
COORDINATE FRAME + TARGET ENVELOPE
↓
NORMALIZED PRIMARY FORM HYPOTHESIS
↓
COARSE PRIMARY BLOCKOUT
↓
inspect_model_bounds
↓
capture_model_views
↓
REFERENCE ↔ MODEL COMPARISON
↓
GLOBAL OR LOCAL FAILURE?
  │
  ├─ GLOBAL → revise/rebuild primary hypothesis
  │
  └─ LOCAL → inspect exact authored state → causal correction
↓
FRESH AFFECTED EVIDENCE
↺ until primary form passes or hypothesis is abandoned
↓
SECONDARY GEOMETRY / HIERARCHY / TEXTURE / OPTIONAL ANIMATION
```

## Observation Layer — Source Implemented

### Shared bounds authority

`mcp/lib/renderedModelBounds.ts`

- uses official Blockbench `Cube.getGlobalVertexPositions()` after refreshing
  world matrices;
- observes visible Cube preview geometry through active world transforms;
- excludes hidden/non-rendered Cubes and reports them;
- returns `bounds=null` for empty/fully hidden Cube state;
- rejects generic `Mesh` elements in v1 instead of claiming incomplete Cube-only
  bounds are the whole model;
- has no fabricated fallback dimensions.

### `inspect_model_bounds`

`mcp/server/tools/project.ts`

Read-only active-project tool returning raw facts only:

```text
project identity
Cube/rendered/hidden counts
min / max / center
width / height / length
XZ footprint
animation + timeline context
warnings
```

No target evaluator, similarity score, PASS/FAIL, correction delta, or automatic
reanchor behavior.

### `capture_model_views`

`mcp/server/tools/camera.ts`

Public input:

```text
views: 1–5 unique values from
  front / back / left / right / top / bottom
  front_left_3q / front_right_3q

front_direction: +z | -z

framing:
  { mode: model }
  OR
  { mode: explicit, min, max }
```

Implemented behavior:

- active project only; no project switching;
- `framing=model` reuses `readRenderedModelBounds()`;
- `framing=explicit` uses the caller target envelope exactly and does not expand
  it to hide out-of-envelope geometry;
- principal views are true axis-aligned orthographic views;
- `front_direction` has no default;
- 3/4 views use stable front-relative perspective context;
- fixed 512×512 output and fixed 12% framing padding;
- labeled `VIEW <name>` text immediately precedes actual MCP image content;
- no custom camera, file output, texture/animation/particle variants,
  selected-element scope, similarity score, repair behavior, or automatic PASS.

### Offscreen implementation refinement

The original design proposed temporarily changing/restoring the selected preview
camera. Source inspection showed a smaller and safer Blockbench-native route:
canonical capture uses official `Screencam.NoAAPreview`, the same scratch
offscreen preview used by Blockbench advanced screenshots.

Therefore:

```text
active editor camera → never changed
active project       → never switched
selection/model      → never changed
offscreen preview    → resized/reoriented as scratch capture state
```

The tool refuses to run if the offscreen preview is unavailable or aliases the
active editor preview. Because the user-visible camera is never mutated, no
camera restoration transaction is needed. This implementation detail supersedes
the earlier design-only restore requirement while preserving the actual product
requirement: observation must be state-neutral for the active editor/model.

### Schema hardening

Local `createTool()` registers extracted Zod field shapes, so important public
validation is kept inside field schemas rather than top-level `.superRefine()`:

- `views` enforces uniqueness;
- explicit framing enforces `max > min` on X/Y/Z.

No factory/G3 change was required.

### Bedrock prompt routing

`mcp/prompts/bedrock.md` now routes whole-form evidence through:

```text
coarse blockout
→ inspect_model_bounds
→ capture_model_views
→ direct reference ↔ model comparison
```

When approved numeric target bounds exist, explicit framing prevents auto-framing
from hiding gross scale/placement drift.

## Evidence Status

**Static source/contract proof is available.**

Live claims remain `LOCAL PROOF REQUIRED` until the user later chooses Blockbench
runtime testing, especially:

- rendered bounds numerically match difficult animated/group-transform cases;
- canonical named views have the intended live orientation/framing;
- MCP client exposes inline image content to the vision-capable model;
- `Screencam.NoAAPreview` behaves as expected in the installed Blockbench build.

Local proof is not the current blocker.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- **G4 old screenshot project restoration:** do not patch separately; canonical
  fidelity capture avoids that project-switching path.
- **G5 bone-rigging Undo preflight:** held until hierarchy runtime work resumes.
- mutation batching, mutation safety, UV additions, save/open proof, and public
  surface reduction remain later slices.

## Do Not Reintroduce

- per-Cube approval/planning ceremony;
- first-Cube/support/section-first rules;
- automatic image→Cube conversion;
- SF3D/mesh decomposition;
- IoU/projection/similarity authority;
- all-in-one Bedrock builder;
- arbitrary rotation/pivot helpers;
- detail generation before whole-form pass;
- dynamic Rework profile/state/lease machinery.

## Next Step

Audit the **current authored-element read surface** before adding anything:
inspect `mcp/server/tools/element.ts` and relevant current resource/read helpers
to determine whether an existing focused operation already returns the exact
state needed after a visual mismatch:

```text
explicit element UUID/name
kind + parent
Cube from/to/size/origin/rotation/visibility
Group origin/rotation where applicable
```

If an existing read already satisfies this, reuse/improve it instead of adding a
new tool. If not, define and implement the smallest read-only `inspect_element`
contract. Do not add `modify_cubes_batch` or resume G3 in the same slice.
