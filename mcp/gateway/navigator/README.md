# BlockIT Navigator

Machine-first context/navigation layer for the existing four-tool BlockIT Gateway.

## Contract

Navigator is a context projection layer, not a second MCP, workflow engine, database, daemon, or user-facing authoring UI.

```text
canonical owners + live Gateway/Runtime state + current workspace summary
→ deterministic selection
→ compact navigation packet
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

## Context Projection

Navigator follows `SELECT, DON'T SUMMARIZE`.

Canonical Skill/Prompt contents are not copied into Navigator. `registry.ts` stores logical IDs, canonical paths, and SHA-256 identities. Regression tests fail when those owners change without refreshing their handles.

A caller may return exact `known_context_ids` from the current task to `status`; matching hashes are omitted from the next delivery. This suppresses retransmission without weakening authority. A changed canonical file gets a new handle and therefore cannot be mistaken for cached context.

## Task Context

Each navigation packet includes a deterministic `task_context_id` derived from the bound project, authoring phase, live Runtime identity, and current workspace fingerprint when available. The ID changes when one of those material context owners changes.

## Workspace Projection

The Active Workspace README remains the authority. Navigator never creates a second asset-state file.

When the current saved project path is available, or when `status(workspace_path=...)` supplies a one-time workspace hint, Navigator reads only the canonical summary fields:

```text
asset
Current Stage
Geometry
UV Layout
Texturing
Animation
Current next step
Known blocker(s)
```

The parsed projection is cached by file size + modification time and content-addressed with SHA-256. The workspace text itself is not retransmitted to Codex.

## Progressive Delivery

Normal task flow is:

```text
status → compact full navigation packet
→ load only missing required context handles
→ known capability → invoke directly
→ navigation_delta
→ continue without status reread
```

Call `status` again only when `navigation_delta.requires_status_refresh=true`, project/workspace identity changed, Runtime state is stale, or the caller genuinely lost orientation.

`describe_capability` remains the exact L2 schema projection path: use a known branch discriminator to receive only that branch's exact schema instead of unrelated fields.

## Evidence / Efficiency

Static tests guard that a representative full packet remains bounded and that cached context is omitted. This is a footprint guard, not a claim about whole-session model tokens. Authoring-efficiency proof still requires comparing cost to an accepted result under equivalent quality.
