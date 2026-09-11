# LazyDesigner Skill Taxonomy

Updated: 2026-09-11

This file is the canonical classification for LazyDesigner Skills. It defines what kind of work each Skill belongs to and prevents asset-authoring instructions from being mixed with product-development instructions.

It does not replace the Skill contents themselves, `AGENTS.md` routing, or Control implementation. Physical folder names may remain legacy during migration; this document owns semantic category and target naming.

## Top-Level Categories

LazyDesigner uses exactly three Skill categories:

```text
REFERENCE_PREPARATION
ASSET_AUTHORING
PRODUCT_DEVELOPMENT
```

These categories are mutually exclusive as primary ownership. Another category is consulted only when materially required.

## Canonical Asset Profile Vocabulary

Reference Preparation and Modelling use one shared, user-readable profile vocabulary:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

Profile names describe the **asset class**, not the modelling technique. Technical terms such as `PLANE_LIKE`, `CROSSED_CUTOUT`, `LAYERED_CUTOUT`, or `VOLUMETRIC_GEOMETRY` belong inside the relevant profile as representation choices and must not become user-facing profile names.

Do not maintain parallel `PROP` and `FURNITURE` profile names. `PROP_FURNITURE` may use optional subtype vocabulary such as `STATIC_PROP`, `FURNITURE`, `CONTAINER`, `INTERACTIVE_PROP`, or `MECHANICAL_PROP`, but those are not primary profiles.

`PLANT_FOLIAGE` covers vegetation/foliage assets. It does not imply that every plant uses cutout planes; representation remains reference-driven.

`GENERIC` is fail-safe fallback only; it is not the default profile when another profile materially improves downstream decisions.

Profiles are lightweight knowledge overlays, not workflow engines or geometry presets.

## 1. REFERENCE_PREPARATION

Purpose: prepare visual and structured technical reference evidence before Codex authoring so Codex does not repeat avoidable interpretation.

Execution owner: ChatGPT.

| Current path | Current name | Target semantic name | Role |
| --- | --- | --- | --- |
| `.agents/skills/blockbench-reference-generator/SKILL.md` | `blockbench-reference-generator` | `lazydesigner-reference-preparation` | single ChatGPT-side reference workflow authority: requirements, reference planning, generation, QA and handoff |
| `.agents/skills/lazydesigner-prompt-compiler/SKILL.md` | `lazydesigner-prompt-compiler` | `lazydesigner-prompt-compiler` | internal prompt normalization helper; converts confirmed intent into a clean production brief without adding creative authority |

Canonical ChatGPT-side operational flow is owned by:

```text
docs/knowledge/chatgpt-reference-flow.md
```

Reference Preparation uses:

```text
UNDERSTAND
→ REQUIREMENT GATE
→ PROMPT COMPILER
→ FINAL USER CONFIRMATION
→ REFERENCE PLAN
→ GENERATE
→ QA / REVIEW
→ PACKAGE
```

The final confirmation before artifact generation is a hard gate. If vital information is missing, ChatGPT must ask the fewest simple user-facing questions needed before compilation or generation.

The Prompt Compiler is **not** a second workflow authority and must never generate images/files, invent requirements, or replace the original user intent.

Reference Preparation then uses:

```text
CORE RULES
+ ONE PRIMARY ASSET PROFILE
+ ONLY NECESSARY REFERENCE MODULES
```

Reusable reference modules:

```text
TURNAROUND
STRUCTURAL_DETAIL
MATERIAL_TEXTURE
RIG_DEFORMATION
POSE_ACTION
EXPRESSION_FACE
ANIMATION_KEYFRAME
```

This category must not own Blockbench mutation, MCP/plugin implementation, or Codex modelling decisions.

## 2. ASSET_AUTHORING

Purpose: create, modify, verify and finalize Minecraft Bedrock assets through Codex + Gateway + Runtime + Blockbench.

Execution owner: Codex for reasoning; Runtime/Blockbench for mutation.

