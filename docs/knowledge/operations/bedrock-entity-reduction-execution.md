# Bedrock Entity Reduction Execution

Updated: 2026-08-10

This note is the execution bridge from the official-source capability audit to source deletion. It does not replace the ordered stabilization plan.

## Current safe deletion boundary

Delete only capability families proven outside native Blockbench Bedrock Entity:

```text
mcp/server/tools/mesh.ts
mcp/server/tools/armature.ts
mcp/server/tools/uv.ts        # current family is mesh-only
mcp/server/tools/hytale.ts
mcp/server/resources/hytale.ts
mcp/server/prompts/hytale.ts
mcp/lib/hytale.ts
```

Remove their registration and docs-manifest ownership in the same source slice.

## Preserve during this slice

```text
Cube/Cuboid
Group/bone hierarchy
Cube UV
TextureMesh
Locators
Bounding boxes
Animation / animation controllers
Texture / Paint
PBR
material_instance semantics
History / Undo
canonical model capture
Bedrock current-format export
```

## Follow-up mixed-owner cleanup

After the dedicated families are gone, inspect retained shared tools and remove generic-Mesh branches only where they existed solely to serve the deleted `Mesh` surface. Examples include element discovery/selection, project counts, texture application, and generic lookup helpers.

Do not remove a shared capability merely because it mentions `Mesh`; prove that the branch has no Bedrock TextureMesh or retained workflow responsibility first.

## Acceptance

The deletion slice is acceptable when:

```text
removed families are no longer registered
removed families are absent from docs manifest
production build still succeeds
focused P0 contract tests still succeed
full typecheck error surface is reduced without weakening strictness
no retained native Bedrock Entity capability is deleted
```

Generated documentation remains a later P0.5 freshness owner; do not hand-edit generated files in this reduction slice.
