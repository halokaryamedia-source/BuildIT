# BlockIT — Product Intent Requirements

**Status:** Draft  
**Version:** 1.0  
**Primary Output:** Blockbench `.bbmodel` for a Minecraft Bedrock Entity

## 1. Product Summary

BlockIT lets a user ask Codex to create or update a Minecraft Bedrock Entity model in Blockbench through MCP.

The user provides:

- a natural-language request;
- a visual reference;
- an optional brief.

Codex then creates or updates a Blockbench project and saves a `.bbmodel` file.

Reference image generation is defined in [`04-reference-guide.md`](04-reference-guide.md).

## 2. Product Objective

Enable non-technical users to produce structured Minecraft Bedrock models through simple input, a visual reference, and Codex-controlled Blockbench editing.

## 3. Target Users

### Primary User

A non-technical user with little or no knowledge of:

- MCP;
- Blockbench;
- 3D modelling;
- Minecraft Bedrock asset structure.

### Secondary User

Minecraft Bedrock developers or modelers who want to speed up repetitive modelling work.

## 4. User Input

### Required

- natural-language request;
- visual reference.

### Optional

- model name;
- target use;
- approximate dimensions;
- texture style;
- animation requirement;
- design notes;
- expected output.

## 5. Primary User Flow

```text
Request
↓
Reference
↓
Plan
↓
Open or create Blockbench project
↓
Build geometry and hierarchy
↓
Create UV and texture
↓
Add animation if required
↓
Validate structure
↓
Save .bbmodel
```

## 6. Product Scope

### In Scope

- reading requests and references;
- creating a short plan;
- creating or opening a project;
- creating, moving, resizing, rotating, and deleting cuboids;
- grouping geometry;
- creating roots, bones, and hierarchy;
- assigning geometry to bones;
- configuring pivots;
- UV mapping;
- texture creation or editing;
- optional animation;
- structural validation;
- visual review support when available;
- saving `.bbmodel`.

### Out of Scope

- full resource-pack integration;
- full behavior-pack integration;
- entity definitions;
- render controllers;
- animation controllers;
- gameplay scripting;
- Marketplace publishing;
- licensing review;
- sculpting or realistic rendering;
- modelling for unrelated engines.

## 7. Product Principles

- Reference first.
- Plan before execution.
- One task produces one model unless the user explicitly asks for more.
- Geometry before texture.
- Base texture is a checkpoint, not the final state.
- Preview at each major checkpoint when preview is available.
- Use the simplest path that still works.
- Do not claim visual quality without visual evidence.
- Stop when requirements are met.

## 8. Core Requirements

### PR-001 — Read Request

Codex must understand the object, target platform, and expected `.bbmodel` output.

### PR-002 — Read Reference

Codex must use the reference for form, proportion, silhouette, and style, and report meaningful ambiguity.

### PR-003 — Create Short Plan

Codex must produce a concise modelling plan before execution.

### PR-004 — Open or Create Project

Codex must open or create the correct Blockbench project without overwriting unrelated work.

### PR-005 — Build Base Geometry

The model must become recognizable before texturing.

### PR-006 — Create Hierarchy

The hierarchy must be functional, understandable, and free of unnecessary empty parts.

### PR-007 — Configure Pivots

Pivots must support the intended rotation or animation.

### PR-008 — Create UV

Important surfaces must have usable UVs within the canvas.

### PR-009 — Apply Texture

Texture must establish the base visual identity and remain aligned with the reference.
If the task requires final delivery, advanced texture must complete the target scope.

### PR-010 — Add Animation When Required

Animation must be skipped when it is not required.

### PR-011 — Validate Structure

Codex must inspect geometry, hierarchy, pivots, UV, texture links, optional animation, and temporary elements.

### PR-012 — Support Visual Review

If preview is available, Codex must use it at geometry, texture, and animation checkpoints.
If preview or the visual critic is not available, it must keep the result
`BLOCKED` and must not expose it as a finished model.

### PR-013 — Save Final File

The final file must save correctly, reopen correctly, and preserve the project state.

## 9. Quality Requirements

### Visual Quality

- recognizable form;
- alignment with reference;
- clear silhouette;
- sensible proportions;
- readable texture;
- Minecraft-compatible style.

### Structural Quality

- clean hierarchy;
- clear naming;
- no unnecessary objects;
- editable by another person;
- no hidden undocumented dependency.

### Efficiency

- avoid purposeless tool calls;
- avoid full reinspection after every small change;
- avoid rebuilding the entire model for a local issue;
- avoid endless refinement.

### Reliability

- detect failed operations;
- do not assume success;
- preserve the project during failure;
- report issues clearly.

## 10. Output Requirements

Standard output:

```text
<model-name>.bbmodel
```

It should include:

- geometry;
- hierarchy;
- pivots;
- UV;
- texture;
- optional animation;
- clean naming.

## 11. Product Status Labels

- `Reference Handoff`
- `ISSUES_FOUND`
- `BLOCKED`
- `PASS`

Geometry, texture, and animation checkpoints are internal. The visual critic
and release gate replace repeated user approvals; export is blocked unless the
current model has a current `PASS` visual review.

## 12. MVP Definition

### Foundation MVP

- create or open a project;
- create groups or bones;
- create cuboids;
- set dimension, position, and rotation;
- save and reopen `.bbmodel`.

### Modelling MVP

- reference-driven geometry;
- hierarchy;
- pivots;
- basic UV;
- basic texture linking;
- structural validation.

### Target Product

- advanced texturing;
- visual validation;
- optional animation;
- development-ready final `.bbmodel`.

## 13. Definition of Done

A modelling task is done when:

- the request is understood;
- the reference is used;
- required geometry is complete;
- hierarchy and pivots are complete;
- UV is complete;
- texture is complete for the target scope, not just base texture;
- animation is complete or not required;
- structural validation is complete;
- visual review has happened when possible;
- no known critical issue remains;
- the `.bbmodel` is saved.
