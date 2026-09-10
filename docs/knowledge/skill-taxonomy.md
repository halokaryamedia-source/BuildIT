# LazyDesigner Skill Taxonomy

Updated: 2026-09-11

This file is the canonical classification for LazyDesigner Skills. It defines **what kind of work each Skill belongs to** and prevents asset-authoring instructions from being mixed with product-development instructions.

It does not replace the Skill contents themselves, `AGENTS.md` routing, or Control implementation. Physical folder names may remain legacy during migration; this document owns the semantic category and target naming.

## Top-Level Categories

LazyDesigner uses exactly three Skill categories:

```text
REFERENCE_PREPARATION
ASSET_AUTHORING
PRODUCT_DEVELOPMENT
```

These categories are mutually exclusive as primary ownership. A task may consult another category only when its information is materially required; do not load categories by default.

## 1. REFERENCE_PREPARATION

Purpose: prepare visual and technical reference evidence before Codex authoring so Codex does not repeat avoidable interpretation work.

Execution owner: ChatGPT.

Current Skill:

| Current path | Current name | Target semantic name | Role |
| --- | --- | --- | --- |
| `.agents/skills/blockbench-reference-generator/SKILL.md` | `blockbench-reference-generator` | `lazydesigner-reference-preparation` | visual reference generation + technical handoff preparation |

Target scope:

```text
source/reference interpretation
visual reference generation/correction
reference coverage selection
technical reference package preparation
explicit unknown/conflict preservation
asset-profile-specific reference guidance
```

This category must not own Blockbench mutations, MCP/plugin implementation, or Codex modelling decisions.

### Reference Profiles

Reference profiles are conditional knowledge overlays, not separate workflow engines or geometry presets.

Initial profile vocabulary:

```text
PROP
FURNITURE
VEHICLE
MECHANICAL
HUMANOID
CREATURE
PLANT_CUTOUT
GENERIC
```

A profile may add decision-critical reference guidance such as expected articulation, useful views, material boundaries, or common hierarchy concerns. The actual source/reference remains authority.

## 2. ASSET_AUTHORING

Purpose: create, modify, verify, and finalize Minecraft Bedrock assets through Codex + Gateway + Runtime + Blockbench.

Execution owner: Codex for reasoning; Runtime/Blockbench for mutation.

Current Skills:

| Current path | Current name | Target semantic name | Role |
| --- | --- | --- | --- |
| `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | `blockbench-bedrock-modelling` | `lazydesigner-modelling` | Geometry, hierarchy, pivots/rig-readiness, surfaces, UV Layout, correction and geometry verification |
| `.agents/skills/blockit-bedrock-texturing/SKILL.md` | `blockit-bedrock-texturing` | `lazydesigner-texturing` | Texture Atlas, pixel styling, materials/PBR, texture verification |
| `.agents/skills/blockit-bedrock-animation/SKILL.md` | `blockit-bedrock-animation` | `lazydesigner-animation` | rig usage, keyframes, motion, controllers, animation effects and playback verification |
| `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` | `blockit-bedrock-entity-mcp` | migration-only routing responsibility | legacy asset router; routing responsibility moves to LazyDesigner Control |

### Authoring Core vs Modelling Profiles

`lazydesigner-modelling` is the **technical modelling core**. It owns how to construct and verify geometry safely and efficiently.

It must be complemented by lightweight modelling profiles that help Codex reason about different classes of form without becoming presets.

Initial modelling profile vocabulary:

```text
PROP
FURNITURE
VEHICLE
MECHANICAL
HUMANOID
CREATURE
PLANT_CUTOUT
GENERIC
```

Profiles may describe likely semantic assemblies, articulation concerns, useful reference relationships, hierarchy expectations, common pivots, and geometry-vs-texture decisions. They must never dictate fixed cube counts, fixed coordinates, or template geometry independent of the approved reference.

### Authoring Routing Rule

Normal asset work loads only the active specialist:

```text
Geometry / hierarchy / pivot / rig-readiness / UV Layout
→ lazydesigner-modelling

Texture Atlas / styling / materials / PBR
→ lazydesigner-texturing

Animation / motion / controllers / mapped effects
→ lazydesigner-animation
```

LazyDesigner Control owns task/domain/readiness/context routing. Do not preserve a second permanent asset router Skill after Control migration is complete.

## 3. PRODUCT_DEVELOPMENT

Purpose: change LazyDesigner itself: MCP contracts, Blockbench plugin/runtime integration, build/distribution, architecture, tooling, source behavior, tests, and development continuity.

Execution owner: Codex development workflow.

Current Skills:

| Current path | Current name | Target semantic name | Role |
| --- | --- | --- | --- |
| `.agents/skills/mcp-server-development/SKILL.md` | `mcp-server-development` | `lazydesigner-mcp-development` | client-visible MCP contracts, schemas, registration, protocol/session behavior |
| `.agents/skills/blockbench-runtime-development/SKILL.md` | `blockbench-runtime-development` | `lazydesigner-blockbench-development` | Blockbench plugin/runtime APIs, lifecycle, UI, Undo, runtime mutation mechanics |
| `.agents/skills/development-brief/SKILL.md` | `development-brief` | `lazydesigner-development-brief` | only complex/ambiguous cross-owner development design |

Build/package/compiler mechanics remain owned by the exact source/build owner under `mcp/AGENTS.md` unless a distinct reusable Skill becomes justified by repeated product-development work. Do not create a Skill merely because Bun or TypeScript is used.

### Product-Development Routing Rule

```text
MCP public/protocol contract
→ lazydesigner-mcp-development

Blockbench plugin/runtime/lifecycle/API behavior
→ lazydesigner-blockbench-development

complex architecture / materially ambiguous ownership
→ lazydesigner-development-brief

clear bounded source/build/test change
→ exact source owner; no development-brief ceremony
```

Asset-authoring Skills are not loaded for normal product development unless the development task explicitly changes or evaluates that authoring behavior.

## Naming Rules

Target Skill names use the product prefix `lazydesigner-` and a direct responsibility noun.

Use:

```text
lazydesigner-reference-preparation
lazydesigner-modelling
lazydesigner-texturing
lazydesigner-animation
lazydesigner-mcp-development
lazydesigner-blockbench-development
lazydesigner-development-brief
```

Avoid ambiguous names such as:

```text
core
manager
director
helper
builder
toolkit
runtime       (without saying development when it is a development Skill)
router        (when Control owns routing)
```

A Skill name should answer: **what semantic decision does this Skill own?**

## Context Isolation Rule

Default routing must keep categories isolated:

```text
REFERENCE_PREPARATION task
→ do not load PRODUCT_DEVELOPMENT Skills

ASSET_AUTHORING task
→ do not load PRODUCT_DEVELOPMENT Skills

PRODUCT_DEVELOPMENT task
→ do not load ASSET_AUTHORING Skills unless the change explicitly depends on authoring semantics
```

This is required for predictable context cost and to prevent development rules from contaminating modelling decisions.

## Migration Rule

Do not bulk-rename physical Skill paths before Control and routing references are migrated coherently.

Migration sequence:

```text
1. semantic taxonomy documented
2. Control becomes canonical router
3. references/tests/docs updated to target semantic names
4. physical Skill folders/frontmatter renamed coherently
5. legacy blockit-* aliases removed
```

Temporary legacy paths are compatibility residue only and must not become permanent parallel authorities.
