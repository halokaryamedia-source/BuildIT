# BlockIT Foundation Validation Report

**Updated:** 2026-08-08  
**Scope:** current Local source, current foundation policy, official Blockbench
source/types used during implementation review, and known local-proof gaps.

This report answers **what level of evidence currently exists**. It does not
replace `docs/knowledge/next-action.md` as the active-task owner.

## Evidence Labels

Use root `AGENTS.md` meanings:

- `CURRENT-PROJECT VERIFIED` — sufficient proof exists in the current target
  environment for the exact claim.
- `OFFICIALLY VERIFIED` — authoritative upstream source/docs support the
  capability/semantics, but current-project live integration may still be
  unproven.
- `LOCAL PROOF REQUIRED` — Local source implementation exists/is plausible but
  live Blockbench/MCP proof has not been run.
- `UNSUPPORTED` — available evidence shows the method should not be relied on.
- `UNKNOWN` — insufficient/conflicting evidence.

For this current ChatGPT→GitHub phase, most new Blockbench runtime changes are
source-implemented but remain `LOCAL PROOF REQUIRED`.

## Product Policy Status

| Policy | Status | Notes |
|---|---|---|
| Approved Modelling Brief is visual authority, not pixel calibration | Active BlockIT policy | Source Image owns identity; declared dimensions own numeric target when present. |
| Whole form before local detail | Active BlockIT policy | Primary Form Hypothesis precedes exact primary transforms. |
| Structural success ≠ visual success | Active BlockIT policy | Tool success/bounds/hierarchy/save cannot issue visual PASS. |
| Global failure can invalidate/rebuild coarse blockout | Active BlockIT policy | Do not micro-patch an unrecognizable primary form. |
| Rotation needs visual/form/motion reason | Active BlockIT policy | Arbitrary multi-axis rotation rejected. |
| Material pivot needs transform/joint/attachment reason | Active BlockIT policy | Arbitrary/distant pivots rejected. |
| Mutation identity must be explicit | Active BlockIT policy | Single-Cube and destructive element mutations must not depend on transient selection or first-name-match behavior. |
| Explicit discovery scope must be deterministic | Active BlockIT policy | A requested Group scope must not silently resolve to the first duplicate name. |
| Explicit discovery filters fail closed | Active BlockIT policy | A supplied invalid/rejected regex must not silently become an unfiltered search. |
| Explicit material-discovery texture must be deterministic | Active BlockIT policy | Read-only texture discovery must not silently choose a duplicate name/ID match. |
| Destructive mutation must be recoverable | Active BlockIT policy | Once Undo is open, remove/rename/duplicate failures must cancel/revert rather than leave an open/partial edit. |
| No SF3D/mesh/IoU/similarity authority | Active BlockIT policy | These are not accepted as modelling or approval authority. |

Policy does not need to be a universal Blockbench rule; these are BlockIT quality
requirements.

## Current Reference Fidelity Implementation

### Observation

| Capability | Local source | Evidence status | Current claim |
|---|---|---|---|
| Rendered whole-Cube bounds reader | `mcp/lib/renderedModelBounds.ts` | `LOCAL PROOF REQUIRED` | Uses current rendered/global Cube vertex transforms as structural envelope source. |
| `inspect_model_bounds` | `mcp/server/tools/project.ts` | `LOCAL PROOF REQUIRED` | Returns raw global envelope/ground/pose facts; no visual score/PASS. |
| `capture_model_views` | `mcp/server/tools/camera.ts` | `LOCAL PROOF REQUIRED` | Canonical labeled 512×512 offscreen model-view capture with explicit front direction/framing. |
| `inspect_element` | `mcp/server/tools/element-inspection.ts` | `LOCAL PROOF REQUIRED` | Reads exact authored Cube/Group state; ambiguous names fail. |

Important local proof still missing:

- actual screenshot content reaches the active Codex/vision client as usable image
  content;
- named view orientation/framing matches the intended reference semantics in the
  installed Blockbench runtime;
