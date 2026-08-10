# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Stabilize and reduce the BlockIT MCP into a trustworthy **Minecraft Bedrock Entity** MCP before normal feature hardening resumes.

The product decision is now explicit:

> BlockIT does not need to preserve generic Blockbench capability families merely because they existed in the inherited MCP. Capability that is unrelated to native Minecraft Bedrock Entity should be removed rather than type-hardened. Deletion must still be grounded in official Blockbench source so native Bedrock capabilities are not removed by mistake.

P0.1–P0.3 are implemented in source. P0.4 engineering-gate infrastructure is implemented and executable. P0.4 remains active because the retained package still fails full `tsc --noEmit`; however the error surface has been materially reduced by removing capability families officially proved outside native Bedrock Entity.

## Current Status

`MCP_P0_BEDROCK_ENTITY_REDUCTION_DONE_RETAINED_TYPECHECK_NEXT`

Execution channel: **ChatGPT → GitHub**.  
Live Blockbench/MCP behavior remains local proof where applicable.

## Governing Evidence

Primary audit:

```text
docs/knowledge/reviews/mcp-development-quality-audit.md
```

Ordered stabilization plan:

```text
docs/knowledge/operations/mcp-reduction-stabilization-plan.md
```

Official-source Bedrock capability audit:

```text
docs/knowledge/reviews/bedrock-entity-capability-surface-audit.md
```

Safe reduction execution note:

```text
docs/knowledge/operations/bedrock-entity-reduction-execution.md
```

The user-approved Bedrock-only product decision changes how P0.4 typecheck debt is handled: do not repair families that should not remain in the product. First remove only capabilities proved unrelated to native Bedrock Entity, then make the retained package pass the full engineering gate.

# Product Boundary

Default/retained BlockIT MCP target:

```text
Minecraft Bedrock Entity
Geometry: Cube/Cuboid only for BlockIT modelling
Rig: Group hierarchy / Cuboid children
Animation: Group/BoneAnimator
Texture: minimum proven Bedrock Entity outcomes
Execution: local desktop Blockbench service
```

The official Blockbench Bedrock format is broader than BlockIT's Cube-only modelling policy. Native optional Bedrock capabilities must not be confused with generic legacy families.

## Official Blockbench Bedrock capability evidence

Official source reviewed:

```text
JannisX11/blockbench
js/formats/bedrock/bedrock.js
js/formats/bedrock/bedrock_animation.js
js/io/format.ts

JannisX11/blockbench-plugins/plugins.json
```

Native `bedrock` format explicitly enables, among other features:

```text
rotate_cubes
box_uv / optional_box_uv
uv_rotation
single_texture
bone_rig
animated_textures
animation_files
animation_mode
animation_controllers
bone_binding_expression
locators
texture_meshes
bounding_boxes
pbr
```

The native format does **not** enable generic:

```text
meshes
armature_rig
splines
billboards
```

Official Bedrock geometry codec serializes Group/bone children as:

```text
Cube
Locator / NullObject locator data
TextureMesh
```

Generic `Mesh` is not the same as Bedrock `TextureMesh`.

Official plugin-registry evidence separately exposes `Meshy` to enable generic meshes in Bedrock formats, and Hytale contributes separate `hytale_character` / `hytale_prop` formats. This supports removing generic Mesh and Hytale from BlockIT's native Bedrock Entity surface.

## Native/retained capabilities that must not be deleted from the first reduction

Preserve until a narrower product audit proves otherwise:

```text
Cube/Cuboid
Group-as-bone hierarchy
Cube UV / UV rotation / box UV
TextureMesh
Locators
Bounding boxes
Animation / animation controllers
animation sound / particle / timeline effects
Texture
Paint
PBR
cube-face material_instance semantics
History / Undo / Redo
canonical model capture
current-format Bedrock export outcome
```

Important: local `material-instances.ts` cannot be deleted merely because its description says Bedrock Block. Official Bedrock geometry source also reads/writes cube-face `material_instance`; treatment requires a narrower audit.

# Completed Foundation Slices

```text
P0.1  loopback + Origin containment
       source commit: 49c7440ed0dbb5f58c879db14543817791044e80

P0.2  dangerous default capability containment
       source commit: 33bd7ab2a9cec674fb2183cb178fa24e1727b4e9
       risky_eval + from_geo_json default-disabled
       risky_eval Stable → Experimental

P0.3  full-schema validation + real annotations
       source commit: 2fec534b0204a33c9b20c536724159018a4b5c38
       complete Zod schema retained and parsed before execute()
       annotations passed through initial + reconstructed registration
```

P0.4 focused regression tests now prove `.refine()` / `.superRefine()` rejection before tool logic in isolated registration fixtures and annotation preservation on both registration paths. Live MCP Inspector/Blockbench behavior remains local proof.

# Active Slice — P0.4 Engineering Gate

Gate owners:

```text
mcp/package.json
mcp/tsconfig.json
mcp/build/check-docs-freshness.ts
mcp/tests/p0-contracts.test.ts
.github/workflows/mcp-verify.yml
```

Implemented package gates:

```text
typecheck   → tsc --noEmit
test        → bun test
build       → production build
docs:check  → generated-doc freshness assertion
```

Root GitHub Actions installs from the committed Bun lockfile, executes all gates, and fails closed through a final aggregator.

## Why P0.4 changed direction

The first real full-package typecheck exposed errors across both Bedrock-relevant source and clearly unrelated legacy families.

