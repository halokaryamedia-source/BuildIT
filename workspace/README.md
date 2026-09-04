# Asset Workspace

`workspace/` is repository-backed continuity for **one persistent Blockbench Asset Model per project folder**. It is not MCP runtime input, not a general cache, and not a transcript store.

## Layout

```text
workspace/
├─ active/
│  └─ <asset>/
│     ├─ README.md
│     ├─ <asset>.bbmodel          # exists only after a valid baseline/checkpoint save
│     ├─ references/
│     │  └─ approved-reference.png
│     ├─ 3d-assisted/             # only when strategy = 3D_ASSISTED
│     │  ├─ state.json
│     │  ├─ shape.glb
│     │  └─ primitive-decomposition.json
│     ├─ assets/                  # authored textures/supporting files when needed
│     ├─ exports/                 # deliberate deliverables
│     └─ .cache/                  # transient captures/crops/logs/previews; ignored
└─ saved/
   └─ <asset>/
```

A completed project remains under `active/` until the **user explicitly requests** that it be moved to `saved/`.

## New Model Workspace Order

For a new model:

```text
Approved Reference handed to Codex
→ create workspace/active/<asset>/
→ store reference + continuity
→ Requirement Gate
→ no .bbmodel yet
→ user-selected Geometry Strategy + all mandatory intake complete
→ create Blockbench project
→ author Geometry
```

Workspace creation does **not** authorize Blockbench modelling. Before the Requirement Gate passes there must be no authored model file.

## Mandatory Intake

A new-model README must record the current values for:

```text
Asset
Approved Reference
Requested Dimensions: width × height × length in Minecraft blocks
Geometry Strategy: UNSPECIFIED | DIRECT | 3D_ASSISTED
Animation Required: YES | NO | UNSPECIFIED
```

`Geometry Strategy` is a user decision. `UNSPECIFIED` blocks Geometry authoring. Codex must not infer or default it.

If mandatory information is missing, the README may exist with the unresolved value and:

```text
Current next step: User must provide <missing fields>
```

## Current Stage State

README owns only current major-stage continuity:

```text
Current Stage:
  INTAKE | GEOMETRY | TEXTURING | ANIMATION | FINALIZATION | COMPLETE

Geometry:
  NOT_STARTED | IN_PROGRESS | READY_FOR_USER_REVIEW | APPROVED | INVALIDATED | BLOCKED

Texturing:
  NOT_STARTED | IN_PROGRESS | READY_FOR_USER_REVIEW | APPROVED | INVALIDATED | BLOCKED

Animation:
  NOT_REQUIRED | NOT_STARTED | IN_PROGRESS | READY_FOR_USER_REVIEW | APPROVED | INVALIDATED | BLOCKED
```

`INVALIDATED` is only for a previously approved stage whose approval became materially invalid because an upstream approved stage was reopened and changed.

Do not persist transient `INTERNAL_VERIFY`; it is working state inside the current session.

Also record only when material:

```text
Current model file: <asset>.bbmodel | none
Current next step: one concrete action
Current blocker: none | concise blocker
front_direction: +z | -z
current phase/handoff state when a Gateway phase reload/resume is actually pending
```

Keep the README factual and compact. It is current state, not history.

## Stage Approval and Saves

User stage approval is explicit. `READY_FOR_USER_REVIEW` does not mean approved.

```text
Geometry APPROVED  → save/checkpoint current .bbmodel + update README
Texturing APPROVED → save/checkpoint current .bbmodel + update README
Animation APPROVED → save/checkpoint current .bbmodel + update README
Finalization PASS  → final save + status COMPLETE
```

Do not checkpoint after every MCP mutation, capture, internal verification, or successful tool call.

Before first Geometry approval, a new model may exist live in Blockbench but has no authoritative `.bbmodel` checkpoint in the workspace.

## Existing `.bbmodel` Intake

When a user supplies an existing `.bbmodel` that is not already tracked:

```text
create Active Workspace
→ store supplied file as the single current editable baseline
→ persist baseline before first mutation
→ inspect model
→ determine affected stage(s)
```

