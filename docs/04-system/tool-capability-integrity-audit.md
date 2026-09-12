# LazyDesigner Tool Capability Integrity Audit

Updated: 2026-09-12
Scope: `Local` source/static audit only. No Bun/typecheck/live Blockbench claims.

## Question

Did historical line/context/tool-surface compaction reduce the actual authoring intelligence or quality of LazyDesigner tools?

## Audit Rule

Source line count is not a quality metric. This audit checks whether each active capability family still retains:

- input schema depth and operation-specific constraints;
- preflight before mutation;
- no-op / ambiguity rejection where relevant;
- native Blockbench semantics;
- Undo / rollback ownership;
- deterministic identity targeting;
- bounded batching where the domain needs it;
- continuation/evidence output needed by the next decision;
- domain intelligence added through canonical runtime wiring;
- retained executor branches behind consolidated public routes.

A change is classified as:

```text
INTACT
  active capability retains its meaningful implementation/guards

COMPACTED_NO_LOSS
  prose or duplicate output was reduced without removing runtime behavior

INTENTIONAL_SCOPE_REDUCTION
  capability/element type/path was deliberately retired or excluded

LOCAL_VERIFICATION_REQUIRED
  source looks complete but current-head runtime behavior is not proven
```

## Executive Verdict

No evidence was found that the historical context/line compaction broadly damaged the active Geometry, Texture/Painter/PBR, Animation, Particle, Material, Inspection, Export, History, Camera, or Locator implementations.

The major compaction work was mostly one of these:

1. shorten descriptions while leaving Zod schemas/refinements/runtime validation intact;
2. remove exact duplicate response aliases while retaining authoritative structured state;
3. move intelligence into dedicated helper/wiring modules;
4. hide low-level executors behind consolidated semantic capabilities without deleting their definitions;
5. reduce repeated reads/context rather than reduce native authoring semantics.

However, there **are intentional historical scope reductions**. These must not be mislabeled as zero-loss refactors:

- generic authored `Mesh` branches were removed from Element discovery/selection/outline/duplication/material lookup paths;
- `manage_geometry_reference` is retired from active phase surfaces;
- `materialize_3d_assisted_scaffold` is retired from active phase surfaces;
- generic UI/import fallback families are excluded from normal Bedrock authoring by design;
- legacy `apply_texture` remains compatibility/support rather than the normal authoring route.

The first item (generic authored Mesh) is the most important product decision to revisit if LazyDesigner is expected to own true Cube+Mesh hybrid Bedrock authoring.

## Historical Compaction Forensics

### Duplicate wire/result compaction — COMPACTED_NO_LOSS

Historical cleanup removed exact duplicate Cube result aliases while retaining authoritative `before`, `after`, and `geometry_effect` state. History JSON pretty-printing was also removed. No mutation branch or validation was deleted by that cleanup.

A later generic structured-result compactor only replaces a single text item when that text is byte-for-byte the JSON serialization of `structuredContent`; the structured payload remains intact. Images and intentionally different summaries are preserved.

### Context/description reduction — COMPACTED_NO_LOSS

Historical payload cleanup explicitly targeted descriptions/schema prose rather than Zod constraints. Current source still contains the actual refinements/defaults/operation unions, and runtime validation remains the authority.

Examples verified in current source:

- Cube finite bounds, pivot/rotation requirements, batch UUID targeting, UV branches;
- Texture template/blank separation, deterministic source validation, PBR exclusivity rules;
- Animation keyframe/time/interpolation/Bezier/Molang constraints;
- Animation effect/controller operation-specific required/allowed fields;
- Render-profile atomic filesystem staging/rollback;
- Particle document and write-revision safety;
- Locator export-key collision protection and no-op rejection.

### Consolidation — COMPACTED_NO_LOSS

Public consolidated capabilities are routing-only:

```text
inspect_elements
  → list_outline | find_elements_by_criteria | inspect_element

manage_material
  → create_pbr_material | configure_material | assign_texture_channel | save_material_config

manage_animation_timeline
  → manage_keyframes | animation_graph_editor | animation_timeline | batch_keyframe_operations | animation_copy_paste

manage_material_instances
  → list | get | set | bulk_set | clear executors
```