- rendered bounds remain correct for current animation/group-transform edge cases.

## Element / Material Discovery Safety

| Capability | Local source | Evidence status | Current claim |
|---|---|---|---|
| `find_elements_by_criteria(parent_group=...)` | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | omitted/empty scope means no Group scope; explicit scope resolves UUID-first or exact unique name; missing/ambiguous Group fails before search. |
| `select_all_of_type(parent_group=...)` | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | same strict optional Group-scope resolution occurs before selection state changes. |
| scoped Group resolver | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | discovery/selection uses a local resolver and does not inherit `add_group`'s special `root` parent semantics. |
| `find_elements_by_criteria(name_pattern=...)` | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | omitted/empty pattern remains no regex filter; explicit oversized, nested-quantifier-rejected, or invalid regex now throws instead of continuing without the requested filter. |
| `filter_by_material(texture=...)` | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | exact UUID resolves first, then exact texture ID, then exact name only when unique; duplicate IDs/names and missing references fail before read-only discovery. |
| material-discovery texture resolver | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | local only; shared `getProjectTexture` / `findTextureOrThrow` are unchanged because they also serve paint, mutation, activation, and PBR paths. |

The current source prevents wrong-hierarchy scope, rejected-regex fallback, and
ambiguous read-only texture lookup from silently broadening or misdirecting the
normal discovery path.

## Cube Creation / Correction Safety

| Capability | Local source | Evidence status | Current claim |
|---|---|---|---|
| Strict new Cube extents | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | `place_cube` requires explicit finite `from` + `to`; no default Cube geometry as modelling progress. |
| Strict parent targeting | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | explicit missing/ambiguous Group fails; no silent fallback to root. |
| Rotated Cube creation pivot safety | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | any non-zero initial rotation requires explicit origin/pivot. |
| Existing-Cube rotation activation | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | zero→non-zero rotation through `modify_cube` / `modify_cubes_batch` requires explicit origin before Undo; already-rotated Cubes may reuse the existing pivot. |
| Single-Cube target safety | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | `modify_cube.id` is required; UUID resolves first, exact name compatibility is allowed only when unique; editor selection is not an implicit mutation target. |
| `modify_cubes_batch` | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | exact UUIDs, heterogeneous per-Cube patches, all target/rotation-activation preflight before one recoverable Undo unit. |
| Cube pivot-only correction | `mcp/server/tools/cubes.ts` | `OFFICIALLY VERIFIED` semantics + `LOCAL PROOF REQUIRED` integration | origin-only uses `Cube.transferOrigin()`; origin + geometry fields remains authored rewrite. |

Official Blockbench types/source describe `Cube.transferOrigin(origin, update?)` as
moving the origin while updating Cube geometry so the same visual position is
preserved. Local integration still needs live proof.

## Destructive Element Target / Transaction Safety

