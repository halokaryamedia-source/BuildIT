# BlockIT — Visual Validation

**Status:** Active Policy  
**Version:** 1.3  
**Updated:** 2026-08-08

## Purpose

Define the minimum evidence required before BlockIT claims that a Blockbench
model visually matches the requested scope.

Reference preparation belongs to [04-reference-guide.md](04-reference-guide.md).
This note validates the Blockbench result.

## Core Principle

**Structural success is not visual success.**

None of these proves resemblance by itself:

- successful MCP/tool call;
- all Cubes existing;
- Cubes touching/overlapping;
- valid `from/to/origin/rotation` values;
- valid hierarchy/parenting;
- matching global bounds;
- saved/reopenable file;
- linked UV/texture data;
- numeric similarity/IoU/projection score.

Visual `PASS` requires fresh current-revision visual evidence compared directly
with the active Modelling Brief.

## Visual Verdict Contract

Every material visual gate must end in exactly one state:

```text
FAIL
UNVERIFIED
PASS
```

### FAIL

Use when any critical or major mismatch is visible in an applicable criterion. The review must name the mismatch and the corresponding reference/model evidence.

### UNVERIFIED

Use when evidence needed for the claim is missing or insufficient. Examples include missing side/depth reference evidence, materially conflicting views, or an unavailable current model capture. Missing evidence is not a visual pass.

### PASS

Use only after fresh current-revision model images were directly compared with the corresponding reference view(s), a difference-first review checked the applicable silhouette/proportion/placement/orientation/contact criteria, and no critical or major mismatch was found.

A claim may be narrower than the whole model. For example, a front silhouette can pass while depth remains UNVERIFIED. Do not upgrade a partial-view success into a full 3D PASS.

### Difference-first review

Before approval, actively search for mismatch in each relevant paired view:

```text
REFERENCE VIEW ↔ MODEL VIEW
silhouette difference
primary proportion difference
primary placement difference
orientation / slope difference
visible contact difference
severity: critical / major / minor / none
```

Only after this mismatch search may the reviewer choose PASS. Generic positive language is not a substitute for this comparison.

## Evidence Types

### Structural Evidence

Examples:

- element UUIDs;
- authored transforms;
- hierarchy/parent state;
- rendered global envelope;
- save/runtime state.

Structural evidence answers **what state exists**, not whether it looks right.

### Visual Evidence

Fresh model images from the current revision, in views that correspond to the
reference question being evaluated.

Visual evidence answers **whether the form reads correctly**.

### Runtime Evidence

Live proof of Blockbench/MCP behavior such as camera/render transport, Undo,
project switching, animation, save/reopen, or persistence.

Static GitHub source is not runtime evidence.

## Current Local Observation Instruments

Current Local source includes:

### `inspect_model_bounds`

Returns raw rendered whole-Cube envelope facts such as size/center/ground context.

Use it to detect catastrophic scale/displacement issues that camera framing could
hide. It is not a visual validator.

### `capture_model_views`

Produces named canonical model images for explicit front direction and stable
reference ↔ model comparison.

Principal views are orthographic comparison evidence; 3/4 views are volume/
readability context. Successful capture is not `PASS`.

### `inspect_element`

Returns exact authored Cube/Group state for a diagnosed local target. Use it
before numeric local correction rather than guessing current transforms from a
screenshot or memory.

These are source-implemented capabilities. Their live integration/image delivery
still remains `LOCAL PROOF REQUIRED` until tested locally.

## Reference ↔ Model View Pairing

Compare like with like:

```text
REFERENCE FRONT ↔ MODEL FRONT
REFERENCE SIDE  ↔ MODEL SIDE
REFERENCE TOP   ↔ MODEL TOP
REFERENCE 3/4   ↔ MODEL matching 3/4
```

View identity must be explicit. Do not silently compare mismatched front/back or
left/right interpretations.

Do not require every view after every mutation. Capture the smallest view set
that can answer the current modelling question.

## Cross-View Validity

A whole-form verdict must cover the views/axes that the claim actually depends on.

```text
front PASS + side FAIL        -> whole-form FAIL
front PASS + side unavailable -> whole-form UNVERIFIED for depth/side claims
front PASS + conflicting side/top reference -> BLOCKED if the conflict materially affects primary form and cannot be resolved
```

Do not promote the strongest-looking view to represent the whole 3D model. For each material mismatch/approval, name the paired view that supports it and keep unsupported axes provisional or unverified.

### Blocked validation

`BLOCKED` is not a visual quality grade. It means a valid visual verdict cannot currently be reached without missing evidence, resolving a material reference conflict, or restoring a required runtime capability.

When blocked, stop speculative corrections and report:

```text
blocker category
evidence
claim/result that cannot be validated
bounded attempts already made
exact requirement to unblock
```

If the same causal correction direction fails twice without new evidence, treat continued patching as a loop and stop. Do not manufacture a success report from repeated attempts.

## Structural Envelope Gate

When approved numeric target bounds exist:

1. inspect current rendered bounds;
2. compare width/height/length/center/ground with the target envelope;
3. use explicit target-envelope framing for visual capture where appropriate.

This prevents auto-framing from hiding scale/offset failure.

