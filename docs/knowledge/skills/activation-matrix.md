# Skill Activation Matrix

Updated: 2026-08-13

Use this note only to choose the **smallest correct skill owner**. Root `AGENTS.md` decides task class first; [Flow](../flow.md) owns the detailed sequence; the selected `SKILL.md` owns procedure.

## 1. Reference Preparation / Asset Authoring

### Reference preparation

Use when the user wants to create or revise the **visual reference image itself** before Blockbench modelling.

Start with:

`/.agents/skills/blockbench-reference-generator/SKILL.md`

The skill owns the whole image-only route:

```text
source image / intent
→ assisted intake
→ internal brief
→ pre-generation readiness
→ Draft only when READY
→ visual gate / max one targeted correction
→ user approval
```

Do not load `blockit-bedrock-entity-mcp`, call BlockIT MCP, create geometry, or produce a technical package merely to prepare the reference.

### Blockbench asset authoring

Use when the user wants to create, revise, inspect, texture, animate, validate, or export a Bedrock Entity asset and is **not** asking to change repository/plugin source.

Start with:

`/.agents/skills/blockit-bedrock-entity-mcp/SKILL.md`

Then load only the active domain specialist:

| Active decision | Specialist | Examples |
|---|---|---|
| whole form / Cube geometry / hierarchy / pivots / visual correction | `blockbench-bedrock-modelling` | approved-reference interpretation, primary masses, silhouette/depth, causal correction, visual gate |
| texture / Paint / PBR / material instance | `blockit-bedrock-texturing` | create/read/activate texture, pixel editing, TextureGroups, PBR channels, per-face material metadata |
| animation / keyframes / playback / mapped effects | `blockit-bedrock-animation` | inspect/create animation, BoneAnimator transforms, timeline, batch/copy operations, animation-facing rig checks |

A long asset task may move modelling → texturing → animation as stages become active. Do not preload all specialists.

Do **not** route ordinary reference/asset authoring through `development-brief`, repository history, or engineering skills.

## 2. Repository / Plugin Development

Use for source, docs, CI, plugin/MCP implementation, architecture, or repository maintenance.

Every non-trivial create/change task starts with:

`/.agents/skills/development-brief/SKILL.md`

If a reproduced defect names a mapped MCP tool, consult `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** first.

Add at most one engineering specialist when it materially helps the causal boundary:

| Semantic owner | Skill | Trigger examples | Do not select merely because… |
|---|---|---|---|
| MCP public/schema/result/registration/transport | `mcp-server-development` | Zod inputs, tool/resource/prompt registration, annotations, result semantics, endpoint contract | implementation is TypeScript/Bun or calls Blockbench |
| Blockbench runtime/API/lifecycle | `blockbench-runtime-development` | plugin lifecycle, UI/settings, globals, Undo/Canvas, mutation mechanics, events/cleanup | an MCP tool manipulates a model |
| modeller/reference judgement policy | `blockbench-bedrock-modelling` | source/policy change about whole-form modelling, pivots, visual validity, correction semantics | Blockbench API executes it |
| TypeScript type system | `typescript-type-safety` | inference, generics, unions/narrowing, declarations, unsafe assertions | file ends in `.ts` |
| Bun build/package/tooling | `bun-tooling` | `Bun.build`, Bun APIs, scripts, dependency/lockfile/build behavior | command starts with `bun` |

If no specialist adds distinct procedure, use `development-brief` alone.

## 3. Boundary Resolution

Choose by the behavior that would still be wrong if implementation technology changed:

```text
reference preparation / generated board wrong
→ blockbench-reference-generator

MCP input/result/registration semantics wrong
→ mcp-server-development

MCP contract correct, Blockbench runtime operation wrong
→ blockbench-runtime-development

Operation works, modelling/reference judgement wrong
→ blockbench-bedrock-modelling

Domain behavior correct, compiler typing wrong
→ typescript-type-safety

Domain behavior correct, Bun build/package behavior wrong
→ bun-tooling
```

Do not stack multiple engineering specialists for one causal boundary.

## 4. Local Acceptance — Only When Reactivated

The first bounded pass is complete. This route is inactive unless `docs/knowledge/next-action.md` explicitly reactivates it.

```text
AGENTS.md
→ next-action.md
→ CONTEXT.md only when stable facts matter
→ operations/local-acceptance-runbook.md
```

Reproduce/classify a failure before selecting its engineering owner.

## 5. Evidence Is Not A Skill

Material uncertainty uses root `AGENTS.md` evidence labels:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Routine work does not need ceremonial tagging.

## 6. Retired / External Helpers

Do not route current work to retired project packages such as:

```text
mcp-builder
typescript-expert
zod
bun-development
blockbench-plugins
historical blockbench-use
conceptual evidence-gate
generic Mesh/Hytale authoring stacks
```

Global/user helpers are not repository assumptions or default requirements.

## 7. Location / Change Rule

- `.agents/skills/` is the only canonical repository-owned skill root.
- Do not repopulate `mcp/.agents/skills/`, `mcp/.github/skills/`, or `mcp/workflow/skills/`.
- Do not add/rename/merge/split skills without a demonstrated reusable ownership gap.

## Final Routing Check

```text
What task class is this?
What exact decision is active?
Which one owner adds necessary procedure?
Am I loading anything only by ritual?
```

If the last answer is yes, stop loading context.