The original executor definitions remain in the canonical registry and are disabled from duplicate public exposure. Consolidation must not be used as permission to simplify/delete executor algorithms.

## Active Runtime Intelligence Wiring

Current Runtime bootstrap wires intelligence exactly once into the existing canonical definitions:

```text
wireAuthoringQualityIntelligence
wireTextureQualityRuntime
wireTextureAuthoringRuntime
wireTextureAlphaRuntime
wireAnimationNativeIntelligence
wireAnimationControllerNativeIntelligence
wireAnimationRuntimeResourceIntelligence
```

This means source size moved out of the primary tool files is not evidence of lost intelligence.

`quality-intelligence.ts` currently contributes bounded read-only evidence such as:

- geometry hygiene;
- surface-quality summary;
- rig graph;
- projected reference-envelope diagnostics when applicable;
- texture color profile;
- texture optimization/coverage evidence;
- root-motion analysis;
- animation-quality analysis.

These augmentations remain evidence-only and do not create approval/PASS authority.

## Family Integrity Matrix

| Family / canonical route | Integrity | Audit result |
| --- | --- | --- |
| Project lifecycle | INTACT | Unsaved-work protection, native Bedrock project creation, lifecycle/resolution/count output retained. |
| Project bounds | INTACT | Rendered-current-pose bounds, hidden/rendered counts, pose context and warnings retained. |
| Cube authoring (`manage_cubes`) | INTACT | Create/update/batch/simplify branches, explicit targeting, finite transforms, pivot/rotation guards, UV state and geometry-effect evidence retained. |
| Groups / hierarchy | INTACT | Batch Group creation, rename synchronization, reparent cycle/self/no-op protection, native Undo retained. |
| Generic authored Mesh | INTENTIONAL_SCOPE_REDUCTION | Historical Element Mesh branches were explicitly removed; no current normal Mesh authoring owner was found. |
| Element inspection (`inspect_elements`) | INTACT | Outline/search/detail executors retained; detailed Cube/Group/Locator/NullObject inspection and UV/texel diagnostics retained. |
| Locator / Null Object | INTACT | Explicit parent, export-key collision checks, finite transforms, no-op rejection, native preview update and Undo retained. |
| Texture lifecycle | INTACT | Blank/template modes, UV template controls, deterministic image source, texture group/channel/render state retained. |
| UV / texture diagnostics | INTACT | Face mapping, aspect/density/coverage/seam/PBR diagnostics remain in inspection/quality helpers. |
| Native Painter tools | INTACT | Fill/shape/gradient/picker/copy/eraser/brush/settings/presets/selection/layers retained; Painter owns stroke semantics/Undo. |
| Exact texture transaction | INTACT | Revision-protected bounded bitmap mutation, one Undo, optional verified PNG persistence retained. |
| PBR material (`manage_material`) | INTACT | Create/configure/channel/save executors retained; color/texture, MER, normal/height exclusivity rules retained. |
| Material instances | INTACT | Read/set/bulk/clear, explicit preflight, final-face dedupe, no-op rejection, one Undo retained. |
| Render profile | INTACT | Inspect/bind/set-slot/assign/unassign, parse/serialize diagnostics, atomic paired file writes and rollback retained. |
| Animation clip creation | INTACT | Explicit authored transforms, numeric/Molang ownership and optional effects remain. |
| Animation timeline (`manage_animation_timeline`) | INTACT | Keyframes, graph/easing, timeline/property, batch and copy/paste executor branches retained. |
| Bone rigging | INTACT / SUPPORT | All historical actions remain; discovery is now support because canonical Geometry owners handle common create/parent/delete/rename/pivot routes. IK/mirror capability remains. |
| Animation effects | INTACT | Particle/sound/timeline add/update/remove, exact identity, full batch simulation, collision/no-op checks and bounded batch retained. |
| Animation controller | INTACT | State/transition/animation/effect mutation schemas, authored scripts/blends, project-format checks and native/runtime intelligence retained. |
| Animation inspection/intelligence | INTACT | Focused inspection plus native quality/runtime-resource augmentation retained. |
| Particle | INTACT | Lossless JSON operations, bounded batches, source/write revision protection, texture dependency handoff and optional native preview retained. |
| Camera / model evidence | INTACT | Deterministic offscreen canonical captures retained; generic app/camera helpers are not the normal path. |
| History | INTACT | Native Undo/Redo/history/checkpoint semantics retained; formatting compaction did not remove state. |
| Export | INTACT | Native codec compile, extension/overwrite safeguards, file verification and native lifecycle `afterSave` verification retained. |
| UI/import fallback | INTENTIONAL_SCOPE_REDUCTION | Extended/maintenance compatibility only; intentionally excluded from normal Bedrock authoring. |
| 3D-assisted reference/scaffold | INTENTIONAL_SCOPE_REDUCTION | Two legacy 3D-assisted capabilities are retired from active phase surfaces by current product design. |

