# Local Production Workspace

`workspace/` contains mutable asset production data and is not a source-code tree.

```text
active-session.example.json
active-session.json              # local only, ignored by Git
sessions/<asset>/                 # local only, ignored by Git
  state.json
  references/
  checkpoints/
  evidence/
  reports/
  final/
cache/                            # local only
archive/                          # local only except this README
```

Create `active-session.json` from the example when selecting an asset. `state.json` remains the runtime authority; the active-session file is only a pointer.

Do not commit real session output, checkpoints, previews, or final binaries. Git history retains removed legacy examples.
