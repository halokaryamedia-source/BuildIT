# Local Production Workspace

`workspace/` contains mutable asset production data and is not a second source-code tree.

```text
active-session.json
sessions/<asset>/
  state.json
  references/
  checkpoints/
  evidence/
  reports/
  final/
cache/
archive/
```

`state.json` is the runtime authority. Session output is ignored by Git by default. Historical sessions removed during the root cleanup remain available through Git history.
