# Ponytail Execution Scope

## Active goal

Finish a practical, usage-efficient Geometry-quality workflow before the next local production test. MCP must see the current model, identify actionable visual mismatches, let Codex correct them in one Geometry profile/session, route each task to the cheapest eligible locked model role, and stop only for real safety or user-review conditions.

## Required now

```text
project default Terra Medium
→ deterministic role routing with no router model call
→ Terra parent performs normal implementation directly
→ mcp_builder becomes the fallback sole MCP writer only when required
→ Sol Medium only for necessary visual judgment
→ Sol High only for one coded critical decision
→ single Reference Visual authority
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

Do not add a separate Geometry repair or rebuild profile, a model-selection service, persistent routing telemetry, recursive agents, or parallel MCP writers.

## Model routing rule

`engines/codex/MODEL_ROUTING.md` is the routing authority.

- Project parent default: `gpt-5.6-terra`, medium.
- Mechanical read-only work: `routine_auditor`, 5.4 Mini Low.
- Standard implementation and active-asset mutation: one selected Terra writer; the Terra parent is default and `mcp_builder` is the fallback when the parent differs or isolation is materially safer.
- Visual interpretation and acceptance: `visual_director`, Sol Medium, read-only.
- Critical review: `critical_reviewer`, Sol High, read-only, at most once per unresolved coded decision.
- High is the maximum. xhigh, Extra High, Max, Ultra, Fast mode, recursive delegation, and parallel writers are forbidden.
- `agents.max_threads` remains `2`; `agents.max_depth` remains `1`.
- If deterministic validation can answer the question, do not call a larger model.
- Explicit user model selection affects the parent only. The user is not asked to select worker models or restart Codex merely to load optional roles.

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
- deterministic routing before model delegation;
- Sol receives a compact decision packet, not the repository or raw logs;
- heavy judgment de-escalates immediately to Terra implementation and Mini audit;
- no subagent for a micro-task when direct work is cheaper;
- non-improving cycles set an attention flag rather than creating a new gate/profile;
- no manual JSON edits, checkpoint naming, worker-model selection, Geometry profile switches, or reconnects requested from the user.

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
13. project Codex config defines Terra Medium, two threads, and depth one;
14. custom agents lock Mini Low, Terra Medium, Sol Medium, and rare Sol High roles;
15. exactly one selected Terra writer mutates the active asset; `mcp_builder` is fallback rather than a mandatory controller hop;
16. no configured effort exceeds High;
17. routing, skills, profiles, typecheck, tests, build, and generated plugin output pass at the final local test step.

## Deferred not required

- merge into `V1`;
- release/deployment;
- persistent live MCP sessions;
- persistent routing telemetry or a learned router;
- unrelated mesh, PBR, Hytale, or armature modelling expansion;
- multiple selected projects;
- duplicate packages, models, or versioned output names.