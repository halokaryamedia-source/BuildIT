# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Stabilize and reduce the BlockIT MCP foundation **before** continuing feature
hardening. Keep the proven Reference Fidelity work and recent Bedrock Animation
improvements, but stop treating more tool coverage or more per-tool validation
as progress until the MCP boundary itself is secure, enforced, testable, and
appropriately small for the Minecraft Bedrock Entity product.

## Current Status

`MCP_DEVELOPMENT_AUDIT_RECORDED_FEATURE_WORK_FROZEN_REDUCTION_PLAN_NEXT`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred until stabilization planning
selects the proof points.**

## Current Governing Review

Read first:

```text
docs/knowledge/reviews/mcp-development-quality-audit.md
```

Review commit:

```text
ed62775c16fc544f99a00384f45cae28d37b8a75
docs: record MCP development quality audit
```

Review Index continuation:

```text
1499a727da8627f2e83d20885871acd9ef1922dd
docs: index MCP development quality audit
```

The audit is **active evidence**, not an implementation plan.

## Audit Verdict

Current MCP is **not yet optimal**.

Recent focused Bedrock work is materially stronger than the legacy foundation,
but the repository still contains higher-priority problems that make additional
micro-hardening inefficient or falsely reassuring.

### P0 — foundation blockers

1. server is not explicitly loopback-bound despite logging `localhost`;
2. no proved Origin/auth boundary before MCP transport handling;
3. `risky_eval` is a Stable/default arbitrary-JavaScript capability;
4. tool safety annotations are stored but not passed through current MCP
   registration/reconstruction;
5. factory `extractShape()` can strip top-level Zod `.refine()` / `.superRefine()`
   semantics, so schema presence is not proof of runtime MCP validation;
6. `from_geo_json` has a misleading input/format contract and unnecessary URL
   fetch surface;
7. no effective test/typecheck/root-CI quality gate is proved;
8. checked-in generated MCP API docs are stale and contradict current source.

### P1 — overdevelopment / excess surface

- generic Blockbench tool coverage is much broader than the active Bedrock Entity
  product;
- Mesh modelling/editing and Mesh UV are non-core for Cube/Cuboid-only Entity
  geometry;
- Armature/vertex-weight rigging is a mesh-deformation path, not the normal
  Group/BoneAnimator Cuboid rig;
- Bedrock Block material-instance tools are mixed into default core exposure;
- UI automation/eval/import/export escape hatches are peers of semantic core
  tools instead of gated fallbacks;
- raw TCP/HTTP parsing + multiple keepalive/session layers are disproportionately
  complex for a single-client desktop service;
- `experimental` status does not meaningfully reduce MCP exposure;
- progress plumbing is currently no-op;
- result contracts and resolver ownership are inconsistent/duplicated.

### P2 — maintenance debt

- Paint surface is broader than the proven product need;
- `mcp_instructions` appears disconnected from actual server creation;
- resources can expose heavy texture source data and local project paths;
- generic project/format behavior remains broader than the primary product;
- same-domain numeric validation remains inconsistent across legacy/new tools;
- Animation still has residual gaps, but they are no longer the active priority.

The complete evidence, examples, false-confidence ledger, and provisional
keep/gate/quarantine/remove classification are in the governing review.

## False-Confidence Rule

From this point forward:

> Do not treat a schema, annotation, comment, UI setting, generated document,
> build success, or `stable`/`experimental` label as proof unless the actual MCP
> registration/execution path enforces the claimed contract.

This rule specifically prevents more source that **looks** safe without making
the runtime boundary safer.

## Frozen Product Boundaries

### Geometry

Minecraft Bedrock Entity model geometry remains **Cube/Cuboid only**.

Do not introduce Mesh, vertex deformation, morph targets, cylinders, spheres,
free-form geometry, or another shape system into the default Bedrock Entity path.

### Texture

Texture feature hardening remains frozen unless the future stabilization plan or
an end-to-end Bedrock proof identifies a real core blocker.

### Animation

Recent Animation source improvements remain retained, including deterministic
identity, codec-backed creation, rollback, authored-space parity, transform and
particle readback, and recent timeline input hardening.

However, **do not continue Animation micro-hardening by default** until the MCP
foundation work order is approved.

The previously active runtime bug remains parked:

```text
animation_timeline.select_range
```

Repeated no-event `kf.select()` calls can clear prior timeline selection and the
manual deselection branch can desynchronize `Timeline.selected` from per-keyframe
flags. This remains a valid defect, but it is not currently the highest-priority
source change.

## Strong Patterns To Preserve

Do not roll back these directions while reducing the MCP:

- `place_cube`: explicit finite extents, intentional pivot rules, deterministic
  targeting;
- `modify_cubes_batch`: exact UUIDs, bounded batch, preflight, coherent Undo;
- `inspect_element`: narrow read-only authored-state inspection;
- `inspect_model_bounds`: structural whole-model observation;
- `capture_model_views`: deterministic reference-facing image evidence;
- recent `create_animation` / `inspect_animation`: Bedrock codec ownership,
  deterministic Group binding, rollback/readback, explicit proof boundary;
- source/static proof must not be promoted to live Blockbench proof.

## Feature Work Freeze

Until the next planning artifact is approved:

- no new MCP feature families;
- no broad MCP API parity expansion;
- no Mesh/Armature/Bedrock-Block expansion for the Entity workflow;
- no additional per-tool micro-hardening unless it is required to create the
  stabilization plan itself;
- no large refactor simply because the audit is broad;
- no source fixes are implied by this documentation commit.

## Next Step

Create **one MCP Reduction & Stabilization Plan (P0 → P2)** from the governing
review.

The plan must:

1. define the minimal **Bedrock Entity Core** MCP surface;
2. classify current capability families as **keep / gate / quarantine / remove**;
3. order P0 security + real-contract fixes before feature cleanup;
4. restore real engineering proof: root CI, typecheck, targeted contract tests,
   generated-doc freshness, then local MCP/Blockbench proof;
5. decide which transport/session layers are truly required from current
   primary SDK/protocol evidence instead of preserving them through sunk cost;
6. identify ownership consolidation opportunities without beginning a broad
   refactor;
7. preserve the strong recent Cuboid/reference/Animation work;
8. contain **no source implementation changes** while the plan is being written.

After that plan is reviewed/approved, implementation may resume from its first
P0 slice only.

## Proof Boundary

Current audit conclusions are source/static evidence. Before implementing
network/protocol changes, re-check current primary MCP SDK/protocol documentation.
Actual network bind behavior, MCP client metadata visibility, runtime validation,
Blockbench mutation, Undo/Redo, playback, save/reopen, and end-to-end modelling
remain `LOCAL PROOF REQUIRED` where applicable.