| Capability | Local source | Evidence status | Current claim |
|---|---|---|---|
| `remove_element` target resolution | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | UUID resolves first; exact name is accepted only when unique across Cube/Mesh/Group; ambiguity fails before Undo. |
| `remove_element` rollback boundary | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | remove + `finishEdit` run inside one try/catch; failure after Undo opens calls `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows. |
| `duplicate_element` target resolution | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | same strict target resolution before recursive duplication begins. |
| `duplicate_element` rollback boundary | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | recursive Cube/Group/Mesh clone runs after one `Undo.initEdit`; clone/finish failure calls `Undo.cancelEdit(true)` and rethrows; normal Canvas refresh is after successful finish. |
| `rename_element` target resolution | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | same strict target resolution before rename Undo. |
| `rename_element` rollback boundary | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | rename + `finishEdit` run inside one try/catch; failure after Undo opens calls `Undo.cancelEdit(true)`, refreshes Canvas, and rethrows. |
| shared `findElementOrThrow` | `mcp/lib/util.ts` | unchanged / caller-specific | intentionally not broadened because GitHub code search was incomplete and unrelated caller semantics were not proven safe to migrate. |

The Local fixes are deliberately scoped to the proven destructive paths. They do
not claim that every generic element lookup in the repository now has unique-name
semantics.

## Group / Bone / Pivot Safety

| Capability | Local source | Evidence status | Current claim |
|---|---|---|---|
| `add_group` neutral defaults | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | origin/rotation can remain neutral instead of forcing invented values. |
| strict Group parent targeting | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | explicit parent is resolved before Undo; missing/ambiguous target fails. |
| `bone_rigging` preflight/rollback | `mcp/server/tools/animation.ts` | `LOCAL PROOF REQUIRED` | action-specific required inputs/targets are resolved before mutation; failure reverts open edit. |
| Group pivot-only correction | `mcp/server/tools/animation.ts` | `OFFICIALLY VERIFIED` semantics + `LOCAL PROOF REQUIRED` integration | `set_pivot` uses `Group.transferOrigin()`. |

Official Blockbench types describe `Group.transferOrigin(origin)` as moving a
bone origin without visually affecting its content position.

## MCP Prompt / Project Defaults

| Item | Status | Notes |
|---|---|---|
| Default project format is Bedrock Entity (`bedrock`) | Source implemented; `LOCAL PROOF REQUIRED` | G1 source correction exists; live `create_project → get_project_info` proof deferred. |
| Bundled Local prompt is normal authority; CDN disabled by default | Source implemented; `LOCAL PROOF REQUIRED` | G2 source correction exists; live bundle/prompt-loader proof deferred. |
| Bedrock modelling prompt follows Reference Fidelity Loop | Source implemented | `mcp/prompts/bedrock.md` routes whole-form observation/correction and current creation/rotation/pivot/targeting safety. |

## Known Paused / Later Gaps

### G3 — Tool annotations registration

`ToolSpec` annotations exist but registration forwarding remains a known paused
issue. It is not part of the current reference-fidelity source sequence.

Status: **known source gap / paused**.

### Save / Reopen

Blockbench supports `.bbmodel` project files, but exact current BlockIT
save→reopen fidelity/persistence has not been proven in the local workflow.

Status: `LOCAL PROOF REQUIRED`.

### Texture / UV

Foundation texture policy exists and existing MCP texture capabilities may cover
some needs, but the recent Reference Fidelity work has not performed a fresh UV/
texture runtime proof.

Status: `LOCAL PROOF REQUIRED` when a concrete texture claim depends on it.

### Explicit texture reference in `place_cube`

`place_cube(texture=...)` currently resolves a supplied texture through shared
`getProjectTexture()`, which uses one first-match lookup across texture ID, name,
or UUID. A duplicate name can therefore apply a different texture than intended
during initial Cube creation even though geometry/hierarchy preflight is strict.

Status: **next active source audit**. Keep the fix bounded to initial Cube
placement unless caller evidence justifies changing the shared texture helper.

## Historical External Premises

Still supported by first-party Blockbench documentation/source:

- Blockbench supports Bedrock-oriented modelling/animation workflows;
- `.bbmodel` is a Blockbench project format;
- geometry, UV/texturing, groups/bones, and animation are first-party concepts;
- Blockbench has interactive 3D preview capability;
- Cube/Group transfer-origin APIs exist with pivot-preserving semantics described
  above.

Those facts do not prove that current BlockIT's MCP integration works live.

## Explicitly Rejected As Authority

Status: `UNSUPPORTED` for BlockIT modelling/approval authority:

- automatic image→Cuboid reconstruction;
- SF3D/mesh decomposition as geometry truth;
- IoU/projection/similarity scores as resemblance approval;
- successful Cube placement as visual approval;
- per-Cube screenshot/approval quotas;
- arbitrary fallback coordinates/pivots;
- editor selection as implicit single-Cube mutation identity;
- first matching duplicate element/Group/texture name as mutation or discovery identity;
- silently ignoring an explicit invalid/rejected discovery filter;
- historical fixture-specific build rules promoted to generic workflow.

## What Can Be Claimed Now

### From ChatGPT → GitHub

Safe claims:

- current Local source contains the listed contracts/implementation paths;
- foundation/prompt rules are aligned with the Reference Fidelity architecture;
- `modify_cube` source schema requires an explicit target and no longer reads
  `Cube.selected` as a fallback;
- explicit `parent_group` scopes in `find_elements_by_criteria` and
  `select_all_of_type` resolve UUID-first / exact-unique-name and reject
  ambiguity before search/selection;
- explicit invalid/rejected `name_pattern` throws from source instead of becoming
  a missing regex filter;
- `filter_by_material` now resolves texture UUID first, then exact texture ID,
  then exact unique name and rejects ambiguous/missing references before
  discovery;
- destructive remove/duplicate/rename tools use a local UUID-first /
  unique-exact-name resolver and preflight ambiguity before Undo;
- remove/duplicate/rename now each have a bounded failure path that calls
  `Undo.cancelEdit(true)` after Undo has opened;
- shared element and texture lookup helpers remain intentionally unchanged where
  caller compatibility has not been established;
- official Blockbench types/source support the transfer-origin semantics used by
  the code.

Unsafe claims without local proof:

- `capture_model_views` definitely returns visually correct images in the active
  Blockbench installation;
- bounds/camera/Undo behavior works for every live edge case;
- the MCP client definitely exposes the updated contracts until the current
  plugin is built/loaded and inspected;
- duplicate-name texture discovery behaves correctly in the installed live
  runtime;
- invalid `name_pattern` errors definitely reach the active MCP client with the
  expected error presentation;
- forced remove/rename/duplicate failures definitely leave zero partial state in
  the installed Blockbench runtime;
- the new loop now produces a good reference-matching model in practice;
- save/reopen persistence is correct.

## Local Proof Queue

Local testing is intentionally deferred at the current user priority, but the
future proof queue is:

1. build/load current Local plugin in Blockbench;
2. verify default Bedrock project + bundled prompt behavior;
3. inspect live MCP schemas for the current explicit-target/scope/filter contracts;
4. create duplicate-name textures and verify `filter_by_material` rejects the
   ambiguous name while exact UUID / texture ID resolve the intended texture;
5. verify omitted/empty `name_pattern` remains unfiltered while invalid,
   overlong, and rejected nested-quantifier patterns fail rather than broaden the
   query;
6. create duplicate-name Groups and verify scoped search/selection reject an
   ambiguous name but accept exact UUID and unique name;
7. create duplicate-name Cube/Group fixtures and verify destructive element tools
   reject ambiguous names before mutation;
8. force controlled remove, rename, and duplicate failures and verify rollback
   leaves no partial/open destructive edit;
9. create a small model using strict `place_cube` inputs;
10. verify `inspect_model_bounds` against visible transformed geometry;
11. verify canonical `capture_model_views` image delivery/orientation/framing;
12. verify `inspect_element` + explicit single-Cube correction + batch correction + Undo behavior;
13. verify Cube and Group pivot-transfer behavior visually;
14. verify zero→non-zero existing-Cube rotation activation requires explicit pivot while later rotation adjustments reuse it;
15. save/reopen `.bbmodel` and inspect persistence;
16. run one approved-reference → whole-form modelling session and evaluate actual
   reference fidelity.

Do not run this queue ceremonially; use the smallest proof required when local
validation resumes.

## Bottom Line

The architectural problem is well-defined and the main observation, discovery
scope/filter/material targeting, correction, targeting, pivot,
initial-placement, rotation-activation, and bounded destructive rollback
mechanisms are present in Local source.

The remaining major uncertainty is **live effectiveness**: whether the current
Blockbench/MCP/Codex path observes and corrects models as intended. That remains
`LOCAL PROOF REQUIRED`, not a reason to invent more architecture before testing.

## Related

- [Foundation README](README.md)
- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)
- [Implementation Map](../knowledge/implementation-map.md)
- [Next Action](../knowledge/next-action.md)
