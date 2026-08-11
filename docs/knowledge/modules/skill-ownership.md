# Skill Ownership

Updated: 2026-08-11

All canonical repository-owned BlockIT skills live under:

`/.agents/skills/`

Task-class routing is owned by root `AGENTS.md`. This note records ownership, not active task state.

## Asset Authoring Skills

| Skill | Responsibility |
|---|---|
| `blockit-bedrock-entity-mcp` | lightweight Bedrock asset orchestrator; chooses the smallest modelling/texturing/animation lane and minimum necessary evidence |
| `blockbench-bedrock-modelling` | whole-form Cube/Group judgement, silhouette/proportion, hierarchy/pivots, difference-first visual validation, causal correction |
| `blockit-bedrock-texturing` | texture creation/read/activation, Painter, PBR TextureGroups, material instances, surface verification |
| `blockit-bedrock-animation` | Bedrock animation inspection/creation, BoneAnimator transforms, keyframes, timeline/playback, mapped effects, rig-related animation execution |

Normal asset authoring starts with the orchestrator and loads only the active domain specialist(s) as the workflow reaches that stage. It does **not** route through `development-brief` merely because MCP is used.

## Repository / Plugin Development Skills

| Skill | Responsibility |
|---|---|
| `development-brief` | repository create/change front door: goal/method separation, scope, Build/Acceptance POV, acceptance criteria, proof budget |
| `mcp-server-development` | MCP tools/resources/prompts, public input/result/schema/registration/transport contracts |
| `typescript-type-safety` | genuine TypeScript type-system problems only |
| `bun-tooling` | Bun-owned build/package/script/dependency behavior |
| `blockbench-runtime-development` | Blockbench API/lifecycle/UI/settings/Undo/Canvas/runtime mechanics |

`blockbench-bedrock-modelling` may also be selected for repository changes whose semantic owner is modelling judgement/policy rather than runtime mechanics.

Repository Developing work uses:

```text
development-brief
+ at most one engineering specialist when it materially helps the proved boundary
```

Do not stack engineering specialists just because one file contains MCP + TypeScript + Blockbench code.

## Reference Generation

Reference generation is intentionally not another root Codex skill. Source Image/user intent → approved Modelling Brief belongs to:

`docs/foundation/04-reference-guide.md`

Codex consumes the approved brief through the asset-authoring route.

## Evidence Status

Evidence classification is root `AGENTS.md` behavior, not a skill:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Retired / Historical Skill Locations

Not active skill roots:

```text
mcp/.agents/skills/
mcp/.github/skills/
mcp/workflow/skills/
```

Historical names such as `mcp-builder`, `typescript-expert`, `zod`, `bun-development`, `blockbench-plugins`, old `blockbench-use`, generic Mesh/Hytale skill stacks, and conceptual `evidence-gate` are not current routing targets.

Do not recreate retired packages unless a new explicit requirement proves a distinct current owner/capability gap.

## Canonical Detail

- [Skill Map](../skills/skill-map.md) — current inventory + concise lineage.
- [Activation Matrix](../skills/activation-matrix.md) — current routing rules.
- [Agent Rules](../../../AGENTS.md) — task class/proof/anti-slop baseline.
- [BlockIT Skill Surface Review](../reviews/blockit-agent-skill-surface-2026-08-10.md) — historical evidence for the authoring-skill expansion.

## Parent

- [Module Map](module-map.md)
- [Knowledge Dashboard](../index.md)
