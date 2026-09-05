# Asset Workspace

`workspace/` is repository-backed continuity for **one persistent Blockbench Asset Model per project folder**. It is not MCP runtime input, not a general cache, and not a transcript store.

## Layout

```text
workspace/
├─ active/
│  └─ <asset>/
│     ├─ README.md
│     ├─ <asset>.bbmodel          # only after baseline/checkpoint save
│     ├─ references/
│     │  └─ approved-reference.png
│     ├─ 3d-assisted/             # only when strategy = 3D_ASSISTED
│     │  ├─ state.json
│     │  ├─ shape.glb
│     │  └─ primitive-decomposition.json
│     ├─ assets/
│     ├─ exports/
│     └─ .cache/
└─ saved/
   └─ <asset>/
```

A completed project remains under `active/` until the user explicitly requests moving it to `saved/`.

## New Model Workspace Order

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

Workspace creation does not authorize modelling.

## Active Project Contract

Each active project has one compact README owning current asset continuity:

```text
Asset / Goal
Approved Reference
Requested Dimensions
Geometry Strategy: UNSPECIFIED | DIRECT | 3D_ASSISTED
Animation Required: YES | NO | UNSPECIFIED
Current Stage + stage states
UV Layout gate
Current model file
Material handoff constraints (scale/front_direction/pose override when material)
Current next step — one concrete step
Known blocker(s), if any
Current handoff state — only when phase reload/resume is pending
```

`Geometry Strategy` is a user decision. `UNSPECIFIED` blocks Geometry authoring; Codex must not infer/default it.

## Current Stage State

```text
Current Stage:
  INTAKE | GEOMETRY | TEXTURING | ANIMATION | FINALIZATION | COMPLETE

Geometry:
  NOT_STARTED | IN_PROGRESS | READY_FOR_USER_REVIEW | APPROVED | INVALIDATED | BLOCKED

UV Layout:
  NOT_STARTED | IN_PROGRESS | PASS | INVALIDATED | BLOCKED

Texturing:
  NOT_STARTED | IN_PROGRESS | READY_FOR_USER_REVIEW | APPROVED | INVALIDATED | BLOCKED

Animation:
  NOT_REQUIRED | NOT_STARTED | IN_PROGRESS | READY_FOR_USER_REVIEW | APPROVED | INVALIDATED | BLOCKED
```

`UV Layout` is a **Geometry-owned technical gate**, not a separate user stage. Fresh/rebuilt production UV Layout starts only after user Geometry `APPROVED`; Texturing cannot enter `IN_PROGRESS` until `UV Layout: PASS`.

`INVALIDATED` is only for a previously accepted stage/gate whose assumptions became materially invalid because an upstream accepted state changed. `INTERNAL_VERIFY` is transient and is not persisted.

`front_direction` means the canonical object front used by `capture_model_views`: `+z` or `-z`. Record it once when material and reuse it. Requested dimensions stay in Minecraft blocks plus resolved Blockbench units when resume-critical (`1 block = 16 Blockbench units`).

When phase reload/resume is pending, keep only:

```text
current_phase: <geometry|texturing|animation>
completed_gate(s): <latest verified/approved gates only>
target_phase: <next phase>
resume_target: <current model/project + immediate target identifiers>
blocker: <none|specific blocker>
```

Do not turn README into a decision log, per-Cube plan, UUID registry, or tool transcript.

Prefer **one current editable `.bbmodel`** per project. Git history owns older iterations.

## Meaningful Persistence

Persist/checkpoint the current `.bbmodel` and update README at meaningful approval/resume/park/completion boundaries:

```text
Geometry APPROVED  → checkpoint save + UV Layout remains/returns NOT_STARTED unless preserved valid UV is explicitly accepted
UV Layout PASS     → checkpoint/update README before Texture Styling
Texturing APPROVED → checkpoint save
Animation APPROVED → checkpoint save
Finalization PASS  → final save + COMPLETE
```

