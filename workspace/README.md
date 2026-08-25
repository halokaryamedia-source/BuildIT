# Asset Workspace

`workspace/` is repository-backed storage for **persistent Blockbench asset work** that must remain understandable across Codex sessions. It is not MCP runtime input, not a general cache, and not product policy.

## Layout

```text
workspace/
├─ active/
│  └─ <project>/
│     ├─ README.md
│     ├─ <project>.bbmodel
│     ├─ references/   optional approved/source visual assets worth retaining
│     ├─ assets/       optional authored textures or supporting project files
│     ├─ exports/      optional deliberate deliverables
│     └─ .cache/       transient screenshots/previews; ignored
└─ saved/
   └─ <project>/       completed or intentionally parked packages
```

Only create a project package when the work is meant to persist. One-off/transient experiments do not need a workspace package.

## Active Project Contract

Each active project has **one compact `README.md`** that owns only current asset continuity:

```text
Goal
Current model file
Approved reference(s), when intentionally retained
Material handoff constraints
Current next step — one concrete step
Known blocker(s), if any
Current handoff state — only when a phase reload/resume is pending
```

When a phase reload/resume is pending, `Current handoff state` is compact and resume-critical only:

```text
current_phase: <geometry|texturing|animation>
completed_gate(s): <latest verified gates only>
target_phase: <next phase>
resume_target: <current model/project + immediate target identifiers>
blocker: <none|specific blocker>
```

Include an exact UUID only when the immediate next mutation requires it. Do not turn this into a per-element UUID registry, tool-call transcript, or checkpoint history.

Keep the README factual and short. Do not turn it into a development log, decision archive, per-Cube plan, checkpoint history, UUID registry, or tool-call transcript.

Prefer **one current editable `.bbmodel`** per project. Git history owns older iterations; avoid `model_v2_final_final.bbmodel` style duplication.

## Meaningful Persistence

Persist the current `.bbmodel` and update the project README when **resume-critical state materially changes** or at a meaningful handoff, park, or completion boundary.

Do **not** save/checkpoint after every MCP mutation or capture, and do not update the README merely because a number of calls or mutations occurred. **Mutation count alone is not a checkpoint trigger.** During one uninterrupted authoring session, reuse fresh live/returned state instead of converting every intermediate state into repository memory.

A README update should leave one useful current next step and real blockers, not a transcript of how the session arrived there.

## Codex Resume Rule

For a named persistent asset:

```text
user names/continues project
→ workspace/active/<project>/README.md
→ current .bbmodel + only the files needed for the next decision
→ read Current handoff state when present
→ BlockIT asset router
→ ACTIVE PHASE from MCP initialize
→ active specialist only
```

If the stored target phase and MCP `ACTIVE PHASE` disagree, do not guess or broad-search tools. Reconcile the phase setting/reload first.

Do **not** scan every project under `workspace/active/` when the project is already known. Stored metadata is continuity, not visual authority.

A reference image stored under `references/` is only a file/provenance source until the **actual image is visible in the active modelling context**. A path, filename, README, or manifest cannot substitute for visual evidence.

## Reference Generator Boundary

The Reference Generator remains **image-only output**. Workspace persistence is downstream/local project storage; it does not make the generator produce manifests, geometry blueprints, ZIPs, coordinate sheets, or sidecar files.

An approved reference may be intentionally saved into the active project after approval, but that is a workspace action, not Reference Generator output.

## What Not To Store

Do not retain as project memory:

- screenshot-per-mutation histories;
- temporary model-view captures;
- MCP/tool logs;
- speculative geometry plans;
- persistent per-element UUID registries;
- duplicate historical `.bbmodel` copies;
- generated cache files;
- generic sample/fixture policy.

Use `.cache/` for transient visual/debug output. Git history owns old revisions and discarded experiments.

## Saved Projects

`workspace/saved/` contains packages that are no longer actively edited. Do not work directly in a saved package; move it back to `workspace/active/` when work genuinely resumes.
