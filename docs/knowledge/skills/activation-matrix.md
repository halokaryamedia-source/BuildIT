# Skill Activation Matrix

Updated: 2026-08-12

Use this note only to choose the **smallest correct skill owner**. Root `AGENTS.md` decides task class first; detailed procedure lives in the selected `SKILL.md`.

## 1. Asset Authoring Route

Use when the user wants to create, revise, inspect, texture, animate, validate, or export a Bedrock Entity asset and is **not** asking to change repository/plugin source.

Start with:

`/.agents/skills/blockit-bedrock-entity-mcp/SKILL.md`

Then load only the active domain specialist:

| Active decision | Specialist | Examples |
|---|---|---|
| whole form / Cube geometry / hierarchy / pivots / visual correction | `blockbench-bedrock-modelling` | reference interpretation, primary masses, silhouette/depth, local causal correction, visual gate |
| texture / Paint / PBR / material instance | `blockit-bedrock-texturing` | create/read/activate texture, pixel editing, TextureGroups, PBR channels, per-face material metadata |
| animation / keyframes / playback / mapped effects | `blockit-bedrock-animation` | inspect/create animation, BoneAnimator transforms, timeline, batch/copy operations, animation-facing rig checks |

A long end-to-end asset task may move from modelling → texturing → animation as stages become active. Do not preload all specialists at the beginning.

Do **not** route ordinary asset authoring through `development-brief`, repository history, or engineering skills.

## 2. Repository / Plugin Development Route

Use for source, docs, CI, plugin/MCP implementation, architecture, or repository maintenance.

If a reproduced defect names a mapped MCP tool, consult `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** first to identify the initial source owner + primary regression owner. This is bounded navigation only; it does not replace the development contract or authorize loading adjacent tests.

Every non-trivial create/change task starts with:

`/.agents/skills/development-brief/SKILL.md`

Add at most one engineering specialist when it materially helps the proved boundary:

| Semantic owner | Skill | Trigger examples | Do not select merely because… |
|---|---|---|---|
| MCP public/schema/result/registration/transport contract | `mcp-server-development` | Zod MCP inputs, tool/resource/prompt registration, annotations, result semantics, transport/endpoint contract | implementation is TypeScript/Bun or calls Blockbench |
| Blockbench runtime/API/lifecycle mechanics | `blockbench-runtime-development` | plugin lifecycle, UI/settings, globals, Undo/Canvas, runtime mutation mechanics, events/cleanup | an MCP tool manipulates a model |
| modeller judgement / modelling policy | `blockbench-bedrock-modelling` | source/policy change about whole-form modelling, pivots, visual validity, correction semantics | Blockbench API is used to execute it |
| TypeScript type system | `typescript-type-safety` | inference, generics, unions/narrowing, declarations, unsafe assertions, compiler type contract | file ends in `.ts` |
| Bun build/package/tooling | `bun-tooling` | `Bun.build`, Bun APIs, scripts, dependency/lockfile/build behavior | command starts with `bun` |

If no specialist adds distinct procedure, use `development-brief` alone.

## 3. Boundary Resolution

Choose by the behavior that would still be wrong if implementation technology changed:

```text
MCP input/result/registration semantics wrong
→ mcp-server-development

MCP contract correct, Blockbench API/lifecycle operation wrong
→ blockbench-runtime-development

Operation executes correctly, model judgement/policy wrong
→ blockbench-bedrock-modelling

Domain behavior correct, compiler typing itself wrong
→ typescript-type-safety

Domain behavior correct, Bun build/package behavior wrong
→ bun-tooling
```

Do not stack multiple engineering specialists for one causal boundary. If a second independent defect appears, finish/reframe the first boundary before switching owner.

## 4. Local Acceptance Route — Only When Reactivated

Local acceptance is repository continuation, not ordinary asset authoring. The first bounded pass is complete and this route is **inactive unless `docs/knowledge/next-action.md` explicitly reactivates it**.

When reactivated:

```text
AGENTS.md
→ next-action.md
→ CONTEXT.md only when stable facts matter
→ operations/local-acceptance-runbook.md
```

During an acceptance baseline, reproduce/classify a failure before selecting the engineering specialist that owns it. Do not load this route by ritual during normal continuation or asset authoring.

## 5. Reference Preparation Is Not A Root Skill

Source Image/user intent → approved Modelling Brief is owned by:

`docs/foundation/04-reference-guide.md`

Run it on an image-capable surface. Codex consumes the approved brief through the asset-authoring route.

## 6. Evidence Is Not A Skill

Material uncertainty uses root `AGENTS.md` evidence labels:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Routine work does not need ceremonial tagging.

## 7. Retired / External Helpers

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

Global/user helpers may be used only when their distinct function is actually available and needed; they are not repository assumptions or default routing requirements.

## 8. Location / Change Rule

- `.agents/skills/` is the only canonical repository-owned skill root.
- Do not repopulate `mcp/.agents/skills/`, `mcp/.github/skills/`, or `mcp/workflow/skills/`.
- Do not add/rename/merge/split skills without a current reusable ownership gap that existing owners cannot represent cleanly.

## Final Routing Check

Before loading a skill ask:

```text
Is this asset authoring or repository/plugin work?
What exact decision/behavior is active?
Which current owner adds procedure that AGENTS alone does not provide?
Am I loading context because it changes the decision, or by ritual?
```

If the answer to the last question is “ritual”, do not load it.
