# Skill Map

Updated: 2026-08-12

Use this note for the **current repository-owned skill inventory and location**. Use [Activation Matrix](activation-matrix.md) for routing. Historical recovery detail lives in reviews/decision history rather than this current map.

## Canonical Skill Root

Codex runs from root `BuildIT`; all repository-owned skills live under `/.agents/skills/`. There are nine current packages, but they are **not loaded together**.

## Asset Authoring

| Skill | Canonical path | Function |
|---|---|---|
| `blockit-bedrock-entity-mcp` | `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` | Bedrock authoring orchestrator: intent/state/stage routing, exact-name deferred spec loading, bounded recovery, minimum-evidence discipline |
| `blockbench-bedrock-modelling` | `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | actual-reference grounding, Semantic Form, whole-form Cube/Group judgement, orientation/pivots/contacts, claim-locked visual comparison, correction |
| `blockit-bedrock-texturing` | `.agents/skills/blockit-bedrock-texturing/SKILL.md` | texture/Painter/PBR/material-instance execution and surface verification |
| `blockit-bedrock-animation` | `.agents/skills/blockit-bedrock-animation/SKILL.md` | Bedrock animation inspection/creation, keyframes, timeline/playback, mapped effects |

Normal asset work loads the orchestrator, then only the specialist needed by the current stage. The orchestrator uses native `tool_search` only as deferred spec loading after semantic routing selected the exact tool; it is not a second router.

For reference-driven geometry, the modelling specialist requires the **actual approved image** as multimodal evidence. Reference paths/manifests/summaries are context, not visual truth. It derives a compact Reference Evidence Map + View Pair Map, then links material Semantic Form decisions to grounded claim IDs. This is modelling judgement, not another skill/runtime framework.

## Repository / Plugin Development

| Skill | Canonical path | Function |
|---|---|---|
| `development-brief` | `.agents/skills/development-brief/SKILL.md` | create/change front door: goal/method, scope, Build/Acceptance POV, acceptance, proof budget |
| `mcp-server-development` | `.agents/skills/mcp-server-development/SKILL.md` | MCP public/input/result/registration/transport contract |
| `typescript-type-safety` | `.agents/skills/typescript-type-safety/SKILL.md` | TypeScript type-system boundary only |
| `bun-tooling` | `.agents/skills/bun-tooling/SKILL.md` | Bun build/package/script/dependency behavior |
| `blockbench-runtime-development` | `.agents/skills/blockbench-runtime-development/SKILL.md` | Blockbench plugin/runtime/API/UI/Undo/Canvas mechanics |

`blockbench-bedrock-modelling` may also be the repository-development specialist when a source/policy change is specifically about modelling/reference judgement rather than runtime mechanics.

Named MCP-tool defects use the repository-only `docs/knowledge/implementation-map.md` Hot-Path Defect Index to locate the first source/test pair; that index is navigation, not another skill or runtime router.

## Architecture Rule

```text
Asset authoring
→ blockit-bedrock-entity-mcp
→ modelling OR texturing OR animation specialist as needed

Repository create/change
→ development-brief
→ at most one engineering specialist when useful
```

Do not infer the old “six-skill” architecture from historical notes; the authoring orchestrator/texturing/animation packages were added later and are current `Local` owners.

## Reference Generator Boundary

Reference generation is intentionally not a root Codex skill.

```text
Source Image/user intent
→ approved multi-view Modelling Brief
→ actual approved image supplied to modelling surface
→ blockbench-bedrock-modelling grounding/authoring
```

Reference preparation policy belongs to `docs/foundation/04-reference-guide.md`. The Reference Evidence Map is derived during modelling; it never replaces the image.

## Retired / Superseded Names

Do not route to/recreate these as current skills:

```text
mcp-builder
typescript-expert
zod
bun-development
blockbench-plugins
historical blockbench-use
generic blockbench-modeling Mesh workflow
reference-generator as root Codex skill
evidence-gate as standalone skill
Hytale/generic Mesh authoring skill stacks
nested skill-creator copy
```

Historical nested roots are inactive: `mcp/.agents/skills/`, `mcp/.github/skills/`, `mcp/workflow/skills/`.

## Why The Current Authoring Split Exists

```text
orchestrator → route/state/recovery/evidence discipline
modelling    → actual-reference grounding + form/visual judgement
texturing    → surface authoring
animation    → motion/keyframes
```

Detailed lineage remains in review history/decision log. This file owns current inventory.

## Skill Change Rule

A new/renamed/merged skill requires a current demonstrated reusable ownership gap. Do not add a package just to preserve historical names, mirror upstream, or increase discoverability.

## Parent

- [Activation Matrix](activation-matrix.md)
- [Knowledge Dashboard](../index.md)
