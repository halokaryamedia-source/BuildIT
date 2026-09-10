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

A caller may return exact `known_context_ids` from the current task to `status`; matching hashes are omitted from the next delivery. When the same context family now has a different content hash, Navigator returns that old handle under `invalidated_ids` and delivers the current handle. Unrelated historical context is ignored rather than creating invalidation noise.

## Task Context

Each navigation packet includes a deterministic `task_context_id`. Asset authoring derives it from project affinity, authoring phase, live Runtime identity, and current workspace fingerprint. MCP development additionally includes the resolved development domain and concrete task intent, so materially different source tasks cannot accidentally share one context identity.

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

## Capability Routing

Capability search results carry deterministic `source_owner` metadata:

```text
source
specialist
test_owner
```

This lets Codex move from a known runtime capability to its implementation owner without scanning the repository. Exact high-value capabilities have direct owners; unknown capabilities fall back to the semantic owner family. This metadata is navigation only and does not duplicate Tool schemas or alter Runtime execution.

## Development Intent Resolver

Source-development navigation uses the existing `status` tool rather than adding a fifth Gateway tool:

```text
status(
  task_mode = MCP_DEVELOPMENT,
  task_intent = "animation keyframe terlalu kaku"
)
```

The resolver is deliberately deterministic and bounded. It performs lexical routing across current owner families such as Geometry, Texturing, Animation, Particle, Gateway, Project Affinity, Build/Sync, and Runtime. It returns:

```text
task_class
domain
confidence
matched_terms
source_owners
required_context_paths
avoid_context_classes
```

`source_owners` are exact current repository paths plus known regression owners. `required_context_paths` names only the minimum source-development instruction stack plus the matching specialist when one is known. Asset workspace history and unrelated foundation/runtime schema context are explicitly excluded from the normal development projection.

If two domains tie, Navigator returns `AMBIGUOUS` + `UNRESOLVED` instead of inventing one owner. Unknown wording also stays `UNRESOLVED`; broad repository search is then a fallback, not the default path.

In `MCP_DEVELOPMENT` mode Navigator does not parse the active asset workspace and does not retransmit asset-authoring Skill handles. This prevents source work from paying authoring-context overhead.

## Progressive Delivery

Normal asset flow is:

```text
status → compact full navigation packet
→ load only missing required context handles
→ known capability → invoke directly
→ navigation_delta
→ continue without status reread
```

Normal source-development bootstrap is:

```text
status(task_mode=MCP_DEVELOPMENT, task_intent=<concrete problem>)
→ exact bounded source/specialist/test owners
→ inspect minimum owner set
→ implement + targeted regression
```

Call `status` again only when `navigation_delta.requires_status_refresh=true`, project/workspace identity changed, Runtime state is stale, the development task materially changed, or the caller genuinely lost orientation.

`describe_capability` remains the exact L2 schema projection path: use a known branch discriminator to receive only that branch's exact schema instead of unrelated fields.

## Evidence / Efficiency

Static tests guard that a representative full packet remains bounded, cached context is omitted, stale context is invalidated, source routing stays deterministic, and ambiguous development wording fails closed. `measure:navigator` measures payload footprint only; it is not a claim about whole-session model tokens. Authoring-efficiency proof still requires comparing cost to an accepted result under equivalent quality.
