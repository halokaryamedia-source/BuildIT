# Ponytail Execution Scope

## Active goal

Finish the Geometry-quality system before the next local production test so MCP can see the current model, identify the exact visual mismatch, prescribe the smallest relevant repair, and stop non-converging or unsafe work.

## Required now

```text
single Reference Visual authority
→ compact stage context
→ PRIMARY_FORM enforcement
→ current-model image feedback
→ fixed-scale transformed-cuboid diagnosis
→ ranked view/region/part repair instructions
→ STRUCTURAL_DETAIL enforcement
→ contract-driven rotations
→ five-view readiness gate
→ transformed Geometry validation
→ guarded completion
→ final static and runtime proof
```

## Reuse

- existing workspace, state, and project metadata;
- existing canonical MCP connection;
- existing write lease and stale-call guard;
- existing Geometry/Texture/Animation/Validation stages;
- existing checkpoints and evidence directories;
- existing Reference Visual and technical contracts;
- existing profile and skill synchronization.

## Geometry diagnosis rule

MCP must not say only that a view “does not match.” It must return, when measurable:

- failing standard view;
- semantic region;
- missing versus excess silhouette;
- direction of correction;
- approximate magnitude in Blockbench units;
- affected parts/groups;
- recommended local or major repair route.

Current Geometry is projected from transformed cuboids at the approved coordinate scale. Free-rescaling current Geometry to fit the reference is forbidden.

## Rotation rule

Every non-zero cube rotation uses a machine-readable attachment contract. The rotation tool derives the pivot, checks axis/sign/range, expected direction, declared connection, and affected-view score. Visual regression or broken connection rolls back automatically.

## Efficiency boundary

- one Reference Visual inspection per unchanged hash;
- three primary-form views;
- only affected views during repair;
- one final five-view pass;
- bounded atomic cube batches;
- no more than two non-improving cycles per phase;
- compact stage context instead of repeated long-document reads;
- stop `VISUAL_CONVERGENCE_FAILED` rather than generating random alternatives.

## Workspace separation

```text
blockbench/
= canonical model, textures, reference images, approved previews

mcp/
= state, contracts, checkpoints, evidence, diagnostics, reports
```

## Stop condition for implementation

Implementation is complete only when:

1. old four-sheet/three-approval context is rejected;
2. primary-form detail cannot be bypassed;
3. `GEOMETRY_VISUAL_REBUILD` receives all Geometry guards;
4. fixed-scale diagnosis reports actionable regions/parts;
5. current Geometry is not free-rescaled;
6. contract rotations verify direction/connection and rollback regression;
7. two non-improving cycles stop automatically;
8. five current views, current Reference Visual hash, current fingerprint, and current analyzer are mandatory;
9. Geometry uses transformed world bounds and true ground contacts;
10. Geometry completion preserves lease/session correctness and cannot use generic bypass;
11. negative fixtures reject the failed Black Rhinoceros model;
12. skills, profiles, typecheck, tests, build, and generated plugin output pass at the final test step.

## Deferred not required

- merge into `V1`;
- release/deployment;
- persistent live MCP sessions;
- unrelated mesh, PBR, Hytale, or armature modelling expansion;
- multiple selected projects;
- duplicate packages, models, or versioned output names.
