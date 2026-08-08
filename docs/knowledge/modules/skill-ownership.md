# Skill Ownership

Updated: 2026-08-08

All canonical repository-wide BlockIT skills live at root:

`/.agents/skills/`

Codex is launched from root `BuildIT`, so this is the only active project skill
root.

## Frozen Canonical Set

| Skill | Responsibility |
|---|---|
| `development-brief` | mandatory Developing front door: goal/method separation, execution channel, Build/Acceptance POV, scope, acceptance, proof budget |
| `mcp-server-development` | MCP tools/resources/prompts, public input/result contracts, schema/registration/session semantics |
| `typescript-type-safety` | TypeScript type-system failures only |
| `bun-tooling` | Bun-owned build/tooling/scripts/dependency behavior |
| `blockbench-runtime-development` | Blockbench API/lifecycle/UI/Undo/Canvas/runtime mechanics |
| `blockbench-bedrock-modelling` | modeller judgement: reference → coherent Bedrock Cuboid form, hierarchy/pivots, texture/animation scope, visual correction |

The architecture is frozen. Do not add/rename/merge/split another skill unless
current work proves a distinct reusable ownership gap.

## Routing Rule

Developing work uses:

```text
development-brief
+ at most one specialist when it adds real domain procedure
```

Do not stack skills because multiple technologies happen to appear in one file.
Choose the semantic owner of the actual wrong behavior/contract.

Detailed routing lives in [Skill Activation Matrix](../skills/activation-matrix.md).

## Reference Generation

Reference generation is intentionally **not** a root Codex skill.

Source Image → five-view Modelling Brief belongs to:

`docs/foundation/04-reference-guide.md`

on an image-capable surface. Codex consumes the approved Modelling Brief through
`blockbench-bedrock-modelling`.

## Evidence Status

Evidence classification is also **not** a skill. Root `AGENTS.md` owns:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Do not recreate an `evidence-gate` package.

## Retired / Historical Skill Locations

The following are not active skill roots:

```text
mcp/.agents/skills/
mcp/.github/skills/
mcp/workflow/skills/
```

Do not repopulate them merely to preserve old structure.

Historical names such as `mcp-builder`, `typescript-expert`, `zod`,
`bun-development`, `blockbench-plugins`, `blockbench-use`,
`reference-generator`, or `evidence-gate` are lineage/superseded concepts, not
current routing targets.

## Canonical Detail

- [Skill Map](../skills/skill-map.md) — full lineage and retired names.
- [Activation Matrix](../skills/activation-matrix.md) — current routing rules.
- [Agent Rules](../../../AGENTS.md) — mode/proof/skill-budget baseline.

## Parent

- [Module Map](module-map.md)
- [Knowledge Dashboard](../index.md)