Do **not** save/checkpoint after every MCP mutation or capture. Mutation count alone is not a checkpoint trigger. Before first Geometry approval, a new model has no authoritative `.bbmodel` checkpoint in workspace.

## Existing `.bbmodel` Intake

For an untracked user-supplied `.bbmodel`:

```text
create Active Workspace
→ store supplied file as the single current editable baseline
→ persist baseline before first mutation
→ inspect model
→ determine affected stage(s)
```

Do not create `original`, `backup`, `v2`, `final-final`, or duplicate historical model files. Git history owns prior baselines/checkpoints.

Tracked models reuse stored Geometry Strategy. An untracked external model may keep strategy unknown if update does not touch Geometry; Geometry authoring with unknown strategy must ask the user first.

## Reference Persistence

Persist the actual approved modelling reference under `references/`. An image explicitly handed to Codex for modelling is approved unless marked draft/not ready. Stored path/prose is continuity only; fidelity judgement still requires the actual image visible in active multimodal context.

If Approved Reference changes:

- Geometry Strategy stays unchanged;
- replace canonical approved reference;
- remove derived current 3D-Assisted GLB/decomposition/state tied to old reference;
- Git history owns old versions.

## 3D-Assisted Persistence

Canonical persistent artifacts:

```text
3d-assisted/state.json
3d-assisted/shape.glb
3d-assisted/primitive-decomposition.json
```

`state.json` is machine-readable external-pipeline state only: schema version, current reference hash, extraction/Shape Reconstruction/decomposition gate state, artifact hashes, last valid external resume point.

It must not duplicate stage approvals, Blockbench hierarchy, UUID registry, conversation, retries, or screenshot history.

`shape.glb` becomes canonical only after Shape GLB Gate PASS; decomposition only after Primitive Decomposition Gate PASS. There is no separate canonical Cuboid Scaffold file.

Temporary crops/contact sheets/intermediate meshes/logs/previews/internal captures belong in `.cache/`.

## Strategy Changes

Only the user changes strategy.

Before current Geometry approval:

```text
keep Active Workspace/intake/reference
→ discard all unapproved Geometry
→ remove 3D-Assisted canonical state/artifacts when leaving 3D_ASSISTED
→ recreate Blockbench project from clean state
→ start Geometry with new strategy
```

After Geometry approval, keep approved production Geometry and persist the new strategy for future Geometry work. A material Geometry change that changes mapped surfaces invalidates `UV Layout` and only the materially dependent downstream Texture state.

## Downstream Invalidation

```text
unaffected downstream stage/gate → keep accepted state
materially affected stage/gate   → INVALIDATED → repair → required approval/PASS again
```

Geometry changes invalidate UV only when mapping assumptions change. UV changes invalidate only affected Texture assumptions. Do not reset all stages automatically.

## Codex Resume Rule

```text
user names/continues asset
→ workspace/active/<asset>/README.md
→ current .bbmodel only if it exists
→ only files needed for next decision
→ 3d-assisted/state.json only when that external pipeline is pending
→ current-worktree BlockIT asset router
→ current-worktree active specialist
→ verify persisted prerequisite gate before mutation
```

The router + active specialist loading contract comes from root `AGENTS.md`; remembered Skill content is not sufficient. If stored target phase and live MCP phase disagree, reconcile through Gateway rather than broad-searching tools. Do not scan every active project when asset is known.

## Reference Generator Boundary

Reference Generator output remains image-only. Workspace persistence does not make it produce manifests, geometry blueprints, ZIPs, coordinate sheets, or sidecars.

## What Not To Store

Do not retain tool-call transcripts, screenshot histories, speculative geometry plans, persistent per-element UUID registries, duplicate historical `.bbmodel` files, failed/stale canonical 3D-Assisted artifacts, model weights, external environments, or generic provider caches.

Use `.cache/` for transient working output. Git history owns old revisions.

## Saved Projects

`saved/` means the user explicitly archived/parked the asset. Do not move there automatically after final save. Move back to `active/` before later authoring resumes.
