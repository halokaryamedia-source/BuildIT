---
name: blockbench-bedrock-modelling
description: Specialist for creating or revising Minecraft Bedrock Entity models in Blockbench from an approved Model Reference. Use when the primary problem is whole-form interpretation, Cuboid geometry, proportions, silhouette, hierarchy/pivots for the asset, geometry-vs-texture decisions, UV/texture scope, required animation, or visual correction of the model itself. Do not use for Blockbench plugin/runtime API failures, MCP server contracts, Bun tooling, TypeScript type-system issues, or reference-image generation.
---

# Blockbench Bedrock Modelling

Own the **modeller judgement** required to turn an approved Model Reference into
a coherent, editable Minecraft Bedrock `.bbmodel`.

This skill decides **what the model should become**. It does not own the
Blockbench API/runtime mechanics used to apply those decisions. For actual MCP
workflow orchestration, load `blockit-bedrock-entity-mcp`; route surface execution
to `blockit-bedrock-texturing` and animation execution to
`blockit-bedrock-animation` when those domains enter scope.

## Use This Skill For

- interpreting an approved reference as one coherent 3D form;
- stabilizing a coordinate frame and temporary Primary Form Hypothesis before
  exact Cuboid transforms;
- deciding primary/secondary Cuboid masses and their relationships;
- silhouette, proportion, orientation, width/depth/footprint, and visible contact
  correction;
- deciding when rotation is visually/functionally justified;
- deciding hierarchy/pivots from real attachment/articulation/transform needs;
- deciding whether a visible feature belongs in geometry or texture;
- UV/texture scope and visual material/readability decisions;
- required animation from a modelling/rigging standpoint;
- deciding whether the current model is visually good enough to continue or
  complete.

## Do Not Use It For

- generating/preparing the Source Image or five-view reference package;
- MCP tool/resource/prompt/input/result contracts → `mcp-server-development`;
- Blockbench plugin lifecycle, UI, permissions, or API mechanics →
  `blockbench-runtime-development`;
- Bun build/package behavior → `bun-tooling`;
- TypeScript compiler/type-system failures → `typescript-type-safety`;
- unrelated engines, Hytale production, generic mesh sculpting, or realistic
  rendering; native Bedrock texture/PBR/material-instance execution routes to
  `blockit-bedrock-texturing` after modelling judgement is settled.

A modelling task can call working MCP tools without loading the runtime
specialist. If modelling is blocked by a **proved Blockbench runtime/API defect**,
stop the modelling path and treat that defect as a separate runtime-development
problem rather than stacking specialists or inventing a workaround.

## Authority

Use the repository as the modelling memory. Read only what the active stage
needs:

- `docs/foundation/03-modelling-workflow.md` — canonical whole workflow;
- `docs/foundation/04-reference-guide.md` — reference authority/handoff when
  reference ambiguity matters;
- `docs/foundation/05-geometry-standard.md` — geometry/rotation/pivot decisions;
- `docs/foundation/06-texture-standard.md` — UV/texture work when in scope;
- `docs/foundation/07-visual-validation.md` — visual gates/evidence.

Do not load every foundation document on every small correction. Actual MCP and
Blockbench capability remains source/runtime truth; historical skill examples do
not guarantee a tool exists or behaves the same way now.

## Modelling Contract

Before construction, establish only what materially affects the asset:

- intended object and Bedrock Entity target;
- approved Model Reference;
- approved numeric dimensions when relevant;
- coordinate frame/front/ground convention when it affects placement;
- texture style/scope;
- animation requirement;
- current model state when revising an existing asset.

The user does not need to provide Cube counts, transforms, hierarchy, pivots, or
professional modelling terminology.

Treat the reference as a **visual modelling brief**, not pixel calibration.
When dimensions are approved, use `1 block = 16 Blockbench units`; choose the
individual geometry from those dimensions plus visible cross-view proportions.

## Procedure

### Tool Lane Discipline

For normal reference-driven modelling, keep the active execution set small. Use project/orientation discovery, Cube/Group authoring, deterministic whole-form observation, exact element inspection, bounded correction, recovery, and final export. Do not explore or invoke texture/Paint, animation, material-instance, Locator, selection, duplicate, validator, or export tools merely because they appear in the MCP catalog.

A branch is justified only by the active modelling decision:

- `duplicate_element` requires already-established repetition/symmetry; it must not generate a primary hypothesis by copying an arbitrary part;
- selection tools are editor-state helpers, not geometry identity or modelling evidence;
- `capture_screenshot` is secondary to `capture_model_views` for reference fidelity and is used only when the current editor view answers a question canonical views cannot;
- validator output may reveal structural issues but never decides resemblance;
- texture/Paint begins only after geometry is coherent enough for its gate;
- animation begins only when requested and after required hierarchy/pivots are coherent;
- export is a completion/artifact action, not a validation loop step.

