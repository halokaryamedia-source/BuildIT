# BuildIT Agent Skills

This directory contains repository-owned skills. Use root `AGENTS.md` + the Activation Matrix to select the smallest owner; do not load all skills together.

## Reference preparation

- **`blockbench-reference-generator`** — image-capable pre-modelling skill that turns an actual source image into one Minecraft / Blockbench-style multi-view Modelling Brief image. Image-only; no MCP, ZIP, manifest, or production-doc package.

After user approval, pass the actual image to the normal Bedrock authoring route.

## Bedrock Entity authoring

1. **`blockit-bedrock-entity-mcp`** — mandatory MCP workflow orchestrator for asset creation/modification/export.
2. **`blockbench-bedrock-modelling`** — whole-form/Cuboid/hierarchy/pivot modelling and actual-reference grounding specialist.
3. **`blockit-bedrock-texturing`** — textures, Paint, PBR, material instances.
4. **`blockit-bedrock-animation`** — Bedrock BoneAnimator/keyframe/effect workflow.

Load the orchestrator first for substantive MCP work, then only the domain skill needed by the current stage.

## Maintainer/development skills

- `blockbench-runtime-development` — Blockbench plugin/runtime/API implementation defects.
- `mcp-server-development` — MCP registration/schema/result/server implementation.
- `bun-tooling` — Bun build/package tooling.
- `typescript-type-safety` — TypeScript type-system issues.
- `development-brief` — repository development planning/brief work.

Maintainer skills are not substitutes for reference generation or Bedrock asset authoring.

## Deliberate exclusions

There is no BlockIT Hytale skill and no generic Mesh modelling skill. Native Bedrock `TextureMesh` remains a protected capability gap distinct from generic Blockbench `Mesh`; it must receive an official-source-backed direct mapping rather than reintroducing the generic Mesh workflow.
