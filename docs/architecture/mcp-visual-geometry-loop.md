# MCP Visual-Grounded Geometry Loop

## Problem addressed

The previous Geometry workflow could produce a structurally valid `.bbmodel` while remaining visually far from the approved Reference Visual. Screenshot tools wrote evidence files, but Codex was commonly given only paths rather than actual image payloads. Structural validation checked bounds, group names, cube counts, and evidence existence; it did not prove visual similarity. Raw bounds also ignored cube and parent rotations.

## Required Geometry pipeline

```text
get_stage_context
→ inspect_reference_visual
→ build coarse primary form
→ capture_visual_feedback
→ compare_reference_views
→ targeted primary-form repair
→ structural detail
→ affected-view feedback and comparison
→ final five-view multimodal review
→ final five-view deterministic comparison
→ record_geometry_visual_result
→ validate_reference_contract
→ verify_geometry_review_ready
→ non-approved checkpoint
→ user review
```

Texture must remain locked until the user explicitly approves Geometry.

## Dual visual validation

Geometry uses two complementary layers:

1. **Codex multimodal review**
   - Codex receives the approved Reference Visual and current model captures as MCP image payloads.
   - Codex judges identity, mass relationships, silhouette, part direction, and cross-view consistency.

2. **Deterministic silhouette guardrail**
   - `compare_reference_views` extracts Reference Visual panels and clean current captures.
   - It calculates silhouette IoU, row-profile error, column-profile error, and aspect-ratio error.
   - It writes `geometry_visual_metrics.json` and one compact `geometry_visual_diff.png` contact sheet.
   - Green means overlap, red means missing target silhouette, and blue means excess current silhouette.

Neither layer replaces user review. Both layers must pass before Geometry can enter approval.

## Review readiness gate

`verify_geometry_review_ready` requires:

- all five canonical views;
- current deterministic metrics;
- current Codex multimodal report;
- current Geometry fingerprint;
- the actual approved Reference Visual hash;
- complete compared-view coverage;
- safe cube rotations and pivots;
- no stale evidence after Geometry mutation.

`complete_geometry_stage` is the only Geometry approval transition exposed in the normal Geometry profile. It calls the unified review-readiness gate before delegating to the atomic workflow transition. Generic `complete_stage` is not exposed to Geometry production.

## Geometry result model

A structural PASS is not a visual PASS. Geometry reporting separates:

```text
structural_status
visual_status
deterministic_visual_status
rotation_status
evidence_status
result
```

`result = PASS` only when every required status passes.

## Rotation and pivot safety

Normal Geometry mutation uses:

- `place_cubes_safe`
- `modify_cubes`

Rules:

- rotated cubes require an explicit attachment pivot;
- one local rotation axis is preferred and enforced by default;
- compound cube rotation is rejected unless explicitly allowed;
- default maximum absolute cube rotation is 45 degrees;
- large body masses should use stepped cuboid sizing rather than rotation to fake taper;
- rotated batches require affected-view inspection;
- world bounds include cube rotation and parent transforms;
- Geometry mutation invalidates prior visual reports and deterministic metrics.

The rotation audit reports non-finite rotations, excessive angles, compound rotation, degenerate cubes, and pivots positioned too far outside their cubes.

## Clean and rotation-aware captures

`capture_standard_views` delegates to the visual-feedback engine:

- Front, Left, Back, and Top use orthographic projection.
- Front-left 3/4 uses perspective.
- captures use transformed world bounds;
- gizmos and active selections are removed from review evidence where supported;
- evidence filenames remain stable and stage-specific.

## Revision routing

```text
LOCAL_REPAIR
→ GEOMETRY_LOCAL_REPAIR

MAJOR_FORM_REVISION
→ GEOMETRY_VISUAL_REBUILD

REFERENCE_REOPEN
→ approved reference workflow

REFERENCE_CONFLICT
→ stop
```

Use major rebuild when multiple primary masses or multiple views fail. Previous checkpoints remain immutable.

## Token and tool-call controls

- use `get_stage_context` instead of repeatedly loading long contracts;
- inspect the Reference Visual once unless its hash changes;
- use Left, Front, and Top for primary-form checks;
- capture only affected views during local corrections;
- use bounded atomic cube batches;
- stop after two unsuccessful correction cycles with `VISUAL_CONVERGENCE_FAILED`;
- write full-resolution evidence to disk but return only image payloads required by the current decision;
- normal profiles expose fewer than 30 tools including core tools.

## Main implementation files

```text
mcp-blockbench/src/lib/worldBounds.ts
mcp-blockbench/src/server/tools/geometry-feedback.ts
mcp-blockbench/src/server/tools/visual-compare.ts
mcp-blockbench/src/server/tools/geometry-review-gate.ts
mcp-blockbench/src/server/tools/geometry-completion.ts
mcp-blockbench/src/server/tools/stage-context.ts
mcp-blockbench/src/server/tools/camera.ts
engines/shared/profiles/tool-profiles.json
engines/shared/profiles/stage-profiles.json
engines/shared/skills/blockbench-production/SKILL.md
engines/shared/skills/blockbench-geometry/SKILL.md
engines/shared/workflow/EVIDENCE_CONTRACT.md
engines/shared/workflow/STATE_MACHINE.md
```

## Verification

Repository verification is defined by `.github/workflows/mcp-verify.yml` and the local `verify:quick` script:

```text
bun run skills:check
bun run typecheck
bun test
bun run build
```

Regression coverage includes visual tool registration, profile restrictions, guarded Geometry completion, rotation-aware bounds, explicit pivot requirements, deterministic visual evidence, stale-evidence rejection, and bounded profile size.