If no current decision requires a branch, stay in the geometry lane instead of searching for another tool that might make the model look more complete.

### 1. Check Reference Consistency And Coordinate Frame

Before exact geometry:

- verify the required views describe one compatible object;
- establish `X = width`, `Y = height`, `Z = length/front-back`;
- make front direction explicit when it matters;
- establish the ground relationship and approved overall envelope when known;
- do not silently mirror, swap front/back, or average materially conflicting
  views into guessed coordinates.

For each important axis/relationship, know which reference view(s) actually
support it. Missing evidence is uncertainty, not permission to invent false
precision.

### 2. Build A Temporary Primary Form Hypothesis

Reason about the object before local detail and before exact Cube transforms.
For primary masses only, establish:

```text
role / semantic mass
relative size within the whole envelope
relative center/placement
important orientation/slope
major contact/attachment
supporting reference view(s)
uncertainty where applicable
```

Approximate normalized ratios or qualitative placement are acceptable internal
reasoning. They are not image-pixel measurements.

Do not produce a locked per-Cube plan. Do not impose support-first,
section-first, largest-first, anatomy templates, fixed Cube count, or exact
transform approval.

The purpose is to stop the direct jump:

```text
"I see a body/head/handle/etc."
→ arbitrary from/to/origin/rotation
```

Exact Blockbench transforms should be derived from a coherent primary-mass
hypothesis, not guessed independently per Cube.

### 2A. Build A Small Axis Evidence Map

Before exact primary Cube extents, separate what the reference actually proves from what the modeller merely needs to hypothesize. For each material primary mass/relationship, track only the relevant claims:

