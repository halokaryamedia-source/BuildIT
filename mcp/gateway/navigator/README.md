# BlockIT Navigator

Machine-first context/navigation layer for the existing four-tool BlockIT Gateway.

## Contract

Navigator is a context projection layer, not a second MCP, workflow engine, database, daemon, or user-facing authoring UI.

```text
canonical owners + live Gateway/Runtime state
→ deterministic selection
→ compact L0 navigation snapshot
→ exact content-addressed context handles
→ context-aware capability metadata
→ delta-only continuation after invocation
```

The Gateway surface remains exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

`status` carries the compact Navigator bootstrap. Search/describe add ownership/navigation metadata only when those fallback calls are already needed. `invoke_capability` preserves the existing Runtime result and adds `navigation_delta`; normal successful operations do not require a status reread.

## Accuracy

Canonical Skill/Prompt contents are not copied into Navigator. `registry.ts` stores only logical IDs, canonical paths, and SHA-256 identities. Regression tests fail when those owners change without refreshing their handles.

## Scope

V1 resolves live Runtime health, project binding, authoring phase/owner, blockers, required context handles, capability ownership and compact continuation intent. Workspace-stage/gate projection and measured usage benchmarking remain follow-up work; do not duplicate README/workspace state to implement them.
