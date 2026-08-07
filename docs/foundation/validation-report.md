# BlockIT Foundation Validation Report

Date: 2026-07-22

Scope: first-party Blockbench docs, Blockbench source/release notes, and MCP specification docs only.

## Functional Map

- Product Intent: `01-project-overview.md`, `02-product-requirements.md`
- Operating Model: `03-modelling-workflow.md`, `04-reference-guide.md`, `05-geometry-standard.md`, `06-texture-standard.md`, `07-visual-validation.md`
- Agent Policy: `00-agent-policy.md`

## Findings

| Claim | Status | Evidence | Notes |
|---|---|---|---|
| Blockbench provides a Bedrock-oriented modeling format and exports Bedrock geometry, Bedrock animation, and `.bbmodel` project files. | Verified | [Blockbench Formats](https://www.blockbench.net/wiki/blockbench/formats/), [Bedrock Modeling and Animation](https://www.blockbench.net/wiki/guides/bedrock-modeling/), [Blockbench source strings](https://github.com/JannisX11/blockbench/blob/master/lang/en.json) | The Bedrock format and `.bbmodel` project file are both first-party concepts. |
| `.bbmodel` is the Blockbench project file / save format. | Verified | [Blockbench source strings](https://github.com/JannisX11/blockbench/blob/master/lang/en.json), [Blockbench releases](https://github.com/JannisX11/blockbench/releases) | The source strings explicitly label it as the project file. |
| Blockbench supports the core Bedrock workflow for geometry, UV mapping, texturing, and animations. | Verified | [Bedrock Modeling and Animation](https://www.blockbench.net/wiki/guides/bedrock-modeling/), [Minecraft Style Guide](https://www.blockbench.net/wiki/guides/minecraft-style-guide/), [Blockbench Formats](https://www.blockbench.net/wiki/blockbench/formats/) | The docs cover bone structure, shape, UV, textures, and animation creation. |
| Minecraft-style guidance in Blockbench emphasizes low element count and preserving pixel ratio in UV mapping. | Verified | [Minecraft Style Guide](https://www.blockbench.net/wiki/guides/minecraft-style-guide/) | This matches the foundation docs that prefer simple geometry and aligned UVs. |
| Blockbench has a built-in live 3D preview and texture preview area, but final renders are done in external programs. | Verified | [Blockbench Overview & Tips](https://www.blockbench.net/wiki/guides/blockbench-overview-tips/), [Rendering Models](https://www.blockbench.net/wiki/guides/model-rendering/) | Preview exists; final rendering is separate. |
| MCP HTTP transports must validate `Origin`, should bind to `localhost` when local, and should implement authentication. | Verified | [MCP Transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports), [MCP Authorization](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization), [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) | This directly supports the foundation's safe-by-default transport assumptions. |
| Unprotected local MCP servers are exposed to DNS rebinding and local-compromise risks. | Verified | [MCP Transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports), [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) | This is a real security requirement, not a style preference. |
| Blockbench plugins are JavaScript files registered through Blockbench's plugin system and can be tested/reloaded inside Blockbench. | Verified | [Creating a Plugin](https://www.blockbench.net/wiki/docs/plugin/) | This supports the foundation's plugin/integration assumptions. |
| Completion should require visual validation / preview review as a product rule. | Needs validation | No first-party source found that mandates this as a general Blockbench or MCP rule. | Blockbench docs confirm preview and screenshot tools exist, but not that this must be a universal completion gate. |
| Full `.bbmodel` round-trip behavior, including exact reopen fidelity and texture-assignment persistence, is guaranteed. | Needs validation | First-party docs show save-project support, but they do not fully specify round-trip invariants. | This should remain an assumption until tested against the actual workflow. |

## Bottom Line

- The core technical premises are supported: Blockbench Bedrock modeling, `.bbmodel` project files, geometry/UV/texture/animation workflows, and MCP transport security assumptions are all backed by primary sources.
- The weak spots are operational, not conceptual: visual completion rules and exact `.bbmodel` reopen fidelity are still assumptions and should stay marked `Needs Validation`.
- I did not find a first-party contradiction that invalidates the foundation as written; the main issue is where the docs currently treat project policy as if it were proven product behavior.

## Foundation Decisions

### Keep

- BlockIT is a Blockbench Bedrock modelling workflow driven by Codex through MCP.
- `.bbmodel` is the correct project-save format to use as the foundation file type.
- Geometry-first, UV, texture, and animation workflow rules are consistent with Blockbench guidance.
- MCP transport security should be treated as a first-class concern.

### Keep As Product Policy

- Visual review should remain a completion gate for this project.
- The workflow should stay short, explicit, and minimal.
- Anything unverified should stay labeled `Needs Validation`.

### Keep But Recheck Later

- Exact `.bbmodel` round-trip fidelity.
- Any automatic preview or screenshot pipeline.
- Any Blockbench-to-MCP integration assumption that has not been proven in the target repo.

### Defer Or Discard

- Claims that automatic visual validation already exists.
- Any preview scoring or screenshot-based auto-correction path; similarity
  scoring is explicitly rejected for this workflow.
- Any extra workflow or standard that is not needed for the first minimal implementation.

## Research Evidence

The following project-specific evidence was collected from primary sources and
is retained here as the validation record:

| Claim | Status | Evidence |
|---|---|---|
| Bedrock formats support geometry, hierarchy, per-face UV, box UV, multiple textures, bone rotations, cube rotations, animations, texture animations, and MoLang. | Verified | [Blockbench Formats](https://www.blockbench.net/wiki/blockbench/formats/) |
| `.bbmodel` is the Blockbench project/save format. | Verified | [Blockbench language strings](https://github.com/JannisX11/blockbench/blob/master/lang/en.json), [Blockbench releases](https://github.com/JannisX11/blockbench/releases) |
| Blockbench has live 3D and texture preview capability. | Verified | [Blockbench FAQ](https://www.blockbench.net/wiki/blockbench/faq/), [Blockbench Overview & Tips](https://www.blockbench.net/wiki/guides/blockbench-overview-tips/) |
| Automatic screenshot, camera-switching, similarity-scoring, and auto-correction pipelines are available by default. | Rejected | Preview and screenshots may be available, but similarity scoring and auto-correction are not accepted as evidence in this workflow. |
| Full `.bbmodel` round-trip fidelity is guaranteed across all model data. | Needs Validation | First-party docs confirm save-project support but do not guarantee complete round-trip preservation. |
| Blockbench's MCP integration is documented in first-party Blockbench sources. | Needs Validation | No first-party documentation confirming the target MCP integration path was found. |