```text
claim / axis
supporting reference view(s)
state: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Apply the states as follows:

- **SUPPORTED** — relevant view(s) visibly constrain the dimension, placement, orientation, or contact.
- **PROVISIONAL** — a temporary working value is needed for the 3D blockout but current evidence is weak/incomplete.
- **CONFLICTING** — relevant views materially disagree.
- **UNAVAILABLE** — the package does not show the claim well enough to judge it.

Do not transfer confidence across axes. A convincing front silhouette does not validate depth. A strong side view does not prove hidden width detail. A 3/4 view is useful context but must not override clearer orthographic evidence.

If a material primary-form conflict cannot be resolved from the approved brief or explicit user intent, do not average the views or pick whichever is easiest to model. Enter the workflow `BLOCKED` state described below and report the exact conflict.

### 3. Build The Coarse Primary Geometry Pass

Create the **minimum coherent whole form** needed for recognizability.

- establish all important primary masses before polishing one local area;
- every primary Cuboid must implement a known mass role or necessary split;
- never place a Cube merely because it can touch/overlap/attach to another Cube;
- use axis-aligned geometry when it expresses the mass correctly;
- rotate only when a supporting reference view shows a meaningful slope/
  orientation or required motion needs it;
- do not use rotation to compensate for wrong size or placement;
- preserve major contacts/relationships visually, not merely numerically;
- use bounded batches when they reduce tool churn and remain safe to recover;
- defer small details, UV polish, and cosmetic geometry.

A successful tool call, valid coordinates, connected Cubes, hierarchy, or
technical overlap does not mean the shape is correct.

### 4. Run Structural Envelope + Primary Visual Gate

When the required runtime capability exists, check overall model bounds/ground
against approved dimensions before allowing camera framing to hide gross scale
errors. Structural envelope evidence cannot prove resemblance.

Then use only fresh model views needed to answer the current whole-form question.
Compare them with corresponding reference views and check:

- recognizability;
- global silhouette;
- major proportions;
- primary mass placement;
- important orientation/slopes;
- visible primary contacts/attachments.

`PASS` cannot be justified by "all Cubes are placed", "everything is attached",
"coordinates are valid", or "the tool succeeded".

#### Placement Execution Is Not Geometry Approval

Treat every successful `place_cube`, `modify_cube`, or `modify_cubes_batch` call as **execution evidence only**. It proves that Blockbench accepted the authored state; it does not prove that the chosen mass, size, position, depth, rotation, contact, or silhouette is correct. Cube mutation results use `visual_verdict: not_evaluated` for this reason.

Do not continue with another Cube merely because the previous placement succeeded. Every additional primary Cube must still be justified by a primary mass or necessary split that remains unrepresented in the current Primary Form Hypothesis.

Once the currently hypothesized primary masses are represented well enough to judge the whole form, **stop adding geometry** and run the primary visual gate before any secondary/detail pass. Do not use extra detail, bevel-like stepped Cubes, texture, or decorative parts to make an unverified primary scaffold look more finished.

If the primary gate returns:

```text
FAIL       revise/rebuild the responsible primary mass relationships before adding detail
UNVERIFIED keep unsupported axes/relationships provisional; do not claim them correct
PASS       only then continue to secondary geometry
```

When one axis such as depth is weakly supported, a provisional working extent may be necessary to create a 3D blockout, but it remains a hypothesis. Do not convert that provisional value into reference-backed certainty simply because `place_cube` accepted it.

#### Mandatory Reference Fidelity Verdict

Do not begin a visual gate by asking whether the model "looks good". Begin by actively searching for differences between each relevant reference view and the matching fresh model view.

Every material whole-form visual gate must end in exactly one state:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — any critical or major mismatch is visible. Name the mismatch, responsible mass/relationship when known, severity, and the reference/model view that demonstrates it.
- **UNVERIFIED** — evidence is missing or insufficient for the claim. Missing side/depth/top evidence, conflicting reference views, or an unavailable current model view cannot be upgraded to PASS by plausibility.
- **PASS** — only after a difference-first review finds no critical or major mismatch in the applicable criteria supported by the available reference evidence.

For each relevant paired view, explicitly check applicable silhouette, primary proportion, primary placement, orientation/slope, and visible contact differences before deciding the verdict. If multiple independent reference views exist and the claim concerns the 3D whole form, use the views that constrain the relevant axes. A front-only match cannot become a full 3D PASS when side/depth evidence is missing.

Generic statements such as "looks correct", "matches well", or "all parts are present" are not evidence and must not be used as the basis for PASS.

#### Workflow Blocker / Loop Stop Contract

`BLOCKED` is a workflow state, not a visual verdict. Use it when a valid modelling result cannot currently be reached without inventing evidence or repeating failed work.

Enter `BLOCKED` when any of these applies:

- material reference views conflict and the active brief/user intent cannot resolve the conflict;
- a required reference/model view or runtime observation remains unavailable after one controlled retry when a retry is plausibly useful;
- the same causal correction direction has failed twice without new evidence;
- a required MCP/runtime capability is unavailable and no supported path can validate the requested result;
- continuing would require guessing an unsupported primary dimension/relationship and then presenting it as verified.

When `BLOCKED`:

1. stop further speculative mutation;
2. keep the last valid authored state rather than stacking more patches;
3. report the blocker category and concrete evidence;
4. state what claim/result cannot be validated because of it;
5. summarize the bounded attempts already made;
6. state the exact new evidence, user decision, or working capability needed to continue.

Do not report `PASS`, "fixed", "resolved", or "should be correct" while the blocker remains. A blocker report is preferable to an endless correction loop with no new evidence.

#### Hard rebuild rule

Invalidate/revise the Primary Form Hypothesis instead of micro-patching when:

- the intended object is not recognizable; or
- several primary relationships fail together; or
- fixing the result would require compensating detail to hide a wrong primary
  scaffold.

If the global form is sound and one bounded relationship is wrong, use a
targeted correction.

### 5. Correct Relationships, Not Symptoms

Classify the visible problem before choosing a mutation:

```text
TRANSLATE   placement is wrong
RESIZE      extent/proportion is wrong
ROTATE      orientation/slope is wrong
REATTACH    contact/parent relationship is wrong
SPLIT       one mass genuinely needs separate orientation/volume
MERGE/REMOVE geometry is unnecessary/compensatory
ADD MASS    a required visible volume is genuinely missing
```

Do not default to `ADD CUBE`.

For a local correction, inspect the exact current authored state when a focused
read capability is available. For a global failure, revise the mass hypothesis
rather than protecting a bad blockout because it already contains many Cubes.

After two attempts in the same correction direction without new evidence, stop
and reframe the hypothesis instead of patching again.

### Correction Contract Before Numeric Mutation

For a diagnosed local mismatch, do not jump directly from "too long / too high / misplaced / wrong angle" to new coordinates. First read the exact target with `inspect_element`, then state the smallest useful correction contract:

```text
cause
target UUID(s)
current state
invariant(s)
expected structural effect
```

Examples:

- TRANSLATE: preserve size; move center by the intended delta.
- RESIZE: identify the axis plus the center/face/contact that must stay fixed.
- ROTATE: preserve extents/size; change only the evidence-backed angle/pivot relationship.
- hierarchy REATTACH: use a direct supported parent-mutation owner only. If none is exposed, report `BLOCKED` rather than simulating attachment through coordinate patches.

`modify_cube` and `modify_cubes_batch` return authored before/after state plus `geometry_effect`. Check that effect against the invariant **before** calling the visual correction successful. An unintended center shift during a center-preserving resize, a size change during TRANSLATE, or a changed extent during ROTATE is a failed correction.

If the requested geometry correction produces no effective geometry/visibility change, do not call it progress and do not repeat the same values. Re-diagnose. If the same causal direction reaches the existing two-failure threshold without new evidence, enter `BLOCKED`.

### 6. Add Secondary Geometry / Hierarchy / Pivots

Only after the primary form passes:

- add geometry that materially improves silhouette, attachment, motion, or
  visible detail;
- keep geometry purposeful and editable;
- use semantic names;
- add hierarchy for actual organization/articulation needs;
- add a meaningful pivot only for a real rotation/joint/attachment/parent-
  transform reason;
- choose pivots from intended transform relationships, never from arbitrary
  distant points or copied fixture values;
- if a Cube is not rotated/articulated, do not invent a meaningful pivot story
  merely because the schema has an `origin` field;
- after changing a material pivot/parent transform, re-check affected visible
  attachment/orientation;
- use symmetry only when the reference supports it;
- preserve meaningful asymmetry;
- do not invent hidden features unsupported by the brief.

### 7. Review Complete Geometry

Review the declared reference views needed for the complete form.

Check applicable criteria only:

- silhouette/proportions across views;
- required parts and orientation;
- width/depth/footprint where visible;
- coherent visible connections;
- purposeful Cuboid count;
- rotations backed by visible form or required motion;
- meaningful pivots backed by intended transform/joint/attachment;
- unnecessary/intersecting/inverted geometry;
- hierarchy/pivots where they affect use or motion;
- target dimensions when defined.

A local correction reopens only affected relationships/views unless it exposes a
wrong primary hypothesis.

### 8. UV / Texture — Only When In Scope

Follow `06-texture-standard.md` after geometry is coherent.

- texture supports geometry; it does not conceal geometry errors;
- keep pixel density and UV orientation intentional;
- use the requested `16×16` or `32×32` style appropriately;
- keep pattern/material direction aligned to the form;
- avoid random noise and unnecessary repainting;
- use geometry for silhouette/volume/motion, texture for surface information.

### 9. Animation — Only When Required

Do not animate by default.

When required, use hierarchy/pivots that serve the intended motion and inspect
clipping, detachment, transform arcs, ground/contact behavior, and return-to-
neutral behavior as applicable.

### 10. Final Gate And Save

Before completion, distinguish:

- **structural proof** — hierarchy, bounds, IDs, UV links, save state, etc.;
- **visual proof** — fresh Blockbench views from the current revision;
- **animation proof** — live motion evidence when required.

The downstream Bedrock modeller should receive a model that is coherent,
understandable, purposefully named, editable, and free of accidental temporary
content or unexplained transforms.

Save `.bbmodel` through the currently verified workflow. Reopenability is a
claim only when actually tested.

## Execution Channels

### ChatGPT → GitHub

Use this skill for modelling-policy/workflow preparation or review, but do not
claim that a Blockbench model was visually/runtime verified. Prepare the exact
remaining local proof for Codex when live modelling is required.

### Codex Local

Use Blockbench + MCP for actual model construction and visual evidence. Start
with the smallest useful coarse batch and the smallest visual gate that can
falsify the current primary hypothesis.

Do not automatically run every tool, full outline dump, full screenshot set,
build, Inspector, or repeated validation after sufficient proof exists.

## Anti-Slop Rules

- Whole form before local polish.
- Coordinate frame + mass hypothesis before arbitrary exact transforms.
- Reference-visible relationships beat generic anatomy templates.
- Fewer meaningful Cuboids beat dense approximations.
- "Placed/attached" is never a visual approval criterion.
- Rotation needs a reference/form/motion reason.
- Pivot needs a transform/joint/attachment reason.
- No automatic mesh/image-to-Cuboid reconstruction.
- No SF3D, IoU, projection, or similarity score as modelling authority.
- No per-Cube user approval or per-Cube screenshot ceremony.
- No mandatory `list_outline + list_textures` pre-flight when the current task
  does not need both.
- No fixed first-Cube anchor/contact-overlap rule.
- No Hytale/mesh/PBR expansion because historical skills supported them.
- No model-specific Zebra/Rhino rule promoted into generic behavior.
- Tool/runtime success is not visual success.
- Stop when requested scope and sufficient proof are complete.

## Completion

Return to the active `development-brief` and confirm:

- the model satisfies the requested Bedrock asset scope;
- whole-form and complete-geometry gates passed when visual completion is
  claimed;
- no material Cube/rotation/pivot is justified only by technical validity;
- texture/animation are complete only when required;
- the resulting `.bbmodel` remains understandable/editable for a downstream
  modeller;
- unavailable local/runtime/visual proof is reported rather than inferred.