## Specific Historical Reduction: Generic Mesh

A historical commit explicitly removed generic `Mesh` branches from Element tools. The change removed Mesh from:

- element type discovery;
- selected-type operations;
- outline traversal/counts;
- duplication/cloning;
- material lookup result types;
- selected-element reporting.

Current source search does not show a replacement direct authored `Mesh`/`MeshFace` capability. References to `.mesh` on Cubes are preview/render objects, not generic authored Mesh ownership.

Therefore this was a **real capability scope reduction**, not just context compaction.

Do not restore it automatically. First decide whether current LazyDesigner product scope is intentionally Cube/Cuboid-only or should again support authored Cube+Mesh hybrid assets. If hybrid authoring is required, design a dedicated native Mesh capability owner rather than re-inserting generic legacy branches into Element tools.

## Specific Historical Reduction: 3D-Assisted Path

Current product docs explicitly define one native Geometry authoring path and retire the old 3D-assisted/Hunyuan/PrimitiveAnything path. Current phase classification excludes:

```text
materialize_3d_assisted_scaffold
manage_geometry_reference
```

This is current intentional product scope, not an accidental line-trimming regression.

## Known Non-Loss Efficiency Changes

The following are not capability loss:

- compacting identical `structuredContent` text duplication;
- removing pretty-print whitespace;
- shortening tool descriptions while schemas/refinements remain authoritative;
- demoting state/legacy helpers in discovery ranking;
- moving selection helpers out of Animation surface while retaining them in AUTHORING;
- retaining low-level executors behind consolidated semantic wrappers;
- moving diagnostics/intelligence into dedicated runtime-wiring modules.

## Current Inconsistencies / Proof Gaps

### Generated/current surface metadata freshness

Recent source routing changes reduced the expected Animation source surface from 20 to 18 tools, but some current overview/generated artifacts still state the older count. Regenerate canonical docs during LOCAL_CODE; do not manually edit generated API files as proof.

### Runtime micro-optimization, not capability loss

`paint_with_brush` still configures native Brush/Color state before its exact-pixel branch decision. This is execution overhead, not lost quality. Fix only with targeted local typecheck/paint tests.

### Batch hierarchy candidates

`reparent_element` remains single-target. A safe multi-target version needs full planned-graph preflight and one Undo. This is a future call-efficiency improvement, not a missing existing capability.

## Required Next Proof

Current source audit cannot establish live behavior. Before declaring capability integrity fully proven for the current head:

```text
1. matching clean Local SHA
2. bun install --frozen-lockfile
3. targeted typecheck/tests for any failures
4. bun run verify:full once terminal
5. regenerate/check generated docs and phase measurements
6. live Blockbench smoke tests for Geometry / Painter / Animation / Undo / export
7. compare a representative asset against the pre-cleanup behavioral baseline when available
```

Focus regression testing on behavioral contracts, not line count.

## Final Source-Only Verdict

```text
ACTIVE BEDROCK TOOL INTELLIGENCE: no broad harmful compaction found
DESCRIPTION/RESULT COMPACTION: predominantly no-loss
CONSOLIDATION: routing-only, executor intelligence retained
KNOWN REAL SCOPE REDUCTIONS: generic authored Mesh + retired 3D-assisted path
LOCAL/LIVE PROOF: still required
```
