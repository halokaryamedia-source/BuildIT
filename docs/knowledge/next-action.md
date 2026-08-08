# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling decisions evidence-backed instead of
  assumption-driven.
- **Status:** `REFERENCE_FIDELITY_RULES_HARDENED`.
- **Execution now:** ChatGPT → GitHub architecture/contract work.
- **Local testing:** explicitly deferred by current user priority.
- **G3:** paused.
- **Primary review:** `docs/knowledge/reviews/mcp-reference-fidelity-root-cause.md`.

## Confirmed Failure Evidence

Prior modelling tests repeatedly showed:

1. the agent can place Cubes mainly because they can be made to fit/attach, then
   treat "all Cubes are placed" as approval even when the model is visibly far
   from the reference;
2. rotation values can become arbitrary/overcomplicated without a clear visible
   slope/orientation reason;
3. pivot/origin values can become abstract or distant because they are filled as
   numeric fields instead of being chosen from a real joint/attachment/transform
   relationship.

These are now treated as confirmed product failure patterns.

## Hardened Reference Fidelity Rules

Canonical owners have been updated:

- `docs/foundation/03-modelling-workflow.md` → workflow v1.2;
- `docs/foundation/05-geometry-standard.md` → geometry v1.2;
- `docs/foundation/07-visual-validation.md` → validation v1.2;
- `.agents/skills/blockbench-bedrock-modelling/SKILL.md`;
- `mcp/prompts/bedrock.md`;
- `docs/knowledge/reviews/mcp-reference-fidelity-root-cause.md`.

### Before exact Cube transforms

The modeller must establish:

```text
cross-view consistency
→ coordinate frame/front/ground
→ target envelope when available
→ normalized Primary Form Hypothesis
```

For each primary mass the hypothesis records only:

```text
role
relative size
relative center/placement
important orientation/slope
major contact/attachment
supporting reference view(s)
uncertainty when evidence is weak
```

This is temporary modeller reasoning, not a locked per-Cube plan, pixel
calibration, or geometry authority.

### Placement rule

A Cube is not justified because it:

```text
exists
fits somewhere
touches another Cube
overlaps another Cube
has a valid parent
tool call succeeded
```

Each important primary Cube must implement a known mass role or necessary split
supported by the reference/spatial hypothesis.

### Rotation rule

Rotation requires a concrete reason:

- visible reference slope/orientation;
- simpler coherent silhouette than stepped Cuboids; or
- required articulation/motion.

Do not use arbitrary multi-axis rotation, copied fixture angles, or rotation to
compensate for wrong size/placement.

### Pivot rule

A meaningful pivot requires a concrete:

- rotation center;
- joint/articulation;
- attachment; or
- parent/group transform purpose.

Arbitrary/distant pivots and pivots filled only because the schema exposes
`origin` are not accepted modelling decisions.

### Primary approval rule

`PASS` cannot be based on:

```text
all Cubes are placed
all parts are attached
coordinates/hierarchy are valid
rotation/pivot values exist
validator returned no error
```

If the object is unrecognizable or several primary relationships fail together,
**invalidate/revise the Primary Form Hypothesis and coarse blockout** rather than
micro-patching it.

### Correction rule

Classify before mutating:

```text
TRANSLATE
RESIZE
ROTATE
REATTACH
SPLIT
MERGE/REMOVE
ADD MASS only when a visible volume is genuinely missing
```

Do not default to adding another Cube.

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
STRUCTURAL ENVELOPE OBSERVATION
↓
CANONICAL MODEL VIEWS
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

## Current Runtime Gap Exposed By The Rules

The policy is now stricter than the current observation surface. Two small
read-only instruments need a concrete MCP contract before implementation:

### `inspect_model_bounds`

Must provide enough structural evidence to detect gross scale/position/ground
failure that auto-framing can hide. It must not provide a visual score or PASS.

Candidate evidence:

```text
min/max
size: width/height/length
center
ground/min-Y relation
current project/front-orientation metadata where reliably available
comparison with caller-supplied/known target envelope when appropriate
```

### `capture_model_views`

Must provide stable requested model views for direct reference comparison:

```text
named requested views
principal orthographic views
3/4 perspective where requested
stable framing metadata
actual image content
restore prior project/camera/selection state
```

It must not perform similarity scoring or automatic visual approval.

## Holds

- **G1/G2:** source corrections remain implemented; local proof deferred.
- **Slice A:** goal-oriented prompt source remains implemented; local proof is not
  the active blocker.
- **G3 annotations:** paused.
- **G4 screenshot restoration:** should be solved as part of canonical capture
  state restoration rather than as an isolated patch.
- **G5 bone-rigging Undo preflight:** held until hierarchy runtime work resumes.
- `inspect_element`, `modify_cubes_batch`, mutation safety, UV additions, and
  public-surface reduction come **after** the observation layer is defined.

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

Define the **minimal read-only observation contract** for
`inspect_model_bounds` + `capture_model_views`: exact inputs, outputs, state-
restoration behavior, and what each capability is explicitly forbidden from
claiming. Do not implement mutation tools or resume G3 before that contract is
clear.
