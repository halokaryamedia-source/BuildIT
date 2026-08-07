# BlockIT — Product Intent Requirements

**Status:** Draft  
**Version:** 1.1  
**Primary Output:** editable Blockbench `.bbmodel` for a Minecraft Bedrock Entity

## 1. Product Summary

BlockIT lets a user give a simple natural-language request and an approved Model
Reference, then uses an agent + Blockbench MCP to create or update a Minecraft
Bedrock Entity model.

The user is not expected to understand MCP, Blockbench internals, or professional
3D-modelling terminology. The system is responsible for normalizing incomplete
input without inventing unsupported requirements.

Reference generation/preparation is defined in
[`04-reference-guide.md`](04-reference-guide.md).

## 2. Product Objective

Enable non-technical users to obtain a structured, clean, editable Bedrock model
while keeping modeller-quality reasoning, evidence, and runtime claims honest.

## 3. Target Users

### Primary

A non-technical user with little or no knowledge of MCP, Blockbench, 3D
modelling, or Bedrock asset structure.

### Downstream / Secondary

Minecraft Bedrock modellers/developers who need the `.bbmodel` to be
understandable, editable, and usable after AI-assisted creation.

## 4. User Input

### Required

- natural-language goal/request;
- approved Model Reference or the input needed to prepare one first.

### Optional

- model name;
- target use;
- approximate/requested dimensions;
- texture style;
- animation requirement;
- design notes;
- proposed implementation idea.

A proposed implementation idea is not automatically a requirement. Preserve the
user's goal while rejecting/redirecting a method that conflicts with verified
product evidence or would materially reduce quality.

## 5. Primary User Flow

```text
Request
↓
Approved Model Reference
↓
Whole-form interpretation
↓
Primary Geometry Pass
↓
Primary visual gate
↓
Secondary geometry / hierarchy / pivots
↓
Full geometry review
↓
UV / texture
↓
Optional animation
↓
Final validation
↓
Save .bbmodel
```

Detailed modelling order lives in `03-modelling-workflow.md`.

## 6. Product Scope

### In Scope

- understanding simple/incomplete requests;
- reviewing/preparing Model Reference inputs;
- whole-form modelling reasoning;
- creating/opening the correct Bedrock project through the verified workflow;
- creating, moving, resizing, rotating, and deleting Cuboids;
- grouping/hierarchy/bones where required;
- pivots for real edit/animation needs;
- UV mapping and texture work;
- optional animation;
- structural validation;
- visual validation from fresh Blockbench evidence;
- saving `.bbmodel`.

### Out of Scope

- full resource-pack or behavior-pack integration;
- entity definitions/render controllers/animation controllers;
- gameplay scripting;
- Marketplace publishing/licensing review;
- sculpting/realistic rendering;
- modelling for unrelated engines;
- automatic mesh/image-to-approved-cuboid reconstruction;
- numeric similarity scores as modelling authority.

## 7. Product Principles

- User intent may be simple; system reasoning must still be professional.
- Reference first; whole-form before local detail.
- One task produces one model unless explicitly requested otherwise.
- Geometry quality precedes texture polish.
- Use the minimum useful geometry and minimum useful proof.
- Preview at **meaningful visual gates**, not after every Cube/tool call.
- Do not claim visual quality without fresh visual evidence.
- Do not claim runtime capability without current runtime evidence.
- Stop when the requested scope and required proof are complete.

## 8. Core Requirements

### PR-001 — Understand Request

The system must identify the intended asset, Bedrock target, expected output, and
material ambiguity without requiring the user to write an expert prompt.

### PR-002 — Use Model Reference

The system must use the approved reference for visible form, proportion,
silhouette, contacts/relationships, and style while treating ambiguous detail as
unknown rather than invented geometry.

### PR-003 — Interpret Whole Form

Before local polish, the system must reason about the primary masses,
relationships, orientation, and global silhouette needed for one coherent model.

### PR-004 — Open / Prepare Project

Use the current verified Bedrock project workflow without overwriting unrelated
work.

### PR-005 — Build Primary Geometry

The model must become globally recognizable before secondary/detail work
expands.

### PR-006 — Pass Primary Visual Gate

The primary form must be visually reviewed for global silhouette, major
proportions/masses, orientation, and major visible attachments before detail is
used to compensate for shape errors.

### PR-007 — Complete Structure

Hierarchy, pivots, and secondary geometry must be purposeful, understandable,
and appropriate to required editability/motion.

### PR-008 — Create UV / Texture

Required surfaces must have usable UVs and texture appropriate to the requested
scope. Texture must not conceal incorrect primary geometry.

### PR-009 — Animation Only When Required

Do not create animation by default. When required, verify intended motion,
hierarchy, pivots, clipping, and detachment visually.

### PR-010 — Validate Structure

Inspect only structural criteria relevant to the requested output and changed
boundary.

### PR-011 — Validate Visually

Fresh current-revision Blockbench evidence must support visual claims. Full
geometry review uses the active Model Reference's declared view set; do not use
fixture-specific or per-Cube screenshot rules.

### PR-012 — Save Final File

Save through the current verified workflow. Claim reopenability only when it was
actually tested in an environment that can perform that proof.

## 9. Quality Requirements

### Visual

- recognizable whole form;
- coherent silhouette and major proportions;
- required primary parts/relationships;
- readable Minecraft-compatible style;
- texture/animation quality when in scope.

### Structural

- clean understandable hierarchy/naming;
- purposeful geometry;
- editable by another modeller;
- no hidden undocumented dependency or accidental temporary content.

### Efficiency

- no purposeless tool calls;
- no per-Cube validation ceremony;
- no repeated full inspection after a local correction unless global form was
  affected;
- no rebuilding a correct whole model for a local issue;
- no endless refinement or broad tests after acceptance is sufficiently proven.

### Reliability

- detect/report failed operations;
- preserve recoverability where possible;
- do not assume success;
- distinguish static implementation from live/runtime/visual proof.

## 10. Standard Output

```text
<model-name>.bbmodel
```

The delivered project should contain the geometry, hierarchy/pivots, UV,
texture, optional animation, and clean naming required by the approved scope.

## 11. Status Boundary

Internal visual/validation states may include `ISSUES_FOUND`, `BLOCKED`, and
`PASS`.

A successful tool call/build/save does not automatically produce `PASS`. A
runtime/visual result remains unverified until the relevant local proof exists.

## 12. MVP Boundary

### Foundation MVP

- correct Bedrock project workflow;
- create/organize Cuboids;
- set transforms/pivots/hierarchy as required;
- save project through verified operations.

### Modelling MVP

- approved-reference-driven whole-form geometry;
- hierarchy/pivots;
- basic UV/texture;
- structural + primary/full visual gates.

### Target Product

- stronger texture quality;
- robust visual validation;
- optional animation;
- clean development-ready `.bbmodel`.

## 13. Definition Of Done

A modelling task is done when:

- the intended request/scope is understood;
- the approved Model Reference was used honestly;
- primary whole form passed visual review;
- required secondary geometry/hierarchy/pivots are complete;
- UV/texture are complete for scope;
- animation is complete or not required;
- required structural and visual proof is complete;
- no unresolved critical/major issue remains;
- `.bbmodel` is saved when save is part of scope;
- any remaining local-only proof is reported rather than fabricated.
