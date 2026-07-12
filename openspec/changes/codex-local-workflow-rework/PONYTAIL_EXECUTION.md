# Ponytail Execution Scope

## Active goal

Finish a practical Geometry-quality workflow before the next local production test. MCP must see the current model, identify actionable visual mismatches, let Codex correct them in one Geometry profile/session, and stop only for real safety or user-review conditions.

## Required now

```text
single Reference Visual authority
→ compact stage context with one next action
→ automatic project identity synchronization when required
→ one Geometry write lease
→ current-model image feedback
→ fixed-scale transformed-cuboid diagnosis
→ ranked view/region/part repair instructions
→ local or major revision as an internal scope
→ contract-driven rotations
→ final structural and five-view validation
→ automatic review checkpoint and GEOMETRY_REVIEW transition
→ guarded approval completion
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

Do not add a separate Geometry repair or rebuild profile.

## Geometry diagnosis rule

MCP must return, when measurable:

- failing standard view;
- semantic region;
- missing versus excess silhouette;
- correction direction;
- approximate magnitude in Blockbench units;
- affected parts/groups;
- `LOCAL_REPAIR` or `MAJOR_FORM_REVISION` scope.

Revision scope is an internal Codex decision inside `BEDROCK_CUBOID_GEOMETRY`. It does not require reconnecting.

Current Geometry is projected from transformed cuboids at approved scale. Free-rescaling current Geometry to fit the reference is forbidden.

## Geometry review submission rule

When final Geometry is current, Codex calls `submit_geometry_for_review`. The tool must:

- run fresh `validate_geometry_contract`, including its embedded review-readiness gate;
- save the next unused non-approved Geometry review checkpoint;
- atomically move state to `GEOMETRY_REVIEW` / `AWAITING_USER_REVIEW`;
- advance the existing Geometry lease to the new state revision;
- remain in `BEDROCK_CUBOID_GEOMETRY` without reconnecting;
- require no user JSON edits or checkpoint naming.

Generic Geometry revision output must route to `BEDROCK_CUBOID_GEOMETRY`, then use `analyze_geometry_views` to classify the internal scope.

## Rotation rule

Every non-zero cube rotation uses a machine-readable attachment contract. The rotation tool derives the pivot, checks axis/sign/range, expected direction, declared connection, and affected-view score. Visual regression or broken connection rolls back automatically.

## Efficiency boundary

- one Reference Visual preview inspection per unchanged hash;
- only affected views during correction;
- one final five-view pass;
- bounded atomic cube batches;
- compact stage context instead of repeated long-document reads;
- non-improving cycles set an attention flag rather than creating a new gate/profile;
- no manual JSON edits, checkpoint naming, Geometry profile switches, or reconnects requested from the user.

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
2. Geometry uses one normal profile and one MCP session;
3. project identity mismatch is safely synchronized before lease acquisition;
4. fixed-scale diagnosis reports actionable regions/parts and blocking edge/ground failures;
5. current Geometry is not free-rescaled;
6. contract rotations verify direction/connection and rollback regression;
7. internal progress markers do not create user-facing gates;
8. five current views, Reference Visual hash, fingerprint, and analyzer are mandatory for review;
9. Geometry uses transformed world bounds and true ground contacts;
10. review submission automatically validates, checkpoints, and transitions to `GEOMETRY_REVIEW`;
11. Geometry approval preserves lease/session correctness and cannot use generic bypass;
12. negative fixtures reject the failed Black Rhinoceros model;
13. skills, profiles, typecheck, tests, build, and generated plugin output pass at the final local test step.

## Deferred not required

- merge into `V1`;
- release/deployment;
- persistent live MCP sessions;
- unrelated mesh, PBR, Hytale, or armature modelling expansion;
- multiple selected projects;
- duplicate packages, models, or versioned output names.
