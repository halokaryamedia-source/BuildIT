---
name: blockbench-bedrock-modelling
description: Specialist for creating or revising Minecraft Bedrock Entity models in Blockbench from an approved Model Reference. Use when the primary problem is whole-form interpretation, Cuboid geometry, proportions, silhouette, hierarchy/pivots for the asset, geometry-vs-texture decisions, UV/texture scope, required animation, or visual correction of the model itself. Do not use for Blockbench plugin/runtime API failures, MCP server contracts, Bun tooling, TypeScript type-system issues, or reference-image generation.
---

# Blockbench Bedrock Modelling

Own the **modeller judgement** required to turn an approved Model Reference into
a coherent, editable Minecraft Bedrock `.bbmodel`.

This skill decides **what the model should become**. It does not own the
Blockbench API/runtime mechanics used to apply those decisions.

## Use This Skill For

- interpreting an approved reference as one coherent 3D form;
- deciding primary/secondary Cuboid masses and their relationships;
- silhouette, proportion, orientation, width/depth/footprint, and visible contact
  correction;
- deciding whether a visible feature belongs in geometry or texture;
- hierarchy/pivot decisions needed by the asset or required animation;
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
- unrelated engines, Hytale production, generic mesh sculpting, PBR pipelines,
  or realistic rendering unless the product scope is explicitly changed.

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
- `docs/foundation/05-geometry-standard.md` — geometry decisions/review;
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
- texture style/scope;
- animation requirement;
- current model state when revising an existing asset.

The user does not need to provide Cube counts, transforms, hierarchy, pivots, or
professional modelling terminology.

Treat the reference as a **visual modelling brief**, not pixel calibration.
When dimensions are approved, use `1 block = 16 Blockbench units`; choose the
individual geometry from those dimensions plus the visible proportions.

## Procedure

### 1. Understand The Whole Form

Reason about the object before local detail:

- primary masses and relative scale;
- major orientation/silhouette direction;
- visible contacts/attachments;
- width/depth/footprint cues across relevant views;
- hierarchy/pivot needs that materially affect construction or motion;
- features that should remain texture-first.

Do not produce a locked per-Cube plan. Do not impose support-first,
section-first, largest-first, anatomy templates, or a fixed Cube count.

### 2. Build The Primary Geometry Pass

Create the **minimum coherent whole form** needed for recognizability.

- establish all important primary masses before polishing one local area;
- use Cuboids/rotations only when they materially serve silhouette, volume,
  orientation, attachment, or required motion;
- preserve major contacts/relationships;
- use bounded batches when they reduce tool churn and remain safe to recover;
- defer small details, UV polish, and cosmetic geometry.

A successful tool call, valid coordinates, or technical overlap does not mean the
shape is correct.

### 3. Run The Primary Visual Gate

Use only the fresh views needed to answer the current whole-form question.
Check:

- recognizability;
- global silhouette;
- major proportions;
- mass placement/orientation;
- visible primary contacts/attachments.

If the whole shape is wrong, correct the responsible **primary relationship**.
Do not add compensating detail Cubes to hide it.

After two attempts in the same correction direction without new evidence, stop
and reframe the hypothesis instead of patching again.

### 4. Add Secondary Geometry / Hierarchy / Pivots

After the primary form passes:

- add only geometry that materially improves silhouette, attachment, motion, or
  visible detail;
- keep geometry purposeful and editable;
- use semantic names;
- add hierarchy/pivots for actual organization/articulation needs;
- use symmetry only when the reference supports it;
- preserve meaningful asymmetry;
- do not invent hidden features unsupported by the brief.

### 5. Review Complete Geometry

Review the declared reference views needed for the complete form.

Check applicable criteria only:

- silhouette/proportions across views;
- required parts and orientation;
- width/depth/footprint where visible;
- coherent visible connections;
- unnecessary/intersecting/inverted geometry;
- hierarchy/pivots where they affect use or motion;
- target dimensions when defined.

A local correction reopens only affected relationships/views unless it changes
the global form.

### 6. UV / Texture — Only When In Scope

Follow `06-texture-standard.md` after geometry is coherent.

- texture supports geometry; it does not conceal geometry errors;
- keep pixel density and UV orientation intentional;
- use the requested `16×16` or `32×32` style appropriately;
- keep pattern/material direction aligned to the form;
- avoid random noise and unnecessary repainting;
- use geometry for silhouette/volume/motion, texture for surface information.

### 7. Animation — Only When Required

Do not animate by default.

When required, use hierarchy/pivots that serve the intended motion and inspect
clipping, detachment, ground/contact behavior, and return-to-neutral behavior as
applicable.

### 8. Final Gate And Save

Before completion, distinguish:

- **structural proof** — hierarchy, bounds, IDs, UV links, save state, etc.;
- **visual proof** — fresh Blockbench views from the current revision;
- **animation proof** — live motion evidence when required.

The downstream Bedrock modeller should receive a model that is coherent,
understandable, purposefully named, editable, and free of accidental temporary
content.

Save `.bbmodel` through the currently verified workflow. Reopenability is a
claim only when actually tested.

## Execution Channels

### ChatGPT → GitHub

Use this skill for modelling-policy/workflow preparation or review, but do not
claim that a Blockbench model was visually/runtime verified. Prepare the exact
remaining local proof for Codex when live modelling is required.

### Codex Local

Use Blockbench + MCP for actual model construction and visual evidence. Start
with the smallest useful operation/batch and the smallest visual gate that can
falsify the current modelling decision.

Do not automatically run every tool, full outline dump, full screenshot set,
build, Inspector, or repeated validation after sufficient proof exists.

## Anti-Slop Rules

- Whole form before local polish.
- Reference-visible relationships beat generic anatomy templates.
- Fewer meaningful Cuboids beat dense approximations.
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
- texture/animation are complete only when required;
- the resulting `.bbmodel` remains understandable/editable for a downstream
  modeller;
- unavailable local/runtime/visual proof is reported rather than inferred.