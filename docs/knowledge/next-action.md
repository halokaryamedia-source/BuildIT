# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Maintain BlockIT as a trustworthy **Minecraft Bedrock Entity MCP for Blockbench** while preserving every capability that genuinely belongs to Bedrock Entity.

Product rule:

> Preserve capability that belongs to Minecraft Bedrock Entity. Generic capability inherited from a broader Blockbench MCP does not need to remain merely for compatibility. A missing MCP mapping for a native Bedrock capability is a protected implementation gap, not deletion permission.

## Current Status

`MCP_LOCATOR_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`

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

Native Bedrock capability coverage:
Locator authored state                                          SOURCE COMPLETE; LOCAL PROOF REQUIRED
Null Object base parent/position state                          SOURCE COMPLETE; LOCAL PROOF REQUIRED
Null Object IK metadata mutation                                DEFERRED — not Bedrock locator geometry

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

## Locator / Null Object Coverage

Direct Locator/Null Object authored-state ownership now remains inside the existing Elements family; no new registration family or generic element framework was introduced.

```text
list_locator_elements   discover Locator / Null Object identity + parent
inspect_element         inspect detailed authored state
manage_locator          create/update Locator parent, position, rotation, ignore_inherited_scale
manage_null_object      create/update Null Object parent + position
rename_element          rename existing element
remove_element          remove existing element
```

Mutation rules:

```text
Bedrock format only
explicit Group/bone parent
UUID-first target resolution
exact unique name fallback only
parent preflight before Undo
one bounded Undo edit
failure after open -> cancel/revert
structured resulting state
```

Null Object is not treated as identical to a normal Locator. Blockbench Bedrock geometry round-trips it through a `_null_` locator entry. `ik_target`, `ik_source`, and `lock_ik_target_rotation` are inspectable editor/animation state but are intentionally not mutation fields in this minimum slice.

## Protected Native Capability Gaps

The following remain Bedrock Entity product requirements even where direct MCP ownership is incomplete:

```text
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

`nodes://` remains temporarily available as broad observability because TextureMesh still lacks a direct authored-state owner. Locator/Null Object coverage alone is not a reason to delete it yet.

## Next Allowed Step

If continuing non-local native-capability work before local Blockbench acceptance becomes available, the next bounded slice is:

```text
TextureMesh official-source audit and minimum direct authored-state coverage
```

Do not reintroduce the removed generic Mesh family as a shortcut; native Bedrock TextureMesh must be mapped from its own Blockbench source contract.

When the local Blockbench environment is available, local acceptance still needs to verify the stateless endpoint plus actual Locator/Null Object create/update/inspect/rename/remove behavior and Bedrock save/reopen/export round-trip before the Locator slice is considered runtime-proven.

P1.5 remains blocked until the required local acceptance boundary is available.
