# Active Asset Projects

Each directory under `workspace/active/` is one currently editable, persistent asset project.

Keep unrelated assets in separate project folders. When a project is already named, Codex should open **that project only** rather than scanning the whole workspace.

A normal active package may contain:

```text
README.md          compact current continuity
<project>.bbmodel  one current editable model
references/        intentional retained visual references
assets/            authored textures/supporting files when needed
exports/           deliberate deliverables when needed
.cache/            transient screenshots/previews; ignored
```

The project `README.md` should contain only the current goal, current model, material reference/constraints, one next step, and current blockers. Git history owns old attempts.

When the project is completed or intentionally parked, move the package to `workspace/saved/`.
