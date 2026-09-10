# BlockIT Implementation Map

Updated: 2026-09-10

This file maps **current source ownership**. It contains no active task status, roadmap, or proof interpretation. Continuation belongs in `next-action.md`; proof belongs in `current-validation.md`.

## Runtime Architecture

```text
Codex / AI client
→ mcp/gateway/index.ts
→ mcp/gateway/backend.ts
→ loopback Runtime transport
→ mcp/server/**
→ Blockbench native APIs
```

Gateway client surface remains four tools: `status`, `search_capabilities`, `describe_capability`, `invoke_capability`.

Active source surfaces after retirement of the old 3D-assisted route:

```text
callable union has **54 tools**
Geometry/Texturing share **47** AUTHORING tools
Animation exposes **20** tools
```

The generated API snapshot still has **68 declared source ToolSpecs** until the next canonical `LOCAL_CODE` generator pass removes the two retired compatibility descriptors. Those descriptors are excluded from every active phase surface and are not current authoring capabilities.

## Authoring Ownership

| Domain | Semantic owner | Runtime/source owner |
| --- | --- | --- |
| Geometry / rig / pivots / UV Layout | `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | `mcp/server/tools/cubes.ts`, `mcp/server/tools/element.ts`, `mcp/server/tools/locators.ts`, animation rig subset |
| Texture / Painter / PBR | `.agents/skills/blockit-bedrock-texturing/SKILL.md` | `mcp/server/tools/texture.ts`, `paint.ts`, material owners |
| Animation / motion / effects/controllers | `.agents/skills/blockit-bedrock-animation/SKILL.md` | `mcp/server/tools/animation*.ts`, particle/controller owners |
| Asset routing / phase gate | `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` | `mcp/lib/authoringPhase.ts`, `mcp/server/tools.ts` |
| Reference image generation | `.agents/skills/blockbench-reference-generator/SKILL.md` | ChatGPT image generation; no Runtime authoring owner |

Normal Geometry is the native Group/Cube path. Retired Hunyuan/PrimitiveAnything/materialization source is not an active owner.

## Gateway Owners

| Concern | Owner |
| --- | --- |
| stable four-tool stdio boundary | `mcp/gateway/index.ts` |
| Runtime connection/catalog/queue/project affinity | `mcp/gateway/backend.ts` |
| capability priority/result compaction/runtime signature | `mcp/gateway/contract.ts` |
| project/phase affinity headers | `mcp/gateway/projectAffinity.ts` |
| branch-specific schema reduction | `mcp/gateway/schemaProjection.ts` |
| local vanilla entity support reference | `mcp/gateway/vanillaEntityReference.ts` |

## Build / Generated Ownership

MCP TypeScript/Bun implementation mechanics are owned by `mcp/AGENTS.md` + the actual build/test source, not separate generic Skills.

Developer loop: `dev:watch`, prompt watch regeneration, `deploy:local`, and `dev:sync` are owned by:

```text
mcp/build/index.ts
mcp/build/watch-policy.ts
mcp/scripts/deploy-local.ts
mcp/tests/developer-loop.test.ts
```

Generated API docs are owned by canonical ToolSpecs + `mcp/build/docs.ts`; runtime prompt manifest is owned by `mcp/prompts/*.md` + `mcp/build/generate-manifest.ts`. Never hand-edit generated output.

## Hot-Path Defect Index

Use this table before broad search for named MCP defects.

| Capability / symptom | Primary source owner | Primary regression owner |
| --- | --- | --- |
| `create_project` | `mcp/server/tools/project.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `inspect_model_bounds` | `mcp/server/tools/project.ts` | `mcp/tests/rendered-model-bounds-numeric-safety.test.ts` |
| `manage_cubes` geometry create/update/correction | `mcp/server/tools/cubes.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `inspect_elements` routing/detail | `mcp/server/tools.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `capture_model_views` | `mcp/server/tools/camera.ts` | `mcp/tests/camera-framing-contract.test.ts` |
| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |
| project/tab affinity | `mcp/gateway/backend.ts`, `mcp/server/net.ts` | `mcp/tests/project-affinity-*.test.ts` |
| phase surface / handoff | `mcp/lib/authoringPhase.ts`, `mcp/server/tools.ts` | `mcp/tests/authoring-phase-surface.test.ts` |
| UV atlas/template | `mcp/server/tools/texture.ts`, `mcp/lib/boxUvLayout.ts` | texture/UV contract tests |
| native Painter lifecycle | `mcp/server/tools/paint.ts` | paint executor/runtime tests |
| Animation timeline | `mcp/server/tools/animation.ts`, `mcp/server/tools.ts` | animation timeline/mutation tests |
| Animation controller composition | `mcp/server/tools/animation-controller.ts` | controller contract tests |
| Particle document/preview | `mcp/server/tools/particle.ts` | particle contract tests |

## Current Capability Notes

`manage_animation_timeline` consolidates keyframe/graph/timeline/batch/copy/property authoring. Animation Controller blend-transition curves are available through the controller composition owner.

`paint_texture_transaction` is the exact bounded pixel/transaction route. Native brush/stroke tools remain separate and should not be inferred from transaction success.

`manage_render_profile` owns visual render-profile integration only when that file-backed integration is explicitly requested; normal preview does not require an RP graph.

## Proof / Efficiency Boundary

**Static Footprint** is a source/schema guardrail and cannot upgrade static evidence into live/native/visual proof. **Authoring Efficiency** means Cost to Accepted Result after quality passes.

Source/tests can prove contracts and deterministic routing. Installed build identity, native Undo/playback/persistence, actual visual fidelity, and whole-task model usage require the matching higher execution context.
