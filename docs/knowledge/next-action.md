# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Maintain BlockIT as a trustworthy **Minecraft Bedrock Entity MCP for Blockbench** while preserving every capability that genuinely belongs to Bedrock Entity.

Product rule:

> Preserve capability that belongs to Minecraft Bedrock Entity. Generic capability inherited from a broader Blockbench MCP does not need to remain merely for compatibility. A missing MCP mapping for a native Bedrock capability is a protected implementation gap, not deletion permission.

## Current Status

`MCP_PRELOCAL_SURFACE_HARDENING_COMPLETE_LOCAL_PROOF_REQUIRED`

Working branch: **`Local` only**.

Live Blockbench/MCP behavior still requires local proof. Source, CI, and official-source evidence must not be presented as live Blockbench proof.

## Completed Boundary

```text
P0.1–P0.5  stabilization and engineering gates                  COMPLETE
P1.1       default Bedrock Entity registration profile          COMPLETE
P1.2       explicit family gates                                COMPLETE
P1.3       core identity / mutation-result ownership            COMPLETE
P1.4       stateless transport source/non-local proof           COMPLETE; LOCAL PROOF REQUIRED

Pre-local plugin surface:
A  BlockIT product identity                                     COMPLETE
B  truthful exposed/catalog/available panel surface            COMPLETE
C  Tool Test disabled-definition containment                   COMPLETE
D  Bedrock capability surface matrix                           COMPLETE
E  generic semantics narrowing                                 COMPLETE
F  canonical Bedrock Entity MCP prompt                         COMPLETE
G  repository-owned BlockIT agent skill stack                  COMPLETE
H  BlockIT docs/install normalization                          COMPLETE

P1.5       local end-to-end core acceptance                    BLOCKED ON LOCAL ENVIRONMENT
```

## Product Surface

Visible plugin identity:

```text
BlockIT — Bedrock Entity MCP
```

The plugin panel should show only information that directly helps operation:

```text
name
version
active profile
endpoint
transport
truthful exposed/catalog/available counts
```

Do **not** add commit identifiers, build revisions, build channels, or build-fingerprint machinery to the plugin/runtime surface. Git history already owns source revision tracking.

Default profile:

```text
bedrock_entity
```

Dangerous tools remain quarantined:

```text
risky_eval      disabled
from_geo_json   disabled
```

Generic fallback families remain explicit opt-in only.

## Canonical Prompt and Skills

Normal enabled MCP workflow prompt:

```text
bedrock_entity_workflow
```

Maintainer-only prompt references remain disabled from the normal agent-facing MCP surface.

Repository-owned authoring skill routing:

```text
blockit-bedrock-entity-mcp
├── blockbench-bedrock-modelling
├── blockit-bedrock-texturing
└── blockit-bedrock-animation
```

Do not use upstream generic Mesh/Hytale/eval-oriented skills as the canonical BlockIT workflow.

## Protected Native Capability Gaps

The following remain Bedrock Entity product requirements even where direct MCP ownership is incomplete:

```text
Locator / NullObject authoring and inspection
TextureMesh authoring and inspection
native Bedrock visible bounding-box fields
animation controllers
animation sound effects
animation timeline effects
animated-texture authoring
bone-binding expressions
```

Do not emulate these with generic Mesh, arbitrary Cubes, risky evaluation, UI automation, or another format. Audit official Blockbench Bedrock source before implementing a direct owner.

## Current Narrowed Semantics

Normal BlockIT project creation targets only:

```text
bedrock
```

Normal model export supports only:

```text
bedrock  → Minecraft Bedrock geometry JSON
project  → editable Blockbench .bbmodel
```

Generic full-app screenshot and arbitrary editor-camera mutation are not part of the normal default workflow.

`nodes://` remains temporarily available as broad observability while protected Locator/TextureMesh direct owners are still incomplete. Do not treat it as equivalent to authored native support.

## Next Allowed Step

When the local Blockbench environment is available:

1. build branch `Local`;
2. load `mcp/dist/mcp.js` in desktop Blockbench;
3. verify plugin identity/version/profile/endpoint/transport and truthful exposed surface;
4. verify loopback/origin/stateless behavior through the real endpoint;
5. verify default vs extended family behavior and disabled dangerous tools;
6. verify core Cube/Group/Texture/Paint/Animation operations in Blockbench;
7. only after P1.4 local proof is accepted, proceed to P1.5.

Until then, do not expand the pre-local scope merely to keep working. Preserve the current boundary and avoid speculative framework work.
