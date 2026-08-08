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
| `inspect_element` | `mcp/server/tools/element.ts` | `LOCAL PROOF REQUIRED` | Reads exact authored Cube/Group state; ambiguous names fail. |

Important local proof still missing:

- actual screenshot content reaches the active Codex/vision client as usable image
  content;
- named view orientation/framing matches the intended reference semantics in the
  installed Blockbench runtime;
- rendered bounds remain correct for current animation/group-transform edge cases.

## Cube Creation / Correction Safety

| Capability | Local source | Evidence status | Current claim |
|---|---|---|---|
| Strict new Cube extents | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | `place_cube` requires explicit finite `from` + `to`; no default Cube geometry as modelling progress. |
| Strict parent targeting | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | explicit missing/ambiguous Group fails; no silent fallback to root. |
| Rotated Cube creation pivot safety | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | any non-zero initial rotation requires explicit origin/pivot. |
| Single-Cube target safety | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | UUID first; exact name compatibility only when unique. |
| `modify_cubes_batch` | `mcp/server/tools/cubes.ts` | `LOCAL PROOF REQUIRED` | exact UUIDs, heterogeneous per-Cube patches, one recoverable Undo unit. |
| Cube pivot-only correction | `mcp/server/tools/cubes.ts` | `OFFICIALLY VERIFIED` semantics + `LOCAL PROOF REQUIRED` integration | origin-only uses `Cube.transferOrigin()`; origin + geometry fields remains authored rewrite. |

Official Blockbench types/source describe `Cube.transferOrigin(origin, update?)` as
moving the origin while updating Cube geometry so the same visual position is
preserved. Local integration still needs live proof.

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
| Bedrock modelling prompt follows Reference Fidelity Loop | Source implemented | `mcp/prompts/bedrock.md` routes whole-form observation/correction and current creation/pivot safety. |

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

### Existing-Cube First Rotation

Current initial Cube creation is protected, but a Cube that was previously
unrotated may still receive its first non-zero rotation using an existing neutral
origin unless the upcoming correction safety closes that path.

Status: **next active source gap**. See `docs/knowledge/next-action.md`.

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
- historical fixture-specific build rules promoted to generic workflow.

## What Can Be Claimed Now

### From ChatGPT → GitHub

Safe claims:

- current Local source contains the listed contracts/implementation paths;
- foundation/prompt rules are aligned with the Reference Fidelity architecture;
- official Blockbench types/source support the transfer-origin semantics used by
  the code.

Unsafe claims without local proof:

- `capture_model_views` definitely returns visually correct images in the active
  Blockbench installation;
- bounds/camera/Undo behavior works for every live edge case;
- the new loop now produces a good reference-matching model in practice;
- save/reopen persistence is correct.

## Local Proof Queue

Local testing is intentionally deferred at the current user priority, but the
future proof queue is:

1. build/load current Local plugin in Blockbench;
2. verify default Bedrock project + bundled prompt behavior;
3. create a small model using strict `place_cube` inputs;
4. verify `inspect_model_bounds` against visible transformed geometry;
5. verify canonical `capture_model_views` image delivery/orientation/framing;
6. verify `inspect_element` + single/batch correction + Undo behavior;
7. verify Cube and Group pivot-transfer behavior visually;
8. save/reopen `.bbmodel` and inspect persistence;
9. run one approved-reference → whole-form modelling session and evaluate actual
   reference fidelity.

Do not run this queue ceremonially; use the smallest proof required when local
validation resumes.

## Bottom Line

The architectural problem is now well-defined and the main observation,
correction, targeting, pivot, and initial-placement safety mechanisms are present
in Local source.

The remaining major uncertainty is **live effectiveness**: whether the current
Blockbench/MCP/Codex path observes and corrects models as intended. That remains
`LOCAL PROOF REQUIRED`, not a reason to invent more architecture before testing.

## Related

- [Foundation README](README.md)
- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)
- [Implementation Map](../knowledge/implementation-map.md)
- [Next Action](../knowledge/next-action.md)