Do not create `original`, `backup`, `v2`, `final-final`, or similar duplicate model files. Git history owns previous baselines and approved checkpoints.

For an existing tracked model, reuse stored `Geometry Strategy`. For an untracked external model, strategy may remain unknown if the requested update does not touch Geometry; if Geometry authoring is required and strategy is unknown, ask the user before mutating Geometry.

## Reference Persistence

The actual approved reference used for modelling belongs under `references/` when the asset is persistent.

A user-supplied image explicitly handed to Codex for modelling is treated as approved unless the user marks it draft/not ready.

A stored file/path is continuity only. Reference-driven internal visual judgement still requires the **actual image to be visible in the active multimodal context**.

If the user replaces the Approved Reference for the same asset:

- Geometry Strategy does not reset;
- replace the canonical approved reference;
- any derived 3D-Assisted artifacts from the old reference are removed from current canonical state;
- Git history owns the old versions.

## 3D-Assisted Persistence

Only `geometry_strategy = 3D_ASSISTED` uses `3d-assisted/`.

Persistent canonical artifacts:

```text
state.json
shape.glb
primitive-decomposition.json
```

`state.json` is **machine-readable external-pipeline state only**. It may store:

```text
schema version
current reference identity/hash
view-extraction gate state
shape-reconstruction gate state + shape.glb identity/hash
primitive-decomposition gate state + decomposition identity/hash
last valid external resume point
```

It must not duplicate:

```text
Geometry/Texturing/Animation approval
Blockbench hierarchy
Cube UUID registry
user conversation
retry transcript
screenshot history
```

`shape.glb` becomes canonical only after Shape GLB Gate PASS. `primitive-decomposition.json` becomes canonical only after Primitive Decomposition Gate PASS.

There is **no separate canonical Cuboid Scaffold file**. Materialized scaffold exists as live Blockbench geometry and later as the current `.bbmodel` checkpoint after Geometry approval.

Temporary extraction crops, contact sheets, Hunyuan/PrimitiveAnything intermediate meshes, logs, previews, and internal visual captures belong under `.cache/`.

## Strategy Changes

Only the user changes strategy.

Before current Geometry approval:

```text
user changes strategy
→ keep Active Workspace/intake/reference
→ discard all unapproved Geometry from old strategy
→ remove current 3D-Assisted canonical state/artifacts when leaving 3D_ASSISTED
→ recreate the Blockbench project from clean state
→ start Geometry with the new strategy
```

After Geometry is already approved, keep approved production Geometry. Persist the user’s new strategy for future Geometry work; do not destroy approved geometry solely because the method changed.

## Downstream Invalidation

When an approved upstream stage is reopened, invalidate only materially affected downstream approvals.

```text
unaffected → keep APPROVED
affected   → INVALIDATED → repair → user approval again
```

Do not reset all stages automatically.

## Resume Rule

For a known persistent asset:

```text
user names/continues asset
→ workspace/active/<asset>/README.md
→ current .bbmodel only if it exists
→ only files needed for the next decision
→ if 3D_ASSISTED external work is pending, read 3d-assisted/state.json
→ BlockIT router
→ current phase/specialist
```

Do not scan every active project when the asset is known.

If the stored target phase and live MCP phase disagree, reconcile the phase through the Gateway rather than broad-searching tools.

## What Not To Store

Do not retain as project memory:

- tool-call transcripts;
- screenshot-per-mutation histories;
- temporary model-view captures;
- speculative geometry plans;
- persistent per-element UUID registries;
- duplicate historical `.bbmodel` copies;
- failed/stale 3D-Assisted artifacts at canonical paths;
- model weights, external environments, or generic provider caches;
- generic sample/fixture policy.

Use `.cache/` for transient working output. Git history owns old revisions and discarded states.

## Saved Projects

`workspace/saved/` means the **user explicitly chose to archive/park the asset**. Do not move a project there automatically after final save.

If a saved project is later edited, move it back to `workspace/active/` before authoring resumes.
