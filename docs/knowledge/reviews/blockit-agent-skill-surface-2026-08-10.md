# BlockIT Agent Skill Surface

Updated: 2026-08-10

## Decision

Do not install or copy `jasonjgardner/blockbench-mcp-project` as the canonical BlockIT skill layer. It is useful upstream reference material, but it describes a broader generic Blockbench MCP surface than BlockIT now exposes by default.

Upstream audit covered the published skills for generic Blockbench use, MCP overview, modelling, texturing, PBR, animation, Hytale, and plugin development.

## Replacement map

| Upstream skill | BlockIT treatment |
|---|---|
| `blockbench-use` | Replace with `blockit-bedrock-entity-mcp` orchestrator. |
| `blockbench-mcp-overview` | Replace with the orchestrator + Bedrock capability surface matrix/current MCP docs. |
| `blockbench-modeling` | Replace generic Mesh/Cube guidance with existing `blockbench-bedrock-modelling` specialist. |
| `blockbench-texturing` | Replace Mesh-UV/generic guidance with `blockit-bedrock-texturing`. |
| `blockbench-pbr-materials` | Fold native Bedrock PBR into `blockit-bedrock-texturing`; do not treat PBR as a separate generic product. |
| `blockbench-animation` | Replace with `blockit-bedrock-animation`, which uses current BlockIT identity/inspection contracts and protected-gap rules. |
| `blockbench-hytale` | Excluded from BlockIT product surface. |
| `blockbench-development` / `blockbench-plugins` | Maintainer-only analogue is existing `blockbench-runtime-development`; not loaded for normal asset authoring. |

## Why the upstream orchestrator cannot be canonical here

Its generic workflow references capabilities that are intentionally outside or disabled in normal BlockIT, including generic Mesh/freeform paths, Hytale, broad formats, risky evaluation as a fallback, arbitrary export codecs, full-app/UI automation, and tool names removed with the generic Mesh UV surface.

Keeping those instructions installed beside a Bedrock-only MCP would teach the agent to request tools the server no longer exposes, or worse, to treat quarantined/generic fallback paths as normal recovery behavior.

## BlockIT authoring stack

```text
blockit-bedrock-entity-mcp        workflow/surface authority
  ├─ blockbench-bedrock-modelling whole-form/Cuboid/hierarchy judgement
  ├─ blockit-bedrock-texturing    texture/Paint/PBR/material_instance
  └─ blockit-bedrock-animation    BoneAnimator/keyframes/mapped effects
```

Maintainer-only skills remain separate.

## Capability-gap rule

Skills must not hide native Bedrock gaps. Locator/NullObject, TextureMesh, native bounding-box fields, animation controllers, sound/timeline effects, animated-texture authoring, and bone-binding expressions remain protected when direct MCP ownership is incomplete.

A future skill update may document those features **only after** the corresponding current BlockIT tool/resource contract is implemented and audited. Do not resurrect generic Mesh/UI/eval instructions to simulate them.
