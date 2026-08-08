# Skill Activation Matrix

Use this note only to choose the **smallest correct owner**. Detailed procedure
lives in the selected `SKILL.md`; proof/evidence/anti-slop behavior lives in root
`AGENTS.md`.

## Default Budget

| Mode | Default |
|---|---|
| Plan | `ponytail`; add a specialist only for a real domain/module decision |
| Developing | mandatory `development-brief` + **at most one** specialist |
| Maintenance | `ponytail` + smallest diagnostic/specialist owning the failure |

Do not load a framework/language skill merely because that technology appears in
the implementation.

## Developing Front Door

Every create/change task starts with:

`/.agents/skills/development-brief/SKILL.md`

It owns goal/method separation, execution-channel detection, development
necessity, Build/Acceptance POVs, minimal scope, 2-5 acceptance criteria, proof
budget, specialist selection, and final contract re-check.

## Canonical Specialist Routing

| Primary semantic owner | Skill | Trigger examples | Do not select merely because… |
|---|---|---|---|
| MCP public/protocol/input contract | `mcp-server-development` | tools/resources/prompts, Zod MCP input semantics, registration, results/errors, annotations, transport/session | implementation is TypeScript/Bun or calls Blockbench |
| TypeScript type system | `typescript-type-safety` | inference, generics, unions/narrowing, declarations, unsafe assertions, compiler type contract | file ends in `.ts` |
| Bun build/tooling | `bun-tooling` | `Bun.build`, build plugins, Bun APIs, scripts, `bunx`, dependencies/lockfile | command starts with `bun` |
| Blockbench execution mechanics | `blockbench-runtime-development` | lifecycle, UI, permissions, globals/APIs, Undo/Canvas, mutation mechanics, events/cleanup | an MCP tool happens to manipulate a model |
| Bedrock model judgement | `blockbench-bedrock-modelling` | whole-form Cuboids, silhouette/proportion, hierarchy/pivots, geometry-vs-texture, UV/texture scope, required animation, visual correction | Blockbench APIs are used to execute the modelling decision |

Canonical paths:

```text
.agents/skills/development-brief/SKILL.md
.agents/skills/mcp-server-development/SKILL.md
.agents/skills/typescript-type-safety/SKILL.md
.agents/skills/bun-tooling/SKILL.md
.agents/skills/blockbench-runtime-development/SKILL.md
.agents/skills/blockbench-bedrock-modelling/SKILL.md
```

## Boundary Resolution

When more than one technology appears, choose by the **proved cause/contract**:

```text
MCP input/result/tool semantics wrong
→ mcp-server-development

MCP contract correct, Blockbench API/lifecycle operation wrong
→ blockbench-runtime-development

Operation executes correctly, model shape/visual result wrong
→ blockbench-bedrock-modelling

Domain behavior is correct but compiler typing itself fails
→ typescript-type-safety

Domain behavior is correct but Bun build/package behavior fails
→ bun-tooling
```

Do not stack two specialists to solve one boundary. If investigation proves a
second independent problem, finish/reframe the first boundary before switching
owner.

## Reference Preparation Is Not A Root Skill

Source Image/user intent → five-view Modelling Brief is owned by:

`docs/foundation/04-reference-guide.md`

Run that workflow on an image-capable ChatGPT/Reference Generator surface.
Codex consumes the approved brief through `blockbench-bedrock-modelling`.

Do not create a root `reference-generator` skill unless a future requirement
proves Codex itself must own image generation.

## Evidence Is Not A Skill

Material support/feasibility/compatibility/runtime uncertainty uses root
`AGENTS.md` Evidence Status Escalation:

- `CURRENT-PROJECT VERIFIED`
- `OFFICIALLY VERIFIED`
- `LOCAL PROOF REQUIRED`
- `UNSUPPORTED`
- `UNKNOWN`

This does not consume the specialist slot and is not applied ceremonially to
routine work.

## Conditional Helpers

Use only when their distinct function is needed:

- `grilling` — adversarial challenge before commitment;
- `code-review` — independent critique after implementation when useful;
- lightweight GSD-style discovery — unresolved high-impact requirement;
- `diagnosing-bugs` — reproducible failure where diagnosis procedure adds value;
- `tdd` — behavior/regression where test-first materially reduces risk;
- `research` — external primary-source facts;
- `domain-modeling` — domain terminology/ownership genuinely unclear;
- `codebase-design` — module/interface ownership genuinely unclear;
- CodeGraph — optional broad source-navigation accelerator, never proof;
- OpenSpec — only a genuine cross-cutting contract/migration/multi-phase change.

None are default ceremony.

## Skill Authoring

Use the available global/user `skill-creator` only when a skill itself is being
created or materially revised. Do not keep a duplicate generic repository copy.

## Location And Freeze Rule

- `.agents/skills/` is the only canonical repository-wide skill root.
- `mcp/.agents/skills/` and `mcp/.github/skills/` are retired legacy locations.
- `mcp/workflow/skills/` is stale and must not be recreated.
- The current six-skill architecture is **frozen after the final consolidation
  review**. Do not rename, merge, split, or add another skill unless current work
  proves a distinct owner/capability that cannot be represented cleanly by the
  existing baseline, foundation workflow, or one specialist.

## Retired Names

Do not route to or recreate:

```text
mcp-builder
typescript-expert
zod
bun-development
blockbench-plugins
vue-best-practices
nested skill-creator
historical blockbench-use orchestrator
conceptual evidence-gate skill
```

Historical names are lineage only.

## Final Routing Check

Before loading a specialist ask:

```text
What exact behavior/contract is wrong?
Which owner would still be wrong if implementation language/framework changed?
Does this skill add domain procedure beyond AGENTS + development-brief?
Can one specialist cover the boundary without stacking?
```

If no specialist adds material value, use `development-brief` alone.