The approved response is **not** to weaken strictness, exclude folders, or mass-cast the debt away. It is:

```text
1. audit against official Blockbench Bedrock Entity source;
2. remove capability families that do not belong to the product;
3. retain native Bedrock Entity capabilities even if they still need type work;
4. make the final retained package pass full typecheck.
```

# Bedrock Entity Reduction — Safe First Slice Completed

Official-source audit established the following as outside native Bedrock Entity and safe to remove:

```text
Hytale integration
Generic Mesh MCP family
Armature / ArmatureBone / vertex-weight family
current MCP UV family (it was generic-Mesh-only)
```

## Dedicated source removed

```text
mcp/server/tools/mesh.ts
mcp/server/tools/armature.ts
mcp/server/tools/uv.ts
mcp/server/tools/hytale.ts
mcp/server/resources/hytale.ts
mcp/server/prompts/hytale.ts
mcp/lib/hytale.ts

mcp/prompts/hytale_animation_workflow.md
mcp/prompts/hytale_attachments.md
mcp/prompts/hytale_model_creation.md
```

Registration/docs-manifest ownership was removed at the same time.

## Mixed generic-Mesh cleanup completed

Retained shared Bedrock tools were narrowed where a branch existed only for generic Mesh:

```text
mcp/server/tools/element.ts
  Cube/Group search, selection, outline, duplicate, material filter, selection readback
  no longer expose generic Mesh

mcp/server/tools/element-inspection.ts
  focused authored-state inspection remains Cube/Group only

mcp/server/tools/project.ts
  project orientation no longer reports generic Mesh counts
```

Cube UV was **not** removed; it remains owned by `mcp/server/tools/cubes.ts`.

No TextureMesh, Locator, Animation, Paint, PBR, or material-instance capability was deleted in this slice.

# Executable Proof After Reduction

Latest verification on the completed safe first slice:

```text
frozen-lockfile install     PASS
focused Bun tests           PASS — 4/4, 0 failures
production build            PASS
docs freshness              FAIL — api.json + index.html stale, still P0.5
full retained typecheck     FAIL
workflow final result       FAIL-CLOSED
```

The production docs manifest now collects:

```text
69 tools
3 documented prompts
8 resources
```

Prompt-content manifest scanning dropped from 12 to 9 `.md` prompts after Hytale prompt content was removed.

The full compiler output no longer contains dedicated Hytale, generic Mesh-tool, Armature, or mesh-UV-family errors. Remaining errors are concentrated in retained/shared owners, including:

```text
mcp/lib/factories.ts
mcp/lib/util.ts
mcp/server/tools/animation-inspection.ts
mcp/server/tools/animation.ts
mcp/server/tools/camera.ts
mcp/server/tools/cubes.ts
mcp/server/tools/element.ts
mcp/server/tools/paint.ts
mcp/server/tools/texture.ts
mcp/server/tools/ui.ts
mcp/ui/promptPreviewDialog.ts
mcp/ui/toolTestDialog.ts
```

Do not interpret those retained errors as permission to delete whole families. Animation, Cube geometry, Texture/Paint, etc. are native/relevant Bedrock Entity capabilities and must be type-audited at their real source/API owner.

# Current Work Order

```text
P0.1  loopback + Origin containment              SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default capability containment   SOURCE COMPLETE / LOCAL PROOF PENDING
P0.3  full-schema validation + real annotations  SOURCE COMPLETE / TARGETED REGRESSION PROOF PARTIAL
P0.4  engineering gate + retained typecheck      ← ACTIVE
P0.5  generated-doc freshness                    WAITING — DO NOT START YET

P1.1  default Bedrock Entity registration profile
P1.2  family gates
P1.3  core-only resolver/mutation/result consolidation
P1.4  transport/session future decision
P1.5  local end-to-end core acceptance

P2.*  evidence-driven cleanup and parked product fixes
```

# Next Step — Retained Bedrock Entity Type/Surface Audit Only

Do **not** start P0.5 yet.

Next work must inspect the remaining compiler owners against official Blockbench source and the actual BlockIT Bedrock Entity workflow, then classify each remaining surface as:

```text
KEEP + fix type contract
TRIM to the Bedrock Entity responsibility
REMOVE only when official/product evidence proves it is unrelated
```

Immediate priority owners:

```text
mcp/lib/factories.ts              # shared MCP typing owner
mcp/lib/util.ts                   # shared Blockbench API typing owner
mcp/server/tools/cubes.ts         # core geometry
mcp/server/tools/animation*.ts    # native Bedrock animation
mcp/server/tools/texture.ts       # native Bedrock texture/PBR, with generic-Mesh branch still requiring focused trim
mcp/server/tools/paint.ts         # Bedrock-relevant; audit actual minimum product need
mcp/server/tools/ui.ts            # generic UI fallback; audit keep/remove separately
```

A second Entity-only surface audit may also evaluate non-core format/general-purpose leftovers such as Java/Bedrock-Block prompt branches, arbitrary project formats, generic codec/path export, `risky_eval`, `from_geo_json`, and generic UI automation. Do not delete those silently without their direct product/source proof.

## Proof Boundary

GitHub Actions/package tests prove compile/build and isolated MCP contracts that do not require Blockbench globals.

Actual OS listener state, live MCP Inspector behavior, Blockbench runtime behavior, Undo/Redo semantics, playback, export/save/reopen, and end-to-end modelling remain `LOCAL PROOF REQUIRED` where applicable.