Matching bounds remain **structural evidence only**.

## Gate 1 — Primary Whole Form

Before secondary/detail work, check:

- recognizability;
- global silhouette;
- major proportions;
- primary mass placement;
- important orientation/slopes;
- major visible contacts.

For a material mismatch, identify:

```text
failed criterion
responsible mass/relationship when known
observed mismatch
reference/model view(s)
severity: critical | major | minor
```

Statements such as “looks good”, “everything is attached”, or “all Cubes are
present” cannot produce `PASS`.

### Hard Rebuild Threshold

Reject/rebuild the primary scaffold when:

- the intended object is not recognizable;
- several primary relationships fail together;
- repair would require detail/compensating geometry to hide a wrong whole form.

Do not micro-patch a globally wrong scaffold because work has already been spent
on it.

## Gate 2 — Complete Geometry

After secondary geometry/hierarchy/pivots, review applicable criteria:

- silhouette/proportions across the declared reference views;
- required major parts and orientation;
- depth/footprint where reference evidence exists;
- coherent visible attachments;
- rotations that correspond to visible form/motion;
- meaningful pivots corresponding to actual transform/joint/attachment needs;
- no arbitrary distant pivot;
- no major unnecessary/intersecting/inverted geometry;
- hierarchy supporting intended editability/motion.

## Gate 3 — Texture

Only when texture is in scope:

- UV orientation/alignment;
- material/pattern direction;
- pixel-density consistency where applicable;
- missing/broken surfaces;
- identity/readability.

Texture cannot approve or conceal wrong primary geometry.

## Gate 4 — Animation

Only when animation is required:

- pivot arcs;
- hierarchy behavior;
- clipping/detachment;
- intended motion/readability;
- return/neutral behavior when relevant.

A static pivot that creates an implausible motion arc is not approved.

## Gate 5 — Final Review

Use evidence from the **current saved/release candidate**. Do not reuse older
screenshots after material geometry/pivot/hierarchy/texture/animation changes.

## Visual Repair Loop

```text
Fresh paired reference/model evidence
↓
Name concrete mismatch
↓
GLOBAL or LOCAL?

GLOBAL
→ revise/rebuild Primary Form Hypothesis

LOCAL
→ locate exact UUID
→ inspect_element
→ choose causal correction
→ mutate bounded relationship
→ fresh affected view(s)
```

### Causal Correction

Use:

`TRANSLATE`, `RESIZE`, `ROTATE`, `REATTACH`, `SPLIT`, `MERGE/REMOVE`, `ADD MASS`.

Do not default to adding another Cube.

For one multi-Cube relationship, `modify_cubes_batch` may execute different
exact-UUID corrections as one recoverable operation. It does not plan or judge
the correction.

## Rotation Review

For a material rotation, answer:

- Which reference/form/motion evidence justifies the angle?
- Is the rotated mass improving the intended silhouette rather than compensating
  for wrong placement/size?
- Is the rotation simpler/more coherent than an unnecessary stepped
  approximation?
- Did it damage visible contacts/global bounds?

A newly created non-zero-rotation Cube must have an intentional explicit pivot;
this source-level safety does not itself prove the pivot is visually correct.

## Pivot Review

For a meaningful pivot, answer:

- What rotation/joint/attachment/parent-transform purpose does it serve?
- Is it near the intended transform relation rather than a random distant point?
- Does its transform preserve visible attachment/articulation?

### Pivot-only Cube correction

If geometry is already correct and only pivot is wrong, Local uses Cube
pivot-transfer semantics so the pivot can change without intentionally moving the
visual Cube.

### Group pivot

Group/bone pivot changes use Blockbench transfer-origin semantics in the hardened
`bone_rigging` path.

Both behaviors are source implemented; live behavior still requires local proof.

## Severity

### Critical

Makes the model unusable, unrecognizable, or materially different from the
requested target.

### Major

Strongly reduces reference fidelity, readability, attachment, or required
function.

### Minor

Does not block intended use.

Critical/major issues block visual completion.

## Evidence Economy

Good reasons to capture:

- primary whole-form gate;
- complete-geometry gate;
- one targeted correction;
- texture/animation gate;
- final current-revision gate.

Bad reasons:

- after every Cube/tool call;
- to prove that a Cube was technically created;
- to create evidence volume without a decision it informs;
- repeat unchanged views after the criterion is already established.

More screenshots are not automatically more proof.

## Completion Rule

Visual `PASS` is valid only when current-revision images were actually inspected
against the relevant criteria.

Invalid approval justifications include:

```text
all Cubes are present
all Cubes are attached
tool calls succeeded
coordinates are valid
bounds match
hierarchy is valid
rotation/pivot values exist
validator has no error
```

## Execution-Channel Boundary

### ChatGPT → GitHub

May review/change source/docs and establish static contracts. Cannot claim live
Blockbench visual/runtime success.

### Codex Local

Blockbench + MCP is the final environment for proof requiring actual image
transport, camera behavior, model appearance, animation, Undo, or persistence.

If that proof is unavailable, report `LOCAL PROOF REQUIRED` / user-facing
`Perlu pemeriksaan` rather than inventing a substitute.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Validation Report](validation-report.md)
- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)
