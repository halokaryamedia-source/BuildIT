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
```

Keep it factual and short. Do not turn the project README into a development log, decision archive, per-Cube plan, checkpoint history, or tool-call transcript.

Prefer **one current editable `.bbmodel`** per project. Git history owns older iterations; avoid `model_v2_final_final.bbmodel` style duplication.

## Codex Resume Rule

For a named persistent asset:

```text
user names/continues project
→ workspace/active/<project>/README.md
→ current .bbmodel + only the files needed for the next decision
→ BlockIT asset router + active specialist
```

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
- duplicate historical `.bbmodel` copies;
- generated cache files;
- generic sample/fixture policy.

Use `.cache/` for transient visual/debug output. Git history owns old revisions and discarded experiments.

## Saved Projects

`workspace/saved/` contains packages that are no longer actively edited. Do not work directly in a saved package; move it back to `workspace/active/` when work genuinely resumes.