| Current path | Current name | Target semantic name | Role |
| --- | --- | --- | --- |
| `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | `blockbench-bedrock-modelling` | `lazydesigner-modelling` | Geometry, hierarchy, pivots/rig-readiness, surfaces, UV Layout, correction and geometry verification |
| `.agents/skills/blockit-bedrock-texturing/SKILL.md` | `blockit-bedrock-texturing` | `lazydesigner-texturing` | Texture Atlas, pixel styling, materials/PBR and texture verification |
| `.agents/skills/blockit-bedrock-animation/SKILL.md` | `blockit-bedrock-animation` | `lazydesigner-animation` | rig usage, keyframes, motion, controllers, animation effects and playback verification |
| `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` | `blockit-bedrock-entity-mcp` | migration-only routing responsibility | legacy asset router; routing responsibility moves to LazyDesigner Control |

### Modelling Core vs Modelling Profiles

`lazydesigner-modelling` is the technical modelling core. It owns how to construct and verify Geometry safely and efficiently.

The same canonical profile vocabulary is used downstream to add asset-class reasoning without becoming a preset:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

Profiles may describe likely semantic assemblies, articulation concerns, useful reference relationships, hierarchy expectations, common pivot concerns and geometry-vs-texture decisions. They must never dictate fixed Cube counts, coordinates or template geometry independent of approved evidence.

### Authoring Routing Rule

```text
Geometry / hierarchy / pivot / rig-readiness / UV Layout
→ lazydesigner-modelling

Texture Atlas / styling / materials / PBR
→ lazydesigner-texturing

Animation / motion / controllers / mapped effects
→ lazydesigner-animation
```

LazyDesigner Control owns task/domain/readiness/context routing. Do not preserve a second permanent asset router Skill after Control migration.

## 3. PRODUCT_DEVELOPMENT

Purpose: change LazyDesigner itself: MCP contracts, Blockbench plugin/runtime integration, build/distribution, architecture, tooling, source behavior, tests and development continuity.

Execution owner: Codex development workflow.

| Current path | Current name | Target semantic name | Role |
| --- | --- | --- | --- |
| `.agents/skills/mcp-server-development/SKILL.md` | `mcp-server-development` | `lazydesigner-mcp-development` | client-visible MCP contracts, schemas, registration and protocol/session behavior |
| `.agents/skills/blockbench-runtime-development/SKILL.md` | `blockbench-runtime-development` | `lazydesigner-blockbench-development` | Blockbench plugin/runtime APIs, lifecycle, UI, Undo and runtime mutation mechanics |
| `.agents/skills/development-brief/SKILL.md` | `development-brief` | `lazydesigner-development-brief` | complex/ambiguous cross-owner development design only |

Build/package/compiler mechanics remain owned by the exact source/build owner under `mcp/AGENTS.md` unless repeated work justifies a distinct reusable Skill.

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

Asset-authoring Skills are not loaded for normal product development unless the development task explicitly changes/evaluates that authoring behavior.

## Naming Rules

Target Skill names use prefix `lazydesigner-` plus a direct responsibility noun:

```text
lazydesigner-reference-preparation
lazydesigner-prompt-compiler
lazydesigner-modelling
lazydesigner-texturing
lazydesigner-animation
lazydesigner-mcp-development
lazydesigner-blockbench-development
lazydesigner-development-brief
```

Avoid ambiguous names such as `core`, `manager`, `director`, `helper`, `builder`, `toolkit`, bare `runtime`, or `router` when Control owns routing.

A Skill name should answer: what semantic decision does this Skill own?

## Context Isolation Rule

```text
REFERENCE_PREPARATION task
→ do not load PRODUCT_DEVELOPMENT Skills

ASSET_AUTHORING task
→ do not load PRODUCT_DEVELOPMENT Skills

PRODUCT_DEVELOPMENT task
→ do not load ASSET_AUTHORING Skills unless explicitly required by changed authoring semantics
```

The Prompt Compiler receives only current intent, confirmed answers and still-valid approved decisions. Rejected/superseded chat directions are not active production context.

This is required for predictable context cost and to prevent development rules or stale conversation history contaminating reference/modelling decisions.

## Migration Rule

Do not bulk-rename physical Skill paths before Control and routing references are migrated coherently.

```text
1. semantic taxonomy documented
2. ChatGPT-side Reference Preparation gates stabilized
3. Control becomes canonical router
4. references/tests/docs updated to target semantic names
5. physical Skill folders/frontmatter renamed coherently
6. legacy blockit-* aliases removed
```

Temporary legacy paths are compatibility residue only and must not become permanent parallel authorities.
