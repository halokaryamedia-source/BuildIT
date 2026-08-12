# Skill Map

Updated: 2026-08-12

Use this note for the **current repository-owned skill inventory and location**. Use [Activation Matrix](activation-matrix.md) for routing. Historical recovery detail lives in reviews/decision history rather than this current map.

## Canonical Skill Root

Codex runs from root `BuildIT`; all repository-owned skills live under:

`/.agents/skills/`

There are nine current packages, but they are **not loaded together**.

## Asset Authoring

| Skill | Canonical path | Function |
|---|---|---|
| `blockit-bedrock-entity-mcp` | `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` | Bedrock authoring orchestrator: intent/state/stage routing, exact-name deferred spec loading, bounded recovery, and minimum-evidence discipline |
| `blockbench-bedrock-modelling` | `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | whole-form Cube/Group modelling judgement, hierarchy/pivots, difference-first visual validation, correction |
| `blockit-bedrock-texturing` | `.agents/skills/blockit-bedrock-texturing/SKILL.md` | texture/Painter/PBR/material-instance execution and surface verification |
| `blockit-bedrock-animation` | `.agents/skills/blockit-bedrock-animation/SKILL.md` | Bedrock animation inspection/creation, keyframes, timeline/playback, mapped effects |

Normal asset work loads the orchestrator, then only the specialist needed by the current stage. The orchestrator uses native `tool_search` only as deferred spec loading after a semantic route has already selected the exact tool; it is not a second router.

## Repository / Plugin Development

| Skill | Canonical path | Function |
|---|---|---|
| `development-brief` | `.agents/skills/development-brief/SKILL.md` | create/change front door: goal/method, scope, Build/Acceptance POV, acceptance, proof budget |
| `mcp-server-development` | `.agents/skills/mcp-server-development/SKILL.md` | MCP public/input/result/registration/transport contract |
| `typescript-type-safety` | `.agents/skills/typescript-type-safety/SKILL.md` | TypeScript type-system boundary only |
| `bun-tooling` | `.agents/skills/bun-tooling/SKILL.md` | Bun build/package/script/dependency behavior |
| `blockbench-runtime-development` | `.agents/skills/blockbench-runtime-development/SKILL.md` | Blockbench plugin/runtime/API/UI/Undo/Canvas mechanics |

`blockbench-bedrock-modelling` may also be the repository-development specialist when a source/policy change is specifically about modelling judgement rather than runtime mechanics.

Named MCP-tool defects use the repository-only `docs/knowledge/implementation-map.md` Hot-Path Defect Index to locate the first source/test pair; that index is navigation, not another skill or runtime router.

## Architecture Rule

Task class determines the stack:

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

Source Image/user intent → approved multi-view Modelling Brief belongs to:

`docs/foundation/04-reference-guide.md`

Codex consumes the approved reference through the asset-authoring route.

## Retired / Superseded Names

Do not route to or recreate these as current project skills:

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

Historical nested roots are also inactive:

```text
mcp/.agents/skills/
mcp/.github/skills/
mcp/workflow/skills/
```

## Why The Current Authoring Split Exists

The current asset-authoring split prevents a broad generic Blockbench skill from mixing unrelated product domains:

```text
orchestrator     → route/state/recovery/evidence discipline
modelling        → what form should exist / visual judgement
texturing        → surface authoring
animation        → motion/keyframes
```

Detailed evidence for this change is retained in:

- `docs/knowledge/reviews/blockit-agent-skill-surface-2026-08-10.md`
- `docs/knowledge/reviews/mcp-prelocal-generic-semantics-audit-2026-08-10.md`
- `docs/knowledge/decision-log.md`

Those reviews explain lineage; this file owns the current inventory.

## Skill Change Rule

A new/renamed/merged skill requires a current demonstrated reusable ownership gap. Do not add a package just to preserve historical names, mirror upstream, or increase discoverability.

## Parent

- [Activation Matrix](activation-matrix.md)
- [Knowledge Dashboard](../index.md)
