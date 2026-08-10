# BuildIT Agent Skills

This directory contains repository-owned skills. For normal Minecraft Bedrock Entity work through the BlockIT MCP, use the BlockIT routing below rather than the upstream generic `blockbench-mcp-project` skills verbatim.

## Bedrock Entity authoring

1. **`blockit-bedrock-entity-mcp`** — mandatory MCP workflow orchestrator for asset creation/modification/export.
2. **`blockbench-bedrock-modelling`** — existing whole-form/Cuboid/hierarchy/pivot modelling specialist.
3. **`blockit-bedrock-texturing`** — textures, Paint, PBR, material instances.
4. **`blockit-bedrock-animation`** — Bedrock BoneAnimator/keyframe/effect workflow.

Load the orchestrator first for substantive MCP work, then the domain skill(s) needed by the request.

## Maintainer/development skills

- `blockbench-runtime-development` — Blockbench plugin/runtime/API implementation defects.
- `mcp-server-development` — MCP registration/schema/result/server implementation.
- `bun-tooling` — Bun build/package tooling.
- `typescript-type-safety` — TypeScript type-system issues.
- `development-brief` — repository development planning/brief work.

Maintainer skills are not a substitute for the Bedrock asset-authoring workflow.

## Deliberate exclusions

There is no BlockIT Hytale skill and no generic Mesh modelling skill. Native Bedrock `TextureMesh` remains a protected capability gap distinct from generic Blockbench `Mesh`; it must receive an official-source-backed direct mapping rather than reintroducing the generic Mesh workflow.
